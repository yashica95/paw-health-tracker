import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PetProfile } from "@/components/PetProfile";
import { HealthLogger } from "@/components/HealthLogger";
import { HealthDashboard } from "@/components/HealthDashboard";
import { Plus, Heart, Calendar, Activity, TrendingUp } from "lucide-react";
import heroImage from "@/assets/pet-health-hero.jpg";

interface HealthMetrics {
  appetite: number;
  energy: number;
  mood: number;
  temperature: number;
  notes: string;
}

const Index = () => {
  const [showLogger, setShowLogger] = useState(false);
  const [hasLogs, setHasLogs] = useState(false);

  // Sample pet data
  const samplePet = {
    id: "1",
    name: "Luna",
    breed: "Golden Retriever",
    age: 3,
    weight: 65,
    photo: "",
    lastCheckup: "2 weeks ago",
    healthScore: 87
  };

  // Sample health trends
  const healthTrends = [
    { metric: "Appetite", current: 8, previous: 7, trend: "up" as const, color: "bg-orange-500" },
    { metric: "Energy", current: 7, previous: 8, trend: "down" as const, color: "bg-yellow-500" },
    { metric: "Mood", current: 9, previous: 9, trend: "stable" as const, color: "bg-pink-500" },
    { metric: "Weight", current: 65, previous: 66, trend: "down" as const, color: "bg-blue-500" }
  ];

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
    setHasLogs(true);
    setShowLogger(false);
  };

  if (!hasLogs && !showLogger) {
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
                onClick={() => setShowLogger(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="h-5 w-5 mr-2" />
                Start Tracking Health
              </Button>
              
              <Button 
                variant="soft" 
                size="lg"
                onClick={() => setHasLogs(true)}
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
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Daily Health Logs</h3>
              <p className="text-sm text-muted-foreground">
                Track appetite, energy, mood, and more with our intuitive logging system.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-card shadow-card hover:shadow-float transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Health Insights</h3>
              <p className="text-sm text-muted-foreground">
                Visualize trends and patterns in your pet's health over time.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-card shadow-card hover:shadow-float transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Reminders</h3>
              <p className="text-sm text-muted-foreground">
                Never miss medications, appointments, or important health milestones.
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
            <p className="text-muted-foreground">Monitor your pet's well-being</p>
          </div>
          
          <Button 
            variant="gradient"
            onClick={() => setShowLogger(!showLogger)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {showLogger ? "Back to Dashboard" : "Log Health"}
          </Button>
        </div>

        {showLogger ? (
          /* Health Logger View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <PetProfile pet={samplePet} />
            </div>
            <div className="lg:col-span-2">
              <HealthLogger 
                petName={samplePet.name}
                onLogHealth={handleLogHealth}
              />
            </div>
          </div>
        ) : (
          /* Dashboard View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <PetProfile pet={samplePet} />
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => setShowLogger(true)}
              >
                <Activity className="h-4 w-4 mr-2" />
                Quick Health Check
              </Button>
            </div>
            
            <div className="lg:col-span-2">
              <HealthDashboard 
                petName={samplePet.name}
                trends={healthTrends}
                reminders={reminders}
                overallHealth={samplePet.healthScore}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;