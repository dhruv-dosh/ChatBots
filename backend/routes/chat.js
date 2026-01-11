const express = require('express');
const router = express.Router();
const { pool } = require('../services/db');
const { generateEmbedding, getChatResponse } = require('../services/llm');
const auth = require('../middleware/auth');

router.post('/:chatbotId', auth, async (req, res) => {
    const { chatbotId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    try {
        // 1. Get chatbot document
        const botResult = await pool.query('SELECT * FROM chatbots WHERE id = $1', [chatbotId]);
        if (botResult.rowCount === 0) return res.status(404).json({ error: 'Chatbot not found' });
        const documentId = botResult.rows[0].document_id;

        // 2. Generate embedding for query
        const queryEmbedding = await generateEmbedding(message);

        // 3. Manual similarity search (Fallback for missing pgvector)
        const allChunks = await pool.query(
            `SELECT chunk_text, embedding FROM document_chunks WHERE document_id = $1`,
            [documentId]
        );

        const cosineSimilarity = (a, b) => {
            if (!a || !b || a.length !== b.length) return 0;
            let dotProduct = 0;
            let normA = 0;
            let normB = 0;
            for (let i = 0; i < a.length; i++) {
                dotProduct += a[i] * b[i];
                normA += a[i] * a[i];
                normB += b[i] * b[i];
            }
            return normA && normB ? dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
        };

        const searchRes = allChunks.rows
            .map(row => ({
                chunk_text: row.chunk_text,
                similarity: cosineSimilarity(queryEmbedding, row.embedding)
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5);

        const context = searchRes.map(r => r.chunk_text).join('\n\n');

        // 4. Construct prompt
        const prompt = `You are a helpful assistant answering questions based on company documents.

Context from documents:
${context}

User Question: ${message}

Instructions:
- Answer based ONLY on the provided context
- If the answer is not in the context, say "I don't have enough information to answer that"
- Be concise and accurate
- Cite which part of the document you're referencing when possible

Answer:`;

        // 5. Get AI Response
        const aiResponse = await getChatResponse([
            { role: 'system', content: 'You are a helpful company assistant.' },
            { role: 'user', content: prompt }
        ]);

        // 6. Save message
        await pool.query(
            'INSERT INTO chat_messages (chatbot_id, user_id, message, response) VALUES ($1, $2, $3, $4)',
            [chatbotId, userId, message, aiResponse]
        );

        res.json({ response: aiResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error in chat process' });
    }
});

// Get chat history
router.get('/:chatbotId/history', auth, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM chat_messages WHERE chatbot_id = $1 AND user_id = $2 ORDER BY created_at ASC',
            [req.params.chatbotId, req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
