import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is required in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  /**
   * Analyze conversation and generate wellness insights
   * @param {string} conversationText - The full conversation text
   * @param {string} userId - User ID for context
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeConversation(conversationText, userId) {
    const startTime = Date.now();
    
    try {
      const prompt = this.buildAnalysisPrompt(conversationText);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the structured response
      const analysis = this.parseAnalysisResponse(text);
      
      const processingTime = Date.now() - startTime;
      
      return {
        ...analysis,
        metadata: {
          processingTime,
          model: 'gemini-2.0-flash',
          userId
        }
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`Failed to analyze conversation: ${error.message}`);
    }
  }

  /**
   * Build the analysis prompt for Gemini
   * @param {string} conversationText - The conversation to analyze
   * @returns {string} The formatted prompt
   */
  buildAnalysisPrompt(conversationText) {
    return `You are a compassionate AI wellness analyst. Analyze the following conversation between a user and a wellness chatbot. Provide insights that would help track the user's mental health journey.

CONVERSATION:
${conversationText}

Please analyze this conversation and respond with a JSON object containing the following structure:

{
  "overallMood": "positive|neutral|negative|mixed",
  "moodScore": <number between 1-10, where 1 is very negative, 10 is very positive>,
  "stressTriggers": ["trigger1", "trigger2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "keyTopics": ["topic1", "topic2", ...],
  "aiGeneratedSummary": "A compassionate 2-3 sentence summary of the user's emotional state and main concerns"
}

Guidelines:
- overallMood: Assess the dominant emotional tone
- moodScore: Rate overall positivity/negativity (consider context of mental health)
- stressTriggers: Identify specific things causing stress/anxiety (max 5)
- suggestions: Provide 3-5 actionable, gentle wellness suggestions
- keyTopics: Main themes discussed (emotions, situations, etc.)
- aiGeneratedSummary: Write as if speaking to a mental health professional

Focus on empathy, actionable insights, and respect for the user's emotional state. Avoid clinical diagnoses.`;
  }

  /**
   * Parse the Gemini response and extract structured data
   * @param {string} responseText - Raw response from Gemini
   * @returns {Object} Parsed analysis data
   */
  parseAnalysisResponse(responseText) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate required fields and provide defaults
      return {
        overallMood: this.validateMood(parsed.overallMood) || 'neutral',
        moodScore: this.validateMoodScore(parsed.moodScore) || 5,
        stressTriggers: Array.isArray(parsed.stressTriggers) 
          ? parsed.stressTriggers.slice(0, 5).map(t => String(t).substring(0, 500))
          : [],
        suggestions: Array.isArray(parsed.suggestions) 
          ? parsed.suggestions.slice(0, 5).map(s => String(s).substring(0, 1000))
          : [],
        keyTopics: Array.isArray(parsed.keyTopics) 
          ? parsed.keyTopics.slice(0, 10).map(t => String(t).substring(0, 100))
          : [],
        aiGeneratedSummary: String(parsed.aiGeneratedSummary || 'Conversation analyzed successfully.').substring(0, 2000)
      };
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      // Return fallback analysis
      return this.getFallbackAnalysis(responseText);
    }
  }

  /**
   * Validate mood value
   * @param {string} mood - Mood to validate
   * @returns {string|null} Valid mood or null
   */
  validateMood(mood) {
    const validMoods = ['positive', 'neutral', 'negative', 'mixed'];
    return validMoods.includes(mood) ? mood : null;
  }

  /**
   * Validate mood score
   * @param {number} score - Score to validate
   * @returns {number|null} Valid score or null
   */
  validateMoodScore(score) {
    const num = Number(score);
    return (Number.isInteger(num) && num >= 1 && num <= 10) ? num : null;
  }

  /**
   * Generate fallback analysis when parsing fails
   * @param {string} responseText - Original response text
   * @returns {Object} Fallback analysis
   */
  getFallbackAnalysis(responseText) {
    return {
      overallMood: 'neutral',
      moodScore: 5,
      stressTriggers: [],
      suggestions: [
        'Continue expressing your feelings',
        'Practice mindfulness exercises',
        'Maintain regular sleep schedule'
      ],
      keyTopics: ['general wellness', 'emotional support'],
      aiGeneratedSummary: 'The user engaged in a wellness conversation. Analysis details could not be fully processed, but the interaction shows positive engagement with mental health support.'
    };
  }

  /**
   * Generate a quick mood assessment for shorter conversations
   * @param {string} conversationText - The conversation text
   * @returns {Promise<Object>} Quick analysis
   */
  async quickMoodAnalysis(conversationText) {
    try {
      const prompt = `Briefly analyze this wellness conversation and rate the user's mood on a scale of 1-10 and categorize it:

CONVERSATION:
${conversationText}

Respond with just: {"mood": "positive|neutral|negative|mixed", "score": <1-10>}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          overallMood: this.validateMood(parsed.mood) || 'neutral',
          moodScore: this.validateMoodScore(parsed.score) || 5
        };
      }
    } catch (error) {
      console.error('Quick analysis error:', error);
    }
    
    return { overallMood: 'neutral', moodScore: 5 };
  }
}

export default GeminiService;