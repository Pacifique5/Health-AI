#!/usr/bin/env python3
"""
Production deployment script for SymptomAI Backend
"""
import os
import sys
import subprocess

def install_production_dependencies():
    """Install production dependencies"""
    print("📦 Installing production dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        subprocess.check_call([sys.executable, "-m", "pip", "install", "gunicorn"])
        print("✅ Dependencies installed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def run_production_server():
    """Run the server with Gunicorn for production"""
    print("🚀 Starting production server with Gunicorn...")
    print("Server will be available at: http://localhost:5000")
    
    try:
        # Run with Gunicorn for better production performance
        subprocess.run([
            "gunicorn",
            "--bind", "0.0.0.0:5000",
            "--workers", "4",
            "--timeout", "120",
            "--access-logfile", "-",
            "--error-logfile", "-",
            "api_server:app"
        ])
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)

def main():
    print("🏭 SymptomAI Production Deployment")
    print("=" * 40)
    
    if not install_production_dependencies():
        sys.exit(1)
    
    run_production_server()

if __name__ == "__main__":
    main()