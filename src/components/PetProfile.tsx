import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Calendar, Activity, Trophy, Gift, Target, Zap, Star, Award, Crown, Medal } from "lucide-react";
import { useState, useRef } from "react";

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
  photos?: string[]; // Added photos array
}

interface PetProfileProps {
  pet: Pet;
  onShareProfile?: () => void;
  onPetChange?: (petId: string) => void;
  pets?: Pet[];
  selectedPetId: string;
  onPhotoUpload?: (file: File | string) => void;
}

export const PetProfile = ({ pet, onShareProfile, onPetChange, pets, selectedPetId, onPhotoUpload }: PetProfileProps) => {
  const [showRewards, setShowRewards] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const lastChangeTime = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const getNextLevelPoints = (currentLevel: number) => {
    return currentLevel * 100; // Each level requires 100 points
  };

  const getProgressToNextLevel = (currentPoints: number, currentLevel: number) => {
    const pointsForCurrentLevel = (currentLevel - 1) * 100;
    const pointsForNextLevel = currentLevel * 100;
    const progress = ((currentPoints - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getRewardsForLevel = (level: number) => {
    const rewards = {
      1: ['Basic Health Tips', 'Pet Care Guide'],
      2: ['5% Vet Visit Discount', 'Premium Food Sample'],
      3: ['10% Vet Visit Discount', 'Free Health Checkup'],
      4: ['15% Vet Visit Discount', 'Grooming Session'],
      5: ['20% Vet Visit Discount', 'Premium Pet Insurance']
    };
    return rewards[level as keyof typeof rewards] || ['Level Up Rewards'];
  };

  const getAchievements = () => {
    const achievements = [];
    if (pet.totalHealthRecords >= 10) achievements.push({ name: 'Health Tracker', icon: '📊', description: 'Logged 10+ health records', unlocked: true });
    if (pet.totalHealthRecords >= 30) achievements.push({ name: 'Dedicated Caregiver', icon: '💝', description: 'Logged 30+ health records', unlocked: true });
    if (pet.totalHealthRecords >= 50) achievements.push({ name: 'Health Expert', icon: '🏆', description: 'Logged 50+ health records', unlocked: true });
    if (pet.avatarLevel >= 3) achievements.push({ name: 'Rising Star', icon: '⭐', description: 'Reached level 3', unlocked: true });
    if (pet.avatarLevel >= 5) achievements.push({ name: 'Elite Pet', icon: '👑', description: 'Reached level 5', unlocked: true });
    if (pet.healthScore >= 90) achievements.push({ name: 'Perfect Health', icon: '💎', description: 'Maintained 90%+ health score', unlocked: true });
    
    // Add some locked achievements
    achievements.push({ name: 'Century Club', icon: '💯', description: 'Log 100 health records', unlocked: false });
    achievements.push({ name: 'Legendary Pet', icon: '🌟', description: 'Reach level 10', unlocked: false });
    achievements.push({ name: 'Health Master', icon: '🎯', description: 'Maintain 95%+ health for 30 days', unlocked: false });
    
    return achievements;
  };

  const getAvailableRewards = () => {
    const rewards = [];
    if (pet.points >= 50) rewards.push({ name: '5% Vet Visit Discount', cost: 50, icon: '🏥', description: 'Save on your next vet visit' });
    if (pet.points >= 100) rewards.push({ name: 'Premium Food Sample', cost: 100, icon: '🍖', description: 'Try premium pet food' });
    if (pet.points >= 150) rewards.push({ name: '10% Vet Visit Discount', cost: 150, icon: '🏥', description: 'Bigger savings on vet visits' });
    if (pet.points >= 200) rewards.push({ name: 'Grooming Session', cost: 200, icon: '✂️', description: 'Professional grooming service' });
    if (pet.points >= 300) rewards.push({ name: '20% Vet Visit Discount', cost: 300, icon: '🏥', description: 'Maximum vet visit savings' });
    if (pet.points >= 500) rewards.push({ name: 'Premium Pet Insurance', cost: 500, icon: '🛡️', description: '1 month of premium insurance' });
    
    return rewards;
  };

  // Simple function to change pets
  const changePet = (direction: 'next' | 'prev') => {
    if (!pets || !onPetChange || pets.length <= 1) return;
    
    const now = Date.now();
    if (now - lastChangeTime.current < 500) return; // Prevent rapid changes
    
    const currentIndex = pets.findIndex(p => p.id === selectedPetId);
    let nextIndex: number;
    
    if (direction === 'next') {
      nextIndex = currentIndex < pets.length - 1 ? currentIndex + 1 : 0;
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : pets.length - 1;
    }
    
    if (nextIndex !== currentIndex) {
      lastChangeTime.current = now;
      onPetChange(pets[nextIndex].id);
    }
  };

  // Handle scroll events to change pets
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      changePet('next');
    } else {
      changePet('prev');
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    
    // Only trigger if it's a clear horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 80) {
      if (deltaX > 0) {
        changePet('prev'); // Swipe right = previous pet
      } else {
        changePet('next'); // Swipe left = next pet
      }
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onPhotoUpload) {
      onPhotoUpload(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Main Pet Info Card */}
      <Card 
        className="p-4 bg-gradient-card shadow-card hover:shadow-float transition-all duration-300 transform hover:scale-[1.02] cursor-pointer relative overflow-hidden border-0"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        ref={cardRef}
      >

        
        {/* Content with relative positioning */}
        <div className="relative z-10 flex items-center space-x-4">
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
            {pet.photo || (pet.photos && pet.photos.length > 0) ? (
              <img 
                src={pet.photo || pet.photos[0]} 
                alt={`${pet.name}'s photo`}
                className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {pet.name.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Level Badge */}
            <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
              {pet.avatarLevel}
            </div>
            
            {/* Photo Upload Button */}
            {onPhotoUpload && (
              <button
                onClick={triggerFileUpload}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs hover:bg-primary/80 transition-colors shadow-lg"
                title="Upload photo"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Hidden File Input */}
          {onPhotoUpload && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          )}
          
          <div className="flex-1 min-w-0">
            {/* Pet Name and Breed */}
            <div className="mb-2">
              <h3 className="text-lg font-bold text-gray-900">{pet.name}</h3>
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800">
                {pet.breed}
              </Badge>
            </div>
            
            {/* Level Rewards Display */}
            <div className="mb-3">
              <div className="flex items-center space-x-2 mb-1">
                <Trophy className="h-3 w-3 text-yellow-300" />
                <span className="text-xs font-medium text-white drop-shadow-lg">Level {pet.avatarLevel} Rewards</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {getRewardsForLevel(pet.avatarLevel).slice(0, 2).map((reward, index) => (
                  <Badge key={index} variant="secondary" className="bg-yellow-100/90 text-yellow-800 text-xs px-2 py-0.5">
                    {reward}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Share Profile Button */}
            {onShareProfile && (
              <Button 
                onClick={onShareProfile} 
                variant="outline" 
                size="sm"
                className="w-full text-xs bg-white/90 text-gray-800 border-white/50 hover:bg-white hover:text-gray-900"
              >
                <Heart className="h-3 w-3 mr-1" />
                Share Profile
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};