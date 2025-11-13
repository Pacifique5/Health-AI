from app.predictor import SymptomPredictor

def main():
    print("🧠 Welcome to SymptomAI – Your Smart Health Assistant")
    print("Type 'exit' anytime to quit.")

    predictor = SymptomPredictor()

    while True:
        user_input = input("\n🤒 Enter your symptoms (comma-separated):\n> ")
        if user_input.lower() == "exit":
            print("👋 Stay safe! Goodbye.")
            break

        user_symptoms = [s.strip() for s in user_input.split(",")]
        result = predictor.match_disease(user_symptoms)

        if result:
            print(f"\n✅ Possible Disease: {result['disease'].title()}")
            print(f"📄 Description: {result['description']}")
            print(f"💊 Medications: {', '.join(result['medications'])}")
            print(f"🛠️ Procedures: {', '.join(result['procedures'])}")
            print(f"🧼 Precautions: {', '.join(result['precautions'])}")
            print(f"👨‍⚕️ Specialist to Consult: {result['specialist']}")
        else:
            print("⚠️ Sorry, no matching disease found. Please try again with more specific symptoms.")

if __name__ == "__main__":
    main()