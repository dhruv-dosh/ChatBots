const axios = require('axios');
require('dotenv').config();

async function testChatbotCreation() {
    const API_URL = 'http://localhost:3000/api';

    try {
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'testuser@example.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Logged in successfully.');

        console.log('Fetching documents...');
        const docsRes = await axios.get(`${API_URL}/documents`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (docsRes.data.length === 0) {
            console.log('No documents found, cannot create chatbot.');
            return;
        }

        const docId = docsRes.data[0].id;
        console.log(`Creating chatbot for document ID: ${docId}`);

        const chatbotRes = await axios.post(`${API_URL}/chatbots`, {
            name: 'API Test Bot',
            document_id: docId
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Chatbot created successfully:', chatbotRes.data);
    } catch (err) {
        console.error('Error during test:', err.response?.data || err.message);
    }
}

testChatbotCreation();
