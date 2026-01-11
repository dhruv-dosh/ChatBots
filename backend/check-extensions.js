const { Client } = require('pg');
require('dotenv').config();

async function check() {
    const client = new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: 'postgres'
    });

    try {
        await client.connect();
        const res = await client.query('SELECT name FROM pg_available_extensions WHERE name = \'vector\'');
        if (res.rowCount > 0) {
            console.log('pgvector IS available for installation.');
        } else {
            console.log('pgvector is NOT available in pg_available_extensions.');
        }
        await client.end();
    } catch (err) {
        console.error(err);
    }
}
check();
