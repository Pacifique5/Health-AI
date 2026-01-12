from flask import Flask, request, jsonify
from app.predictor import SymptomPredictor, GreetingsResponder, login, signup
from flask_cors import CORS
import traceback

app = Flask(__name__)
CORS(app)

# Initialize components with error handling
try:
    predictor = SymptomPredictor()
    greeter = GreetingsResponder()
    print("✅ Backend components initialized successfully")
except Exception as e:
    print(f"❌ Error initializing components: {e}")
    traceback.print_exc()
    predictor = None
    greeter = None

def format_cli_response(result):
    def safe_join(val):
        if isinstance(val, list):
            return ', '.join([str(v) for v in val if v])
        if isinstance(val, str):
            return val
        return '-'
    return (
        f"✅ Possible Disease: {result.get('disease', '-').title()}\n"
        f"📄 Description: {result.get('description', '-')}\n"
        f"💊 Medications: {safe_join(result.get('medications', []))}\n"
        f"🛠️ Procedures: {safe_join(result.get('procedures', []))}\n"
        f"🧼 Precautions: {safe_join(result.get('precautions', []))}\n"
        f"👨‍⚕️ Specialist to Consult: {result.get('specialist', '-')}"
    )

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        if not predictor or not greeter:
            return jsonify({'error': 'Backend components not initialized properly'}), 500
            
        data = request.get_json()
        print("Received data:", data, flush=True)
        symptoms = data.get('symptoms', '')
        print("Parsed symptoms:", symptoms, flush=True)
        
        if not symptoms:
            return jsonify({'error': 'No symptoms provided'}), 400
            
        # Check for greeting
        greeting_response = greeter.get_response(symptoms)
        if greeting_response:
            print("Greeting detected. Responding:", greeting_response, flush=True)
            return jsonify({'message': greeting_response})
            
        symptom_list = [s.strip() for s in symptoms.split(',') if s.strip()]
        print("Symptom list:", symptom_list, flush=True)
        
        if not symptom_list:
            return jsonify({'error': 'No valid symptoms provided'}), 400
            
        result = predictor.match_disease(symptom_list)
        print("Result:", result, flush=True)
        
        if result:
            formatted = format_cli_response(result)
            print("Formatted:", formatted, flush=True)
            return jsonify({'message': formatted})
        else:
            print("No match found", flush=True)
            return jsonify({'error': 'No matching disease found. Please try different or more specific symptoms.'}), 404
            
    except Exception as e:
        print("Exception occurred:", e, flush=True)
        traceback.print_exc()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def handle_login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
            
        email = data.get('username')  # frontend sends 'username' but it's actually email
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
            
        user = login(email, password)
        if user:
            return jsonify({'message': 'Login successful', 'user': user}), 200
        else:
            return jsonify({'message': 'Invalid email or password'}), 401
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'message': 'Login failed due to server error'}), 500

@app.route('/api/signup', methods=['POST'])
def handle_signup():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
            
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return jsonify({'message': 'Username, email, and password are required'}), 400
            
        signup(username, email, password)
        return jsonify({'message': 'Signup successful'}), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        print(f"Signup error: {e}")
        return jsonify({'message': 'Signup failed due to server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    status = {
        'status': 'healthy',
        'predictor': predictor is not None,
        'greeter': greeter is not None,
        'message': 'SymptomAI Backend is running'
    }
    return jsonify(status), 200

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'message': 'SymptomAI Backend API',
        'version': '1.0.0',
        'endpoints': [
            '/api/health',
            '/api/analyze',
            '/api/login',
            '/api/signup'
        ]
    }), 200

if __name__ == '__main__':
    print("🚀 Starting SymptomAI Backend Server...")
    print("📊 Available endpoints:")
    print("  - GET  /           : API information")
    print("  - GET  /api/health : Health check")
    print("  - POST /api/analyze: Symptom analysis")
    print("  - POST /api/login  : User login")
    print("  - POST /api/signup : User signup")
    print("🌐 Server will be available at: http://localhost:5000")
    app.run(host="localhost", port=5000, debug=True) 