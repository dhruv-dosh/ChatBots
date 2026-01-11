const fs = require('fs');
const { pool } = require('./services/db');
const { chunkText } = require('./services/documentProcessor');
const { generateEmbedding } = require('./services/llm');
const pdf = require('pdf-parse');

async function testProcessing() {
    const originalname = 'sample.pdf';
    const filePath = 'uploads/51be57001abcfec8a79c17903e421887'; // Use a real uploaded file
    const userId = 1;

    try {
        console.log('Reading PDF file...');
        const dataBuffer = fs.readFileSync(filePath);
        console.log('File read, buffer size:', dataBuffer.length);

        console.log('Calling pdf-parse...');
        const data = await pdf(dataBuffer);
        console.log('PDF parsed successfully!');
        const text = data.text;
        console.log('Extracted text length:', text.length);

        console.log('Saving document to DB...');
        const docResult = await pool.query(
            'INSERT INTO documents (user_id, name, file_path) VALUES ($1, $2, $3) RETURNING id',
            [userId, originalname, filePath]
        );
        const documentId = docResult.rows[0].id;
        console.log('Document ID saved:', documentId);

        console.log('Chunking...');
        const chunks = chunkText(text);
        console.log('Chunks count:', chunks.length);

        if (chunks.length === 0) {
            console.log('No text extracted from PDF.');
            return;
        }

        console.log('Generating embeddings (Batch)...');
        const embeddings = await generateEmbedding(chunks);
        console.log('Embeddings generated.');

        console.log('Inserting chunks...');
        for (let i = 0; i < chunks.length; i++) {
            await pool.query(
                'INSERT INTO document_chunks (document_id, chunk_text, chunk_index, embedding) VALUES ($1, $2, $3, $4)',
                [documentId, chunks[i], i, `{${embeddings[i].join(',')}}`]
            );
        }
        console.log('SUCCESS: All chunks inserted.');
    } catch (err) {
        console.error('ERROR during processing:', err.message);
        if (err.response) console.error('Data:', err.response.data);
    } finally {
        process.exit();
    }
}

testProcessing();
