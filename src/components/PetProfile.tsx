import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Activity, Star } from "lucide-react";

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  photo?: string;
  lastCheckup: string;
  healthScore: number;
  // Gamification properties
  points: number;
  avatarLevel: number;
  totalHealthRecords: number;
  // Pet sharing properties
  uniqueId: string;
}

interface PetProfileProps {
  pet: Pet;
}

export const PetProfile = ({ pet }: PetProfileProps) => {
  const getHealthColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getAvatarEmoji = (level: number) => {
    const avatars = ['🐾', '🐕', '🦮', '🐕‍🦺', '🦊', '🐺'];
    return avatars[Math.min(level - 1, avatars.length - 1)];
  };

  const getAvatarSize = (level: number) => {
    // Avatar grows with level: 16 -> 20 -> 24 -> 28 -> 32 -> 36
    return Math.min(16 + (level - 1) * 4, 36);
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card hover:shadow-float transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-center space-x-4">
        {/* Growing Pet Avatar */}
        <div className="relative">
          <div 
            className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300"
            style={{ width: `${getAvatarSize(pet.avatarLevel)}px`, height: `${getAvatarSize(pet.avatarLevel)}px` }}
          >
            <span className="text-lg">{getAvatarEmoji(pet.avatarLevel)}</span>
          </div>
          {/* Level Badge */}
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
            {pet.avatarLevel}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-foreground">{pet.name}</h3>
            <Badge variant="secondary" className="ml-2">
              {pet.breed}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{pet.age} years old</span>
            </div>
            <div className="flex items-center space-x-1">
              <Activity className="h-4 w-4" />
              <span>{pet.weight} lbs</span>
            </div>
          </div>
          
          {/* Gamification Stats */}
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{pet.points} pts</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">{pet.totalHealthRecords} records</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Health Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getHealthColor(pet.healthScore)} transition-all duration-500`}
                    style={{ width: `${pet.healthScore}%` }}
                  />
                </div>
                <span className="text-sm font-bold">{pet.healthScore}%</span>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            Last checkup: {pet.lastCheckup}
          </p>
          
          {/* Pet ID for sharing */}
          <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
            <div className="text-gray-500">Pet ID: {pet.uniqueId}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};