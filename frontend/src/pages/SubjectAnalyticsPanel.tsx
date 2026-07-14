import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Users, ClipboardList, CheckCircle2, TrendingUp, Search, Eye, Filter, Sparkles, Calendar } from 'lucide-react';
import { mockData } from '../data/mockData';

export const SubjectAnalyticsPanel = ({ workspaceContext }: { workspaceContext: any }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('All');
  const [filterAttendance, setFilterAttendance] = useState('All');
  
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const students = useMemo(() => {
    return mockData.students.filter(s => s.classId === workspaceContext.classId).map(student => {
      // Mock metrics specifically for this subject
      const totalAssignments = 5;
      const totalQuizzes = 3;
      const totalAttendance = 24;
      
      // Determine base performance randomly to simulate variation
      const basePerformance = Math.random();
      
      const submittedAssignments = Math.floor(basePerformance * (totalAssignments + 1));
      const assignmentPercentage = (submittedAssignments / totalAssignments) * 100;
      
      const attemptedQuizzes = Math.floor(basePerformance * (totalQuizzes + 1));
      const quizAverage = attemptedQuizzes > 0 ? Math.floor(basePerformance * 40) + 60 : 0;
      const quizPercentage = quizAverage;
      
      const presentAttendance = Math.floor((basePerformance * 0.4 + 0.6) * totalAttendance); // Even poor students attend some classes
      const attendancePercentage = (presentAttendance / totalAttendance) * 100;
      
      const overallScore = Math.round((assignmentPercentage * 0.3) + (quizPercentage * 0.4) + (attendancePercentage * 0.3));
      
      let badge = '';
      let badgeColor = '';
      let feedback = '';
      
      if (overallScore >= 90) {
        badge = 'Excellent';
        badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
        feedback = 'Consistently performs well in assignments, quizzes and attendance. Keep up the excellent work.';
      } else if (overallScore >= 80) {
        badge = 'Very Good';
        badgeColor = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
        feedback = 'Strong academic performance with good attendance. Focus on improving quiz scores.';
      } else if (overallScore >= 70) {
        badge = 'Good';
        badgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
        feedback = 'Regular attendance and assignment submissions. More quiz practice is recommended.';
      } else if (overallScore >= 60) {
        badge = 'Average';
        badgeColor = 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30';
        feedback = 'Performance is satisfactory but there is room for improvement in assignments and attendance.';
      } else {
        badge = 'Needs Improvement';
        badgeColor = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
        feedback = 'Low attendance and incomplete assignments are affecting overall performance. Immediate attention is recommended.';
      }
      
      let grade = '';
      if (overallScore >= 90) grade = 'O';
      else if (overallScore >= 80) grade = 'A+';
      else if (overallScore >= 70) grade = 'A';
      else if (overallScore >= 60) grade = 'B+';
      else if (overallScore >= 50) grade = 'B';
      else grade = 'C';

      return {
        ...student,
        metrics: {
          assignments: { total: totalAssignments, submitted: submittedAssignments, pending: totalAssignments - submittedAssignments, percentage: Math.round(assignmentPercentage) },
          quizzes: { total: totalQuizzes, attempted: attemptedQuizzes, average: Math.round(quizPercentage) },
          attendance: { total: totalAttendance, present: presentAttendance, absent: totalAttendance - presentAttendance, percentage: Math.round(attendancePercentage) },
          overallScore,
          badge,
          badgeColor,
          grade,
          feedback
        }
      };
    }).sort((a, b) => b.metrics.overallScore - a.metrics.overallScore);
  }, [workspaceContext]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.enrollmentNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesGrade = true;
      if (filterGrade !== 'All') {
        matchesGrade = s.metrics.badge === filterGrade;
      }
      
      let matchesAttendance = true;
      if (filterAttendance !== 'All') {
        if (filterAttendance === '<75%') matchesAttendance = s.metrics.attendance.percentage < 75;
        if (filterAttendance === '75%-85%') matchesAttendance = s.metrics.attendance.percentage >= 75 && s.metrics.attendance.percentage <= 85;
        if (filterAttendance === '>85%') matchesAttendance = s.metrics.attendance.percentage > 85;
      }
      
      return matchesSearch && matchesGrade && matchesAttendance;
    });
  }, [students, searchQuery, filterGrade, filterAttendance]);

  const dashboardMetrics = useMemo(() => {
    if (students.length === 0) return { total: 0, excellent: 0, good: 0, average: 0, poor: 0, avgAttendance: 0, avgQuiz: 0, avgAssignment: 0 };
    
    let excellent = 0, good = 0, average = 0, poor = 0;
    let sumAttendance = 0, sumQuiz = 0, sumAssignment = 0;
    
    students.forEach(s => {
      if (s.metrics.badge === 'Excellent' || s.metrics.badge === 'Very Good') excellent++;
      else if (s.metrics.badge === 'Good') good++;
      else if (s.metrics.badge === 'Average') average++;
      else poor++;
      
      sumAttendance += s.metrics.attendance.percentage;
      sumQuiz += s.metrics.quizzes.average;
      sumAssignment += s.metrics.assignments.percentage;
    });
    
    return {
      total: students.length,
      excellent,
      good,
      average,
      poor,
      avgAttendance: Math.round(sumAttendance / students.length),
      avgQuiz: Math.round(sumQuiz / students.length),
      avgAssignment: Math.round(sumAssignment / students.length)
    };
  }, [students]);

  const handleViewProfile = (student: any) => {
    setSelectedStudent(student);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Students</p>
              <h3 className="text-3xl font-bold text-foreground">{dashboardMetrics.total}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Avg Attendance</p>
              <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{dashboardMetrics.avgAttendance}%</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/20 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Avg Assignment %</p>
              <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{dashboardMetrics.avgAssignment}%</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-indigo-500/5 border-indigo-500/20 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Avg Quiz Score</p>
              <h3 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{dashboardMetrics.avgQuiz}%</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border/50 shadow-sm">
        <CardContent className="p-5">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Performance Distribution</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-emerald-500/5 rounded-lg p-3 text-center border border-emerald-500/20">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{dashboardMetrics.excellent}</p>
              <p className="text-xs font-semibold text-emerald-600/80 dark:text-emerald-400/80 uppercase">Excellent / V. Good</p>
            </div>
            <div className="bg-amber-500/5 rounded-lg p-3 text-center border border-amber-500/20">
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{dashboardMetrics.good}</p>
              <p className="text-xs font-semibold text-amber-600/80 dark:text-amber-400/80 uppercase">Good</p>
            </div>
            <div className="bg-orange-500/5 rounded-lg p-3 text-center border border-orange-500/20">
              <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{dashboardMetrics.average}</p>
              <p className="text-xs font-semibold text-orange-600/80 dark:text-orange-400/80 uppercase">Average</p>
            </div>
            <div className="bg-rose-500/5 rounded-lg p-3 text-center border border-rose-500/20">
              <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{dashboardMetrics.poor}</p>
              <p className="text-xs font-semibold text-rose-600/80 dark:text-rose-400/80 uppercase">Needs Improvement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-border/50 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by student name or enrollment..." 
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <Select value={filterGrade} onValueChange={setFilterGrade}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Grades</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Very Good">Very Good</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Average">Average</SelectItem>
                <SelectItem value="Needs Improvement">Needs Improvement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select value={filterAttendance} onValueChange={setFilterAttendance}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Attendance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Attendance</SelectItem>
              <SelectItem value=">85%">Above 85%</SelectItem>
              <SelectItem value="75%-85%">75% - 85%</SelectItem>
              <SelectItem value="<75%">Below 75%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-4">
        {filteredStudents.map(student => (
          <Card key={student.id} className="border border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left Column: Student Identity */}
              <div className="lg:w-[300px] p-5 border-b lg:border-b-0 lg:border-r border-border/50 bg-muted/5 flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-muted shrink-0 border border-border/50">
                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-base leading-tight">{student.name}</h4>
                    <p className="text-muted-foreground text-sm font-medium mt-1">{student.enrollmentNumber}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge className="bg-primary text-primary-foreground font-bold px-2 py-0.5">Grade: {student.metrics.grade}</Badge>
                      <Badge variant="outline" className={student.metrics.badgeColor}>{student.metrics.badge}</Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-border/50">
                  <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => handleViewProfile(student)}>
                    <Eye className="w-4 h-4 mr-2" /> View Complete Profile
                  </Button>
                </div>
              </div>

              {/* Middle Column: Performance Breakdown */}
              <div className="flex-1 p-5 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Assignments */}
                <div className="space-y-3">
                  <h5 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                    <ClipboardList className="w-4 h-4" /> Assignments
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-bold text-foreground">{student.metrics.assignments.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${student.metrics.assignments.percentage}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground font-medium pt-1">
                      <span>{student.metrics.assignments.submitted} Submitted</span>
                      <span>{student.metrics.assignments.pending} Pending</span>
                    </div>
                  </div>
                </div>

                {/* Quizzes */}
                <div className="space-y-3">
                  <h5 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" /> Quizzes
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Average Score</span>
                      <span className="font-bold text-foreground">{student.metrics.quizzes.average}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${student.metrics.quizzes.average}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground font-medium pt-1">
                      <span>{student.metrics.quizzes.attempted} / {student.metrics.quizzes.total} Attempted</span>
                    </div>
                  </div>
                </div>

                {/* Attendance */}
                <div className="space-y-3">
                  <h5 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                    <Calendar className="w-4 h-4" /> Attendance
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Attendance Rate</span>
                      <span className="font-bold text-foreground">{student.metrics.attendance.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${student.metrics.attendance.percentage}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground font-medium pt-1">
                      <span>{student.metrics.attendance.present} Present</span>
                      <span>{student.metrics.attendance.absent} Absent</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Feedback */}
              <div className="lg:w-[320px] p-5 border-t lg:border-t-0 lg:border-l border-border/50 bg-primary/5 flex flex-col justify-center">
                <h5 className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> AI Feedback
                </h5>
                <p className="text-sm text-foreground/80 leading-relaxed italic">
                  "{student.metrics.feedback}"
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-primary/10 pt-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overall Score</span>
                  <span className="text-lg font-bold text-primary">{student.metrics.overallScore}%</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {filteredStudents.length === 0 && (
          <div className="text-center py-16 bg-card rounded-xl border border-border/50 shadow-sm">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-foreground font-semibold">No students found</p>
            <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      {/* View Complete Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Student Academic Profile</DialogTitle>
                <DialogDescription>
                  Detailed performance report for {workspaceContext.subjectName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-6">
                {/* Header Profile */}
                <div className="flex items-start gap-5 p-5 bg-muted/10 rounded-xl border border-border/50">
                  <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 shadow-sm" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{selectedStudent.name}</h2>
                        <p className="text-muted-foreground font-medium">{selectedStudent.enrollmentNumber}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-primary text-primary-foreground text-base px-3 py-1 font-bold">Grade {selectedStudent.metrics.grade}</Badge>
                        <p className="text-sm font-semibold text-muted-foreground mt-2 uppercase tracking-wider">Overall Score: <span className="text-foreground">{selectedStudent.metrics.overallScore}%</span></p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Badge variant="outline" className={selectedStudent.metrics.badgeColor}>{selectedStudent.metrics.badge}</Badge>
                    </div>
                  </div>
                </div>

                {/* AI Feedback Banner */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                  <h4 className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4" /> AI Performance Analysis
                  </h4>
                  <p className="text-foreground/80 leading-relaxed font-medium">
                    {selectedStudent.metrics.feedback}
                  </p>
                </div>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Assignments History */}
                  <Card className="border border-border/50 shadow-sm">
                    <CardHeader className="bg-muted/10 pb-4">
                      <CardTitle className="text-base flex items-center gap-2"><ClipboardList className="w-4 h-4 text-blue-500" /> Assignment History</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selectedStudent.metrics.assignments.percentage}%</span>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Completion Rate</p>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-border/50">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Assigned</span>
                            <span className="font-bold text-foreground">{selectedStudent.metrics.assignments.total}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Submitted</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedStudent.metrics.assignments.submitted}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Pending</span>
                            <span className="font-bold text-rose-600 dark:text-rose-400">{selectedStudent.metrics.assignments.pending}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quizzes History */}
                  <Card className="border border-border/50 shadow-sm">
                    <CardHeader className="bg-muted/10 pb-4">
                      <CardTitle className="text-base flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Quiz History</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{selectedStudent.metrics.quizzes.average}%</span>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Average Score</p>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-border/50">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Quizzes</span>
                            <span className="font-bold text-foreground">{selectedStudent.metrics.quizzes.total}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Attempted</span>
                            <span className="font-bold text-foreground">{selectedStudent.metrics.quizzes.attempted}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Missed</span>
                            <span className="font-bold text-rose-600 dark:text-rose-400">{selectedStudent.metrics.quizzes.total - selectedStudent.metrics.quizzes.attempted}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Attendance History */}
                  <Card className="border border-border/50 shadow-sm">
                    <CardHeader className="bg-muted/10 pb-4">
                      <CardTitle className="text-base flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-500" /> Attendance History</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{selectedStudent.metrics.attendance.percentage}%</span>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Attendance Rate</p>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-border/50">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Sessions</span>
                            <span className="font-bold text-foreground">{selectedStudent.metrics.attendance.total}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Present</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedStudent.metrics.attendance.present}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Absent</span>
                            <span className="font-bold text-rose-600 dark:text-rose-400">{selectedStudent.metrics.attendance.absent}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Trend Chart Placeholder */}
                <Card className="border border-border/50 shadow-sm overflow-hidden">
                  <CardHeader className="bg-muted/10 pb-4">
                    <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Performance Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-40 w-full bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-muted flex items-end px-4 gap-2 pt-10 border-t border-border/50">
                      {/* Mock bars */}
                      {[65, 70, 68, 75, 80, 85, 82, 88, 90, selectedStudent.metrics.overallScore].map((height, i) => (
                        <div key={i} className="flex-1 bg-primary/40 hover:bg-primary transition-colors rounded-t-sm" style={{ height: `${height}%` }}></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
