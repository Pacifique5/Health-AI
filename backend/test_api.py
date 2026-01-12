#!/usr/bin/env python3
"""
Simple API test script for SymptomAI Backend
"""
import requests
import json

BASE_URL = "http://localhost:5000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_symptom_analysis():
    """Test symptom analysis endpoint"""
    print("\n🔍 Testing symptom analysis...")
    test_cases = [
        {"symptoms": "headache, nausea, vomiting"},
        {"symptoms": "fever, cough, fatigue"},
        {"symptoms": "skin rash, itching"},
        {"symptoms": "hello"},  # Should trigger greeting
    ]
    
    for test_case in test_cases:
        try:
            response = requests.post(
                f"{BASE_URL}/api/analyze",
                json=test_case,
                headers={"Content-Type": "application/json"}
            )
            print(f"\nInput: {test_case['symptoms']}")
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                print(f"Response: {result.get('message', 'No message')[:100]}...")
            else:
                print(f"Error: {response.json()}")
        except Exception as e:
            print(f"❌ Test failed: {e}")

def test_authentication():
    """Test login and signup endpoints"""
    print("\n🔍 Testing authentication...")
    
    # Test login with valid credentials
    print("Testing login...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/login",
            json={"username": "admin@example.com", "password": "admin123"},
            headers={"Content-Type": "application/json"}
        )
        print(f"Login Status: {response.status_code}")
        print(f"Login Response: {response.json()}")
    except Exception as e:
        print(f"❌ Login test failed: {e}")
    
    # Test signup
    print("\nTesting signup...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/signup",
            json={"username": "testuser", "email": "test@example.com", "password": "test123"},
            headers={"Content-Type": "application/json"}
        )
        print(f"Signup Status: {response.status_code}")
        print(f"Signup Response: {response.json()}")
    except Exception as e:
        print(f"❌ Signup test failed: {e}")

def main():
    print("🧪 SymptomAI Backend API Tests")
    print("=" * 40)
    
    # Test if server is running
    if not test_health():
        print("❌ Server is not running. Please start the server first:")
        print("   python api_server.py")
        return
    
    # Run all tests
    test_symptom_analysis()
    test_authentication()
    
    print("\n✅ All tests completed!")

if __name__ == "__main__":
    main()