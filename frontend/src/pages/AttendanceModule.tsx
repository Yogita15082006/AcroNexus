import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import {
  CheckCircle, Calendar, TrendingUp, AlertTriangle,
  Clock, BookOpen, UserCheck, Calculator, Search, Filter, Lock,
  X, Plus, Edit, Trash2, Users, QrCode, Copy, ArrowLeft, BarChart3, Activity, PieChart, Info, Printer, FileText, FileSpreadsheet
} from 'lucide-react';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MarkAttendanceModal } from './FacultyActivityModule';

// Define schema
const attendanceSessionSchema = z.object({
  academicYear: z.string().min(1, "Required"),
  semester: z.string().min(1, "Required"),
  department: z.string().min(1, "Required"),
  className: z.string().min(1, "Required"),
  subject: z.string().min(1, "Required"),
  lectureType: z.string().min(1, "Required"),
  lectureNumber: z.string().min(1, "Required"),
  date: z.string().min(1, "Required"),
  startTime: z.string().min(1, "Required"),
  endTime: z.string().min(1, "Required"),
  duration: z.string().min(1, "Required"),
  attendanceCode: z.string().min(1, "Required"),
  requireVerification: z.boolean(),
  verificationQuestion: z.string().optional(),
  expectedAnswer: z.string().optional()
});

type AttendanceSessionValues = z.infer<typeof attendanceSessionSchema>;



const mockAdminHistoryTable = [
  // May 2026 Records
  { date: '2026-05-02', subject: 'Java Programming', academicYear: '3rd Year', semester: 'Semester 5', class: 'IT-1', scheduledTime: '10:00 AM - 11:00 AM', status: 'Taken', attendancePct: 88 },
  { date: '2026-05-03', subject: 'Operating Systems', academicYear: '2nd Year', semester: 'Semester 3', class: 'DS-1', scheduledTime: '11:00 AM - 12:00 PM', status: 'Taken', attendancePct: 91 },
  { date: '2026-05-05', subject: 'DBMS', academicYear: '3rd Year', semester: 'Semester 5', class: 'IT-2', scheduledTime: '09:00 AM - 10:00 AM', status: 'Taken', attendancePct: 84 },
  { date: '2026-05-08', subject: 'Computer Networks', academicYear: '4th Year', semester: 'Semester 7', class: 'DS-2', scheduledTime: '01:00 PM - 02:00 PM', status: 'Taken', attendancePct: 79 },
  { date: '2026-05-12', subject: 'Java Programming', academicYear: '3rd Year', semester: 'Semester 5', class: 'IT-2', scheduledTime: '10:00 AM - 11:00 AM', status: 'Missed', attendancePct: 0 },
  { date: '2026-05-15', subject: 'Operating Systems', academicYear: '2nd Year', semester: 'Semester 3', class: 'DS-2', scheduledTime: '02:00 PM - 03:00 PM', status: 'Taken', attendancePct: 93 },
  { date: '2026-05-18', subject: 'DBMS', academicYear: '3rd Year', semester: 'Semester 5', class: 'IT-1', scheduledTime: '09:00 AM - 10:00 AM', status: 'Taken', attendancePct: 85 },
  { date: '2026-05-22', subject: 'Computer Networks', academicYear: '4th Year', semester: 'Semester 7', class: 'IT-1', scheduledTime: '11:00 AM - 12:00 PM', status: 'Taken', attendancePct: 76 },
  { date: '2026-05-25', subject: 'Data Structures', academicYear: '2nd Year', semester: 'Semester 4', class: 'DS-1', scheduledTime: '10:00 AM - 11:00 AM', status: 'Taken', attendancePct: 95 },
  { date: '2026-05-28', subject: 'Software Engineering', academicYear: '4th Year', semester: 'Semester 8', class: 'IT-2', scheduledTime: '11:00 AM - 12:00 PM', status: 'Taken', attendancePct: 90 },

  // June 2026 Records
  { date: '2026-06-01', subject: 'Java Programming', academicYear: '3rd Year', semester: 'Semester 5', class: 'IT-1', scheduledTime: '10:00 AM - 11:00 AM', status: 'Taken', attendancePct: 87 },
  { date: '2026-06-03', subject: 'Operating Systems', academicYear: '2nd Year', semester: 'Semester 3', class: 'DS-1', scheduledTime: '11:00 AM - 12:00 PM', status: 'Taken', attendancePct: 92 },
  { date: '2026-06-05', subject: 'DBMS', academicYear: '3rd Year', semester: 'Semester 5', class: 'IT-2', scheduledTime: '09:00 AM - 10:00 AM', status: 'Taken', attendancePct: 86 },
  { date: '2026-06-08', subject: 'Computer Networks', academicYear: '4th Year', semester: 'Semester 7', class: 'DS-2', scheduledTime: '01:00 PM - 02:00 PM', status: 'Taken', attendancePct: 80 },
  { date: '2026-06-12', subject: 'Java Programming', academicYear: '3rd Year', semester: 'Semester 5', class: 'IT-2', scheduledTime: '10:00 AM - 11:00 AM', status: 'Taken', attendancePct: 89 },
  { date: '2026-06-15', subject: 'Operating Systems', academicYear: '2nd Year', semester: 'Semester 3', class: 'DS-2', scheduledTime: '02:00 PM - 03:00 PM', status: 'Missed', attendancePct: 0 },
  { date: '2026-06-18', subject: 'DBMS', academicYear: '3rd Year', semester: 'Semester 5', class: 'IT-1', scheduledTime: '09:00 AM - 10:00 AM', status: 'Taken', attendancePct: 83 },
  { date: '2026-06-22', subject: 'Computer Networks', academicYear: '4th Year', semester: 'Semester 7', class: 'IT-1', scheduledTime: '11:00 AM - 12:00 PM', status: 'Taken', attendancePct: 78 },
  { date: '2026-06-25', subject: 'Java Programming', academicYear: '3rd Year', semester: 'Semester 5', class: 'IT-1', scheduledTime: '10:00 AM - 11:00 AM', status: 'Taken', attendancePct: 90 },
  { date: '2026-06-26', subject: 'Operating Systems', academicYear: '2nd Year', semester: 'Semester 3', class: 'DS-1', scheduledTime: '11:00 AM - 12:00 PM', status: 'Taken', attendancePct: 94 },
  { date: '2026-06-28', subject: 'DBMS', academicYear: '3rd Year', semester: 'Semester 5', class: 'IT-2', scheduledTime: '09:00 AM - 10:00 AM', status: 'Taken', attendancePct: 88 },
  { date: '2026-06-30', subject: 'Computer Networks', academicYear: '4th Year', semester: 'Semester 7', class: 'DS-2', scheduledTime: '01:00 PM - 02:00 PM', status: 'Taken', attendancePct: 82 },

  // July 2026 Records
  { date: '2026-07-01', subject: 'Java Programming', academicYear: '3rd Year', semester: 'Semester 5', class: 'IT-1', scheduledTime: '10:00 AM - 11:00 AM', status: 'Taken', attendancePct: 85 },
  { date: '2026-07-02', subject: 'Operating Systems', academicYear: '2nd Year', semester: 'Semester 3', class: 'DS-2', scheduledTime: '02:00 PM - 03:00 PM', status: 'Taken', attendancePct: 92 },
  { date: '2026-07-03', subject: 'DBMS', academicYear: '3rd Year', semester: 'Semester 5', class: 'IT-2', scheduledTime: '09:00 AM - 10:00 AM', status: 'Missed', attendancePct: 0 },
  { date: '2026-07-04', subject: 'Computer Networks', academicYear: '4th Year', semester: 'Semester 7', class: 'IT-1', scheduledTime: '11:00 AM - 12:00 PM', status: 'Taken', attendancePct: 78 },
  { date: '2026-07-05', subject: 'Java Programming', academicYear: '3rd Year', semester: 'Semester 5', class: 'IT-2', scheduledTime: '10:00 AM - 11:00 AM', status: 'Taken', attendancePct: 88 },
  { date: '2026-07-06', subject: 'DBMS', academicYear: '3rd Year', semester: 'Semester 5', class: 'IT-1', scheduledTime: '09:00 AM - 10:00 AM', status: 'Taken', attendancePct: 81 },
  { date: '2026-07-07', subject: 'Operating Systems', academicYear: '2nd Year', semester: 'Semester 3', class: 'DS-1', scheduledTime: '11:00 AM - 12:00 PM', status: 'Taken', attendancePct: 95 },
  { date: '2026-07-08', subject: 'Computer Networks', academicYear: '4th Year', semester: 'Semester 7', class: 'DS-2', scheduledTime: '01:00 PM - 02:00 PM', status: 'Taken', attendancePct: 83 },
  { date: '2026-07-09', subject: 'Java Programming', academicYear: '3rd Year', semester: 'Semester 5', class: 'IT-1', scheduledTime: '10:00 AM - 11:00 AM', status: 'Taken', attendancePct: 91 },
  { date: '2026-07-10', subject: 'Operating Systems', academicYear: '2nd Year', semester: 'Semester 3', class: 'DS-1', scheduledTime: '11:00 AM - 12:00 PM', status: 'Taken', attendancePct: 96 }
];

const mockMonthlyData = [
  { month: 'Jan', attendance: 82 },
  { month: 'Feb', attendance: 86 },
  { month: 'Mar', attendance: 90 },
  { month: 'Apr', attendance: 85 },
  { month: 'May', attendance: 88 },
  { month: 'Jun', attendance: 85.5 },
];

const mockAdminSessions = [
  { id: '1', subject: 'Java Programming', faculty: 'Dr. Rahul Sharma', academicYear: '2025-26', department: 'Information Technology', class: 'IT-1', type: 'Lecture', lectureNumber: 'L-45', date: '2026-07-02', time: '10:00 AM - 11:00 AM', startTime: '10:00 AM', endTime: '11:00 AM', duration: '60 Mins', code: 'JAVA24IT', verificationQuestion: 'What is the output of 2+2 in Java?', expectedAnswer: '4', createdAt: '09:55 AM', status: 'Active', presentCount: 45, absentCount: 15, yetToSubmit: 5, totalStudents: 65, trend: [10, 25, 45, 60, 45, 20] },
  { id: '2', subject: 'DBMS', faculty: 'Prof. Neha Patel', academicYear: '2025-26', department: 'Information Technology', class: 'IT-2', type: 'Lab', lectureNumber: 'P-12', date: '2026-07-01', time: '02:00 PM - 04:00 PM', startTime: '02:00 PM', endTime: '04:00 PM', duration: '120 Mins', code: 'DBMSIT2', verificationQuestion: 'Primary key ensures what?', expectedAnswer: 'Uniqueness', createdAt: '01:50 PM', status: 'Closed', presentCount: 58, absentCount: 2, yetToSubmit: 0, totalStudents: 60, trend: [5, 15, 30, 40, 58, 55] },
  { id: '3', subject: 'Operating Systems', faculty: 'Prof. Amit Singh', academicYear: '2025-26', department: 'Data Science', class: 'DS-1', type: 'Lecture', lectureNumber: 'L-28', date: '2026-06-30', time: '09:00 AM - 10:00 AM', startTime: '09:00 AM', endTime: '10:00 AM', duration: '60 Mins', code: 'OS3RD25', verificationQuestion: 'Is Windows open source?', expectedAnswer: 'No', createdAt: '08:55 AM', status: 'Expired', presentCount: 50, absentCount: 10, yetToSubmit: 0, totalStudents: 60, trend: [20, 30, 40, 50, 50, 45] },
];

const mockSessionStudents = [
  { id: 'ST001', name: 'Arjun Kumar', enrollment: '0101IT221001', status: 'Present', time: '10:05 AM', verified: true, remarks: '-' },
  { id: 'ST002', name: 'Priya Sharma', enrollment: '0101IT221002', status: 'Present', time: '10:07 AM', verified: true, remarks: '-' },
  { id: 'ST003', name: 'Rohan Gupta', enrollment: '0101IT221003', status: 'Absent', time: '-', verified: false, remarks: 'Missed' },
  { id: 'ST004', name: 'Sneha Patel', enrollment: '0101IT221004', status: 'Present', time: '10:12 AM', verified: false, remarks: 'Late' },
  { id: 'ST005', name: 'Aman Singh', enrollment: '0101IT221005', status: 'Present', time: '10:01 AM', verified: true, remarks: '-' },
];

const mockSubjectAttendance = [
  { id: 'S1', name: 'Java Programming', faculty: 'Dr. Rahul Sharma', attended: 18, total: 22 },
  { id: 'S2', name: 'Data Structures', faculty: 'Prof. Vikram Rathore', attended: 20, total: 22 },
  { id: 'S3', name: 'Operating Systems', faculty: 'Prof. Amit Singh', attended: 15, total: 20 },
  { id: 'S4', name: 'DBMS', faculty: 'Prof. Neha Patel', attended: 19, total: 22 },
  { id: 'S5', name: 'Computer Networks', faculty: 'Prof. Sanjay Kumar', attended: 17, total: 21 },
  { id: 'S6', name: 'Software Engineering', faculty: 'Dr. Anjali Gupta', attended: 21, total: 22 },
];

const mockHistory = [
  { date: '2026-07-02', subject: 'Java Programming', faculty: 'Dr. Rahul Sharma', type: 'Lecture', status: 'Present', method: 'App Code', time: '10:05 AM' },
  { date: '2026-07-01', subject: 'Operating Systems', faculty: 'Prof. Amit Singh', type: 'Lecture', status: 'Absent', method: '-', time: '-' },
  { date: '2026-07-01', subject: 'Data Structures', faculty: 'Prof. Vikram Rathore', type: 'Lab', status: 'Present', method: 'App Code', time: '11:32 AM' },
  { date: '2026-06-30', subject: 'DBMS', faculty: 'Prof. Neha Patel', type: 'Lecture', status: 'Present', method: 'App Code', time: '09:15 AM' },
  { date: '2026-06-30', subject: 'Computer Networks', faculty: 'Prof. Sanjay Kumar', type: 'Lecture', status: 'Present', method: 'App Code', time: '12:05 PM' },
];

const getStatusBadge = (percentage: number) => {
  if (percentage >= 80) return <Badge variant="active">Safe</Badge>;
  if (percentage >= 75) return <Badge variant="pending">Warning</Badge>;
  return <Badge variant="rejected">Critical</Badge>;
};

const getProgressBarColor = (percentage: number) => {
  if (percentage >= 80) return 'bg-emerald-500';
  if (percentage >= 75) return 'bg-amber-500';
  return 'bg-rose-500';
};

const SubjectAttendanceDetails = ({ subject, onBack }: { subject: any, onBack: () => void }) => {
  const percentage = (subject.attended / subject.total) * 100;
  
  // mock chart data
  const trendData = [
    { date: 'Jun 1', pct: 70 },
    { date: 'Jun 8', pct: 75 },
    { date: 'Jun 15', pct: 72 },
    { date: 'Jun 22', pct: 80 },
    { date: 'Jun 29', pct: 86.4 },
  ];

  const subjectHistory = [
    { date: '2026-07-02', day: 'Thursday', lec: 'L-12', type: 'Theory', status: 'Present', time: '10:05 AM', code: 'JAVA24IT', verified: true, remarks: '-' },
    { date: '2026-06-30', day: 'Tuesday', lec: 'L-11', type: 'Theory', status: 'Present', time: '10:02 AM', code: 'JAVA24IT', verified: true, remarks: '-' },
    { date: '2026-06-25', day: 'Thursday', lec: 'L-10', type: 'Theory', status: 'Absent', time: '-', code: '-', verified: false, remarks: 'Missed' },
    { date: '2026-06-23', day: 'Tuesday', lec: 'L-9', type: 'Lab', status: 'Present', time: '02:15 PM', code: 'JAVALAB', verified: true, remarks: 'Late Submission' },
    { date: '2026-06-18', day: 'Thursday', lec: 'L-8', type: 'Theory', status: 'Present', time: '10:04 AM', code: 'JAVA24IT', verified: true, remarks: '-' },
    { date: '2026-06-16', day: 'Tuesday', lec: 'L-7', type: 'Theory', status: 'Present', time: '10:00 AM', code: 'JAVA24IT', verified: true, remarks: '-' },
    { date: '2026-06-11', day: 'Thursday', lec: 'L-6', type: 'Theory', status: 'Present', time: '10:06 AM', code: 'JAVA24IT', verified: true, remarks: '-' },
  ];

  return (
    <motion.div
      key="subject-details"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-card p-4 rounded-xl border border-border/50 shadow-sm sticky top-0 z-10 backdrop-blur-md bg-card/90 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack} className="rounded-full shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{subject.name}</h2>
            <p className="text-sm font-medium text-muted-foreground">{subject.faculty} • 3rd Year • IT-1</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(percentage)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
             <CardHeader className="border-b border-border/50 bg-muted/20 px-5 py-4 flex flex-row items-center justify-between">
               <CardTitle className="text-base font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary"/> Attendance History</CardTitle>
               <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="h-8 gap-2 text-xs"><Filter size={12}/> Filter</Button>
                 <Button variant="outline" size="sm" className="h-8 gap-2 text-xs"><Search size={12}/> Search</Button>
               </div>
             </CardHeader>
             <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <Table>
                   <TableHeader className="bg-muted/5">
                     <TableRow className="border-b border-border/50 hover:bg-transparent">
                       <TableHead className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Date & Day</TableHead>
                       <TableHead className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Lecture</TableHead>
                       <TableHead className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Faculty</TableHead>
                       <TableHead className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Status</TableHead>
                       <TableHead className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Time / Code</TableHead>
                       <TableHead className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Verification</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {subjectHistory.map((h, i) => (
                       <TableRow key={i} className="hover:bg-muted/30 transition-colors border-b border-border/50">
                         <TableCell className="py-3">
                           <div className="flex flex-col">
                             <span className="font-semibold text-sm">{h.date}</span>
                             <span className="text-[11px] text-muted-foreground mt-0.5">{h.day}</span>
                           </div>
                         </TableCell>
                         <TableCell>
                           <div className="flex flex-col">
                             <span className="font-semibold text-sm">{h.lec}</span>
                             <span className="text-[11px] text-muted-foreground mt-0.5">{h.type}</span>
                           </div>
                         </TableCell>
                         <TableCell>
                           <span className="text-sm font-medium">{subject.faculty}</span>
                         </TableCell>
                         <TableCell>
                           <Badge variant={h.status === 'Present' ? 'active' : 'rejected'} className="text-[10px] px-2 py-0.5">{h.status}</Badge>
                         </TableCell>
                         <TableCell>
                           <div className="flex flex-col">
                             <span className="font-mono text-sm font-medium">{h.time}</span>
                             <span className="text-[11px] text-muted-foreground font-mono mt-0.5">{h.code}</span>
                           </div>
                         </TableCell>
                         <TableCell>
                           {h.verified ? (
                              <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10 text-[10px]">Verified</Badge>
                           ) : (
                              <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/10 text-[10px]">Unverified</Badge>
                           )}
                           {h.remarks !== '-' && (
                             <p className="text-[10px] text-muted-foreground mt-1">{h.remarks}</p>
                           )}
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </div>
             </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
             <CardHeader className="border-b border-border/50 bg-muted/20 px-5 py-4">
               <CardTitle className="text-base font-semibold flex items-center gap-2"><PieChart className="w-4 h-4 text-primary"/> Overview</CardTitle>
             </CardHeader>
             <CardContent className="p-5">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-4xl font-extrabold tracking-tight">{percentage.toFixed(1)}%</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Overall Attendance</p>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden mt-3 shadow-inner">
                  <div className={`h-full ${getProgressBarColor(percentage)} rounded-full`} style={{ width: `${percentage}%` }}></div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border/50">
                   <div className="bg-muted/30 p-3 rounded-lg border border-border/50 text-center">
                     <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Conducted</p>
                     <p className="text-xl font-black text-foreground">{subject.total}</p>
                   </div>
                   <div className="bg-muted/30 p-3 rounded-lg border border-border/50 text-center">
                     <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Attended</p>
                     <p className="text-xl font-black text-emerald-500">{subject.attended}</p>
                   </div>
                   <div className="bg-muted/30 p-3 rounded-lg border border-border/50 text-center">
                     <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Missed</p>
                     <p className="text-xl font-black text-rose-500">{subject.total - subject.attended}</p>
                   </div>
                </div>
             </CardContent>
          </Card>
          
          <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
             <CardHeader className="border-b border-border/50 bg-muted/20 px-5 py-4">
               <CardTitle className="text-base font-semibold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary"/> Attendance Trend</CardTitle>
             </CardHeader>
             <CardContent className="p-5">
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPct" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.7 }} />
                      <YAxis domain={[0, 100]} hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'hsl(var(--card))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="pct" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPct)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
             <CardHeader className="border-b border-border/50 bg-muted/20 px-5 py-4">
               <CardTitle className="text-base font-semibold flex items-center gap-2"><Calculator className="w-4 h-4 text-primary"/> Analytics</CardTitle>
             </CardHeader>
             <CardContent className="p-5 space-y-3">
                <div className="p-3 bg-muted/30 rounded-lg border border-border/50 flex justify-between items-center transition-colors hover:bg-muted/50">
                  <span className="text-sm font-medium">To reach 75%</span>
                  <span className="text-sm font-bold text-emerald-500">Safe</span>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg border border-border/50 flex justify-between items-center transition-colors hover:bg-muted/50">
                  <span className="text-sm font-medium">To reach 90%</span>
                  <span className="text-sm font-bold text-indigo-500">Attend next 6</span>
                </div>
                <div className="p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 flex justify-between items-center text-rose-700 dark:text-rose-400">
                  <span className="text-sm font-semibold">Max Miss Allowed</span>
                  <span className="text-sm font-black">3 Classes</span>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

const AdminSessionDetails = ({ session, onBack }: { session: any, onBack: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredStudents = mockSessionStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.enrollment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      key="admin-session-details"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{session.subject}</h1>
            <p className="text-muted-foreground">{session.class} • {session.date} • {session.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {session.status === 'Active' && (
            <Button variant="destructive" className="gap-2 shadow-sm">
              <X className="w-4 h-4" /> Close Session
            </Button>
          )}
          <Button variant="outline" className="gap-2 bg-card">
            <Edit className="w-4 h-4" /> Edit
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground shadow-md hover:bg-primary/90">
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/50 bg-card shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Students</p>
              <p className="text-2xl font-black">{session.totalStudents}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 bg-card shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Present</p>
              <p className="text-2xl font-black">{session.presentCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 bg-card shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Absent</p>
              <p className="text-2xl font-black">{session.absentCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 bg-card shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Attendance %</p>
              <p className="text-2xl font-black">{Math.round((session.presentCount / session.totalStudents) * 100)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Trend */}
        <div className="space-y-6">
          <Card className="border border-border/50 bg-card shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20 px-5 py-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2"><Info className="w-4 h-4 text-primary" /> Session Info</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Faculty</p>
                   <p className="text-sm font-medium">{session.faculty}</p>
                 </div>
                 <div>
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Academic Year</p>
                   <p className="text-sm font-medium">{session.academicYear}</p>
                 </div>
                 <div>
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Department</p>
                   <p className="text-sm font-medium">{session.department}</p>
                 </div>
                 <div>
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Lecture</p>
                   <p className="text-sm font-medium">{session.type} ({session.lectureNumber})</p>
                 </div>
                 <div>
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Duration</p>
                   <p className="text-sm font-medium">{session.startTime} - {session.endTime} ({session.duration})</p>
                 </div>
                 <div>
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Created At</p>
                   <p className="text-sm font-medium">{session.createdAt}</p>
                 </div>
               </div>

               <div className="pt-4 border-t border-border/50 space-y-4">
                 <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Attendance Code</p>
                      <p className="text-lg font-black tracking-widest text-primary">{session.code}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Copy className="w-4 h-4" />
                    </Button>
                 </div>
                 
                 {session.verificationQuestion && (
                   <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/20">
                     <p className="text-[10px] text-indigo-500 uppercase font-bold tracking-wider mb-2">Verification Question</p>
                     <p className="text-sm font-medium mb-1">Q: {session.verificationQuestion}</p>
                     <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">A: {session.expectedAnswer}</p>
                   </div>
                 )}
               </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 bg-card shadow-sm">
             <CardHeader className="border-b border-border/50 bg-muted/20 px-5 py-4">
               <CardTitle className="text-base font-semibold flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Submission Trend</CardTitle>
             </CardHeader>
             <CardContent className="p-5">
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={session.trend.map((val: any, idx: any) => ({ time: `+${idx*10}m`, count: val }))} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.7 }} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'hsl(var(--card))' }} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Right Column: Students Table */}
        <div className="lg:col-span-2">
          <Card className="border border-border/50 bg-card shadow-sm h-full">
            <CardHeader className="border-b border-border/50 bg-muted/20 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Student List</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search students..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 w-[200px] bg-background text-sm"
                  />
                </div>
                <div className="flex items-center p-1 bg-muted rounded-md border border-border/50">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-7 px-3 text-xs rounded-sm ${statusFilter === 'All' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                    onClick={() => setStatusFilter('All')}
                  >
                    All
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-7 px-3 text-xs rounded-sm ${statusFilter === 'Present' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                    onClick={() => setStatusFilter('Present')}
                  >
                    Present
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-7 px-3 text-xs rounded-sm ${statusFilter === 'Absent' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                    onClick={() => setStatusFilter('Absent')}
                  >
                    Absent
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <Table>
                   <TableHeader className="bg-muted/10">
                     <TableRow className="hover:bg-transparent border-b-border/50">
                       <TableHead className="font-semibold h-10 text-xs">Roll No</TableHead>
                       <TableHead className="font-semibold h-10 text-xs">Name</TableHead>
                       <TableHead className="font-semibold h-10 text-xs">Status</TableHead>
                       <TableHead className="font-semibold h-10 text-xs">Time</TableHead>
                       <TableHead className="font-semibold h-10 text-xs text-center">Verified</TableHead>
                       <TableHead className="font-semibold h-10 text-xs">Remarks</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {filteredStudents.length === 0 ? (
                       <TableRow>
                         <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                           No students found matching your criteria.
                         </TableCell>
                       </TableRow>
                     ) : (
                       filteredStudents.map((student, idx) => (
                         <TableRow key={idx} className="hover:bg-muted/30 border-b-border/50 transition-colors">
                           <TableCell className="font-medium text-xs">{student.enrollment}</TableCell>
                           <TableCell className="text-sm font-semibold">{student.name}</TableCell>
                           <TableCell>
                             {student.status === 'Present' ? (
                               <Badge variant="active" className="text-[10px] px-1.5 py-0 rounded-sm">Present</Badge>
                             ) : (
                               <Badge variant="rejected" className="text-[10px] px-1.5 py-0 rounded-sm">Absent</Badge>
                             )}
                           </TableCell>
                           <TableCell className="text-xs text-muted-foreground">{student.time}</TableCell>
                           <TableCell className="text-center">
                             {student.verified ? (
                               <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                             ) : (
                               student.status === 'Present' ? (
                                 <AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" />
                               ) : (
                                 <span className="text-muted-foreground">-</span>
                               )
                             )}
                           </TableCell>
                           <TableCell className="text-xs text-muted-foreground">{student.remarks}</TableCell>
                         </TableRow>
                       ))
                     )}
                   </TableBody>
                 </Table>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

const MultiSelectDropdown = ({ label, options, selected, onChange }: { label: string, options: string[], selected: string[], onChange: (val: string[]) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const handleOpen = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 180),
        zIndex: 9999,
      });
    }
    setIsOpen(!isOpen);
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  return (
    <div className="relative" ref={triggerRef}>
      <div 
        className="flex items-center justify-between px-3 py-2 border border-border/50 rounded-md bg-background text-sm cursor-pointer min-w-[140px] hover:border-primary/50 transition-colors"
        onClick={handleOpen}
      >
        <span className="truncate mr-2 font-medium">{selected.length > 0 ? `${selected.length} selected` : label}</span>
        <span className={`text-muted-foreground text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </div>
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="bg-card border border-border/50 shadow-2xl rounded-md p-2 flex flex-col gap-1 max-h-[220px] overflow-y-auto"
        >
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50 rounded cursor-pointer text-sm transition-colors">
              <input 
                type="checkbox" 
                checked={selected.includes(opt)}
                onChange={(e) => {
                  if (e.target.checked) onChange([...selected, opt]);
                  else onChange(selected.filter(x => x !== opt));
                }}
                className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              {opt}
            </label>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

const AdminTeachingHistory = () => {
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const [filteredData, setFilteredData] = useState(mockAdminHistoryTable);

  const generateDynamicMockData = (
    count: number,
    years: string[],
    sems: string[],
    clsList: string[],
    subList: string[],
    from: string,
    to: string
  ) => {
    const yearsToUse = years.length > 0 ? years : ['2nd Year', '3rd Year', '4th Year'];
    const semsToUse = sems.length > 0 ? sems : ['Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
    const classesToUse = clsList.length > 0 ? clsList : ['IT-1', 'IT-2', 'DS-1', 'DS-2'];
    const subjectsToUse = subList.length > 0 ? subList : ['Java Programming', 'Operating Systems', 'DBMS', 'Computer Networks'];
    
    const start = from ? new Date(from) : new Date('2026-05-01');
    const end = to ? new Date(to) : new Date('2026-07-10');
    
    const timeSlots = [
      '09:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '01:00 PM - 02:00 PM',
      '02:00 PM - 03:00 PM',
      '03:00 PM - 04:00 PM'
    ];

    const records: typeof mockAdminHistoryTable = [];
    const timeDiff = end.getTime() - start.getTime();
    
    for (let i = 0; i < count; i++) {
      const randomTime = start.getTime() + Math.random() * (timeDiff || 86400000 * 30);
      const randomDate = new Date(randomTime);
      const day = randomDate.getDay();
      if (day === 0) randomDate.setDate(randomDate.getDate() + 1);
      else if (day === 6) randomDate.setDate(randomDate.getDate() - 1);
      
      const dateStr = randomDate.toISOString().split('T')[0];
      const subject = subjectsToUse[Math.floor(Math.random() * subjectsToUse.length)];
      const academicYear = yearsToUse[Math.floor(Math.random() * yearsToUse.length)];
      const semester = semsToUse[Math.floor(Math.random() * semsToUse.length)];
      const cls = classesToUse[Math.floor(Math.random() * classesToUse.length)];
      const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      
      const status = Math.random() > 0.08 ? 'Taken' : 'Missed';
      const attendancePct = status === 'Taken' ? Math.floor(Math.random() * 20) + 80 : 0;
      
      records.push({
        date: dateStr,
        subject,
        academicYear,
        semester,
        class: cls,
        scheduledTime: timeSlot,
        status,
        attendancePct
      });
    }
    
    return records;
  };

  const handleApplyFilters = () => {
    let result = [...mockAdminHistoryTable];
    if (academicYears.length > 0) {
      result = result.filter(item => academicYears.includes(item.academicYear));
    }
    if (semesters.length > 0) {
      result = result.filter(item => semesters.includes(item.semester));
    }
    if (classes.length > 0) {
      result = result.filter(item => classes.includes(item.class));
    }
    if (subjects.length > 0) {
      result = result.filter(item => subjects.includes(item.subject));
    }
    if (fromDate) {
      result = result.filter(item => new Date(item.date) >= new Date(fromDate));
    }
    if (toDate) {
      result = result.filter(item => new Date(item.date) <= new Date(toDate));
    }

    const hasFilters = academicYears.length > 0 || semesters.length > 0 || classes.length > 0 || subjects.length > 0 || fromDate || toDate;

    if (hasFilters && result.length < 15) {
      const needed = 15 - result.length;
      const generated = generateDynamicMockData(needed, academicYears, semesters, classes, subjects, fromDate, toDate);
      result = [...result, ...generated].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    setFilteredData(result);
  };

  const handleResetFilters = () => {
    setAcademicYears([]);
    setSemesters([]);
    setClasses([]);
    setSubjects([]);
    setFromDate('');
    setToDate('');
    setFilteredData(mockAdminHistoryTable);
  };

  const scheduled = filteredData.length;
  const taken = filteredData.filter(d => d.status === 'Taken').length;
  const missed = filteredData.filter(d => d.status === 'Missed').length;
  
  const totalTakenPct = filteredData.filter(d => d.status === 'Taken').reduce((acc, curr) => acc + (curr.attendancePct || 0), 0);
  const avgAttendance = taken > 0 ? (totalTakenPct / taken).toFixed(1) : '0.0';
  const teachingHours = taken; // Assuming 1 hour per class

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyStats = months.map(m => ({ month: m, totalPct: 0, count: 0 }));
  
  filteredData.forEach(row => {
    if (row.status === 'Taken') {
       const dateObj = new Date(row.date);
       const m = dateObj.getMonth();
       if (!isNaN(m)) {
          monthlyStats[m].totalPct += (row.attendancePct || 0);
          monthlyStats[m].count += 1;
       }
    }
  });

  const chartData = monthlyStats
     .filter(m => m.count > 0)
     .map(m => ({ month: m.month, attendance: Number((m.totalPct / m.count).toFixed(1)) }));

  const displayChartData = chartData.length > 0 ? chartData : mockMonthlyData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Filters Section */}
      <Card className="border-border/50 shadow-sm bg-card overflow-visible">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
          <CardTitle className="text-base font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              Advanced Filters
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-2 bg-background" onClick={handleResetFilters}>Reset</Button>
              <Button size="sm" className="h-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleApplyFilters}>Apply Filters</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-visible">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Academic Year</label>
              <MultiSelectDropdown 
                label="Select Year" 
                options={['2nd Year', '3rd Year', '4th Year']}
                selected={academicYears}
                onChange={setAcademicYears}
              />
            </div>
            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Semester</label>
              <MultiSelectDropdown 
                label="Select Sem" 
                options={['Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8']}
                selected={semesters}
                onChange={setSemesters}
              />
            </div>
            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class</label>
              <MultiSelectDropdown 
                label="Select Class" 
                options={['IT-1', 'IT-2', 'DS-1', 'DS-2']}
                selected={classes}
                onChange={setClasses}
              />
            </div>
            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</label>
              <MultiSelectDropdown 
                label="Select Subject" 
                options={['Java Programming', 'Operating Systems', 'DBMS', 'Computer Networks']}
                selected={subjects}
                onChange={setSubjects}
              />
            </div>
            <div className="space-y-1.5 lg:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" className="h-[38px] text-xs bg-background" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                <Input type="date" className="h-[38px] text-xs bg-background" value={toDate} onChange={e => setToDate(e.target.value)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"><Calendar className="w-5 h-5"/></div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold tracking-tight text-foreground">{scheduled}</h3>
              <p className="text-xs font-bold mt-1 text-muted-foreground uppercase tracking-wider">Scheduled Classes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><CheckCircle className="w-5 h-5"/></div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold tracking-tight text-foreground">{taken} <span className="text-lg font-bold text-muted-foreground">/</span> <span className="text-rose-500">{missed}</span></h3>
              <p className="text-xs font-bold mt-1 text-muted-foreground uppercase tracking-wider">Taken / Missed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Users className="w-5 h-5"/></div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold tracking-tight text-foreground">{avgAttendance}%</h3>
              <p className="text-xs font-bold mt-1 text-muted-foreground uppercase tracking-wider">Avg. Student Attendance</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><Clock className="w-5 h-5"/></div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold tracking-tight text-foreground">{teachingHours} <span className="text-lg font-bold text-muted-foreground">hrs</span></h3>
              <p className="text-xs font-bold mt-1 text-muted-foreground uppercase tracking-wider">Total Teaching Hours</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm bg-card">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted/10 border-b border-border/50 px-5 py-4 gap-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary"/> Class History</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs gap-2"><FileText className="w-3.5 h-3.5 text-rose-500"/> PDF</Button>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-2"><FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500"/> CSV</Button>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-2"><Printer className="w-3.5 h-3.5 text-blue-500"/> Print</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-[400px]">
                <Table>
                  <TableHeader className="bg-muted/5 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                    <TableRow className="border-b border-border/50 hover:bg-transparent">
                      <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">Date & Time</TableHead>
                      <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">Subject</TableHead>
                      <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">Batch</TableHead>
                      <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? filteredData.map((row, i) => (
                      <TableRow key={i} className="hover:bg-muted/30 border-b border-border/50 transition-colors">
                        <TableCell className="py-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">{row.date}</span>
                            <span className="text-xs text-muted-foreground mt-0.5">{row.scheduledTime}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-sm">{row.subject}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{row.class}</span>
                            <span className="text-[11px] text-muted-foreground mt-0.5">{row.academicYear} • {row.semester}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={row.status === 'Taken' ? 'active' : 'rejected'} className="text-[10px] px-2 py-0.5">{row.status}</Badge>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No teaching history matches the applied filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm bg-card">
            <CardHeader className="bg-muted/10 border-b border-border/50 px-5 py-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary"/> Monthly Attendance %</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.7 }} />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'hsl(var(--card))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} fill="url(#colorMonthly)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

const CreateSessionModal = ({ isOpen, onClose, onSubmit, register, handleSubmit, errors, watch, setValue, handleGenerateCode, codeValue }: any) => {
  if (!isOpen) return null;
  const requireVerification = watch('requireVerification');

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }} 
        className="relative w-full max-w-2xl bg-card border border-border/50 shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
          <h2 className="text-lg font-bold">Create New Session</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="create-session-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Academic Year</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" {...register('academicYear')}>
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
                {errors.academicYear && <p className="text-xs text-rose-500">{errors.academicYear.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Semester</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" {...register('semester')}>
                  <option value="">Select Semester</option>
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 4">Semester 4</option>
                  <option value="Semester 5">Semester 5</option>
                  <option value="Semester 6">Semester 6</option>
                  <option value="Semester 7">Semester 7</option>
                  <option value="Semester 8">Semester 8</option>
                </select>
                {errors.semester && <p className="text-xs text-rose-500">{errors.semester.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Department</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" {...register('department')}>
                  <option value="">Select Dept</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Data Science">Data Science</option>
                </select>
                {errors.department && <p className="text-xs text-rose-500">{errors.department.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Class Name</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" {...register('className')}>
                  <option value="">Select Class</option>
                  <option value="IT-1">IT-1</option>
                  <option value="IT-2">IT-2</option>
                  <option value="DS-1">DS-1</option>
                  <option value="DS-2">DS-2</option>
                </select>
                {errors.className && <p className="text-xs text-rose-500">{errors.className.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Subject</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" {...register('subject')}>
                  <option value="">Select Subject</option>
                  <option value="Java Programming">Java Programming</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="DBMS">DBMS</option>
                  <option value="Computer Networks">Computer Networks</option>
                </select>
                {errors.subject && <p className="text-xs text-rose-500">{errors.subject.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Lecture Type</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" {...register('lectureType')}>
                  <option value="">Select Type</option>
                  <option value="Lecture">Lecture</option>
                  <option value="Lab">Lab</option>
                  <option value="Tutorial">Tutorial</option>
                </select>
                {errors.lectureType && <p className="text-xs text-rose-500">{errors.lectureType.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Lecture Number</label>
                <Input placeholder="e.g. L-45" {...register('lectureNumber')} />
                {errors.lectureNumber && <p className="text-xs text-rose-500">{errors.lectureNumber.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Date</label>
                <Input type="date" {...register('date')} />
                {errors.date && <p className="text-xs text-rose-500">{errors.date.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Start Time</label>
                <Input type="time" {...register('startTime')} />
                {errors.startTime && <p className="text-xs text-rose-500">{errors.startTime.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">End Time</label>
                <Input type="time" {...register('endTime')} />
                {errors.endTime && <p className="text-xs text-rose-500">{errors.endTime.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Duration</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" {...register('duration')}>
                  <option value="">Select Duration</option>
                  <option value="45 Mins">45 Mins</option>
                  <option value="60 Mins">60 Mins</option>
                  <option value="90 Mins">90 Mins</option>
                  <option value="120 Mins">120 Mins</option>
                </select>
                {errors.duration && <p className="text-xs text-rose-500">{errors.duration.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center justify-between">
                  Attendance Code
                  <Button type="button" variant="ghost" size="sm" className="h-5 px-2 text-[10px]" onClick={handleGenerateCode}>Generate</Button>
                </label>
                <Input placeholder="e.g. JAVA24IT" {...register('attendanceCode')} value={codeValue || ''} onChange={(e: any) => setValue('attendanceCode', e.target.value)} />
                {errors.attendanceCode && <p className="text-xs text-rose-500">{errors.attendanceCode.message}</p>}
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4" {...register('requireVerification')} />
                <span className="text-sm font-medium">Require Security Verification</span>
              </label>
              
              {requireVerification && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Verification Question</label>
                    <Input placeholder="e.g. What is the output of 2+2?" {...register('verificationQuestion')} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Expected Answer</label>
                    <Input placeholder="e.g. 4" {...register('expectedAnswer')} />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="p-4 border-t border-border/50 bg-muted/20 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="create-session-form" className="bg-primary text-primary-foreground hover:bg-primary/90">Create Session</Button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export const AttendanceModule = () => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'calculator' | 'teachingHistory'>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  
  // Admin Session State
  const [adminSessions, setAdminSessions] = useState(mockAdminSessions);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<AttendanceSessionValues>({
    resolver: zodResolver(attendanceSessionSchema),
    defaultValues: {
      requireVerification: false
    }
  });

  const requireVerification = watch('requireVerification');

  const handleGenerateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue('attendanceCode', result);
  };

  const onSubmit = (data: AttendanceSessionValues) => {
    const newSession = {
      id: Math.random().toString(36).substr(2, 9),
      subject: data.subject,
      faculty: 'Current User',
      academicYear: data.academicYear,
      department: data.department,
      class: data.className,
      type: data.lectureType,
      lectureNumber: data.lectureNumber,
      date: data.date,
      time: `${data.startTime} - ${data.endTime}`,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      code: data.attendanceCode,
      verificationQuestion: data.verificationQuestion || '',
      expectedAnswer: data.expectedAnswer || '',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Active',
      presentCount: 0,
      absentCount: 60, // Mock total
      yetToSubmit: 60,
      totalStudents: 60,
      trend: []
    };
    setAdminSessions([newSession, ...adminSessions]);
    setShowCreateModal(false);
    reset();
  };
  
  // Mark Attendance State
  const [activeSession, setActiveSession] = useState<{codeRequired: boolean, question: string} | null>({
    codeRequired: true,
    question: "What topic was discussed today?"
  });
  const [code, setCode] = useState('');
  const [answer, setAnswer] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Stats Calculations
  const totalClasses = mockSubjectAttendance.reduce((acc, curr) => acc + curr.total, 0);
  const totalAttended = mockSubjectAttendance.reduce((acc, curr) => acc + curr.attended, 0);
  const overallPercentage = ((totalAttended / totalClasses) * 100).toFixed(1);
  const totalMissed = totalClasses - totalAttended;

  const handleMarkAttendance = () => {
    if (code === '7890' && answer.toLowerCase().includes('java')) {
      setAttendanceStatus('success');
      setActiveSession(null);
    } else {
      setAttendanceStatus('error');
    }
  };

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border/40">
        <div>
          <Badge variant="event" className="mb-2">
            ATTENDANCE MANAGEMENT
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {role === 'student' ? 'My Attendance' : 'Class Attendance'}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
            {role === 'student' 
              ? 'Track your attendance records, view subject-wise insights, and mark active sessions.' 
              : 'Monitor class attendance, generate reports, and start live attendance sessions.'}
          </p>
        </div>
        <div className="flex gap-2">
        <div className="flex flex-col sm:flex-row gap-3">
          {['faculty', 'hod', 'coordinator'].includes(role) ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50">
                <button 
                  onClick={() => setActiveTab('dashboard')} 
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all flex-1 sm:flex-none ${activeTab === 'dashboard' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => { setActiveTab('teachingHistory'); setSelectedSessionId(null); }} 
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all flex-1 sm:flex-none ${activeTab === 'teachingHistory' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Teaching History
                </button>
              </div>
              <Button onClick={() => setShowMarkModal(true)} variant="outline" className="gap-2 shadow-sm whitespace-nowrap bg-background">
                <CheckCircle size={16} /> Mark Attendance
              </Button>
              <Button onClick={() => setShowCreateModal(true)} className="gap-2 shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap">
                <Plus size={16} /> Create Session
              </Button>
            </div>
          ) : (
            <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50">
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('history')} 
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'history' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                History
              </button>
              <button 
                onClick={() => setActiveTab('calculator')} 
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'calculator' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Calculator
              </button>
            </div>
          )}
        </div>
      </div>
      </div>

      {activeTab === 'dashboard' && (
        <AnimatePresence mode="wait">
          {selectedSubjectId && role === 'student' ? (
            <SubjectAttendanceDetails 
              subject={mockSubjectAttendance.find(s => s.name === selectedSubjectId)}
              onBack={() => setSelectedSubjectId(null)}
            />
          ) : selectedSessionId && ['faculty', 'hod', 'coordinator'].includes(role) ? (
            <AdminSessionDetails
              session={adminSessions.find(s => s.id === selectedSessionId)}
              onBack={() => setSelectedSessionId(null)}
            />
          ) : (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
          
          {/* Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden relative group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  {getStatusBadge(parseFloat(overallPercentage))}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground tracking-tight">{overallPercentage}%</h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1">Overall Attendance</p>
                </div>
                <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${getProgressBarColor(parseFloat(overallPercentage))} rounded-full`} style={{ width: `${overallPercentage}%` }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden relative group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground tracking-tight">{totalClasses}</h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1">Total Classes Conducted</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden relative group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground tracking-tight">{totalAttended}</h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1">Total Classes Attended</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden relative group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground tracking-tight">{totalMissed}</h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1">Total Classes Missed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Mark Attendance Section (Student Only) */}
            {role === 'student' && (
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-border/50 bg-card shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                  <CardHeader className="bg-muted/20 border-b border-border/50 px-5 py-4">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" /> Mark Attendance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {attendanceStatus === 'success' ? (
                      <div className="flex flex-col items-center justify-center text-center py-6 space-y-3">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                          <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Attendance Marked!</h3>
                        <p className="text-sm text-muted-foreground">You have successfully submitted your attendance for this session.</p>
                      </div>
                    ) : activeSession ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Active Session</span>
                          </div>
                          <h4 className="text-sm font-bold text-foreground">Java Programming (Dr. Rahul Sharma)</h4>
                        </div>
                        
                        {attendanceStatus === 'error' && (
                          <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-medium">
                            Incorrect code or verification answer. Please try again.
                          </div>
                        )}
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Unique Attendance Code</label>
                            <Input 
                              type="text" 
                              placeholder="e.g. 7890" 
                              className="font-mono text-center tracking-widest text-lg"
                              value={code}
                              onChange={(e) => setCode(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Verification Question</label>
                            <div className="p-3 bg-muted/50 rounded-md border border-border/50 text-sm font-medium mb-2 text-foreground">
                              {activeSession.question}
                            </div>
                            <Input 
                              type="text" 
                              placeholder="Your answer..." 
                              value={answer}
                              onChange={(e) => setAnswer(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <Button className="w-full mt-2" onClick={handleMarkAttendance}>
                          Submit Attendance
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-10 space-y-3">
                        <Clock className="w-10 h-10 text-muted-foreground/50 mb-2" />
                        <h3 className="text-lg font-semibold text-foreground">No Active Session</h3>
                        <p className="text-sm text-muted-foreground">Your instructor has not started an attendance session yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* AI Insights Card */}
                <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
                  <CardHeader className="bg-muted/20 border-b border-border/50 px-5 py-4">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <SparklesIcon className="w-4 h-4 text-indigo-500" /> AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <p className="text-sm text-foreground font-medium">Your attendance in <span className="font-bold text-primary">Operating Systems</span> is dropping. Missing 2 more classes will drop you below 75%.</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Most Attended</span>
                        <span className="font-semibold">Software Engineering (95%)</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Least Attended</span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">Operating Systems (75%)</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Trend</span>
                        <span className="font-semibold text-emerald-600 flex items-center gap-1"><TrendingUp size={14} /> Improving</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Subject-wise Cards / Admin Sessions */}
            {role === 'student' ? (
              <div className="lg:col-span-2 grid-cols-1 md:grid-cols-2 grid gap-6">
                {mockSubjectAttendance.map((sub, idx) => {
                  const subPct = (sub.attended / sub.total) * 100;
                  const missed = sub.total - sub.attended;
                  return (
                    <Card 
                      key={idx} 
                      className="border border-border/50 bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                    >
                      <CardContent className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-base text-foreground line-clamp-1">{sub.name}</h4>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5">{sub.faculty}</p>
                          </div>
                          {getStatusBadge(subPct)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                          <div>
                            <p className="text-2xl font-extrabold tracking-tight">{subPct.toFixed(1)}%</p>
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                              Attendance
                            </p>
                          </div>
                          <div className="text-right">
                             <div className="flex justify-end gap-3">
                               <div className="text-center">
                                 <p className="text-lg font-bold text-emerald-600">{sub.attended}</p>
                                 <p className="text-[10px] text-muted-foreground uppercase">Attended</p>
                               </div>
                               <div className="text-center">
                                 <p className="text-lg font-bold text-rose-500">{missed}</p>
                                 <p className="text-[10px] text-muted-foreground uppercase">Missed</p>
                               </div>
                             </div>
                          </div>
                        </div>
                        
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-6">
                          <div className={`h-full ${getProgressBarColor(subPct)} rounded-full`} style={{ width: `${subPct}%` }}></div>
                        </div>
                        
                        <div className="mt-auto">
                          <Button 
                            variant="outline" 
                            className="w-full gap-2"
                            onClick={() => setSelectedSubjectId(sub.name)}
                          >
                            <BarChart3 className="w-4 h-4" />
                            View History
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Session Management</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2"><Filter size={14} /> Filter</Button>
                    <Button variant="outline" size="sm" className="gap-2"><Search size={14} /> Search</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {adminSessions.map(session => (
                    <Card key={session.id} className="border border-border/50 bg-card shadow-sm hover:border-primary/30 transition-all duration-300">
                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-base text-foreground line-clamp-1">{session.subject}</h4>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5">{session.class} • {session.type}</p>
                          </div>
                          <Badge variant={session.status === 'Active' ? 'active' : session.status === 'Closed' ? 'outline' : 'rejected'}>
                            {session.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4 mt-2">
                          <div className="flex items-center text-xs text-muted-foreground gap-2">
                            <Calendar size={12} /> {session.date}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground gap-2">
                            <Clock size={12} /> {session.time}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground gap-2">
                            <QrCode size={12} /> Code: <span className="font-mono font-bold text-foreground">{session.code}</span>
                          </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-border/50">
                          <div className="flex justify-between text-sm mb-3">
                            <span className="text-emerald-600 font-medium">{session.presentCount} Present</span>
                            <span className="text-rose-600 font-medium">{session.absentCount} Absent</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setSelectedSessionId(session.id)}>View</Button>
                            <Button variant="outline" size="sm" className="flex-1 text-xs">Edit</Button>
                            <Button variant="outline" size="icon" className="w-8 h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"><Trash2 size={14} /></Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
          </motion.div>
          )}
        </AnimatePresence>
      )}

      {activeTab === 'teachingHistory' && ['faculty', 'hod', 'coordinator'].includes(role) && (
        <AdminTeachingHistory />
      )}

      {activeTab === 'history' && (
        <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 bg-muted/20 px-6 py-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Attendance History
            </CardTitle>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-[250px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="text" placeholder="Search history..." className="w-full pl-9 h-9 text-sm bg-background/50 border-border/50" />
              </div>
              <Button variant="outline" size="sm" className="gap-2 h-9 bg-background/50 border-border/50">
                <Filter size={14} /> Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow className="hover:bg-transparent border-b border-border/50">
                    <TableHead className="font-semibold text-xs tracking-wider uppercase">Date & Time</TableHead>
                    <TableHead className="font-semibold text-xs tracking-wider uppercase">Subject & Faculty</TableHead>
                    <TableHead className="font-semibold text-xs tracking-wider uppercase">Type</TableHead>
                    <TableHead className="font-semibold text-xs tracking-wider uppercase">Method</TableHead>
                    <TableHead className="font-semibold text-xs tracking-wider uppercase text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockHistory.map((record, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/30 transition-colors border-b border-border/50">
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground">{record.date}</span>
                          <span className="text-xs text-muted-foreground mt-0.5">{record.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground">{record.subject}</span>
                          <span className="text-xs text-muted-foreground mt-0.5">{record.faculty}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] py-0">{record.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-muted-foreground">
                        {record.method}
                      </TableCell>
                      <TableCell className="text-right">
                        {record.status === 'Present' ? (
                          <Badge variant="active">Present</Badge>
                        ) : (
                          <Badge variant="rejected">Absent</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSubjectAttendance.map((sub, idx) => {
            const currentPct = (sub.attended / sub.total) * 100;
            // Calculations (simplified logic for demonstration)
            const neededFor75 = Math.max(0, Math.ceil((0.75 * sub.total - sub.attended) / 0.25));
            const canMiss = Math.max(0, Math.floor((sub.attended - 0.75 * sub.total) / 0.75));
            
            return (
              <Card key={idx} className="border border-border/50 bg-card shadow-sm">
                <CardHeader className="bg-muted/20 border-b border-border/50 px-5 py-4">
                  <CardTitle className="text-base font-semibold flex items-center justify-between">
                    <span className="truncate pr-2">{sub.name}</span>
                    <Badge variant="outline" className="shrink-0">{currentPct.toFixed(1)}%</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">To reach 75%</span>
                    <span className="text-sm font-bold text-foreground">Attend next {neededFor75} classes</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">To reach 80%</span>
                    <span className="text-sm font-bold text-foreground">Attend next {neededFor75 + 2} classes</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Safe to miss</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{canMiss} classes</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

    </div>

      {/* Mark Attendance Modal */}
      <AnimatePresence>
        {showMarkModal && (
          <MarkAttendanceModal 
            isOpen={showMarkModal}
            onClose={() => setShowMarkModal(false)}
            user={user}
            statusBadge={(s: string) => <Badge variant="outline">{s}</Badge>}
          />
        )}
      </AnimatePresence>

      {/* Create Attendance Session Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateSessionModal 
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={onSubmit}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            watch={watch}
            setValue={setValue}
            handleGenerateCode={handleGenerateCode}
            codeValue={watch('attendanceCode')}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Helper for the Sparkles Icon
function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  )
}
