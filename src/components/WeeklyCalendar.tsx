import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronLeft, 
  ChevronRight, 
  Utensils, 
  Droplets, 
  Calendar,
  Plus,
  Check,
  Scale,
  Zap
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format, addDays, subDays, startOfWeek, isSameDay, isToday } from "date-fns";

interface DailyMetrics {
  date: string;
  energy: number; // 1-10 scale
  food: number; // 1-10 scale
  water: number; // 1-10 scale
  weight: number; // pounds
  urineColor: string; // clear, yellow, dark, etc.
  poopColor: string; // brown, green, black, etc.
  poopConsistency: string; // firm, soft, liquid, etc.
  logged: boolean;
}

interface WeeklyCalendarProps {
  petName: string;
  onMetricsLog: (date: string, metrics: Omit<DailyMetrics, 'date' | 'logged'>) => void;
  appointments?: AppointmentItem[];
  readOnly?: boolean; // New prop for read-only mode
}

interface AppointmentItem {
  date: string; // yyyy-MM-dd
  title: string;
  type?: 'vaccination' | 'checkup' | 'medication' | 'surgery' | 'emergency';
  veterinarian?: string;
  status?: 'completed' | 'upcoming' | 'overdue';
  nextDate?: string;
  notes?: string;
}

export const WeeklyCalendar = ({ petName, onMetricsLog, appointments = [], readOnly = false }: WeeklyCalendarProps) => {
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showLogger, setShowLogger] = useState(false);
  const [showVetPrompt, setShowVetPrompt] = useState(false);
  const [vetPromptDate, setVetPromptDate] = useState<Date | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant'; text: string}>>([]);
  const [chatInput, setChatInput] = useState("");
  // Appointments are provided by parent from Medical Records
  const [showApptDetails, setShowApptDetails] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<AppointmentItem | null>(null);
  const [detailsDate, setDetailsDate] = useState<Date | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const startVetChat = (date: Date | null, initial?: string) => {
    setVetPromptDate(date);
    const intro = `Hi! I can help interpret today's health signals${date ? ` for ${format(date, 'EEE, MMM d')}` : ''}.`;
    const msgs: Array<{role: 'user' | 'assistant'; text: string}> = [{ role: 'assistant', text: intro }];
    if (initial) msgs.push({ role: 'user', text: initial });
    setChatMessages(msgs);
    setShowVetPrompt(true);
  };

  const respondToUser = (question: string) => {
    setChatMessages(prev => [...prev, { role: 'user', text: question }]);
    // Very simple canned response logic
    const lower = question.toLowerCase();
    let reply = "Thanks for the details. Based on energy and available logs, monitor closely today. If symptoms persist, contact your vet.";
    if (lower.includes('issue')) {
      reply = "The low score likely comes from reduced energy and/or abnormal poop/urine. Ensure hydration, rest, and watch for vomiting, diarrhea, or pain.";
    } else if (lower.includes('vet')) {
      reply = "If the pet seems lethargic, refuses food/water, or shows abnormal stool/urine for >24h, it's best to visit a vet. If severe symptoms appear, go immediately.";
    }
    setChatMessages(prev => [...prev, { role: 'assistant', text: reply }]);
  };
  
  // Sample data - in a real app, this would come from props or state management
  const [weeklyData, setWeeklyData] = useState<DailyMetrics[]>([
    {
      date: format(new Date(), 'yyyy-MM-dd'),
      energy: 8,
      food: 8,
      water: 7,
      weight: 65,
      urineColor: 'yellow',
      poopColor: 'brown',
      poopConsistency: 'firm',
      logged: true
    }
  ]);
  
  const [currentMetrics, setCurrentMetrics] = useState({
    energy: 5,
    food: 5,
    water: 5,
    weight: 0,
    urineColor: '',
    poopColor: '',
    poopConsistency: ''
  });

  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Start week on Monday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getDayData = (date: Date): DailyMetrics | null => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return weeklyData.find(data => data.date === dateStr) || null;
  };

  const getColorIndicator = (color: string, type: 'urine' | 'poop') => {
    const colorMap = {
      urine: {
        clear: 'bg-blue-100 border-blue-300',
        yellow: 'bg-yellow-300 border-yellow-500',
        dark: 'bg-amber-600 border-amber-700',
        red: 'bg-red-500 border-red-600'
      },
      poop: {
        brown: 'bg-amber-700 border-amber-800',
        green: 'bg-green-600 border-green-700',
        black: 'bg-gray-800 border-gray-900',
        red: 'bg-red-600 border-red-700',
        yellow: 'bg-yellow-500 border-yellow-600'
      }
    };
    
    return colorMap[type][color as keyof typeof colorMap[typeof type]] || 'bg-gray-300 border-gray-400';
  };

  const handleDateSelect = (date: Date) => {
    if (readOnly) {
      // In read-only mode, show details view instead of logger
      setDetailsDate(date);
      setShowDetails(true);
      return;
    }
    setSelectedDate(date);
    const existingData = getDayData(date);
    if (existingData) {
      setCurrentMetrics({
        energy: existingData.energy,
        food: existingData.food,
        water: existingData.water,
        weight: existingData.weight,
        urineColor: existingData.urineColor,
        poopColor: existingData.poopColor,
        poopConsistency: existingData.poopConsistency
      });
    } else {
      setCurrentMetrics({
        energy: 5,
        food: 5,
        water: 5,
        weight: 0,
        urineColor: 'yellow',
        poopColor: 'brown',
        poopConsistency: 'firm'
      });
    }
    setShowLogger(true);
  };

  const getEnergyEmoji = (energy: number) => {
    if (energy <= 3) return '😴';
    if (energy <= 7) return '🙂';
    return '🐕';
  };

  const computeDailyHealthScore = (data: Partial<DailyMetrics>): number | null => {
    // Weights (sum to 100). Optional metrics are only counted if present.
    const weights: Record<string, number> = {
      energy: 60,
      food: 10,
      water: 10,
      urine: 10,
      poopColor: 5,
      poopConsistency: 5
    };

    let totalWeight = 0;
    let scoreSum = 0;

    if (typeof data.energy === 'number') {
      totalWeight += weights.energy;
      scoreSum += (data.energy / 10) * weights.energy;
    }

    if (typeof data.food === 'number') {
      totalWeight += weights.food;
      scoreSum += (data.food / 10) * weights.food;
    }

    if (typeof data.water === 'number') {
      totalWeight += weights.water;
      scoreSum += (data.water / 10) * weights.water;
    }

    if (typeof data.urineColor === 'string' && data.urineColor) {
      totalWeight += weights.urine;
      const urineGood = data.urineColor === 'clear' || data.urineColor === 'yellow';
      scoreSum += (urineGood ? 1 : 0.2) * weights.urine;
    }

    if (typeof data.poopColor === 'string' && data.poopColor) {
      totalWeight += weights.poopColor;
      const poopColorGood = data.poopColor === 'brown';
      scoreSum += (poopColorGood ? 1 : 0.2) * weights.poopColor;
    }

    if (typeof data.poopConsistency === 'string' && data.poopConsistency) {
      totalWeight += weights.poopConsistency;
      const poopConsistencyGood = data.poopConsistency === 'firm';
      scoreSum += (poopConsistencyGood ? 1 : 0.3) * weights.poopConsistency;
    }

    if (totalWeight === 0) return null; // Not enough data to compute
    return Math.round((scoreSum / totalWeight) * 100);
  };

  const getHealthColorByScore = (score: number | null) => {
    if (score === null) return 'text-gray-400';
    if (score < 40) return 'text-red-600';
    if (score < 70) return 'text-yellow-500';
    return 'text-green-600';
  };

  const handleSaveMetrics = () => {
    if (readOnly) return;
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const newData: DailyMetrics = {
      date: dateStr,
      ...currentMetrics,
      logged: true
    };
    
    setWeeklyData(prev => {
      const filtered = prev.filter(item => item.date !== dateStr);
      return [...filtered, newData];
    });
    
    onMetricsLog(dateStr, currentMetrics);
    setShowLogger(false);
    setSelectedDate(null);
    
    toast({
      title: "Health data logged!",
      description: `Recorded data for ${format(selectedDate, 'MMM d, yyyy')}`,
    });
  };

  const weekDays = getWeekDays(currentWeek);

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{petName}'s Health Calendar</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentWeek(subDays(currentWeek, 7))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Week View */}
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const date = weekDays[index];
            const dayData = getDayData(date);
            const isSelectedDate = selectedDate && isSameDay(date, selectedDate);
            const isTodayDate = isToday(date);
            const dateStr = format(date, 'yyyy-MM-dd');
            const appointment = appointments.find(a => a.date === dateStr) || null;
            
            return (
              <div key={index} className="text-center">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  {day}
                </div>
                <div
                  className={`
                    relative p-3 rounded-lg border-2 transition-all duration-200 min-h-[100px]
                    ${appointment ? 'border-violet-400 bg-violet-50' : (isTodayDate ? 'border-primary bg-primary/5' : 'border-border bg-background')}
                    ${isSelectedDate ? 'ring-2 ring-primary ring-offset-2' : ''}
                    ${dayData?.logged && !appointment ? 'bg-green-50 border-green-200' : ''}
                    ${!readOnly ? 'cursor-pointer hover:border-primary/40 hover:shadow-soft' : ''}
                  `}
                  onClick={() => handleDateSelect(date)}
                >
                  <div className="text-sm font-medium mb-2">
                    {format(date, 'd')}
                  </div>

                  {/* Appointment pill */}
                  {appointment && (
                    <div
                      className="absolute top-2 left-2 rounded-full bg-violet-600 text-white text-[10px] px-2 py-0.5 max-w-[80%] truncate"
                      onClick={!readOnly ? (e) => { e.stopPropagation(); setSelectedAppt(appointment); setShowApptDetails(true); } : undefined}
                      title={`${appointment.title}${appointment.type ? ` • ${appointment.type}` : ''}${!readOnly ? ' - Click for details' : ''}`}
                    >
                      {appointment.title}
                    </div>
                  )}
                  
                  {dayData?.logged ? (
                    <div className="h-full">
                      {/* Center indicator: warning is clickable to open vet prompt */}
                      {(() => {
                        const score = computeDailyHealthScore(dayData);
                        const isRed = score !== null && score < 40;
                        if (isRed) {
                          return (
                            <div
                              className="absolute inset-0 flex items-center justify-center"
                              title={score !== null ? `Health ${score}%${!readOnly ? ' - Click to chat with a vet' : ''}` : 'Health n/a'}
                              onClick={!readOnly ? (e) => {
                                e.stopPropagation();
                                startVetChat(date);
                              } : undefined}
                            >
                              <span className="text-2xl">⚠️</span>
                            </div>
                          );
                        }
                        return (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" title={score !== null ? `Health ${score}%` : 'Health n/a'}>
                            <Check className={`w-8 h-8 ${getHealthColorByScore(score)}`} />
                          </div>
                        );
                      })()}

                      {/* Bottom row: energy avatar + weight */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[11px] leading-none text-muted-foreground">
                        <Avatar className="h-6 w-6 border border-border shadow-sm shrink-0">
                          <AvatarFallback className="text-[10px]">{getEnergyEmoji(dayData.energy)}</AvatarFallback>
                        </Avatar>
                        {typeof dayData.weight === 'number' && dayData.weight > 0 && (
                          <span className="whitespace-nowrap">Wt: {dayData.weight} lb</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {!readOnly && <Plus className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Metrics Logger Modal */}
      {showLogger && selectedDate && (
        <Card className="p-6 bg-gradient-card shadow-card border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              Log Health Data - {format(selectedDate, 'EEEE, MMM d, yyyy')}
            </h3>
            <Button 
              variant="ghost" 
              onClick={() => setShowLogger(false)}
              className="p-2"
            >
              ×
            </Button>
          </div>
          {/* Appointment info for selected day */}
          {(() => {
            const appt = appointments.find(a => a.date === format(selectedDate, 'yyyy-MM-dd'));
            if (!appt) return null;
            return (
              <Card className="p-4 mb-6 bg-violet-50 border-violet-200">
                <div className="flex items-start gap-3">
                  <div className="px-2 py-0.5 rounded-full bg-violet-600 text-white text-[10px] mt-0.5">Appointment</div>
                  <div>
                    <div className="text-sm font-medium text-violet-900">{appt.title}</div>
                    <div className="text-xs text-violet-700">Scheduled for {format(selectedDate, 'EEE, MMM d')}</div>
                  </div>
                </div>
              </Card>
            );
          })()}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Energy, Food, Water & Weight */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <Label>Energy</Label>
                  <Badge variant="secondary">{currentMetrics.energy}/10</Badge>
                </div>
                <Slider
                  value={[currentMetrics.energy]}
                  onValueChange={(value) => setCurrentMetrics(prev => ({ ...prev, energy: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Utensils className="h-4 w-4 text-orange-500" />
                  <Label>Food Intake</Label>
                  <Badge variant="secondary">{currentMetrics.food}/10</Badge>
                </div>
                <Slider
                  value={[currentMetrics.food]}
                  onValueChange={(value) => setCurrentMetrics(prev => ({ ...prev, food: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <Label>Water Intake</Label>
                  <Badge variant="secondary">{currentMetrics.water}/10</Badge>
                </div>
                <Slider
                  value={[currentMetrics.water]}
                  onValueChange={(value) => setCurrentMetrics(prev => ({ ...prev, water: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Scale className="h-4 w-4 text-emerald-600" />
                  <Label>Weight (lb)</Label>
                  <Badge variant="secondary">{currentMetrics.weight} lb</Badge>
                </div>
                <Slider
                  value={[currentMetrics.weight]}
                  onValueChange={(value) => setCurrentMetrics(prev => ({ ...prev, weight: value[0] }))}
                  max={200}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Colors & Consistency */}
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Urine Color</Label>
                <Select 
                  value={currentMetrics.urineColor} 
                  onValueChange={(value) => setCurrentMetrics(prev => ({ ...prev, urineColor: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clear">Clear</SelectItem>
                    <SelectItem value="yellow">Light Yellow</SelectItem>
                    <SelectItem value="dark">Dark Yellow</SelectItem>
                    <SelectItem value="red">Red/Pink</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="mb-2 block">Poop Color</Label>
                <Select 
                  value={currentMetrics.poopColor} 
                  onValueChange={(value) => setCurrentMetrics(prev => ({ ...prev, poopColor: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="mb-2 block">Poop Consistency</Label>
                <Select 
                  value={currentMetrics.poopConsistency} 
                  onValueChange={(value) => setCurrentMetrics(prev => ({ ...prev, poopConsistency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select consistency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="firm">Firm</SelectItem>
                    <SelectItem value="soft">Soft</SelectItem>
                    <SelectItem value="loose">Loose</SelectItem>
                    <SelectItem value="liquid">Liquid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <Button 
              onClick={handleSaveMetrics} 
              variant="gradient" 
              className="flex-1"
              
            >
              Save Data
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowLogger(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}
      
      {/* Legend */}
      <Card className="p-4 bg-gradient-card shadow-card">
        <h4 className="text-sm font-semibold mb-3">Legend</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-medium mb-2">Indicators:</p>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center text-[10px]">🙂</div>
                <span>Energy avatar: 😴 low · 🙂 medium · 🐕 high</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-2 bg-emerald-500 rounded"></div>
                <span>Wt = Weight (lb)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Centered checkmark color: red/amber/green by daily health</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-2 py-0.5 rounded-full bg-violet-600 text-white text-[10px]">Appointment</div>
                <span>Purple tag indicates an upcoming appointment</span>
              </div>
            </div>
          </div>
          <div>
            <p className="font-medium mb-2">Color Dots:</p>
            <div className="space-y-1">
              <span>Left dot = Urine color</span>
              <span>Right dot = Poop color</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Vet Prompt Dialog */}
      <Dialog open={showVetPrompt} onOpenChange={setShowVetPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect with a vet</DialogTitle>
            <DialogDescription>
              We noticed potential issues in the health data{vetPromptDate ? ` for ${format(vetPromptDate, 'EEE, MMM d')}` : ''}. Would you like to chat with a vet now to understand the issue?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {/* Quick prompts */}
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => respondToUser('What is the issue?')}>What is the issue?</Button>
              <Button variant="secondary" size="sm" onClick={() => respondToUser('Should I take the pet to the vet?')}>Should I take the pet to the vet?</Button>
            </div>
            {/* Chat window */}
            <div className="h-40 overflow-auto rounded-md border border-border p-3 bg-background/50">
              {chatMessages.map((m, i) => (
                <div key={i} className={`mb-2 text-sm ${m.role === 'user' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  <span className="font-medium mr-1">{m.role === 'user' ? 'You:' : 'Assistant:'}</span>
                  <span>{m.text}</span>
                </div>
              ))}
            </div>
            {/* Composer */}
            <div className="grid grid-cols-1 gap-2">
              <Textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type your question..." className="min-h-[60px]" />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowVetPrompt(false)}>Close</Button>
                <Button variant="gradient" onClick={() => { if (chatInput.trim()) { respondToUser(chatInput.trim()); setChatInput(''); } }}>Send</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Appointment Details Dialog */}
      <Dialog open={showApptDetails} onOpenChange={setShowApptDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              {selectedAppt?.date ? `Scheduled for ${format(new Date(selectedAppt.date), 'EEE, MMM d')}` : ''}
            </DialogDescription>
          </DialogHeader>
          {selectedAppt && (
            <div className="space-y-2 text-sm">
              <div className="font-medium">{selectedAppt.title}</div>
              {selectedAppt.type && <div>Type: <span className="capitalize">{selectedAppt.type}</span></div>}
              {selectedAppt.veterinarian && <div>Vet: {selectedAppt.veterinarian}</div>}
              {selectedAppt.status && <div>Status: <span className="capitalize">{selectedAppt.status}</span></div>}
              {selectedAppt.nextDate && <div>Next due: {format(new Date(selectedAppt.nextDate), 'EEE, MMM d')}</div>}
              {selectedAppt.notes && <div className="text-muted-foreground">{selectedAppt.notes}</div>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApptDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Health Details Dialog - Read Only */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Health Details - {detailsDate ? format(detailsDate, 'EEEE, MMM d, yyyy') : ''}</DialogTitle>
            <DialogDescription>
              Viewing health data for this day
            </DialogDescription>
          </DialogHeader>
          {detailsDate && (() => {
            const dayData = getDayData(detailsDate);
            const dateStr = format(detailsDate, 'yyyy-MM-dd');
            const appointment = appointments.find(a => a.date === dateStr);
            
            if (!dayData?.logged) {
              return (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg font-medium">No health data logged</p>
                  <p className="text-sm">This day doesn't have any recorded health information.</p>
                </div>
              );
            }

            const healthScore = computeDailyHealthScore(dayData);
            const healthColor = getHealthColorByScore(healthScore);
            const healthStatus = healthScore !== null ? 
              (healthScore < 40 ? 'Poor' : healthScore < 70 ? 'Fair' : 'Good') : 'Unknown';

            return (
              <div className="space-y-6">
                {/* Health Score Summary */}
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold mb-2">Health Score</div>
                  <div className={`text-4xl font-bold ${healthColor} mb-2`}>
                    {healthScore !== null ? `${healthScore}%` : 'N/A'}
                  </div>
                  <Badge variant={healthScore !== null && healthScore < 40 ? "destructive" : "secondary"}>
                    {healthStatus}
                  </Badge>
                </div>

                {/* Appointment Info */}
                {appointment && (
                  <Card className="p-4 bg-violet-50 border-violet-200">
                    <div className="flex items-start gap-3">
                      <div className="px-2 py-0.5 rounded-full bg-violet-600 text-white text-[10px] mt-0.5">Appointment</div>
                      <div>
                        <div className="font-medium text-violet-900">{appointment.title}</div>
                        <div className="text-xs text-violet-700">Scheduled for {format(detailsDate, 'EEE, MMM d')}</div>
                        {appointment.veterinarian && (
                          <div className="text-xs text-violet-600">Vet: {appointment.veterinarian}</div>
                        )}
                      </div>
                    </div>
                  </Card>
                )}

                {/* Health Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Main Metrics */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <Label className="text-sm font-medium">Energy Level</Label>
                        <Badge variant="secondary">{dayData.energy}/10</Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(dayData.energy / 10) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Utensils className="h-4 w-4 text-orange-500" />
                        <Label className="text-sm font-medium">Food Intake</Label>
                        <Badge variant="secondary">{dayData.food}/10</Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(dayData.food / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <Label className="text-sm font-medium">Water Intake</Label>
                        <Badge variant="secondary">{dayData.water}/10</Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(dayData.water / 10) * 100}%` }}
                      />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Scale className="h-4 w-4 text-emerald-600" />
                        <Label className="text-sm font-medium">Weight</Label>
                        <Badge variant="secondary">{dayData.weight} lb</Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Additional Info */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Urine Color</Label>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${
                          dayData.urineColor === 'clear' ? 'bg-blue-200' :
                          dayData.urineColor === 'yellow' ? 'bg-yellow-200' :
                          dayData.urineColor === 'dark' ? 'bg-orange-200' :
                          dayData.urineColor === 'red' ? 'bg-red-200' : 'bg-gray-200'
                        }`} />
                        <span className="capitalize">{dayData.urineColor || 'Not recorded'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Poop Color</Label>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${
                          dayData.poopColor === 'brown' ? 'bg-amber-700' :
                          dayData.poopColor === 'green' ? 'bg-green-600' :
                          dayData.poopColor === 'black' ? 'bg-gray-800' : 'bg-gray-200'
                        }`} />
                        <span className="capitalize">{dayData.poopColor || 'Not recorded'}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Poop Consistency</Label>
                      <span className="capitalize">{dayData.poopConsistency || 'Not recorded'}</span>
                    </div>

                    {/* Energy Avatar */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Energy Avatar</Label>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8 border border-border shadow-sm">
                          <AvatarFallback className="text-sm">{getEnergyEmoji(dayData.energy)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {dayData.energy <= 3 ? 'Low Energy' : 
                           dayData.energy <= 6 ? 'Moderate Energy' : 'High Energy'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};