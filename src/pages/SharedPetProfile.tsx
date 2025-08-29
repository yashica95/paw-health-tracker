import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Activity, Heart, Star, ArrowLeft, FileText, Clock, CheckCircle, AlertCircle, BarChart3 } from "lucide-react";
import { HealthDashboard } from "@/components/HealthDashboard";

// Mock data for shared pet profiles (in a real app, this would come from an API)
const mockPetData = {
  "luna-golden-retriever": {
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
    lastMonthlyCheckin: new Date(2023, 0, 1),
    photos: [],
    points: 120,
    avatarLevel: 3,
    totalHealthRecords: 12,
    uniqueId: "luna-golden-retriever",
    shareableLink: "",
  }
};

// Mock health records
const mockHealthRecords = [
  {
    id: "1",
    title: "Annual Checkup",
    type: "checkup",
    date: new Date(2024, 0, 15),
    nextDate: new Date(2025, 0, 15),
    veterinarian: "Dr. Sarah Johnson",
    status: "upcoming",
    notes: "Routine annual examination and vaccinations"
  },
  {
    id: "2",
    title: "Dental Cleaning",
    type: "dental",
    date: new Date(2023, 11, 10),
    nextDate: new Date(2024, 11, 10),
    veterinarian: "Dr. Sarah Johnson",
    status: "completed",
    notes: "Professional dental cleaning and examination"
  },
  {
    id: "3",
    title: "Vaccination Update",
    type: "vaccination",
    date: new Date(2023, 8, 20),
    nextDate: new Date(2024, 8, 20),
    veterinarian: "Dr. Sarah Johnson",
    status: "completed",
    notes: "Annual vaccinations including rabies and distemper"
  },
  {
    id: "4",
    title: "Heartworm Test",
    type: "test",
    date: new Date(2024, 2, 10),
    nextDate: new Date(2024, 8, 10),
    veterinarian: "Dr. Sarah Johnson",
    status: "completed",
    notes: "Negative for heartworm, continue monthly prevention"
  }
];

// Mock health trends data for bar chart
const mockHealthTrends = [
  { date: "Mon", energy: 8, food: 9, water: 7, weight: 65 },
  { date: "Tue", energy: 7, food: 8, water: 8, weight: 65.2 },
  { date: "Wed", energy: 9, food: 9, water: 9, weight: 65.1 },
  { date: "Thu", energy: 6, food: 7, water: 6, weight: 64.8 },
  { date: "Fri", energy: 8, food: 8, water: 8, weight: 65.3 },
  { date: "Sat", energy: 9, food: 9, water: 9, weight: 65.5 },
  { date: "Sun", energy: 7, food: 8, water: 7, weight: 65.2 }
];

// Vaccination Schedule Component
const VaccinationSchedule = ({ petAge, species }: { petAge: number, species: string }) => {
  const isDog = species.toLowerCase() === 'dog';
  const isCat = species.toLowerCase() === 'cat';
  
  if (!isDog && !isCat) return null;

  const getAgeInWeeks = (ageInYears: number) => ageInYears * 52;
  const ageInWeeks = getAgeInWeeks(petAge);

  const getVaccinationStatus = (requiredAge: number, vaccineName: string) => {
    if (ageInWeeks >= requiredAge) {
      return { status: 'overdue', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    } else if (ageInWeeks >= requiredAge - 4) {
      return { status: 'due-soon', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    } else {
      return { status: 'upcoming', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'due-soon':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'upcoming':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'due-soon':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Due Soon</Badge>;
      case 'upcoming':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      default:
        return <Badge variant="secondary">Upcoming</Badge>;
    }
  };

  if (isDog) {
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-medium mb-3 text-purple-600 flex items-center">
          🐶 Dog Vaccination Schedule
        </h4>
        
        {/* Puppy Series */}
        <div className="space-y-3">
          <h5 className="font-medium text-sm text-gray-700">Puppy Series</h5>
          
          {/* 6-8 weeks */}
          {(() => {
            const status = getVaccinationStatus(6, 'DHPP 1st');
            return (
              <div className={`p-3 rounded-lg border-l-4 ${status.bgColor} ${status.borderColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status.status)}
                    <div>
                      <div className="font-medium">DHPP 1st Dose</div>
                      <div className="text-sm text-gray-600">
                        Distemper, Hepatitis/Adenovirus, Parvovirus, Parainfluenza
                      </div>
                      <div className="text-xs text-gray-500">Due: 6-8 weeks</div>
                    </div>
                  </div>
                  {getStatusBadge(status.status)}
                </div>
              </div>
            );
          })()}

          {/* 10-12 weeks */}
          {(() => {
            const status = getVaccinationStatus(10, 'DHPP 2nd');
            return (
              <div className={`p-3 rounded-lg border-l-4 ${status.bgColor} ${status.borderColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status.status)}
                    <div>
                      <div className="font-medium">DHPP 2nd Dose</div>
                      <div className="text-sm text-gray-600">
                        Distemper, Hepatitis/Adenovirus, Parvovirus, Parainfluenza
                      </div>
                      <div className="text-xs text-gray-500">Due: 10-12 weeks</div>
                    </div>
                  </div>
                  {getStatusBadge(status.status)}
                </div>
              </div>
            );
          })()}

          {/* 14-16 weeks */}
          {(() => {
            const status = getVaccinationStatus(14, 'DHPP 3rd + Rabies');
            return (
              <div className={`p-3 rounded-lg border-l-4 ${status.bgColor} ${status.borderColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status.status)}
                    <div>
                      <div className="font-medium">DHPP 3rd Dose + Rabies</div>
                      <div className="text-sm text-gray-600">
                        Final core puppy shot + Rabies (required by law)
                      </div>
                      <div className="text-xs text-gray-500">Due: 14-16 weeks</div>
                    </div>
                  </div>
                  {getStatusBadge(status.status)}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Adolescence */}
        {ageInWeeks >= 40 && (
          <div className="space-y-3">
            <h5 className="font-medium text-sm text-gray-700">Adolescence (1 year)</h5>
            {(() => {
              const status = getVaccinationStatus(52, 'DHPP + Rabies Booster');
              return (
                <div className={`p-3 rounded-lg border-l-4 ${status.bgColor} ${status.borderColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(status.status)}
                      <div>
                        <div className="font-medium">DHPP + Rabies Booster</div>
                        <div className="text-sm text-gray-600">
                          1 year after puppy series
                        </div>
                        <div className="text-xs text-gray-500">Due: ~1 year old</div>
                      </div>
                    </div>
                    {getStatusBadge(status.status)}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Adult */}
        {ageInWeeks >= 52 && (
          <div className="space-y-3">
            <h5 className="font-medium text-sm text-gray-700">Adult Dogs</h5>
            <div className="p-3 rounded-lg border-l-4 bg-gray-50 border-gray-200">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium">DHPP Booster</div>
                  <div className="text-sm text-gray-600">
                    Every 1-3 years (depending on vet/law)
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-lg border-l-4 bg-gray-50 border-gray-200">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium">Rabies Booster</div>
                  <div className="text-sm text-gray-600">
                    Every 1-3 years (required by law)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isCat) {
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-medium mb-3 text-purple-600 flex items-center">
          🐱 Cat Vaccination Schedule
        </h4>
        
        {/* Kitten Series */}
        <div className="space-y-3">
          <h5 className="font-medium text-sm text-gray-700">Kitten Series</h5>
          
          {/* 6-8 weeks */}
          {(() => {
            const status = getVaccinationStatus(6, 'FVRCP 1st');
            return (
              <div className={`p-3 rounded-lg border-l-4 ${status.bgColor} ${status.borderColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status.status)}
                    <div>
                      <div className="font-medium">FVRCP 1st Dose</div>
                      <div className="text-sm text-gray-600">
                        Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia
                      </div>
                      <div className="text-xs text-gray-500">Due: 6-8 weeks</div>
                    </div>
                  </div>
                  {getStatusBadge(status.status)}
                </div>
              </div>
            );
          })()}

          {/* 10-12 weeks */}
          {(() => {
            const status = getVaccinationStatus(10, 'FVRCP 2nd + FeLV');
            return (
              <div className={`p-3 rounded-lg border-l-4 ${status.bgColor} ${status.borderColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status.status)}
                    <div>
                      <div className="font-medium">FVRCP 2nd Dose + FeLV</div>
                      <div className="text-sm text-gray-600">
                        FVRCP + Feline Leukemia Virus (recommended)
                      </div>
                      <div className="text-xs text-gray-500">Due: 10-12 weeks</div>
                    </div>
                  </div>
                  {getStatusBadge(status.status)}
                </div>
              </div>
            );
          })()}

          {/* 14-16 weeks */}
          {(() => {
            const status = getVaccinationStatus(14, 'FVRCP 3rd + Rabies');
            return (
              <div className={`p-3 rounded-lg border-l-4 ${status.bgColor} ${status.borderColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status.status)}
                    <div>
                      <div className="font-medium">FVRCP 3rd Dose + Rabies</div>
                      <div className="text-sm text-gray-600">
                        Final kitten shot + Rabies (mandatory in most provinces)
                      </div>
                      <div className="text-xs text-gray-500">Due: 14-16 weeks</div>
                    </div>
                  </div>
                  {getStatusBadge(status.status)}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Adolescence */}
        {ageInWeeks >= 40 && (
          <div className="space-y-3">
            <h5 className="font-medium text-sm text-gray-700">Adolescence (1 year)</h5>
            {(() => {
              const status = getVaccinationStatus(52, 'FVRCP + Rabies Booster');
              return (
                <div className={`p-3 rounded-lg border-l-4 ${status.bgColor} ${status.borderColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(status.status)}
                      <div>
                        <div className="font-medium">FVRCP + Rabies Booster</div>
                        <div className="text-sm text-gray-600">
                          1 year after kitten series
                        </div>
                        <div className="text-xs text-gray-500">Due: ~1 year old</div>
                      </div>
                    </div>
                    {getStatusBadge(status.status)}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Adult */}
        {ageInWeeks >= 52 && (
          <div className="space-y-3">
            <h5 className="font-medium text-sm text-gray-700">Adult Cats</h5>
            <div className="p-3 rounded-lg border-l-4 bg-gray-50 border-gray-200">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium">FVRCP Booster</div>
                  <div className="text-sm text-gray-600">
                    Every 1-3 years
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-lg border-l-4 bg-gray-50 border-gray-200">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium">Rabies Booster</div>
                  <div className="text-sm text-gray-600">
                    Every 1-3 years (required in most provinces)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

// Mock reminders
const mockReminders = [
  { id: "1", title: "Monthly Heartworm Prevention", type: "medication" as const, dueDate: "2024-04-15", status: "upcoming" as const },
  { id: "2", title: "Annual Vaccination", type: "vaccination" as const, dueDate: "2024-06-15", status: "upcoming" as const }
];

// Simple Bar Chart Component
const HealthBarChart = ({ data }: { data: typeof mockHealthTrends }) => {
  const maxValue = 10; // Max value for energy, food, water (weight uses different scale)
  const maxWeight = Math.max(...data.map(d => d.weight)) + 2;

  return (
    <div className="space-y-6">
      {/* Energy Chart */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm font-medium">Energy Level</span>
        </div>
        <div className="flex items-end space-x-2 h-32">
          {data.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-1">{day.date}</div>
              <div 
                className="w-full bg-yellow-500 rounded-t transition-all duration-300 hover:bg-yellow-600"
                style={{ height: `${(day.energy / maxValue) * 100}%` }}
                title={`${day.date}: ${day.energy}/10`}
              ></div>
              <div className="text-xs font-medium mt-1">{day.energy}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Food Chart */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-sm font-medium">Food Intake</span>
        </div>
        <div className="flex items-end space-x-2 h-32">
          {data.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-orange-500 rounded-t transition-all duration-300 hover:bg-orange-600"
                style={{ height: `${(day.food / maxValue) * 100}%` }}
                title={`${day.date}: ${day.food}/10`}
              ></div>
              <div className="text-xs font-medium mt-1">{day.food}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Water Chart */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium">Water Intake</span>
        </div>
        <div className="flex items-end space-x-2 h-32">
          {data.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(day.water / maxValue) * 100}%` }}
                title={`${day.date}: ${day.water}/10`}
              ></div>
              <div className="text-xs font-medium mt-1">{day.water}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weight Chart */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
          <span className="text-sm font-medium">Weight (lbs)</span>
        </div>
        <div className="flex items-end space-x-2 h-32">
          {data.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-emerald-600 rounded-t transition-all duration-300 hover:bg-emerald-700"
                style={{ height: `${((day.weight - 60) / (maxWeight - 60)) * 100}%` }}
                title={`${day.date}: ${day.weight} lbs`}
              ></div>
              <div className="text-xs font-medium mt-1">{day.weight}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SharedPetProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [petData, setPetData] = useState<any>(null);

  useEffect(() => {
    if (id && mockPetData[id as keyof typeof mockPetData]) {
      setPetData(mockPetData[id as keyof typeof mockPetData]);
    }
  }, [id]);

  if (!petData) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pet Not Found</h1>
          <p className="text-gray-600 mb-6">The pet profile you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button variant="gradient">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getAvatarEmoji = (level: number) => {
    const avatars = ['🐾', '🐕', '🦮', '🐕‍🦺', '🦊', '🐺'];
    return avatars[Math.min(level - 1, avatars.length - 1)];
  };

  const getAvatarSize = (level: number) => {
    return Math.min(16 + (level - 1) * 4, 36);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Shared Pet Profile</h1>
              <p className="text-muted-foreground">Viewing {petData.name}'s health information</p>
            </div>
          </div>
          
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Read Only
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 1. Pet Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-card shadow-card">
              <div className="flex items-center space-x-4">
                {/* Growing Pet Avatar */}
                <div className="relative">
                  <div 
                    className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg"
                    style={{ width: `${getAvatarSize(petData.avatarLevel)}px`, height: `${getAvatarSize(petData.avatarLevel)}px` }}
                  >
                    <span className="text-lg">{getAvatarEmoji(petData.avatarLevel)}</span>
                  </div>
                  {/* Level Badge */}
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    {petData.avatarLevel}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-foreground">{petData.name}</h3>
                    <Badge variant="secondary" className="ml-2">
                      {petData.breed}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{petData.age} years old</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Activity className="h-4 w-4" />
                      <span>{petData.weight} lbs</span>
                    </div>
                  </div>
                  
                  {/* Gamification Stats */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{petData.points} pts</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">{petData.totalHealthRecords} records</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Health Score</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${petData.healthScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold">{petData.healthScore}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    Last checkup: {petData.lastCheckup}
                  </p>
                  
                  {/* Pet ID for sharing */}
                  <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                    <div className="text-gray-500">Pet ID: {petData.uniqueId}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* 2. Medical Records Section */}
          <div className="lg:col-span-3">
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Medical Records
              </h3>
              
              {/* Upcoming Appointments */}
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-3 text-blue-600">Upcoming Appointments</h4>
                <div className="space-y-3">
                  {mockHealthRecords.filter(r => r.status === 'upcoming').map(record => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(record.status)}
                        <div>
                          <div className="font-medium">{record.title}</div>
                          <div className="text-sm text-gray-600">
                            {record.veterinarian} • {record.type}
                          </div>
                          <div className="text-xs text-gray-500">
                            Next: {record.nextDate?.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                  {mockHealthRecords.filter(r => r.status === 'upcoming').length === 0 && (
                    <p className="text-gray-500 text-sm">No upcoming appointments</p>
                  )}
                </div>
              </div>

              {/* Past Records */}
              <div>
                <h4 className="text-lg font-medium mb-3 text-green-600">Past Records</h4>
                <div className="space-y-3">
                  {mockHealthRecords.filter(r => r.status === 'completed').map(record => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(record.status)}
                        <div>
                          <div className="font-medium">{record.title}</div>
                          <div className="text-sm text-gray-600">
                            {record.veterinarian} • {record.type}
                          </div>
                          <div className="text-xs text-gray-500">
                            Completed: {record.date.toLocaleDateString()}
                          </div>
                          {record.notes && (
                            <div className="text-xs text-gray-600 mt-1">{record.notes}</div>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vaccination Schedule */}
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-3 text-purple-600 flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Vaccination Schedule
                </h4>
                <VaccinationSchedule petAge={petData.age} species={petData.species} />
              </div>
            </Card>

            {/* 3. Bar Chart & Dashboard Combined */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Bar Chart */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Health Trends
                </h3>
                <HealthBarChart data={mockHealthTrends} />
              </Card>

              {/* Dashboard Summary */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Health Overview
                </h3>
                <HealthDashboard 
                  petName={petData.name}
                  trends={mockHealthTrends.map(t => ({
                    metric: "Weekly Average",
                    current: Math.round((t.energy + t.food + t.water) / 3),
                    previous: Math.round((t.energy + t.food + t.water) / 3) - 1,
                    trend: 'up' as const,
                    color: 'text-blue-500'
                  }))}
                  reminders={mockReminders}
                  overallHealth={petData.healthScore}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedPetProfile;
