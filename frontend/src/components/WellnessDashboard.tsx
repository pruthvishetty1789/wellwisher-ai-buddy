import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MessageCircle, 
  Brain, 
  Heart, 
  AlertTriangle, 
  Calendar,
  TrendingUp,
  Zap,
  Sun,
  Moon,
  User,
  Activity,
  Languages,
  ChevronDown
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ChatAssistant from "./ChatAssistant";
import MoodTracker from "./MoodTracker";
import WellnessReminders from "./WellnessReminders";
import EmergencyAlert from "./EmergencyAlert";

const WellnessDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { t, language, setLanguage } = useLanguage();
  
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = savedTheme === 'dark' || (!savedTheme && systemDark);
      
      // Apply gradient on initial load
      setTimeout(() => {
        if (isDark) {
          document.documentElement.classList.add('dark');
          document.body.style.background = 'radial-gradient(ellipse at center, #2d1b3d 0%, #3d1a5b 25%, #4c1d95 50%, #5b21b6 75%, #1a1625 100%), radial-gradient(ellipse at center, #5b21b6 0%, #6b21a8 25%, #7c2d92 50%, #8b5a8c 75%, #2a1f3d 100%)';
          document.body.style.backgroundBlendMode = 'multiply';
        } else {
          document.documentElement.classList.remove('dark');
             document.body.style.background = 'radial-gradient(ellipse at center, #ddd6fe 0%, #c4b5fd 25%, #a78bfa 50%, #8b5cf6 75%, #7c3aed 100%), radial-gradient(ellipse at center, #dbeafe 0%, #bfdbfe 25%, #93c5fd 50%, #60a5fa 75%, #3b82f6 100%)';

          document.body.style.backgroundBlendMode = 'screen';
        }
      }, 0);
      
      return isDark;
    }
    return false;
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.background = 'radial-gradient(ellipse at center, #2d1b3d 0%, #3d1a5b 25%, #4c1d95 50%, #5b21b6 75%, #1a1625 100%), radial-gradient(ellipse at center, #5b21b6 0%, #6b21a8 25%, #7c2d92 50%, #8b5a8c 75%, #2a1f3d 100%)';
      document.body.style.backgroundBlendMode = 'multiply';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.background = 'radial-gradient(ellipse at center, #ddd6fe 0%, #c4b5fd 25%, #a78bfa 50%, #8b5cf6 75%, #7c3aed 100%), radial-gradient(ellipse at center, #dbeafe 0%, #bfdbfe 25%, #93c5fd 50%, #60a5fa 75%, #3b82f6 100%)';
      document.body.style.backgroundBlendMode = 'screen';
      localStorage.setItem('theme', 'light');
    }
  };
  
  // Languages for compact selector
  const languages = {
    en: { name: 'English', short: 'EN' },
    hi: { name: 'हिंदी', short: 'हि' },
    ta: { name: 'தமிழ்', short: 'த' },
    te: { name: 'తెలుగు', short: 'తె' },
    bn: { name: 'বাংলা', short: 'বং' },
    gu: { name: 'ગુજરાતી', short: 'ગુ' },
  } as const;
  
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
      icon: Heart, 
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
    <div className="min-h-screen">
      {/* Header - Fixed with transparent background */}
      <header className="fixed top-2 left-0 right-0 z-50 bg-transparent backdrop-blur-sm border-b border-border/20">
        <div className="flex items-center justify-between h-10 px-6">
          {/* Logo Section - Fixed to Left Corner */}
          <div className="flex items-center gap-2 bg-card/95 backdrop-blur rounded-lg px-3 py-1.5 shadow-md border border-border/30">
            <Brain className="h-5 w-5 text-primary" />
            <h1 className="text-base font-bold text-primary">
              {t('app.title')}
            </h1>
          </div>
          
          {/* Navigation - 50% width, evenly spaced */}
          <nav className="w-1/2 flex justify-center">
            <div className="flex justify-evenly w-full max-w-2xl gap-1">
              {[
                { id: "dashboard", label: t('dashboard.title'), icon: Activity },
                { id: "chat", label: t('chat.title'), icon: MessageCircle },
                { id: "mood", label: t('mood.title'), icon: Heart },
                { id: "reminders", label: t('reminders.title'), icon: Calendar },
                { id: "emergency", label: t('emergency.title'), icon: AlertTriangle }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex flex-col items-center justify-center px-2 py-2 rounded-lg border cursor-pointer 
                      transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md
                      backdrop-blur-md min-w-[60px] h-12
                      ${activeTab === tab.id 
                        ? 'bg-primary/20 text-primary border-primary/50 shadow-sm scale-105' 
                        : 'bg-card/60 text-foreground border-border/60 hover:text-primary hover:bg-card/80 hover:border-primary/30'
                      }
                    `}
                  >
                    <IconComponent className={`h-4 w-4 mb-0.5 transition-all duration-200 ${
                      activeTab === tab.id ? 'text-primary' : 'text-foreground hover:text-primary'
                    }`} />
                    <span className={`text-[10px] font-semibold leading-tight ${
                      activeTab === tab.id ? 'text-primary' : 'text-foreground'
                    }`}>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
          
          {/* Header Controls - Language, Theme, Login */}
          <div className="flex items-center gap-2">
            {/* Compact Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 bg-card/60 hover:bg-card/80 border border-border/30 text-foreground rounded-lg backdrop-blur-md flex items-center gap-1"
                >
                  <Languages className="h-3 w-3" />
                  <span className="text-xs font-medium">{languages[language as keyof typeof languages]?.short || 'EN'}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                {Object.entries(languages).map(([code, lang]) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => setLanguage(code as any)}
                    className={`cursor-pointer ${language === code ? 'bg-accent' : ''}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">{lang.name}</span>
                      <span className="text-xs text-muted-foreground">{lang.short}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Dark/Light Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="h-8 w-8 p-0 bg-card/60 hover:bg-card/80 border border-border/30 text-foreground rounded-lg backdrop-blur-md"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {/* Login Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-card/60 hover:bg-card/80 border border-border/30 text-foreground rounded-lg backdrop-blur-md"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Add top padding to account for fixed header */}
      <main className="pt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default WellnessDashboard;