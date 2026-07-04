import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChartComponent, PieChartComponent } from '../components/Charts';
import { Users, BookOpen, CheckCircle, Clock, Plus, FileText, Upload, AlertCircle, Calendar as CalendarIcon, Bell, Activity, XCircle, LayoutDashboard, CalendarCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export const AdminDashboard = () => {
  const { user } = useAuth();
  
  // KPI Data
  const assignedClassesCount = user.classes?.length || 4;
  const subjectsAssignedCount = user.subjects?.length || 3;
  const todaysClasses = 4;
  const totalClassesTaken = 124;
  const totalClassesMissed = 3;
  const pendingReviews = 12;
  const upcomingQuizzes = 2;
  const upcomingEvents = 1;
  const activeNotices = 5;

  const schedule = [
    { time: '09:00 AM', subject: 'Java Programming', className: 'IT-1', status: 'Attendance Pending', color: 'bg-warning/20 text-warning border-warning/30' },
    { time: '11:00 AM', subject: 'DBMS', className: 'DS-1', status: 'Completed', color: 'bg-success/20 text-success border-success/30' },
    { time: '02:00 PM', subject: 'Web Development Lab', className: 'IT-2', status: 'Upcoming', color: 'bg-primary/20 text-primary border-primary/30' },
  ];

  const pendingActions = [
    { title: '12 Assignments waiting for review', color: 'text-warning bg-warning/10 border-warning/20', icon: <FileText className="w-4 h-4" /> },
    { title: 'Attendance not created for IT-2', color: 'text-destructive bg-destructive/10 border-destructive/20', icon: <XCircle className="w-4 h-4" /> },
    { title: 'Quiz Results Pending', color: 'text-success bg-success/10 border-success/20', icon: <CheckCircle className="w-4 h-4" /> },
    { title: 'New Event Registrations', color: 'text-primary bg-primary/10 border-primary/20', icon: <CalendarIcon className="w-4 h-4" /> },
    { title: 'New Notice Draft', color: 'text-secondary bg-secondary/10 border-secondary/20', icon: <Bell className="w-4 h-4" /> },
  ];

  const classOverview = [
    { className: 'IT-1', attendance: 85, students: 60, pending: 12, quizAvg: 78, eligible: 54 },
    { className: 'IT-2', attendance: 72, students: 65, pending: 5, quizAvg: 65, eligible: 45 },
    { className: 'DS-1', attendance: 91, students: 45, pending: 2, quizAvg: 88, eligible: 42 },
    { className: 'DS-2', attendance: 88, students: 48, pending: 0, quizAvg: 82, eligible: 46 },
  ];

  let quickActions = [
    { icon: <CalendarCheck className="w-5 h-5" />, label: 'Take Attendance', color: 'text-emerald-500' },
    { icon: <Upload className="w-5 h-5" />, label: 'Upload Assignment', color: 'text-blue-500' },
    { icon: <Plus className="w-5 h-5" />, label: 'Create Quiz', color: 'text-indigo-500' },
    { icon: <FileText className="w-5 h-5" />, label: 'Upload Result', color: 'text-cyan-500' },
  ];

  if (user.role === 'hod' || user.role === 'coordinator') {
    quickActions.push(
      { icon: <Bell className="w-5 h-5" />, label: 'Publish Notice', color: 'text-amber-500' },
      { icon: <CalendarIcon className="w-5 h-5" />, label: 'Create Event', color: 'text-rose-500' }
    );
  }

  if (user.role === 'hod') {
    quickActions.push(
      { icon: <Users className="w-5 h-5" />, label: 'Manage Faculty', color: 'text-purple-500' }
    );
  }

  const recentActivities = [
    { title: 'Attendance Created', desc: 'IT-1 Java Programming', time: '10 mins ago', color: 'bg-emerald-500' },
    { title: 'Assignment Uploaded', desc: 'DBMS Lab 4', time: '1 hour ago', color: 'bg-blue-500' },
    { title: 'Quiz Published', desc: 'Python Basics', time: '3 hours ago', color: 'bg-indigo-500' },
    { title: 'Notice Published', desc: 'Mid-Sem Timetable', time: 'Yesterday', color: 'bg-amber-500' },
    { title: 'Results Uploaded', desc: 'IT-2 Unit Test 1', time: 'Yesterday', color: 'bg-cyan-500' },
  ];

  // Analytics Data
  const attendanceDist = [
    { name: 'IT-1', attendance: 85 },
    { name: 'IT-2', attendance: 72 },
    { name: 'DS-1', attendance: 91 },
    { name: 'DS-2', attendance: 88 },
  ];
  
  const quizPerf = [
    { name: 'Quiz 1', marks: 75 },
    { name: 'Quiz 2', marks: 82 },
    { name: 'Quiz 3', marks: 68 },
    { name: 'Quiz 4', marks: 89 },
  ];

  const assignmentStats = [
    { name: 'Submitted', value: 82 },
    { name: 'Late', value: 8 },
    { name: 'Missing', value: 10 },
  ];
  
  const eligibilityStats = [
    { name: 'Eligible (>75%)', value: 187 },
    { name: 'Defaulters (<75%)', value: 31 },
  ];

  const summaryCards = [
    { title: 'Assigned Classes', value: assignedClassesCount, icon: <Users />, color: 'bg-blue-500/10 text-blue-500' },
    { title: 'Assigned Subjects', value: subjectsAssignedCount, icon: <BookOpen />, color: 'bg-indigo-500/10 text-indigo-500' },
    { title: "Today's Classes", value: todaysClasses, icon: <CalendarIcon />, color: 'bg-emerald-500/10 text-emerald-500' },
    { title: 'Total Taken', value: totalClassesTaken, icon: <CheckCircle />, color: 'bg-teal-500/10 text-teal-500' },
    { title: 'Total Missed', value: totalClassesMissed, icon: <XCircle />, color: 'bg-rose-500/10 text-rose-500' },
    { title: 'Pending Reviews', value: pendingReviews, icon: <Clock />, color: 'bg-amber-500/10 text-amber-500' },
    { title: 'Upcoming Quizzes', value: upcomingQuizzes, icon: <FileText />, color: 'bg-cyan-500/10 text-cyan-500' },
    { title: 'Upcoming Events', value: upcomingEvents, icon: <Activity />, color: 'bg-purple-500/10 text-purple-500' },
    { title: 'Active Notices', value: activeNotices, icon: <Bell />, color: 'bg-orange-500/10 text-orange-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border/50 p-6 rounded-xl shadow-sm">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            {user.role === 'hod' ? 'HOD Dashboard' : 
             user.role === 'coordinator' ? 'Class Coordinator Dashboard' : 
             'Faculty Dashboard'}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Welcome back, {user.name}. Here is your {user.role === 'hod' ? 'department' : user.role === 'coordinator' ? 'class' : 'teaching'} overview.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150" 
            alt="Admin Profile" 
            className="w-12 h-12 rounded-full border-2 border-primary/20 object-cover shadow-sm"
          />
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
        {summaryCards.map((card, idx) => (
          <Card key={idx} className="bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            <CardContent className="p-4 flex flex-col items-center text-center justify-center h-full relative">
              <div className={`p-2 rounded-full mb-2 ${card.color} transition-transform group-hover:scale-110`}>
                {React.cloneElement(card.icon as React.ReactElement<any>, { className: "w-5 h-5" })}
              </div>
              <h3 className="text-xl font-bold text-foreground">{card.value}</h3>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">{card.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Today's Schedule Timeline */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="bg-muted/20 border-b border-border/50 px-5 py-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-0">
                {schedule.map((item, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20 z-10 mt-1.5" />
                      {idx !== schedule.length - 1 && <div className="w-px h-full bg-border/60 my-1" />}
                    </div>
                    <div className="pb-6 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-lg border border-border/50 bg-background hover:bg-muted/30 transition-colors">
                        <div>
                          <p className="text-sm font-bold text-foreground">{item.time}</p>
                          <p className="text-sm font-medium text-muted-foreground mt-0.5">{item.subject} • <span className="text-foreground">{item.className}</span></p>
                        </div>
                        <Badge variant="outline" className={`px-2.5 py-1 ${item.color} border font-semibold text-xs`}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Class Overview Table */}
          <Card className="border border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/50 px-5 py-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Class Overview
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Class</th>
                    <th className="px-5 py-3 font-semibold">Attendance %</th>
                    <th className="px-5 py-3 font-semibold">Students</th>
                    <th className="px-5 py-3 font-semibold">Pending Assign.</th>
                    <th className="px-5 py-3 font-semibold">Quiz Avg</th>
                    <th className="px-5 py-3 font-semibold">Eligible (&gt;75%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {classOverview.map((cls, idx) => (
                    <tr key={idx} className="bg-card hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-semibold text-foreground">{cls.className}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${cls.attendance >= 75 ? 'text-success' : 'text-destructive'}`}>{cls.attendance}%</span>
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${cls.attendance >= 75 ? 'bg-success' : 'bg-destructive'}`} style={{ width: `${cls.attendance}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{cls.students}</td>
                      <td className="px-5 py-3">
                        <Badge variant="secondary" className={cls.pending > 0 ? 'bg-warning/10 text-warning hover:bg-warning/20 border-0' : ''}>
                          {cls.pending}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{cls.quizAvg}%</td>
                      <td className="px-5 py-3 text-muted-foreground">{cls.eligible} / {cls.students}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Meaningful Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-border/50 shadow-sm">
              <CardHeader className="bg-muted/20 border-b border-border/50 px-5 py-4">
                <CardTitle className="text-sm font-semibold">Attendance Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <BarChartComponent data={attendanceDist} xKey="name" yKey="attendance" color="hsl(var(--primary))" />
              </CardContent>
            </Card>
            
            <Card className="border border-border/50 shadow-sm">
              <CardHeader className="bg-muted/20 border-b border-border/50 px-5 py-4">
                <CardTitle className="text-sm font-semibold">Quiz Performance</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <BarChartComponent data={quizPerf} xKey="name" yKey="marks" color="hsl(var(--secondary))" />
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm">
              <CardHeader className="bg-muted/20 border-b border-border/50 px-5 py-4">
                <CardTitle className="text-sm font-semibold">Assignment Submission Status</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <PieChartComponent data={assignmentStats} colors={['hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))']} />
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm">
              <CardHeader className="bg-muted/20 border-b border-border/50 px-5 py-4">
                <CardTitle className="text-sm font-semibold">Exam Eligibility Status</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <PieChartComponent data={eligibilityStats} colors={['hsl(var(--primary))', 'hsl(var(--destructive))']} />
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="bg-muted/20 border-b border-border/50 px-5 py-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, idx) => (
                  <Button key={idx} variant="outline" className="h-auto py-4 flex flex-col gap-2 border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all group">
                    <div className={`${action.color} group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <span className="text-xs font-semibold text-foreground">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card className="border border-border/50 shadow-sm bg-card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-warning to-destructive"></div>
            <CardHeader className="bg-muted/20 border-b border-border/50 px-5 py-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-warning" /> Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {pendingActions.map((action, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${action.color}`}>
                        {action.icon}
                      </div>
                      <span className="text-sm font-medium text-foreground">{action.title}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 text-xs">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="bg-muted/20 border-b border-border/50 px-5 py-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-5">
                {recentActivities.map((act, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    {idx !== recentActivities.length - 1 && <div className="absolute left-[5px] top-5 w-px h-full bg-border/60" />}
                    <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 z-10 ${act.color} ring-4 ring-background`} />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">{act.title}</span>
                      <span className="text-xs text-muted-foreground mt-0.5">{act.desc}</span>
                      <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase mt-1">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

