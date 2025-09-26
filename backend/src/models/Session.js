import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  conversationText: {
    type: String,
    required: true,
    maxlength: 50000 // Limit conversation text to 50KB
  },
  summary: {
    overallMood: {
      type: String,
      enum: ['positive', 'neutral', 'negative', 'mixed'],
      required: true
    },
    moodScore: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    stressTriggers: [{
      type: String,
      maxlength: 500
    }],
    suggestions: [{
      type: String,
      maxlength: 1000
    }],
    keyTopics: [{
      type: String,
      maxlength: 100
    }],
    aiGeneratedSummary: {
      type: String,
      required: true,
      maxlength: 2000
    }
  },
  metadata: {
    messageCount: {
      type: Number,
      required: true,
      min: 1
    },
    sessionDuration: {
      type: Number, // in minutes
      min: 0
    },
    geminiModel: {
      type: String,
      default: 'gemini-1.5-flash'
    },
    processingTime: {
      type: Number // in milliseconds
    }
  }
}, {
  timestamps: true,
  collection: 'sessions'
});

// Indexes for better query performance
sessionSchema.index({ userId: 1, date: -1 });
sessionSchema.index({ 'summary.overallMood': 1, date: -1 });
sessionSchema.index({ createdAt: -1 });

// Virtual for formatted date
sessionSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString();
});

// Method to get session summary
sessionSchema.methods.getSummary = function() {
  return {
    sessionId: this.sessionId,
    userId: this.userId,
    date: this.date,
    overallMood: this.summary.overallMood,
    moodScore: this.summary.moodScore,
    messageCount: this.metadata.messageCount,
    aiGeneratedSummary: this.summary.aiGeneratedSummary,
    suggestions: this.summary.suggestions
  };
};

// Static method to find user sessions
sessionSchema.statics.findByUserId = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ date: -1 })
    .limit(limit)
    .select('sessionId date summary.overallMood summary.moodScore summary.aiGeneratedSummary metadata.messageCount');
};

// Pre-save middleware to ensure sessionId is set
sessionSchema.pre('save', function(next) {
  if (!this.sessionId) {
    this.sessionId = new mongoose.Types.ObjectId().toString();
  }
  next();
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;