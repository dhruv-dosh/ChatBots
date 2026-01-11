const { Client } = require('pg');
require('dotenv').config();

async function checkTables() {
    const client = new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: 'rag_chatbot'
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('Tables in rag_chatbot:');
        console.log(res.rows.map(r => r.table_name));
        await client.end();
    } catch (err) {
        console.error('Error checking tables:', err.message);
    }
}

checkTables();
