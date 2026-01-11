const { Pool } = require('pg');
require('dotenv').config();

console.log(`DB CONFIG: user=${process.env.DB_USER}, host=${process.env.DB_HOST}, database=${process.env.DB_NAME}, port=${process.env.DB_PORT}`);
const pool = new Pool({
    user: process.env.DB_USER || 'postgres', // Changed default to postgres
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'rag_chatbot',
    password: process.env.DB_PASSWORD || 'payas@2000',
    port: process.env.DB_PORT || 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};
