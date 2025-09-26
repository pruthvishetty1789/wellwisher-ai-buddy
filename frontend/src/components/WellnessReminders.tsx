import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Bell, 
  Clock, 
  Heart, 
  Droplets,
  Moon,
  Sunrise,
  Brain,
  Smile,
  CheckCircle,
  Plus,
  Settings
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  frequency: "daily" | "weekly" | "custom";
  category: "mindfulness" | "hydration" | "exercise" | "sleep" | "gratitude" | "breathing";
  isEnabled: boolean;
  streak: number;
  icon: any;
  color: string;
}

const WellnessReminders = () => {
  const { t } = useLanguage();
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      title: "Morning Meditation",
      description: "Start your day with 10 minutes of mindfulness",
      time: "08:00",
      frequency: "daily",
      category: "mindfulness",
      isEnabled: true,
      streak: 7,
      icon: Brain,
      color: "bg-wellness-focus"
    },
    {
      id: "2", 
      title: "Hydration Check",
      description: "Remember to drink water and stay hydrated",
      time: "10:00",
      frequency: "daily",
      category: "hydration",
      isEnabled: true,
      streak: 12,
      icon: Droplets,
      color: "bg-wellness-calm"
    },
    {
      id: "3",
      title: "Gratitude Journal",
      description: "Write down 3 things you're grateful for today",
      time: "21:00",
      frequency: "daily",
      category: "gratitude",
      isEnabled: true,
      streak: 5,
      icon: Heart,
      color: "bg-wellness-joy"
    },
    {
      id: "4",
      title: "Evening Wind Down",
      description: "Time to relax and prepare for better sleep",
      time: "22:30",
      frequency: "daily",
      category: "sleep",
      isEnabled: false,
      streak: 0,
      icon: Moon,
      color: "bg-wellness-calm"
    },
    {
      id: "5",
      title: "Breathing Exercise",
      description: "Take 5 deep breaths to center yourself",
      time: "15:00",
      frequency: "daily",
      category: "breathing",
      isEnabled: true,
      streak: 3,
      icon: Smile,
      color: "bg-wellness-energy"
    }
  ]);

  const [todaysProgress, setTodaysProgress] = useState({
    completed: 3,
    total: 4,
    percentage: 75
  });

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, isEnabled: !reminder.isEnabled }
          : reminder
      )
    );
  };

  const completeReminder = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, streak: reminder.streak + 1 }
          : reminder
      )
    );
    
    // Update today's progress
    setTodaysProgress(prev => ({
      ...prev,
      completed: Math.min(prev.completed + 1, prev.total),
      percentage: Math.min(((prev.completed + 1) / prev.total) * 100, 100)
    }));
  };

  const categoryColors = {
    mindfulness: "bg-wellness-focus",
    hydration: "bg-wellness-calm", 
    exercise: "bg-wellness-energy",
    sleep: "bg-wellness-calm",
    gratitude: "bg-wellness-joy",
    breathing: "bg-wellness-energy"
  };

  const upcomingReminders = reminders
    .filter(r => r.isEnabled)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Today's Progress */}
      <Card className="bg-gradient-wellness text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Today's Wellness Progress
            </span>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {todaysProgress.completed}/{todaysProgress.total} Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Daily Goals</span>
              <span>{Math.round(todaysProgress.percentage)}%</span>
            </div>
            <Progress value={todaysProgress.percentage} className="h-3 bg-white/20" />
            <p className="text-sm text-primary-foreground/90">
              Great progress! You're on track to meet your wellness goals today.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Reminders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Reminders</h2>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </div>

          <div className="space-y-3">
            {reminders.map((reminder) => {
              const IconComponent = reminder.icon;
              return (
                <Card key={reminder.id} className="hover:shadow-wellness transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${reminder.color}`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">{reminder.title}</h3>
                          <p className="text-sm text-muted-foreground">{reminder.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{reminder.time}</span>
                            {reminder.streak > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {reminder.streak} day streak 🔥
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => completeReminder(reminder.id)}
                            className="gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            {t('reminders.done')}
                          </Button>
                        <Switch
                          checked={reminder.isEnabled}
                          onCheckedChange={() => toggleReminder(reminder.id)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Today */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Upcoming Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingReminders.slice(0, 4).map((reminder) => {
                  const IconComponent = reminder.icon;
                  return (
                    <div key={reminder.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <div className={`p-1.5 rounded ${reminder.color}`}>
                        <IconComponent className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{reminder.title}</p>
                        <p className="text-xs text-muted-foreground">{reminder.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Stats */}
          <Card>
            <CardHeader>
              <CardTitle>This Week's Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completion Rate</span>
                  <Badge variant="secondary" className="bg-wellness-energy text-white">87%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Longest Streak</span>
                  <Badge variant="secondary">12 days 🔥</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Reminders</span>
                  <Badge variant="secondary">28 completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wellness Tips */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Wellness Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-wellness-calm/10 rounded-lg">
                  <p className="text-sm font-medium text-wellness-calm">Consistency is Key</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Small daily actions compound over time. Keep up your streaks!
                  </p>
                </div>
                <div className="p-3 bg-wellness-energy/10 rounded-lg">
                  <p className="text-sm font-medium text-wellness-energy">Morning Routine</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Starting your day with mindfulness sets a positive tone.
                  </p>
                </div>
                <div className="p-3 bg-wellness-joy/10 rounded-lg">
                  <p className="text-sm font-medium text-wellness-joy">Gratitude Practice</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Regular gratitude practice can improve overall well-being by 25%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reminder Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Quick Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sound Notifications</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Push Notifications</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekend Reminders</span>
                  <Switch />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Customize Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WellnessReminders;