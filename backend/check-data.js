const { Client } = require('pg');
require('dotenv').config();

async function checkData() {
    const client = new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: 'rag_chatbot'
    });

    try {
        await client.connect();
        const docs = await client.query('SELECT * FROM documents');
        console.log('Documents:', docs.rows.map(d => ({ id: d.id, name: d.name })));

        const chunks = await client.query('SELECT document_id, count(*) FROM document_chunks GROUP BY document_id');
        console.log('Chunks grouped by document:', chunks.rows);

        await client.end();
    } catch (err) {
        console.error(err);
    }
}

checkData();
