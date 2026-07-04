import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, Plus, Search, Filter, 
  Calendar, CheckCircle2, AlertCircle, 
  Download, X, File, FileCode, Archive, 
  BarChart3, TrendingUp, AlertTriangle, ChevronRight, Activity,
  Eye, ZoomIn, ZoomOut, Maximize, Printer, ExternalLink,
  FileArchive
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { mockData } from '../data/mockData';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, BarChart, Bar } from 'recharts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define types
type Assignment = any;
type Submission = any;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function AssignmentModule() {
  const { role } = useAuth();
  
  const [assignments, setAssignments] = useState<Assignment[]>(mockData.assignments);
  const [submissions, setSubmissions] = useState<Submission[]>(mockData.assignmentSubmissions);

  if (['faculty', 'hod', 'coordinator'].includes(role)) {
    return <AdminAssignmentDashboard assignments={assignments} setAssignments={setAssignments} submissions={submissions} />;
  }
  
  return <StudentAssignmentDashboard assignments={assignments} submissions={submissions} setSubmissions={setSubmissions} />;
}

// ==========================================
// ADMIN DASHBOARD
// ==========================================
function AdminAssignmentDashboard({ assignments, setAssignments, submissions }: { assignments: Assignment[], setAssignments: any, submissions: Submission[] }) {
  const { classes, students } = mockData;
  const [activeClassId, setActiveClassId] = useState(classes[0].id);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewSubmissionsAssignment, setViewSubmissionsAssignment] = useState<Assignment | null>(null);

  const stats = useMemo(() => {
    const classAssignments = assignments.filter(a => a.classId === activeClassId);
    const active = classAssignments.filter(a => a.status === 'Open' || a.status === 'Upcoming').length;
    const completed = classAssignments.filter(a => a.status === 'Expired' || a.status === 'Graded').length;
    
    return {
      total: classAssignments.length,
      active,
      completed,
      upcomingDeadlines: classAssignments.filter(a => a.status === 'Open' && new Date(a.deadline) > new Date()).length
    };
  }, [assignments, activeClassId]);

  const submissionStats = useMemo(() => {
    const classAssignments = assignments.filter(a => a.classId === activeClassId);
    const classStudents = students.filter(s => s.classId === activeClassId);
    const classSubmissions = submissions.filter(s => classAssignments.some(a => a.id === s.assignmentId));

    const totalStudents = classStudents.length;
    const submitted = classSubmissions.filter(s => s.status === 'Submitted' || s.status === 'Graded').length;
    const late = classSubmissions.filter(s => s.status === 'Late Submitted').length;
    // Mocking missing / pending / not downloaded
    return {
      totalStudents,
      submitted,
      late,
      pending: Math.max(0, totalStudents * classAssignments.length - submitted - late),
    };
  }, [submissions, students, assignments, activeClassId]);

  const activeAssignments = useMemo(() => assignments.filter(a => a.classId === activeClassId), [assignments, activeClassId]);

  return (
    <motion.div 
      className="p-6 md:p-8 max-w-7xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Assignment Management</h1>
          <p className="text-slate-500 mt-1">Create, manage, and analyze student assignments.</p>
        </div>
        <div className="flex items-center gap-3 relative z-20 w-full md:w-auto">
        <div className="relative">
          <select 
            value={activeClassId} 
            onChange={e => setActiveClassId(e.target.value)}
            className="appearance-none px-4 py-2 pr-10 h-10 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500/50 outline-none shadow-sm cursor-pointer hover:border-indigo-400:border-indigo-600 transition-all w-full sm:w-64"
          >
            {classes.map(cls => (
              <option key={cls.id} value={cls.id} className="font-medium text-slate-700 bg-white">{cls.year} - {cls.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-indigo-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 cursor-pointer rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-200">
        {['overview', 'assignments', 'ai-analytics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab 
                ? 'text-indigo-600' 
                : 'text-slate-500 hover:text-slate-900:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && <AdminOverview stats={stats} submissionStats={submissionStats} />}
          {activeTab === 'assignments' && <AdminAssignmentList assignments={activeAssignments} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onViewSubmissions={setViewSubmissionsAssignment} />}
          {activeTab === 'ai-analytics' && <AdminAIAnalytics activeClassId={activeClassId} submissions={submissions} assignments={assignments} />}
        </motion.div>
      </AnimatePresence>

      {/* Create Modal */}
      {showCreateModal && <CreateAssignmentModal 
        onClose={() => setShowCreateModal(false)} 
        onSuccess={(newAss) => setAssignments((prev: any) => [newAss, ...prev])}
        activeClassId={activeClassId}
      />}

      {/* Submissions Modal */}
      <AnimatePresence>
        {viewSubmissionsAssignment && (
          <AdminSubmissionsModal 
            assignment={viewSubmissionsAssignment} 
            submissions={submissions} 
            onClose={() => setViewSubmissionsAssignment(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AdminOverview({ stats, submissionStats }: { stats: any, submissionStats: any }) {
  const chartData = [
    { name: 'On Time', value: submissionStats.submitted },
    { name: 'Late', value: submissionStats.late },
    { name: 'Pending', value: submissionStats.pending / 10 }, // scaling down for display
  ];

  const trendData = [
    { name: 'Mon', submissions: 12 },
    { name: 'Tue', submissions: 19 },
    { name: 'Wed', submissions: 15 },
    { name: 'Thu', submissions: 22 },
    { name: 'Fri', submissions: 28 },
    { name: 'Sat', submissions: 35 },
    { name: 'Sun', submissions: 42 },
  ];

  const completionData = [
    { name: 'Week 1', rate: 85 },
    { name: 'Week 2', rate: 78 },
    { name: 'Week 3', rate: 92 },
    { name: 'Week 4', rate: 88 },
  ];

  const subjectData = [
    { name: 'Java', assignments: 8 },
    { name: 'DBMS', assignments: 5 },
    { name: 'OS', assignments: 4 },
    { name: 'Python', assignments: 6 },
    { name: 'Web Dev', assignments: 7 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Assignments', value: stats.total, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-100' },
          { label: 'Active Assignments', value: stats.active, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Upcoming Deadlines', value: stats.upcomingDeadlines, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${kpi.bg}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
                <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Submission Distribution</CardTitle>
            <CardDescription>On-time vs Late vs Pending</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Subject-wise Assignment Count</CardTitle>
            <CardDescription>Assignments distributed across subjects</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={subjectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSubj" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="assignments" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSubj)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Submission Timeline (Weekly)</CardTitle>
            <CardDescription>Number of submissions over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="submissions" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorSub)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Assignment Completion Rate</CardTitle>
            <CardDescription>Percentage of assignments completed per week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="rate" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminAssignmentList({ assignments, searchQuery, setSearchQuery, onViewSubmissions }: { assignments: Assignment[], searchQuery: string, setSearchQuery: (s: string) => void, onViewSubmissions: (a: Assignment) => void }) {
  const { subjects } = mockData;

  const filtered = assignments.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (a.department && a.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search assignments..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto rounded-xl">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filtered.map(assignment => {
          const subject = subjects.find(s => s.id === assignment.subjectId);
          return (
            <motion.div key={assignment.id} variants={itemVariants}>
              <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer">
                <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant={
                      assignment.status === 'Open' ? 'active' : 
                      assignment.status === 'Upcoming' ? 'event' : 
                      assignment.status === 'Expired' ? 'rejected' : 'default'
                    } className="capitalize">
                      {assignment.status}
                    </Badge>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      {assignment.department} • {assignment.academicYear}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-lg text-slate-900 mb-1 line-clamp-1 group-hover:text-indigo-600:text-indigo-400 transition-colors">
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-1">
                    {subject?.name || 'Subject Unknown'}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <FileText className="w-4 h-4 mr-2 text-slate-400" />
                      {assignment.type}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                      Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-900">
                      {assignment.maxMarks} Marks
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => onViewSubmissions(assignment)} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50:bg-indigo-900/30">
                      View Submissions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function AdminAIAnalytics({ activeClassId, submissions, assignments }: { activeClassId: string, submissions: Submission[], assignments: Assignment[] }) {
  const { students } = mockData;
  const classStudents = students.filter(s => s.classId === activeClassId);
  const classAssignments = assignments.filter(a => a.classId === activeClassId);
  const classAssignmentIds = classAssignments.map(a => a.id);
  const classSubmissions = submissions.filter(s => classAssignmentIds.includes(s.assignmentId));

  const studentStats = classStudents.map(student => {
    const studentSubs = classSubmissions.filter(s => s.studentId === student.id);
    const lateCount = studentSubs.filter(s => s.status === 'Late Submitted').length;
    const onTimeCount = studentSubs.filter(s => s.status === 'Submitted' || s.status === 'Graded').length;
    const missingCount = classAssignments.length - studentSubs.length;
    return { ...student, lateCount, onTimeCount, missingCount };
  });

  const topLate = [...studentStats].sort((a, b) => b.lateCount - a.lateCount).filter(s => s.lateCount > 0).slice(0, 5);
  const topMissing = [...studentStats].sort((a, b) => b.missingCount - a.missingCount).filter(s => s.missingCount > 0).slice(0, 5);
  const topOnTime = [...studentStats].sort((a, b) => b.onTimeCount - a.onTimeCount).filter(s => s.onTimeCount > 0).slice(0, 5);

  const aiInsights = [
    "Assignment Analysis: 80% of students submitted the Java assignment late. Consider adjusting future deadlines.",
    "Student STU45 is at risk due to consecutive missed assignments in Web Development.",
    "High performance detected in Data Structures practical assignments. Students are grasping concepts well.",
    "AI Prediction: 5 students in DS-1 might miss the upcoming Operating System deadline based on their past submission history.",
    "Study Recommendation: Provide extra resources for 'SQL Queries' as recent DBMS assignments show a 15% drop in average marks."
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3 border-none shadow-sm bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-500 rounded-lg text-white">
                <BarChart3 className="w-5 h-5" />
              </div>
              <CardTitle>AI Generated Insights</CardTitle>
            </div>
            <CardDescription>Automated analysis of student submission patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.map((insight, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-3 p-4 bg-white/60 rounded-xl border border-white/20 shadow-sm backdrop-blur-sm"
              >
                {insight.includes('risk') || insight.includes('dropping') ? (
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-emerald-500 shrink-0" />
                )}
                <p className="text-sm text-slate-700 leading-relaxed">{insight}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Top Late Submitters</CardTitle>
            <CardDescription>Students consistently submitting late</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
            {topLate.length > 0 ? topLate.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.lateCount} late submissions</p>
                  </div>
                </div>
                <Badge variant="pending">Warning</Badge>
              </div>
            )) : <p className="text-sm text-slate-500">No late submitters found.</p>}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Missing Assignments</CardTitle>
            <CardDescription>Students with most missing assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
            {topMissing.length > 0 ? topMissing.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.missingCount} missing</p>
                  </div>
                </div>
                <Badge variant="rejected">Critical</Badge>
              </div>
            )) : <p className="text-sm text-slate-500">No missing assignments.</p>}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>On-Time Stars</CardTitle>
            <CardDescription>Students with most on-time submissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
            {topOnTime.length > 0 ? topOnTime.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.onTimeCount} on-time</p>
                  </div>
                </div>
                <Badge variant="active">Star</Badge>
              </div>
            )) : <p className="text-sm text-slate-500">No on-time submitters found.</p>}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

function AdminSubmissionsModal({ assignment, submissions, onClose }: { assignment: Assignment, submissions: Submission[], onClose: () => void }) {
  const { students, subjects, classes } = mockData;
  const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignment.id);
  const eligibleStudents = students.filter(s => s.classId === assignment.classId);

  const subject = subjects.find(s => s.id === assignment.subjectId);
  const cls = classes.find(c => c.id === assignment.classId);

  const studentData = eligibleStudents.map(student => {
    const sub = assignmentSubmissions.find(s => s.studentId === student.id);
    return {
      ...student,
      submission: sub,
      status: sub ? sub.status : 'Pending',
      marks: sub && sub.status === 'Graded' ? sub.marks : null,
      aiSimilarity: sub ? Math.floor(Math.random() * 30) + '%' : '-' // Mock AI Similarity
    };
  });

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Name');
  const [previewSubmission, setPreviewSubmission] = useState<any>(null);

  const now = new Date();
  const deadline = new Date(assignment.deadline);
  const isPastDeadline = now > deadline;

  const stats = {
    totalStudents: eligibleStudents.length,
    submitted: studentData.filter(s => s.status === 'Submitted' || s.status === 'Graded').length,
    lateSubmitted: studentData.filter(s => s.status === 'Late Submitted').length,
    pending: studentData.filter(s => s.status === 'Pending' && !isPastDeadline).length,
    notSubmitted: studentData.filter(s => s.status === 'Pending' && isPastDeadline).length,
    avgMarks: assignmentSubmissions.filter(s => s.status === 'Graded').length > 0 
      ? Math.round(assignmentSubmissions.filter(s => s.status === 'Graded').reduce((acc, curr) => acc + (curr.marks || 0), 0) / assignmentSubmissions.filter(s => s.status === 'Graded').length) 
      : '-',
    highestMarks: assignmentSubmissions.filter(s => s.status === 'Graded').length > 0
      ? Math.max(...assignmentSubmissions.filter(s => s.status === 'Graded').map(s => s.marks || 0))
      : '-',
    lowestMarks: assignmentSubmissions.filter(s => s.status === 'Graded').length > 0
      ? Math.min(...assignmentSubmissions.filter(s => s.status === 'Graded').map(s => s.marks || 0))
      : '-'
  };

  const filteredData = studentData.filter(s => {
    if (filterStatus !== 'All' && s.status !== filterStatus) {
      if (filterStatus === 'Not Submitted' && s.status === 'Pending' && isPastDeadline) return true;
      if (filterStatus === 'Pending' && s.status === 'Pending' && !isPastDeadline) return true;
      if (filterStatus === 'Submitted' && (s.status === 'Submitted' || s.status === 'Graded')) return true;
      if (filterStatus === 'Late' && s.status === 'Late Submitted') return true;
      return false;
    }
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.enrollmentNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'Name') return a.name.localeCompare(b.name);
    if (sortBy === 'Enrollment Number') return a.enrollmentNumber.localeCompare(b.enrollmentNumber);
    if (sortBy === 'Submission Time') {
      if (!a.submission && !b.submission) return 0;
      if (!a.submission) return 1;
      if (!b.submission) return -1;
      return new Date(b.submission.submitDate).getTime() - new Date(a.submission.submitDate).getTime();
    }
    return 0;
  });

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-[95vw] md:w-[90vw] max-w-7xl h-[90vh] bg-slate-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
      >
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center z-20 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{assignment.title}</h2>
              <Badge variant={isPastDeadline ? 'rejected' : 'active'} className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider">
                {isPastDeadline ? 'Deadline Passed' : 'Active'}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 font-medium">
              <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-indigo-500"/> {subject?.name || 'Unknown'}</span>
              <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-indigo-500"/> {cls?.name || 'Unknown'}</span>
              <span>Year: {assignment.academicYear}</span>
              <span>Total Marks: {assignment.maxMarks}</span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Calendar className="w-4 h-4 text-indigo-500"/> 
                Deadline: <span className="font-semibold">{new Date(assignment.deadline).toLocaleString()}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="text-right mr-2 hidden sm:block">
              <p className="text-xs text-slate-500 font-medium">Total Students: {stats.totalStudents}</p>
              <p className="text-xs text-slate-500 font-medium">Submitted: {stats.submitted}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900">
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
        
        {/* Summary Panel - Fixed */}
        <div className="bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 md:p-6 pb-4">
            <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.submitted}</h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.pending}</h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Late</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.lateSubmitted}</h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Marks</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.avgMarks}</h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Highest</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.highestMarks}</h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-400"></div>
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lowest</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.lowestMarks}</h3>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filter Bar - Fixed */}
        <div className="bg-white px-4 md:px-6 py-3 border-b border-slate-200 shrink-0 z-10 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
            <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search Student Name or Roll No..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
              <select 
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full sm:w-48 px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Pending">Pending</option>
                <option value="Late">Late</option>
              </select>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <label className="text-sm font-medium text-slate-500 shrink-0">Sort by:</label>
              <select 
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full md:w-48 px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="Name">Name</option>
                <option value="Enrollment Number">Enrollment Number</option>
                <option value="Submission Time">Submission Time</option>
              </select>
            </div>
        </div>

        {/* Scrollable Table Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-4 md:p-6 bg-slate-50">
          <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Student</th>
                    <th className="px-6 py-4 font-semibold">Submission Time</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Marks</th>
                    <th className="px-6 py-4 font-semibold">AI Similarity</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.length > 0 ? (
                    filteredData.map(student => (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                            <div>
                              <p className="font-semibold text-slate-900">{student.name}</p>
                              <p className="text-xs text-slate-500">{student.enrollmentNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {student.submission ? (
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-700">{new Date(student.submission.submitDate).toLocaleDateString()}</span>
                              <span className="text-xs text-slate-500">{new Date(student.submission.submitDate).toLocaleTimeString()}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No Submission</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={
                            student.status === 'Submitted' || student.status === 'Graded' ? 'active' :
                            student.status === 'Late Submitted' ? 'pending' : 
                            student.status === 'Pending' && !isPastDeadline ? 'outline' : 'rejected'
                          } className="capitalize font-medium">
                            {student.status === 'Pending' && isPastDeadline ? 'Not Submitted' : student.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {student.marks !== null ? (
                            <span className="font-bold text-slate-900">{student.marks} <span className="text-slate-400 font-normal">/ {assignment.maxMarks}</span></span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                           {student.submission ? (
                             <Badge variant="outline" className="bg-slate-100 text-slate-600 border-none">
                               <AlertCircle className="w-3 h-3 mr-1 text-slate-400" />
                               {student.aiSimilarity}
                             </Badge>
                           ) : <span className="text-slate-400">-</span>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {student.submission ? (
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setPreviewSubmission({ student, assignment, submission: student.submission })}
                                className="h-8 bg-white"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1.5" />
                                View
                              </Button>
                              <Button variant="outline" size="icon" className="h-8 w-8 bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50">
                                <Download className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <Button variant="ghost" size="sm" disabled className="h-8">No File</Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                          <Search className="w-8 h-8 text-slate-300 mb-3" />
                          <p className="font-medium text-slate-900">No students found</p>
                          <p className="text-sm">Try adjusting your search or filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Small Preview Modal */}
        <AnimatePresence>
          {previewSubmission && (
            <AssignmentPreviewModal 
              previewData={previewSubmission} 
              onClose={() => setPreviewSubmission(null)} 
            />
          )}
        </AnimatePresence>
        
      </motion.div>
    </div>,
    document.body
  );
}

function AssignmentPreviewModal({ previewData, onClose }: { previewData: any, onClose: () => void }) {
  const { student, assignment, submission } = previewData;
  const { subjects, classes } = mockData;
  
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 25));

  const subject = subjects.find(s => s.id === assignment.subjectId);
  const cls = classes.find(c => c.id === assignment.classId);

  // Determine file type icon and support
  const fileName = submission.attachments?.[0]?.name || `${student.enrollmentNumber}_${assignment.title.replace(/\s+/g, '_')}.pdf`;
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  const fileSize = submission.attachments?.[0]?.size || '2.4 MB';
  
  // A generic fallback for preview URL if it's pointing to example.com
  const rawFileUrl = submission.fileUrl || assignment.attachmentUrl;
  const fileUrl = rawFileUrl?.includes('example.com') 
    ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' 
    : rawFileUrl;

  const isPreviewable = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'png', 'jpg', 'jpeg', 'zip', 'js', 'py', 'java', 'cpp', 'html', 'css'].includes(fileExtension || '');

  return createPortal(
    <div className={`fixed inset-0 z-[110] flex flex-col bg-slate-900/95 backdrop-blur-xl transition-all`}>
      {/* Toolbar */}
      <div className="h-16 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-4 sm:px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-slate-200 font-semibold text-sm truncate max-w-[200px] sm:max-w-md">{fileName}</h3>
            <p className="text-slate-400 text-xs mt-0.5">{fileSize} • {fileExtension?.toUpperCase()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          {isPreviewable && (
            <div className="hidden sm:flex items-center gap-1 mr-4 border-r border-slate-700 pr-4">
              <button onClick={handleZoomOut} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Zoom Out"><ZoomOut className="w-4 h-4" /></button>
              <span className="text-slate-300 text-xs font-medium w-12 text-center">{zoomLevel}%</span>
              <button onClick={handleZoomIn} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Zoom In"><ZoomIn className="w-4 h-4" /></button>
              <button onClick={() => setIsFullscreen(!isFullscreen)} className={`p-2 hover:bg-slate-800 rounded-lg transition-colors ml-2 ${isFullscreen ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`} title="Toggle Full Screen"><Maximize className="w-4 h-4" /></button>
            </div>
          )}
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Print" onClick={() => window.print()}><Printer className="w-4 h-4" /></button>
          <a href={fileUrl} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:block" title="Open in New Tab"><ExternalLink className="w-4 h-4" /></a>
          <a href={fileUrl} download className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 rounded-lg transition-colors ml-2" title="Download"><Download className="w-4 h-4" /></a>
          <div className="w-px h-6 bg-slate-700 mx-1 sm:mx-2"></div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Close Preview"><X className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Info */}
        {!isFullscreen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-slate-900 border-r border-slate-700 flex flex-col shrink-0 hidden md:flex"
          >
            <div className="p-6 border-b border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Student Details</h4>
              <div className="flex items-center gap-3">
                <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full ring-2 ring-slate-800" />
                <div>
                  <p className="text-slate-200 font-medium">{student.name}</p>
                  <p className="text-slate-400 text-xs">{student.enrollmentNumber}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-b border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assignment Info</h4>
              <div>
                <p className="text-slate-400 text-xs">Title</p>
                <p className="text-slate-200 text-sm font-medium mt-0.5">{assignment.title}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Subject & Class</p>
                <p className="text-slate-200 text-sm font-medium mt-0.5">{subject?.name} • {cls?.name}</p>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Submission Details</h4>
              <div>
                <p className="text-slate-400 text-xs">Submitted At</p>
                <p className="text-slate-200 text-sm font-medium mt-0.5">
                  {new Date(submission.submitDate).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Status</p>
                <div className="mt-1.5">
                  <Badge variant={submission.status === 'Late Submitted' ? 'pending' : 'active'} className="bg-slate-800 text-emerald-400 border-emerald-400/20">
                    {submission.status}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Preview Area */}
        <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
          {isPreviewable ? (
            <div className={`w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col transition-all ${isFullscreen ? 'max-w-none' : 'max-w-5xl'}`}>
               <div className="flex-1 w-full bg-slate-100 flex items-center justify-center overflow-auto relative p-8">
                  <div 
                    className="transition-transform duration-200 ease-out flex items-center justify-center w-full h-full"
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
                  >
                    {fileExtension === 'pdf' && (
                      <iframe src={`${fileUrl}#toolbar=0&navpanes=0`} className="w-full h-full min-h-[800px] bg-white shadow-sm" title="PDF Preview" />
                    )}
                    {['png', 'jpg', 'jpeg'].includes(fileExtension || '') && (
                      <img src={fileUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded shadow-sm" />
                    )}
                    {['js', 'py', 'java', 'cpp', 'html', 'css'].includes(fileExtension || '') && (
                      <div className="w-full h-full min-h-[800px] bg-slate-900 p-8 rounded-lg shadow-sm text-slate-300 font-mono text-sm overflow-auto text-left whitespace-pre">
                        <span className="text-slate-500 block mb-4">/* Preview of {fileName} */</span>
                        <span className="text-pink-400">function</span> <span className="text-blue-400">calculateTotal</span>() {'{\n'}
                        {'  '}// Source code preview mock{'\n'}
                        {'  '}<span className="text-pink-400">return</span> <span className="text-orange-400">42</span>;{'\n'}
                        {'}'}
                      </div>
                    )}
                    {['doc', 'docx', 'ppt', 'pptx'].includes(fileExtension || '') && (
                      <div className="w-full h-full flex items-center justify-center bg-white shadow-sm min-h-[800px]">
                         <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`} className="w-full h-full border-none" title="Office Preview" />
                      </div>
                    )}
                    {fileExtension === 'txt' && (
                      <div className="w-full max-w-3xl bg-white min-h-[800px] shadow-sm border border-slate-200 p-12 text-slate-800 font-mono text-sm leading-relaxed">
                        <p>This is a simulated text document preview.</p>
                        <p>File contents for {fileName} would appear here.</p>
                      </div>
                    )}
                    {fileExtension === 'zip' && (
                      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden self-start mt-10">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                          <FileArchive className="w-5 h-5 text-indigo-500" />
                          <span className="font-semibold text-slate-800">Archive Contents</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {['src/index.js', 'src/styles.css', 'package.json', 'README.md'].map((file, i) => (
                            <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <FileCode className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-600">{file}</span>
                              </div>
                              <span className="text-xs text-slate-400">{(Math.random() * 50 + 2).toFixed(1)} KB</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center max-w-md text-center p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <File className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Preview Not Available</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                This file type cannot be previewed directly in the browser. Please download the file to view its contents.
              </p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20" asChild>
                <a href={fileUrl} download>
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subjectId: z.string().min(1, "Subject is required"),
  academicYear: z.string().min(1, "Academic Year is required"),
  semester: z.string().min(1, "Semester is required"),
  department: z.string().min(1, "Department is required"),
  classId: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  deadline: z.string().min(1, "Deadline is required"),
  description: z.string().min(1, "Description is required"),
  instructions: z.string().min(1, "Instructions are required"),
  maxMarks: z.coerce.number().min(1, "Max marks must be > 0"),
  maxUploadSize: z.string().min(1, "Max upload size is required"),
  allowedFileTypes: z.string().min(1, "Allowed file types are required"),
  lateSubmissionAllowed: z.boolean().default(false),
  penaltyForLateSubmission: z.coerce.number().min(0, "Penalty must be >= 0").optional()
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

function CreateAssignmentModal({ onClose, onSuccess, activeClassId }: { onClose: () => void, onSuccess: (data: any) => void, activeClassId: string }) {
  const { subjects, classes } = mockData;
  const [file, setFile] = useState<File | null>(null);
  const [targetClasses, setTargetClasses] = useState<string[]>([]);

  const activeClass = classes.find(c => c.id === activeClassId);
  const defaultDepartment = activeClass?.name.includes('IT') ? 'IT' : 'DS';
  const defaultAcademicYear = activeClass?.year || 'Second Year';

  const { register, handleSubmit, watch, formState: { errors } } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema) as any,
    defaultValues: {
      lateSubmissionAllowed: false,
      penaltyForLateSubmission: 0,
      maxUploadSize: '10 MB',
      allowedFileTypes: 'PDF, DOCX, ZIP',
      academicYear: defaultAcademicYear,
      semester: '',
      department: defaultDepartment,
      type: 'PDF Assignment'
    }
  });

  const selectedYear = watch('academicYear');
  const selectedDept = watch('department');
  const isLateSubmissionAllowed = watch('lateSubmissionAllowed');
  
  const availableClasses = classes.filter(c => c.year === selectedYear && c.name.includes(selectedDept));

  const toggleClass = (className: string) => {
    setTargetClasses(prev => 
      prev.includes(className) ? prev.filter(c => c !== className) : [...prev, className]
    );
  };

  const selectAllClasses = () => {
    if (targetClasses.length === availableClasses.length) {
      setTargetClasses([]);
    } else {
      setTargetClasses(availableClasses.map(c => c.name));
    }
  };

  const onSubmit = (data: AssignmentFormValues) => {
    const newAssignment = {
      id: `a-${Date.now()}`,
      ...data,
      targetClasses,
      classId: availableClasses[0]?.id || activeClassId,
      status: 'Open',
      attachmentUrl: file ? URL.createObjectURL(file) : undefined,
      createdAt: new Date().toISOString()
    };
    onSuccess(newAssignment);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md p-6 border-b border-slate-100 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-slate-900">Create New Assignment</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Assignment Title *</label>
                <input {...register('title')} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Data Structures Practical Record" />
                {errors.title && <p className="text-xs text-rose-500">{errors.title.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Subject *</label>
                <select {...register('subjectId')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {errors.subjectId && <p className="text-xs text-rose-500">{errors.subjectId.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Academic Year *</label>
                <select {...register('academicYear')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Select Year</option>
                  <option value="Second Year">2nd Year</option>
                  <option value="Third Year">3rd Year</option>
                  <option value="Fourth Year">4th Year</option>
                </select>
                {errors.academicYear && <p className="text-xs text-rose-500">{errors.academicYear.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Semester *</label>
                <select {...register('semester')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Select Semester</option>
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
                <label className="text-sm font-medium text-slate-700">Department *</label>
                <select {...register('department')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Select Department</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="DS">Data Science (DS)</option>
                </select>
                {errors.department && <p className="text-xs text-rose-500">{errors.department.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Target Classes *</label>
                  {availableClasses.length > 0 && (
                    <button type="button" onClick={selectAllClasses} className="text-xs font-semibold text-indigo-600 hover:underline">
                      {targetClasses.length === availableClasses.length ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>
                {availableClasses.length === 0 ? (
                  <p className="text-sm text-slate-400 italic p-3 bg-slate-50 rounded-xl border border-slate-100">
                    Select Academic Year and Department to view available classes.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {availableClasses.map(cls => (
                      <label 
                        key={cls.id} 
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                          targetClasses.includes(cls.name) 
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                            : 'border-slate-200 bg-white hover:border-indigo-200 text-slate-700'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={targetClasses.includes(cls.name)} 
                          onChange={() => toggleClass(cls.name)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        {cls.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Assignment Type *</label>
                <select {...register('type')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="PDF Assignment">PDF Assignment</option>
                  <option value="Document Assignment">Document Assignment</option>
                  <option value="ZIP/File Submission">ZIP/File Submission</option>
                  <option value="Online Assignment">Online Assignment</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Submission Deadline *</label>
                <input {...register('deadline')} type="datetime-local" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                {errors.deadline && <p className="text-xs text-rose-500">{errors.deadline.message}</p>}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Description *</label>
                <textarea {...register('description')} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Provide assignment description..." />
                {errors.description && <p className="text-xs text-rose-500">{errors.description.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Instructions *</label>
                <textarea {...register('instructions')} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="1. Submit before deadline&#10;2. Use standard naming convention..." />
                {errors.instructions && <p className="text-xs text-rose-500">{errors.instructions.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Maximum Marks *</label>
                <input {...register('maxMarks')} type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="10" />
                {errors.maxMarks && <p className="text-xs text-rose-500">{errors.maxMarks.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Allowed File Types *</label>
                <input {...register('allowedFileTypes')} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. PDF, DOCX, ZIP" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Max Upload Size *</label>
                <select {...register('maxUploadSize')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="5 MB">5 MB</option>
                  <option value="10 MB">10 MB</option>
                  <option value="25 MB">25 MB</option>
                  <option value="50 MB">50 MB</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center h-full pt-6">
                  <input {...register('lateSubmissionAllowed')} type="checkbox" className="mr-2 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  Allow Late Submission
                </label>
              </div>
              
              {isLateSubmissionAllowed && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Penalty for Late Submission (%) *</label>
                  <input {...register('penaltyForLateSubmission')} type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 10" />
                  {errors.penaltyForLateSubmission && <p className="text-xs text-rose-500">{errors.penaltyForLateSubmission.message}</p>}
                </div>
              )}
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Attachment Upload</label>
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={e => e.target.files && setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className={`border-2 border-dashed ${file ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100:bg-slate-900'} rounded-2xl p-8 flex flex-col items-center justify-center transition-colors`}>
                    {file ? (
                      <>
                        <FileCode className="w-8 h-8 text-indigo-500 mb-2" />
                        <p className="text-sm font-medium text-slate-900">{file.name}</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500 mt-1">PDF, DOCX, ZIP up to 50MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 rounded-xl">
              Publish Assignment
            </Button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
}

// ==========================================
// STUDENT DASHBOARD
// ==========================================
function StudentAssignmentDashboard({ assignments, submissions, setSubmissions }: { assignments: Assignment[], submissions: Submission[], setSubmissions: any }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const { subjects } = mockData;
  
  // Assuming the user is a student, we filter by their class
  // For mock purposes, just take random assignments or all
  const studentAssignments = useMemo(() => assignments, [assignments]);

  const filtered = studentAssignments.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (subjects.find(s => s.id === a.subjectId)?.name.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      className="p-6 md:p-8 max-w-7xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Assignments</h1>
        <p className="text-slate-500 mt-1">View, download, and submit your course assignments.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search assignments by title or subject..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto rounded-xl">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filtered.map(assignment => {
            const subject = subjects.find(s => s.id === assignment.subjectId);
            // Mock submission lookup
            const submission = submissions.find(s => s.assignmentId === assignment.id);
            const status = submission ? submission.status : assignment.status;
            
            const daysRemaining = Math.ceil((new Date(assignment.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            
            return (
              <motion.div key={assignment.id} variants={itemVariants} layout>
                <Card className="h-full border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group">
                  <div className={`h-1.5 w-full ${
                    status === 'Submitted' || status === 'Graded' ? 'bg-emerald-500' :
                    status === 'Late Submitted' ? 'bg-amber-500' :
                    status === 'Expired' ? 'bg-rose-500' : 'bg-indigo-500'
                  }`} />
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant={
                        status === 'Submitted' || status === 'Graded' ? 'active' :
                        status === 'Late Submitted' ? 'pending' :
                        status === 'Expired' ? 'rejected' : 'event'
                      } className="capitalize">
                        {status}
                      </Badge>
                      {daysRemaining > 0 && status !== 'Submitted' && status !== 'Graded' && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                          daysRemaining <= 2 ? 'bg-rose-100 text-rose-700' : 
                          'bg-indigo-100 text-indigo-700'
                        }`}>
                          {daysRemaining} days left
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg text-slate-900 mb-1 line-clamp-1 group-hover:text-indigo-600:text-indigo-400 transition-colors">
                      {assignment.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 mb-4 line-clamp-1">
                      {subject?.name} • Faculty Name
                    </p>

                    <div className="space-y-3 mb-6 flex-1">
                      <div className="flex items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <FileText className="w-4 h-4 mr-3 text-indigo-500" />
                        <span className="truncate">{assignment.type}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <Calendar className="w-4 h-4 mr-3 text-indigo-500" />
                        Due: {new Date(assignment.deadline).toLocaleString()}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                      <span className="text-sm font-bold text-slate-900">
                        {assignment.maxMarks} Marks
                      </span>
                      <Button 
                        onClick={() => setSelectedAssignment(assignment)}
                        className={`shadow-sm rounded-xl transition-all ${
                          status === 'Submitted' || status === 'Graded' 
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700:bg-slate-700'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                        }`}
                      >
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {selectedAssignment && (
        <StudentAssignmentModal 
          assignment={selectedAssignment} 
          submissions={submissions}
          setSubmissions={setSubmissions}
          onClose={() => setSelectedAssignment(null)} 
        />
      )}
    </motion.div>
  );
}

function StudentAssignmentModal({ assignment, submissions, setSubmissions, onClose }: { assignment: Assignment, submissions: Submission[], setSubmissions: any, onClose: () => void }) {
  const { subjects } = mockData;
  const subject = subjects.find(s => s.id === assignment.subjectId);
  const submission = submissions.find(s => s.assignmentId === assignment.id);
  const status = submission ? submission.status : assignment.status;
  
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const canSubmit = status !== 'Expired' && status !== 'Graded';

  const handleUpload = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const isLate = new Date() > new Date(assignment.deadline);
      const newSubmission = {
        id: `sub-${Date.now()}`,
        assignmentId: assignment.id,
        studentId: 'st-0', // Using generic student mock
        submitDate: new Date().toISOString(),
        status: isLate ? 'Late Submitted' : 'Submitted',
        fileName: file?.name || 'submission.pdf',
        fileUrl: file ? URL.createObjectURL(file) : '',
        marksObtained: null,
        feedback: null
      };

      setSubmissions((prev: any) => {
        // replace old submission if exists
        const filtered = prev.filter((s: any) => s.assignmentId !== assignment.id);
        return [newSubmission, ...filtered];
      });

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto border-r border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-start mb-6">
            <Badge variant="date" className="bg-indigo-100 text-indigo-700 border-none">
              {subject?.name}
            </Badge>
            <button onClick={onClose} className="p-2 md:hidden hover:bg-slate-200:bg-slate-800 rounded-full">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{assignment.title}</h2>
          
          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Max Marks</p>
              <p className="text-xl font-bold text-slate-900">{assignment.maxMarks}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Deadline</p>
              <p className="text-sm font-bold text-rose-600">
                {new Date(assignment.deadline).toLocaleDateString()}
              </p>
              <p className="text-xs text-rose-500">{new Date(assignment.deadline).toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" /> Description
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-2xl border border-slate-100">
                {assignment.description}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-500" /> Instructions
              </h4>
              <div className="text-sm text-slate-600 whitespace-pre-line bg-white p-4 rounded-2xl border border-slate-100">
                {assignment.instructions}
              </div>
            </div>

            {assignment.attachmentUrl && (
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Archive className="w-4 h-4 text-indigo-500" /> Attachments
                </h4>
                <a 
                  href={assignment.attachmentUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-300:border-indigo-500 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <File className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600:text-indigo-400 transition-colors">Assignment_Doc.pdf</p>
                      <p className="text-xs text-slate-500">1.2 MB</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600:text-indigo-400" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Submission */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hidden md:block hover:bg-slate-100:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>

          <h3 className="text-xl font-bold text-slate-900 mb-6">Submission</h3>
          
          <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Activity className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Status</p>
              <p className={`text-sm font-bold ${
                status === 'Submitted' || status === 'Graded' ? 'text-emerald-600' :
                status === 'Late Submitted' ? 'text-amber-600' :
                status === 'Expired' ? 'text-rose-600' : 'text-indigo-600'
              }`}>
                {status}
              </p>
            </div>
          </div>

          {submission || isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-emerald-200 rounded-3xl bg-emerald-50/50"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">Successfully Submitted</h4>
              <p className="text-sm text-slate-500 mb-6">Your assignment has been recorded.</p>
              
              <div className="w-full text-left p-4 rounded-xl bg-white shadow-sm border border-slate-100 mb-6">
                <p className="text-xs text-slate-500 mb-1">Submitted File</p>
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-medium text-slate-900 truncate">
                    {submission?.fileName || file?.name || 'submission.pdf'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Submitted on: {submission ? new Date(submission.submitDate).toLocaleString() : new Date().toLocaleString()}
                </p>
              </div>
              
              {canSubmit && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsSuccess(false)}
                  className="w-full rounded-xl border-slate-200"
                >
                  Replace Submission
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-900 mb-2 block">Upload Work</label>
                <div 
                  className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all ${
                    file 
                      ? 'border-indigo-500 bg-indigo-50/50' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100:bg-slate-900'
                  } ${!canSubmit && 'opacity-50 pointer-events-none'}`}
                >
                  {file ? (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <File className="w-6 h-6 text-indigo-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button 
                        onClick={() => setFile(null)}
                        className="text-xs text-rose-500 font-medium mt-4 hover:text-rose-600"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="text-center relative">
                      <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFile(e.target.files[0]);
                          }
                        }}
                        disabled={!canSubmit}
                      />
                      <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100">
                        <Upload className="w-5 h-5 text-indigo-500" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500 mt-2">Allowed: {assignment.allowedFileTypes || 'PDF, DOCX, ZIP'} (Max: {assignment.maxUploadSize || '10MB'})</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  disabled={!file || !canSubmit || isSubmitting}
                  onClick={handleUpload}
                  className="w-full py-6 text-base font-semibold rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 transition-all disabled:opacity-50 disabled:shadow-none relative overflow-hidden group"
                >
                  <div className={`absolute inset-0 bg-indigo-500/20 w-0 group-hover:w-full transition-all duration-300 ${isSubmitting ? 'w-full animate-pulse' : ''}`} />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>Submit Assignment <ChevronRight className="w-4 h-4" /></>
                    )}
                  </span>
                </Button>
                {!canSubmit && (
                  <p className="text-center text-xs text-rose-500 mt-3 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Submissions are closed for this assignment.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
