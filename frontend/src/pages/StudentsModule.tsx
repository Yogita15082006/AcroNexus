import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { mockData } from '../data/mockData';
import { Filter, Search, X, BookOpen, GraduationCap, ArrowLeft, Printer, Download, Clock, Calendar, CheckCircle, FileText, Bell } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export const StudentsModule = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const years = ['Second Year', 'Third Year', 'Fourth Year'];
  const semesters = ['3rd', '4th', '5th', '6th', '7th', '8th'];
  const classesList = ['IT-1', 'IT-2', 'DS-1', 'DS-2'];

  const handleSearch = () => {
    let filtered = mockData.students;
    if (selectedYear) filtered = filtered.filter(s => s.year === selectedYear);
    if (selectedSemester) filtered = filtered.filter(s => s.semester === selectedSemester || s.semester === selectedSemester.replace('rd', '').replace('th', ''));
    if (selectedClass) filtered = filtered.filter(s => s.className === selectedClass);
    
    setSearchResults(filtered);
    setHasSearched(true);
  };

  const resetFilters = () => {
    setSelectedYear('');
    setSelectedSemester('');
    setSelectedClass('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
  };

  const closeProfile = () => {
    setSelectedStudent(null);
  };

  const handleDownloadReport = () => {
    if (!selectedStudent) return;
    
    const reportContent = `
ACRONEXUS STUDENT REPORT
========================
Name: ${selectedStudent.name}
Enrollment No: ${selectedStudent.enrollmentNumber}
Email: ${selectedStudent.email}
Phone: ${selectedStudent.phone}
Department: ${selectedStudent.branch}
Class: ${selectedStudent.className}
Semester: ${selectedStudent.semester}

ACADEMIC PERFORMANCE
--------------------
CGPA: ${selectedStudent.cgpa}
Active Backlogs: ${selectedStudent.activeBacklogs}
Overall Attendance: ${selectedStudent.overallAttendance}%

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedStudent.enrollmentNumber}_Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (selectedStudent) {
    // Generate some stable random stats for the specific student based on their ID string
    const seed = parseInt(selectedStudent.id.replace(/\D/g, '')) || 123;
    const avgAssignment = 60 + (seed % 40);
    const avgQuiz = 50 + (seed % 50);
    const midSem = 50 + (seed % 45);
    const endSem = 60 + (seed % 35);
    const overallExams = Math.floor((midSem + endSem) / 2);
    
    return (
      <div className="space-y-6 animate-in fade-in duration-300 pb-10">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={closeProfile} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Student List
          </Button>
          <div className="flex gap-2">
             <Button onClick={handleDownloadReport} variant="outline" className="gap-2 bg-primary/5 text-primary border-primary/20 hover:bg-primary/10">
               <Download className="w-4 h-4" /> Download Report
             </Button>
             <Button onClick={() => window.print()} variant="outline" className="gap-2 bg-primary/5 text-primary border-primary/20 hover:bg-primary/10">
               <Printer className="w-4 h-4" /> Print Profile
             </Button>
          </div>
        </div>

        {/* PERSONAL DETAILS */}
        <Card className="bg-card border-border shadow-md overflow-hidden">
           <div className="h-32 bg-gradient-to-r from-primary/80 to-primary w-full relative">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
           </div>
           <CardContent className="px-6 sm:px-10 pb-8 relative pt-0">
             <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
               <div className="-mt-16 shrink-0 z-10 relative">
                 <img 
                   src={selectedStudent.avatar} 
                   alt={selectedStudent.name} 
                   className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-background shadow-xl object-cover bg-muted"
                 />
                 <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-background rounded-full"></div>
               </div>
               <div className="pt-2 sm:pt-6 flex-1 w-full space-y-4">
                 <div>
                   <h1 className="text-3xl font-extrabold text-foreground">{selectedStudent.name}</h1>
                   <p className="text-lg text-primary font-medium">{selectedStudent.enrollmentNumber}</p>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground bg-muted/20 p-4 rounded-xl border border-border/40">
                   <div><strong className="block text-foreground mb-1">Email</strong> {selectedStudent.email}</div>
                   <div><strong className="block text-foreground mb-1">Mobile</strong> {selectedStudent.phone}</div>
                   <div><strong className="block text-foreground mb-1">Department</strong> {selectedStudent.branch}</div>
                   <div><strong className="block text-foreground mb-1">Academic Year</strong> {selectedStudent.year}</div>
                   <div><strong className="block text-foreground mb-1">Semester</strong> {selectedStudent.semester}</div>
                   <div><strong className="block text-foreground mb-1">Class</strong> {selectedStudent.className}</div>
                   <div><strong className="block text-foreground mb-1">Batch</strong> {selectedStudent.batch}</div>
                   <div><strong className="block text-foreground mb-1">Batch Coordinator</strong> {selectedStudent.batchCoordinator}</div>
                 </div>
               </div>
             </div>
           </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* ACADEMIC PERFORMANCE */}
            <Card className="bg-card border-border shadow-sm">
               <CardHeader className="pb-4">
                 <CardTitle className="text-xl flex items-center gap-2"><GraduationCap className="text-primary w-5 h-5"/> Academic Performance</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="grid grid-cols-2 gap-4 border-b border-border/40 pb-6">
                   <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex flex-col items-center justify-center">
                     <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Current CGPA</span>
                     <span className="text-3xl font-bold text-primary">{selectedStudent.cgpa}</span>
                   </div>
                   <div className={`p-4 rounded-xl border flex flex-col items-center justify-center ${selectedStudent.activeBacklogs > 0 ? 'bg-destructive/5 border-destructive/20 text-destructive' : 'bg-green-500/5 border-green-500/20 text-green-600'}`}>
                     <span className="text-sm font-semibold uppercase tracking-wider mb-1">Active Backlogs</span>
                     <span className="text-3xl font-bold">{selectedStudent.activeBacklogs}</span>
                   </div>
                 </div>
                 
                 <div>
                   <h4 className="text-sm font-bold text-muted-foreground uppercase mb-4">Semester-wise SGPA</h4>
                   <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                        const sgpaValue = selectedStudent.sgpa && selectedStudent.sgpa[`sem${sem}`];
                        return (
                          <div key={sem} className={`rounded-lg border p-3 text-center ${sgpaValue ? 'bg-background shadow-sm' : 'bg-muted/30 border-dashed opacity-60'}`}>
                            <div className="text-xs text-muted-foreground font-medium mb-1">Sem {sem}</div>
                            <div className={`text-base font-semibold ${sgpaValue ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                              {sgpaValue ? Number(sgpaValue).toFixed(2) : '—'}
                            </div>
                          </div>
                        );
                      })}
                   </div>
                 </div>
               </CardContent>
            </Card>

            {/* SUBJECTS & ATTENDANCE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-border shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2"><BookOpen className="text-primary w-5 h-5"/> Current Subjects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {selectedStudent.subjects?.map((sub: string, i: number) => (
                      <div key={i} className="px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm font-medium">
                        {sub}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2"><Clock className="text-primary w-5 h-5"/> Attendance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-end pb-4 border-b border-border/40">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Overall Attendance</p>
                      <p className={`text-2xl font-bold ${selectedStudent.overallAttendance >= 75 ? 'text-green-500' : 'text-destructive'}`}>
                        {selectedStudent.overallAttendance}%
                      </p>
                    </div>
                    <Badge variant={selectedStudent.overallAttendance >= 75 ? 'default' : 'destructive'}>
                      {selectedStudent.overallAttendance >= 75 ? 'Eligible' : 'Shortage'}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Classes Required for 75%</span>
                      <span className="font-semibold">{Math.max(0, Math.floor((75 - selectedStudent.overallAttendance) * 1.5))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Classes Missed</span>
                      <span className="font-semibold text-destructive">{Math.floor((100 - selectedStudent.overallAttendance) * 1.5)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* EXAMINATIONS */}
            <Card className="bg-card border-border shadow-sm">
               <CardHeader className="pb-4">
                 <CardTitle className="text-lg flex items-center gap-2"><FileText className="text-primary w-5 h-5"/> Examination Performance</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-border bg-muted/10 text-center">
                      <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Mid Semester</p>
                      <p className="text-xl font-bold">{midSem}%</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-muted/10 text-center">
                      <p className="text-xs text-muted-foreground font-medium uppercase mb-1">End Semester</p>
                      <p className="text-xl font-bold">{endSem}%</p>
                    </div>
                    <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 text-center">
                      <p className="text-xs text-primary font-medium uppercase mb-1">Overall %</p>
                      <p className="text-xl font-bold text-primary">{overallExams}%</p>
                    </div>
                 </div>
               </CardContent>
            </Card>

          </div>

          <div className="space-y-6">
            
            {/* ASSIGNMENTS */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2"><CheckCircle className="text-primary w-5 h-5"/> Assignments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Submitted</span>
                  <span className="font-semibold">{seed % 10 + 5}</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-semibold text-orange-500">{seed % 3}</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Late Submissions</span>
                  <span className="font-semibold text-destructive">{seed % 2}</span>
                </div>
                <div className="flex justify-between p-2 bg-primary/10 text-primary rounded-lg border border-primary/20 font-semibold">
                  <span>Average Score</span>
                  <span>{avgAssignment}%</span>
                </div>
              </CardContent>
            </Card>

            {/* QUIZZES */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2"><Clock className="text-primary w-5 h-5"/> Quizzes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Highest Score</span>
                  <span className="font-semibold text-green-500">{avgQuiz + (seed % 15)}%</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Lowest Score</span>
                  <span className="font-semibold text-destructive">{avgQuiz - (seed % 20)}%</span>
                </div>
                <div className="flex justify-between p-2 bg-primary/10 text-primary rounded-lg border border-primary/20 font-semibold">
                  <span>Average Score</span>
                  <span>{avgQuiz}%</span>
                </div>
              </CardContent>
            </Card>

            {/* EVENTS */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2"><Calendar className="text-primary w-5 h-5"/> Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Events Registered</span>
                  <span className="font-semibold">{seed % 5 + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Events Attended</span>
                  <span className="font-semibold">{seed % 4 + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certificates Earned</span>
                  <span className="font-semibold text-primary">{seed % 3}</span>
                </div>
              </CardContent>
            </Card>

            {/* NOTICES */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2"><Bell className="text-primary w-5 h-5"/> Notices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recent Notices</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unread Notices</span>
                  <Badge variant="destructive" className="h-5">{seed % 3 + 1}</Badge>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Student Management</h1>
        <p className="text-muted-foreground">Search and manage student profiles across all departments.</p>
      </div>

      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="pb-4 border-b border-border/40">
          <CardTitle className="text-lg flex items-center gap-2"><Filter className="w-5 h-5 text-primary" /> Filter Students</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Academic Year</label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Semester</label>
              <select 
                value={selectedSemester} 
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Semesters</option>
                {semesters.map(s => <option key={s} value={s}>Semester {s.replace(/\D/g,'')}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Class</label>
              <select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Classes</option>
                {classesList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSearch} className="flex-1 gap-2" disabled={!selectedYear && !selectedSemester && !selectedClass}>
                <Search className="w-4 h-4" /> Search
              </Button>
              <Button variant="outline" onClick={resetFilters} className="px-3" disabled={!selectedYear && !selectedSemester && !selectedClass && !hasSearched}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-0 pt-6 px-6">
             <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Search Results</CardTitle>
                <Badge variant="secondary">{searchResults.length} Students Found</Badge>
             </div>
          </CardHeader>
          <CardContent className="p-0 mt-4">
             {searchResults.length === 0 ? (
               <div className="p-8 text-center border-t border-border/40">
                 <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                   <Search className="w-8 h-8 text-muted-foreground/50" />
                 </div>
                 <p className="text-foreground font-semibold">No students found</p>
                 <p className="text-sm text-muted-foreground mt-1">Try adjusting your filter criteria.</p>
               </div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-y border-border/60">
                     <tr>
                       <th className="px-6 py-4 font-semibold">Student</th>
                       <th className="px-6 py-4 font-semibold">Enrollment No.</th>
                       <th className="px-6 py-4 font-semibold">Class / Sem</th>
                       <th className="px-6 py-4 font-semibold">CGPA</th>
                       <th className="px-6 py-4 font-semibold">Attendance</th>
                       <th className="px-6 py-4 font-semibold">Status</th>
                       <th className="px-6 py-4 font-semibold text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border/40">
                     {searchResults.map((student) => (
                       <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                             <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full border border-border object-cover" />
                             <div className="font-semibold text-foreground">{student.name}</div>
                           </div>
                         </td>
                         <td className="px-6 py-4 font-mono text-xs">{student.enrollmentNumber}</td>
                         <td className="px-6 py-4">
                           <div className="font-medium text-foreground">{student.className}</div>
                           <div className="text-xs text-muted-foreground">{student.semester} Sem</div>
                         </td>
                         <td className="px-6 py-4">
                           <span className="font-bold text-primary">{student.cgpa}</span>
                         </td>
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             <div className="flex-1 h-2 w-24 bg-muted rounded-full overflow-hidden">
                               <div 
                                 className={`h-full rounded-full ${student.overallAttendance >= 75 ? 'bg-green-500' : 'bg-destructive'}`} 
                                 style={{ width: `${student.overallAttendance}%` }}
                               />
                             </div>
                             <span className={`text-xs font-semibold ${student.overallAttendance >= 75 ? 'text-green-500' : 'text-destructive'}`}>
                               {student.overallAttendance}%
                             </span>
                           </div>
                         </td>
                         <td className="px-6 py-4">
                            <Badge variant="outline" className={student.activeBacklogs > 0 ? "border-orange-500/50 text-orange-600 bg-orange-500/10" : "border-green-500/50 text-green-600 bg-green-500/10"}>
                              {student.activeBacklogs > 0 ? 'Backlogs' : 'Clear'}
                            </Badge>
                         </td>
                         <td className="px-6 py-4 text-right">
                           <Button variant="ghost" size="sm" onClick={() => handleViewDetails(student)} className="text-primary hover:text-primary hover:bg-primary/10">
                             View Details
                           </Button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
