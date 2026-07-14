import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle2, Clock, XCircle, BarChart3, AlertCircle } from 'lucide-react';

interface SubjectAttendance {
  subject: string;
  conducted: number;
  attended: number;
  percentage: number;
}

interface OverallAttendanceProps {
  data?: any;
}

export const OverallAttendance: React.FC<OverallAttendanceProps> = ({ data }) => {
  // Using mock data if not provided in props
  const totalConducted = data?.totalConducted || 250;
  const totalAttended = data?.totalAttended || 215;
  const totalMissed = totalConducted - totalAttended;
  const overallPercentage = Math.round((totalAttended / totalConducted) * 100);

  const subjects: SubjectAttendance[] = data?.subjects || [
    { subject: 'Java', conducted: 50, attended: 46, percentage: 92 },
    { subject: 'DBMS', conducted: 40, attended: 35, percentage: 88 },
    { subject: 'OS', conducted: 45, attended: 43, percentage: 95 },
    { subject: 'Computer Networks', conducted: 55, attended: 40, percentage: 72 },
    { subject: 'Software Engineering', conducted: 60, attended: 51, percentage: 85 },
  ];

  const getStatusColor = (percentage: number) => {
    if (percentage >= 85) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 85) return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">Excellent</Badge>;
    if (percentage >= 75) return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none">Good</Badge>;
    return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">Low Attendance</Badge>;
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-4 pt-6 px-6 border-b border-border/40">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Overall Attendance
            </CardTitle>
            <CardDescription>Comprehensive view of your class attendance.</CardDescription>
          </div>
          <div>
            {getStatusBadge(overallPercentage)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        
        {/* Overall Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary/10 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-primary/20">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Overall</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-primary">{overallPercentage}</span>
              <span className="text-lg font-bold text-primary/80">%</span>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-border/50">
            <Clock className="w-5 h-5 text-muted-foreground mb-2" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Conducted</span>
            <span className="text-2xl font-bold text-foreground">{totalConducted}</span>
          </div>

          <div className="bg-green-500/10 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-green-500/20">
            <CheckCircle2 className="w-5 h-5 text-green-600 mb-2" />
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Attended</span>
            <span className="text-2xl font-bold text-green-700">{totalAttended}</span>
          </div>

          <div className="bg-red-500/10 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-red-500/20">
            <XCircle className="w-5 h-5 text-red-600 mb-2" />
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Missed</span>
            <span className="text-2xl font-bold text-red-700">{totalMissed}</span>
          </div>
        </div>

        {/* Subject-wise Attendance */}
        <div className="space-y-4 pt-2">
          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Subject-wise Attendance</h4>
          <div className="space-y-5 bg-muted/10 p-5 rounded-xl border border-border/50">
            {subjects.map((sub, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-foreground">{sub.subject}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-medium">{sub.attended}/{sub.conducted} classes</span>
                    <span className={`font-bold ${sub.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                      {sub.percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getStatusColor(sub.percentage)}`} 
                    style={{ width: `${sub.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
            <AlertCircle className="w-4 h-4" />
            <span>Minimum 75% attendance is required to appear in final examinations.</span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
