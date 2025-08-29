import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

interface HealthTrend {
  metric: string;
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface Reminder {
  id: string;
  title: string;
  type: 'medication' | 'appointment' | 'vaccination';
  dueDate: string;
  status: 'upcoming' | 'overdue' | 'completed';
}

interface HealthDashboardProps {
  petName: string;
  trends: HealthTrend[];
  reminders: Reminder[];
  overallHealth: number;
  monthlyCheckinStatus?: {
    status: 'overdue' | 'due-soon' | 'up-to-date';
    monthsOverdue?: number;
    daysUntilDue?: number;
    message: string;
  };
  onMonthlyCheckin?: () => void;
}

export const HealthDashboard = ({ 
  petName, 
  trends, 
  reminders,
  overallHealth,
  monthlyCheckinStatus,
  onMonthlyCheckin
}: HealthDashboardProps) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Clock className="h-4 w-4" />;
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'vaccination':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-500';
      case 'upcoming':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Health */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h3 className="text-lg font-semibold mb-4">{petName}'s Health Overview</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Health Score</span>
            <span className="text-2xl font-bold text-primary">{overallHealth}%</span>
          </div>
          <Progress value={overallHealth} className="h-3" />
          <p className="text-xs text-muted-foreground">
            Based on recent health logs and trends
          </p>
        </div>
      </Card>

      {/* Health Trends */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h3 className="text-lg font-semibold mb-4">Health Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trends.map((trend, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${trend.color}`} />
                <span className="text-sm font-medium">{trend.metric}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold">{trend.current}</span>
                {getTrendIcon(trend.trend)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reminders */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h3 className="text-lg font-semibold mb-4">Upcoming Reminders</h3>
        <div className="space-y-3">
          {reminders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No upcoming reminders
            </p>
          ) : (
            reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getReminderIcon(reminder.type)}
                  <div>
                    <p className="text-sm font-medium">{reminder.title}</p>
                    <p className="text-xs text-muted-foreground">{reminder.dueDate}</p>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(reminder.status)} text-white`}
                >
                  {reminder.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};