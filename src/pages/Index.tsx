import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar as CalendarIcon, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Heart, 
  PawPrint, 
  Crown,
  Trophy,
  Gift,
  Target,
  Zap,
  Menu,
  Activity,
  FileText,
  ShoppingCart,
  Image,
  ChevronRight,
  TrendingUp,
  ChevronLeft
} from 'lucide-react';
import { format, addDays, subDays, startOfWeek, isSameDay, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { WeeklyCalendar } from '@/components/WeeklyCalendar';
import { HealthDashboard } from '@/components/HealthDashboard';
import { MedicalRecords } from '@/components/MedicalRecords';
import { PhotoGallery } from '@/components/PhotoGallery';
import { AddVet } from '@/components/vets/AddOntarioVet';
import { useParams } from 'react-router-dom';
import { PetProfile } from "@/components/PetProfile";
import { EditPetProfile } from "@/components/EditPetProfile";
import { HealthLogger } from "@/components/HealthLogger";
import { PetSupplies } from "@/components/PetSupplies";
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

export default function Index() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [hasSetupPet, setHasSetupPet] = useState(true); // Set to true since we have sample pets
  const [selectedPetId, setSelectedPetId] = useState<string>('luna');
  const { toast } = useToast();

  // Multiple pets data
  const [pets, setPets] = useState([
    {
      id: 'luna',
      name: 'Luna',
      breed: 'Golden Retriever',
      age: 3,
      weight: 65,
      photo: '',
      lastCheckup: '2024-01-15',
      healthScore: 85,
      points: 150,
      avatarLevel: 2,
      totalHealthRecords: 45,
      uniqueId: 'luna-golden-retriever',
      species: 'Dog',
      color: 'Golden',
      microchip: 'CHIP123456',
      veterinarian: 'Dr. Smith',
      ownerName: 'John Doe',
      ownerPhone: '+1-555-0123',
      ownerEmail: 'john@example.com',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+1-555-0124',
      medicalNotes: 'Allergic to chicken',
      photos: [],
      lastMonthlyCheckin: new Date(2024, 0, 1),
      vetPhone: '+1-555-0125',
      vetId: '',
      vetName: 'Dr. Smith'
    },
    {
      id: 'max',
      name: 'Max',
      breed: 'Persian Cat',
      age: 2,
      weight: 12,
      photo: '',
      lastCheckup: '2024-02-01',
      healthScore: 92,
      points: 75,
      avatarLevel: 1,
      totalHealthRecords: 28,
      uniqueId: 'max-persian-cat',
      species: 'Cat',
      color: 'White',
      microchip: 'CHIP789012',
      veterinarian: 'Dr. Johnson',
      ownerName: 'John Doe',
      ownerPhone: '+1-555-0123',
      ownerEmail: 'john@example.com',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+1-555-0124',
      medicalNotes: 'Indoor cat, very active',
      photos: [],
      lastMonthlyCheckin: new Date(2024, 1, 1),
      vetPhone: '+1-555-0126',
      vetId: '',
      vetName: 'Dr. Johnson'
    },
    {
      id: 'buddy',
      name: 'Buddy',
      breed: 'Labrador',
      age: 5,
      weight: 70,
      photo: '',
      lastCheckup: '2024-01-20',
      healthScore: 78,
      points: 320,
      avatarLevel: 4,
      totalHealthRecords: 67,
      uniqueId: 'buddy-labrador',
      species: 'Dog',
      color: 'Black',
      microchip: 'CHIP345678',
      veterinarian: 'Dr. Smith',
      ownerName: 'John Doe',
      ownerPhone: '+1-555-0123',
      ownerEmail: 'john@example.com',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+1-555-0124',
      medicalNotes: 'Loves swimming, hip dysplasia monitoring',
      photos: [],
      lastMonthlyCheckin: new Date(2024, 0, 15),
      vetPhone: '+1-555-0125',
      vetId: '',
      vetName: 'Dr. Smith'
    }
  ]);

  const [vets, setVets] = useState<VetRecord[]>([]);

  // Get current selected pet data
  const petData = pets.find(pet => pet.id === selectedPetId) || pets[0];

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
    setPets(prev => prev.map(pet => 
      pet.id === selectedPetId ? { ...pet, ...data } : pet
    ));
    setShowEditProfile(false);
    setHasSetupPet(true);
    toast({
      title: "Profile updated!",
      description: "Your pet's profile has been updated successfully.",
    });
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
    
    setPets(prev => prev.map(pet => 
      pet.id === selectedPetId ? { ...pet, points: newPoints, avatarLevel: newLevel, totalHealthRecords: newTotalRecords } : pet
    ));

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
    setPets(prev => prev.map(pet => 
      pet.id === selectedPetId ? { ...pet, shareableLink: shareLink } : pet
    ));
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
    setPets(prev => prev.map(pet => 
      pet.id === selectedPetId ? { ...pet, lastMonthlyCheckin: new Date() } : pet
    ));
  };

  const handleAddPhoto = (photoUrl: string) => {
    setPets(prev => prev.map(pet => 
      pet.id === selectedPetId ? { 
        ...pet, 
        photos: [...pet.photos, photoUrl],
        photo: photoUrl // Also update the main photo for immediate background update
      } : pet
    ));
  };

  const handleRemovePhoto = (photoIndex: number) => {
    setPets(prev => prev.map(pet => 
      pet.id === selectedPetId ? { ...pet, photos: pet.photos.filter((_, index) => index !== photoIndex) } : pet
    ));
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowMobileMenu(false); // Close mobile menu when tab changes
  };

  const handlePetChange = (petId: string) => {
    setSelectedPetId(petId);
    // Reset to calendar tab when switching pets
    setActiveTab('calendar');
  };

  const addNewPet = () => {
    const newPet = {
      id: `pet-${Date.now()}`,
      name: 'New Pet',
      breed: 'Unknown',
      age: 1,
      weight: 20,
      photo: '',
      lastCheckup: new Date().toISOString().split('T')[0],
      healthScore: 100,
      points: 0,
      avatarLevel: 1,
      totalHealthRecords: 0,
      uniqueId: `new-pet-${Date.now()}`,
      species: 'Dog',
      color: 'Unknown',
      microchip: '',
      veterinarian: '',
      ownerName: petData.ownerName,
      ownerPhone: petData.ownerPhone,
      ownerEmail: petData.ownerEmail,
      emergencyContact: petData.emergencyContact,
      emergencyPhone: petData.emergencyPhone,
      medicalNotes: ''
    };
    setPets(prev => [...prev, newPet]);
    setSelectedPetId(newPet.id);
    toast({
      title: "New pet added!",
      description: "You can now edit the pet's profile.",
    });
  };

  if (showEditProfile) {
    return (
      <EditPetProfile
        onBack={() => setShowEditProfile(false)}
        onSave={handleSavePetProfile}
        initialData={petData}
        onSelectVet={(vet: any) => {
          upsertVet(vet);
          setPets(prev => prev.map(pet => 
            pet.id === selectedPetId ? { ...pet, vetId: vet.id, vetName: vet.salutationName || `${vet.firstName||''} ${vet.lastName||''}`.trim(), vetPhone: vet.phone || prev.vetPhone } : pet
          ));
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
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Medical Records</h3>
              <p className="text-sm text-muted-foreground">
                Keep track of vaccinations, checkups, and important medical information.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-card shadow-card hover:shadow-float transition-all duration-300 transform hover:scale-105">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Health Insights</h3>
              <p className="text-sm text-muted-foreground">
                Visualize trends and patterns in your pet's health over time.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-card shadow-card hover:shadow-float transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Pet Care</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive tools for monitoring and managing your pet's health.
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
          
          {/* Pet Selector and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Scrollable Pet Cards */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const currentIndex = pets.findIndex(pet => pet.id === selectedPetId);
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : pets.length - 1;
                    handlePetChange(pets[prevIndex].id);
                  }}
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                  title="Previous pet"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
                  {pets.map((pet) => (
                    <button
                      key={pet.id}
                      onClick={() => handlePetChange(pet.id)}
                      className={cn(
                        "flex-shrink-0 p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                        selectedPetId === pet.id 
                          ? 'border-primary bg-primary/10 shadow-lg' 
                          : 'border-border bg-background hover:border-primary/50'
                      )}
                    >
                      <div className="flex items-center space-x-3 min-w-[180px]">
                        <span className="text-2xl">
                          {pet.species === 'Dog' ? '🐕' : '🐱'}
                        </span>
                        <div className="text-left">
                          <div className="font-semibold text-sm">{pet.name}</div>
                          <div className="text-xs text-muted-foreground">{pet.breed}</div>
                          <div className="text-xs font-medium text-primary">Level {pet.avatarLevel}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  {/* Add New Pet Card */}
                  <button
                    onClick={addNewPet}
                    className="flex-shrink-0 p-3 rounded-lg border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 transition-all duration-200 hover:scale-105 min-w-[180px]"
                  >
                    <div className="flex items-center space-x-3">
                      <Plus className="h-6 w-6 text-primary" />
                      <div className="text-left">
                        <div className="font-semibold text-sm text-primary">Add New Pet</div>
                        <div className="text-xs text-muted-foreground">Create profile</div>
                      </div>
                    </div>
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    const currentIndex = pets.findIndex(pet => pet.id === selectedPetId);
                    const nextIndex = currentIndex < pets.length - 1 ? currentIndex + 1 : 0;
                    handlePetChange(pets[nextIndex].id);
                  }}
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                  title="Next pet"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                      <PawPrint className="h-5 w-5" />
                      <span>Navigation</span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    {/* Pet Selector for Mobile */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground mb-3">Select Pet</div>
                      {pets.map((pet) => (
                        <button
                          key={pet.id}
                          onClick={() => {
                            handlePetChange(pet.id);
                            setShowMobileMenu(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                            selectedPetId === pet.id 
                              ? 'bg-primary text-primary-foreground border-primary' 
                              : 'bg-background hover:bg-accent border-border'
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">
                              {pet.species === 'Dog' ? '🐕' : '🐱'}
                            </span>
                            <div className="text-left">
                              <div className="font-medium">{pet.name}</div>
                              <div className="text-xs opacity-80">{pet.breed}</div>
                            </div>
                          </div>
                          {selectedPetId === pet.id && (
                            <div className="w-2 h-2 bg-current rounded-full" />
                          )}
                        </button>
                      ))}
                      
                      <Button 
                        onClick={() => {
                          addNewPet();
                          setShowMobileMenu(false);
                        }}
                        variant="outline" 
                        className="w-full justify-start"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Pet
                      </Button>
                    </div>

                    {/* Mobile Tab Navigation */}
                    <div className="pt-4 border-t">
                      <div className="text-sm font-medium text-muted-foreground mb-3">Main Sections</div>
                      
                      <button
                        onClick={() => handleTabChange('calendar')}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                          activeTab === 'calendar' 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-background hover:bg-accent border-border'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <CalendarIcon className="h-5 w-5" />
                          <span>Calendar</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleTabChange('dashboard')}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                          activeTab === 'dashboard' 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-background hover:bg-accent border-border'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <Activity className="h-5 w-5" />
                          <span>Dashboard</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleTabChange('medical')}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                          activeTab === 'medical' 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-background hover:bg-accent border-border'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5" />
                          <span>Medical Records</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleTabChange('supplies')}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                          activeTab === 'supplies' 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-background hover:bg-accent border-border'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <ShoppingCart className="h-5 w-5" />
                          <span>Supplies</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleTabChange('vets')}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                          activeTab === 'vets' 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-background hover:bg-accent border-border'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <Heart className="h-5 w-5" />
                          <span>Vets</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleTabChange('photos')}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                          activeTab === 'photos' 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-background hover:bg-accent border-border'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <Image className="h-5 w-5" />
                          <span>Photos</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleTabChange('rewards')}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                          activeTab === 'rewards' 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-background hover:bg-accent border-border'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <Trophy className="h-5 w-5" />
                          <span>Rewards</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t">
                      <div className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</div>
                      
                      <Button 
                        onClick={() => {
                          setShowEditProfile(true);
                          setShowMobileMenu(false);
                        }}
                        variant="outline" 
                        className="w-full justify-start"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Pet Profile Sidebar */}
          <div className="lg:col-span-1">
            {/* Pet Profile */}
            <PetProfile 
              pet={petData} 
              onShareProfile={() => {
                const shareUrl = `${window.location.origin}/pet/${petData.uniqueId}`;
                navigator.clipboard.writeText(shareUrl);
                toast({
                  title: "Profile link copied!",
                  description: "Share this link with your vet or family members.",
                });
              }}
              onPetChange={handlePetChange}
              pets={pets}
              selectedPetId={selectedPetId}
              onPhotoUpload={handleAddPhoto}
            />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Mobile Tab Indicator */}
              <div className="lg:hidden mb-6">
                <div className="flex items-center space-x-2 p-3 bg-accent rounded-lg">
                  <div className="flex items-center space-x-2">
                    {activeTab === 'calendar' && <CalendarIcon className="h-4 w-4" />}
                    {activeTab === 'dashboard' && <Activity className="h-4 w-4" />}
                    {activeTab === 'medical' && <FileText className="h-4 w-4" />}
                    {activeTab === 'supplies' && <ShoppingCart className="h-4 w-4" />}
                    {activeTab === 'vets' && <Heart className="h-4 w-4" />}
                    {activeTab === 'photos' && <Image className="h-4 w-4" />}
                    {activeTab === 'rewards' && <Trophy className="h-4 w-4" />}
                  </div>
                  <span className="font-medium capitalize">{activeTab}</span>
                </div>
              </div>

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
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
