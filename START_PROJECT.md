# 🚀 SymptomAI - Complete Startup Guide

This guide will help you start both the backend and frontend of the SymptomAI project.

## 📋 Prerequisites

- **Python 3.7+** (for backend)
- **Node.js 16+** (for frontend)
- **npm** or **yarn** (for frontend dependencies)

## 🔧 Quick Start (Recommended)

### 1. Start the Backend Server
```bash
cd backend
python api_server.py
```

The backend will be available at: `http://localhost:5000`

### 2. Start the Frontend (in a new terminal)
```bash
cd ai-web
npm install
npm run dev
```

The frontend will be available at: `http://localhost:3001` (or 3000 if available)

## 🔍 Verify Everything is Working

### Test Backend API
```bash
cd backend
python test_api.py
```

### Test Frontend
1. Open `http://localhost:3001` in your browser
2. You should see the login page
3. Use these test credentials:
   - Email: `admin@example.com`
   - Password: `admin123`

## 📊 Current Status

✅ **Backend Features:**
- Symptom analysis with fuzzy matching
- Disease prediction with 41+ diseases
- User authentication (login/signup)
- Greeting detection
- RESTful API with CORS support
- Health monitoring endpoint
- Comprehensive error handling

✅ **Frontend Features:**
- Modern React/Next.js interface
- User authentication
- Chat-based symptom analysis
- Conversation history
- Emergency contacts
- Responsive design
- Real-time typing indicators

✅ **Integration:**
- API proxy configured in Next.js
- Backend running on port 5000
- Frontend running on port 3001
- CORS properly configured

## 🛠️ Development Commands

### Backend
```bash
cd backend

# Start development server
python api_server.py

# Run tests
python test_api.py

# Install dependencies
pip install -r requirements.txt

# Production deployment
python deploy.py
```

### Frontend
```bash
cd ai-web

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🔧 Troubleshooting

### Backend Issues
- **Port 5000 in use**: Change port in `api_server.py`
- **Missing dependencies**: Run `pip install -r requirements.txt`
- **Data file errors**: Check that CSV files exist in `backend/data/`

### Frontend Issues
- **Port 3000 in use**: Next.js will automatically use 3001
- **API connection errors**: Ensure backend is running on port 5000
- **Build errors**: Run `npm install` to ensure dependencies are installed

### Integration Issues
- **CORS errors**: Backend has CORS enabled for all origins
- **API proxy**: Next.js is configured to proxy `/api/*` to `http://127.0.0.1:5000`

## 📁 Project Structure

```
Health-AI/
├── backend/                 # Python Flask API
│   ├── api_server.py       # Main API server
│   ├── start_server.py     # Startup script
│   ├── test_api.py         # API tests
│   ├── app/                # Application modules
│   └── data/               # CSV data files
└── ai-web/                 # Next.js frontend
    ├── app/                # App router pages
    ├── components/         # React components
    └── lib/                # Utilities and API client
```

## 🌐 API Endpoints

- `GET /api/health` - Health check
- `POST /api/analyze` - Symptom analysis
- `POST /api/login` - User login
- `POST /api/signup` - User registration

## 🔐 Default Test Accounts

- **Admin**: `admin@example.com` / `admin123`
- **User**: `user@example.com` / `user123`

## 🚀 Production Deployment

### Backend
```bash
cd backend
python deploy.py  # Uses Gunicorn for production
```

### Frontend
```bash
cd ai-web
npm run build
npm start
```

## 📝 Next Steps

1. **Database Integration**: Replace in-memory storage with PostgreSQL
2. **Enhanced ML**: Integrate machine learning models
3. **Security**: Add JWT tokens and password hashing
4. **Testing**: Add comprehensive test suites
5. **Monitoring**: Add logging and monitoring
6. **Documentation**: API documentation with Swagger

---

🎉 **Your SymptomAI project is now ready to use!**

For support or questions, check the README files in each directory.