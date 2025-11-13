import os
import pandas as pd
from fuzzywuzzy import process
import psycopg2

class SymptomPredictor:
    def __init__(self, csv_path=None):
        if csv_path is None:
            # Always resolve path relative to this file
            csv_path = os.path.join(os.path.dirname(__file__), '../data/disease_data.csv')
        self.df = pd.read_csv(csv_path)
        self.df.columns = self.df.columns.str.lower()  # Standardize column names to lowercase
        self.df['symptoms'] = self.df['symptoms'].apply(
            lambda x: [s.strip().lower() for s in x.split(',')]
        )
        self.symptom_vocab = sorted({sym for symptoms in self.df['symptoms'] for sym in symptoms})

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
        if csv_path is None:
            csv_path = os.path.join(os.path.dirname(__file__), '../data/greetings.csv')
        self.df = pd.read_csv(csv_path)
        self.greetings = self.df['greeting'].str.lower().tolist()
        self.responses = dict(zip(self.df['greeting'].str.lower(), self.df['response']))

    def get_response(self, user_input):
        user_input = user_input.lower().strip()
        match, score = process.extractOne(user_input, self.greetings)
        if score > 80:
            return self.responses.get(match)
        return None

# Placeholder for login and signup functionality
# This will be expanded to include authentication using a PostgreSQL database

def login(email, password):
    # Only allow login with email
    conn = psycopg2.connect("dbname=symptomai user=postgres password=fiqueboi")
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user

def signup(username, email, password):
    # Signup logic with email
    conn = psycopg2.connect("dbname=symptomai user=postgres password=fiqueboi")
    cur = conn.cursor()
    cur.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, password))
    conn.commit()
    cur.close()
    conn.close()
