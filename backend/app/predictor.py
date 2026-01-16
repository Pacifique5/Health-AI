import os
import pandas as pd
from rapidfuzz import process, fuzz

class SymptomPredictor:
    def __init__(self, csv_path=None):
        try:
            if csv_path is None:
                # Always resolve path relative to this file
                csv_path = os.path.join(os.path.dirname(__file__), '../data/disease_data.csv')
            
            if not os.path.exists(csv_path):
                raise FileNotFoundError(f"Disease data file not found: {csv_path}")
                
            self.df = pd.read_csv(csv_path)
            print(f"✅ Loaded {len(self.df)} diseases from {csv_path}")
            
            # Standardize column names to lowercase
            self.df.columns = self.df.columns.str.lower()
            
            # Clean and process symptoms
            self.df['symptoms'] = self.df['symptoms'].apply(
                lambda x: [s.strip().lower() for s in str(x).split(',') if s.strip()]
            )
            
            # Build symptom vocabulary
            self.symptom_vocab = sorted({sym for symptoms in self.df['symptoms'] for sym in symptoms})
            print(f"✅ Built vocabulary with {len(self.symptom_vocab)} unique symptoms")
            
        except Exception as e:
            print(f"❌ Error initializing SymptomPredictor: {e}")
            raise e

    def preprocess_input(self, user_symptoms):
        cleaned = []
        for sym in user_symptoms:
            # Normalize the symptom
            normalized_sym = sym.lower().strip()
            # Use fuzzy matching to find the closest match
            match, score = process.extractOne(normalized_sym, self.symptom_vocab)
            if score > 60:
                cleaned.append(match)
        return cleaned

    def match_disease(self, user_symptoms):
        user_symptoms = [s.lower().strip() for s in user_symptoms]
        processed_symptoms = self.preprocess_input(user_symptoms)

        best_match = None
        best_score = 0

        for _, row in self.df.iterrows():
            symptoms = row['symptoms']
            # Calculate match score using fuzzy matching
            match_score = sum(process.extractOne(sym, symptoms)[1] for sym in processed_symptoms) / len(processed_symptoms)
            if match_score > best_score:
                best_score = match_score
                best_match = row

        if best_match is not None and best_score > 0:
            return {
                "disease": best_match["disease"],
                "description": best_match.get("description", "No description available"),
                "medications": str(best_match.get("medications", "")).split('|'),
                "procedures": str(best_match.get("procedures", "")).split('|'),
                "precautions": str(best_match.get("precautions", "")).split('|'),
                "specialist": best_match.get("specialist", "")
            }
        else:
            return None

class GreetingsResponder:
    def __init__(self, csv_path=None):
        try:
            if csv_path is None:
                csv_path = os.path.join(os.path.dirname(__file__), '../data/greetings.csv')
            
            if not os.path.exists(csv_path):
                print(f"⚠️ Greetings file not found: {csv_path}, using default responses")
                # Create default greetings
                self.greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']
                self.responses = {
                    'hello': 'Hello! How can I assist you today?',
                    'hi': 'Hi there! What symptoms are you experiencing?',
                    'hey': 'Hey! How can I help you?',
                    'good morning': 'Good morning! How are you feeling today?',
                    'good afternoon': 'Good afternoon! How can I help you?',
                    'good evening': 'Good evening! What can I do for you?'
                }
            else:
                self.df = pd.read_csv(csv_path)
                self.greetings = self.df['greeting'].str.lower().tolist()
                self.responses = dict(zip(self.df['greeting'].str.lower(), self.df['response']))
                print(f"✅ Loaded {len(self.greetings)} greetings from {csv_path}")
                
        except Exception as e:
            print(f"❌ Error initializing GreetingsResponder: {e}")
            # Fallback to basic greetings
            self.greetings = ['hello', 'hi', 'hey']
            self.responses = {
                'hello': 'Hello! How can I assist you today?',
                'hi': 'Hi there! What symptoms are you experiencing?',
                'hey': 'Hey! How can I help you?'
            }

    def get_response(self, user_input):
        user_input = user_input.lower().strip()
        match, score = process.extractOne(user_input, self.greetings)
        if score > 80:
            return self.responses.get(match)
        return None

# Simple in-memory user storage for development
# In production, this should use a proper database
USERS_DB = {
    "admin@example.com": {"username": "Admin User", "password": "admin123", "email": "admin@example.com"},
    "user@example.com": {"username": "Test User", "password": "user123", "email": "user@example.com"}
}

def login(email, password):
    """Simple login function using in-memory storage"""
    try:
        user_data = USERS_DB.get(email)
        if user_data and user_data["password"] == password:
            return {
                "email": email, 
                "username": user_data["username"]
            }
        return None
    except Exception as e:
        print(f"Login error: {e}")
        return None

def signup(username, email, password):
    """Simple signup function using in-memory storage"""
    try:
        if email in USERS_DB:
            raise ValueError("User already exists")
        USERS_DB[email] = {
            "username": username, 
            "password": password, 
            "email": email
        }
        return True
    except Exception as e:
        print(f"Signup error: {e}")
        raise e
