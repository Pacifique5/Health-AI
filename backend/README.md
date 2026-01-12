# SymptomAI Backend 🧠💊

SymptomAI is a smart medical assistant that takes user symptoms and predicts possible diseases, medications, procedures, and the right specialist to consult.

## Features
- 🔍 Match symptoms to diseases using fuzzy matching
- 💊 Get medication and procedure recommendations
- 🧼 Receive precaution advice
- 👨‍⚕️ Find the right specialist to consult
- 🤖 Greeting detection and responses
- 🔐 User authentication (login/signup)
- 🌐 RESTful API for web integration
- 📊 Health monitoring endpoint

## Quick Start

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Installation & Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the server:
   ```bash
   python api_server.py
   ```
   
   Or use the startup script:
   ```bash
   python start_server.py
   ```

4. The server will be available at: `http://localhost:5000`

### Testing the API
Run the test script to verify everything works:
```bash
python test_api.py
```

## API Endpoints

### Health Check
- **GET** `/api/health` - Check server status

### Symptom Analysis
- **POST** `/api/analyze`
  ```json
  {
    "symptoms": "headache, nausea, vomiting"
  }
  ```

### Authentication
- **POST** `/api/login`
  ```json
  {
    "username": "admin@example.com",
    "password": "admin123"
  }
  ```

- **POST** `/api/signup`
  ```json
  {
    "username": "newuser",
    "email": "user@example.com", 
    "password": "password123"
  }
  ```

## Default Test Accounts
- Email: `admin@example.com`, Password: `admin123`
- Email: `user@example.com`, Password: `user123`

## Project Structure
```
backend/
├── api_server.py          # Main Flask API server
├── main.py               # CLI interface
├── start_server.py       # Server startup script
├── test_api.py          # API testing script
├── requirements.txt      # Python dependencies
├── app/
│   ├── predictor.py     # Disease prediction logic
│   ├── chatbot.py       # Chatbot functionality (future)
│   └── nlp_utils.py     # NLP utilities
└── data/
    ├── disease_data.csv     # Disease and symptom database
    ├── greetings.csv        # Greeting responses
    └── ...                  # Other data files
```

## How It Works
1. **Symptom Processing**: User symptoms are cleaned and normalized
2. **Fuzzy Matching**: Symptoms are matched against a vocabulary using fuzzy string matching
3. **Disease Prediction**: Best matching disease is found based on symptom overlap
4. **Response Generation**: Comprehensive response with disease info, medications, procedures, and specialist recommendations

## Development

### Adding New Diseases
Edit `data/disease_data.csv` with the following columns:
- `Disease`: Disease name
- `symptoms`: Comma-separated symptoms
- `Description`: Disease description
- `precautions`: Recommended precautions
- `medications`: Suggested medications
- `procedures`: Medical procedures
- `specialist`: Type of specialist to consult

### Running in Development Mode
The server runs in debug mode by default, which provides:
- Auto-reload on code changes
- Detailed error messages
- Debug console access

## Roadmap
- ✅ Basic symptom matching
- ✅ RESTful API
- ✅ User authentication
- ✅ Comprehensive error handling
- 🔄 Machine learning model integration
- 🔄 Advanced NLP processing
- 🔄 Database integration (PostgreSQL)
- 🔄 Enhanced chatbot functionality
- 🔄 Medical image analysis

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is for educational purposes. Please consult healthcare professionals for medical advice.
