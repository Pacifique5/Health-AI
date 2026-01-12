#!/usr/bin/env python3
"""
SymptomAI Backend Server Startup Script
"""
import sys
import os
import subprocess

def check_dependencies():
    """Check if all required dependencies are installed"""
    try:
        import pandas
        import flask
        import flask_cors
        import fuzzywuzzy
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Installing requirements...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
            print("✅ Dependencies installed successfully")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies")
            return False

def check_data_files():
    """Check if required data files exist"""
    required_files = [
        'data/disease_data.csv',
        'data/greetings.csv'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print(f"⚠️ Missing data files: {missing_files}")
        print("The server will still start but may have limited functionality")
    else:
        print("✅ All data files found")
    
    return True

def main():
    print("🚀 SymptomAI Backend Startup")
    print("=" * 40)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check data files
    check_data_files()
    
    # Start the server
    print("\n🌐 Starting Flask server...")
    print("Server will be available at: http://localhost:5000")
    print("Press Ctrl+C to stop the server")
    print("=" * 40)
    
    try:
        from api_server import app
        app.run(host="localhost", port=5000, debug=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()