#!/usr/bin/env python3
"""
Start both backend and frontend services for SymptomAI
"""
import subprocess
import sys
import os
import time
import threading
from pathlib import Path

def start_backend():
    """Start the backend server"""
    print("🔧 Starting Backend Server...")
    backend_path = Path("backend")
    if not backend_path.exists():
        print("❌ Backend directory not found!")
        return False
    
    try:
        # Change to backend directory and start server
        os.chdir(backend_path)
        subprocess.run([sys.executable, "api_server.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped by user")
    except Exception as e:
        print(f"❌ Backend error: {e}")
    finally:
        os.chdir("..")

def start_frontend():
    """Start the frontend server"""
    print("🌐 Starting Frontend Server...")
    frontend_path = Path("ai-web")
    if not frontend_path.exists():
        print("❌ Frontend directory not found!")
        return False
    
    try:
        # Change to frontend directory and start server
        os.chdir(frontend_path)
        
        # Install dependencies if needed
        if not Path("node_modules").exists():
            print("📦 Installing frontend dependencies...")
            subprocess.run(["npm", "install"], check=True)
        
        # Start development server
        subprocess.run(["npm", "run", "dev"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Frontend server stopped by user")
    except Exception as e:
        print(f"❌ Frontend error: {e}")
    finally:
        os.chdir("..")

def main():
    print("🚀 SymptomAI - Starting All Services")
    print("=" * 50)
    
    # Check if directories exist
    if not Path("backend").exists():
        print("❌ Backend directory not found!")
        sys.exit(1)
    
    if not Path("ai-web").exists():
        print("❌ Frontend directory not found!")
        sys.exit(1)
    
    print("📋 Services to start:")
    print("  - Backend API (Python Flask) -> http://localhost:5000")
    print("  - Frontend Web App (Next.js) -> http://localhost:3001")
    print("\n⚠️  Note: You'll need to start each service in separate terminals")
    print("   Or use the individual startup commands:")
    print("   Backend:  cd backend && python api_server.py")
    print("   Frontend: cd ai-web && npm run dev")
    
    choice = input("\n🤔 Start backend first? (y/n): ").lower().strip()
    
    if choice == 'y':
        print("\n🔧 Starting backend server...")
        print("   After backend starts, open a new terminal and run:")
        print("   cd ai-web && npm run dev")
        start_backend()
    else:
        print("\n📝 Manual startup instructions:")
        print("   Terminal 1: cd backend && python api_server.py")
        print("   Terminal 2: cd ai-web && npm run dev")

if __name__ == "__main__":
    main()