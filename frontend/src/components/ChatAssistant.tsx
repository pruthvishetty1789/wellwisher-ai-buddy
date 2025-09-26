import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Heart, Lightbulb, Smile } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  mood?: "supportive" | "encouraging" | "calming";
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

    // Simulate AI thinking time
    setTimeout(() => {
      const { content, mood } = generateResponse(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content,
        isUser: false,
        timestamp: new Date(),
        mood
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
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
            <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30">
              {t('chat.powered')}
            </Badge>
          </CardTitle>
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