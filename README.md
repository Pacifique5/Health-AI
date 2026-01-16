# 🏥 SymptomAI - Your Smart Health Companion

An AI-powered health assistant that helps you understand your symptoms, get health insights, and receive personalized medical guidance.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![Flask](https://img.shields.io/badge/Flask-3.0-green?style=flat-square&logo=flask)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)

## ✨ Features

### 🔍 Symptom Analysis
- Describe your symptoms in natural language
- Get AI-powered disease predictions
- Receive detailed information about possible conditions
- View recommended medications and treatments

### 💬 Interactive Chat
- Natural conversation with AI health assistant
- Context-aware responses
- Greeting recognition
- Medical terminology understanding

### 🎯 Quick Actions
- **Check Symptoms**: Fast symptom checker with severity assessment
- **Heart Health**: Cardiovascular health monitoring
- **Preventive Care**: Personalized preventive health recommendations
- **Medication Reminders**: Track and manage your medications

### 👤 User Management
- Secure authentication (login/signup)
- Personalized user profiles
- Settings management
- Session persistence

### 🎨 Modern UI/UX
- Beautiful gradient designs
- Smooth animations
- Fully responsive (mobile, tablet, desktop)
- Dark mode dashboard
- Intuitive navigation

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+
- **Git**

### Local Development

#### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/symptom-ai.git
cd symptom-ai
```

#### 2. Start Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment (optional but recommended)
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Start server
python start_server.py
```

Backend will run on `http://localhost:5000`

#### 3. Start Frontend

Open a new terminal:

```bash
# Navigate to frontend
cd ai-web

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

#### 4. Open Application

Visit `http://localhost:3000` in your browser

### Quick Start Scripts

**Windows:**
- `start_backend.bat` - Start backend server
- `start_frontend.bat` - Start frontend server
- `start_all.py` - Start both servers simultaneously

## 📁 Project Structure

```
symptom-ai/
├── ai-web/                 # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx       # Landing page
│   │   ├── login/         # Login page
│   │   ├── signup/        # Signup page
│   │   └── dashboard/     # Main dashboard
│   ├── components/        # React components
│   │   ├── AuthGuard.tsx
│   │   ├── QuickActionModals.tsx
│   │   ├── SettingsModal.tsx
│   │   └── ui/            # UI components
│   └── lib/               # Utilities
│
├── backend/               # Flask Backend
│   ├── api_server.py     # Main API server
│   ├── app/
│   │   ├── predictor.py  # Disease prediction logic
│   │   ├── chatbot.py    # Chat functionality
│   │   └── nlp_utils.py  # NLP utilities
│   └── data/             # Medical datasets
│
└── docs/                 # Documentation
```

## 🌐 Deployment

### Deploy to Production (Free!)

This project can be deployed completely free using:
- **Frontend**: Vercel (Free tier)
- **Backend**: Render (Free tier)

**Total Cost: $0/month**

### Quick Deploy Steps

1. **Run setup script:**
   ```bash
   deploy_setup.bat  # Windows
   ```

2. **Create GitHub repository** and push code

3. **Deploy backend to Render:**
   - Go to https://render.com
   - Create new Web Service
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn api_server:app`

4. **Deploy frontend to Vercel:**
   - Go to https://vercel.com
   - Import GitHub repo
   - Root Directory: `ai-web`
   - Add env variable: `NEXT_PUBLIC_API_URL` = your Render URL

📖 **See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions**

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

**Backend:**
```env
PORT=5000  # Auto-set by hosting platform
```

## 🧪 Testing

### Test Backend API

```bash
cd backend
python test_api.py
```

### Test Frontend

```bash
cd ai-web
npm run build  # Check for build errors
npm run lint   # Check for linting issues
```

## 📊 API Endpoints

### Health Check
```
GET /api/health
```

### Analyze Symptoms
```
POST /api/analyze
Body: { "symptoms": "fever, cough, headache" }
```

### User Authentication
```
POST /api/login
Body: { "username": "email@example.com", "password": "password" }

POST /api/signup
Body: { "username": "name", "email": "email@example.com", "password": "password" }
```

## 🎨 Tech Stack

### Frontend
- **Framework**: Next.js 14.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI
- **Icons**: Lucide React

### Backend
- **Framework**: Flask
- **Language**: Python 3.8+
- **NLP**: FuzzyWuzzy, Levenshtein
- **Data**: Pandas
- **CORS**: Flask-CORS

### Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Version Control**: Git/GitHub

## 🔒 Security

- HTTPS enabled on all deployments
- CORS configured for security
- Input validation on all endpoints
- Password hashing (ready for implementation)
- Environment variables for sensitive data
- No hardcoded credentials

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Medical datasets from various open sources
- UI inspiration from modern health apps
- Community feedback and contributions

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/symptom-ai/issues)
- **Documentation**: See `/docs` folder
- **Deployment Help**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 🎯 Roadmap

- [ ] Add more medical conditions
- [ ] Implement appointment booking
- [ ] Add medication tracking
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Integration with health APIs
- [ ] Advanced analytics dashboard
- [ ] Telemedicine features

## ⚠️ Disclaimer

**This application is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.**

---

Made with ❤️ by [Your Name]

**🌟 Star this repo if you find it helpful!**
