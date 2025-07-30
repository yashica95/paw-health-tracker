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
  Check
} from "lucide-react";
import { format, addDays, subDays, startOfWeek, isSameDay, isToday } from "date-fns";

interface DailyMetrics {
  date: string;
  food: number; // 1-10 scale
  water: number; // 1-10 scale
  urineColor: string; // clear, yellow, dark, etc.
  poopColor: string; // brown, green, black, etc.
  poopConsistency: string; // firm, soft, liquid, etc.
  logged: boolean;
}

interface WeeklyCalendarProps {
  petName: string;
  onMetricsLog: (date: string, metrics: Omit<DailyMetrics, 'date' | 'logged'>) => void;
}

export const WeeklyCalendar = ({ petName, onMetricsLog }: WeeklyCalendarProps) => {
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showLogger, setShowLogger] = useState(false);
  
  // Sample data - in a real app, this would come from props or state management
  const [weeklyData, setWeeklyData] = useState<DailyMetrics[]>([
    {
      date: format(new Date(), 'yyyy-MM-dd'),
      food: 8,
      water: 7,
      urineColor: 'yellow',
      poopColor: 'brown',
      poopConsistency: 'firm',
      logged: true
    }
  ]);
  
  const [currentMetrics, setCurrentMetrics] = useState({
    food: 5,
    water: 5,
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
    setSelectedDate(date);
    const existingData = getDayData(date);
    if (existingData) {
      setCurrentMetrics({
        food: existingData.food,
        water: existingData.water,
        urineColor: existingData.urineColor,
        poopColor: existingData.poopColor,
        poopConsistency: existingData.poopConsistency
      });
    } else {
      setCurrentMetrics({
        food: 5,
        water: 5,
        urineColor: '',
        poopColor: '',
        poopConsistency: ''
      });
    }
    setShowLogger(true);
  };

  const handleSaveMetrics = () => {
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
            
            return (
              <div key={index} className="text-center">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  {day}
                </div>
                <div
                  className={`
                    relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 min-h-[100px]
                    ${isTodayDate ? 'border-primary bg-primary/5' : 'border-border bg-background'}
                    ${isSelectedDate ? 'ring-2 ring-primary ring-offset-2' : ''}
                    ${dayData?.logged ? 'bg-green-50 border-green-200' : ''}
                    hover:border-primary/40 hover:shadow-soft
                  `}
                  onClick={() => handleDateSelect(date)}
                >
                  <div className="text-sm font-medium mb-2">
                    {format(date, 'd')}
                  </div>
                  
                  {dayData?.logged ? (
                    <div className="space-y-1">
                      {/* Food & Water bars */}
                      <div className="flex space-x-1">
                        <div className="flex-1">
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-orange-400 transition-all"
                              style={{ width: `${(dayData.food / 10) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">F</div>
                        </div>
                        <div className="flex-1">
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-400 transition-all"
                              style={{ width: `${(dayData.water / 10) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">W</div>
                        </div>
                      </div>
                      
                      {/* Color indicators */}
                      <div className="flex justify-center space-x-1 mt-2">
                        <div 
                          className={`w-3 h-3 rounded-full border-2 ${getColorIndicator(dayData.urineColor, 'urine')}`}
                          title={`Urine: ${dayData.urineColor}`}
                        />
                        <div 
                          className={`w-3 h-3 rounded-full border-2 ${getColorIndicator(dayData.poopColor, 'poop')}`}
                          title={`Poop: ${dayData.poopColor}`}
                        />
                      </div>
                      
                      <Check className="w-4 h-4 text-green-600 mx-auto mt-1" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Plus className="w-4 h-4 text-muted-foreground" />
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Food & Water */}
            <div className="space-y-4">
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
              disabled={!currentMetrics.urineColor || !currentMetrics.poopColor || !currentMetrics.poopConsistency}
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
            <p className="font-medium mb-2">Progress Bars:</p>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-2 bg-orange-400 rounded"></div>
                <span>F = Food Intake</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-2 bg-blue-400 rounded"></div>
                <span>W = Water Intake</span>
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
    </div>
  );
};