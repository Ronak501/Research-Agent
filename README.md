# Research Chatbot - AI-Powered Research Assistant

A modern, full-stack research assistant application that combines academic rigor with Swiss design precision. Built with React frontend, FastAPI backend, and MongoDB database.

## 🏗️ Project Architecture

```
research-chatbot/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
│   └── public/             # Static assets
├── backend/                 # FastAPI server
│   ├── server.py           # Main application server
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── tests/                  # Test files
└── docker-compose.yml     # Docker orchestration
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Prerequisites**
   - Docker and Docker Compose installed
   - Git for cloning the repository

2. **Clone and Start**
   ```bash
   git clone <repository-url>
   cd research-chatbot
   docker-compose up --build
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - MongoDB: localhost:27017

### Option 2: Manual Setup

#### Backend Setup
1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file with:
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=test_database
   CORS_ORIGINS=http://localhost:3000
   EMERGENT_LLM_KEY=your_api_key_here
   ```

5. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   
   # Or install MongoDB locally
   ```

6. **Run the backend server**
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8000 --reload
   ```

#### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file with:
   REACT_APP_BACKEND_URL=http://localhost:8000
   WDS_SOCKET_PORT=443
   ENABLE_HEALTH_CHECK=false
   ```

4. **Start the development server**
   ```bash
   yarn start
   # or npm start
   ```

## 🔄 Application Workflow

### 1. User Interface Flow

```
Landing Page (ChatPage)
    ↓
User creates/selects conversation
    ↓
User types research question
    ↓
Message sent to backend API
    ↓
AI processes and responds
    ↓
Results displayed in chat + research canvas
```

### 2. Technical Data Flow

#### Frontend → Backend Communication
```
React Component (ChatPage)
    ↓ axios.post()
FastAPI Endpoint (/api/chat/message)
    ↓
LLM Integration (Emergent AI)
    ↓
MongoDB Storage
    ↓
Response back to Frontend
```

#### Key API Endpoints
- `POST /api/chat/conversations` - Create new conversation
- `GET /api/chat/conversations` - List all conversations
- `GET /api/chat/conversations/{id}` - Get conversation messages
- `POST /api/chat/message` - Send message and get AI response
- `DELETE /api/chat/conversations/{id}` - Delete conversation

### 3. Component Architecture

#### Frontend Components
- **ChatPage**: Main application container
- **ChatSidebar**: Conversation management
- **ChatMessages**: Message display and history
- **ChatInput**: User input interface
- **ResearchCanvas**: Research results visualization
- **UI Components**: Reusable design system components

#### Backend Structure
- **FastAPI App**: Main application server
- **MongoDB Integration**: Data persistence
- **LLM Integration**: AI response generation
- **CORS Middleware**: Cross-origin request handling

## 🎨 Design System

The application follows "E1: The Anti-AI Designer" principles:

### Visual Identity
- **Typography**: Fraunces (headings), Manrope (body), JetBrains Mono (code)
- **Colors**: Paper (#F9F9F7), Ink (#1A1A1A), Klein Blue (#002FA7), Highlighter (#FDFF00)
- **Layout**: Split-brain design (35% chat, 65% research canvas)

### Key Design Principles
- Academic rigor meets Swiss design precision
- Content-first approach
- Generous spacing and negative space
- Sharp contrast and clarity
- Micro-animations for interactions

## 🔧 Development Workflow

### 1. Setting Up Development Environment
```bash
# Clone repository
git clone <repository-url>
cd research-chatbot

# Start with Docker (easiest)
docker-compose up --build

# Or set up manually (see Manual Setup above)
```

### 2. Making Changes

#### Frontend Development
```bash
cd frontend
yarn start  # Hot reload enabled
```

#### Backend Development
```bash
cd backend
uvicorn server:app --reload  # Auto-restart on changes
```

### 3. Testing
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
yarn test
```

### 4. Building for Production
```bash
# Frontend build
cd frontend
yarn build

# Backend is production-ready as-is
```

## 📊 Database Schema

### Collections

#### Conversations
```javascript
{
  id: "uuid",
  title: "string",
  created_at: "datetime",
  updated_at: "datetime"
}
```

#### Messages
```javascript
{
  id: "uuid",
  conversation_id: "uuid",
  role: "user|assistant",
  content: "string",
  timestamp: "datetime"
}
```

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=http://localhost:3000
EMERGENT_LLM_KEY=your_api_key_here
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8000
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

## 🐳 Docker Configuration

The project includes complete Docker setup:

- **MongoDB**: Database service
- **Backend**: FastAPI application
- **Frontend**: React development server
- **Networking**: Internal Docker network for service communication
- **Volumes**: Persistent data storage and hot reload support

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using the ports
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :8000
   netstat -tulpn | grep :27017
   ```

2. **MongoDB connection issues**
   ```bash
   # Check MongoDB is running
   docker ps | grep mongo
   # Or check local MongoDB
   systemctl status mongod
   ```

3. **API key issues**
   - Ensure `EMERGENT_LLM_KEY` is set in backend/.env
   - Verify the API key is valid

4. **CORS issues**
   - Check `CORS_ORIGINS` in backend/.env
   - Ensure frontend URL matches CORS settings

### Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload in development
2. **Logs**: Check Docker logs with `docker-compose logs [service-name]`
3. **Database**: Use MongoDB Compass to inspect database contents
4. **API Testing**: Use the FastAPI docs at http://localhost:8000/docs

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🔄 Deployment

### Production Deployment
1. Build frontend: `yarn build`
2. Set production environment variables
3. Use production MongoDB instance
4. Deploy backend with production ASGI server
5. Serve frontend build files

### Environment-Specific Configurations
- **Development**: Hot reload, debug logging
- **Staging**: Production-like setup with test data
- **Production**: Optimized builds, production database, monitoring

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the logs for error messages
3. Ensure all environment variables are set correctly
4. Verify all services are running and accessible