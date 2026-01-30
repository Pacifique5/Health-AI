# 📱 SymptomAI Mobile App - Complete UI/UX Specification

**Date Created**: January 18, 2026  
**Purpose**: Exact mobile recreation of web app UI/UX

---

## 🎨 Design System & Brand Identity

### Color Palette
```css
Primary Gradients:
- Blue to Cyan: from-blue-500 to-cyan-500 (#3B82F6 to #06B6D4)
- Blue to Purple: from-blue-600 to-purple-600 (#2563EB to #9333EA)
- Red to Pink: from-red-500 to-pink-500 (#EF4444 to #EC4899)
- Green to Emerald: from-green-500 to-emerald-500 (#10B981 to #059669)
- Purple to Violet: from-purple-500 to-violet-500 (#8B5CF6 to #7C3AED)

Background Colors:
- Main Background: gradient-to-br from-slate-50 via-blue-50 to-indigo-100
- Card Background: bg-white/80 with backdrop-blur-sm
- Sidebar: bg-slate-950 (dark)
- Emergency: from-red-500 to-red-600

Text Colors:
- Primary: text-gray-900
- Secondary: text-gray-600
- Light: text-gray-500
- White: text-white (on dark backgrounds)
```

### Typography
```css
Font Family: Inter (primary), Roboto Mono (monospace)
Sizes:
- Hero Title: text-4xl sm:text-5xl lg:text-6xl font-bold
- Page Title: text-3xl sm:text-4xl lg:text-5xl font-bold
- Section Title: text-2xl font-bold
- Card Title: text-xl font-bold
- Body: text-lg
- Small: text-sm
- Extra Small: text-xs
```

### Spacing & Layout
```css
Container: max-w-4xl mx-auto
Padding: p-4 sm:p-6 lg:p-8
Gaps: gap-3, gap-4, gap-6, gap-8
Rounded Corners: rounded-xl, rounded-2xl, rounded-3xl
Shadows: shadow-lg, shadow-xl, shadow-2xl
```

---

## 📱 Screen Specifications

### 1. SPLASH SCREEN
**Duration**: 2-3 seconds
**Background**: Gradient from-blue-500 to-cyan-500
**Content**:
- SymptomAI logo (Bot icon in rounded square)
- App name: "SymptomAI" (white text, bold)
- Tagline: "Your Smart Health Companion" (white, smaller)
- Loading indicator: White spinner at bottom

### 2. ONBOARDING SCREENS (3 screens, swipeable)

#### Screen 1: Welcome
**Background**: gradient-to-br from-slate-50 via-blue-50 to-indigo-100
**Content**:
- Large Bot icon with gradient background
- Title: "Welcome to SymptomAI"
- Subtitle: "Your AI-powered health assistant"
- Illustration: Chat bubbles showing AI conversation
- Skip button (top right)
- Next button (bottom)

#### Screen 2: Features
**Background**: Same gradient
**Content**:
- 4 feature cards in 2x2 grid:
  - Activity icon: "Symptom Analysis" (blue gradient)
  - Heart icon: "Heart Health" (red gradient)  
  - Shield icon: "Preventive Care" (green gradient)
  - Clock icon: "Medication Reminders" (purple gradient)
- Title: "Powerful Health Features"
- Subtitle: "Everything you need in one app"

#### Screen 3: Get Started
**Background**: Same gradient
**Content**:
- Checkmarks with benefits:
  - "24/7 AI-powered assistance"
  - "Instant symptom analysis"
  - "100% secure and private"
- Title: "Ready to Start?"
- Subtitle: "Join thousands of users"
- "Get Started" button (blue gradient)
- "Sign In" link

### 3. AUTHENTICATION SCREENS

#### Login Screen
**Background**: gradient-to-br from-slate-50 via-blue-50 to-indigo-100
**Decorative Elements**: 
- Floating gradient circles (blue/cyan, purple/pink)
- Blur effects

**Layout**: Single column, centered
**Content**:
- App logo and name at top
- "Sign In" title
- "Welcome back! Please enter your details." subtitle
- Email field with Mail icon
- Password field with Lock icon and show/hide toggle
- "Remember me" checkbox
- "Forgot password?" link
- "Sign In" button (blue gradient, full width)
- Divider: "New to SymptomAI?"
- "Create an account" link
- "Back to home" link
- Trust badge: "🔒 Your data is secure and encrypted"

**Error Handling**: Red banner with error message

#### Signup Screen
**Background**: Same as login
**Layout**: Same structure as login
**Content**:
- "Create Account" title
- "Start your health journey today" subtitle
- Username field with User icon
- Email field with Mail icon
- Password field with Lock icon and strength indicator
- Confirm password field with Lock icon
- Terms checkbox: "I agree to Terms of Service and Privacy Policy"
- "Create Account" button (blue gradient)
- Password strength indicator (weak/medium/strong with colors)
- "Already have an account?" → "Sign in instead"

### 4. MAIN DASHBOARD SCREEN

#### Layout Structure
**Left Sidebar** (collapsible on mobile):
- Width: 64 (desktop) / full screen overlay (mobile)
- Background: bg-slate-950 (dark theme)
- Content:
  - "All Conversations" header
  - "+ New Conversation" button (emerald)
  - Conversation list (scrollable)
  - Profile section at bottom with dropdown

**Main Content Area**:
- Background: gradient-to-br from-slate-50 via-blue-50 to-indigo-100
- Decorative floating gradient circles
- Header, chat area, input footer

#### Header Section
**Background**: bg-white/10 backdrop-blur-sm
**Content**:
- Left: SymptomAI logo with online indicator
- Right: Emergency button (red gradient) + "FIQUE'S-AI" badge

#### Chat Area (Empty State)
**Content**:
- Large MessageCircle icon in gradient circle
- "Welcome to SymptomAI" title
- "I'm here to help you understand your symptoms..." subtitle
- 4 Quick Action cards in 2x2 grid:
  - "Check symptoms" (Activity icon, blue gradient)
  - "Heart health" (Heart icon, red gradient)
  - "Preventive care" (Shield icon, green gradient)
  - "Medication reminder" (Clock icon, purple gradient)

#### Chat Area (With Messages)
**Message Bubbles**:
- User messages: Right-aligned, purple gradient background, white text
- Bot messages: Left-aligned, white background with border, dark text
- Avatar circles with User/Bot icons
- Timestamps below each message
- Typing indicator: 3 bouncing dots

#### Input Footer
**Background**: bg-white/10 backdrop-blur-sm
**Content**:
- Text input with Heart icon (right side)
- Send button (blue gradient)
- Disclaimer text below

#### Profile Dropdown Menu
**Trigger**: User avatar with name and "Online" status
**Menu Items**:
- "Download mobile App" (Download icon)
- "Settings" (Settings icon)
- "Contact us" (Mail icon)
- Divider
- "Log out" (LogOut icon, red text)

### 5. EMERGENCY MODAL
**Overlay**: Black/40 backdrop with blur
**Modal**: White background, rounded-3xl
**Header**: Blue gradient with AlertTriangle icon
**Content**:
- "When to Call Emergency Services" info box (blue)
- Emergency contact cards:
  - Each card shows: Icon, Name, Description, Phone number
  - Urgent contacts have red "URGENT" badge
  - Tap to call functionality
- "Additional Resources" section:
  - "Find Nearest Hospital" button
  - "Urgent Care Locator" button
- Rwanda-specific note at bottom

### 6. QUICK ACTION MODALS

#### Symptoms Modal
**Header**: Activity icon + "Check Symptoms"
**Form Fields**:
- Symptoms textarea (required)
- Duration dropdown
- Severity buttons (Mild/Moderate/Severe)
- Info box with blue border
**Buttons**: Cancel (outline) + "Analyze Symptoms" (blue gradient)

#### Heart Health Modal
**Header**: Heart icon + "Heart Health Check"
**Form Fields**:
- Concerns textarea (required)
- Age input
- Blood pressure input
- Risk factors checkboxes
- Emergency warning box (red)
**Buttons**: Cancel + "Get Heart Health Insights" (red gradient)

#### Preventive Care Modal
**Header**: Shield icon + "Preventive Care"
**Form Fields**:
- Care type dropdown (required)
- Age group dropdown
- Health goals textarea
- Success info box (green)
**Buttons**: Cancel + "Get Recommendations" (green gradient)

#### Medication Modal
**Header**: Clock icon + "Medication Reminder"
**Form Fields**:
- Medication name (required)
- Dosage (required)
- Frequency dropdown (required)
- Reminder times checkboxes
- Special instructions textarea
- Info box (purple)
**Buttons**: Cancel + "Set Reminder" (purple gradient)

### 7. SETTINGS MODAL
**Layout**: Sidebar navigation + content area
**Sidebar Tabs**:
- Profile (User icon)
- Notifications (Bell icon)
- Privacy (Shield icon)
- Appearance (Palette icon)
- Language (Globe icon)

**Profile Tab**:
- Username input
- Email input
- Save button with loading states

**Notifications Tab**:
- Email notifications toggle
- Health reminders toggle

**Privacy Tab**:
- Data collection toggle
- Conversation history toggle
- "Export My Data" button
- "Clear Conversation History" button (red)

**Appearance Tab**:
- Theme radio buttons (Light/Dark/Auto)

**Language Tab**:
- Language dropdown (English/Français/Kinyarwanda/Kiswahili)

---

## 🔄 Navigation Flow

```
Splash Screen
    ↓
Onboarding (3 screens) OR Login (if returning user)
    ↓
Login/Signup
    ↓
Dashboard
    ├── New Conversation
    ├── Select Conversation
    ├── Quick Actions → Modals
    ├── Emergency → Modal
    ├── Profile Dropdown
    │   ├── Settings → Modal
    │   ├── Contact Us
    │   ├── Download App
    │   └── Logout → Login
    └── Chat Interface
```

---

## 🎭 Animations & Interactions

### Micro-Animations
```css
Button Hover: hover:scale-105 transition-transform
Card Hover: hover:-translate-y-2 hover:shadow-xl
Loading: animate-spin (spinners)
Typing: animate-bounce with delays
Gradient: animate-gradient (background)
Float: animate-float (decorative elements)
```

### Transitions
```css
All interactive elements: transition-all duration-300
Modal appearance: animate-in slide-in-from-bottom-2 duration-200
Dropdown: animate-in slide-in-from-top duration-200
Page transitions: slide animations
```

### Loading States
- Spinners: White on colored backgrounds
- Skeleton loading for conversation list
- Typing indicators: 3 bouncing dots
- Button loading: spinner + "Loading..." text

---

## 📐 Responsive Design

### Breakpoints
```css
Mobile: < 640px (sm)
Tablet: 640px - 1024px (md/lg)
Desktop: > 1024px (xl)
```

### Mobile Adaptations
- Sidebar becomes full-screen overlay
- Cards stack vertically
- Text sizes scale down
- Touch targets minimum 44px
- Swipe gestures for navigation

---

## 🎯 Component Library

### Buttons
```jsx
Primary: bg-gradient-to-r from-blue-500 to-cyan-500
Secondary: border border-gray-300 bg-transparent
Destructive: bg-red-500
Ghost: hover:bg-gray-100
Sizes: sm (h-9), default (h-10), lg (h-11)
```

### Cards
```jsx
Base: rounded-xl border bg-white shadow-sm
Hover: hover:shadow-xl hover:-translate-y-2
Interactive: cursor-pointer
```

### Inputs
```jsx
Base: rounded-xl border px-3 py-2
Focus: focus:ring-2 focus:ring-blue-500
With Icons: pl-12 (left icon), pr-12 (right icon)
```

### Modals
```jsx
Overlay: fixed inset-0 bg-black/40 backdrop-blur-sm
Container: max-w-2xl rounded-3xl bg-white shadow-2xl
Header: sticky top-0 with close button
```

---

## 🔧 Technical Implementation Notes

### State Management
- User authentication state
- Conversation history (local storage)
- Settings (local storage)
- Current conversation
- Loading states
- Modal visibility states

### Local Storage Keys
```javascript
"authToken" - Authentication token
"userId" - User identifier
"userInfo" - User profile data
"conversations_{userId}" - User conversations
"appSettings" - App preferences
```

### API Integration
- Base URL: configurable (local/production)
- Endpoints: /api/health, /api/analyze, /api/login, /api/signup
- Error handling with user-friendly messages
- Retry logic for failed requests
- Offline mode support

### Platform-Specific Features
- Push notifications (medication reminders)
- Biometric authentication
- Deep linking
- Share functionality
- Camera integration (future: symptom photos)

---

## 🎨 Icon Library (Lucide React)

### Primary Icons
- Bot: App logo and AI messages
- User: User messages and profile
- Activity: Symptom analysis
- Heart: Heart health features
- Shield: Preventive care and security
- Clock: Medication reminders
- AlertTriangle: Emergency features
- MessageCircle: Chat and conversations

### UI Icons
- Send: Message sending
- X: Close modals/dismiss
- Menu: Mobile navigation
- Eye/EyeOff: Password visibility
- Mail: Email fields
- Lock: Password fields
- Settings: Settings access
- Download: App download
- LogOut: Sign out

---

## 🚨 Error States & Edge Cases

### Network Errors
- "Connection lost" banner
- Retry buttons
- Offline mode indicator
- Cached responses

### Form Validation
- Real-time validation
- Error messages below fields
- Disabled submit buttons
- Success confirmations

### Empty States
- No conversations: Welcome message
- No search results: "No matches found"
- Loading states: Skeleton screens

---

## 🔒 Security & Privacy

### Data Protection
- Local storage encryption
- Secure token storage
- Auto-logout on inactivity
- Clear data on logout

### Privacy Features
- Data export functionality
- Conversation deletion
- Analytics opt-out
- Privacy policy links

---

## 📱 Platform Guidelines

### iOS Specific
- Follow iOS Human Interface Guidelines
- Use native navigation patterns
- Implement haptic feedback
- Support Dynamic Type
- Dark mode support

### Android Specific
- Follow Material Design principles
- Use native Android components
- Support system themes
- Implement proper back navigation
- Support accessibility services

---

## 🎯 Success Metrics

### Core Functionality
- [ ] User can sign up/login
- [ ] User can send messages and receive AI responses
- [ ] Quick actions work correctly
- [ ] Emergency contacts accessible
- [ ] Settings save properly
- [ ] Conversations persist

### User Experience
- [ ] Smooth animations (60fps)
- [ ] Fast loading times (<2s)
- [ ] Intuitive navigation
- [ ] Accessible to all users
- [ ] Works offline (basic features)

---

## 🚀 Development Phases

### Phase 1: Core UI (Week 1)
- Authentication screens
- Basic dashboard layout
- Chat interface
- Navigation structure

### Phase 2: Features (Week 2)
- Quick action modals
- Settings modal
- Emergency modal
- API integration

### Phase 3: Polish (Week 3)
- Animations and transitions
- Error handling
- Loading states
- Responsive design

### Phase 4: Testing (Week 4)
- Device testing
- Performance optimization
- Accessibility testing
- Bug fixes

---

## 💡 Implementation Tips

### React Native
```jsx
// Gradient backgrounds
import LinearGradient from 'react-native-linear-gradient';

// Animations
import Animated from 'react-native-reanimated';

// Icons
import Icon from 'react-native-vector-icons/Lucide';

// Navigation
import { NavigationContainer } from '@react-navigation/native';
```

### Flutter
```dart
// Gradients
Container(
  decoration: BoxDecoration(
    gradient: LinearGradient(
      colors: [Colors.blue, Colors.cyan],
    ),
  ),
)

// Animations
AnimatedContainer(
  duration: Duration(milliseconds: 300),
)
```

---

## 📋 Checklist for Mobile Implementation

### UI Components
- [ ] Recreate exact color gradients
- [ ] Implement all button variants
- [ ] Create card components with hover effects
- [ ] Build modal system
- [ ] Implement form components

### Screens
- [ ] Splash screen with logo animation
- [ ] Onboarding flow (3 screens)
- [ ] Login screen (exact layout)
- [ ] Signup screen (exact layout)
- [ ] Dashboard with sidebar
- [ ] Chat interface
- [ ] All modal screens

### Functionality
- [ ] Authentication flow
- [ ] Chat messaging
- [ ] Quick actions
- [ ] Emergency contacts
- [ ] Settings management
- [ ] Data persistence

### Polish
- [ ] Smooth animations
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive design
- [ ] Accessibility

---

**This specification ensures the mobile app will be an exact replica of the web application's UI/UX, maintaining brand consistency and user experience across platforms.**

**Ready for mobile development! 🚀📱**