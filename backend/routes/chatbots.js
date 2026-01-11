const express = require('express');
const router = express.Router();
const { pool } = require('../services/db');
const auth = require('../middleware/auth');

// Create chatbot
router.post('/', auth, async (req, res) => {
    const { name, description } = req.body;
    const document_id = req.body.document_id || req.body.documentId;
    const userId = req.user.id;

    console.log(`Creating chatbot: ${name} for user ${userId}, document ${document_id}`);

    if (!name || !document_id) {
        console.log('Missing name or document_id');
        return res.status(400).json({ error: 'Name and document field are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO chatbots (user_id, document_id, name, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, document_id, name, description || '']
        );
        console.log('Chatbot created:', result.rows[0].id);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error creating chatbot:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// List chatbots
router.get('/', auth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM chatbots WHERE user_id = $1', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
