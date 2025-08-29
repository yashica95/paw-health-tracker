import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, X, Plus } from "lucide-react";

interface PhotoGalleryProps {
  photos: string[];
  onAddPhoto: (photoUrl: string) => void;
  onRemovePhoto: (photoIndex: number) => void;
  petName: string;
}

export const PhotoGallery = ({ photos, onAddPhoto, onRemovePhoto, petName }: PhotoGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        onAddPhoto(photoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">Photo Gallery</h3>
        <label className="cursor-pointer">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Photo
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No photos yet</p>
          <p className="text-sm text-muted-foreground">Add photos to track {petName}'s growth and memories</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <Avatar className="w-24 h-24 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                <AvatarImage src={photo} alt={`${petName} photo ${index + 1}`} />
                <AvatarFallback className="bg-gradient-primary text-white text-lg font-bold">
                  {petName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => onRemovePhoto(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
