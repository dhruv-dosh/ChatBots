const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const { pool } = require('../services/db');
const { chunkText } = require('../services/documentProcessor');
const { generateEmbedding } = require('../services/llm');
const auth = require('../middleware/auth');

const upload = multer({ dest: 'uploads/' });

// Upload and process document
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    console.log('Upload request received');
    if (!req.file) {
        console.log('No file in request');
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, path: filePath, mimetype } = req.file;
    console.log(`Processing file: ${originalname}, type: ${mimetype}`);
    const userId = req.user.id;

    try {
        let text = '';
        if (mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            text = data.text;
        } else if (mimetype === 'text/plain' || originalname.endsWith('.txt')) {
            text = fs.readFileSync(filePath, 'utf8');
        } else {
            console.log(`Unsupported type: ${mimetype}`);
            return res.status(400).json({ error: 'Unsupported file type' });
        }

        console.log(`Extracted text length: ${text.length}`);

        // Save document to DB
        const docResult = await pool.query(
            'INSERT INTO documents (user_id, name, file_path) VALUES ($1, $2, $3) RETURNING id',
            [userId, originalname, filePath]
        );
        const documentId = docResult.rows[0].id;
        console.log(`Document saved with ID: ${documentId}`);

        // Process chunks and embeddings in a single batch
        const chunks = chunkText(text);
        console.log(`Processing ${chunks.length} chunks in a single batch`);

        if (chunks.length > 0) {
            console.log('Requesting embeddings from OpenRouter...');
            const embeddings = await generateEmbedding(chunks);
            console.log('Embeddings received, inserting to DB...');

            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                const embedding = embeddings[i];

                await pool.query(
                    'INSERT INTO document_chunks (document_id, chunk_text, chunk_index, embedding) VALUES ($1, $2, $3, $4)',
                    [documentId, chunk, i, `{${embedding.join(',')}}`]
                );
            }
        }

        console.log('All chunks processed successfully');
        res.json({ message: 'Document processed successfully', documentId });
    } catch (err) {
        console.error('Error in /upload:', err);
        res.status(500).json({ error: 'Error processing document', details: err.message });
    }
});

// List documents
router.get('/', auth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM documents WHERE user_id = $1', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
