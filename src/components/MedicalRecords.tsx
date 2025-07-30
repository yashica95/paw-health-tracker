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
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon, Plus, Stethoscope, Syringe, Heart, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

export const MedicalRecords = ({ petName, records, onAddRecord }: MedicalRecordsProps) => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'vaccination' as const,
    title: '',
    date: new Date(),
    nextDate: undefined as Date | undefined,
    veterinarian: '',
    notes: '',
    status: 'completed' as const
  });

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
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors"
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
                  className="flex items-start justify-between p-4 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors"
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
    </div>
  );
};