const { pool } = require('./services/db');
require('dotenv').config();

async function list() {
    try {
        const bots = await pool.query('SELECT * FROM chatbots');
        console.log('Chatbots:', bots.rows);

        const docs = await pool.query('SELECT id, name FROM documents');
        console.log('Documents:', docs.rows);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
list();
