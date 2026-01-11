const axios = require('axios');
require('dotenv').config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const generateEmbedding = async (input) => {
    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/embeddings',
            {
                model: 'openai/text-embedding-3-small',
                input: input,
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (Array.isArray(input)) {
            return response.data.data.map(item => item.embedding);
        }
        return response.data.data[0].embedding;
    } catch (err) {
        if (err.response) {
            console.error('OpenRouter Error Status:', err.response.status);
            console.error('OpenRouter Error Data:', JSON.stringify(err.response.data, null, 2));
        } else {
            console.error('Error generating embedding:', err.message);
        }
        throw err;
    }
};

const getChatResponse = async (messages) => {
    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'openai/gpt-3.5-turbo',
                messages: messages,
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.choices[0].message.content;
    } catch (err) {
        console.error('Error getting chat response:', err.response?.data || err.message);
        throw err;
    }
};

module.exports = { generateEmbedding, getChatResponse };
