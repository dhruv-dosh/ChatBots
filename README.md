# RAG Chatbot Platform

A full-stack application that enables users to create intelligent chatbots powered by their own documents using Retrieval-Augmented Generation (RAG) technology. The platform allows users to upload documents (PDF, TXT), create custom chatbots, and have context-aware conversations based on the content of their uploaded documents.

## 🚀 Features

- **User Authentication**: Secure registration and login system with JWT-based authentication
- **Document Upload & Processing**: Support for PDF and TXT file uploads with automatic text extraction and chunking
- **Vector Embeddings**: Automatic generation of embeddings for document chunks using AI models
- **Semantic Search**: Cosine similarity-based search to find relevant document context
- **AI-Powered Chatbots**: Create multiple chatbots, each linked to specific documents
- **Context-Aware Responses**: Chat with AI that references your uploaded documents
- **Chat History**: Persistent conversation history for each chatbot
- **Role-Based Access**: Admin and user roles for managing chatbots and documents
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## 📁 Project Structure

```
ChatBots/
├── backend/                 # Node.js + Express API server
│   ├── middleware/         # Authentication middleware
│   ├── routes/             # API route handlers
│   │   ├── auth.js        # Authentication endpoints
│   │   ├── chatbots.js    # Chatbot management
│   │   ├── documents.js   # Document upload & processing
│   │   └── chat.js        # Chat interface & RAG logic
│   ├── services/          # Business logic services
│   │   ├── db.js          # PostgreSQL connection
│   │   ├── llm.js         # AI model integration
│   │   └── processor.js   # Document processing
│   ├── uploads/           # Uploaded document storage
│   ├── server.js          # Main server entry point
│   └── init-db.js         # Database initialization script
│
└── frontend/              # React + TypeScript frontend
    ├── src/
    │   ├── pages/         # Application pages
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── UserDashboard.tsx
    │   │   ├── AdminDashboard.tsx
    │   │   └── ChatInterface.tsx
    │   ├── services/      # API communication
    │   ├── App.tsx        # Main app component
    │   └── main.tsx       # Application entry point
    └── index.html
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **PostgreSQL** - Relational database with pgvector extension
- **pgvector** - Vector similarity search
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **Axios** - HTTP client for AI API calls

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client for API calls
- **jwt-decode** - JWT token decoding

### Database
- **PostgreSQL** with pgvector extension for vector similarity search
- Tables:
  - `users` - User accounts
  - `documents` - Uploaded documents metadata
  - `document_chunks` - Text chunks with embeddings
  - `chatbots` - Chatbot configurations
  - `chat_messages` - Conversation history

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **pgvector** extension installed in PostgreSQL
- API key for an AI model provider (e.g., OpenRouter, OpenAI)

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ChatBots
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/chatbot_db
JWT_SECRET=your-secret-key-here
OPENROUTER_API_KEY=your-api-key-here
```

Initialize the database:

```bash
node init-db.js
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Start the Backend Server

```bash
cd backend
npm start
```

The backend API will run on `http://localhost:3000`

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (default Vite port)

## 📖 Usage

1. **Register an Account**: Create a new user account via the registration page
2. **Login**: Authenticate using your credentials
3. **Upload Documents**: Upload PDF or TXT files containing your knowledge base
4. **Create Chatbot**: Link a chatbot to your uploaded document
5. **Start Chatting**: Ask questions and get AI-powered responses based on your documents

## 🔍 How RAG Works

1. **Document Processing**: 
   - Documents are uploaded and split into manageable chunks
   - Each chunk is converted into a vector embedding using an AI model

2. **Query Processing**:
   - User questions are converted into embeddings
   - The system performs cosine similarity search to find relevant chunks

3. **Response Generation**:
   - Top matching chunks are used as context
   - The AI model generates a response based on the context and the user's question
   - The response cites relevant parts of the documents

## 🧪 Testing

The project includes several test scripts in the backend:

- `test-chatbot.js` - Test chatbot creation
- `test-embedding.js` - Test embedding generation
- `test-processor.js` - Test document processing
- `test-upload.js` - Test file upload functionality
- `check-data.js` - Verify database data
- `check-tables.js` - Verify database schema
- `list-chatbots.js` - List all chatbots
- `list-models.js` - List available AI models

Run tests with:
```bash
node <test-file-name>.js
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get user's documents
- `DELETE /api/documents/:id` - Delete document

### Chatbots
- `POST /api/chatbots` - Create new chatbot
- `GET /api/chatbots` - Get user's chatbots
- `DELETE /api/chatbots/:id` - Delete chatbot

### Chat
- `POST /api/chat/:chatbotId` - Send message to chatbot
- `GET /api/chat/:chatbotId/history` - Get chat history

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

ISC

## 👤 Author

Your Name

## 🙏 Acknowledgements

- OpenRouter/OpenAI for AI model access
- pgvector for PostgreSQL vector similarity search
- The open-source community for the amazing tools and libraries

---

For questions or support, please open an issue on the GitHub repository.
