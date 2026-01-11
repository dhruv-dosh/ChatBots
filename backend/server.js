require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/chatbots', require('./routes/chatbots'));
app.use('/api/chat', require('./routes/chat'));

app.get('/', (req, res) => {
    res.send('RAG Chatbot API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
