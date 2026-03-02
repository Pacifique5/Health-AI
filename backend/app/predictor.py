import os
import pandas as pd
from rapidfuzz import process, fuzz

class SymptomPredictor:
    def __init__(self):
        try:
            data_dir = os.path.join(os.path.dirname(__file__), '../data')
            
            # Load all CSV files
            print("📂 Loading disease data from multiple sources...")
            
            # 1. Load symptom-disease mappings (dataset.csv or DiseaseAndSymptoms.csv)
            symptoms_file = os.path.join(data_dir, 'dataset.csv')
            if not os.path.exists(symptoms_file):
                symptoms_file = os.path.join(data_dir, 'DiseaseAndSymptoms.csv')
            
            df_symptoms = pd.read_csv(symptoms_file)
            print(f"✅ Loaded symptoms data: {len(df_symptoms)} records")
            
            # 2. Load descriptions
            descriptions_file = os.path.join(data_dir, 'symptom_Description.csv')
            df_descriptions = pd.read_csv(descriptions_file) if os.path.exists(descriptions_file) else pd.DataFrame()
            print(f"✅ Loaded descriptions: {len(df_descriptions)} diseases")
            
            # 3. Load precautions
            precautions_file = os.path.join(data_dir, 'symptom_precaution.csv')
            if not os.path.exists(precautions_file):
                precautions_file = os.path.join(data_dir, 'Disease precaution.csv')
            df_precautions = pd.read_csv(precautions_file) if os.path.exists(precautions_file) else pd.DataFrame()
            print(f"✅ Loaded precautions: {len(df_precautions)} diseases")
            
            # 4. Load treatments (medications, procedures, specialists)
            treatments_file = os.path.join(data_dir, 'disease_treatments.csv')
            df_treatments = pd.read_csv(treatments_file) if os.path.exists(treatments_file) else pd.DataFrame()
            print(f"✅ Loaded treatments: {len(df_treatments)} diseases")
            
            # 5. Load symptom severity weights
            severity_file = os.path.join(data_dir, 'Symptom-severity.csv')
            self.symptom_weights = {}
            if os.path.exists(severity_file):
                df_severity = pd.read_csv(severity_file)
                self.symptom_weights = dict(zip(
                    df_severity['Symptom'].str.lower().str.strip(),
                    df_severity['weight']
                ))
                print(f"✅ Loaded symptom weights: {len(self.symptom_weights)} symptoms")
            
            # Process symptoms data - convert columns to list of symptoms
            symptom_cols = [col for col in df_symptoms.columns if col.startswith('Symptom_')]
            df_symptoms['symptoms'] = df_symptoms[symptom_cols].apply(
                lambda row: [str(s).strip().lower() for s in row if pd.notna(s) and str(s).strip()],
                axis=1
            )
            
            # Group by disease and aggregate symptoms
            disease_symptoms = df_symptoms.groupby('Disease')['symptoms'].apply(
                lambda x: list(set([sym for symptoms in x for sym in symptoms]))
            ).reset_index()
            
            # Merge all data
            self.df = disease_symptoms.copy()
            self.df['disease'] = self.df['Disease']
            
            # Create normalized disease name for merging
            self.df['disease_lower'] = self.df['Disease'].str.lower().str.strip()
            
            # Merge descriptions
            if not df_descriptions.empty:
                df_descriptions['disease_lower'] = df_descriptions['Disease'].str.lower().str.strip()
                self.df = self.df.merge(
                    df_descriptions[['disease_lower', 'Description']].rename(columns={'Description': 'description'}),
                    on='disease_lower',
                    how='left'
                )
            else:
                self.df['description'] = 'No description available'
            
            # Merge precautions
            if not df_precautions.empty:
                precaution_cols = [col for col in df_precautions.columns if col.startswith('Precaution_')]
                df_precautions['precautions'] = df_precautions[precaution_cols].apply(
                    lambda row: '|'.join([str(s).strip() for s in row if pd.notna(s) and str(s).strip()]),
                    axis=1
                )
                df_precautions['disease_lower'] = df_precautions['Disease'].str.lower().str.strip()
                self.df = self.df.merge(
                    df_precautions[['disease_lower', 'precautions']],
                    on='disease_lower',
                    how='left'
                )
            else:
                self.df['precautions'] = ''
            
            # Merge treatments
            if not df_treatments.empty:
                df_treatments['disease_lower'] = df_treatments['Disease'].str.lower().str.strip()
                self.df = self.df.merge(
                    df_treatments[['disease_lower', 'medications', 'procedures', 'specialist']],
                    on='disease_lower',
                    how='left'
                )
            else:
                self.df['medications'] = ''
                self.df['procedures'] = ''
                self.df['specialist'] = ''
            
            # Drop the temporary column
            self.df = self.df.drop('disease_lower', axis=1)
            
            # Fill NaN values
            self.df = self.df.fillna('')
            
            # Build symptom vocabulary
            self.symptom_vocab = sorted({sym for symptoms in self.df['symptoms'] for sym in symptoms})
            
            print(f"✅ Successfully merged data for {len(self.df)} unique diseases")
            print(f"✅ Built vocabulary with {len(self.symptom_vocab)} unique symptoms")
            
        except Exception as e:
            print(f"❌ Error initializing SymptomPredictor: {e}")
            import traceback
            traceback.print_exc()
            raise e

    def preprocess_input(self, user_symptoms):
        cleaned = []
        for sym in user_symptoms:
            # Normalize the symptom
            normalized_sym = sym.lower().strip()
            # Use fuzzy matching to find the closest match
            result = process.extractOne(normalized_sym, self.symptom_vocab)
            if result:
                match, score, _ = result
                if score > 60:
                    cleaned.append(match)
        return cleaned

    def match_disease(self, user_symptoms):
        user_symptoms = [s.lower().strip() for s in user_symptoms]
        processed_symptoms = self.preprocess_input(user_symptoms)
        
        if not processed_symptoms:
            return None

        best_match = None
        best_score = 0

        for _, row in self.df.iterrows():
            symptoms = row['symptoms']
            if not symptoms:
                continue
                
            # Calculate weighted match score
            total_weight = 0
            matched_weight = 0
            
            for sym in processed_symptoms:
                # Get symptom weight (default to 1 if not found)
                weight = self.symptom_weights.get(sym, 1)
                total_weight += weight
                
                # Check if symptom matches any disease symptom
                result = process.extractOne(sym, symptoms)
                if result:
                    _, score, _ = result
                    if score > 70:
                        matched_weight += weight * (score / 100)
            
            # Calculate final match score
            if total_weight > 0:
                match_score = (matched_weight / total_weight) * 100
                
                if match_score > best_score:
                    best_score = match_score
                    best_match = row

        if best_match is not None and best_score > 30:
            return {
                "disease": best_match["disease"],
                "description": best_match.get("description", "No description available"),
                "medications": str(best_match.get("medications", "")).split('|') if best_match.get("medications") else [],
                "procedures": str(best_match.get("procedures", "")).split('|') if best_match.get("procedures") else [],
                "precautions": str(best_match.get("precautions", "")).split('|') if best_match.get("precautions") else [],
                "specialist": best_match.get("specialist", "General Practitioner"),
                "confidence": round(best_score, 2)
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
        match, score, _ = process.extractOne(user_input, self.greetings)
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
