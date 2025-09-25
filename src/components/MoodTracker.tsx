import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { 
  Smile, 
  Meh, 
  Frown, 
  Heart,
  Brain,
  Activity,
  Zap,
  Cloud,
  Sun,
  CloudRain,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MoodEntry {
  id: string;
  date: Date;
  mood: "excellent" | "good" | "neutral" | "poor" | "terrible";
  energy: number;
  stress: number;
  sleep: number;
  notes?: string;
  factors: string[];
}

const MoodTracker = () => {
  const { t } = useLanguage();
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [energy, setEnergy] = useState(50);
  const [stress, setStress] = useState(50);
  const [sleep, setSleep] = useState(50);
  const [notes, setNotes] = useState("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const moods = [
    { id: "excellent", label: t('mood.excellent'), icon: Sun, color: "bg-wellness-joy", emoji: "😊" },
    { id: "good", label: t('mood.good'), icon: Smile, color: "bg-wellness-energy", emoji: "🙂" },
    { id: "neutral", label: t('mood.okay'), icon: Meh, color: "bg-wellness-calm", emoji: "😐" },
    { id: "poor", label: t('mood.bad'), icon: Cloud, color: "bg-muted", emoji: "😞" },
    { id: "terrible", label: t('mood.terrible'), icon: CloudRain, color: "bg-destructive", emoji: "😢" }
  ];

  const moodFactors = [
    "Work/Studies", "Relationships", "Health", "Weather", "Exercise", 
    "Sleep Quality", "Social Media", "Family", "Finances", "Hobbies",
    "Medication", "Diet", "Stress", "Achievement", "Relaxation"
  ];

  const mockMoodData = [
    { date: "Mon", mood: 4, energy: 70 },
    { date: "Tue", mood: 3, energy: 60 },
    { date: "Wed", mood: 5, energy: 85 },
    { date: "Thu", mood: 3, energy: 55 },
    { date: "Fri", mood: 4, energy: 75 },
    { date: "Sat", mood: 5, energy: 90 },
    { date: "Sun", mood: 4, energy: 80 }
  ];

  const handleFactorToggle = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  const handleSaveMoodEntry = () => {
    const moodEntry: MoodEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      mood: selectedMood as any,
      energy,
      stress,
      sleep,
      notes,
      factors: selectedFactors
    };
    
    console.log("Saved mood entry:", moodEntry);
    
    // Reset form
    setSelectedMood("");
    setEnergy(50);
    setStress(50);
    setSleep(50);
    setNotes("");
    setSelectedFactors([]);
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Mood Entry Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Daily Mood Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              {t('mood.current')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {moods.map((mood) => {
                const IconComponent = mood.icon;
                return (
                  <Button
                    key={mood.id}
                    variant={selectedMood === mood.id ? "default" : "outline"}
                    className={`h-20 flex flex-col gap-2 ${
                      selectedMood === mood.id ? mood.color : ""
                    }`}
                    onClick={() => setSelectedMood(mood.id)}
                  >
                    <div className="text-2xl">{mood.emoji}</div>
                    <span className="text-xs">{mood.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Wellness Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Wellness Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{t('mood.energy')}</span>
                  <span className="text-sm text-muted-foreground">{energy}%</span>
                </div>
                <Progress value={energy} className="h-2" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={energy}
                  onChange={(e) => setEnergy(parseInt(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{t('mood.stress')}</span>
                  <span className="text-sm text-muted-foreground">{stress}%</span>
                </div>
                <Progress value={stress} className="h-2" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stress}
                  onChange={(e) => setStress(parseInt(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Sleep Quality</span>
                  <span className="text-sm text-muted-foreground">{sleep}%</span>
                </div>
                <Progress value={sleep} className="h-2" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sleep}
                  onChange={(e) => setSleep(parseInt(e.target.value))}
                  className="w-full mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mood Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              What's influencing your mood today?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {moodFactors.map((factor) => (
                <Badge
                  key={factor}
                  variant={selectedFactors.includes(factor) ? "default" : "outline"}
                  className={`cursor-pointer justify-center p-2 ${
                    selectedFactors.includes(factor) ? "bg-primary" : ""
                  }`}
                  onClick={() => handleFactorToggle(factor)}
                >
                  {factor}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t('mood.note')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        <Button 
          onClick={handleSaveMoodEntry}
          disabled={!selectedMood}
          className="w-full bg-gradient-wellness"
          size="lg"
        >
          {t('mood.save')}
        </Button>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Date Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              This Week's Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Mood</span>
                <Badge variant="secondary">Good (4.1/5)</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Energy Trend</span>
                <Badge variant="secondary" className="bg-wellness-energy text-white">
                  +12%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sleep Quality</span>
                <Badge variant="secondary">Improving</Badge>
              </div>
              
              {/* Mini Chart */}
              <div className="pt-4">
                <p className="text-sm font-medium mb-2">Weekly Pattern</p>
                <div className="flex items-end justify-between h-16 gap-1">
                  {mockMoodData.map((day, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div 
                        className="bg-gradient-wellness rounded-sm w-6"
                        style={{ height: `${day.mood * 20}%` }}
                      ></div>
                      <span className="text-xs text-muted-foreground">{day.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-wellness-energy/10 rounded-lg">
                <p className="text-sm font-medium text-wellness-energy">💡 Pattern Found</p>
                <p className="text-xs text-muted-foreground mt-1">Your mood tends to be higher on weekends when you exercise.</p>
              </div>
              <div className="p-3 bg-wellness-calm/10 rounded-lg">
                <p className="text-sm font-medium text-wellness-calm">🎯 Suggestion</p>
                <p className="text-xs text-muted-foreground mt-1">Try morning meditation to improve your energy levels.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoodTracker;