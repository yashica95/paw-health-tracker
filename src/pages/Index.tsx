import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PetProfile } from "@/components/PetProfile";
import { EditPetProfile } from "@/components/EditPetProfile";
import { HealthLogger } from "@/components/HealthLogger";
import { HealthDashboard } from "@/components/HealthDashboard";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { MedicalRecords } from "@/components/MedicalRecords";
import { PetSupplies } from "@/components/PetSupplies";
import { Plus, Heart, Calendar, Activity, TrendingUp, User, FileText, ShoppingCart, Image } from "lucide-react";
import { AddVet } from "@/components/vets/AddOntarioVet";
import heroImage from "@/assets/pet-health-hero.jpg";
import { useToast } from "@/components/ui/use-toast";
import { PhotoGallery } from "@/components/PhotoGallery";

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

interface VetRecord {
  id: string; // CVO id or generated
  source: 'CVO-ON' | 'manual';
  firstName?: string;
  lastName?: string;
  salutationName?: string;
  clinicName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  registrationStatus?: string;
  classOfRegistration?: string;
  education?: string;
  licenseHistory?: Array<{ status: string; className?: string; from: string; to?: string }>;
}

const Index = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [hasSetupPet, setHasSetupPet] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  const { toast } = useToast();

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
    notes: "Very active and friendly dog",
    vetId: "",
    lastMonthlyCheckin: new Date(2023, 0, 1), // Example last check-in date
    photos: [] as string[], // Example photos array
    // Gamification system
    points: 0,
    avatarLevel: 1,
    totalHealthRecords: 0,
    // Pet sharing system
    uniqueId: "luna-golden-retriever",
    shareableLink: ""
  });

  const [vets, setVets] = useState<VetRecord[]>([]);

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

  const upsertVet = (vet: VetRecord) => {
    setVets(prev => {
      const exists = prev.find(v => v.id === vet.id);
      if (exists) {
        return prev.map(v => v.id === vet.id ? { ...exists, ...vet } : v);
      }
      return [...prev, vet];
    });
  };

  const handleAddMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: Date.now().toString()
    };
    setMedicalRecords(prev => [...prev, newRecord]);
  };

  const handleUpdateMedicalRecord = (id: string, update: Partial<MedicalRecord>) => {
    setMedicalRecords(prev => prev.map(r => r.id === id ? { ...r, ...update } : r));
  };

  const handleAddHealthRecord = (record: any) => {
    setMedicalRecords(prev => [...prev, record]);
    
    // Award points for health tracking
    const newPoints = petData.points + 10;
    const newLevel = calculateAvatarLevel(newPoints);
    const newTotalRecords = petData.totalHealthRecords + 1;
    
    setPetData(prev => ({
      ...prev,
      points: newPoints,
      avatarLevel: newLevel,
      totalHealthRecords: newTotalRecords
    }));

    // Show achievement notification
    if (newLevel > petData.avatarLevel) {
      toast({ 
        title: "🎉 Level Up!", 
        description: `${petData.name} reached level ${newLevel}!`, 
        variant: "default" 
      });
    } else {
      toast({ 
        title: "🏆 +10 Points!", 
        description: `Great job! ${petData.name} earned 10 points for health tracking!`, 
        variant: "default" 
      });
    }
  };

  // Gamification helper functions
  const calculateAvatarLevel = (points: number) => {
    if (points < 50) return 1;
    if (points < 100) return 2;
    if (points < 200) return 3;
    if (points < 400) return 4;
    if (points < 800) return 5;
    return 6; // Max level
  };

  const getAvatarEmoji = (level: number) => {
    const avatars = ['🐾', '🐕', '🦮', '🐕‍🦺', '🦊', '🐺'];
    return avatars[Math.min(level - 1, avatars.length - 1)];
  };

  // Pet sharing functions
  const generateShareableLink = () => {
    const baseUrl = window.location.origin;
    const shareLink = `${baseUrl}/pet/${petData.uniqueId}`;
    setPetData(prev => ({ ...prev, shareableLink: shareLink }));
    return shareLink;
  };

  const copyShareableLink = async () => {
    const link = generateShareableLink();
    try {
      await navigator.clipboard.writeText(link);
      toast({ title: "Link Copied!", description: "Pet profile link copied to clipboard", variant: "default" });
    } catch (err) {
      toast({ title: "Copy Failed", description: "Please copy the link manually", variant: "destructive" });
    }
  };

  // Monthly check-in reminder logic
  const getMonthlyCheckinStatus = () => {
    const now = new Date();
    const lastCheckin = petData.lastMonthlyCheckin;
    const monthsSinceLastCheckin = (now.getFullYear() - lastCheckin.getFullYear()) * 12 + 
      (now.getMonth() - lastCheckin.getMonth());
    
    if (monthsSinceLastCheckin >= 1) {
      return {
        status: 'overdue' as const,
        monthsOverdue: monthsSinceLastCheckin,
        message: `Monthly check-in is ${monthsSinceLastCheckin} month${monthsSinceLastCheckin > 1 ? 's' : ''} overdue`
      };
    } else if (monthsSinceLastCheckin === 0) {
      const daysSinceLastCheckin = Math.floor((now.getTime() - lastCheckin.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastCheckin >= 25) {
        const daysUntilDue = 30 - daysSinceLastCheckin;
        return {
          status: 'due-soon' as const,
          daysUntilDue,
          message: `Monthly check-in due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`
        };
      }
    }
    
    return {
      status: 'up-to-date' as const,
      message: 'Monthly check-in is up to date'
    };
  };

  const handleMonthlyCheckin = () => {
    setPetData(prev => ({
      ...prev,
      lastMonthlyCheckin: new Date()
    }));
  };

  const handleAddPhoto = (photoUrl: string) => {
    setPetData(prev => ({
      ...prev,
      photos: [...prev.photos, photoUrl]
    }));
  };

  const handleRemovePhoto = (photoIndex: number) => {
    setPetData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== photoIndex)
    }));
  };

  // Derive calendar appointments from upcoming/overdue medical records
  const calendarAppointments = medicalRecords
    .filter(r => r.status === 'upcoming' || r.status === 'overdue')
    .map(r => ({
      date: r.nextDate ? r.nextDate.toISOString().slice(0,10) : r.date.toISOString().slice(0,10),
      title: r.title,
      type: r.type,
      veterinarian: r.veterinarian,
      status: r.status,
      nextDate: r.nextDate ? r.nextDate.toISOString().slice(0,10) : undefined,
      notes: r.notes
    }));

  if (showEditProfile) {
    return (
      <EditPetProfile
        onBack={() => setShowEditProfile(false)}
        onSave={handleSavePetProfile}
        initialData={petData}
        onSelectVet={(vet: any) => {
          upsertVet(vet);
          setPetData(prev => ({ ...prev, vetId: vet.id, vetName: vet.salutationName || `${vet.firstName||''} ${vet.lastName||''}`.trim(), vetPhone: vet.phone || prev.vetPhone }));
        }}
        vets={vets}
        onGoToVets={() => {
          setActiveTab("vets");
          setShowEditProfile(false);
        }}
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
              <TabsList className="grid w-full grid-cols-7 mb-6">
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
                <TabsTrigger value="supplies" className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Supplies</span>
                </TabsTrigger>
                <TabsTrigger value="vets" className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Vets</span>
                </TabsTrigger>
                <TabsTrigger value="photos" className="flex items-center space-x-2">
                  <Image className="h-4 w-4" />
                  <span className="hidden sm:inline">Photos</span>
                </TabsTrigger>
                <TabsTrigger value="rewards" className="flex items-center space-x-2">
                  <span className="text-lg">🏆</span>
                  <span className="hidden sm:inline">Rewards</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="mt-0">
                <WeeklyCalendar 
                  petName={petData.name}
                  onMetricsLog={handleLogMetrics}
                  appointments={calendarAppointments}
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
                  onLogHealth={handleAddHealthRecord}
                />
              </TabsContent>

              <TabsContent value="medical" className="mt-0">
                <MedicalRecords
                  petName={petData.name}
                  records={medicalRecords}
                  onAddRecord={handleAddMedicalRecord}
                  onUpdateRecord={handleUpdateMedicalRecord}
                  petAge={petData.age}
                  petSpecies={petData.species}
                />
              </TabsContent>

              <TabsContent value="supplies" className="mt-0">
                <PetSupplies pet={petData} />
              </TabsContent>

              {/* Vets Page (manage and add vets) */}
              <TabsContent value="vets" className="mt-0">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Saved Vets</h3>
                  <div className="p-4 rounded-lg border bg-background">
                    <h4 className="font-medium mb-2">Add vet from provincial registries</h4>
                    <AddVet onAdd={(v)=> upsertVet(v)} />
                  </div>
                  {vets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No vets saved yet. Use the form above to search and add from provincial registries.</p>
                  ) : (
                    vets.map(v => (
                      <div key={v.id} className="p-4 rounded-lg border bg-background">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{v.salutationName || `${v.firstName||''} ${v.lastName||''}`.trim()}</div>
                            <div className="text-sm text-muted-foreground">{v.clinicName}</div>
                            <div className="text-xs text-muted-foreground">{[v.address, v.city, v.province, v.postalCode].filter(Boolean).join(', ')}</div>
                          </div>
                          <div className="text-sm">{v.phone}</div>
                        </div>
                        {v.registrationStatus && (
                          <div className="mt-2 text-xs">Status: {v.registrationStatus} • Class: {v.classOfRegistration}</div>
                        )}
                        {Array.isArray(v.licenseHistory) && v.licenseHistory.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs font-medium mb-1">License history</div>
                            <ul className="text-xs list-disc ml-4 space-y-0.5">
                              {v.licenseHistory.map((h, i) => (
                                <li key={i}>{h.status} {h.className ? `(${h.className})` : ''} — {h.from?.slice(0,10)}{h.to ? ` → ${h.to.slice(0,10)}` : ''}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="photos" className="mt-0">
                <PhotoGallery 
                  photos={petData.photos}
                  onAddPhoto={handleAddPhoto}
                  onRemovePhoto={handleRemovePhoto}
                  petName={petData.name}
                />
              </TabsContent>

              {/* Rewards & Gamification Tab */}
              <TabsContent value="rewards" className="mt-0">
                <div className="space-y-6">
                  {/* Pet Avatar & Stats */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border">
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-6xl text-white shadow-lg">
                        {getAvatarEmoji(petData.avatarLevel)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{petData.name}'s Progress</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{petData.points}</div>
                            <div className="text-sm text-gray-600">Total Points</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{petData.totalHealthRecords}</div>
                            <div className="text-sm text-gray-600">Health Records</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">{petData.avatarLevel}</div>
                            <div className="text-sm text-gray-600">Avatar Level</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Level {petData.avatarLevel}</span>
                        <span>Level {petData.avatarLevel + 1}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((petData.points % 50) / 50 * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {50 - (petData.points % 50)} points to next level
                      </div>
                    </div>
                  </div>

                  {/* Rewards Store */}
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-xl font-semibold mb-4">🏪 Rewards Store</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Free Month Subscription</h4>
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">500 points</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Get one month of premium features for free!</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={petData.points < 500}
                          className="w-full"
                        >
                          {petData.points >= 500 ? 'Redeem' : 'Need ' + (500 - petData.points) + ' more points'}
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">20% Off Vet Visit</h4>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">200 points</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Save on your next veterinary appointment</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={petData.points < 200}
                          className="w-full"
                        >
                          {petData.points >= 200 ? 'Redeem' : 'Need ' + (200 - petData.points) + ' more points'}
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Pet Toy Bundle</h4>
                          <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">100 points</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Get a bundle of fun toys for your pet</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={petData.points < 100}
                          className="w-full"
                        >
                          {petData.points >= 100 ? 'Redeem' : 'Need ' + (100 - petData.points) + ' more points'}
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Health Report PDF</h4>
                          <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">50 points</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Download a detailed health report</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={petData.points < 50}
                          className="w-full"
                        >
                          {petData.points >= 50 ? 'Redeem' : 'Need ' + (50 - petData.points) + ' more points'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Pet Sharing Section */}
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-xl font-semibold mb-4">🔗 Share Pet Profile</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 p-3 rounded-lg flex-1">
                          <div className="text-xs text-gray-500 mb-1">Pet ID</div>
                          <div className="font-mono text-sm">{petData.uniqueId}</div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={copyShareableLink}
                          className="flex items-center space-x-2"
                        >
                          <span>Copy Link</span>
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600">
                        Share this link with vets or family members to give them access to {petData.name}'s health dashboard (read-only).
                      </div>
                      {petData.shareableLink && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Shareable Link</div>
                          <div className="font-mono text-sm break-all">{petData.shareableLink}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
