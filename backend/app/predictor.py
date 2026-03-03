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
        """
        Preprocess and validate user symptoms with fuzzy matching.
        Returns tuple: (cleaned_symptoms, unknown_symptoms, matched_info)
        """
        cleaned = []
        unknown = []
        matched_info = []
        
        for sym in user_symptoms:
            # Normalize the symptom
            normalized_sym = sym.lower().strip()
            if not normalized_sym:
                continue
                
            # Use fuzzy matching to find the closest match
            result = process.extractOne(normalized_sym, self.symptom_vocab)
            if result:
                match, score, _ = result
                if score > 60:
                    cleaned.append(match)
                    matched_info.append({
                        'original': sym,
                        'matched': match,
                        'confidence': round(score, 2)
                    })
                else:
                    # Low confidence match - treat as unknown
                    unknown.append(sym)
            else:
                unknown.append(sym)
                
        return cleaned, unknown, matched_info

    def match_disease(self, user_symptoms, min_symptoms=3, min_confidence=30):
        """
        Match disease based on symptoms with validation and accuracy reporting.
        
        Args:
            user_symptoms: List of symptom strings
            min_symptoms: Minimum number of valid symptoms required
            min_confidence: Minimum confidence threshold for prediction
            
        Returns:
            Dictionary with prediction results or None if no match
        """
        user_symptoms = [s.lower().strip() for s in user_symptoms if s.strip()]
        
        # Validate input
        if not user_symptoms:
            return {
                "error": "no_symptoms",
                "message": "I'd love to help! Could you tell me what symptoms you're experiencing?"
            }
        
        # Preprocess symptoms with validation
        processed_symptoms, unknown_symptoms, matched_info = self.preprocess_input(user_symptoms)
        
        # Check if we have enough valid symptoms
        if not processed_symptoms:
            return {
                "error": "unknown_symptoms",
                "message": "I'm sorry, I couldn't find a match for your symptoms right now. Please try rephrasing or listing your symptoms differently, and I'll do my best to help!",
                "unknown_symptoms": unknown_symptoms,
                "suggestions": "Try using terms like 'fever', 'cough', 'headache', 'nausea', 'fatigue', 'sore throat', etc."
            }
        
        # If we have some recognized symptoms but also unknown ones, prioritize asking about unknown
        if unknown_symptoms and len(unknown_symptoms) >= len(processed_symptoms):
            # More unknown than known - treat as unrecognized
            return {
                "error": "unknown_symptoms",
                "message": "I'm sorry, I couldn't find a match for your symptoms right now. Please try rephrasing or listing your symptoms differently, and I'll do my best to help!",
                "unknown_symptoms": unknown_symptoms,
                "recognized_symptoms": [m['matched'] for m in matched_info] if matched_info else None,
                "suggestions": "Try using terms like 'fever', 'cough', 'headache', 'nausea', 'fatigue', 'sore throat', etc."
            }
        
        # If we have recognized symptoms but not enough, ask for more
        if len(processed_symptoms) < min_symptoms:
            recognized_list = ', '.join([m['matched'] for m in matched_info])
            symptom_count = len(processed_symptoms)
            needed = min_symptoms - symptom_count
            
            return {
                "error": "insufficient_symptoms",
                "message": f"Thanks for sharing! I recognized {symptom_count} symptom(s): {recognized_list}. To give you an accurate diagnosis, I need at least {min_symptoms} symptoms. Could you add {needed} more symptom(s)? Tell me more about how you're feeling!",
                "recognized_symptoms": [m['matched'] for m in matched_info],
                "unknown_symptoms": unknown_symptoms if unknown_symptoms else None,
                "symptom_count": symptom_count,
                "required_count": min_symptoms,
                "suggestion": "The more details you share, the better I can help!"
            }

        # Find best matching diseases (top 3)
        disease_scores = []

        for _, row in self.df.iterrows():
            symptoms = row['symptoms']
            if not symptoms:
                continue
                
            # Calculate weighted match score
            total_weight = 0
            matched_weight = 0
            matched_symptoms = []
            
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
                        matched_symptoms.append(sym)
            
            # Calculate final match score
            if total_weight > 0:
                match_score = (matched_weight / total_weight) * 100
                
                # Calculate coverage (what % of disease symptoms are matched)
                coverage = (len(matched_symptoms) / len(symptoms)) * 100 if symptoms else 0
                
                disease_scores.append({
                    "row": row,
                    "score": match_score,
                    "coverage": coverage,
                    "matched_symptoms": matched_symptoms
                })
        
        # Sort by score
        disease_scores.sort(key=lambda x: x['score'], reverse=True)
        
        # Get best match
        if disease_scores and disease_scores[0]['score'] >= min_confidence:
            best = disease_scores[0]
            
            # Determine accuracy level
            confidence = best['score']
            if confidence >= 75:
                accuracy_level = "high"
                accuracy_message = "High confidence prediction"
            elif confidence >= 50:
                accuracy_level = "medium"
                accuracy_message = "Moderate confidence - consider providing more symptoms"
            else:
                accuracy_level = "low"
                accuracy_message = "Low confidence - more symptoms needed for accurate diagnosis"
            
            result = {
                "disease": best["row"]["disease"],
                "description": best["row"].get("description", "No description available"),
                "medications": str(best["row"].get("medications", "")).split('|') if best["row"].get("medications") else [],
                "procedures": str(best["row"].get("procedures", "")).split('|') if best["row"].get("procedures") else [],
                "precautions": str(best["row"].get("precautions", "")).split('|') if best["row"].get("precautions") else [],
                "specialist": best["row"].get("specialist", "General Practitioner"),
                "confidence": round(confidence, 2),
                "accuracy_level": accuracy_level,
                "accuracy_message": accuracy_message,
                "matched_symptoms": best["matched_symptoms"],
                "symptom_match_info": matched_info,
                "unknown_symptoms": unknown_symptoms if unknown_symptoms else None,
                "total_symptoms_provided": len(user_symptoms),
                "recognized_symptoms": len(processed_symptoms)
            }
            
            # Add alternative diagnoses if available
            if len(disease_scores) > 1:
                alternatives = []
                for alt in disease_scores[1:4]:  # Top 3 alternatives
                    if alt['score'] >= min_confidence * 0.7:  # At least 70% of best score
                        alternatives.append({
                            "disease": alt["row"]["disease"],
                            "confidence": round(alt['score'], 2)
                        })
                if alternatives:
                    result["alternative_diagnoses"] = alternatives
            
            return result
        else:
            # No confident match found - but we have recognized symptoms
            recognized = [m['matched'] for m in matched_info]
            
            # If we recognized the symptoms, ask for more details (don't say "no match")
            if recognized:
                if len(recognized) == 1:
                    return {
                        "error": "need_more_symptoms",
                        "message": f"I see you're experiencing {recognized[0]}. Could you tell me more about how you're feeling? Any other symptoms would really help me understand what might be going on.",
                        "recognized_symptoms": recognized,
                        "unknown_symptoms": unknown_symptoms if unknown_symptoms else None,
                        "suggestion": "Share any other discomfort or changes you've noticed - even small details can help!"
                    }
                else:
                    return {
                        "error": "need_more_symptoms",
                        "message": f"I noticed you mentioned {', '.join(recognized)}. Could you share any other symptoms or describe how you're feeling in more detail? This will help me give you better guidance.",
                        "recognized_symptoms": recognized,
                        "unknown_symptoms": unknown_symptoms if unknown_symptoms else None,
                        "suggestion": "More details about your symptoms will help me understand better."
                    }
            else:
                # Only use "no match" when symptoms truly weren't recognized
                return {
                    "error": "no_match",
                    "message": "I'm sorry, I couldn't find a match for your symptoms right now. Please try rephrasing or listing your symptoms differently, and I'll do my best to help!",
                    "recognized_symptoms": [],
                    "unknown_symptoms": unknown_symptoms if unknown_symptoms else None
                }

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
        """
        Check if user input is a greeting.
        Returns greeting response if detected, None otherwise.
        """
        user_input_lower = user_input.lower().strip()
        
        # First check: Is the entire input a greeting? (exact or fuzzy match)
        match, score, _ = process.extractOne(user_input_lower, self.greetings)
        if score > 80:
            print(f"🎯 Greeting detected: '{user_input}' matched '{match}' with {score}% confidence")
            return self.responses.get(match)
        
        # Second check: Does input START with a greeting?
        # This handles cases like "good night, I have fever"
        words = user_input_lower.split()
        
        # Try matching first 1-3 words as potential multi-word greetings
        for word_count in range(min(3, len(words)), 0, -1):
            prefix = ' '.join(words[:word_count])
            match, score, _ = process.extractOne(prefix, self.greetings)
            if score > 85:  # Higher threshold for prefix matching
                print(f"🎯 Greeting detected at start: '{prefix}' matched '{match}' with {score}% confidence")
                return self.responses.get(match)
        
        print(f"❌ No greeting detected in: '{user_input}'")
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
