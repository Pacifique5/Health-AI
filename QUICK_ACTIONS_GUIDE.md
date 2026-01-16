# 🎯 Quick Actions Feature Guide

## Overview
The Quick Actions feature provides users with specialized forms for common health-related tasks. Instead of navigating to different pages, users can access these features through modal dialogs directly from the dashboard.

## 📋 Available Quick Actions

### 1. 🔍 Check Symptoms
**Purpose**: Comprehensive symptom analysis with detailed information collection

**Form Fields**:
- **Symptoms** (Required): Text area for describing symptoms
- **Duration**: Dropdown with options:
  - Less than a day
  - 1-3 days
  - 4-7 days
  - 1-2 weeks
  - More than 2 weeks
- **Severity Level**: Button group (Mild, Moderate, Severe)

**Features**:
- Emergency warning for severe cases
- Information about AI analysis
- Direct submission to symptom analyzer

**Example Usage**:
```
Symptoms: "headache, fever, body aches"
Duration: "1-3 days"
Severity: "Moderate"
```

---

### 2. ❤️ Heart Health
**Purpose**: Cardiovascular health assessment and risk evaluation

**Form Fields**:
- **Heart Concerns** (Required): Text area for specific concerns
- **Age**: Number input
- **Blood Pressure**: Text input (e.g., "120/80")
- **Risk Factors**: Multi-select checkboxes
  - Smoking
  - High cholesterol
  - Diabetes
  - Family history
  - Sedentary lifestyle

**Features**:
- Emergency chest pain warning
- Comprehensive risk factor assessment
- Personalized heart health insights

**Example Usage**:
```
Concerns: "irregular heartbeat, occasional chest discomfort"
Age: "45"
Blood Pressure: "130/85"
Risk Factors: ["High cholesterol", "Family history"]
```

---

### 3. 🛡️ Preventive Care
**Purpose**: Proactive health management and wellness recommendations

**Form Fields**:
- **Care Type** (Required): Dropdown with options:
  - Vaccinations & Immunizations
  - Health Screenings
  - Nutrition & Diet
  - Exercise & Fitness
  - Mental Health
  - Sleep Hygiene
  - Stress Management
- **Age Group**: Dropdown
  - Child (0-12)
  - Teen (13-19)
  - Adult (20-64)
  - Senior (65+)
- **Health Goals**: Text area for specific goals

**Features**:
- Age-appropriate recommendations
- Personalized preventive care plans
- Health goal tracking

**Example Usage**:
```
Care Type: "Nutrition & Diet"
Age Group: "Adult (20-64)"
Goals: "Lose weight, improve energy levels"
```

---

### 4. ⏰ Medication Reminder
**Purpose**: Medication tracking and reminder setup

**Form Fields**:
- **Medication Name** (Required): Text input
- **Dosage** (Required): Text input (e.g., "500mg")
- **Frequency** (Required): Dropdown
  - Once daily
  - Twice daily
  - Three times daily
  - As needed
  - Weekly
- **Reminder Times**: Multi-select checkboxes
  - Morning
  - Afternoon
  - Evening
  - Night
- **Special Instructions**: Text area

**Features**:
- Local storage of medication schedules
- Multiple reminder time options
- Special instruction notes

**Example Usage**:
```
Medication: "Metformin"
Dosage: "500mg"
Frequency: "Twice daily"
Reminder Times: ["Morning", "Evening"]
Instructions: "Take with meals"
```

---

## 🎨 User Experience

### Modal Design
- **Full-screen overlay** with backdrop blur
- **Responsive layout** that works on all devices
- **Smooth animations** for opening/closing
- **Color-coded** by action type:
  - Blue/Cyan: Check Symptoms
  - Red/Pink: Heart Health
  - Green/Emerald: Preventive Care
  - Purple/Violet: Medication Reminder

### Interaction Flow
1. User clicks on a quick action card
2. Modal opens with relevant form
3. User fills in information
4. Form validates required fields
5. User submits or cancels
6. Data is formatted and sent to chat
7. AI provides personalized response

### Data Handling
- Form data is formatted into natural language
- Sent as a chat message to the AI
- AI analyzes and provides recommendations
- Conversation is saved in history

---

## 🔧 Technical Implementation

### Component Structure
```
QuickActionModal
├── Modal Container (overlay + backdrop)
├── Header (title + close button)
└── Content (dynamic based on action type)
    ├── Form Fields
    ├── Information Alerts
    └── Action Buttons
```

### State Management
- `showQuickActionModal`: Controls modal visibility
- `quickActionType`: Determines which form to show
- `formData`: Stores user input
- Form submission triggers chat message

### Integration
- Seamlessly integrates with existing chat system
- Uses same message sending mechanism
- Maintains conversation context
- Saves to user's conversation history

---

## 📱 Responsive Design

### Desktop (1024px+)
- Modal width: 672px (max-w-2xl)
- Two-column grid for some fields
- Full form visibility

### Tablet (768px - 1023px)
- Modal width: 90% of viewport
- Adjusted grid layouts
- Optimized spacing

### Mobile (< 768px)
- Full-width modal with padding
- Single-column layouts
- Touch-optimized buttons
- Scrollable content

---

## ⚠️ Safety Features

### Emergency Warnings
- **Check Symptoms**: General emergency guidance
- **Heart Health**: Specific chest pain warning with emergency number
- **All Forms**: Clear call-to-action for emergencies

### Data Privacy
- All data stored locally
- No external transmission without user action
- Clear privacy notices in forms

### Validation
- Required field indicators
- Input format validation
- Error messages for invalid data
- Prevents empty submissions

---

## 🎯 Benefits

### For Users
- **Quick Access**: No page navigation required
- **Guided Input**: Structured forms ensure complete information
- **Context Preservation**: Stays on dashboard, maintains flow
- **Better Results**: Detailed input leads to better AI responses

### For Healthcare
- **Comprehensive Data**: Structured collection of relevant information
- **Better Triage**: Severity and duration help prioritize cases
- **Risk Assessment**: Systematic evaluation of health factors
- **Medication Safety**: Proper tracking reduces errors

---

## 🚀 Future Enhancements

### Planned Features
1. **Save Templates**: Save frequently used medication reminders
2. **History Tracking**: View past symptom reports
3. **Notifications**: Browser notifications for medication reminders
4. **Export Data**: Download health records
5. **Integration**: Connect with health tracking devices
6. **Multi-language**: Support for local languages

### Advanced Features
- Voice input for symptoms
- Image upload for visual symptoms
- Integration with pharmacy systems
- Telemedicine appointment booking
- Health metrics dashboard

---

## 📊 Usage Statistics (To Be Implemented)

Track user engagement with quick actions:
- Most used action type
- Average form completion time
- Submission success rate
- User satisfaction ratings

---

## 🎉 Summary

The Quick Actions feature transforms the SymptomAI dashboard into a comprehensive health management tool. By providing specialized forms for common tasks, users can:

✅ Get more accurate AI responses
✅ Save time with guided input
✅ Stay organized with structured data
✅ Access features without leaving the dashboard
✅ Receive personalized health recommendations

**Access**: Available on the dashboard when no messages are present, or can be accessed anytime through the quick action cards.