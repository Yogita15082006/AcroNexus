import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Plus, Calendar, Clock, Users, ArrowLeft, XCircle, ClipboardCheck, History, Pause, Play, Square, Copy, Eye, Download, Activity, Save, Trash2, FileText, MessageSquare, CheckCircle2 } from 'lucide-react';
import { mockData } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const FacultyAttendancePanel = ({ workspaceContext }: { workspaceContext: any }) => {
  const classStudents = mockData.students.filter(s => s.classId === workspaceContext.classId);

  // Initialize with some mock history so the history tab has data
  const [sessions, setSessions] = useState<any[]>(() => {
    const history: any[] = [];
    const date = new Date();
    for(let i = 1; i <= 5; i++) {
        const d = new Date(date);
        d.setDate(d.getDate() - i);
        const total = classStudents.length;
        const present = Math.floor(total * (0.6 + Math.random() * 0.3)); // 60-90% present
        const absent = total - present;
        
        const records = classStudents.map((st, idx) => {
            const isPresent = idx < present;
            return {
                studentId: st.id,
                enrollmentNumber: st.enrollmentNumber,
                name: st.name,
                avatar: st.avatar,
                status: isPresent ? 'Present' : 'Absent',
                time: isPresent ? '10:05 AM' : '-',
                answer: isPresent ? 'Option A' : '-',
                verificationResult: isPresent ? 'Passed' : '-'
            };
        });

        history.push({
            id: `mock_session_${i}`,
            topic: `Lecture ${10 - i}: Previous Topic`,
            date: d.toISOString().split('T')[0],
            time: '10:00',
            duration: '60',
            code: Math.floor(100000 + Math.random() * 900000).toString(),
            verificationQuestion: 'What was the topic?',
            correctAnswer: 'Option A',
            records,
            totalStudents: total,
            presentCount: present,
            absentCount: absent,
            status: 'Closed',
            dismissed: true
        });
    }
    return history;
  });

  const [liveResponsesSessionId, setLiveResponsesSessionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'main' | 'history' | 'detail'>('main');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLiveResponsesOpen, setIsLiveResponsesOpen] = useState(false);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDetailSessionId, setSelectedDetailSessionId] = useState<string | null>(null);
  const [previousViewMode, setPreviousViewMode] = useState<'main' | 'history'>('main');

  const [newSession, setNewSession] = useState({
    topic: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: '60',
    code: Math.floor(100000 + Math.random() * 900000).toString(),
    verificationQuestion: '',
    correctAnswer: ''
  });

  // Simulation loop for active sessions
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions(prev => {
        let changed = false;
        const next = prev.map(s => {
          if (s.status === 'Active') {
            const remaining = s.records.filter((r: any) => r.status === 'Remaining');
            if (remaining.length > 0) {
              const numToUpdate = Math.min(Math.floor(Math.random() * 3), remaining.length);
              if (numToUpdate > 0) {
                changed = true;
                const newRecords = [...s.records];
                for(let i=0; i<numToUpdate; i++) {
                   const rIdx = newRecords.findIndex(r => r.status === 'Remaining');
                   if (rIdx >= 0) {
                     newRecords[rIdx] = {
                       ...newRecords[rIdx],
                       status: 'Present',
                       time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                       answer: s.correctAnswer || 'Yes',
                       verificationResult: s.verificationQuestion ? 'Passed' : '-'
                     };
                   }
                }
                const presentCount = newRecords.filter((r: any) => r.status === 'Present').length;
                return {
                  ...s,
                  records: newRecords,
                  presentCount,
                  remainingCount: s.totalStudents - presentCount
                };
              }
            }
          }
          return s;
        });
        return changed ? next : prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateSession = () => {
    if (!newSession.topic) return;
    
    // Create student records with 'Remaining' status initially
    const studentRecords = classStudents.map(student => {
      return {
        studentId: student.id,
        enrollmentNumber: student.enrollmentNumber,
        name: student.name,
        avatar: student.avatar,
        status: 'Remaining',
        time: '-',
        answer: '-',
        verificationResult: '-',
      };
    });

    const sessionObj = {
      id: `session_${Date.now()}`,
      topic: newSession.topic,
      date: newSession.date,
      time: newSession.time,
      duration: newSession.duration,
      code: newSession.code,
      verificationQuestion: newSession.verificationQuestion,
      correctAnswer: newSession.correctAnswer,
      records: studentRecords,
      totalStudents: classStudents.length,
      presentCount: 0,
      absentCount: 0,
      status: 'Active',
      dismissed: false,
      createdAt: new Date().toISOString()
    };

    setSessions([sessionObj, ...sessions]);
    setViewMode('main');
    setIsCreateModalOpen(false);
    
    // Reset form
    setNewSession({
      topic: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      duration: '60',
      code: Math.floor(100000 + Math.random() * 900000).toString(),
      verificationQuestion: '',
      correctAnswer: ''
    });
  };

  const updateSessionStatus = (id: string, status: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleStopSession = (id: string) => {
    setSessions(prev => prev.map(s => {
        if (s.id === id) {
            const updatedRecords = s.records.map((r: any) => 
                r.status === 'Remaining' ? { ...r, status: 'Absent', time: '-', answer: '-', verificationResult: '-' } : r
            );
            const absentCount = updatedRecords.filter((r: any) => r.status === 'Absent').length;
            return { ...s, status: 'Closed', records: updatedRecords, absentCount };
        }
        return s;
    }));
  };

  const handleSaveSession = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'Saved' } : s));
  };

  const handleDismissSession = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, dismissed: true } : s));
  };

  const renderMain = () => {
    const activeSessions = sessions.filter(s => s.status !== 'Saved' && !s.dismissed);
    const savedSessions = sessions.filter(s => s.status === 'Saved' && !s.dismissed);
    const classInfo = mockData.classes?.find(c => c.id === workspaceContext.classId) || { year: '2nd Year', semester: 'Semester 4', name: workspaceContext.classId || 'IT-1' };
    const facultyName = workspaceContext.facultyName || 'Faculty XYZ';
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-5 rounded-xl border border-border/50 shadow-sm">
                <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-primary" /> Attendance Management</h3>
                    <p className="text-sm text-muted-foreground">Manage live attendance for {workspaceContext.subjectName}.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setViewMode('history')} className="shadow-sm">
                        <History className="w-4 h-4 mr-2" /> Attendance History
                    </Button>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-sm">
                        <Plus className="w-4 h-4 mr-2" /> Create Session
                    </Button>
                </div>
            </div>

            {activeSessions.length > 0 && (
                <div className="space-y-6">
                    {activeSessions.map(activeSession => (
                        <Card key={activeSession.id} className="border-primary/50 shadow-lg overflow-hidden relative">
                            {activeSession.status === 'Active' && <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse" />}
                    <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <CardTitle className="text-2xl font-bold">{activeSession.topic}</CardTitle>
                                <CardDescription className="text-base mt-1.5 flex items-center gap-3">
                                    <span className="font-semibold text-foreground">{workspaceContext.subjectName}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {activeSession.date}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {activeSession.time} ({activeSession.duration}m)</span>
                                </CardDescription>
                            </div>
                            <Badge variant={activeSession.status === 'Active' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                                {activeSession.status === 'Active' ? <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live</span> : activeSession.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-card p-5 rounded-xl border border-border/50 shadow-sm flex justify-between items-center">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Attendance Code</p>
                                        <p className="text-xs text-muted-foreground">Share this with students</p>
                                    </div>
                                    <div className="text-4xl font-mono font-bold text-primary tracking-widest px-4 py-2 bg-primary/10 rounded-lg">
                                        {activeSession.code}
                                    </div>
                                </div>
                                <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
                                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Verification Question</p>
                                    <p className="text-lg font-medium text-foreground">{activeSession.verificationQuestion || <span className="text-muted-foreground italic">No verification question set.</span>}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm flex flex-col items-center justify-center text-center">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Students</p>
                                    <p className="text-3xl font-bold text-foreground">{activeSession.totalStudents}</p>
                                </div>
                                <div className="bg-primary/10 rounded-xl p-4 border border-primary/20 shadow-sm flex flex-col items-center justify-center text-center">
                                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Live Attendance</p>
                                    <p className="text-3xl font-bold text-primary">{Math.round((activeSession.presentCount / activeSession.totalStudents) * 100)}%</p>
                                </div>
                                <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20 shadow-sm flex flex-col items-center justify-center text-center">
                                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Present</p>
                                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{activeSession.presentCount}</p>
                                </div>
                                {(activeSession.status === 'Closed' || activeSession.status === 'Saved') ? (
                                    <div className="bg-rose-500/10 rounded-xl p-4 border border-rose-500/20 shadow-sm flex flex-col items-center justify-center text-center">
                                        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">Absent</p>
                                        <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">{activeSession.absentCount}</p>
                                    </div>
                                ) : (
                                    <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20 shadow-sm flex flex-col items-center justify-center text-center">
                                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Remaining</p>
                                        <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{activeSession.records.filter((r: any) => r.status === 'Remaining').length}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/20 border-t border-border/50 py-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {activeSession.status === 'Active' && (
                                <Button onClick={() => updateSessionStatus(activeSession.id, 'Paused')} variant="outline" className="border-amber-500/30 text-amber-600 hover:bg-amber-500/10">
                                    <Pause className="w-4 h-4 mr-2" /> Pause Attendance
                                </Button>
                            )}
                            {activeSession.status === 'Paused' && (
                                <Button onClick={() => updateSessionStatus(activeSession.id, 'Active')} variant="outline" className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10">
                                    <Play className="w-4 h-4 mr-2" /> Resume Attendance
                                </Button>
                            )}
                            {(activeSession.status === 'Active' || activeSession.status === 'Paused') && (
                                <Button onClick={() => handleStopSession(activeSession.id)} variant="destructive">
                                    <Square className="w-4 h-4 mr-2" /> Stop Attendance
                                </Button>
                            )}
                            {(activeSession.status === 'Active' || activeSession.status === 'Paused' || activeSession.status === 'Closed') && (
                                <Button onClick={() => {
                                    if (activeSession.status !== 'Closed') {
                                        handleStopSession(activeSession.id);
                                    }
                                    setTimeout(() => handleSaveSession(activeSession.id), 0);
                                }} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                                    <Save className="w-4 h-4 mr-2" /> Save Attendance
                                </Button>
                            )}
                            {(activeSession.status === 'Closed' || activeSession.status === 'Saved') && (
                                <Button onClick={() => handleDismissSession(activeSession.id)} variant="outline">
                                    Dismiss Session
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="secondary" onClick={() => navigator.clipboard.writeText(activeSession.code)}>
                                <Copy className="w-4 h-4 mr-2" /> Copy Code
                            </Button>
                            <Button onClick={() => { setLiveResponsesSessionId(activeSession.id); setIsLiveResponsesOpen(true); }}>
                                <Eye className="w-4 h-4 mr-2" /> View Live Responses
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
                    ))}
                </div>
            )}
            
            {savedSessions.length > 0 && (
                <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-primary" /> Saved Attendance Records</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {savedSessions.map(session => (
                            <Card key={session.id} className="border border-border/50 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                <CardHeader className="bg-muted/10 border-b border-border/50 pb-4">
                                    <CardTitle className="text-lg font-bold text-foreground leading-tight line-clamp-2 mb-2">{session.topic}</CardTitle>
                                    <CardDescription className="flex flex-col gap-1.5">
                                        <span className="font-semibold text-foreground">{workspaceContext.subjectName}</span>
                                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <Badge variant="outline" className="bg-background">{classInfo.year}</Badge>
                                            <Badge variant="outline" className="bg-background">{classInfo.semester}</Badge>
                                            <Badge variant="outline" className="bg-background">{classInfo.name}</Badge>
                                        </div>
                                        <span className="flex items-center gap-2 font-medium text-sm mt-1"><Users className="w-4 h-4" /> {facultyName}</span>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1.5 font-medium"><Calendar className="w-4 h-4" /> {session.date}</span>
                                            <span className="flex items-center gap-1.5 font-medium"><Clock className="w-4 h-4" /> {session.time}</span>
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4 flex-1">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-card rounded-lg p-3 text-center border border-border/50 shadow-sm">
                                            <p className="text-[10px] text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Total</p>
                                            <p className="text-xl font-bold text-foreground">{session.totalStudents}</p>
                                        </div>
                                        <div className="bg-emerald-500/10 rounded-lg p-3 text-center border border-emerald-500/20 shadow-sm">
                                            <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-semibold mb-1 uppercase tracking-wider">Present</p>
                                            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{session.presentCount}</p>
                                        </div>
                                        <div className="bg-rose-500/10 rounded-lg p-3 text-center border border-rose-500/20 shadow-sm">
                                            <p className="text-[10px] text-rose-600/80 dark:text-rose-400/80 font-semibold mb-1 uppercase tracking-wider">Absent</p>
                                            <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{session.absentCount}</p>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 pb-4 px-6 border-t border-transparent gap-3 flex flex-wrap">
                                    <Button variant="default" className="flex-1 min-w-[120px]" onClick={() => { setSelectedDetailSessionId(session.id); setPreviousViewMode(viewMode as 'main'|'history'); setViewMode('detail'); }}>
                                        <FileText className="w-4 h-4 mr-2" /> View Report
                                    </Button>
                                    <Button variant="outline" className="flex-1 min-w-[120px]" onClick={() => console.log('Exporting report for', session.id)}>
                                        <Download className="w-4 h-4 mr-2" /> Export
                                    </Button>
                                    <Button variant="destructive" className="w-full sm:w-auto px-3" onClick={() => setSessions(prev => prev.filter(s => s.id !== session.id))}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
  };

  const renderHistory = () => {
    const closedSessions = sessions.filter(s => s.status === 'Closed' || s.status === 'Saved');
    const totalSessions = closedSessions.length;
    const averageAttendance = totalSessions > 0 ? Math.round(closedSessions.reduce((acc, s) => acc + (s.presentCount / s.totalStudents), 0) / totalSessions * 100) : 0;
    const highestAttendance = totalSessions > 0 ? Math.max(...closedSessions.map(s => Math.round((s.presentCount / s.totalStudents) * 100))) : 0;
    const lowestAttendance = totalSessions > 0 ? Math.min(...closedSessions.map(s => Math.round((s.presentCount / s.totalStudents) * 100))) : 0;

    const studentStats: Record<string, { present: number, total: number }> = {};
    closedSessions.forEach(s => {
       s.records.forEach((r: any) => {
           if (!studentStats[r.studentId]) studentStats[r.studentId] = { present: 0, total: 0 };
           studentStats[r.studentId].total++;
           if (r.status === 'Present') studentStats[r.studentId].present++;
       });
    });
    let below75 = 0;
    let above90 = 0;
    Object.values(studentStats).forEach(stat => {
        const pct = (stat.present / stat.total) * 100;
        if (pct < 75) below75++;
        if (pct > 90) above90++;
    });

    const filteredSessions = closedSessions.filter(s => s.date === selectedHistoryDate);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => setViewMode('main')} className="shrink-0">
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2"><History className="w-6 h-6 text-primary" /> Attendance History</h2>
                    <p className="text-muted-foreground font-medium mt-1">Analytics and past sessions for {workspaceContext.subjectName}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="bg-primary/5 border-primary/20 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-xs font-bold text-primary/80 uppercase tracking-wider mb-1">Total Sessions</p>
                        <p className="text-2xl font-bold text-primary">{totalSessions}</p>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-xs font-bold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider mb-1">Avg Attendance</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{averageAttendance}%</p>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-xs font-bold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider mb-1">Highest</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{highestAttendance}%</p>
                    </CardContent>
                </Card>
                <Card className="bg-rose-500/5 border-rose-500/20 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-xs font-bold text-rose-600/80 dark:text-rose-400/80 uppercase tracking-wider mb-1">Lowest</p>
                        <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{lowestAttendance}%</p>
                    </CardContent>
                </Card>
                <Card className="bg-rose-500/5 border-rose-500/20 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-xs font-bold text-rose-600/80 dark:text-rose-400/80 uppercase tracking-wider mb-1">&lt; 75% Students</p>
                        <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{below75}</p>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-xs font-bold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider mb-1">&gt; 90% Students</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{above90}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Search by Date</h3>
                </div>
                <Input type="date" className="w-auto shadow-sm" value={selectedHistoryDate} onChange={(e) => setSelectedHistoryDate(e.target.value)} />
            </div>

            {filteredSessions.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border/50">
                    <p className="text-muted-foreground font-medium">No sessions conducted on {selectedHistoryDate}.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredSessions.map(session => (
                        <Card key={session.id} className="border border-border/50 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                            <CardHeader className="bg-muted/10 border-b border-border/50 pb-4">
                                <CardTitle className="text-lg font-bold text-foreground leading-tight line-clamp-2 mb-2">{session.topic}</CardTitle>
                                <CardDescription className="flex flex-col gap-1.5">
                                    <span className="font-semibold text-foreground">{workspaceContext.subjectName}</span>
                                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <Badge variant="outline" className="bg-background">2nd Year</Badge>
                                        <Badge variant="outline" className="bg-background">Semester 4</Badge>
                                        <Badge variant="outline" className="bg-background">{workspaceContext.classId || 'IT-1'}</Badge>
                                    </div>
                                    <span className="flex items-center gap-2 font-medium text-sm mt-1"><Users className="w-4 h-4" /> {workspaceContext.facultyName || 'Faculty XYZ'}</span>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="flex items-center gap-1.5 font-medium"><Calendar className="w-4 h-4" /> {session.date}</span>
                                        <span className="flex items-center gap-1.5 font-medium"><Clock className="w-4 h-4" /> {session.time}</span>
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 flex-1">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-card rounded-lg p-3 text-center border border-border/50 shadow-sm">
                                        <p className="text-[10px] text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Total</p>
                                        <p className="text-xl font-bold text-foreground">{session.totalStudents}</p>
                                    </div>
                                    <div className="bg-emerald-500/10 rounded-lg p-3 text-center border border-emerald-500/20 shadow-sm">
                                        <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-semibold mb-1 uppercase tracking-wider">Present</p>
                                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{session.presentCount}</p>
                                    </div>
                                    <div className="bg-rose-500/10 rounded-lg p-3 text-center border border-rose-500/20 shadow-sm">
                                        <p className="text-[10px] text-rose-600/80 dark:text-rose-400/80 font-semibold mb-1 uppercase tracking-wider">Absent</p>
                                        <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{session.absentCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0 pb-4 px-6 border-t border-transparent gap-3 flex flex-wrap">
                                <Button variant="default" className="flex-1 min-w-[120px]" onClick={() => { setSelectedDetailSessionId(session.id); setPreviousViewMode(viewMode as 'main'|'history'); setViewMode('detail'); }}>
                                    <FileText className="w-4 h-4 mr-2" /> View Report
                                </Button>
                                <Button variant="outline" className="flex-1 min-w-[120px]" onClick={() => console.log('Exporting report for', session.id)}>
                                    <Download className="w-4 h-4 mr-2" /> Export
                                </Button>
                                <Button variant="destructive" className="w-full sm:w-auto px-3" onClick={() => setSessions(prev => prev.filter(s => s.id !== session.id))}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
  };

  const renderDetail = () => {
    const session = sessions.find(s => s.id === selectedDetailSessionId);
    if (!session) return null;

    const absentRecords = session.records.filter((r: any) => r.status === 'Absent');

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => setViewMode(previousViewMode)} className="shrink-0 hover:bg-muted">
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{session.topic}</h2>
                    <p className="text-muted-foreground font-medium mt-1">
                        {session.date} at {session.time} • Code: <span className="font-mono font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded ml-1">{session.code}</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-primary/5 border-primary/20 shadow-sm">
                    <CardContent className="p-5 text-center">
                        <p className="text-xs font-bold text-primary/80 uppercase tracking-wider mb-1">Total Students</p>
                        <p className="text-3xl font-bold text-primary">{session.totalStudents}</p>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-sm">
                    <CardContent className="p-5 text-center">
                        <p className="text-xs font-bold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider mb-1">Present</p>
                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{session.presentCount}</p>
                    </CardContent>
                </Card>
                <Card className="bg-rose-500/5 border-rose-500/20 shadow-sm">
                    <CardContent className="p-5 text-center">
                        <p className="text-xs font-bold text-rose-600/80 dark:text-rose-400/80 uppercase tracking-wider mb-1">Absent</p>
                        <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">{session.absentCount}</p>
                    </CardContent>
                </Card>
                <Card className="bg-amber-500/5 border-amber-500/20 shadow-sm">
                    <CardContent className="p-5 text-center">
                        <p className="text-xs font-bold text-amber-600/80 dark:text-amber-400/80 uppercase tracking-wider mb-1">Attendance Rate</p>
                        <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{Math.round((session.presentCount / session.totalStudents) * 100)}%</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border border-border/50 shadow-sm">
                <CardHeader className="bg-muted/20 border-b border-border/50">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" /> Faculty Remarks
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <textarea 
                        className="w-full min-h-[100px] p-3 rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                        placeholder="Add remarks or notes about this session here..."
                        defaultValue={session.remarks || ""}
                    ></textarea>
                </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm">
                <CardHeader className="bg-muted/20 border-b border-border/50">
                    <CardTitle className="text-lg">All Students</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-6">Enrollment No.</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Answer</TableHead>
                                <TableHead>Verification</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {session.records.map((r: any) => (
                                <TableRow key={r.studentId} className={`transition-colors ${r.status === 'Absent' ? 'bg-rose-500/5 hover:bg-rose-500/10' : 'hover:bg-muted/10'}`}>
                                    <TableCell className="pl-6 font-medium text-muted-foreground text-sm">{r.enrollmentNumber}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full overflow-hidden shrink-0 ${r.status === 'Absent' ? 'ring-2 ring-rose-500/20' : 'bg-muted'}`}>
                                                <img src={r.avatar} alt={r.name} className={`w-full h-full object-cover ${r.status === 'Absent' ? 'grayscale opacity-70' : ''}`} />
                                            </div>
                                            <span className={`font-semibold ${r.status === 'Absent' ? 'text-rose-700 dark:text-rose-400' : 'text-foreground'}`}>{r.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={r.status === 'Present' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'}>
                                            {r.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{r.time}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{r.answer}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={r.verificationResult === 'Passed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : r.verificationResult === 'Failed' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' : ''}>
                                            {r.verificationResult}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {absentRecords.length > 0 && (
                <Card className="border border-rose-500/20 shadow-sm overflow-hidden">
                    <CardHeader className="bg-rose-500/5 border-b border-rose-500/10">
                        <CardTitle className="text-lg text-rose-600 flex items-center gap-2">
                            <XCircle className="w-5 h-5" /> Absent Students
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Enrollment No.</TableHead>
                                    <TableHead>Student Name</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {absentRecords.map((r: any) => (
                                    <TableRow key={r.studentId} className="hover:bg-rose-500/10 transition-colors">
                                        <TableCell className="pl-6 font-medium text-rose-600/70 dark:text-rose-400/70 text-sm">{r.enrollmentNumber}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-2 ring-rose-500/20">
                                                    <img src={r.avatar} alt={r.name} className="w-full h-full object-cover grayscale opacity-70" />
                                                </div>
                                                <span className="font-semibold text-rose-700 dark:text-rose-400">{r.name}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
  };

  const activeSessionForModal = sessions.find(s => s.id === liveResponsesSessionId);
  const liveResponses = activeSessionForModal?.records.filter((r: any) => r.status === 'Present') || [];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
      {viewMode === 'main' && renderMain()}
      {viewMode === 'history' && renderHistory()}
      {viewMode === 'detail' && renderDetail()}

      {/* Create Session Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Create Attendance Session</DialogTitle>
            <DialogDescription>
              Create a new attendance tracking session. The subject contextual details are automatically captured.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label className="font-semibold text-foreground">Lecture Topic <span className="text-destructive">*</span></Label>
              <Input 
                placeholder="e.g. Introduction to React Hooks" 
                value={newSession.topic}
                onChange={(e) => setNewSession({...newSession, topic: e.target.value})}
                className="shadow-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="font-semibold text-foreground">Date</Label>
                <Input 
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                  className="shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-foreground">Time</Label>
                <Input 
                  type="time"
                  value={newSession.time}
                  onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                  className="shadow-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="font-semibold text-foreground">Duration (Minutes)</Label>
                <Input 
                  type="number"
                  value={newSession.duration}
                  onChange={(e) => setNewSession({...newSession, duration: e.target.value})}
                  className="shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-foreground">Attendance Code</Label>
                <div className="flex gap-2">
                  <Input 
                    value={newSession.code}
                    onChange={(e) => setNewSession({...newSession, code: e.target.value})}
                    className="font-mono font-bold tracking-widest text-center shadow-sm text-primary"
                  />
                  <Button variant="outline" type="button" onClick={() => setNewSession({...newSession, code: Math.floor(100000 + Math.random() * 900000).toString()})} className="shadow-sm shrink-0">
                    Regenerate
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-foreground">Verification (Optional)</h4>
                <p className="text-xs text-muted-foreground">Ask a question to verify student presence.</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Verification Question</Label>
                <Input 
                  placeholder="e.g. What is the main hook used for state?" 
                  value={newSession.verificationQuestion}
                  onChange={(e) => setNewSession({...newSession, verificationQuestion: e.target.value})}
                  className="bg-background shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Correct Answer</Label>
                <Input 
                  placeholder="e.g. useState" 
                  value={newSession.correctAnswer}
                  onChange={(e) => setNewSession({...newSession, correctAnswer: e.target.value})}
                  className="bg-background shadow-sm"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSession} disabled={!newSession.topic} className="shadow-sm">Create Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Live Responses Modal */}
      <Dialog open={isLiveResponsesOpen} onOpenChange={setIsLiveResponsesOpen}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto flex flex-col">
              <DialogHeader className="shrink-0">
                  <DialogTitle className="text-xl flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" /> Live Responses
                  </DialogTitle>
                  <DialogDescription>
                      Students who have successfully submitted their attendance.
                  </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-auto border border-border/50 rounded-lg mt-4">
                  <Table>
                      <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-sm">
                          <TableRow>
                              <TableHead className="pl-6">Enrollment No.</TableHead>
                              <TableHead>Student Name</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>Answer</TableHead>
                              <TableHead>Verification</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {liveResponses.length === 0 ? (
                              <TableRow>
                                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                      No responses recorded yet.
                                  </TableCell>
                              </TableRow>
                          ) : (
                              liveResponses.map((r: any) => (
                                  <TableRow key={r.studentId}>
                                      <TableCell className="pl-6 font-medium text-muted-foreground text-sm">{r.enrollmentNumber}</TableCell>
                                      <TableCell>
                                          <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
                                                  <img src={r.avatar} alt={r.name} className="w-full h-full object-cover" />
                                              </div>
                                              <span className="font-semibold">{r.name}</span>
                                          </div>
                                      </TableCell>
                                      <TableCell className="text-muted-foreground text-sm">{r.time}</TableCell>
                                      <TableCell className="text-muted-foreground text-sm">{r.answer}</TableCell>
                                      <TableCell>
                                          <Badge variant="outline" className={r.verificationResult === 'Passed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : r.verificationResult === 'Failed' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' : ''}>
                                              {r.verificationResult}
                                          </Badge>
                                      </TableCell>
                                  </TableRow>
                              ))
                          )}
                      </TableBody>
                  </Table>
              </div>
              <DialogFooter className="pt-4 shrink-0">
                  <Button onClick={() => setIsLiveResponsesOpen(false)}>Close</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
};

const StudentAttendancePanel = ({ workspaceContext }: { workspaceContext: any }) => {
  const { user } = useAuth();
  
  // Simulate an active session that the faculty just created
  const [activeSession] = useState<any>({
    id: 'mock_active_session',
    topic: 'Introduction to Advanced React Patterns',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: '60',
    code: '123456',
    verificationQuestion: 'What is the main hook used for state?',
    status: 'Active',
    facultyName: workspaceContext.facultyName || 'Faculty XYZ'
  });

  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setError('');
    if (!code) {
      setError('Attendance code is required.');
      return;
    }
    
    // In a real app, this would be an API call to verify code and answer
    setIsSubmitting(true);
    
    setTimeout(() => {
      if (code !== activeSession.code) {
        setError('Invalid attendance code.');
        setIsSubmitting(false);
        return;
      }
      
      if (activeSession.verificationQuestion && !answer) {
        setError('Verification answer is required.');
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
      setIsSubmitting(false);
    }, 800);
  };

  // classInfo not used here

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div className="flex justify-between items-center bg-card p-5 rounded-xl border border-border/50 shadow-sm">
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" /> Attendance
          </h3>
          <p className="text-sm text-muted-foreground">Mark your attendance for {workspaceContext.subjectName}.</p>
        </div>
      </div>

      {!activeSession ? (
        <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border/50">
          <p className="text-muted-foreground font-medium">No active attendance session at the moment.</p>
        </div>
      ) : (
        <Card className="border-primary/50 shadow-lg overflow-hidden relative max-w-3xl mx-auto">
          {activeSession.status === 'Active' && !submitted && (
            <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse" />
          )}
          <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
            <div className="flex justify-between items-start gap-4">
              <div>
                <CardTitle className="text-2xl font-bold">{activeSession.topic}</CardTitle>
                <CardDescription className="text-base mt-1.5 flex flex-col gap-2">
                  <div className="flex items-center gap-3 font-semibold text-foreground">
                    <span>{workspaceContext.subjectName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 text-muted-foreground font-medium"><Users className="w-4 h-4" /> {activeSession.facultyName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {activeSession.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {activeSession.time} ({activeSession.duration}m)</span>
                  </div>
                </CardDescription>
              </div>
              <Badge variant={submitted ? 'outline' : 'default'} className={`text-sm px-3 py-1 ${submitted ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : ''}`}>
                {submitted ? (
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Marked Present</span>
                ) : (
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live</span>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {submitted ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Attendance Marked Successfully!</h3>
                  <p className="text-muted-foreground mt-2">Your presence has been recorded for this session.</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50 mt-4 flex flex-col gap-1 text-sm w-full max-w-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-semibold">{user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Enrollment No:</span>
                    <span className="font-semibold">{user?.enrollmentNumber || '0101CS211001'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-semibold">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-card p-5 rounded-xl border border-border/50 shadow-sm space-y-4">
                  <div className="space-y-2">
                    <Label className="font-semibold text-foreground">Attendance Code <span className="text-destructive">*</span></Label>
                    <Input 
                      placeholder="Enter the code shared by faculty" 
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="font-mono tracking-widest text-lg shadow-sm"
                      maxLength={6}
                    />
                  </div>
                </div>

                {activeSession.verificationQuestion && (
                  <div className="bg-muted/30 p-5 rounded-xl border border-border/50 space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Verification Question</p>
                      <p className="text-lg font-medium text-foreground">{activeSession.verificationQuestion}</p>
                    </div>
                    <div className="space-y-2 pt-2">
                      <Label className="font-semibold text-foreground">Your Answer <span className="text-destructive">*</span></Label>
                      <Input 
                        placeholder="Enter your answer" 
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="shadow-sm bg-background"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-600 text-sm font-medium flex items-center gap-2">
                    <XCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}
              </div>
            )}
          </CardContent>
          {!submitted && (
            <CardFooter className="bg-muted/20 border-t border-border/50 py-4">
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !code || (!!activeSession.verificationQuestion && !answer)} 
                className="w-full shadow-sm"
                size="lg"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
};

export const SubjectAttendancePanel = ({ workspaceContext }: { workspaceContext: any }) => {
  const { role } = useAuth();

  if (role === 'student') {
    return <StudentAttendancePanel workspaceContext={workspaceContext} />;
  }

  return <FacultyAttendancePanel workspaceContext={workspaceContext} />;
};
