from flask import Flask, request, jsonify
from app.predictor import SymptomPredictor, GreetingsResponder, login, signup
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
predictor = SymptomPredictor()
greeter = GreetingsResponder()

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
        result = predictor.match_disease(symptom_list)
        print("Result:", result, flush=True)
        if result:
            formatted = format_cli_response(result)
            print("Formatted:", formatted, flush=True)
            return jsonify({'message': formatted})
        else:
            print("No match found", flush=True)
            return jsonify({'error': 'No matching disease found.'}), 404
    except Exception as e:
        import traceback
        print("Exception occurred:", e, flush=True)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def handle_login():
    data = request.get_json()
    email = data.get('username')  # frontend sends 'username' but it's actually email
    password = data.get('password')
    user = login(email, password)
    if user:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Login failed. Please use your email and password.'}), 401

@app.route('/api/signup', methods=['POST'])
def handle_signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    signup(username, email, password)
    return jsonify({'message': 'Signup successful'}), 201

if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True) 