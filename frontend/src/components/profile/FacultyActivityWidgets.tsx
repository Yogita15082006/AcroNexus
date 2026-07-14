import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { BookOpen, AlertTriangle } from 'lucide-react';
import { subjectAssignments, mockActivityRecords } from '../../data/facultyActivityData';

export const FacultyTeachingSummary = ({ user }: { user: any }) => {
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTrigger(t => t + 1);
    window.addEventListener('attendance-updated', handleUpdate);
    return () => window.removeEventListener('attendance-updated', handleUpdate);
  }, []);

  const data = useMemo(() => {
    if (!user) return { assignments: [] };
    
    // Get assignments
    const assignments = subjectAssignments.filter(sa => sa.facultyId === user.id);
    
    // Compute stats per assignment
    const assignmentsWithStats = assignments.map(asgn => {
      const asgnRecords = mockActivityRecords.filter(r => 
         r.facultyId === user.id && 
         r.subjectName === asgn.subjectName && 
         r.className === asgn.className &&
         r.semester === asgn.semester
      );
      
      const holidayRecords = mockActivityRecords.filter(r => 
         r.status === 'Holiday' &&
         r.className === asgn.className &&
         r.semester === asgn.semester
      );

      const scheduled = asgnRecords.filter(r => r.status !== 'Holiday').length;
      const conducted = asgnRecords.filter(r => r.status === 'Present').length;
      const missed = asgnRecords.filter(r => r.status === 'Class Missed' || r.status === 'Absent').length;
      const cancelled = holidayRecords.length;

      return {
        ...asgn,
        stats: { scheduled, conducted, missed, cancelled }
      };
    });
    
    return {
      assignments: assignmentsWithStats
    };
  }, [user, trigger]);

  if (!user || data.assignments.length === 0) {
    return (
      <Card className="bg-card border-border shadow-sm w-full">
        <CardHeader className="pb-4 pt-6 px-6 border-b border-border/40">
          <CardTitle className="text-xl">Faculty Teaching Summary</CardTitle>
          <CardDescription>Your teaching assignments and metrics.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground italic">No assigned subjects available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border shadow-sm overflow-hidden w-full h-full flex flex-col">
      <CardHeader className="pb-4 pt-6 px-6 border-b border-border/40 bg-muted/10">
        <CardTitle className="text-xl flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Faculty Teaching Summary
        </CardTitle>
        <CardDescription>Your current teaching assignments and performance metrics.</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Assignments List */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {data.assignments.map((asgn, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-border/50 bg-background shadow-sm hover:border-primary/30 transition-all flex flex-col gap-4">
                
                {/* Information Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Assigned Subject(s)</p>
                    <p className="text-sm font-semibold text-foreground">{asgn.subjectName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Assigned Class(es)</p>
                    <p className="text-sm font-semibold text-foreground">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 shrink-0 px-2 py-0.5 text-xs font-semibold">
                        {asgn.className}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Semester</p>
                    <p className="text-sm font-semibold text-foreground">{asgn.semester}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Batch / Academic Year</p>
                    <p className="text-sm font-semibold text-foreground">{asgn.academicYear}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-3 pt-4 border-t border-border/40">
                  <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-muted/40 border border-border/50 transition-colors hover:bg-muted/60">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 text-center leading-tight">Total Classes<br/>Scheduled</span>
                    <span className="text-xl font-black text-foreground">{asgn.stats.scheduled}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/20">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5 text-center leading-tight">Classes<br/>Conducted</span>
                    <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">{asgn.stats.conducted}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/20">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5 text-center leading-tight">Classes<br/>Missed</span>
                    <span className="text-xl font-black text-amber-700 dark:text-amber-400">{asgn.stats.missed}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/20">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1.5 text-center leading-tight">Classes<br/>Cancelled</span>
                    <span className="text-xl font-black text-blue-700 dark:text-blue-400">{asgn.stats.cancelled}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const FacultyAbsenceHistory = ({ user }: { user: any }) => {
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTrigger(t => t + 1);
    window.addEventListener('attendance-updated', handleUpdate);
    return () => window.removeEventListener('attendance-updated', handleUpdate);
  }, []);

  const absences = useMemo(() => {
    if (!user) return [];
    // Get records that represent an absence
    const records = mockActivityRecords.filter(r => r.facultyId === user.id && (r.status === 'Absent' || r.status === 'Class Missed' || r.status === 'Holiday'));
    
    // Sort descending by date
    records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return records;
  }, [user, trigger]);

  if (!user || absences.length === 0) {
    return (
      <Card className="bg-card border-border shadow-sm mt-6 w-full">
        <CardHeader className="pb-4 pt-6 px-6 border-b border-border/40">
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Faculty Absence History
          </CardTitle>
          <CardDescription>A detailed log of your missed classes, full day absences, and holidays.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground italic">No absences recorded.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border shadow-sm mt-6 w-full flex flex-col h-full">
      <CardHeader className="pb-4 pt-6 px-6 border-b border-border/40 bg-muted/10 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Faculty Absence History
            </CardTitle>
            <CardDescription className="mt-1">A detailed log of your missed classes, full day absences, and holidays.</CardDescription>
          </div>
          <Badge variant="outline" className="bg-background">
            Total Absences: {absences.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto h-[400px] scrollbar-thin scrollbar-thumb-muted-foreground/20">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-md">
              <TableRow className="border-b border-border/40">
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap py-4 pl-6">Date</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap py-4">Day</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap py-4">Subject</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap py-4">Class</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap py-4">Semester</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap py-4">Batch</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap py-4">Time</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap py-4">Absence Type</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap py-4 pr-6 text-right">Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {absences.map((r) => {
                const dayStr = new Date(r.date).toLocaleDateString('en-US', { weekday: 'short' });
                const isFullDay = r.status === 'Absent' || r.status === 'Holiday';
                
                // Determine Absence Type text
                let absenceType = '';
                let badgeClass = '';
                if (r.status === 'Class Missed') {
                  absenceType = 'Lecture Missed';
                  badgeClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
                } else if (r.status === 'Absent') {
                  absenceType = 'Full Day Absent';
                  badgeClass = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
                } else if (r.status === 'Holiday') {
                  absenceType = 'Holiday';
                  badgeClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
                }
                
                return (
                  <TableRow key={r.id} className="hover:bg-muted/30 transition-colors border-b border-border/40 group">
                    <TableCell className="text-sm font-semibold whitespace-nowrap py-4 pl-6">{r.date}</TableCell>
                    <TableCell className="text-sm text-muted-foreground py-4">{dayStr}</TableCell>
                    <TableCell className="py-4 font-medium">{isFullDay ? '—' : r.subjectName}</TableCell>
                    <TableCell className="py-4">
                      {isFullDay ? <span className="text-muted-foreground">—</span> : <Badge variant="outline" className="px-2 py-0.5 text-xs">{r.className}</Badge>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground py-4">{isFullDay ? '—' : r.semester}</TableCell>
                    <TableCell className="text-sm text-muted-foreground py-4">{isFullDay ? '—' : r.academicYear}</TableCell>
                    <TableCell className="py-4">
                      {isFullDay ? (
                        <Badge variant="outline" className="px-2 py-0.5 text-xs bg-muted text-muted-foreground">Full Day</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">10:00 AM - 11:00 AM</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className={`px-2.5 py-1 text-xs font-semibold ${badgeClass}`}>
                        {absenceType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground py-4 pr-6 text-right">{r.reason || '—'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
