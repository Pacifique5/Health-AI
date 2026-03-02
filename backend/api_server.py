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
    """Format prediction result for display"""
    def safe_join(val):
        if isinstance(val, list):
            return ', '.join([str(v).strip() for v in val if v and str(v).strip()])
        if isinstance(val, str):
            return val.strip() if val.strip() else '-'
        return '-'
    
    # Check if this is an error response
    if 'error' in result:
        error_type = result['error']
        message = result.get('message', 'Unknown error')
        
        response = f"⚠️ {message}\n"
        
        if result.get('recognized_symptoms'):
            response += f"\n✅ Recognized symptoms: {', '.join(result['recognized_symptoms'])}"
        
        if result.get('unknown_symptoms'):
            response += f"\n❌ Unknown symptoms: {', '.join(result['unknown_symptoms'])}"
        
        if result.get('suggestion') or result.get('suggestions'):
            suggestion = result.get('suggestion') or result.get('suggestions')
            response += f"\n💡 Suggestion: {suggestion}"
        
        return response
    
    # Format successful prediction
    confidence = result.get('confidence', 0)
    accuracy_level = result.get('accuracy_level', 'unknown')
    
    # Choose emoji based on accuracy level
    if accuracy_level == 'high':
        confidence_emoji = "🟢"
    elif accuracy_level == 'medium':
        confidence_emoji = "🟡"
    else:
        confidence_emoji = "🟠"
    
    response = (
        f"✅ Possible Disease: {result.get('disease', '-').title()}\n"
        f"{confidence_emoji} Confidence: {confidence}% ({result.get('accuracy_message', 'N/A')})\n"
        f"📊 Analysis: {result.get('recognized_symptoms', 0)}/{result.get('total_symptoms_provided', 0)} symptoms recognized\n"
        f"📄 Description: {result.get('description', '-')}\n"
        f"💊 Medications: {safe_join(result.get('medications', []))}\n"
        f"🛠️ Procedures: {safe_join(result.get('procedures', []))}\n"
        f"🧼 Precautions: {safe_join(result.get('precautions', []))}\n"
        f"👨‍⚕️ Specialist to Consult: {result.get('specialist', 'General Practitioner')}"
    )
    
    # Add matched symptoms info
    if result.get('symptom_match_info'):
        matched = [f"{m['original']} → {m['matched']} ({m['confidence']}%)" 
                   for m in result['symptom_match_info']]
        response += f"\n\n🔍 Symptom Matching:\n  " + "\n  ".join(matched)
    
    # Add unknown symptoms warning
    if result.get('unknown_symptoms'):
        response += f"\n\n⚠️ Unknown symptoms (not used in diagnosis): {', '.join(result['unknown_symptoms'])}"
    
    # Add alternative diagnoses
    if result.get('alternative_diagnoses'):
        alts = [f"{alt['disease']} ({alt['confidence']}%)" 
                for alt in result['alternative_diagnoses']]
        response += f"\n\n🔄 Alternative diagnoses to consider:\n  " + "\n  ".join(alts)
    
    return response

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        if not predictor or not greeter:
            return jsonify({'error': 'Backend components not initialized properly'}), 500
            
        data = request.get_json()
        print("Received data:", data, flush=True)
        symptoms = data.get('symptoms', '')
        print("Parsed symptoms:", symptoms, flush=True)
        
        if not symptoms or not symptoms.strip():
            return jsonify({
                'error': 'No symptoms provided',
                'message': 'Please provide at least one symptom to analyze.'
            }), 400
            
        # Check for greeting
        greeting_response = greeter.get_response(symptoms)
        if greeting_response:
            print("Greeting detected. Responding:", greeting_response, flush=True)
            return jsonify({'message': greeting_response})
            
        symptom_list = [s.strip() for s in symptoms.split(',') if s.strip()]
        print("Symptom list:", symptom_list, flush=True)
        
        if not symptom_list:
            return jsonify({
                'error': 'No valid symptoms provided',
                'message': 'Please provide symptoms separated by commas.'
            }), 400
            
        # Get prediction with validation
        result = predictor.match_disease(symptom_list, min_symptoms=1, min_confidence=30)
        print("Result:", result, flush=True)
        
        if result:
            # Check if result contains an error
            if 'error' in result:
                error_type = result['error']
                formatted = format_cli_response(result)
                
                # Return appropriate status code based on error type
                if error_type == 'no_symptoms':
                    status_code = 400
                elif error_type == 'unknown_symptoms':
                    status_code = 422  # Unprocessable Entity
                elif error_type == 'insufficient_symptoms':
                    status_code = 422
                elif error_type == 'low_confidence':
                    status_code = 200  # Still return 200 but with warning
                else:
                    status_code = 404
                
                return jsonify({
                    'message': formatted,
                    'error_type': error_type,
                    'details': result
                }), status_code
            else:
                # Successful prediction
                formatted = format_cli_response(result)
                print("Formatted:", formatted, flush=True)
                return jsonify({
                    'message': formatted,
                    'details': result
                }), 200
        else:
            print("No result returned", flush=True)
            return jsonify({
                'error': 'No matching disease found',
                'message': 'Unable to diagnose based on provided symptoms. Please try different or more specific symptoms.'
            }), 404
            
    except Exception as e:
        print("Exception occurred:", e, flush=True)
        traceback.print_exc()
        return jsonify({
            'error': 'Internal server error',
            'message': f'An error occurred while processing your request: {str(e)}'
        }), 500

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
    import os
    port = int(os.environ.get('PORT', 5000))
    print("🚀 Starting SymptomAI Backend Server...")
    print("📊 Available endpoints:")
    print("  - GET  /           : API information")
    print("  - GET  /api/health : Health check")
    print("  - POST /api/analyze: Symptom analysis")
    print("  - POST /api/login  : User login")
    print("  - POST /api/signup : User signup")
    print(f"🌐 Server will be available at: http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=False) 