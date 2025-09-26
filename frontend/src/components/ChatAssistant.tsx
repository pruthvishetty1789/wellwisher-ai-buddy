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
  const [isUsingAI, setIsUsingAI] = useState(false); // Set to false since we're using local responses to avoid unwanted saves
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
  const USER_ID = (() => {
    let storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      storedUserId = 'user-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', storedUserId);
      console.log('💬 ChatAssistant created new USER_ID:', storedUserId);
    } else {
      console.log('💬 ChatAssistant using existing USER_ID:', storedUserId);
    }
    return storedUserId;
  })();

  // Check if we should auto-save today (only at end of day)
  const shouldAutoSaveToday = (): boolean => {
    const today = new Date().toDateString();
    const currentHour = new Date().getHours();
    
    // Auto-save only happens at end of day (after 11 PM) and if we haven't saved today
    return lastAutoSaveDate !== today && 
           messages.length >= 4 && 
           currentHour >= 23; // After 11 PM
  };

  // Check if it's end of day and we should auto-save
  const checkEndOfDayAutoSave = () => {
    if (shouldAutoSaveToday()) {
      console.log('🌙 End of day auto-save triggered');
      // Show notification to user
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4f46e5;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        font-size: 14px;
      `;
      notification.innerHTML = '🌙 Auto-saving your daily chat session...';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 5000);
      
      saveSessionToBackend(false);
    }
  };

  // Set up end-of-day auto-save timer
  useEffect(() => {
    const checkEndOfDay = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      // Check if it's 11:30 PM (23:30) - good time for end of day save
      if (currentHour === 23 && currentMinute === 30) {
        checkEndOfDayAutoSave();
      }
    };

    // Check every minute for end of day
    const interval = setInterval(checkEndOfDay, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [messages, lastAutoSaveDate]);

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
    if (messages.length < 3) {
      if (isManualSave) {
        alert('Need at least 3 messages to save a meaningful session.');
      }
      return;
    }

    // Check manual save limit
    if (isManualSave && !canManualSaveToday()) {
      alert(`Daily manual save limit reached (${dailyManualSaves}/3). Try again tomorrow or wait for automatic end-of-day save.`);
      return;
    }

    setIsSavingSession(true);
    try {
      const conversationText = formatConversationForAPI(messages);
      const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000 / 60); // in minutes
      
      // Store user ID for consistency
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', USER_ID);
      }

      const response = await fetch(`${API_BASE_URL}/api/session/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationText,
          userId: USER_ID,
          sessionDuration,
          messageCount: messages.length,
          saveType: isManualSave ? 'manual' : 'auto-end-of-day'
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
        
        if (!isManualSave) {
          updateLastAutoSaveDate(); // Mark that we saved today (only for auto-save)
        }
        
        if (isManualSave) {
          incrementManualSaveCount(); // Increment manual save count
          alert(`Session saved successfully! Manual saves remaining today: ${3 - (dailyManualSaves + 1)}/3`);
        } else {
          console.log('🌙 End-of-day session auto-saved successfully:', sessionData.sessionId);
        }
        
        console.log('✅ Session saved successfully:', sessionData.sessionId);
        console.log('📅 Session saved for date:', new Date().toDateString());
        console.log('👤 Session saved for USER_ID:', USER_ID);
      } else {
        console.error('❌ Failed to save session:', response.statusText);
        if (isManualSave) {
          alert('Failed to save session. Please try again later.');
        }
        // Fall back to local responses if API fails
        setIsUsingAI(false);
      }
    } catch (error) {
      console.error('❌ Error saving session:', error);
      if (isManualSave) {
        alert('Error saving session. Please check your connection and try again.');
      }
      setIsUsingAI(false);
    } finally {
      setIsSavingSession(false);
    }
  };

  // Get AI response from backend (for future real-time chat)
  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // TODO: In a full implementation, create a separate chat endpoint that doesn't save sessions
      // For now, we'll use local responses only to avoid unwanted session saves
      console.log('🤖 Using local AI response to avoid session save');
      
      // Fallback to local response immediately
      return generateResponse(userMessage).content;
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Fallback to local response
      return generateResponse(userMessage).content;
    }
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

      // Note: Auto-save only happens at end of day (11:30 PM), not after each message

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
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Chat Container with Rounded Edges */}
      <div className="h-full flex flex-col rounded-xl overflow-hidden shadow-xl border border-border bg-card">
        {/* Modern Header with Theme-aware Colors */}
        <div className="bg-primary text-primary-foreground p-4 shadow-lg border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-md">
                <Bot className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border border-primary-foreground/20">
                  <h2 className="font-semibold text-lg leading-tight">{t('chat.title')}</h2>
                  <p className="text-xs text-primary-foreground/70 mt-0.5">
                    {isUsingAI ? '🟢 AI Connected' : '🟡 Local Mode'} • {messages.length} messages
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {messages.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => saveSessionToBackend(true)}
                  disabled={isSavingSession || !canManualSaveToday()}
                  className="text-primary-foreground hover:bg-primary-foreground/10 text-xs px-3 py-1 h-auto rounded-full shadow-sm border border-primary-foreground/20"
                >
                  <Save className="h-3 w-3 mr-1" />
                  {isSavingSession 
                    ? 'Saving...' 
                    : canManualSaveToday() 
                      ? `Save (${3 - dailyManualSaves}/3)` 
                      : 'Limit Reached'
                  }
                </Button>
              )}
            </div>
          </div>
          
          {/* Compact Session Info */}
          {currentSession && (
            <div className="text-xs bg-primary-foreground/10 rounded-lg p-2 mt-3 backdrop-blur-sm border border-primary-foreground/20 shadow-sm max-w-fit">
              <div className="grid grid-cols-2 gap-2 text-primary-foreground/80">
                <span>Mood: {currentSession.overallMood} ({currentSession.moodScore}/10)</span>
                <span>Session: {currentSession.sessionId.substring(0, 8)}...</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Area with Theme-aware Background */}
        <div className="flex-1 bg-muted/30 relative overflow-hidden flex flex-col min-h-0"> 
          
          {/* Messages Container with Auto-scroll */}
          <ScrollArea className="flex-1 px-4 py-2 chat-scrollbar">
            <div className="space-y-3 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-slide-in`}
                >
                  <div className={`max-w-[85%] ${message.isUser ? "order-2" : "order-1"}`}>
                    <div
                      className={`
                        relative px-4 py-2 rounded-2xl shadow-sm border
                        ${message.isUser
                          ? "bg-primary text-primary-foreground ml-8 rounded-br-md border-primary/20"
                          : "bg-card text-card-foreground mr-8 rounded-bl-md border-border"
                        }
                      `}
                    >
                      {/* Message Content */}
                      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {message.content}
                      </p>
                      
                      {/* Timestamp and Status */}
                      <div className={`flex items-end justify-end gap-1 mt-1 ${message.isUser ? 'flex-row' : 'flex-row-reverse'}`}>
                        <span className={`text-xs ${message.isUser ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {message.isUser && (
                          <div className="flex">
                            <svg width="16" height="15" viewBox="0 0 16 15" className="text-primary-foreground/60">
                              <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l3.61 3.477c.143.14.361.125.484-.033L10.91 3.9a.366.366 0 0 0-.063-.51z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Mood indicator for AI messages */}
                      {!message.isUser && message.mood && (
                        <div className="absolute -left-1 top-2">
                          <div className={`w-3 h-3 rounded-full flex items-center justify-center ${getMoodColor(message.mood)}`}>
                            {getMoodIcon(message.mood)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-slide-in">
                  <div className="max-w-[85%] mr-8">
                    <div className="bg-card text-card-foreground px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-border">
                      <div className="flex gap-1 items-center">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Prompts Bar */}
          {quickPrompts.length > 0 && (
            <div className="bg-card/50 backdrop-blur-sm border-t border-border px-4 py-2">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {quickPrompts.slice(0, 4).map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(prompt)}
                    className="text-xs whitespace-nowrap bg-card hover:bg-accent border-border text-card-foreground px-3 py-1 h-auto flex-shrink-0"
                  >
                    {prompt.length > 25 ? prompt.substring(0, 25) + '...' : prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Modern Input Area */}
          <div className="bg-card/80 backdrop-blur-sm px-4 py-3 border-t border-border">
            <div className="flex items-end gap-3">
              <div className="flex-1 bg-input rounded-full border border-border px-4 py-2 min-h-[44px] flex items-center focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <Input
                  placeholder={t('chat.placeholder') || "Type a message..."}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  className="border-0 bg-transparent focus:ring-0 focus:outline-none p-0 text-sm resize-none text-foreground placeholder:text-muted-foreground"
                  style={{ boxShadow: 'none' }}
                />
              </div>
              
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim()}
                className="w-11 h-11 rounded-full bg-primary hover:bg-primary/90 border-0 p-0 flex-shrink-0"
              >
                <Send className="h-5 w-5 text-primary-foreground" />
              </Button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-muted/50 px-4 py-1 text-xs text-muted-foreground border-t border-border">
          <div className="flex justify-between items-center">
            <span>
              Auto-save: {lastAutoSaveDate ? `Last saved ${lastAutoSaveDate}` : 'Not saved today'}
            </span>
            <span>Manual saves: {dailyManualSaves}/3 used today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;