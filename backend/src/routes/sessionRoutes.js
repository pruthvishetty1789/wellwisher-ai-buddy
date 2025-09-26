import express from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import Session from '../models/Session.js';
import GeminiService from '../services/GeminiService.js';

const router = express.Router();

// Initialize Gemini service
let geminiService;
try {
  geminiService = new GeminiService();
} catch (error) {
  console.error('Failed to initialize Gemini service:', error.message);
}

/**
 * POST /api/session/save
 * Save a conversation session with AI analysis
 */
router.post('/save', [
  // Validation middleware
  body('conversationText')
    .isString()
    .isLength({ min: 10, max: 50000 })
    .withMessage('Conversation text must be between 10 and 50,000 characters'),
  body('userId')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('User ID is required and must be less than 100 characters'),
  body('sessionDuration')
    .optional()
    .isNumeric()
    .withMessage('Session duration must be a number'),
  body('messageCount')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Message count must be a positive integer')
], async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Check if Gemini service is available
    if (!geminiService) {
      return res.status(500).json({
        error: 'AI analysis service is not available. Please check GEMINI_API_KEY configuration.'
      });
    }

    const { conversationText, userId, sessionDuration, messageCount } = req.body;
    
    // Generate unique session ID
    const sessionId = uuidv4();
    
    console.log(`Processing session ${sessionId} for user ${userId}`);

    // Analyze conversation with Gemini AI
    const analysis = await geminiService.analyzeConversation(conversationText, userId);
    
    // Calculate message count from conversation if not provided
    const calculatedMessageCount = messageCount || conversationText.split('\n').filter(line => 
      line.trim() && (line.includes('User:') || line.includes('Assistant:'))
    ).length || 1;

    // Create new session document
    const sessionData = {
      sessionId,
      userId,
      date: new Date(),
      conversationText,
      summary: {
        overallMood: analysis.overallMood,
        moodScore: analysis.moodScore,
        stressTriggers: analysis.stressTriggers,
        suggestions: analysis.suggestions,
        keyTopics: analysis.keyTopics,
        aiGeneratedSummary: analysis.aiGeneratedSummary
      },
      metadata: {
        messageCount: calculatedMessageCount,
        sessionDuration: sessionDuration || 0,
        geminiModel: analysis.metadata?.model || 'gemini-1.5-flash',
        processingTime: analysis.metadata?.processingTime || 0
      }
    };

    // Save to MongoDB
    const session = new Session(sessionData);
    await session.save();

    const totalProcessingTime = Date.now() - startTime;

    console.log(`Session ${sessionId} saved successfully in ${totalProcessingTime}ms`);

    // Return session data (excluding full conversation text for response size)
    const responseData = {
      sessionId: session.sessionId,
      userId: session.userId,
      date: session.date,
      summary: session.summary,
      metadata: {
        ...session.metadata,
        totalProcessingTime
      },
      message: 'Session saved successfully'
    };

    res.status(201).json(responseData);

  } catch (error) {
    console.error('Error saving session:', error);
    
    // Determine appropriate error response
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Database validation failed',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.message.includes('Gemini') || error.message.includes('AI')) {
      return res.status(503).json({
        error: 'AI analysis service temporarily unavailable',
        message: 'Please try again later'
      });
    }
    
    res.status(500).json({
      error: 'Failed to save session',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/session/user/:userId
 * Get all sessions for a specific user
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, skip = 0 } = req.query;
    
    const sessions = await Session.findByUserId(userId, parseInt(limit))
      .skip(parseInt(skip));
    
    const totalSessions = await Session.countDocuments({ userId });
    
    res.json({
      sessions: sessions.map(session => session.getSummary()),
      pagination: {
        total: totalSessions,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: totalSessions > (parseInt(skip) + parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({
      error: 'Failed to fetch sessions'
    });
  }
});

/**
 * GET /api/session/:sessionId
 * Get a specific session by ID
 */
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await Session.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }
    
    // Return full session data (excluding conversation text for privacy)
    const { conversationText, ...sessionData } = session.toObject();
    
    res.json({
      ...sessionData,
      hasConversationText: !!conversationText
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      error: 'Failed to fetch session'
    });
  }
});

/**
 * GET /api/session/analytics/:userId
 * Get mood analytics for a user
 */
router.get('/analytics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;
    
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - parseInt(days));
    
    const sessions = await Session.find({
      userId,
      date: { $gte: dateLimit }
    }).select('date summary.overallMood summary.moodScore').sort({ date: 1 });
    
    // Calculate analytics
    const moodCounts = sessions.reduce((acc, session) => {
      acc[session.summary.overallMood] = (acc[session.summary.overallMood] || 0) + 1;
      return acc;
    }, {});
    
    const averageMoodScore = sessions.length > 0 
      ? sessions.reduce((sum, session) => sum + session.summary.moodScore, 0) / sessions.length
      : 0;
    
    const moodTrend = sessions.map(session => ({
      date: session.date.toISOString().split('T')[0],
      mood: session.summary.overallMood,
      score: session.summary.moodScore
    }));
    
    res.json({
      period: `${days} days`,
      totalSessions: sessions.length,
      averageMoodScore: Math.round(averageMoodScore * 100) / 100,
      moodDistribution: moodCounts,
      moodTrend
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics'
    });
  }
});

export default router;