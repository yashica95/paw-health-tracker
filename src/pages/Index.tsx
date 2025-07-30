import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PetProfile } from "@/components/PetProfile";
import { EditPetProfile } from "@/components/EditPetProfile";
import { HealthLogger } from "@/components/HealthLogger";
import { HealthDashboard } from "@/components/HealthDashboard";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { MedicalRecords } from "@/components/MedicalRecords";
import { Plus, Heart, Calendar, Activity, TrendingUp, User, FileText } from "lucide-react";
import heroImage from "@/assets/pet-health-hero.jpg";

interface HealthMetrics {
  appetite: number;
  energy: number;
  mood: number;
  temperature: number;
  notes: string;
}

interface MedicalRecord {
  id: string;
  type: 'vaccination' | 'checkup' | 'medication' | 'surgery' | 'emergency';
  title: string;
  date: Date;
  nextDate?: Date;
  veterinarian: string;
  notes: string;
  status: 'completed' | 'upcoming' | 'overdue';
}

const Index = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [hasSetupPet, setHasSetupPet] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");

  // Sample pet data
  const [petData, setPetData] = useState({
    id: "1",
    name: "Luna",
    breed: "Golden Retriever",
    species: "dog",
    gender: "female",
    age: 3,
    weight: 65,
    photo: "",
    lastCheckup: "2 weeks ago",
    healthScore: 87,
    birthDate: new Date(2021, 5, 15),
    vetName: "Dr. Sarah Johnson",
    vetPhone: "(555) 123-4567",
    allergies: "None known",
    medications: "Heartworm prevention monthly",
    notes: "Very active and friendly dog"
  });

  // Sample health trends
  const healthTrends = [
    { metric: "Appetite", current: 8, previous: 7, trend: "up" as const, color: "bg-orange-500" },
    { metric: "Energy", current: 7, previous: 8, trend: "down" as const, color: "bg-yellow-500" },
    { metric: "Mood", current: 9, previous: 9, trend: "stable" as const, color: "bg-pink-500" },
    { metric: "Weight", current: 65, previous: 66, trend: "down" as const, color: "bg-blue-500" }
  ];

  // Sample medical records
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([
    {
      id: "1",
      type: "vaccination",
      title: "Annual Rabies Vaccination",
      date: new Date(2024, 2, 15),
      nextDate: new Date(2025, 2, 15),
      veterinarian: "Dr. Sarah Johnson",
      notes: "No adverse reactions observed",
      status: "completed"
    },
    {
      id: "2",
      type: "checkup",
      title: "Annual Wellness Exam",
      date: new Date(2024, 1, 10),
      nextDate: new Date(2025, 1, 10),
      veterinarian: "Dr. Sarah Johnson",
      notes: "Excellent health, weight within normal range",
      status: "completed"
    },
    {
      id: "3",
      type: "vaccination",
      title: "Heartworm Prevention",
      date: new Date(2024, 6, 1),
      nextDate: new Date(2024, 8, 1),
      veterinarian: "Dr. Sarah Johnson",
      notes: "Monthly preventive treatment",
      status: "upcoming"
    }
  ]);

  // Sample reminders
  const reminders = [
    {
      id: "1",
      title: "Heartworm Prevention",
      type: "medication" as const,
      dueDate: "Tomorrow",
      status: "upcoming" as const
    },
    {
      id: "2",
      title: "Annual Checkup",
      type: "appointment" as const,
      dueDate: "In 2 weeks",
      status: "upcoming" as const
    }
  ];

  const handleLogHealth = (metrics: HealthMetrics) => {
    console.log("Health logged:", metrics);
  };

  const handleLogMetrics = (date: string, metrics: any) => {
    console.log("Calendar metrics logged:", date, metrics);
  };

  const handleSavePetProfile = (data: any) => {
    setPetData(prev => ({ ...prev, ...data }));
    setShowEditProfile(false);
    setHasSetupPet(true);
  };

  const handleAddMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: Date.now().toString()
    };
    setMedicalRecords(prev => [...prev, newRecord]);
  };

  if (showEditProfile) {
    return (
      <EditPetProfile
        onBack={() => setShowEditProfile(false)}
        onSave={handleSavePetProfile}
        initialData={petData}
      />
    );
  }

  if (!hasSetupPet) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="relative mx-auto w-64 h-48 mb-8 rounded-2xl overflow-hidden shadow-float">
              <img 
                src={heroImage} 
                alt="Pet Health Tracking" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-slide-in">
              Track Your Pet's
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Health</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-in">
              Monitor your furry friend's well-being with our beautiful, easy-to-use health tracking app. 
              Log daily metrics, track trends, and never miss important care reminders.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-in">
              <Button 
                variant="gradient" 
                size="lg"
                onClick={() => setShowEditProfile(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="h-5 w-5 mr-2" />
                Set Up Pet Profile
              </Button>
              
              <Button 
                variant="soft" 
                size="lg"
                onClick={() => setHasSetupPet(true)}
                className="w-full sm:w-auto"
              >
                View Sample Dashboard
              </Button>
            </div>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6 rounded-2xl bg-gradient-card shadow-card hover:shadow-float transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Weekly Calendar</h3>
              <p className="text-sm text-muted-foreground">
                Track daily food, water, and bathroom habits with our intuitive calendar view.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-card shadow-card hover:shadow-float transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Medical Records</h3>
              <p className="text-sm text-muted-foreground">
                Keep track of vaccinations, checkups, and important medical information.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-card shadow-card hover:shadow-float transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Health Insights</h3>
              <p className="text-sm text-muted-foreground">
                Visualize trends and patterns in your pet's health over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pet Health Tracker</h1>
            <p className="text-muted-foreground">Monitor {petData.name}'s well-being</p>
          </div>
          
          <Button 
            variant="outline"
            onClick={() => setShowEditProfile(true)}
          >
            <User className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Pet Profile Sidebar */}
          <div className="lg:col-span-1">
            <PetProfile pet={petData} />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="calendar" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="logger" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Log Health</span>
                </TabsTrigger>
                <TabsTrigger value="medical" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Medical</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="mt-0">
                <WeeklyCalendar 
                  petName={petData.name}
                  onMetricsLog={handleLogMetrics}
                />
              </TabsContent>

              <TabsContent value="dashboard" className="mt-0">
                <HealthDashboard 
                  petName={petData.name}
                  trends={healthTrends}
                  reminders={reminders}
                  overallHealth={petData.healthScore}
                />
              </TabsContent>

              <TabsContent value="logger" className="mt-0">
                <HealthLogger 
                  petName={petData.name}
                  onLogHealth={handleLogHealth}
                />
              </TabsContent>

              <TabsContent value="medical" className="mt-0">
                <MedicalRecords
                  petName={petData.name}
                  records={medicalRecords}
                  onAddRecord={handleAddMedicalRecord}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
