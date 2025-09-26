import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  Heart,
  Shield,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

const EmergencyAlert = () => {
  const { t } = useLanguage();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: "1",
      name: "Mom - Sarah Johnson",
      relationship: "Mother",
      phone: "+1 (555) 123-4567",
      isPrimary: true
    },
    {
      id: "2", 
      name: "Dad - Michael Johnson",
      relationship: "Father",
      phone: "+1 (555) 234-5678",
      isPrimary: false
    },
    {
      id: "3",
      name: "Best Friend - Alex Chen",
      relationship: "Friend",
      phone: "+1 (555) 345-6789",
      isPrimary: false
    }
  ]);

  const [countdown, setCountdown] = useState(0);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRelationship, setNewContactRelationship] = useState("");

  const triggerEmergencyAlert = () => {
    setIsEmergencyActive(true);
    setCountdown(10);
    
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sendEmergencyAlerts();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelEmergencyAlert = () => {
    setIsEmergencyActive(false);
    setCountdown(0);
  };

  const sendEmergencyAlerts = () => {
    // Simulate sending alerts
    console.log("Emergency alerts sent to:", emergencyContacts);
    setIsEmergencyActive(false);
    // In real implementation, this would trigger actual SMS/calls
  };

  const addEmergencyContact = () => {
    if (newContactName && newContactPhone) {
      const newContact: EmergencyContact = {
        id: Date.now().toString(),
        name: newContactName,
        relationship: newContactRelationship || "Contact",
        phone: newContactPhone,
        isPrimary: false
      };
      setEmergencyContacts([...emergencyContacts, newContact]);
      setNewContactName("");
      setNewContactPhone("");
      setNewContactRelationship("");
    }
  };

  const removeContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
  };

  const setPrimaryContact = (id: string) => {
    setEmergencyContacts(contacts =>
      contacts.map(contact => ({
        ...contact,
        isPrimary: contact.id === id
      }))
    );
  };

  const helpfulResources = [
    {
      title: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "24/7 free and confidential support",
      type: "crisis"
    },
    {
      title: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Free, 24/7 crisis counseling via text",
      type: "text"
    },
    {
      title: "Campus Counseling Center",
      phone: "(555) 123-HELP",
      description: "Free counseling services for students",
      type: "local"
    },
    {
      title: "Emergency Services",
      phone: "911",
      description: "Immediate emergency assistance",
      type: "emergency"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Emergency Alert Status */}
      {isEmergencyActive && (
        <Alert className="border-destructive bg-destructive/10 animate-pulse">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="flex items-center justify-between">
            <span className="font-semibold text-destructive">
              Emergency alert will be sent in {countdown} seconds...
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={cancelEmergencyAlert}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Cancel Alert
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Actions */}
        <div className="space-y-6">
          {/* Immediate Help */}
          <Card className="border-destructive/50">
            <CardHeader className="bg-gradient-emergency text-destructive-foreground">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                {t('emergency.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  If you're experiencing a mental health crisis, you're not alone. 
                  Click the button below to immediately alert your emergency contacts.
                </p>
                
                <Button 
                  onClick={triggerEmergencyAlert}
                  disabled={isEmergencyActive}
                  className="w-full bg-gradient-emergency text-destructive-foreground h-12 text-lg font-semibold"
                  size="lg"
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {t('emergency.panic')}
                </Button>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Call 988
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Text Crisis Line
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {contact.name}
                          {contact.isPrimary && (
                            <Badge variant="secondary" className="text-xs">Primary</Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                        <p className="text-sm font-mono text-muted-foreground">{contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPrimaryContact(contact.id)}
                        disabled={contact.isPrimary}
                      >
                        <Heart className={`h-4 w-4 ${contact.isPrimary ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContact(contact.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add New Contact Form */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-3">Add New Emergency Contact</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Full name"
                          value={newContactName}
                          onChange={(e) => setNewContactName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="relationship">Relationship</Label>
                        <Input
                          id="relationship"
                          placeholder="e.g., Parent, Friend"
                          value={newContactRelationship}
                          onChange={(e) => setNewContactRelationship(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        value={newContactPhone}
                        onChange={(e) => setNewContactPhone(e.target.value)}
                      />
                    </div>
                    <Button onClick={addEmergencyContact} className="w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resources and Information */}
        <div className="space-y-6">
          {/* Crisis Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Crisis Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {helpfulResources.map((resource, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{resource.title}</p>
                        <p className="text-xs text-muted-foreground mb-2">{resource.description}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            resource.type === 'emergency' ? 'border-destructive text-destructive' :
                            resource.type === 'crisis' ? 'border-primary text-primary' :
                            'border-muted-foreground text-muted-foreground'
                          }`}
                        >
                          {resource.phone}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Safety Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Your Safety Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-wellness-calm/10 rounded-lg">
                  <h4 className="font-medium text-wellness-calm mb-2">🛡️ When I notice warning signs:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Take 5 deep breaths</li>
                    <li>• Call a trusted friend</li>
                    <li>• Use grounding techniques</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-wellness-energy/10 rounded-lg">
                  <h4 className="font-medium text-wellness-energy mb-2">🏠 Safe places I can go:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Family home</li>
                    <li>• Campus counseling center</li>
                    <li>• Best friend's place</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-wellness-joy/10 rounded-lg">
                  <h4 className="font-medium text-wellness-joy mb-2">💪 Things that help me cope:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Listening to music</li>
                    <li>• Going for walks</li>
                    <li>• Talking to loved ones</li>
                  </ul>
                </div>

                <Button variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Safety Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Location & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Your location will only be shared with emergency contacts during an active crisis alert. 
                    All data is encrypted and secure.
                  </AlertDescription>
                </Alert>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Share location in emergencies</span>
                  <Badge variant="secondary" className="bg-wellness-energy text-white">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-contact emergency services</span>
                  <Badge variant="outline">Disabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;