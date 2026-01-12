# 🔐 SymptomAI Authentication Guide

## Complete Authentication Flow

### 🚀 How to Use the Application

1. **Open the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

2. **Create a New Account**
   - Click "Create one" on the login page
   - Fill in your details:
     - Username: Your display name (e.g., "John Doe")
     - Email: Your email address (e.g., "john@example.com")
     - Password: Your secure password
   - Click "Signup"
   - You'll be redirected to login

3. **Login to Your Account**
   - Enter your email and password
   - Click "Sign In"
   - You'll be taken to the main dashboard

4. **Profile Features**
   - Your registered name appears in the sidebar profile
   - Click on your profile to see dropdown menu with:
     - 📱 Download mobile App
     - ⚙️ Settings
     - 📧 Contact us
     - 🚪 Log out

## 🧪 Test Accounts

### Pre-created Accounts:
- **Admin Account**
  - Email: `admin@example.com`
  - Password: `admin123`
  - Display Name: "Admin User"

- **Test Account**
  - Email: `user@example.com`
  - Password: `user123`
  - Display Name: "Test User"

### Custom Account (Created via API):
- **John Doe**
  - Email: `john@example.com`
  - Password: `password123`
  - Display Name: "John Doe"

## ⚙️ Profile Dropdown Functionality

### 📱 Download Mobile App
- Shows information about upcoming mobile app
- Offers to notify user when app is ready
- Displays features of the mobile app

### ⚙️ Settings
- **Profile Tab**: Edit username and email
- **Notifications Tab**: Configure email and health reminders
- **Privacy Tab**: Data collection preferences, export/clear data
- **Appearance Tab**: Light/Dark/Auto theme selection
- **Language Tab**: Interface language selection

### 📧 Contact Us
- Opens email client with pre-filled support email
- Shows contact information including phone and website
- Provides comprehensive support details

### 🚪 Log Out
- Saves current conversation history
- Clears authentication tokens
- Redirects to login page

## 🔒 Security Features

### Authentication Protection
- All pages require login except login/signup
- AuthGuard component protects routes
- Automatic redirect to login if not authenticated

### Data Storage
- User info stored in localStorage
- Conversations saved per user
- Settings persisted locally
- Secure logout process

### Error Handling
- Comprehensive error messages
- Validation for email format
- Username requirements (3+ characters, alphanumeric + underscore)
- Password requirements

## 🎯 User Experience Flow

1. **First Visit**: Redirected to login page
2. **New User**: Can create account via signup
3. **Returning User**: Login with credentials
4. **Dashboard**: Full access to chat interface
5. **Profile Management**: Update info via settings
6. **Data Control**: Export or clear personal data
7. **Logout**: Secure session termination

## 🛠️ Technical Implementation

### Frontend (Next.js)
- Route protection with AuthGuard
- Local storage for user data
- Real-time form validation
- Responsive design

### Backend (Flask)
- In-memory user storage (development)
- RESTful API endpoints
- CORS enabled
- Comprehensive error handling

### Integration
- API proxy configuration
- Automatic token management
- User session persistence
- Cross-component state management

## 📝 Testing Checklist

- ✅ Signup with new account
- ✅ Login with existing account
- ✅ Profile shows correct username
- ✅ Settings modal functionality
- ✅ Download app information
- ✅ Contact us functionality
- ✅ Logout process
- ✅ Route protection
- ✅ Data persistence
- ✅ Error handling

---

🎉 **Your authentication system is fully functional!**

Users must now login/signup to access the application, and their registered name appears in the profile with fully functional dropdown options.