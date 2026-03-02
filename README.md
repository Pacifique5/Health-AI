# SymptomAI - AI-Powered Health Assistant 🏥💊

A comprehensive health analysis platform with AI-powered symptom checking, disease prediction, and treatment recommendations.

![SymptomAI](https://img.shields.io/badge/AI-Powered-blue) ![Python](https://img.shields.io/badge/Python-3.7+-green) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![License](https://img.shields.io/badge/License-Educational-orange)

## 🌟 Features

- 🧠 **AI Symptom Analysis** - Analyze symptoms across 41+ diseases with 131 tracked symptoms
- 💊 **Treatment Plans** - Get detailed medication recommendations with dosages
- 🏥 **Specialist Referrals** - Know which specialist to consult
- 📊 **Confidence Scoring** - See how confident the AI is in its predictions
- 🔒 **Secure Authentication** - Login/Signup with session management
- 🌓 **Dark Mode** - Full dark mode support
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ✨ **Beautiful UI** - Modern animations and vibrant gradients

## 🚀 Quick Start

### Prerequisites

- **Python 3.7+** with pip
- **Node.js 18+** with npm

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Health-AI
```

2. **Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

3. **Install Frontend Dependencies**
```bash
cd ai-web
npm install
cd ..
```

### Running the Application

#### Option 1: One-Click Start (Windows)
Double-click **`start.bat`** in the root directory

#### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
python api_server.py
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd ai-web
npm run dev
```
Frontend runs on: `http://localhost:3000`

### Access the App

Open your browser: **http://localhost:3000**

## 🔐 Test Accounts

Use these credentials to test the application:

| Email | Password | Role |
|-------|----------|------|
| `admin@example.com` | `admin123` | Admin |
| `user@example.com` | `user123` | User |

## 📁 Project Structure

```
Health-AI/
├── backend/                 # Python Flask API
│   ├── api_server.py       # Main API server
│   ├── app/
│   │   └── predictor.py    # AI prediction logic
│   ├── data/               # Disease & symptom databases
│   │   ├── dataset.csv     # Symptom-disease mappings
│   │   ├── disease_treatments.csv
│   │   ├── symptom_Description.csv
│   │   ├── symptom_precaution.csv
│   │   ├── Symptom-severity.csv
│   │   └── greetings.csv
│   └── requirements.txt    # Python dependencies
│
├── ai-web/                 # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx       # Landing page
│   │   ├── login/         # Login page
│   │   ├── signup/        # Signup page
│   │   └── dashboard/     # Chat interface
│   ├── components/        # React components
│   ├── lib/              # Utilities & API
│   └── package.json      # Node dependencies
│
├── start.bat             # Windows startup script
└── README.md            # This file
```

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Symptom Analysis
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "fever, headache, cough"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin@example.com", "password": "admin123"}'
```

## 💡 How It Works

1. **User Input** - User describes symptoms in natural language
2. **AI Processing** - Symptoms are matched using fuzzy matching with severity weights
3. **Disease Prediction** - AI analyzes against 41 diseases with confidence scoring
4. **Treatment Plan** - Returns medications, procedures, precautions, and specialist recommendations

### Data Sources

- **41 Diseases** covered with comprehensive data
- **131 Symptoms** tracked with severity weights
- **Fuzzy Matching** for flexible symptom recognition
- **Medical-grade** treatment recommendations

## 🛠️ Tech Stack

### Backend
- **Python 3.7+** - Core language
- **Flask** - Web framework
- **Pandas** - Data processing
- **RapidFuzz** - Fuzzy string matching
- **Flask-CORS** - Cross-origin support

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon library
- **UUID** - Unique identifiers

## 🎨 Features Breakdown

### Landing Page
- Animated gradient backgrounds
- Floating medical icons with parallax
- Stats section with live counters
- Feature cards with hover effects
- Testimonials grid
- Team section
- Smooth scroll animations

### Dashboard
- Real-time chat interface
- Typing indicators
- Confidence score badges
- Message timestamps
- Export chat history
- Emergency contacts sidebar
- Quick action buttons

### Authentication
- Secure login/signup
- Session management
- User profile dropdown
- Settings modal

## 🔧 Configuration

### Backend Environment Variables
Create `backend/.env` (optional):
```env
HOST=localhost
PORT=5000
DEBUG=True
```

### Frontend Environment Variables
Create `ai-web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

## 🚨 Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

**Missing dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Kill the process and restart
npm run dev
```

**Build errors:**
```bash
cd ai-web
rm -rf .next node_modules
npm install
npm run dev
```

**API connection failed:**
- Ensure backend is running on http://localhost:5000
- Check `ai-web/.env.local` has correct API URL

## 📊 Database Schema

### Disease Data Structure
```csv
Disease,symptoms,Description,precautions,medications,procedures,specialist
Common Cold,"cough, runny_nose, sneezing","Viral infection...","rest, hydration","Decongestants...","Rest and hydration","Primary Care"
```

### Symptom Severity
```csv
Symptom,weight
fever,7
headache,5
cough,4
```

## 🌐 Deployment

### Backend (Render/Heroku/Railway)
1. Push `backend/` folder
2. Set Python buildpack
3. Entry point: `python api_server.py`
4. Set environment variables

### Frontend (Vercel/Netlify)
1. Push `ai-web/` folder
2. Framework: Next.js
3. Build command: `npm run build`
4. Output directory: `.next`
5. Set environment variable: `NEXT_PUBLIC_API_URL=<backend-url>`

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/analyze` | Analyze symptoms |
| POST | `/api/login` | User login |
| POST | `/api/signup` | User registration |

## 🤝 Contributing

This is an educational project. Feel free to fork and modify!

## ⚠️ Disclaimer

**This application is for educational purposes only.** 

- Not a substitute for professional medical advice
- Always consult healthcare professionals for medical concerns
- Do not use for emergency medical situations
- Call emergency services (911/112/etc.) for urgent medical help

## 📄 License

Educational use only. Not for commercial purposes.

## 🎯 Future Enhancements

- [ ] Multi-language support
- [ ] Voice input
- [ ] Medical image analysis
- [ ] Appointment booking
- [ ] Health tracking dashboard
- [ ] Mobile app (iOS/Android)
- [ ] Integration with wearables
- [ ] Telemedicine features

## 📞 Support

For issues or questions:
- Check troubleshooting section above
- Review the code comments
- Test with provided credentials

---

**Made with ❤️ for better health awareness**
