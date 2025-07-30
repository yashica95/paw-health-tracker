import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Activity } from "lucide-react";

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  photo?: string;
  lastCheckup: string;
  healthScore: number;
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

  return (
    <Card className="p-6 bg-gradient-card shadow-card hover:shadow-float transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16 ring-4 ring-primary/20">
          <AvatarImage src={pet.photo} alt={pet.name} />
          <AvatarFallback className="bg-gradient-primary text-white text-xl font-bold">
            {pet.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
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
        </div>
      </div>
    </Card>
  );
};