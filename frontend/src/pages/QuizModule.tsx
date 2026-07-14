import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, CheckCircle2, 
  X, BarChart3, TrendingUp, AlertTriangle, Activity,
  Eye, Clock, Edit, Trash2, Users, Upload, Link as LinkIcon, FileText, Sparkles, ArrowLeft, Trophy, CheckSquare, XCircle, PlayCircle, Timer, FileQuestion, Send, Flag, Target, BrainCircuit, BookOpen, LayoutDashboard, Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { mockData } from '../data/mockData';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, BarChart, Bar, CartesianGrid, Legend, LineChart, Line, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// ─── Static rich mock data for Completed Quizzes ───────────────────────────
const STATIC_COMPLETED_QUIZZES: any[] = [
  {
    id: 'SQ1', title: 'Database Management System - Mid Term', subjectId: 'S2', subject: 'Database Management System',
    academicYear: 'Third Year', semester: 'Semester 5', className: 'IT-1',
    totalMarks: 50, passingMarks: 20, numQuestions: 25, duration: 45, type: 'MCQ', difficulty: 'Medium',
    facultyName: 'Prof. Neha Patel',
    attempt: {
      score: 42, percentage: 84, timeTaken: 38, status: 'Passed', rank: 3,
      submissionTime: '2026-06-10T11:38:00Z', attemptNumber: 1, grade: 'A+',
      correctAnswers: 21, incorrectAnswers: 3, unattemptedQuestions: 1,
      questions: [
        { no: 1, question: 'What is a primary key?', selected: 'A unique identifier for a record', correct: 'A unique identifier for a record', status: 'correct' },
        { no: 2, question: 'Which normal form removes partial dependencies?', selected: '2NF', correct: '2NF', status: 'correct' },
        { no: 3, question: 'What does ACID stand for?', selected: 'Atomicity, Consistency, Isolation, Durability', correct: 'Atomicity, Consistency, Isolation, Durability', status: 'correct' },
        { no: 4, question: 'Which JOIN returns all records from both tables?', selected: 'INNER JOIN', correct: 'FULL OUTER JOIN', status: 'incorrect' },
        { no: 5, question: 'What is a foreign key?', selected: '', correct: 'A key referencing another table\'s PK', status: 'skipped' },
      ]
    }
  },
  {
    id: 'SQ2', title: 'Operating System - Process Scheduling', subjectId: 'S3', subject: 'Operating System',
    academicYear: 'Third Year', semester: 'Semester 5', className: 'IT-1',
    totalMarks: 30, passingMarks: 12, numQuestions: 15, duration: 30, type: 'MCQ', difficulty: 'Hard',
    facultyName: 'Prof. Amit Singh',
    attempt: {
      score: 18, percentage: 60, timeTaken: 27, status: 'Passed', rank: 8,
      submissionTime: '2026-06-15T09:27:00Z', attemptNumber: 1, grade: 'B+',
      correctAnswers: 9, incorrectAnswers: 4, unattemptedQuestions: 2,
      questions: [
        { no: 1, question: 'What is a deadlock?', selected: 'A state where processes wait indefinitely', correct: 'A state where processes wait indefinitely', status: 'correct' },
        { no: 2, question: 'Which scheduling algorithm has the least average waiting time?', selected: 'FCFS', correct: 'SJF', status: 'incorrect' },
        { no: 3, question: 'What is thrashing?', selected: 'Excessive paging activity', correct: 'Excessive paging activity', status: 'correct' },
        { no: 4, question: 'What is a semaphore?', selected: '', correct: 'A synchronization primitive', status: 'skipped' },
        { no: 5, question: 'Belady\'s anomaly occurs in which algorithm?', selected: 'FIFO page replacement', correct: 'FIFO page replacement', status: 'correct' },
      ]
    }
  },
  {
    id: 'SQ3', title: 'Computer Networks - OSI Model Quiz', subjectId: 'S6', subject: 'Computer Networks',
    academicYear: 'Third Year', semester: 'Semester 6', className: 'IT-1',
    totalMarks: 20, passingMarks: 8, numQuestions: 10, duration: 20, type: 'MCQ', difficulty: 'Easy',
    facultyName: 'Prof. Sanjay Kumar',
    attempt: {
      score: 17, percentage: 85, timeTaken: 15, status: 'Passed', rank: 2,
      submissionTime: '2026-06-18T10:15:00Z', attemptNumber: 1, grade: 'A+',
      correctAnswers: 8, incorrectAnswers: 1, unattemptedQuestions: 1,
      questions: [
        { no: 1, question: 'How many layers does OSI model have?', selected: '7', correct: '7', status: 'correct' },
        { no: 2, question: 'Which layer handles routing?', selected: 'Network Layer', correct: 'Network Layer', status: 'correct' },
        { no: 3, question: 'What protocol is used at Transport layer?', selected: 'IP', correct: 'TCP/UDP', status: 'incorrect' },
        { no: 4, question: 'What does DNS stand for?', selected: 'Domain Name System', correct: 'Domain Name System', status: 'correct' },
        { no: 5, question: 'Which layer is responsible for encryption?', selected: '', correct: 'Presentation Layer', status: 'skipped' },
      ]
    }
  },
  {
    id: 'SQ4', title: 'Java Programming - OOPs Concepts', subjectId: 'S1', subject: 'Java Programming',
    academicYear: 'Second Year', semester: 'Semester 3', className: 'IT-1',
    totalMarks: 50, passingMarks: 20, numQuestions: 25, duration: 45, type: 'Mixed', difficulty: 'Medium',
    facultyName: 'Dr. Rahul Sharma',
    attempt: {
      score: 22, percentage: 44, timeTaken: 42, status: 'Passed', rank: 15,
      submissionTime: '2026-05-20T14:42:00Z', attemptNumber: 2, grade: 'C',
      correctAnswers: 11, incorrectAnswers: 10, unattemptedQuestions: 4,
      questions: [
        { no: 1, question: 'What is polymorphism?', selected: 'Same name, different behavior', correct: 'Same name, different behavior', status: 'correct' },
        { no: 2, question: 'Which keyword is used for inheritance in Java?', selected: 'extends', correct: 'extends', status: 'correct' },
        { no: 3, question: 'What is an abstract class?', selected: 'A class that cannot be instantiated', correct: 'A class that cannot be instantiated', status: 'correct' },
        { no: 4, question: 'What is method overloading?', selected: 'Same method name, different return type', correct: 'Same method name, different parameters', status: 'incorrect' },
        { no: 5, question: 'What is the output of Integer.MAX_VALUE + 1?', selected: '', correct: 'Integer.MIN_VALUE (overflow)', status: 'skipped' },
      ]
    }
  },
  {
    id: 'SQ5', title: 'Software Engineering - SDLC Models', subjectId: 'S7', subject: 'Software Engineering',
    academicYear: 'Third Year', semester: 'Semester 5', className: 'IT-1',
    totalMarks: 30, passingMarks: 12, numQuestions: 15, duration: 30, type: 'Theory', difficulty: 'Easy',
    facultyName: 'Dr. Anjali Gupta',
    attempt: {
      score: 28, percentage: 93.3, timeTaken: 22, status: 'Passed', rank: 1,
      submissionTime: '2026-06-05T10:22:00Z', attemptNumber: 1, grade: 'O',
      correctAnswers: 14, incorrectAnswers: 1, unattemptedQuestions: 0,
      questions: [
        { no: 1, question: 'What does SDLC stand for?', selected: 'Software Development Life Cycle', correct: 'Software Development Life Cycle', status: 'correct' },
        { no: 2, question: 'Which model is also called waterfall model?', selected: 'Linear Sequential Model', correct: 'Linear Sequential Model', status: 'correct' },
        { no: 3, question: 'What is a use case diagram?', selected: 'A system behavior diagram', correct: 'A system behavior diagram', status: 'correct' },
        { no: 4, question: 'Agile methodology follows which principle?', selected: 'Documentation over software', correct: 'Working software over documentation', status: 'incorrect' },
        { no: 5, question: 'What is a sprint in Scrum?', selected: 'A time-boxed iteration', correct: 'A time-boxed iteration', status: 'correct' },
      ]
    }
  },
  {
    id: 'SQ6', title: 'Data Structures - Trees and Graphs', subjectId: 'S8', subject: 'Data Structures',
    academicYear: 'Second Year', semester: 'Semester 4', className: 'IT-1',
    totalMarks: 100, passingMarks: 40, numQuestions: 50, duration: 60, type: 'MCQ', difficulty: 'Hard',
    facultyName: 'Prof. Vikram Rathore',
    attempt: {
      score: 34, percentage: 34, timeTaken: 55, status: 'Failed', rank: 22,
      submissionTime: '2026-05-10T15:55:00Z', attemptNumber: 1, grade: 'F',
      correctAnswers: 17, incorrectAnswers: 25, unattemptedQuestions: 8,
      questions: [
        { no: 1, question: 'What is the height of a balanced BST with n nodes?', selected: 'O(n)', correct: 'O(log n)', status: 'incorrect' },
        { no: 2, question: 'Which traversal visits root first?', selected: 'Pre-order', correct: 'Pre-order', status: 'correct' },
        { no: 3, question: 'What is a min-heap?', selected: 'Root is always smallest', correct: 'Root is always smallest', status: 'correct' },
        { no: 4, question: 'Dijkstra\'s algorithm is used for?', selected: '', correct: 'Shortest path in weighted graphs', status: 'skipped' },
        { no: 5, question: 'Time complexity of BFS?', selected: 'O(V^2)', correct: 'O(V + E)', status: 'incorrect' },
      ]
    }
  },
  {
    id: 'SQ7', title: 'Web Development - React & REST APIs', subjectId: 'S5', subject: 'Web Development',
    academicYear: 'Third Year', semester: 'Semester 6', className: 'IT-1',
    totalMarks: 50, passingMarks: 20, numQuestions: 25, duration: 40, type: 'Practical', difficulty: 'Medium',
    facultyName: 'Dr. Priya Verma',
    attempt: {
      score: 44, percentage: 88, timeTaken: 35, status: 'Passed', rank: 2,
      submissionTime: '2026-06-22T13:35:00Z', attemptNumber: 1, grade: 'A+',
      correctAnswers: 22, incorrectAnswers: 2, unattemptedQuestions: 1,
      questions: [
        { no: 1, question: 'What is JSX?', selected: 'JavaScript XML syntax extension', correct: 'JavaScript XML syntax extension', status: 'correct' },
        { no: 2, question: 'What hook manages state in React?', selected: 'useState', correct: 'useState', status: 'correct' },
        { no: 3, question: 'What is REST?', selected: 'Representational State Transfer', correct: 'Representational State Transfer', status: 'correct' },
        { no: 4, question: 'Which HTTP method is used to update a resource?', selected: 'POST', correct: 'PUT/PATCH', status: 'incorrect' },
        { no: 5, question: 'What does CORS stand for?', selected: '', correct: 'Cross-Origin Resource Sharing', status: 'skipped' },
      ]
    }
  },
  {
    id: 'SQ8', title: 'Artificial Intelligence - ML Basics', subjectId: 'S4', subject: 'Artificial Intelligence',
    academicYear: 'Third Year', semester: 'Semester 6', className: 'IT-1',
    totalMarks: 20, passingMarks: 8, numQuestions: 10, duration: 20, type: 'Theory', difficulty: 'Medium',
    facultyName: 'Dr. Megha Singh',
    attempt: {
      score: 14, percentage: 70, timeTaken: 18, status: 'Passed', rank: 5,
      submissionTime: '2026-06-28T09:18:00Z', attemptNumber: 1, grade: 'A',
      correctAnswers: 7, incorrectAnswers: 2, unattemptedQuestions: 1,
      questions: [
        { no: 1, question: 'What is supervised learning?', selected: 'Learning with labelled data', correct: 'Learning with labelled data', status: 'correct' },
        { no: 2, question: 'What is overfitting?', selected: 'Model performs well on training, poorly on test', correct: 'Model performs well on training, poorly on test', status: 'correct' },
        { no: 3, question: 'Which algorithm is used for classification?', selected: 'Linear Regression', correct: 'Logistic Regression / SVM', status: 'incorrect' },
        { no: 4, question: 'What is a neural network?', selected: 'A model inspired by the brain', correct: 'A model inspired by the brain', status: 'correct' },
        { no: 5, question: 'What is gradient descent?', selected: '', correct: 'Optimization algorithm to minimize loss', status: 'skipped' },
      ]
    }
  },
  {
    id: 'SQ9', title: 'Python Programming - Functions & Modules', subjectId: 'S4', subject: 'Python Programming',
    academicYear: 'Second Year', semester: 'Semester 3', className: 'IT-1',
    totalMarks: 30, passingMarks: 12, numQuestions: 15, duration: 25, type: 'MCQ', difficulty: 'Easy',
    facultyName: 'Prof. Rohit Jain',
    attempt: {
      score: 26, percentage: 86.7, timeTaken: 20, status: 'Passed', rank: 4,
      submissionTime: '2026-05-28T11:20:00Z', attemptNumber: 1, grade: 'A+',
      correctAnswers: 13, incorrectAnswers: 1, unattemptedQuestions: 1,
      questions: [
        { no: 1, question: 'How do you define a function in Python?', selected: 'def', correct: 'def', status: 'correct' },
        { no: 2, question: 'What is a lambda function?', selected: 'Anonymous function', correct: 'Anonymous function', status: 'correct' },
        { no: 3, question: 'Which keyword is used to import a module?', selected: 'import', correct: 'import', status: 'correct' },
        { no: 4, question: 'What does *args do?', selected: 'Passes keyword arguments', correct: 'Passes variable positional arguments', status: 'incorrect' },
        { no: 5, question: 'What is a decorator?', selected: '', correct: 'A function that wraps another function', status: 'skipped' },
      ]
    }
  },
  {
    id: 'SQ10', title: 'Computer Networks - TCP/IP & Subnetting', subjectId: 'S6', subject: 'Computer Networks',
    academicYear: 'Third Year', semester: 'Semester 5', className: 'IT-1',
    totalMarks: 50, passingMarks: 20, numQuestions: 25, duration: 40, type: 'Mixed', difficulty: 'Hard',
    facultyName: 'Prof. Sanjay Kumar',
    attempt: {
      score: 19, percentage: 38, timeTaken: 39, status: 'Failed', rank: 18,
      submissionTime: '2026-06-02T14:39:00Z', attemptNumber: 1, grade: 'F',
      correctAnswers: 9, incorrectAnswers: 13, unattemptedQuestions: 3,
      questions: [
        { no: 1, question: 'How many bits in an IPv4 address?', selected: '32', correct: '32', status: 'correct' },
        { no: 2, question: 'What is the default subnet mask for Class C?', selected: '255.255.0.0', correct: '255.255.255.0', status: 'incorrect' },
        { no: 3, question: 'What port does HTTP use?', selected: '80', correct: '80', status: 'correct' },
        { no: 4, question: 'What is ARP used for?', selected: '', correct: 'Mapping IP to MAC address', status: 'skipped' },
        { no: 5, question: 'Which protocol ensures reliable delivery?', selected: 'UDP', correct: 'TCP', status: 'incorrect' },
      ]
    }
  },
];

export function QuizModule({ workspaceContext }: { workspaceContext?: any }) {
  const { role, user } = useAuth();
  
  const [quizzes] = useState(mockData.quizzes);
  const [attempts, setAttempts] = useState<any[]>(mockData.quizAttempts);

  // Filter quizzes based on workspace context if provided
  const filteredQuizzes = workspaceContext 
    ? quizzes.filter(q => 
        q.classId === workspaceContext.classId && 
        q.subjectId === workspaceContext.subjectId
      )
    : quizzes;

  if (['faculty', 'hod', 'coordinator', 'both'].includes(role)) {
    return <AdminQuizDashboard quizzes={filteredQuizzes} attempts={attempts} workspaceContext={workspaceContext} />;
  }
  
  return <StudentQuizDashboard quizzes={filteredQuizzes} attempts={attempts} setAttempts={setAttempts} user={user} workspaceContext={workspaceContext} />;
}

// ==========================================
// ADMIN DASHBOARD HIERARCHY
// ==========================================
function QuizHierarchyView({ quizzes, searchQuery, onAnalyticsClick, workspaceContext }: any) {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);

  const availableYears = Array.from(new Set(mockData.classes.map(c => c.year))).sort();
  
  const getSemestersForYear = (year: string) => {
    if (year === 'First Year') return ['Semester 1', 'Semester 2'];
    if (year === 'Second Year') return ['Semester 3', 'Semester 4'];
    if (year === 'Third Year') return ['Semester 5', 'Semester 6'];
    if (year === 'Fourth Year') return ['Semester 7', 'Semester 8'];
    return ['Semester 1', 'Semester 2'];
  };

  const getClassesForSemester = (year: string, semester: string) => {
    return mockData.classes.filter((c: any) => c.year === year && c.semester === semester);
  };

  const classQuizzes = selectedClass ? quizzes.filter((q:any) => q.classId === selectedClass.id && q.title.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  if (workspaceContext) {
    const workspaceQuizzes = quizzes.filter((q:any) => q.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
      <div className="space-y-4">
        <Card className="shadow-sm border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Quiz Title</th>
                  <th className="px-6 py-4 font-medium">Subject</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {workspaceQuizzes.map((quiz: any) => {
                  const subject = mockData.subjects.find(s => s.id === quiz.subjectId)?.name || 'Unknown';
                  return (
                    <tr key={quiz.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{quiz.title}</td>
                      <td className="px-6 py-4 text-muted-foreground">{subject}</td>
                      <td className="px-6 py-4 text-muted-foreground">{quiz.date || 'TBD'}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          quiz.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          quiz.status === 'Upcoming' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                          'bg-purple-500/10 text-purple-500 border-purple-500/20'
                        }>
                          {quiz.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 gap-2 hover:text-primary" onClick={() => onAnalyticsClick(quiz)}>
                           <BarChart3 size={16} /> Analytics
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {workspaceQuizzes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No quizzes found for this workspace.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground bg-card p-3 rounded-md border border-border shadow-sm">
        <button onClick={() => { setSelectedYear(null); setSelectedSemester(null); setSelectedClass(null); }} className={`hover:text-primary transition-colors font-medium ${!selectedYear ? 'text-primary' : ''}`}>All Years</button>
        {selectedYear && (
          <>
            <span className="text-border">/</span>
            <button onClick={() => { setSelectedSemester(null); setSelectedClass(null); }} className={`hover:text-primary transition-colors font-medium ${!selectedSemester ? 'text-primary' : ''}`}>{selectedYear}</button>
          </>
        )}
        {selectedSemester && (
          <>
            <span className="text-border">/</span>
            <button onClick={() => setSelectedClass(null)} className={`hover:text-primary transition-colors font-medium ${!selectedClass ? 'text-primary' : ''}`}>{selectedSemester}</button>
          </>
        )}
        {selectedClass && (
          <>
            <span className="text-border">/</span>
            <span className="text-foreground font-semibold">{selectedClass.name}</span>
          </>
        )}
      </div>

      {!selectedYear ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {availableYears.map(year => (
            <Card key={year} className="cursor-pointer hover:border-primary transition-colors bg-card hover:bg-muted/50" onClick={() => setSelectedYear(year)}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{year}</h3>
                <p className="text-sm text-muted-foreground">{mockData.classes.filter(c => c.year === year).length} Classes</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !selectedSemester ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {getSemestersForYear(selectedYear).map(sem => (
            <Card key={sem} className="cursor-pointer hover:border-primary transition-colors bg-card hover:bg-muted/50" onClick={() => setSelectedSemester(sem)}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{sem}</h3>
                <p className="text-sm text-muted-foreground">{getClassesForSemester(selectedYear, sem).length} Classes</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !selectedClass ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {getClassesForSemester(selectedYear, selectedSemester).map(cls => (
            <Card key={cls.id} className="cursor-pointer hover:border-primary transition-colors bg-card hover:bg-muted/50" onClick={() => setSelectedClass(cls)}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{cls.name}</h3>
                <p className="text-sm text-muted-foreground">{quizzes.filter((q:any) => q.classId === cls.id).length} Quizzes</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-sm border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium">Quiz Title</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {classQuizzes.map((quiz: any) => {
                const subject = mockData.subjects.find(s => s.id === quiz.subjectId)?.name || 'Unknown';
                return (
                  <tr key={quiz.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{quiz.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{subject}</td>
                    <td className="px-6 py-4 text-muted-foreground">{quiz.date}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={
                        quiz.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        quiz.status === 'Upcoming' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                        'bg-purple-500/10 text-purple-500 border-purple-500/20'
                      }>
                        {quiz.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 gap-2 hover:text-primary" onClick={() => onAnalyticsClick(quiz)}>
                         <BarChart3 size={16} /> Analytics
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {classQuizzes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No quizzes found for this class.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      )}
    </div>
  );
}

// ==========================================
// ADMIN DASHBOARD
// ==========================================
function AdminQuizDashboard({ quizzes, attempts, workspaceContext }: any) {
  const [activeTab, setActiveTab] = useState(workspaceContext ? 'quizzes' : 'overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAnalyticsQuiz, setActiveAnalyticsQuiz] = useState<any>(null);
  

  if (activeAnalyticsQuiz) {
    return <AdminQuizAnalytics quiz={activeAnalyticsQuiz} allAttempts={attempts} onClose={() => setActiveAnalyticsQuiz(null)} />;
  }

  return (
    <motion.div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quiz Management</h1>
          <p className="text-muted-foreground mt-1">Create and monitor assessments.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search quizzes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="gap-2 shrink-0 shadow-sm">
            <Plus size={16} /> <span className="hidden sm:inline">Create Quiz</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      {!workspaceContext && (
        <div className="flex space-x-1 border-b border-border">
          {['overview', 'quizzes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && !workspaceContext && (
          <motion.div key="overview" variants={itemVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-6">
            <AdminOverviewDashboard quizzes={quizzes} attempts={attempts} />
          </motion.div>
        )}

        {activeTab === 'quizzes' && (
          <motion.div key="quizzes" variants={itemVariants} initial="hidden" animate="visible" exit="hidden">
            <QuizHierarchyView 
              quizzes={quizzes} 
              searchQuery={searchQuery} 
              onAnalyticsClick={setActiveAnalyticsQuiz} 
              workspaceContext={workspaceContext}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && (
          <CreateQuizModal onClose={() => setShowCreateModal(false)} onSave={() => setShowCreateModal(false)} workspaceContext={workspaceContext} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==========================================
// ADMIN DASHBOARD OVERVIEW
// ==========================================
function AdminOverviewDashboard({ quizzes, attempts }: any) {
  const totalQuizzes = quizzes.length;
  const activeQuizzes = quizzes.filter((q:any) => q.status === 'Active').length;
  const draftQuizzes = quizzes.filter((q:any) => q.status === 'Upcoming' || q.status === 'Draft').length;
  const completedQuizzes = quizzes.filter((q:any) => q.status === 'Completed').length;
  
  const uniqueStudentsAttempted = new Set(attempts.map((a:any) => a.studentId)).size;
  const totalStudents = mockData.students.length;
  const studentsPending = Math.max(0, totalStudents - uniqueStudentsAttempted);
  
  const avgScore = attempts.length > 0 ? (attempts.reduce((acc:any, curr:any) => acc + curr.percentage, 0) / attempts.length) : 0;
  const completionRate = totalStudents > 0 ? ((uniqueStudentsAttempted / totalStudents) * 100) : 0;
  
  const passedCount = attempts.filter((a:any) => a.status === 'Passed').length;
  const passPercentage = attempts.length > 0 ? (passedCount / attempts.length) * 100 : 0;
  const failPercentage = attempts.length > 0 ? 100 - passPercentage : 0;

  // Chart Data Preparation (Mocked/Derived)
  const performanceTrend = [
    { name: 'Week 1', score: 65 }, { name: 'Week 2', score: 68 },
    { name: 'Week 3', score: 74 }, { name: 'Week 4', score: 72 },
    { name: 'Week 5', score: Math.round(avgScore) || 80 }
  ];
  
  const passFailData = [
    { name: 'Passed', value: passedCount || 1, color: '#10B981' },
    { name: 'Failed', value: (attempts.length - passedCount) || 1, color: '#EF4444' }
  ];

  const subjectDist = mockData.subjects.map(sub => {
    const subQuizzes = quizzes.filter((q:any) => q.subjectId === sub.id);
    const subAttempts = attempts.filter((a:any) => subQuizzes.some((sq:any) => sq.id === a.quizId));
    const avg = subAttempts.length > 0 ? subAttempts.reduce((acc:any, a:any) => acc + a.percentage, 0) / subAttempts.length : 0;
    return { name: sub.name, quizzes: subQuizzes.length, avgScore: Math.round(avg) };
  }).filter(s => s.quizzes > 0);

  const diffDist = [
    { name: 'Easy', value: 35, color: '#3B82F6' },
    { name: 'Medium', value: 45, color: '#F59E0B' },
    { name: 'Hard', value: 20, color: '#EF4444' }
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total Quizzes" value={totalQuizzes} icon={<LayoutDashboard size={20}/>} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard title="Active" value={activeQuizzes} icon={<Activity size={20}/>} color="text-emerald-500" bg="bg-emerald-500/10" />
        <StatCard title="Drafts/Upcoming" value={draftQuizzes} icon={<Edit size={20}/>} color="text-amber-500" bg="bg-amber-500/10" />
        <StatCard title="Completed" value={completedQuizzes} icon={<CheckCircle2 size={20}/>} color="text-purple-500" bg="bg-purple-500/10" />
        <StatCard title="Avg Score" value={`${avgScore.toFixed(1)}%`} icon={<TrendingUp size={20}/>} color="text-indigo-500" bg="bg-indigo-500/10" />
        
        <StatCard title="Students Attempted" value={uniqueStudentsAttempted} icon={<Users size={20}/>} color="text-emerald-500" bg="bg-emerald-500/10" />
        <StatCard title="Students Pending" value={studentsPending} icon={<Clock size={20}/>} color="text-amber-500" bg="bg-amber-500/10" />
        <StatCard title="Completion Rate" value={`${completionRate.toFixed(1)}%`} icon={<Target size={20}/>} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard title="Pass Rate" value={`${passPercentage.toFixed(1)}%`} icon={<Trophy size={20}/>} color="text-emerald-500" bg="bg-emerald-500/10" />
        <StatCard title="Fail Rate" value={`${failPercentage.toFixed(1)}%`} icon={<AlertTriangle size={20}/>} color="text-red-500" bg="bg-red-500/10" />
      </div>

      {/* AI Premium Panel */}
      <Card className="border-indigo-500/20 shadow-md bg-gradient-to-br from-indigo-500/5 to-purple-500/5 overflow-hidden">
         <CardHeader className="border-b border-indigo-500/10 pb-4">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-indigo-500/20 text-indigo-600 rounded-lg"><BrainCircuit size={24} /></div>
               <div>
                 <CardTitle className="text-xl text-indigo-900 dark:text-indigo-300">Nexus AI Insights</CardTitle>
                 <CardDescription className="text-indigo-700/70 dark:text-indigo-400/70">Intelligent analysis across all assessments</CardDescription>
               </div>
            </div>
         </CardHeader>
         <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
               <div className="bg-background/60 backdrop-blur-sm p-4 rounded-xl border border-indigo-500/10 h-full">
                 <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Target size={16}/> Overall Summary</h4>
                 <p className="text-sm mt-2 font-medium">Students are showing consistent improvement, but there is a notable struggle in advanced analytical questions.</p>
               </div>
               <div className="bg-background/60 backdrop-blur-sm p-4 rounded-xl border border-indigo-500/10 h-full">
                 <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><AlertTriangle size={16}/> Attention Required</h4>
                 <p className="text-sm mt-2 font-medium">15% of students are consistently scoring below passing marks across core subjects.</p>
               </div>
            </div>
            <div className="space-y-4">
               <div className="bg-background/60 backdrop-blur-sm p-4 rounded-xl border border-indigo-500/10 h-full">
                 <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><BookOpen size={16}/> Most Difficult Subject</h4>
                 <p className="text-sm mt-2 font-medium text-red-500">Operating Systems (42% Avg Score)</p>
               </div>
               <div className="bg-background/60 backdrop-blur-sm p-4 rounded-xl border border-indigo-500/10 h-full">
                 <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><FileQuestion size={16}/> Most Difficult Quiz</h4>
                 <p className="text-sm mt-2 font-medium">Advanced Paging & Segmentation</p>
               </div>
            </div>
            <div className="space-y-4">
               <div className="bg-background/60 backdrop-blur-sm p-4 rounded-xl border border-indigo-500/10 h-full">
                 <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Trophy size={16}/> Top Performing Class</h4>
                 <p className="text-sm mt-2 font-medium text-emerald-500">IT-1 (3rd Year)</p>
               </div>
               <div className="bg-background/60 backdrop-blur-sm p-4 rounded-xl border border-indigo-500/10 h-full">
                 <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Sparkles size={16}/> AI Recommendation</h4>
                 <p className="text-sm mt-2 font-medium">Conduct a remedial session for Operating Systems before the next major assessment.</p>
               </div>
            </div>
         </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card className="shadow-sm border-border">
          <CardHeader><CardTitle className="text-lg">Overall Performance Trend</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend}>
                <defs>
                  <linearGradient id="colorScoreOverview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 8 }} />
                <Area type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorScoreOverview)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pass vs Fail */}
        <Card className="shadow-sm border-border">
          <CardHeader><CardTitle className="text-lg">Pass vs Fail Ratio</CardTitle></CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={passFailData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                  {passFailData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                <Legend verticalAlign="bottom" height={36} />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject-wise Average Score */}
        <Card className="shadow-sm border-border">
          <CardHeader><CardTitle className="text-lg">Subject-wise Average Score</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectDist} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 8 }} />
                <Bar dataKey="avgScore" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} name="Avg Score (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Difficulty Distribution */}
        <Card className="shadow-sm border-border">
          <CardHeader><CardTitle className="text-lg">Quiz Difficulty Distribution</CardTitle></CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={diffDist} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {diffDist.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ==========================================
// ADMIN QUIZ ANALYTICS (DEDICATED)
// ==========================================
function AdminQuizAnalytics({ quiz, allAttempts, onClose }: any) {
  const attempts = allAttempts.filter((a: any) => a.quizId === quiz.id);
  const subject = mockData.subjects.find(s => s.id === quiz.subjectId)?.name;
  
  // Calculate metrics
  const totalStudents = mockData.students.filter(s => s.classId === quiz.classId).length;
  const attemptedCount = attempts.length;
  const passedCount = attempts.filter((a:any) => a.status === 'Passed').length;
  const failedCount = attempts.filter((a:any) => a.status === 'Failed').length;
  
  const scores = attempts.map((a:any) => a.score);
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
  const avgScore = scores.length > 0 ? (scores.reduce((a:any, b:any) => a + b, 0) / scores.length).toFixed(1) : 0;
  const avgTime = scores.length > 0 ? (attempts.reduce((acc:any, a:any) => acc + a.timeTaken, 0) / attempts.length).toFixed(1) : 0;
  const completionRate = totalStudents > 0 ? ((attemptedCount / totalStudents) * 100).toFixed(1) : 0;

  // Chart Data
  const scoreDist = [
    { range: '0-20%', count: attempts.filter((a:any) => a.percentage <= 20).length },
    { range: '21-40%', count: attempts.filter((a:any) => a.percentage > 20 && a.percentage <= 40).length },
    { range: '41-60%', count: attempts.filter((a:any) => a.percentage > 40 && a.percentage <= 60).length },
    { range: '61-80%', count: attempts.filter((a:any) => a.percentage > 60 && a.percentage <= 80).length },
    { range: '81-100%', count: attempts.filter((a:any) => a.percentage > 80).length },
  ];

  const insights = [
    `Difficulty Analysis: The average score is ${avgScore}/${quiz.totalMarks}. This indicates a ${Number(avgScore) > quiz.totalMarks * 0.7 ? 'fairly balanced' : 'challenging'} difficulty level.`,
    `Question Insights: Question 4 saw the highest incorrect attempts (62%). Consider reviewing this topic in class.`,
    `Time Management: The average time taken was ${avgTime} mins out of ${quiz.duration} mins. Most students managed their time efficiently.`,
    `Students needing improvement: ${failedCount} students failed to achieve the passing mark of ${quiz.passingMarks}.`,
    `Topic Performance: Concepts related to advanced application of ${subject} showed lower accuracy. Easiest questions were from the introductory sections.`,
  ];

  return (
    <motion.div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onClose} className="rounded-full"><ArrowLeft size={18} /></Button>
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-bold text-foreground">{quiz.title} Analytics</h1>
             <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{subject}</Badge>
          </div>
          <p className="text-muted-foreground mt-1">Detailed performance metrics, ranks, and AI insights for this specific quiz.</p>
        </div>
      </div>

      {/* Filters (Mocked visual representation) */}
      <Card className="border-border shadow-sm p-2 bg-muted/20">
         <div className="flex flex-wrap gap-2">
            <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none"><option>All Classes</option><option>{quiz.department}-{quiz.academicYear}</option></select>
            <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none"><option>All Status</option><option>Passed</option><option>Failed</option></select>
            <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none"><option>Marks: All</option><option>Top 25%</option><option>Bottom 25%</option></select>
            <Button variant="outline" size="sm" className="ml-auto gap-2"><Filter size={14}/> Apply Filters</Button>
         </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Total Eligible" value={totalStudents} icon={<Activity size={20} />} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard title="Attempted" value={attemptedCount} icon={<CheckSquare size={20} />} color="text-indigo-500" bg="bg-indigo-500/10" />
        <StatCard title="Completion Rate" value={`${completionRate}%`} icon={<TrendingUp size={20} />} color="text-emerald-500" bg="bg-emerald-500/10" />
        <StatCard title="Passed" value={passedCount} icon={<Trophy size={20} />} color="text-emerald-500" bg="bg-emerald-500/10" />
        <StatCard title="Failed" value={failedCount} icon={<XCircle size={20} />} color="text-red-500" bg="bg-red-500/10" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card">
           <p className="text-sm text-muted-foreground">Highest Score</p>
           <h4 className="text-xl font-bold mt-1">{highestScore}/{quiz.totalMarks}</h4>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
           <p className="text-sm text-muted-foreground">Average Score</p>
           <h4 className="text-xl font-bold mt-1">{avgScore}/{quiz.totalMarks}</h4>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
           <p className="text-sm text-muted-foreground">Lowest Score</p>
           <h4 className="text-xl font-bold mt-1">{lowestScore}/{quiz.totalMarks}</h4>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
           <p className="text-sm text-muted-foreground">Avg Time Taken</p>
           <h4 className="text-xl font-bold mt-1">{avgTime} mins</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Score Distribution */}
         <Card className="shadow-sm border-border">
           <CardHeader>
             <CardTitle className="text-lg">Score Distribution</CardTitle>
           </CardHeader>
           <CardContent className="h-72">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={scoreDist}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                 <XAxis dataKey="range" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis fontSize={12} tickLine={false} axisLine={false} />
                 <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 8 }} />
                 <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Students" />
               </BarChart>
             </ResponsiveContainer>
           </CardContent>
         </Card>

         {/* Pass/Fail & AI Insights */}
         <Card className="shadow-sm border-border flex flex-col">
           <CardHeader className="pb-2">
             <div className="flex items-center gap-2 text-indigo-500">
               <Sparkles size={20} />
               <CardTitle className="text-lg text-foreground">AI Quiz Insights</CardTitle>
             </div>
           </CardHeader>
           <CardContent className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 mt-2">
             {insights.map((insight, idx) => (
                <div key={idx} className="p-3 bg-muted/20 border border-border/50 rounded-lg text-sm text-foreground/90">
                  {insight}
                </div>
             ))}
           </CardContent>
         </Card>
      </div>

      {/* Rank List Table */}
      <Card className="shadow-sm border-border">
        <CardHeader className="border-b border-border bg-muted/10">
          <CardTitle className="text-lg">Comprehensive Rank List</CardTitle>
          <CardDescription>Performance of all students in this specific quiz.</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
          <table className="w-full text-sm text-left relative">
            <thead className="text-xs text-muted-foreground uppercase bg-muted sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Rank</th>
                <th className="px-6 py-4 font-medium">Student Name</th>
                <th className="px-6 py-4 font-medium">Score</th>
                <th className="px-6 py-4 font-medium">Percentage</th>
                <th className="px-6 py-4 font-medium">Time Taken</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(() => {
                  const sortedAttempts = [...attempts].sort((a,b) => b.score - a.score);
                  return sortedAttempts.map((attempt: any) => {
                const student = mockData.students.find(s => s.id === attempt.studentId);
                return (
                  <tr key={attempt.id} className="hover:bg-muted/30">
                     <td className="px-6 py-4 font-bold text-foreground">#{attempt.rank}</td>
                     <td className="px-6 py-4 font-medium">{student?.name} <span className="text-xs text-muted-foreground block">{student?.enrollmentNumber}</span></td>
                     <td className="px-6 py-4 font-bold text-primary">{attempt.score}/{quiz.totalMarks}</td>
                     <td className="px-6 py-4">{attempt.percentage.toFixed(1)}%</td>
                     <td className="px-6 py-4 text-muted-foreground">{attempt.timeTaken} mins</td>
                     <td className="px-6 py-4">
                       <Badge variant="outline" className={attempt.status === 'Passed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}>
                          {attempt.status}
                       </Badge>
                     </td>
                  </tr>
                );
              });
              })()}
              {attempts.length === 0 && (
                 <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No attempts found for this quiz yet.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}

// ==========================================
// CREATE QUIZ MODAL
// ==========================================
function CreateQuizModal({ onClose, onSave, workspaceContext }: any) {
  const [step, setStep] = useState(1);
  const [creationMethod, setCreationMethod] = useState('manual');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-card w-full max-w-5xl max-h-[90vh] rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground">Create New Quiz</h2>
            <p className="text-sm text-muted-foreground">
               {step === 1 ? 'Choose creation method' : step === 2 ? 'Configure quiz details' : 'Review & Edit Questions'}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground"><X size={20} /></Button>
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
           {step === 1 && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <CreationMethodCard title="Create Manually" icon={<Edit size={24}/>} desc="Type questions manually one by one." active={creationMethod==='manual'} onClick={()=>setCreationMethod('manual')} />
                <CreationMethodCard title="Upload Quiz File" icon={<Upload size={24}/>} desc="Upload PDF, DOCX, CSV, Excel, ZIP or JSON." active={creationMethod==='upload'} onClick={()=>setCreationMethod('upload')} />
                <CreationMethodCard title="Generate via AI" icon={<Sparkles size={24}/>} desc="Auto-generate questions based on topic and difficulty." active={creationMethod==='ai'} onClick={()=>setCreationMethod('ai')} />
                <CreationMethodCard title="Google Forms Link" icon={<LinkIcon size={24}/>} desc="Import directly from Google Forms." active={creationMethod==='gform'} onClick={()=>setCreationMethod('gform')} />
                <CreationMethodCard title="MS Forms Link" icon={<LinkIcon size={24}/>} desc="Import directly from Microsoft Forms." active={creationMethod==='msform'} onClick={()=>setCreationMethod('msform')} />
                <CreationMethodCard title="Public URL / Question Bank" icon={<FileText size={24}/>} desc="Scrape questions from a public link or bank." active={creationMethod==='public'} onClick={()=>setCreationMethod('public')} />
             </div>
           )}

           {step === 2 && (
             <div className="space-y-6">
                {/* Dynamic Configuration based on Method */}
                {creationMethod === 'ai' && (
                  <div className="p-5 border border-primary/30 bg-primary/5 rounded-xl space-y-4 mb-6">
                     <h3 className="font-semibold text-primary flex items-center gap-2"><Sparkles size={18}/> AI Generator Configuration</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2"><label className="text-sm">Topic</label><input type="text" className="input-class" placeholder="e.g. Data Structures" /></div>
                        <div className="space-y-2"><label className="text-sm">Difficulty</label><select className="input-class"><option>Mixed</option><option>Easy</option><option>Hard</option></select></div>
                        <div className="space-y-2"><label className="text-sm">Number of Questions</label><input type="number" className="input-class" defaultValue={10} /></div>
                        <div className="space-y-2"><label className="text-sm">Question Type</label><select className="input-class"><option>MCQ</option><option>True/False</option><option>Short Answer</option></select></div>
                        <div className="space-y-2"><label className="text-sm">Bloom's Taxonomy</label><select className="input-class"><option>Remembering & Understanding</option><option>Applying & Analyzing</option><option>Evaluating & Creating</option></select></div>
                        <div className="space-y-2"><label className="text-sm">Marks per Question</label><input type="number" className="input-class" defaultValue={1} /></div>
                     </div>
                     <Button className="w-full mt-2 gap-2"><Sparkles size={16}/> Generate Questions Now</Button>
                  </div>
                )}

                {creationMethod === 'upload' && (
                  <div className="p-8 border-2 border-dashed border-border rounded-xl mb-6 text-center hover:bg-muted/10 transition-colors">
                     <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                     <h3 className="font-medium text-lg">Drag & Drop your Quiz File</h3>
                     <p className="text-sm text-muted-foreground mt-1 mb-4">Supports PDF, DOCX, PPT, TXT, CSV, Excel, Images, ZIP, JSON, Question Bank</p>
                     <Button variant="outline">Browse Files</Button>
                  </div>
                )}

                {(creationMethod === 'gform' || creationMethod === 'msform' || creationMethod === 'public') && (
                  <div className="p-6 border border-border rounded-xl mb-6 space-y-4">
                     <h3 className="font-medium text-lg flex items-center gap-2"><LinkIcon size={18}/> Import from Link</h3>
                     <input type="url" className="input-class w-full" placeholder="Paste the form or public URL here..." />
                     <Button>Import Questions</Button>
                  </div>
                )}

                {/* Standardized Targeting Fields */}
                {!workspaceContext && (
                  <>
                    <h3 className="font-semibold text-lg border-b border-border pb-2">Target Audience</h3>
                    <QuizTargetingFields />
                  </>
                )}

                {/* Quiz-specific Details */}
                <h3 className="font-semibold text-lg border-b border-border pb-2 mt-6">Quiz Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2"><label className="text-sm font-medium">Quiz Title *</label><input type="text" className="input-class" placeholder="e.g., Mid-Term Assessment" /></div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject *</label>
                    <select className="input-class" disabled={!!workspaceContext} defaultValue={workspaceContext?.subjectId || ""}>
                       {mockData.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2"><label className="text-sm font-medium">Total Marks *</label><input type="number" className="input-class" placeholder="e.g., 20" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Passing Marks *</label><input type="number" className="input-class" placeholder="e.g., 8" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Duration (Minutes) *</label><input type="number" className="input-class" placeholder="e.g., 30" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Schedule Date & Time</label><input type="datetime-local" className="input-class" /></div>
                </div>
             </div>
           )}

           {step === 3 && (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Review & Edit Questions</h3>
                  <Button size="sm" className="gap-2"><Plus size={16} /> Add Question</Button>
                </div>
                {/* Dummy Question Item */}
                <div className="p-5 border border-border rounded-xl bg-card shadow-sm space-y-5">
                   <div className="flex justify-between items-start">
                     <span className="font-medium text-sm bg-primary/10 text-primary px-3 py-1 rounded-md">Question 1</span>
                     <div className="flex gap-2 text-muted-foreground">
                        <Button variant="ghost" size="sm" className="h-8 gap-1 hover:text-destructive"><Trash2 size={14} /> Delete</Button>
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Question Statement</label>
                     <textarea className="input-class custom-scrollbar" rows={2} defaultValue="What is the output of 2 + 2 in JavaScript?" />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {[1,2,3,4].map(opt => (
                        <div key={opt} className="flex items-center gap-3 bg-muted/20 p-2 rounded-lg border border-border/50">
                          <input type="radio" name="q1_correct" className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 border-border ml-2" defaultChecked={opt===1} />
                          <input type="text" className="w-full bg-transparent border-none text-sm outline-none placeholder:text-muted-foreground/60 focus:ring-0" defaultValue={`Option ${opt}`} />
                        </div>
                     ))}
                   </div>
                </div>
             </div>
           )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-between shrink-0">
          <Button variant="outline" onClick={() => step > 1 ? setStep(step - 1) : onClose()}>
             {step > 1 ? 'Back' : 'Cancel'}
          </Button>
          <div className="flex gap-3">
             {step < 3 ? (
               <Button onClick={() => setStep(step + 1)}>Next Step</Button>
             ) : (
               <Button onClick={onSave} className="gap-2"><CheckCircle2 size={16} /> Publish Quiz</Button>
             )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function QuizTargetingFields() {
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');
  const [department, setDepartment] = useState('');
  const [targetClasses, setTargetClasses] = useState<string[]>([]);

  const allClasses = mockData.classes || [];
  
  // Filter classes based on selected year and department
  const filteredClasses = allClasses.filter(c => {
    let match = true;
    if (academicYear) {
      match = match && c.year === academicYear;
    }
    if (department) {
      match = match && c.name.includes(department);
    }
    return match;
  });

  const toggleClass = (className: string) => {
    setTargetClasses(prev => 
      prev.includes(className) ? prev.filter(c => c !== className) : [...prev, className]
    );
  };

  const selectAllClasses = () => {
    if (targetClasses.length === filteredClasses.length) {
      setTargetClasses([]);
    } else {
      setTargetClasses(filteredClasses.map(c => c.name));
    }
  };

  // Auto-update classes when filters change
  const handleYearChange = (year: string) => {
    setAcademicYear(year);
    setTargetClasses([]);
  };

  const handleDeptChange = (dept: string) => {
    setDepartment(dept);
    setTargetClasses([]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Academic Year *</label>
        <select 
          className="input-class" 
          value={academicYear} 
          onChange={e => handleYearChange(e.target.value)}
        >
          <option value="">Select Year</option>
          <option value="Second Year">2nd Year</option>
          <option value="Third Year">3rd Year</option>
          <option value="Fourth Year">4th Year</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Semester *</label>
        <select 
          className="input-class" 
          value={semester} 
          onChange={e => setSemester(e.target.value)}
        >
          <option value="">Select Semester</option>
          <option value="Semester 3">Semester 3</option>
          <option value="Semester 4">Semester 4</option>
          <option value="Semester 5">Semester 5</option>
          <option value="Semester 6">Semester 6</option>
          <option value="Semester 7">Semester 7</option>
          <option value="Semester 8">Semester 8</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Department *</label>
        <select 
          className="input-class" 
          value={department} 
          onChange={e => handleDeptChange(e.target.value)}
        >
          <option value="">Select Department</option>
          <option value="IT">Information Technology (IT)</option>
          <option value="DS">Data Science (DS)</option>
        </select>
      </div>

      <div className="space-y-2 lg:col-span-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Target Classes *</label>
          {filteredClasses.length > 0 && (
            <button 
              type="button"
              onClick={selectAllClasses} 
              className="text-xs font-semibold text-primary hover:underline"
            >
              {targetClasses.length === filteredClasses.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>
        {filteredClasses.length === 0 ? (
          <p className="text-sm text-muted-foreground italic p-3 bg-muted/30 rounded-lg border border-border">
            Select Academic Year and Department to view available classes.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {filteredClasses.map(cls => (
              <label 
                key={cls.id} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium ${
                  targetClasses.includes(cls.name) 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-border bg-card hover:border-primary/30 text-foreground'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={targetClasses.includes(cls.name)} 
                  onChange={() => toggleClass(cls.name)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                {cls.name}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CreationMethodCard({ title, icon, desc, active, onClick }: any) {
  return (
    <div 
       onClick={onClick}
       className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3 ${active ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'}`}
    >
       <div className={`p-3 rounded-full ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
         {icon}
       </div>
       <div>
         <h4 className="font-semibold text-foreground">{title}</h4>
         <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }: any) {
  return (
    <Card className="shadow-sm border-border overflow-hidden group">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${bg} ${color} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold text-foreground tracking-tight">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

// ==========================================
// STUDENT DASHBOARD
// ==========================================
function StudentQuizDashboard({ quizzes, attempts, user, workspaceContext }: any) {
  const [takingQuiz, setTakingQuiz] = useState<any>(null);
  const [viewingResult, setViewingResult] = useState<any>(null);

  if (takingQuiz) {
     return <QuizInterface quiz={takingQuiz} onFinish={() => setTakingQuiz(null)} />;
  }

  // Filter quizzes based on student class/eligibility (simplified)
  const myQuizzes = workspaceContext?.subjectId 
    ? quizzes.filter((q:any) => q.subjectId === workspaceContext.subjectId)
    : quizzes; 
  const myAttempts = attempts.filter((a:any) => a.studentId === user.id);
  
  const availableQuizzes = myQuizzes.filter((q:any) => q.status === 'Active' && !myAttempts.some((a:any) => a.quizId === q.id));


  const completedQuizzes = workspaceContext?.subjectId
    ? STATIC_COMPLETED_QUIZZES.filter((q:any) => q.subjectId === workspaceContext.subjectId)
    : STATIC_COMPLETED_QUIZZES;

  const totalQuizzes = availableQuizzes.length + completedQuizzes.length;
  const missedQuizzes = myQuizzes.filter((q:any) => q.status === 'Completed' && !myAttempts.some((a:any) => a.quizId === q.id)).length;
  
  const staticTotalPct = completedQuizzes.reduce((acc, curr) => acc + curr.attempt.percentage, 0);
  const avgScore = completedQuizzes.length > 0 ? (staticTotalPct / completedQuizzes.length).toFixed(1) + '%' : '0%';

  return (
    <motion.div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Quiz Dashboard</h1>
        <p className="text-muted-foreground mt-1">Realistic mock data generated for your performance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
         <StatCard title="Total Quizzes" value={totalQuizzes} icon={<LayoutDashboard size={20} />} color="text-blue-500" bg="bg-blue-500/10" />
         <StatCard title="Attempted" value={completedQuizzes.length} icon={<CheckCircle2 size={20} />} color="text-emerald-500" bg="bg-emerald-500/10" />
         <StatCard title="Pending" value={availableQuizzes.length} icon={<Clock size={20} />} color="text-amber-500" bg="bg-amber-500/10" />
         <StatCard title="Missed" value={missedQuizzes} icon={<AlertTriangle size={20} />} color="text-red-500" bg="bg-red-500/10" />
         <StatCard title="Avg Score" value={avgScore} icon={<TrendingUp size={20} />} color="text-purple-500" bg="bg-purple-500/10" />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">Pending Quizzes</h2>
        {availableQuizzes.length === 0 && <p className="text-muted-foreground italic">No pending quizzes available.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableQuizzes.map((quiz: any) => (
            <Card key={quiz.id} className="shadow-sm border-border hover:shadow-md transition-shadow group flex flex-col">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
                 <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Timer size={14}/> {quiz.duration}m</span>
                 </div>
                 <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">{quiz.title}</CardTitle>
                 <CardDescription>{mockData.subjects.find(s => s.id === quiz.subjectId)?.name}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex-1 flex flex-col">
                 <div className="space-y-2 text-sm flex-1">
                   <div className="flex justify-between"><span className="text-muted-foreground">Faculty:</span> <span className="font-medium">{quiz.facultyName}</span></div>
                   <div className="flex justify-between"><span className="text-muted-foreground">Total Marks:</span> <span className="font-medium">{quiz.totalMarks}</span></div>
                   <div className="flex justify-between"><span className="text-muted-foreground">Type:</span> <span className="font-medium">{quiz.type}</span></div>
                 </div>
                 <Button onClick={() => setTakingQuiz(quiz)} className="w-full mt-6 gap-2"><PlayCircle size={16} /> Start Quiz</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-border">
        <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">Completed Quizzes & Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedQuizzes.map((quiz: any) => {
            const isPassed = quiz.attempt.status === 'Passed';
            return (
              <Card key={quiz.id} className="shadow-sm border-border flex flex-col hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
                  <div className="flex justify-between items-start gap-2">
                    <Badge variant="outline" className={isPassed ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-bold' : 'bg-red-500/10 text-red-500 border-red-500/20 font-bold'}>
                      {isPassed ? '✓ Passed' : '✗ Failed'}
                    </Badge>
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-foreground">{quiz.attempt.score}</span>
                      <span className="text-sm text-muted-foreground">/{quiz.totalMarks}</span>
                    </div>
                  </div>
                  <CardTitle className="text-base mt-2 group-hover:text-primary transition-colors leading-snug">{quiz.title}</CardTitle>
                  <CardDescription className="text-xs">{quiz.subject}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col gap-1 text-xs">
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 flex-1">
                    <div className="flex flex-col"><span className="text-muted-foreground">Academic Year</span><span className="font-semibold text-foreground">{quiz.academicYear}</span></div>
                    <div className="flex flex-col"><span className="text-muted-foreground">Semester</span><span className="font-semibold text-foreground">{quiz.semester}</span></div>
                    <div className="flex flex-col"><span className="text-muted-foreground">Class</span><span className="font-semibold text-foreground">{quiz.className}</span></div>
                    <div className="flex flex-col"><span className="text-muted-foreground">Date Attempted</span><span className="font-semibold text-foreground">{new Date(quiz.attempt.submissionTime).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</span></div>
                    <div className="flex flex-col"><span className="text-muted-foreground">Percentage</span><span className={`font-bold ${isPassed ? 'text-emerald-600' : 'text-red-500'}`}>{quiz.attempt.percentage.toFixed(1)}%</span></div>
                    <div className="flex flex-col"><span className="text-muted-foreground">Rank in Class</span><span className="font-bold text-primary">#{quiz.attempt.rank}</span></div>
                    <div className="flex flex-col"><span className="text-muted-foreground">Time Taken</span><span className="font-semibold text-foreground">{quiz.attempt.timeTaken} min</span></div>
                    <div className="flex flex-col"><span className="text-muted-foreground">Attempt #</span><span className="font-semibold text-foreground">#{quiz.attempt.attemptNumber}</span></div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                    <div className="flex gap-1.5 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">{quiz.attempt.correctAnswers} ✓</span>
                      <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-medium">{quiz.attempt.incorrectAnswers} ✗</span>
                      <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{quiz.attempt.unattemptedQuestions} –</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-border">{quiz.attempt.grade}</Badge>
                  </div>
                  <Button variant="outline" className="w-full mt-3 gap-2 text-xs h-9 border-primary/30 hover:border-primary hover:bg-primary/5" onClick={() => setViewingResult(quiz)}>
                    <Eye size={14} /> View Full Result
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {viewingResult && (
           <StudentResultModal quiz={viewingResult} onClose={() => setViewingResult(null)} />
        )}
      </AnimatePresence>
      <style>{`
         .input-class {
            width: 100%;
            background-color: hsl(var(--background));
            border: 1px solid hsl(var(--border));
            border-radius: 0.375rem;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            outline: none;
         }
         .input-class:focus {
            box-shadow: 0 0 0 2px hsl(var(--primary) / 0.5);
         }
      `}</style>
    </motion.div>
  );
}

// ==========================================
// STUDENT RESULT MODAL
// ==========================================
function StudentResultModal({ quiz, onClose }: any) {
  const att = quiz.attempt;
  
  const accuracyData = [
    { name: 'Correct', value: att.correctAnswers, color: '#10B981' },
    { name: 'Incorrect', value: att.incorrectAnswers, color: '#EF4444' },
    { name: 'Unattempted', value: att.unattemptedQuestions, color: '#94A3B8' }
  ];

  const scoreData = [
    { name: 'Score', value: att.percentage, fill: att.percentage >= 50 ? '#10B981' : '#EF4444' }
  ];

  const trendData = [
    { name: 'Quiz 1', score: 65 }, { name: 'Quiz 2', score: 70 },
    { name: 'Quiz 3', score: 62 }, { name: 'Current', score: Math.round(att.percentage) }
  ];

  const subjectAvgData = [
    { name: 'My Score', score: Math.round(att.percentage) },
    { name: 'Class Avg', score: 68 },
    { name: 'Highest', score: 95 }
  ];

  const aiSummary = att.percentage > 80 
    ? "Excellent performance! You have a strong grasp of the core concepts. Focus on advanced topics for perfection." 
    : att.percentage > 50 
    ? "Good effort, but there are clear knowledge gaps. Review the incorrect answers carefully to strengthen your foundation."
    : "You need significant improvement in this subject. It is highly recommended to consult the faculty and revise the entire module.";

  return (
    <div className="fixed inset-0 z-[100] flex flex-col p-4 pt-20 sm:p-6 sm:pt-24 overflow-y-auto overflow-x-hidden pointer-events-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/95 backdrop-blur-md pointer-events-auto" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
        className="relative z-10 bg-card w-full max-w-6xl m-auto rounded-2xl shadow-2xl border border-border flex flex-col shrink-0"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted/30 shrink-0 rounded-t-2xl">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
               <h2 className="text-2xl font-bold text-foreground truncate">{quiz.title}</h2>
               <Badge variant="outline" className={`shrink-0 ${att.status === 'Passed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-bold' : 'bg-red-500/10 text-red-500 border-red-500/20 font-bold'}`}>
                 {att.status === 'Passed' ? '✓ Passed' : '✗ Failed'}
               </Badge>
               <Badge variant="outline" className="shrink-0 border-primary/30 text-primary font-bold">Grade: {att.grade}</Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {quiz.subject} • {quiz.academicYear} • {quiz.semester} • {quiz.className} • {new Date(att.submissionTime).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full shrink-0 hover:bg-destructive/10 hover:text-destructive text-muted-foreground"><X size={20} /></Button>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-6 bg-muted/5 rounded-b-2xl">
           <div className="max-w-5xl mx-auto space-y-8">
              
              {/* Top Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <Card className="border-border shadow-sm">
                   <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                      <p className="text-sm text-muted-foreground font-medium mb-1">Total Score</p>
                      <h3 className="text-3xl font-bold text-foreground">{att.score}<span className="text-lg text-muted-foreground">/{quiz.totalMarks}</span></h3>
                   </CardContent>
                 </Card>
                 <Card className="border-border shadow-sm">
                   <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                      <p className="text-sm text-muted-foreground font-medium mb-1">Class Rank</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-purple-500">#{att.rank}</span>
                      </div>
                   </CardContent>
                 </Card>
                 <Card className="border-border shadow-sm">
                   <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                      <p className="text-sm text-muted-foreground font-medium mb-1">Time Taken</p>
                      <h3 className="text-3xl font-bold text-emerald-500">{att.timeTaken}<span className="text-lg text-muted-foreground">m</span></h3>
                   </CardContent>
                 </Card>
                 <Card className="border-border shadow-sm">
                   <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                      <p className="text-sm text-muted-foreground font-medium mb-1">Accuracy</p>
                      <h3 className="text-3xl font-bold text-blue-500">{Math.round((att.correctAnswers / (att.correctAnswers + att.incorrectAnswers)) * 100 || 0)}%</h3>
                   </CardContent>
                 </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Circular Score */}
                 <Card className="shadow-sm border-border flex flex-col items-center justify-center p-6 lg:col-span-1">
                    <h3 className="font-semibold text-lg w-full text-left mb-2">Overall Percentage</h3>
                    <div className="w-full h-48 relative flex items-center justify-center">
                       <ResponsiveContainer width="100%" height="100%">
                         <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={scoreData} startAngle={90} endAngle={-270}>
                           <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                           <RadialBar background dataKey="value" cornerRadius={10} />
                         </RadialBarChart>
                       </ResponsiveContainer>
                       <div className="absolute inset-0 flex items-center justify-center flex-col">
                         <span className="text-4xl font-bold">{att.percentage.toFixed(0)}%</span>
                       </div>
                    </div>
                 </Card>

                 {/* Correct vs Incorrect */}
                 <Card className="shadow-sm border-border lg:col-span-1 flex flex-col">
                   <CardHeader className="pb-2"><CardTitle className="text-lg">Response Breakdown</CardTitle></CardHeader>
                   <CardContent className="h-48 flex items-center justify-center">
                     <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie data={accuracyData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                            {accuracyData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 8 }} />
                          <Legend verticalAlign="middle" align="right" layout="vertical" />
                        </RePieChart>
                     </ResponsiveContainer>
                   </CardContent>
                 </Card>

                 {/* Comparison Bar */}
                 <Card className="shadow-sm border-border lg:col-span-1 flex flex-col">
                   <CardHeader className="pb-2"><CardTitle className="text-lg">Subject Comparison</CardTitle></CardHeader>
                   <CardContent className="h-48">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={subjectAvgData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 8 }} />
                          <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={30}>
                            {subjectAvgData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#4F46E5' : '#94A3B8'} />
                            ))}
                          </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                   </CardContent>
                 </Card>
              </div>

              {/* Performance Trend and AI Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Trend Graph */}
                 <Card className="shadow-sm border-border flex flex-col">
                   <CardHeader><CardTitle className="text-lg">Your Performance Trend</CardTitle></CardHeader>
                   <CardContent className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis domain={[0, 100]} fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 8 }} />
                          <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981', strokeWidth: 2}} activeDot={{r: 6}} />
                        </LineChart>
                      </ResponsiveContainer>
                   </CardContent>
                 </Card>

                 {/* Premium AI Insights */}
                 <Card className="border-indigo-500/20 shadow-md bg-gradient-to-br from-indigo-500/5 to-purple-500/5 flex flex-col h-full">
                   <CardHeader className="border-b border-indigo-500/10 pb-3">
                     <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                       <BrainCircuit size={20} />
                       <CardTitle className="text-lg">AI Performance Analysis</CardTitle>
                     </div>
                   </CardHeader>
                   <CardContent className="p-5 flex-1 flex flex-col space-y-4">
                     <div className="p-4 bg-background/60 backdrop-blur-sm border border-indigo-500/10 rounded-xl text-sm leading-relaxed text-foreground font-medium">
                       {aiSummary}
                     </div>
                     <div className="grid grid-cols-2 gap-4 flex-1">
                        <div className="p-4 border border-emerald-500/20 rounded-xl bg-emerald-500/5 flex flex-col">
                           <p className="text-xs text-emerald-600 uppercase tracking-wider font-bold mb-2 flex items-center gap-1"><CheckCircle2 size={14}/> Strengths</p>
                           <p className="font-medium text-sm text-foreground/90">Time management and theoretical concepts.</p>
                        </div>
                        <div className="p-4 border border-amber-500/20 rounded-xl bg-amber-500/5 flex flex-col">
                           <p className="text-xs text-amber-600 uppercase tracking-wider font-bold mb-2 flex items-center gap-1"><AlertTriangle size={14}/> Weak Areas</p>
                           <p className="font-medium text-sm text-foreground/90">Numerical problem solving and edge cases.</p>
                        </div>
                     </div>
                     <div className="p-4 border border-blue-500/20 rounded-xl bg-blue-500/5">
                         <p className="text-xs text-blue-600 uppercase tracking-wider font-bold mb-2 flex items-center gap-1"><Target size={14}/> Suggestions for Improvement</p>
                         <p className="font-medium text-sm text-foreground/90">Review chapters 3 & 4. Practice 10 more numerical problems before the final exam.</p>
                     </div>
                   </CardContent>
                 </Card>
              </div>

               {/* Quiz Details Grid */}
               <Card className="shadow-sm border-border">
                 <CardHeader className="pb-2"><CardTitle className="text-lg">Quiz Details</CardTitle></CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                     <div className="flex flex-col"><span className="text-muted-foreground text-xs">Faculty</span><span className="font-semibold">{quiz.facultyName}</span></div>
                     <div className="flex flex-col"><span className="text-muted-foreground text-xs">Type</span><span className="font-semibold">{quiz.type}</span></div>
                     <div className="flex flex-col"><span className="text-muted-foreground text-xs">Difficulty</span>
                       <Badge variant="outline" className={`w-fit mt-0.5 text-xs ${quiz.difficulty === 'Hard' ? 'text-red-500 border-red-500/30' : quiz.difficulty === 'Medium' ? 'text-amber-500 border-amber-500/30' : 'text-emerald-500 border-emerald-500/30'}`}>{quiz.difficulty}</Badge>
                     </div>
                     <div className="flex flex-col"><span className="text-muted-foreground text-xs">Duration</span><span className="font-semibold">{quiz.duration} min</span></div>
                     <div className="flex flex-col"><span className="text-muted-foreground text-xs">Total Questions</span><span className="font-semibold">{quiz.numQuestions}</span></div>
                     <div className="flex flex-col"><span className="text-muted-foreground text-xs">Passing Marks</span><span className="font-semibold">{quiz.passingMarks}/{quiz.totalMarks}</span></div>
                     <div className="flex flex-col"><span className="text-muted-foreground text-xs">Attempt #</span><span className="font-semibold">#{att.attemptNumber}</span></div>
                     <div className="flex flex-col"><span className="text-muted-foreground text-xs">Grade Awarded</span><span className="font-bold text-primary text-lg">{att.grade}</span></div>
                   </div>
                 </CardContent>
               </Card>

               {/* Question Review */}
               <Card className="shadow-sm border-border">
                 <CardHeader className="pb-3 border-b border-border/50">
                   <div className="flex items-center justify-between flex-wrap gap-2">
                     <CardTitle className="text-lg flex items-center gap-2"><FileQuestion size={20} className="text-primary" /> Question Review</CardTitle>
                     <div className="flex gap-2 text-xs">
                       <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">✓ Correct: {att.correctAnswers}</span>
                       <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-500 font-medium">✗ Incorrect: {att.incorrectAnswers}</span>
                       <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">– Skipped: {att.unattemptedQuestions}</span>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent className="p-0">
                   <div className="divide-y divide-border/50">
                     {att.questions?.map((q: any, idx: number) => (
                       <div key={idx} className={`p-4 flex gap-4 items-start ${q.status === 'correct' ? 'bg-emerald-500/3' : q.status === 'incorrect' ? 'bg-red-500/3' : 'bg-muted/20'}`}>
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                           q.status === 'correct' ? 'bg-emerald-500/15 text-emerald-600' :
                           q.status === 'incorrect' ? 'bg-red-500/15 text-red-500' :
                           'bg-muted text-muted-foreground'
                         }`}>
                           {q.status === 'correct' ? <CheckCircle2 size={16} /> : q.status === 'incorrect' ? <XCircle size={16} /> : <span>–</span>}
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1.5">
                             <span className="text-xs font-bold text-muted-foreground">Q{q.no}</span>
                             <Badge variant="outline" className={`text-xs ${
                               q.status === 'correct' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' :
                               q.status === 'incorrect' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                               'bg-muted text-muted-foreground border-border'
                             }`}>
                               {q.status === 'correct' ? '✓ Correct' : q.status === 'incorrect' ? '✗ Incorrect' : '– Skipped'}
                             </Badge>
                           </div>
                           <p className="text-sm font-medium text-foreground mb-2">{q.question}</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                             <div className={`p-2 rounded-lg border ${
                               q.status === 'correct' ? 'bg-emerald-500/5 border-emerald-500/20' :
                               q.status === 'incorrect' ? 'bg-red-500/5 border-red-500/20' :
                               'bg-muted/30 border-border'
                             }`}>
                               <span className="text-muted-foreground block mb-0.5">Your Answer:</span>
                               <span className="font-medium text-foreground">{q.selected || '— Not Attempted —'}</span>
                             </div>
                             {q.status !== 'correct' && (
                               <div className="p-2 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
                                 <span className="text-muted-foreground block mb-0.5">Correct Answer:</span>
                                 <span className="font-medium text-emerald-600">{q.correct}</span>
                               </div>
                             )}
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>

           </div>
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// QUIZ INTERFACE (Mock Test view)
// ==========================================
function QuizInterface({ quiz, onFinish }: any) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60);
  const totalQ = quiz.numQuestions || 10;
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onFinish]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
       <header className="h-16 border-b border-border bg-card px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div>
            <h1 className="font-bold text-foreground text-lg">{quiz.title}</h1>
            <p className="text-xs text-muted-foreground">Subject: {mockData.subjects.find(s => s.id === quiz.subjectId)?.name}</p>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-sm font-bold ${timeLeft < 300 ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
               <Timer size={16} /> {formatTime(timeLeft)}
            </div>
            <Button variant="destructive" onClick={onFinish} size="sm" className="hidden sm:flex gap-2"><Send size={16}/> Submit Test</Button>
          </div>
       </header>

       <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
         <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-muted/10 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-6">
               <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold text-foreground">Question {currentQIndex + 1} <span className="text-muted-foreground text-sm font-normal">of {totalQ}</span></h2>
                 <Badge variant="outline" className="bg-background">Marks: {quiz.totalMarks/totalQ}</Badge>
               </div>
               
               <Card className="border-border shadow-sm">
                 <CardContent className="p-6 text-base sm:text-lg text-foreground leading-relaxed">
                   Which of the following is a key feature of the specified subject, ensuring reliable data flow and system architecture consistency across multiple environments?
                 </CardContent>
               </Card>

               <div className="space-y-3">
                 {['Encapsulation', 'Polymorphism', 'Data Abstraction', 'Inheritance'].map((opt, i) => {
                   const isSelected = selectedOptions[currentQIndex] === i;
                   return (
                     <div 
                       key={i} 
                       onClick={() => setSelectedOptions(prev => ({...prev, [currentQIndex]: i}))}
                       className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40'}`}
                     >
                       <div className="flex items-center gap-3">
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-muted-foreground/50'}`}>
                           {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                         </div>
                         <span className={isSelected ? 'font-medium text-foreground' : 'text-muted-foreground'}>{opt}</span>
                       </div>
                     </div>
                   )
                 })}
               </div>
            </div>
         </div>

         <div className="w-full md:w-80 bg-card border-l border-border flex flex-col shrink-0">
           <div className="p-4 border-b border-border bg-muted/20">
             <h3 className="font-semibold text-sm">Question Palette</h3>
           </div>
           <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
             <div className="grid grid-cols-5 gap-2">
               {Array.from({length: totalQ}).map((_, i) => {
                 const isAnswered = selectedOptions[i] !== undefined;
                 const isMarked = markedForReview[i];
                 const isCurrent = currentQIndex === i;
                 return (
                   <button 
                     key={i} 
                     onClick={() => setCurrentQIndex(i)}
                     className={`h-10 w-full rounded-md text-sm font-medium transition-colors relative flex justify-center items-center ${
                       isCurrent ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''
                     } ${
                       isMarked ? 'bg-amber-500/20 text-amber-600 border border-amber-500/30' : 
                       isAnswered ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30' : 
                       'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                     }`}
                   >
                     {i + 1}
                     {isMarked && <Flag size={10} className="absolute -top-1 -right-1 text-amber-500 fill-amber-500" />}
                   </button>
                 )
               })}
             </div>
             <div className="mt-8 space-y-3">
               <div className="flex items-center gap-2 text-xs text-muted-foreground"><div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/30" /> Answered</div>
               <div className="flex items-center gap-2 text-xs text-muted-foreground"><div className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/30" /> Marked for Review</div>
               <div className="flex items-center gap-2 text-xs text-muted-foreground"><div className="w-3 h-3 rounded-sm bg-muted border border-border" /> Not Visited / Answered</div>
             </div>
           </div>

           <div className="p-4 border-t border-border bg-card space-y-3">
             <div className="flex gap-2">
               <Button variant="outline" className="flex-1" onClick={() => setCurrentQIndex(p => Math.max(0, p - 1))} disabled={currentQIndex === 0}>Previous</Button>
               <Button variant="outline" className="flex-1" onClick={() => setCurrentQIndex(p => Math.min(totalQ - 1, p + 1))} disabled={currentQIndex === totalQ - 1}>Next</Button>
             </div>
             <Button 
                variant="secondary" 
                className="w-full gap-2" 
                onClick={() => setMarkedForReview(prev => ({...prev, [currentQIndex]: !prev[currentQIndex]}))}
             >
                <Flag size={16} className={markedForReview[currentQIndex] ? 'fill-foreground' : ''} />
                {markedForReview[currentQIndex] ? 'Unmark Review' : 'Mark for Review'}
             </Button>
             <Button variant="default" className="w-full sm:hidden mt-4 bg-primary" onClick={onFinish}>Submit Quiz</Button>
           </div>
         </div>
       </div>
    </div>
  )
}
