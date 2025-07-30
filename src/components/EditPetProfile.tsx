import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon, Camera, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const petFormSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  breed: z.string().min(1, "Breed is required"),
  species: z.string().min(1, "Species is required"),
  gender: z.string().min(1, "Gender is required"),
  birthDate: z.date({
    message: "Birth date is required",
  }),
  weight: z.number().min(0.1, "Weight must be greater than 0"),
  microchipId: z.string().optional(),
  vetName: z.string().optional(),
  vetPhone: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  notes: z.string().optional(),
});

type PetFormValues = z.infer<typeof petFormSchema>;

interface EditPetProfileProps {
  onBack: () => void;
  onSave: (data: PetFormValues) => void;
  initialData?: Partial<PetFormValues>;
}

export const EditPetProfile = ({ onBack, onSave, initialData }: EditPetProfileProps) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      breed: initialData?.breed || "",
      species: initialData?.species || "dog",
      gender: initialData?.gender || "",
      birthDate: initialData?.birthDate || new Date(),
      weight: initialData?.weight || 0,
      microchipId: initialData?.microchipId || "",
      vetName: initialData?.vetName || "",
      vetPhone: initialData?.vetPhone || "",
      allergies: initialData?.allergies || "",
      medications: initialData?.medications || "",
      notes: initialData?.notes || "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: PetFormValues) => {
    onSave(data);
    toast({
      title: "Profile updated!",
      description: "Your pet's profile has been saved successfully.",
    });
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Pet Profile</h1>
            <p className="text-muted-foreground">Update your pet's information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo Section */}
          <Card className="p-6 bg-gradient-card shadow-card h-fit">
            <div className="text-center">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <Avatar className="w-32 h-32 ring-4 ring-primary/20">
                  <AvatarImage src={selectedImage || ""} alt="Pet photo" />
                  <AvatarFallback className="bg-gradient-primary text-white text-3xl font-bold">
                    {form.watch("name")?.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-muted-foreground">
                Click the camera icon to update photo
              </p>
            </div>
          </Card>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-gradient-card shadow-card">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-primary">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pet Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter pet name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="species"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Species</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select species" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="dog">Dog</SelectItem>
                                <SelectItem value="cat">Cat</SelectItem>
                                <SelectItem value="bird">Bird</SelectItem>
                                <SelectItem value="rabbit">Rabbit</SelectItem>
                                <SelectItem value="hamster">Hamster</SelectItem>
                                <SelectItem value="fish">Fish</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="breed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Breed</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter breed" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="neutered">Neutered Male</SelectItem>
                                <SelectItem value="spayed">Spayed Female</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Birth Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      <div>
                                        {format(field.value, "PPP")}
                                        <span className="ml-2 text-xs text-muted-foreground">
                                          ({calculateAge(field.value)} years old)
                                        </span>
                                      </div>
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                  className={cn("p-3 pointer-events-auto")}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (lbs)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.1"
                                placeholder="Enter weight"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-primary">Medical Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="microchipId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Microchip ID (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter microchip ID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="vetName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Veterinarian Name (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Dr. Smith" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="vetPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vet Phone (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="(555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="allergies"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Allergies (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List any known allergies..."
                                className="min-h-[60px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="medications"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Current Medications (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List current medications and dosages..."
                                className="min-h-[60px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Additional Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any additional information about your pet..."
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6">
                    <Button type="submit" variant="gradient" className="flex-1">
                      Save Profile
                    </Button>
                    <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};