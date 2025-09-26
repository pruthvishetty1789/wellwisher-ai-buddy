import React, { useState, useEffect, useRef } from 'react';
import { Activity, User, Settings, BarChart3, Heart, Brain, Calendar, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Section {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

const sections: Section[] = [
  { id: 'overview', title: 'Overview', icon: Activity, description: 'Dashboard overview and key metrics' },
  { id: 'profile', title: 'Profile', icon: User, description: 'User profile and personal information' },
  { id: 'analytics', title: 'Analytics', icon: BarChart3, description: 'Data analytics and insights' },
  { id: 'wellness', title: 'Wellness', icon: Heart, description: 'Health and wellness tracking' },
  { id: 'mental-health', title: 'Mental Health', icon: Brain, description: 'Mental health resources and tracking' },
  { id: 'schedule', title: 'Schedule', icon: Calendar, description: 'Calendar and appointments' },
  { id: 'security', title: 'Security', icon: Shield, description: 'Security settings and privacy' },
  { id: 'settings', title: 'Settings', icon: Settings, description: 'Application settings and preferences' },
];

const ScrollSpyDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Register section refs
  const setSectionRef = (id: string) => (ref: HTMLElement | null) => {
    sectionRefs.current[id] = ref;
  };

  // Initialize Intersection Observer for scroll spy
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is 20% from top
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex">
        {/* Vertical Sidebar */}
        <div className="fixed left-0 top-0 h-full w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 shadow-lg z-50">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-white">Dashboard</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Scroll Spy Demo</p>
              </div>
            </div>

            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ease-in-out group
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-white'
                    }`} />
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${isActive ? 'text-white' : ''}`}>
                        {section.title}
                      </div>
                      <div className={`text-xs ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                        {section.description}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="ml-64 flex-1 min-h-screen">
          <div className="p-8 space-y-12">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                ref={setSectionRef(section.id)}
                className="scroll-mt-8"
              >
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <section.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                            {section.title}
                          </CardTitle>
                          <p className="text-slate-600 dark:text-slate-400 mt-1">
                            {section.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Section {index + 1}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Dynamic content based on section */}
                    {section.id === 'overview' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl">
                          <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2">Total Users</h3>
                          <p className="text-3xl font-bold text-green-900 dark:text-green-300">12,485</p>
                          <p className="text-sm text-green-600 dark:text-green-500">+12% from last month</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl">
                          <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Active Sessions</h3>
                          <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">2,847</p>
                          <p className="text-sm text-blue-600 dark:text-blue-500">Real-time data</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl">
                          <h3 className="font-semibold text-purple-800 dark:text-purple-400 mb-2">Revenue</h3>
                          <p className="text-3xl font-bold text-purple-900 dark:text-purple-300">$48,392</p>
                          <p className="text-sm text-purple-600 dark:text-purple-500">+8% growth</p>
                        </div>
                      </div>
                    )}

                    {section.id === 'analytics' && (
                      <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl">
                          <h3 className="font-semibold mb-4">Performance Metrics</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Page Views</p>
                              <p className="text-2xl font-bold">847K</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Bounce Rate</p>
                              <p className="text-2xl font-bold">24%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Default content for other sections */}
                    {!['overview', 'analytics'].includes(section.id) && (
                      <div className="space-y-4">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          This is the {section.title} section. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                          quis nostrud exercitation ullamco laboris.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Feature 1</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Description of feature or functionality in this section.
                            </p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Feature 2</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Another feature or setting available in this area.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button variant="outline" size="sm">
                            Action 1
                          </Button>
                          <Button variant="outline" size="sm">
                            Action 2
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Section navigation hint */}
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-600">
                      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                        Scroll down to see more sections or use the sidebar to navigate
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollSpyDashboard;