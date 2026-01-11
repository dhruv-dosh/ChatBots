const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();

async function testUpload() {
    const token = 'YOUR_VALID_TOKEN_HERE'; // I need a token. I'll register a user first.

    try {
        // 1. Register a test user
        console.log('Registering test user...');
        const authRes = await axios.post('http://localhost:3000/api/auth/register', {
            email: `test_${Date.now()}@example.com`,
            password: 'password123'
        });
        const token = authRes.data.token;
        console.log('User registered, token obtained.');

        // 2. Upload a small text file
        console.log('Uploading test file...');
        const form = new FormData();
        form.append('file', Buffer.from('This is a test document content.'), 'test.txt');

        const uploadRes = await axios.post('http://localhost:3000/api/documents/upload', form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Upload success:', uploadRes.data);
    } catch (err) {
        console.error('Upload failed with status:', err.response?.status);
        console.error('Error details:', err.response?.data);
    }
}

testUpload();
