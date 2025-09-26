import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MessageCircle, 
  Brain, 
  Heart, 
  AlertTriangle, 
  Calendar,
  TrendingUp,
  Zap,
  Moon,
  Sun,
  Activity
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ChatAssistant from "./ChatAssistant";
import MoodTracker from "./MoodTracker";
import WellnessReminders from "./WellnessReminders";
import EmergencyAlert from "./EmergencyAlert";
import LanguageSelector from "./LanguageSelector";

const WellnessDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { t } = useLanguage();
  
  // Sample data for the wellness dashboard
  const wellnessScore = 78;
  const moodTrend = "+12%";
  const streakDays = 7;
  
  const quickStats = [
    { 
      title: "Wellness Score", 
      value: wellnessScore, 
      icon: Heart, 
      color: "bg-gradient-wellness",
      change: "+5 from yesterday"
    },
    { 
      title: "Mood Trend", 
      value: moodTrend, 
      icon: TrendingUp, 
      color: "bg-gradient-mood",
      change: "This week"
    },
    { 
      title: "Streak Days", 
      value: streakDays, 
      icon: Zap, 
      color: "bg-wellness-energy",
      change: "Daily check-ins"
    },
    { 
      title: "Sleep Quality", 
      value: "Good", 
      icon: Moon, 
      color: "bg-wellness-calm",
      change: "7.5 hrs average"
    }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "chat":
        return <ChatAssistant />;
      case "mood":
        return <MoodTracker />;
      case "reminders":
        return <WellnessReminders />;
      case "emergency":
        return <EmergencyAlert />;
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card className="bg-gradient-wellness text-primary-foreground shadow-wellness">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">Welcome back, Alex!</CardTitle>
                    <p className="text-primary-foreground/90">How are you feeling today? Let's check in with your mental wellness.</p>
                  </div>
                  <Brain className="h-12 w-12 text-primary-foreground/80" />
                </div>
              </CardHeader>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="hover:shadow-wellness transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Wellness Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Today's Wellness Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Wellness</span>
                    <span>{wellnessScore}%</span>
                  </div>
                  <Progress value={wellnessScore} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mindfulness</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Physical Activity</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col gap-2"
                    onClick={() => setActiveTab("mood")}
                  >
                    <Heart className="h-5 w-5 text-wellness-calm" />
                    <span className="text-sm">Log Mood</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col gap-2"
                    onClick={() => setActiveTab("chat")}
                  >
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm">Chat with AI</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col gap-2"
                  >
                    <Sun className="h-5 w-5 text-wellness-joy" />
                    <span className="text-sm">Meditation</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col gap-2"
                    onClick={() => setActiveTab("emergency")}
                  >
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span className="text-sm">Need Help</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold bg-gradient-wellness bg-clip-text text-transparent">
                {t('app.title')}
              </h1>
            </div>
            
            <nav className="flex gap-1">
              {[
                { id: "dashboard", label: t('dashboard.title'), icon: Activity },
                { id: "chat", label: t('chat.title'), icon: MessageCircle },
                { id: "mood", label: t('mood.title'), icon: Heart },
                { id: "reminders", label: t('reminders.title'), icon: Calendar },
                { id: "emergency", label: t('emergency.title'), icon: AlertTriangle }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "dashboard" && (
          <div className="mb-6 flex justify-end">
            <div className="w-72">
              <LanguageSelector />
            </div>
          </div>
        )}
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default WellnessDashboard;