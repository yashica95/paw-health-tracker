import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Heart, Utensils, Zap, Thermometer, Plus } from "lucide-react";

interface HealthMetrics {
  appetite: number;
  energy: number;
  mood: number;
  temperature: number;
  notes: string;
}

interface HealthLoggerProps {
  petName: string;
  onLogHealth: (metrics: HealthMetrics) => void;
}

export const HealthLogger = ({ petName, onLogHealth }: HealthLoggerProps) => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<HealthMetrics>({
    appetite: 5,
    energy: 5,
    mood: 5,
    temperature: 101.5,
    notes: ""
  });

  const handleSubmit = () => {
    onLogHealth(metrics);
    toast({
      title: "Health logged successfully!",
      description: `Recorded health data for ${petName}`,
    });
    
    // Reset form
    setMetrics({
      appetite: 5,
      energy: 5,
      mood: 5,
      temperature: 101.5,
      notes: ""
    });
  };

  const MetricSlider = ({ 
    icon: Icon, 
    label, 
    value, 
    onChange, 
    color,
    max = 10,
    min = 1,
    step = 1
  }: {
    icon: any;
    label: string;
    value: number;
    onChange: (value: number[]) => void;
    color: string;
    max?: number;
    min?: number;
    step?: number;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Icon className={`h-5 w-5 ${color}`} />
        <Label className="text-sm font-medium">{label}</Label>
        <span className="ml-auto text-sm font-bold text-primary">{value}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={onChange}
        max={max}
        min={min}
        step={step}
        className="w-full"
      />
    </div>
  );

  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="flex items-center space-x-2 mb-6">
        <Plus className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Log {petName}'s Health</h3>
      </div>
      
      <div className="space-y-6">
        <MetricSlider
          icon={Utensils}
          label="Appetite"
          value={metrics.appetite}
          onChange={(value) => setMetrics(prev => ({ ...prev, appetite: value[0] }))}
          color="text-orange-500"
        />
        
        <MetricSlider
          icon={Zap}
          label="Energy Level"
          value={metrics.energy}
          onChange={(value) => setMetrics(prev => ({ ...prev, energy: value[0] }))}
          color="text-yellow-500"
        />
        
        <MetricSlider
          icon={Heart}
          label="Mood"
          value={metrics.mood}
          onChange={(value) => setMetrics(prev => ({ ...prev, mood: value[0] }))}
          color="text-pink-500"
        />
        
        <MetricSlider
          icon={Thermometer}
          label="Temperature (°F)"
          value={metrics.temperature}
          onChange={(value) => setMetrics(prev => ({ ...prev, temperature: value[0] }))}
          color="text-blue-500"
          max={106}
          min={99}
          step={0.1}
        />
        
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any additional observations about your pet's health..."
            value={metrics.notes}
            onChange={(e) => setMetrics(prev => ({ ...prev, notes: e.target.value }))}
            className="min-h-[80px] resize-none border-primary/20 focus:border-primary/40"
          />
        </div>
        
        <Button 
          onClick={handleSubmit}
          variant="gradient"
          className="w-full"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Log Health Data
        </Button>
      </div>
    </Card>
  );
};