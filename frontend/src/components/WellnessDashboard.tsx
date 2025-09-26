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
  ChevronDown,
  LogOut
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import ChatAssistant from "./ChatAssistant";
import MoodTracker from "./MoodTracker";
import WellnessReminders from "./WellnessReminders";
import EmergencyAlert from "./EmergencyAlert";

const WellnessDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
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
            {/* Professional Header Section */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-semibold text-foreground">
                            Mental Wellness Dashboard
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs">
                        Active Session
                      </Badge>
                      <Badge variant={wellnessScore >= 70 ? "default" : "destructive"} className="text-xs">
                        {wellnessScore >= 70 ? "Good" : "Needs Attention"} Health Status
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-2xl font-bold text-foreground">{wellnessScore}%</div>
                    <div className="text-xs text-muted-foreground">Wellness Score</div>
                    <div className="text-xs text-emerald-600 font-medium">{moodTrend} vs last week</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="bg-card/70 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300 hover:shadow-lg group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2.5 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-200`}>
                              <IconComponent className="h-4 w-4 text-white" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                              {stat.title}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-muted-foreground font-medium">{stat.change}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/30">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Last updated</span>
                          <span className="text-xs text-muted-foreground">2 min ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Wellness Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-card/70 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                      <Activity className="h-5 w-5 text-primary" />
                      Wellness Metrics
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Real-time
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium text-foreground">Overall Wellness</span>
                        <p className="text-xs text-muted-foreground">Composite health score</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-foreground">{wellnessScore}%</span>
                        <p className="text-xs text-emerald-600 font-medium">↗ {moodTrend}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={wellnessScore} className="h-3 bg-muted" />
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full opacity-20"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">Mindfulness</span>
                        <span className="text-sm font-bold text-foreground">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">Physical Activity</span>
                        <span className="text-sm font-bold text-foreground">60%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">Sleep Quality</span>
                        <span className="text-sm font-bold text-foreground">72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">Stress Level</span>
                        <span className="text-sm font-bold text-orange-600">32%</span>
                      </div>
                      <Progress value={32} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/70 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">Today's Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium">Sessions</span>
                      </div>
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">Streak</span>
                      </div>
                      <span className="text-sm font-bold">{streakDays} days</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-sm font-medium">Goals Met</span>
                      </div>
                      <span className="text-sm font-bold">2/3</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border/30">
                    <h4 className="text-sm font-semibold mb-3">Quick Insights</h4>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p>• Best mindfulness session today at 2 PM</p>
                      <p>• Stress levels decreased by 15% since morning</p>
                      <p>• Recommended: Take a 10-min break</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Center */}
            <Card className="bg-card/70 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Action Center</CardTitle>
                  <Badge variant="secondary" className="text-xs">4 Available</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="ghost" 
                    className="h-24 p-4 flex flex-col gap-3 bg-muted/30 hover:bg-muted/60 border border-border/30 hover:border-border/60 transition-all duration-200 group"
                    onClick={() => setActiveTab("mood")}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-wellness-calm/20 group-hover:bg-wellness-calm/30 transition-colors">
                      <Heart className="h-5 w-5 text-wellness-calm" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-foreground">Log Mood</div>
                      <div className="text-xs text-muted-foreground">Track feelings</div>
                    </div>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="h-24 p-4 flex flex-col gap-3 bg-muted/30 hover:bg-muted/60 border border-border/30 hover:border-border/60 transition-all duration-200 group"
                    onClick={() => setActiveTab("chat")}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-foreground">AI Assistant</div>
                      <div className="text-xs text-muted-foreground">Get support</div>
                    </div>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="h-24 p-4 flex flex-col gap-3 bg-muted/30 hover:bg-muted/60 border border-border/30 hover:border-border/60 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-wellness-joy/20 group-hover:bg-wellness-joy/30 transition-colors">
                      <Sun className="h-5 w-5 text-wellness-joy" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-foreground">Meditation</div>
                      <div className="text-xs text-muted-foreground">5 min session</div>
                    </div>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="h-24 p-4 flex flex-col gap-3 bg-muted/30 hover:bg-muted/60 border border-border/30 hover:border-border/60 transition-all duration-200 group"
                    onClick={() => setActiveTab("emergency")}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/20 group-hover:bg-destructive/30 transition-colors">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-foreground">Emergency</div>
                      <div className="text-xs text-muted-foreground">Get help now</div>
                    </div>
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
                { id: "mood", label: t('mood.title'), icon: Heart },
                { id: "chat", label: t('chat.title'), icon: MessageCircle },
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
            
            {/* Logout Button */}
           <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 bg-card/60 hover:bg-card/80 border border-border/30 text-foreground rounded-lg backdrop-blur-md"
    >
      <User className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end">
    {/* Profile route */}
    <DropdownMenuItem
      onClick={() => navigate(`/profile/${localStorage.getItem("userId")}`)}
      className="cursor-pointer flex items-center gap-2"
    >
      <User className="h-4 w-4" />
      Profile
    </DropdownMenuItem>

    {/* Logout */}
    <DropdownMenuItem
      onClick={handleLogout}
      className="cursor-pointer flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

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