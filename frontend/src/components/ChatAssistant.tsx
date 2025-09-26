import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Heart, Lightbulb, Smile, Save } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  mood?: "supportive" | "encouraging" | "calming";
}

interface SessionSummary {
  sessionId: string;
  overallMood: string;
  moodScore: number;
  stressTriggers: string[];
  suggestions: string[];
  aiGeneratedSummary: string;
}

const ChatAssistant = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: t('chat.initial'),
      isUser: false,
      timestamp: new Date(),
      mood: "supportive"
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isUsingAI, setIsUsingAI] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [currentSession, setCurrentSession] = useState<SessionSummary | null>(null);
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [lastAutoSaveDate, setLastAutoSaveDate] = useState<string | null>(
    localStorage.getItem('lastAutoSaveDate')
  );
  const [dailyManualSaves, setDailyManualSaves] = useState<number>(() => {
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('dailyManualSaves');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return parsed.date === today ? parsed.count : 0;
    }
    return 0;
  });

  // Backend API configuration
  const API_BASE_URL = 'http://localhost:3002';
  const USER_ID = 'user-' + Math.random().toString(36).substr(2, 9); // Generate random user ID

  // Check if we should auto-save today
  const shouldAutoSaveToday = (): boolean => {
    const today = new Date().toDateString();
    return lastAutoSaveDate !== today && messages.length >= 4; // At least 4 messages for meaningful conversation
  };

  // Update last auto-save date
  const updateLastAutoSaveDate = () => {
    const today = new Date().toDateString();
    setLastAutoSaveDate(today);
    localStorage.setItem('lastAutoSaveDate', today);
  };

  // Check if manual save is allowed (max 3 per day)
  const canManualSaveToday = (): boolean => {
    return dailyManualSaves < 3;
  };

  // Update manual save count
  const incrementManualSaveCount = () => {
    const today = new Date().toDateString();
    const newCount = dailyManualSaves + 1;
    setDailyManualSaves(newCount);
    localStorage.setItem('dailyManualSaves', JSON.stringify({
      date: today,
      count: newCount
    }));
  };

  // Convert messages to conversation text for API
  const formatConversationForAPI = (messages: Message[]): string => {
    return messages
      .map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');
  };

  // Save session to backend
  const saveSessionToBackend = async (isManualSave: boolean = false) => {
    if (messages.length < 3) return; // Need at least user + bot interaction

    // Check manual save limit
    if (isManualSave && !canManualSaveToday()) {
      alert(`Daily manual save limit reached (3/3). Try again tomorrow.`);
      return;
    }

    setIsSavingSession(true);
    try {
      const conversationText = formatConversationForAPI(messages);
      const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000 / 60); // in minutes
      
      const response = await fetch(`${API_BASE_URL}/api/session/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationText,
          userId: USER_ID,
          sessionDuration,
          messageCount: messages.length
        })
      });

      if (response.ok) {
        const sessionData = await response.json();
        setCurrentSession({
          sessionId: sessionData.sessionId,
          overallMood: sessionData.summary.overallMood,
          moodScore: sessionData.summary.moodScore,
          stressTriggers: sessionData.summary.stressTriggers,
          suggestions: sessionData.summary.suggestions,
          aiGeneratedSummary: sessionData.summary.aiGeneratedSummary
        });
        updateLastAutoSaveDate(); // Mark that we saved today
        if (isManualSave) {
          incrementManualSaveCount(); // Increment manual save count
        }
        console.log('✅ Session saved successfully:', sessionData.sessionId);
      } else {
        console.error('❌ Failed to save session:', response.statusText);
        // Fall back to local responses if API fails
        setIsUsingAI(false);
      }
    } catch (error) {
      console.error('❌ Error saving session:', error);
      setIsUsingAI(false);
    } finally {
      setIsSavingSession(false);
    }
  };

  // Get AI response from backend (for future real-time chat)
  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // For now, we'll use the session save API to get AI analysis
      // In a full implementation, you'd create a separate chat endpoint
      const quickConversation = `User: ${userMessage}\nAssistant: I understand you're sharing something important with me.`;
      
      const response = await fetch(`${API_BASE_URL}/api/session/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationText: quickConversation,
          userId: USER_ID + '-temp',
          sessionDuration: 1,
          messageCount: 2
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Use one of the AI suggestions as a response
        return data.summary.suggestions[0] || "I'm here to listen and support you. Can you tell me more about how you're feeling?";
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
    }
    
    // Fallback to local response
    return generateResponse(userMessage).content;
  };

  const supportiveResponses = [
    {
      trigger: ["sad", "down", "depressed", "low"],
      responses: [
        "I hear that you're going through a tough time. It's completely normal to feel this way sometimes. Would you like to talk about what's making you feel sad?",
        "Thank you for sharing that with me. Feeling down can be difficult, but remember that these feelings are temporary. You're stronger than you know."
      ],
      mood: "supportive" as const
    },
    {
      trigger: ["anxious", "worried", "stressed", "nervous"],
      responses: [
        "Anxiety can feel overwhelming, but you're not alone in this. Let's try some breathing exercises together. Take a deep breath in for 4 counts, hold for 4, and exhale for 6.",
        "I understand you're feeling anxious. That's a very human response to stress. What's one small thing that usually helps you feel more grounded?"
      ],
      mood: "calming" as const
    },
    {
      trigger: ["good", "great", "happy", "excited"],
      responses: [
        "That's wonderful to hear! I'm so glad you're feeling positive today. What's contributing to these good feelings?",
        "It makes me happy to hear you're doing well! Celebrating these positive moments is important for your mental wellness."
      ],
      mood: "encouraging" as const
    },
    {
      trigger: ["help", "support", "talk"],
      responses: [
        "I'm here to help and support you. What would you like to talk about? Whether it's your feelings, coping strategies, or just daily challenges - I'm listening.",
        "Of course, I'd love to help. Remember, seeking support is a sign of strength, not weakness. What's on your mind?"
      ],
      mood: "supportive" as const
    }
  ];

  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case "supportive": return <Heart className="h-4 w-4" />;
      case "encouraging": return <Smile className="h-4 w-4" />;
      case "calming": return <Lightbulb className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case "supportive": return "bg-wellness-calm text-white";
      case "encouraging": return "bg-wellness-joy text-white"; 
      case "calming": return "bg-wellness-focus text-white";
      default: return "bg-primary text-primary-foreground";
    }
  };

  const generateResponse = (userMessage: string): { content: string; mood: "supportive" | "encouraging" | "calming" } => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const response of supportiveResponses) {
      if (response.trigger.some(trigger => lowerMessage.includes(trigger))) {
        const randomResponse = response.responses[Math.floor(Math.random() * response.responses.length)];
        return { content: randomResponse, mood: response.mood };
      }
    }
    
    // Default supportive response
    return {
      content: "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about how you're feeling right now?",
      mood: "supportive"
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      let aiResponseContent: string;
      let aiMood: "supportive" | "encouraging" | "calming" = "supportive";

      if (isUsingAI) {
        // Try to get AI response from backend
        aiResponseContent = await getAIResponse(inputMessage);
        
        // Determine mood based on content (simple keyword matching)
        if (aiResponseContent.toLowerCase().includes('great') || aiResponseContent.toLowerCase().includes('wonderful')) {
          aiMood = "encouraging";
        } else if (aiResponseContent.toLowerCase().includes('breath') || aiResponseContent.toLowerCase().includes('calm')) {
          aiMood = "calming";
        }
      } else {
        // Fallback to local responses
        const response = generateResponse(inputMessage);
        aiResponseContent = response.content;
        aiMood = response.mood;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        isUser: false,
        timestamp: new Date(),
        mood: aiMood
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Auto-save session once per day (if we have enough messages and haven't saved today)
      if (shouldAutoSaveToday()) {
        setTimeout(() => saveSessionToBackend(false), 1000);
      }

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setIsTyping(false);
      
      // Fallback to local response on error
      const { content, mood } = generateResponse(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content,
        isUser: false,
        timestamp: new Date(),
        mood
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsUsingAI(false);
    }
  };

  const quickPrompts = [
    t('chat.prompt.anxious'),
    t('chat.prompt.great'),
    t('chat.prompt.sleep'),
    t('chat.prompt.motivation'),
    t('chat.prompt.overwhelmed')
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="bg-gradient-wellness text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            {t('chat.title')}
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {isUsingAI ? 'AI-Powered' : 'Local Mode'}
              </Badge>
              {messages.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => saveSessionToBackend(true)}
                  disabled={isSavingSession || !canManualSaveToday()}
                  className="text-white hover:bg-white/20"
                >
                  <Save className="h-4 w-4 mr-1" />
                  {isSavingSession 
                    ? 'Saving...' 
                    : canManualSaveToday() 
                      ? `Save Session (${3 - dailyManualSaves}/3)` 
                      : 'Daily Limit Reached'
                  }
                </Button>
              )}
            </div>
          </CardTitle>
          {currentSession && (
            <div className="text-sm bg-white/10 rounded p-2 mt-2">
              <p><strong>Session:</strong> {currentSession.sessionId.substring(0, 8)}...</p>
              <p><strong>Mood:</strong> {currentSession.overallMood} (Score: {currentSession.moodScore}/10)</p>
              <p><strong>Summary:</strong> {currentSession.aiGeneratedSummary}</p>
            </div>
          )}
          {messages.length > 0 && (
            <div className="text-xs text-white/80 mt-2 space-y-1">
              <div>Connection Status: {isUsingAI ? '🟢 Connected to AI' : '🟡 Local Mode'}</div>
              <div>
                Auto-save: {lastAutoSaveDate ? `Last saved ${lastAutoSaveDate}` : 'Not saved yet today'}
                {shouldAutoSaveToday() && ' • Will save today'}
              </div>
              <div>Manual saves today: {dailyManualSaves}/3</div>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${message.isUser ? "flex-row-reverse" : ""}`}>
                    <div className={`p-2 rounded-full ${message.isUser ? "bg-primary" : getMoodColor(message.mood)}`}>
                      {message.isUser ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        getMoodIcon(message.mood)
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.isUser
                          ? "bg-primary text-primary-foreground ml-2"
                          : "bg-muted mr-2"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[80%]">
                    <div className="p-2 rounded-full bg-muted">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="p-3 rounded-lg bg-muted mr-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Prompts */}
          <div className="p-4 border-t bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">{t('chat.quick_prompts')}</p>
            <div className="flex gap-2 flex-wrap">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(prompt)}
                  className="text-xs"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder={t('chat.placeholder')}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon" disabled={!inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatAssistant;