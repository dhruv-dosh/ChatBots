const { Client } = require('pg');
require('dotenv').config();

async function init() {
  const commonConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  };

  const client = new Client({ ...commonConfig, database: 'postgres' });

  try {
    await client.connect();
    console.log('Connected to postgres database.');

    // Check if database exists
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = 'rag_chatbot'`);
    if (res.rowCount === 0) {
      console.log('Creating database rag_chatbot...');
      await client.query(`CREATE DATABASE rag_chatbot`);
    } else {
      console.log('Database rag_chatbot already exists.');
    }
    await client.end();

    // Connect to rag_chatbot to create schema
    const appClient = new Client({ ...commonConfig, database: 'rag_chatbot' });
    await appClient.connect();
    console.log('Connected to rag_chatbot database.');

    const schema = `
    -- Removed CREATE EXTENSION IF NOT EXISTS vector;

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      file_path TEXT NOT NULL,
      uploaded_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS chatbots (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS document_chunks (
      id SERIAL PRIMARY KEY,
      document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
      chunk_text TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      embedding REAL[], -- Fallback to REAL array
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      chatbot_id INTEGER REFERENCES chatbots(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      response TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    `;

    await appClient.query(schema);
    console.log('Schema created successfully.');
    await appClient.end();
    process.exit(0);
  } catch (err) {
    console.error('Error during initialization:', err);
    process.exit(1);
  }
}

init();
