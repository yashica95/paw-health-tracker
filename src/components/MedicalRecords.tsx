import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon, Plus, Stethoscope, Syringe, Heart, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Vaccination Schedule Component
const VaccinationSchedule = ({ 
  petAge, 
  species, 
  onAddRecord 
}: { 
  petAge?: number, 
  species?: string,
  onAddRecord: (record: Omit<MedicalRecord, 'id'>) => void
}) => {
  const isDog = species?.toLowerCase() === 'dog';
  const isCat = species?.toLowerCase() === 'cat';
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<{name: string, level: number} | null>(null);
  const [completionDate, setCompletionDate] = useState<Date>(new Date());
  
  if (!isDog && !isCat || !petAge) return null;

  const getVaccinationLevels = () => {
    if (isDog) {
      return [
        {
          level: 1,
          name: 'Puppy Core Series',
          description: 'DHPP 1st Dose (6-8 weeks)',
          details: 'Distemper, Hepatitis/Adenovirus, Parvovirus, Parainfluenza',
          ageRequirement: 6,
          completed: petAge >= 0.5 // 6 months old
        },
        {
          level: 2,
          name: 'Puppy Completion',
          description: 'DHPP 2nd + 3rd + Rabies (10-16 weeks)',
          details: 'Complete puppy series + Rabies (required by law)',
          ageRequirement: 16,
          completed: petAge >= 1 // 1 year old
        },
        {
          level: 3,
          name: 'Adult Maintenance',
          description: 'Annual Boosters (1+ years)',
          details: 'DHPP + Rabies boosters every 1-3 years',
          ageRequirement: 52,
          completed: petAge >= 2 // 2+ years old
        }
      ];
    } else if (isCat) {
      return [
        {
          level: 1,
          name: 'Kitten Core Series',
          description: 'FVRCP 1st Dose (6-8 weeks)',
          details: 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia',
          ageRequirement: 6,
          completed: petAge >= 0.5 // 6 months old
        },
        {
          level: 2,
          name: 'Kitten Completion',
          description: 'FVRCP 2nd + 3rd + FeLV + Rabies (10-16 weeks)',
          details: 'Complete kitten series + FeLV + Rabies (mandatory)',
          ageRequirement: 16,
          completed: petAge >= 1 // 1 year old
        },
        {
          level: 3,
          name: 'Adult Maintenance',
          description: 'Annual Boosters (1+ years)',
          details: 'FVRCP + Rabies boosters every 1-3 years',
          ageRequirement: 52,
          completed: petAge >= 2 // 2+ years old
        }
      ];
    }
    return [];
  };

  const handleMarkCompleted = (vaccineName: string, level: number) => {
    setSelectedVaccine({ name: vaccineName, level });
    setCompletionDate(new Date());
    setShowDatePicker(true);
  };

  const confirmCompletion = () => {
    if (!selectedVaccine) return;
    
    onAddRecord({
      type: 'vaccination' as const,
      title: `${selectedVaccine.name} - Level ${selectedVaccine.level}`,
      date: completionDate,
      nextDate: new Date(completionDate.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year later
      veterinarian: 'Marked as completed',
      notes: `Completed Level ${selectedVaccine.level} vaccination on ${format(completionDate, 'MMM d, yyyy')}`,
      status: 'completed'
    });
    
    setShowDatePicker(false);
    setSelectedVaccine(null);
  };

  const levels = getVaccinationLevels();

  if (isDog) {
    return (
      <div className="space-y-6">
        <h4 className="text-lg font-medium mb-3 text-purple-600 flex items-center">
          🐶 Dog Vaccination Schedule
        </h4>
        
        {/* Level-based Vaccination System */}
        <div className="space-y-4">
          {levels.map((level) => (
            <div key={level.level} className="relative">
              {/* Level Badge */}
              <div className="absolute -left-2 top-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                {level.level}
              </div>
              
              {/* Level Content */}
              <div className={`ml-6 p-4 rounded-lg border-l-4 ${
                level.completed 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-semibold text-lg">{level.name}</h5>
                      {level.completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓ Completed
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-700 mb-1">{level.description}</div>
                    <div className="text-xs text-gray-600">{level.details}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Age requirement: {level.ageRequirement <= 52 ? `${level.ageRequirement} weeks` : `${level.ageRequirement/52} years`}
                    </div>
                  </div>
                  
                  {!level.completed && (
                    <Button 
                      size="sm" 
                      variant="gradient"
                      onClick={() => handleMarkCompleted(level.name, level.level)}
                    >
                      Mark Level {level.level} Complete
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Progress Line */}
              {level.level < levels.length && (
                <div className="absolute left-3 top-8 w-0.5 h-4 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>

        {/* Date Picker Dialog */}
        <Dialog open={showDatePicker} onOpenChange={setShowDatePicker}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Level {selectedVaccine?.level} Complete</DialogTitle>
              <DialogDescription>
                Select the date when {selectedVaccine?.name} was completed
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Completion Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(completionDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar 
                      mode="single" 
                      selected={completionDate} 
                      onSelect={(d) => setCompletionDate(d || new Date())} 
                      initialFocus 
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDatePicker(false)}>Cancel</Button>
              <Button variant="gradient" onClick={confirmCompletion}>Mark Level Complete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (isCat) {
    return (
      <div className="space-y-6">
        <h4 className="text-lg font-medium mb-3 text-purple-600 flex items-center">
          🐱 Cat Vaccination Schedule
        </h4>
        
        {/* Level-based Vaccination System */}
        <div className="space-y-4">
          {levels.map((level) => (
            <div key={level.level} className="relative">
              {/* Level Badge */}
              <div className="absolute -left-2 top-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                {level.level}
              </div>
              
              {/* Level Content */}
              <div className={`ml-6 p-4 rounded-lg border-l-4 ${
                level.completed 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-semibold text-lg">{level.name}</h5>
                      {level.completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓ Completed
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-700 mb-1">{level.description}</div>
                    <div className="text-xs text-gray-600">{level.details}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Age requirement: {level.ageRequirement <= 52 ? `${level.ageRequirement} weeks` : `${level.ageRequirement/52} years`}
                    </div>
                  </div>
                  
                  {!level.completed && (
                    <Button 
                      size="sm" 
                      variant="gradient"
                      onClick={() => handleMarkCompleted(level.name, level.level)}
                    >
                      Mark Level {level.level} Complete
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Progress Line */}
              {level.level < levels.length && (
                <div className="absolute left-3 top-8 w-0.5 h-4 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>

        {/* Date Picker Dialog */}
        <Dialog open={showDatePicker} onOpenChange={setShowDatePicker}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Level {selectedVaccine?.level} Complete</DialogTitle>
              <DialogDescription>
                Select the date when {selectedVaccine?.name} was completed
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Completion Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(completionDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar 
                      mode="single" 
                      selected={completionDate} 
                      onSelect={(d) => setCompletionDate(d || new Date())} 
                      initialFocus 
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDatePicker(false)}>Cancel</Button>
              <Button variant="gradient" onClick={confirmCompletion}>Mark Level Complete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
};

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

interface MedicalRecordsProps {
  petName: string;
  records: MedicalRecord[];
  onAddRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  onUpdateRecord?: (id: string, update: Partial<MedicalRecord>) => void;
  petAge?: number;
  petSpecies?: string;
}

export const MedicalRecords = ({ petName, records, onAddRecord, onUpdateRecord, petAge, petSpecies }: MedicalRecordsProps) => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<MedicalRecord | null>(null);
  const [newRecord, setNewRecord] = useState({
    type: 'vaccination' as const,
    title: '',
    date: new Date(),
    nextDate: undefined as Date | undefined,
    veterinarian: '',
    notes: '',
    status: 'completed' as const
  });

  const openDetails = (record: MedicalRecord) => {
    setSelected(record);
    setIsEditing(false);
    setShowDetails(true);
  };

  const [editRecord, setEditRecord] = useState<MedicalRecord | null>(null);
  const beginEdit = () => {
    if (!selected) return;
    setEditRecord({ ...selected });
    // Use inline form UX similar to "Add Record"
    setShowDetails(false);
    setShowEditForm(true);
  };
  const saveEdit = () => {
    if (!editRecord || !onUpdateRecord) return setIsEditing(false);
    onUpdateRecord(editRecord.id, {
      type: editRecord.type,
      title: editRecord.title,
      date: editRecord.date,
      nextDate: editRecord.nextDate,
      veterinarian: editRecord.veterinarian,
      notes: editRecord.notes,
      status: editRecord.status,
    });
    setShowDetails(false);
    setShowEditForm(false);
    toast({ title: "Record updated" });
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'vaccination':
        return <Syringe className="h-4 w-4" />;
      case 'checkup':
        return <Stethoscope className="h-4 w-4" />;
      case 'medication':
        return <Heart className="h-4 w-4" />;
      case 'surgery':
        return <AlertTriangle className="h-4 w-4" />;
      case 'emergency':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-blue-500';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vaccination':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'checkup':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medication':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'surgery':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'emergency':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleAddRecord = () => {
    if (!newRecord.title || !newRecord.veterinarian) {
      toast({
        title: "Missing information",
        description: "Please fill in the title and veterinarian fields.",
        variant: "destructive"
      });
      return;
    }

    onAddRecord(newRecord);
    setShowAddForm(false);
    setNewRecord({
      type: 'vaccination',
      title: '',
      date: new Date(),
      nextDate: undefined,
      veterinarian: '',
      notes: '',
      status: 'completed'
    });

    toast({
      title: "Medical record added!",
      description: `Added ${newRecord.type} record for ${petName}`,
    });
  };

  const upcomingRecords = records.filter(record => record.status === 'upcoming' || record.status === 'overdue');
  const pastRecords = records.filter(record => record.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{petName}'s Medical Records</h2>
        <Button variant="gradient" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      {/* Upcoming/Overdue Records */}
      {upcomingRecords.length > 0 && (
        <Card className="p-6 bg-gradient-card shadow-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Upcoming & Overdue
          </h3>
          <div className="space-y-3">
            {upcomingRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => openDetails(record)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(record.type)}`}>
                    {getRecordIcon(record.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{record.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {record.nextDate ? format(record.nextDate, 'MMM d, yyyy') : 'No date set'}
                    </p>
                    <p className="text-xs text-muted-foreground">{record.veterinarian}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(record.status)} text-white`}>
                  {record.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Vaccination Schedule */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Heart className="h-5 w-5 mr-2 text-purple-500" />
          Vaccination Schedule
        </h3>
        <VaccinationSchedule 
          petAge={petAge}
          species={petSpecies}
          onAddRecord={onAddRecord}
        />
      </Card>

      {/* Add Record Form */}
      {showAddForm && (
        <Card className="p-6 bg-gradient-card shadow-card border-primary/20">
          <h3 className="text-lg font-semibold mb-6">Add Medical Record</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label className="mb-2 block">Record Type</Label>
              <Select 
                value={newRecord.type} 
                onValueChange={(value: any) => setNewRecord(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="checkup">Checkup</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="surgery">Surgery</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Status</Label>
              <Select 
                value={newRecord.status} 
                onValueChange={(value: any) => setNewRecord(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Title *</Label>
              <Input 
                placeholder="e.g., Annual Rabies Vaccination"
                value={newRecord.title}
                onChange={(e) => setNewRecord(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label className="mb-2 block">Veterinarian *</Label>
              <Input 
                placeholder="Dr. Smith"
                value={newRecord.veterinarian}
                onChange={(e) => setNewRecord(prev => ({ ...prev, veterinarian: e.target.value }))}
              />
            </div>

            <div>
              <Label className="mb-2 block">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newRecord.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newRecord.date ? format(newRecord.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newRecord.date}
                    onSelect={(date) => setNewRecord(prev => ({ ...prev, date: date || new Date() }))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="mb-2 block">Next Due Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newRecord.nextDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newRecord.nextDate ? format(newRecord.nextDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newRecord.nextDate}
                    onSelect={(date) => setNewRecord(prev => ({ ...prev, nextDate: date }))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mb-6">
            <Label className="mb-2 block">Notes</Label>
            <Textarea 
              placeholder="Additional details about this medical record..."
              value={newRecord.notes}
              onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleAddRecord} variant="gradient" className="flex-1">
              Add Record
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Edit Record Form (same UX as Add) */}
      {showEditForm && editRecord && (
        <Card className="p-6 bg-gradient-card shadow-card border-primary/20">
          <h3 className="text-lg font-semibold mb-6">Edit Medical Record</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label className="mb-2 block">Record Type</Label>
              <Select 
                value={editRecord.type} 
                onValueChange={(value: any) => setEditRecord(prev => prev ? { ...prev, type: value } as MedicalRecord : prev)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="checkup">Checkup</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="surgery">Surgery</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Status</Label>
              <Select 
                value={editRecord.status} 
                onValueChange={(value: any) => setEditRecord(prev => prev ? { ...prev, status: value } as MedicalRecord : prev)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Title *</Label>
              <Input 
                value={editRecord.title}
                onChange={(e) => setEditRecord(prev => prev ? { ...prev, title: e.target.value } as MedicalRecord : prev)}
              />
            </div>

            <div>
              <Label className="mb-2 block">Veterinarian *</Label>
              <Input 
                value={editRecord.veterinarian}
                onChange={(e) => setEditRecord(prev => prev ? { ...prev, veterinarian: e.target.value } as MedicalRecord : prev)}
              />
            </div>

            <div>
              <Label className="mb-2 block">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editRecord.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editRecord.date ? format(editRecord.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editRecord.date}
                    onSelect={(date) => setEditRecord(prev => prev ? { ...prev, date: date || new Date() } as MedicalRecord : prev)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="mb-2 block">Next Due Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editRecord.nextDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editRecord.nextDate ? format(editRecord.nextDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editRecord.nextDate}
                    onSelect={(date) => setEditRecord(prev => prev ? { ...prev, nextDate: date } as MedicalRecord : prev)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mb-6">
            <Label className="mb-2 block">Notes</Label>
            <Textarea 
              value={editRecord.notes}
              onChange={(e) => setEditRecord(prev => prev ? { ...prev, notes: e.target.value } as MedicalRecord : prev)}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex space-x-4">
            <Button onClick={saveEdit} variant="gradient" className="flex-1">
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setShowEditForm(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Past Records */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h3 className="text-lg font-semibold mb-4">Medical History</h3>
        {pastRecords.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No medical records yet. Add your first record above.
          </p>
        ) : (
          <div className="space-y-3">
            {pastRecords
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((record) => (
                <div
                  key={record.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => openDetails(record)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(record.type)}`}>
                      {getRecordIcon(record.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{record.title}</h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        {format(record.date, 'MMM d, yyyy')} • {record.veterinarian}
                      </p>
                      {record.notes && (
                        <p className="text-sm text-muted-foreground">{record.notes}</p>
                      )}
                      {record.nextDate && (
                        <p className="text-xs text-blue-600 mt-1">
                          Next: {format(record.nextDate, 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {record.type}
                  </Badge>
                </div>
              ))}
          </div>
        )}
      </Card>
      {/* Details/Edit Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Medical Record</DialogTitle>
            <DialogDescription>
              {selected ? `${selected.title} • ${selected.type}` : ''}
            </DialogDescription>
          </DialogHeader>
          {!isEditing && selected && (
            <div className="space-y-2 text-sm">
              <div>Date: {format(selected.date, 'PPP')}</div>
              {selected.nextDate && <div>Next Due: {format(selected.nextDate, 'PPP')}</div>}
              <div>Status: <span className="capitalize">{selected.status}</span></div>
              <div>Vet: {selected.veterinarian}</div>
              {selected.notes && <div className="text-muted-foreground">{selected.notes}</div>}
            </div>
          )}
          {isEditing && editRecord && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Record Type</Label>
                <Select value={editRecord.type} onValueChange={(value: any) => setEditRecord(prev => prev ? { ...prev, type: value } as MedicalRecord : prev)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="checkup">Checkup</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block">Status</Label>
                <Select value={editRecord.status} onValueChange={(value: any) => setEditRecord(prev => prev ? { ...prev, status: value } as MedicalRecord : prev)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label className="mb-2 block">Title</Label>
                <Input value={editRecord.title} onChange={(e) => setEditRecord(prev => prev ? { ...prev, title: e.target.value } as MedicalRecord : prev)} />
              </div>
              <div>
                <Label className="mb-2 block">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !editRecord.date && "text-muted-foreground")}> 
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(editRecord.date, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={editRecord.date} onSelect={(d) => setEditRecord(prev => prev ? { ...prev, date: d || new Date() } as MedicalRecord : prev)} initialFocus className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="mb-2 block">Next Due</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !editRecord.nextDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editRecord.nextDate ? format(editRecord.nextDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={editRecord.nextDate} onSelect={(d) => setEditRecord(prev => prev ? { ...prev, nextDate: d || undefined } as MedicalRecord : prev)} initialFocus className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="md:col-span-2">
                <Label className="mb-2 block">Veterinarian</Label>
                <Input value={editRecord.veterinarian} onChange={(e) => setEditRecord(prev => prev ? { ...prev, veterinarian: e.target.value } as MedicalRecord : prev)} />
              </div>
              <div className="md:col-span-2">
                <Label className="mb-2 block">Notes</Label>
                <Textarea value={editRecord.notes} onChange={(e) => setEditRecord(prev => prev ? { ...prev, notes: e.target.value } as MedicalRecord : prev)} className="min-h-[80px]" />
              </div>
            </div>
          )}
          <DialogFooter>
            {!isEditing ? (
              <>
                <Button variant="outline" onClick={() => setShowDetails(false)}>Close</Button>
                {onUpdateRecord && <Button variant="gradient" onClick={beginEdit}>Edit</Button>}
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button variant="gradient" onClick={saveEdit}>Save</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};