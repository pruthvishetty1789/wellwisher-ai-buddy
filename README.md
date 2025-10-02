📌 Overview

Well-Wisher AI is a digital mental health and psychological support system designed for students in higher education.
It provides empathetic AI-powered conversations, mood tracking, wellness reminders, and emergency support, ensuring students receive timely guidance, reflection tools, and crisis alerts.

This project addresses the rising mental health concerns among students by combining conversational AI, predictive analytics, and accessible digital tools into a scalable platform.

🎯 Problem Statement

Students in higher education often face stress, anxiety, and depression due to academic and personal pressures. Traditional counseling is limited by stigma, accessibility, and availability of professionals.
There is a need for a 24/7, accessible, secure, and empathetic digital assistant to provide immediate psychological support and wellness guidance.

🌟 Key Features

🤖 AI-Powered Chat Assistant – Conversational support using Google Gemini API, offering empathetic dialogue 24/7.

⏰ Wellness Reminders – Automated, personalized nudges for mindfulness, journaling, hydration, and self-care.

📊 Mood Dashboard – Visual trend analysis of moods and daily check-ins to encourage self-reflection.

🚨 Emergency Panic Alert – One-click SOS to instantly notify parents/close contacts in times of distress.

🔮 Future Scope – Predictive mood analysis, OS-level offline alerts, and a dedicated mobile app.

🏗️ Technical Architecture

Frontend: React.js / Next.js (SSR + SEO), Tailwind CSS for responsive and clean UI
Backend: Node.js + Express (REST/GraphQL APIs)
Database: MongoDB / Firebase Firestore for secure storage
AI Integration: Google Gemini API for NLP, sentiment-aware responses
Communication Layer: Twilio / Firebase Cloud Messaging for reminders & alerts
Security: End-to-end encryption + anonymized mood data

# Wellwisher AI Buddy - Backend API

This is the backend API for the Wellwisher AI Buddy wellness application. It provides endpoints for saving and analyzing chat sessions using Google's Gemini AI.

## Features

- 🤖 **AI-Powered Analysis**: Integrates with Google Gemini AI to analyze conversations
- 📊 **Mood Tracking**: Tracks user mood, stress triggers, and wellness insights
- 🗄️ **MongoDB Integration**: Stores session data with comprehensive metadata
- 🔒 **Security**: Rate limiting, CORS protection, input validation
- 📈 **Analytics**: Provides mood analytics and trend data

## API Endpoints

### Core Endpoints

#### `POST /api/session/save`
Saves a conversation session with AI analysis.

**Request Body:**
```json
{
  "conversationText": "Full conversation text between user and bot",
  "userId": "unique_user_identifier",
  "sessionDuration": 15, // optional, in minutes
  "messageCount": 8 // optional, will be calculated if not provided
}
```

**Response:**
```json
{
  "sessionId": "uuid-v4-session-id",
  "userId": "user123",
  "date": "2025-09-26T10:30:00.000Z",
  "summary": {
    "overallMood": "positive",
    "moodScore": 7,
    "stressTriggers": ["work pressure", "sleep issues"],
    "suggestions": ["Practice deep breathing", "Set sleep schedule"],
    "keyTopics": ["anxiety", "coping strategies"],
    "aiGeneratedSummary": "User showed positive engagement with wellness topics..."
  },
  "metadata": {
    "messageCount": 8,
    "sessionDuration": 15,
    "geminiModel": "gemini-1.5-flash",
    "processingTime": 2500,
    "totalProcessingTime": 3200
  }
}
```

#### `GET /api/session/user/:userId`
Get all sessions for a specific user.

**Query Parameters:**
- `limit`: Number of sessions to return (default: 10)
- `skip`: Number of sessions to skip for pagination (default: 0)

#### `GET /api/session/:sessionId`
Get a specific session by ID.

#### `GET /api/session/analytics/:userId`
Get mood analytics for a user over a specified period.

**Query Parameters:**
- `days`: Number of days to analyze (default: 30)

### Utility Endpoints

#### `GET /api/health`
Health check endpoint.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/wellwisher-ai-buddy
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wellwisher-ai-buddy

# Google Gemini AI Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Other settings...
```

### 3. Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

### 4. Set up MongoDB

#### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. The database will be created automatically when first used

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get the connection string and add it to `.env`
4. Make sure to whitelist your IP address

### 5. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001` (or the PORT specified in your `.env`).

## Project Structure

```
backend/
├── src/
│   ├── models/
│   │   └── Session.js          # MongoDB session schema
│   ├── routes/
│   │   └── sessionRoutes.js    # API route handlers
│   ├── services/
│   │   └── GeminiService.js    # Gemini AI integration
│   └── server.js               # Main server file
├── package.json
├── .env.example
└── README.md
```

## Data Models

### Session Schema
```javascript
{
  sessionId: String,      // Unique session identifier
  userId: String,         // User identifier
  date: Date,            // Session timestamp
  conversationText: String, // Full conversation
  summary: {
    overallMood: String,    // positive|neutral|negative|mixed
    moodScore: Number,      // 1-10 scale
    stressTriggers: [String], // Identified stress causes
    suggestions: [String],    // AI-generated suggestions
    keyTopics: [String],     // Main conversation topics
    aiGeneratedSummary: String // Professional summary
  },
  metadata: {
    messageCount: Number,     // Number of messages in conversation
    sessionDuration: Number,  // Duration in minutes
    geminiModel: String,      // AI model used
    processingTime: Number    // AI processing time in ms
  }
}
```

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Validation errors
- **404 Not Found**: Session not found
- **500 Internal Server Error**: Server or database errors
- **503 Service Unavailable**: AI service unavailable

## Security Features

- Rate limiting (100 requests per 15 minutes by default)
- CORS protection
- Input validation and sanitization
- Helmet.js security headers
- Environment-based error messages

## Performance Considerations

- MongoDB indexes for efficient queries
- Response size optimization (conversation text excluded from list responses)
- Configurable rate limiting
- Processing time tracking

## Testing the API

You can test the API using curl or any HTTP client:

```bash
# Health check
curl http://localhost:3001/api/health

# Save a session
curl -X POST http://localhost:3001/api/session/save \
  -H "Content-Type: application/json" \
  -d '{
    "conversationText": "User: I am feeling anxious about work.\nAssistant: I understand that work anxiety can be overwhelming...",
    "userId": "test-user-123"
  }'
```

## Monitoring and Logs

The server logs important events:
- MongoDB connection status
- Session processing times
- Error details (in development mode)
- API request patterns

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Update documentation for new endpoints
5. Test with various conversation types

## License

MIT License - See LICENSE file for details

🔄 Project Flow

User logs in → Secure authentication (Firebase/Auth).

AI Chat Support → Gemini API provides empathetic, context-aware responses.

Mood Check-ins → Students log daily mood states.

Dashboard Visualization → Trends and insights displayed in an interactive UI.

Reminders & Alerts → Push notifications for wellness tasks; panic alert system triggers SOS.

✅ Feasibility & Viability

Technically Achievable with existing APIs and frameworks.

Cost-Effective – PWA-based scalable solution, expandable to mobile apps.

Security First – End-to-end encryption, anonymized data, and transparent usage policies.

Scalable – Cloud-native architecture supports high concurrency and large student populations.

🌍 Impact & Benefits

For Students – Empowers with emotional support, reduces stress-related risks, and builds resilience.

For Institutions – Offers scalable, affordable student support, reducing burden on counseling centers.

For Society – Promotes mental well-being, reduces stigma, and contributes to lowering suicide rates.

📚 References

Upjohn Institute Study (2020) – 15% reduction in suicide attempts via school programs.

WHO India – High youth suicide mortality (15–29 yrs).

BMC Psychiatry (2023) – Suicide rate in India (~12 per 100,000 in 2021).

Child & Adolescent Psychiatry (2024) – High adolescent suicide rates in India.

🚀 Future Roadmap

Mobile app with offline mode and predictive mood analysis.

Integration with wearables for stress level monitoring (heart rate, sleep patterns).

Gamification of wellness – badges, streaks, and community-based motivation.

👨‍💻 Team – Neural Ninjas

We are passionate innovators committed to leveraging AI for social good, ensuring students receive the mental health support they truly deserve.
