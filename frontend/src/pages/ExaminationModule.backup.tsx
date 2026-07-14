import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, Calendar as CalendarIcon, FileText, CheckCircle, 
  Plus, Search, Upload, Eye, Edit, Trash2, 
  Award, BarChart3, 
  Users, AlertTriangle, ChevronRight, CalendarDays, DownloadCloud, 
  FileSpreadsheet, Save, X, FileIcon,
  RefreshCw, FileText as FileTextIcon, Sparkles, BrainCircuit, Printer, Target, LayoutGrid
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Bar, Legend, PieChart, Pie, Cell, BarChart
} from 'recharts';
import { toast } from 'sonner';
import { mockData } from '../data/mockData';

// --- INITIAL MOCK DATA ---
const INITIAL_EXAMS = [
  { id: 'exam-1', name: 'Mid Semester Examination', academicYear: '2026-2027', department: 'Information Technology', semester: '5th', class: 'IT-1', description: 'Official Mid Semester Examination for odd semester.', startDate: '2026-10-15', endDate: '2026-10-25', status: 'Completed' },
  { id: 'exam-2', name: 'End Semester Examination', academicYear: '2026-2027', department: 'Information Technology', semester: '5th', class: 'IT-1', description: 'Final End Semester Examination.', startDate: '2026-12-10', endDate: '2026-12-24', status: 'Upcoming' }
];

const MOCK_TIMETABLES = [
  { id: 'tt-1', examId: 'exam-1', name: 'Mid_Sem_TimeTable.pdf', type: 'PDF', size: '2.4 MB', uploadedBy: 'Admin (Dr. Sharma)', uploadDate: '2026-10-01' }
];

const MOCK_NOTICES = [
  { id: 'not-1', examId: 'exam-1', title: 'Admit Card Collection', description: 'Please collect your admit cards from the department office.', category: 'Admit Card Notice', priority: 'High', publishDate: '2026-10-10', attachment: 'admit_card_guidelines.pdf' },
  { id: 'not-2', examId: 'exam-1', title: 'Seating Arrangement', description: 'Seating arrangement for all 3rd-year students.', category: 'Seating Arrangement', priority: 'Medium', publishDate: '2026-10-14', attachment: 'seating.xlsx' }
];

const getPersistentData = (key: string, defaultValue: any) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error reading from localStorage", e);
  }
  return defaultValue;
};

export const ExaminationModule = () => {
  const { role, user } = useAuth();
  
  // States
  const [exams, setExams] = useState(() => getPersistentData('acronexus_exams', INITIAL_EXAMS));
  const [timetables, setTimetables] = useState(() => getPersistentData('acronexus_timetables', MOCK_TIMETABLES));
  const [notices, setNotices] = useState(() => getPersistentData('acronexus_notices', MOCK_NOTICES));
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [isCreatingExam, setIsCreatingExam] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('timetable'); // timetable, results, analytics, info
  const [examToDelete, setExamToDelete] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('acronexus_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('acronexus_timetables', JSON.stringify(timetables));
  }, [timetables]);

  useEffect(() => {
    localStorage.setItem('acronexus_notices', JSON.stringify(notices));
  }, [notices]);
  
  // Create Exam (Admin)
  const [createExamName, setCreateExamName] = useState('');
  const [createYear, setCreateYear] = useState('');
  const [createSemester, setCreateSemester] = useState('');
  const [createDept, setCreateDept] = useState('');
  const [createClasses, setCreateClasses] = useState<string[]>([]);
  const [createStartDate, setCreateStartDate] = useState('');
  const [createEndDate, setCreateEndDate] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createTimetableFile, setCreateTimetableFile] = useState<File | null>(null);
  // Results Management (Admin)
  const [selectedClass, setSelectedClass] = useState('');
  const [enteringMarksForStudent, setEnteringMarksForStudent] = useState<any>(null);
  
  // Result Management Upload State
  const [resultUploadMethod, setResultUploadMethod] = useState<'upload' | 'manual' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'reading' | 'extracting' | 'completed' | 'error'>('idle');
  const [, setIsUploading] = useState(false);
  const [uploadedMarks, setUploadedMarks] = useState<any[]>([]);
  const [resultSearch, setResultSearch] = useState('');
  const [resultStatusFilter, setResultStatusFilter] = useState('All');
  
  // Results (Student)
  const [viewingSubjectResult, setViewingSubjectResult] = useState<any>(null);
  const [viewingReportCard, setViewingReportCard] = useState(false);

  // Eligibility Generator (Admin)
  const [isGeneratingEligibility, setIsGeneratingEligibility] = useState(false);
  const [elgYear, setElgYear] = useState('');
  const [elgSemester, setElgSemester] = useState('');
  const [elgClass, setElgClass] = useState('');
  const [elgExam, setElgExam] = useState('');
  const [elgCriteria, setElgCriteria] = useState({ attendance: true, assignment: false, quiz: false, internalMarks: false, event: false });
  const [elgSettings, setElgSettings] = useState({ attendance: 75, assignment: 80, quiz: 40, internal: 40 });
  const [elgGeneratedList, setElgGeneratedList] = useState<any[] | null>(null);
  const [elgInsights, setElgInsights] = useState<any>(null);
  const [elgFilter, setElgFilter] = useState({ search: '', status: 'All', sort: 'Alpha' });
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationText, setSimulationText] = useState('');

  // Seating Arrangement (Admin)
  const [isGeneratingSeating, setIsGeneratingSeating] = useState(false);
  const [seatingStep, setSeatingStep] = useState(1);
  const [seatClasses, setSeatClasses] = useState<string[]>([]);
  const [seatRooms, setSeatRooms] = useState<any[]>([]); 
  const [seatingConfig, setSeatingConfig] = useState<any>({ maxPerBench: 2, avoidSameClass: true, fillStrategy: 'sequential' });
  const [isSimulatingSeating, setIsSimulatingSeating] = useState(false);
  const [seatingGenerated, setSeatingGenerated] = useState<any>(null);
  
  // Room entry state
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomBenches, setNewRoomBenches] = useState('');

  // Constants
  const classes = ['IT-1', 'IT-2', 'DS-1', 'DS-2'];
  const subjects = mockData.subjects || [];
  
  // Helper to get students for a class
  const classStudents = selectedClass ? mockData.students.filter(s => s.className === selectedClass || selectedClass.includes('IT')) : [];

  const openCreateForm = (exam: any = null) => {
    if (exam) {
      setEditingExamId(exam.id);
      setCreateExamName(exam.name);
      setCreateYear(exam.academicYear);
      setCreateSemester(exam.semester);
      setCreateDept(exam.department);
      setCreateClasses(exam.class.split(', '));
      setCreateStartDate(exam.startDate);
      setCreateEndDate(exam.endDate);
      setCreateDescription(exam.description);
      setCreateTimetableFile(null);
    } else {
      setEditingExamId(null);
      setCreateExamName('');
      setCreateYear('');
      setCreateSemester('');
      setCreateDept('');
      setCreateClasses([]);
      setCreateStartDate('');
      setCreateEndDate('');
      setCreateDescription('');
      setCreateTimetableFile(null);
    }
    setIsCreatingExam(true);
  };

  const handleSaveExam = () => {
    if (!createExamName || !createYear || !createSemester || !createDept || createClasses.length === 0 || !createStartDate || !createEndDate) {
      alert("Please fill all required fields.");
      return;
    }

    if (new Date(createEndDate) < new Date(createStartDate)) {
      alert("End Date cannot be before Start Date.");
      return;
    }
    
    const newExam = {
      id: editingExamId || `exam-${Date.now()}`,
      name: createExamName,
      academicYear: createYear,
      department: createDept,
      semester: createSemester,
      class: createClasses.join(', '),
      description: createDescription,
      startDate: createStartDate,
      endDate: createEndDate,
      status: 'Upcoming'
    };

    if (editingExamId) {
      setExams(exams.map(e => e.id === editingExamId ? { ...e, ...newExam } : e));
    } else {
      setExams([...exams, newExam]);
    }

    if (createTimetableFile) {
      const newTT = {
        id: `tt-${Date.now()}`,
        examId: newExam.id,
        name: createTimetableFile.name,
        type: createTimetableFile.type.includes('pdf') ? 'PDF' : 'Image',
        size: (createTimetableFile.size / (1024 * 1024)).toFixed(2) + ' MB',
        uploadedBy: user?.name || 'Admin',
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setTimetables([...timetables, newTT]);
    }

    setIsCreatingExam(false);
    toast.success(editingExamId ? "Examination updated successfully" : "Examination created successfully");
  };
  
  const handleDeleteExam = (id: string) => {
    setExamToDelete(id);
  };

  const confirmDeleteExam = () => {
    if (examToDelete) {
      setExams(exams.filter(e => e.id !== examToDelete));
      setTimetables(timetables.filter(t => t.examId !== examToDelete));
      if (selectedExam?.id === examToDelete) {
        setSelectedExam(null);
      }
      setExamToDelete(null);
      toast.success("Examination deleted successfully");
    }
  };

  const handleDeleteTimetable = (id: string) => {
    setTimetables(timetables.filter(t => t.id !== id));
    toast.success("Timetable deleted successfully");
  };

  const handleDeleteNotice = (id: string) => {
    setNotices(notices.filter(n => n.id !== id));
    toast.success("Notice deleted successfully");
  };

  // --- RENDER: DELETE CONFIRMATION MODAL ---
  const renderDeleteModal = () => (
    <AnimatePresence>
      {examToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border rounded-xl shadow-lg max-w-md w-full overflow-hidden"
          >
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground">Delete Examination?</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this examination? This action cannot be undone and will remove all associated timetables and notices.
              </p>
            </div>
            <div className="flex border-t border-border bg-accent/30 p-4 gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setExamToDelete(null)}>Cancel</Button>
              <Button className="flex-1 bg-rose-600 text-white hover:bg-rose-700" onClick={confirmDeleteExam}>Delete</Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // --- RENDER: EXAM LIST (BOTH ADMIN & STUDENT) ---
  const renderExamList = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">Examination Module</h2>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Manage and view official examinations</p>
        </div>
        {['faculty', 'hod', 'coordinator'].includes(role) && (
          <div className="flex gap-2">
            <Button onClick={() => setIsGeneratingEligibility(true)} variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10">
              <Sparkles size={16} /> Generate Eligible Student List
            </Button>
            <Button onClick={() => setIsGeneratingSeating(true)} variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10">
              <LayoutGrid size={16} /> Generate Seating Arrangement
            </Button>
            <Button onClick={() => openCreateForm()} className="bg-primary text-primary-foreground gap-2">
              <Plus size={16} /> Create New Examination
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map(exam => (
          <div 
            key={exam.id} 
            onClick={() => { setSelectedExam(exam); setActiveTab('timetable'); }}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Award size={24} />
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider", 
                  exam.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                )}>
                  {exam.status}
                </span>
                {['faculty', 'hod', 'coordinator'].includes(role) && (
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500 hover:bg-blue-50" onClick={() => openCreateForm(exam)}>
                      <Edit size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-rose-500 hover:bg-rose-50" onClick={() => handleDeleteExam(exam.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{exam.name}</h3>
            <div className="space-y-1 mb-4 flex-grow">
              <p className="text-sm text-muted-foreground flex items-center gap-2"><CalendarIcon size={14}/> {exam.startDate} to {exam.endDate}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-2"><GraduationCap size={14}/> Sem: {exam.semester} • Class: {exam.class}</p>
            </div>
            <div className="pt-4 border-t border-border flex justify-end">
              <span className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                Open Examination <ChevronRight size={16} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // --- RENDER: CREATE EXAM FORM (ADMIN) ---
  const renderCreateExamForm = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setIsCreatingExam(false)}><ChevronRight className="rotate-180" /></Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{editingExamId ? 'Edit Examination' : 'Create New Examination'}</h2>
          <p className="text-sm text-muted-foreground">Add Improvement, Backlog, Practical, or Surprise exams</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Examination Name *</label>
            <input type="text" className="w-full p-2 border border-border rounded-lg bg-background" placeholder="e.g. Mid Semester Examination" value={createExamName} onChange={e => setCreateExamName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Academic Year</label>
            <select className="w-full p-2 border border-border rounded-lg bg-background" value={createYear} onChange={e => { setCreateYear(e.target.value); setCreateClasses([]); }}>
              <option value="">Select Year</option>
              <option value="Second Year">2nd Year</option>
              <option value="Third Year">3rd Year</option>
              <option value="Fourth Year">4th Year</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Semester</label>
            <select className="w-full p-2 border border-border rounded-lg bg-background" value={createSemester} onChange={e => setCreateSemester(e.target.value)}>
              <option value="">Select Semester</option>
              <option value="Semester 3">Semester 3</option>
              <option value="Semester 4">Semester 4</option>
              <option value="Semester 5">Semester 5</option>
              <option value="Semester 6">Semester 6</option>
              <option value="Semester 7">Semester 7</option>
              <option value="Semester 8">Semester 8</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Department</label>
            <select className="w-full p-2 border border-border rounded-lg bg-background" value={createDept} onChange={e => { setCreateDept(e.target.value); setCreateClasses([]); }}>
              <option value="">Select Department</option>
              <option value="IT">Information Technology (IT)</option>
              <option value="DS">Data Science (DS)</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Target Classes *</label>
              {mockData.classes.filter(c => (!createYear || c.year === createYear) && (!createDept || c.name.includes(createDept))).length > 0 && (
                <button type="button" onClick={() => {
                  const filtered = mockData.classes.filter(c => (!createYear || c.year === createYear) && (!createDept || c.name.includes(createDept)));
                  if (createClasses.length === filtered.length) {
                    setCreateClasses([]);
                  } else {
                    setCreateClasses(filtered.map(c => c.name));
                  }
                }} className="text-xs font-semibold text-primary hover:underline">
                  {createClasses.length > 0 && createClasses.length === mockData.classes.filter(c => (!createYear || c.year === createYear) && (!createDept || c.name.includes(createDept))).length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>
            {(!createYear && !createDept) ? (
              <p className="text-sm text-muted-foreground italic p-3 bg-muted/30 rounded-lg border border-border">
                Select Academic Year and Department to view available classes.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {mockData.classes.filter(c => (!createYear || c.year === createYear) && (!createDept || c.name.includes(createDept))).map(cls => (
                  <label 
                    key={cls.id} 
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium ${
                      createClasses.includes(cls.name) 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border bg-card hover:border-primary/30 text-foreground'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={createClasses.includes(cls.name)} 
                      onChange={() => {
                        setCreateClasses(prev => 
                          prev.includes(cls.name) ? prev.filter(c => c !== cls.name) : [...prev, cls.name]
                        );
                      }}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    {cls.name}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date *</label>
            <input type="date" className="w-full p-2 border border-border rounded-lg bg-background" value={createStartDate} onChange={e => setCreateStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date *</label>
            <input type="date" className="w-full p-2 border border-border rounded-lg bg-background" value={createEndDate} onChange={e => setCreateEndDate(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea className="w-full p-2 border border-border rounded-lg bg-background h-24" placeholder="Enter details about this exam..." value={createDescription} onChange={e => setCreateDescription(e.target.value)}></textarea>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Timetable Upload (Optional)</label>
            {createTimetableFile ? (
              <div className="p-4 border border-border rounded-lg flex items-center justify-between bg-accent/30">
                <div className="flex items-center gap-3">
                  <FileIcon className="text-primary" size={24} />
                  <div>
                    <p className="text-sm font-bold text-foreground">{createTimetableFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(createTimetableFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <label className="cursor-pointer text-xs font-bold text-blue-500 hover:underline">
                    Replace
                    <input type="file" className="hidden" accept=".pdf,image/*,.doc,.docx" onChange={(e) => e.target.files && setCreateTimetableFile(e.target.files[0])} />
                  </label>
                  <button type="button" onClick={() => setCreateTimetableFile(null)} className="text-xs font-bold text-rose-500 hover:underline">Remove</button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <Upload size={24} className="text-muted-foreground mb-2" />
                <p className="text-sm font-bold text-foreground">Click to upload or drag & drop</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, JPG, PNG (Max 5MB)</p>
                <input type="file" className="hidden" accept=".pdf,image/*,.doc,.docx" onChange={(e) => e.target.files && setCreateTimetableFile(e.target.files[0])} />
              </label>
            )}
          </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border md:col-span-2">
          <Button variant="outline" onClick={() => setIsCreatingExam(false)}>Cancel</Button>
          <Button className="bg-primary text-white" onClick={handleSaveExam}>{editingExamId ? 'Save Changes' : 'Publish Examination'}</Button>
        </div>
      </div>
    </motion.div>
  );

  // --- RENDER: EXAM DETAILS WRAPPER ---
  const renderExamDetails = () => {
    const tabs = ['faculty', 'hod', 'coordinator'].includes(role) 
      ? [
          { id: 'timetable', label: 'Timetable', icon: <CalendarDays size={16} /> },
          { id: 'results', label: 'Result Management', icon: <Award size={16} /> },
          { id: 'analytics', label: 'Result Analytics', icon: <BarChart3 size={16} /> },
          { id: 'info', label: 'Examination Information', icon: <FileText size={16} /> }
        ]
      : [
          { id: 'timetable', label: 'Timetable', icon: <CalendarDays size={16} /> },
          { id: 'results', label: 'Results', icon: <Award size={16} /> },
          { id: 'info', label: 'Examination Information', icon: <FileText size={16} /> }
        ];

    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="icon" onClick={() => setSelectedExam(null)}><ChevronRight className="rotate-180" /></Button>
          <div>
            <h2 className="text-2xl font-black text-foreground">{selectedExam.name}</h2>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <GraduationCap size={14}/> {selectedExam.department} • Sem: {selectedExam.semester} • {selectedExam.startDate}
            </p>
          </div>
        </div>

        <div className="border-b border-border overflow-x-auto hide-scrollbar mb-6">
          <div className="flex gap-6 min-w-max px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-4 text-sm font-bold capitalize transition-all relative flex items-center gap-2",
                  activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="examTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'timetable' && renderTimetable()}
            {activeTab === 'results' && ['faculty', 'hod', 'coordinator'].includes(role) && renderResultManagement()}
            {activeTab === 'results' && role === 'student' && renderStudentResults()}
            {activeTab === 'analytics' && ['faculty', 'hod', 'coordinator'].includes(role) && renderResultAnalytics()}
            {activeTab === 'info' && renderExamInformation()}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  // --- RENDER: TIMETABLE (ADMIN & STUDENT) ---
  const renderTimetable = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">Uploaded Timetables</h3>
          <p className="text-sm text-muted-foreground">Official examination schedules</p>
        </div>
        {['faculty', 'hod', 'coordinator'].includes(role) && (
          <Button className="gap-2 bg-primary">
            <Upload size={16}/> Upload Timetable
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {timetables.filter(t => t.examId === selectedExam.id).length === 0 ? (
          <div className="col-span-full p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-accent/20">
            <CalendarDays size={48} className="mx-auto mb-4 opacity-20" />
            <p>No timetable uploaded yet.</p>
          </div>
        ) : (
          timetables.filter(t => t.examId === selectedExam.id).map(tt => (
            <div key={tt.id} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <FileIcon size={24} />
                </div>
                <span className="text-xs font-bold text-muted-foreground">{tt.size}</span>
              </div>
              <h4 className="font-bold text-foreground truncate mb-1">{tt.name}</h4>
              <div className="space-y-1 mb-6 flex-grow">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><GraduationCap size={12}/> Class: {selectedExam.class} • Sem: {selectedExam.semester}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Users size={12}/> {tt.uploadedBy}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><CalendarIcon size={12}/> {tt.uploadDate}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <Button variant="outline" className="w-full text-xs h-9"><Eye size={14} className="mr-1"/> View</Button>
                <Button variant="outline" className="w-full text-xs h-9"><DownloadCloud size={14} className="mr-1"/> Download</Button>
                {['faculty', 'hod', 'coordinator'].includes(role) && (
                  <>
                    <Button variant="outline" className="w-full text-xs h-9 text-blue-500 hover:text-blue-600 hover:bg-blue-50"><RefreshCw size={14} className="mr-1"/> Replace</Button>
                    <Button variant="outline" className="w-full text-xs h-9 text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDeleteTimetable(tt.id)}><Trash2 size={14} className="mr-1"/> Delete</Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // --- RENDER: RESULT MANAGEMENT (ADMIN) ---
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setUploadStatus('reading');
    
    // Simulate AI extraction
    setTimeout(() => {
      setUploadStatus('extracting');
      setTimeout(() => {
        setUploadStatus('completed');
        setIsUploading(false);
        // Generate some mock uploaded marks based on classStudents
        const generatedMarks = classStudents.map(student => ({
          ...student,
          status: 'Draft',
          totalMarks: Math.floor(Math.random() * 40) + 60,
          grade: ['A+', 'A', 'B+', 'B', 'C'][Math.floor(Math.random() * 5)]
        }));
        setUploadedMarks(generatedMarks);
        toast.success("Marks extracted successfully from " + file.name);
      }, 2000);
    }, 1500);
  };

  const handleLoadDemoResult = () => {
    const dummyContent = new Uint8Array(1024 * 145);
    const demoFile = new File([dummyContent], "MidSem_Result_IT2_OOPS.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", lastModified: Date.now() });
    handleFileUpload(demoFile);
  };

  const renderUploadSection = () => {
    if (uploadStatus === 'completed') return null;

    return (
      <div className="bg-card border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center text-center">
        {uploadStatus === 'idle' && (
           <>
             <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
               <Upload size={32} />
             </div>
             <h3 className="text-xl font-bold mb-2">Upload Result File</h3>
             <p className="text-sm text-muted-foreground mb-6">Drag and drop your Excel (.xlsx) or PDF file here, or click to browse.</p>
             <div className="flex gap-4 items-center">
               <label>
                 <Button className="pointer-events-none gap-2"><FileSpreadsheet size={16} /> Browse Files</Button>
                 <input type="file" className="hidden" accept=".xlsx, .xls, .pdf" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
               </label>
               <Button variant="secondary" className="gap-2 border-dashed border-2 bg-background hover:bg-accent/50" onClick={handleLoadDemoResult}>
                 <Target size={16} className="text-emerald-500" /> Load Demo Result
               </Button>
             </div>
           </>
        )}
        {(uploadStatus === 'reading' || uploadStatus === 'extracting') && (
           <div className="flex flex-col items-center space-y-4 w-full max-w-md">
             <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-2 animate-pulse">
               <BrainCircuit size={32} />
             </div>
             <h3 className="text-lg font-bold text-foreground">
               {uploadStatus === 'reading' ? 'Reading File...' : 'Extracting Student Records...'}
             </h3>
             <p className="text-sm text-muted-foreground">Our AI is processing the uploaded document</p>

             {uploadedFile && (
               <div className="w-full bg-background border border-border rounded-lg p-4 flex items-center justify-between text-left mt-4 shadow-sm">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-emerald-100 text-emerald-600 rounded-md">
                     <FileSpreadsheet size={24} />
                   </div>
                   <div>
                     <p className="font-semibold text-sm truncate max-w-[200px]">{uploadedFile.name}</p>
                     <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(2)} KB • {uploadedFile.type.includes('pdf') ? 'PDF Document' : 'Excel Spreadsheet'}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-semibold">Uploaded</p>
                   <p className="text-xs text-muted-foreground">Just now</p>
                 </div>
               </div>
             )}

             <div className="w-full bg-accent rounded-full h-2 overflow-hidden mt-6">
                <motion.div 
                  className="bg-blue-500 h-full"
                  initial={{ width: uploadStatus === 'reading' ? '0%' : '50%' }}
                  animate={{ width: uploadStatus === 'reading' ? '50%' : '100%' }}
                  transition={{ duration: 1.5 }}
                />
             </div>
           </div>
        )}
      </div>
    );
  };

  const renderResultsTable = () => {
    // Determine data source
    const dataSource = uploadStatus === 'completed' ? uploadedMarks : classStudents.map(s => {
        const isDraft = s.id.length % 2 === 0;
        const isPublished = s.id.length % 3 === 0;
        const status = isPublished ? 'Published' : (isDraft ? 'Draft' : 'Pending');
        return {
          ...s,
          status: status,
          totalMarks: '-',
          grade: '-'
        };
    });

    // Apply filters
    const filteredData = dataSource.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(resultSearch.toLowerCase()) || student.enrollmentNumber.toLowerCase().includes(resultSearch.toLowerCase());
      const matchesStatus = resultStatusFilter === 'All' ? true : student.status === resultStatusFilter;
      return matchesSearch && matchesStatus;
    });

    const isAllDraft = filteredData.length > 0 && filteredData.every(s => s.status === 'Draft');

    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col space-y-4 p-4 mt-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow sm:max-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search name or enrollment..." 
                className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background"
                value={resultSearch}
                onChange={e => setResultSearch(e.target.value)}
              />
            </div>
            <select 
              className="py-2 px-3 text-sm border border-border rounded-lg bg-background"
              value={resultStatusFilter}
              onChange={e => setResultStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {isAllDraft && (
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 w-full md:w-auto">
                  <CheckCircle size={16} /> Bulk Approve All
                </Button>
            )}
            {uploadStatus === 'completed' && (
                <Button variant="outline" className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 gap-2 w-full md:w-auto" onClick={() => {
                  setUploadStatus('idle');
                  setUploadedFile(null);
                  setUploadedMarks([]);
                  setResultUploadMethod(null);
                }}>
                  <Trash2 size={16} /> Discard Upload
                </Button>
            )}
          </div>
        </div>

        {uploadStatus === 'completed' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border">
             <div className="text-center">
               <p className="text-xs text-muted-foreground font-semibold uppercase">Total Extracted</p>
               <p className="text-xl font-black">{uploadedMarks.length}</p>
             </div>
             <div className="text-center">
               <p className="text-xs text-muted-foreground font-semibold uppercase">Highest Score</p>
               <p className="text-xl font-black text-emerald-500">{Math.max(...uploadedMarks.map(m => m.totalMarks || 0))}</p>
             </div>
             <div className="text-center">
               <p className="text-xs text-muted-foreground font-semibold uppercase">Average Score</p>
               <p className="text-xl font-black text-blue-500">{(uploadedMarks.reduce((acc, curr) => acc + (curr.totalMarks || 0), 0) / (uploadedMarks.length || 1)).toFixed(1)}</p>
             </div>
             <div className="text-center">
               <p className="text-xs text-muted-foreground font-semibold uppercase">Status</p>
               <p className="text-xl font-black text-amber-500">Draft</p>
             </div>
          </div>
        )}

        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-accent/50 text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Enrollment No.</th>
                <th className="px-4 py-3 text-center">Total Marks</th>
                <th className="px-4 py-3 text-center">Grade</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map(student => (
                <tr key={student.id} className="hover:bg-accent/20">
                  <td className="px-4 py-3 font-bold text-foreground">{student.name}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{student.enrollmentNumber}</td>
                  <td className="px-4 py-3 text-center font-bold">{student.totalMarks}</td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span className={cn(
                      "px-2 py-1 rounded-md", 
                      student.grade === 'A+' || student.grade === 'A' ? "bg-emerald-100 text-emerald-700" :
                      student.grade === 'B+' || student.grade === 'B' ? "bg-blue-100 text-blue-700" :
                      student.grade === 'C' ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"
                    )}>
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      student.status === 'Published' ? 'bg-emerald-100 text-emerald-700' :
                      student.status === 'Draft' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    )}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                       <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setEnteringMarksForStudent(student)}>
                         <Edit size={14} className="text-blue-500" />
                       </Button>
                       {student.status === 'Draft' && (
                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                           <CheckCircle size={14} className="text-emerald-500" />
                         </Button>
                       )}
                       {student.status === 'Draft' && (
                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-rose-500">
                           <Trash2 size={14} />
                         </Button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderResultManagement = () => {
    const examClasses = selectedExam?.class ? selectedExam.class.split(',').map((c: string) => c.trim()) : [];

    if (enteringMarksForStudent) return renderStudentResultEntry();

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
          <div>
            <h3 className="font-bold">Result Management</h3>
            <p className="text-sm text-muted-foreground">Select a class to upload or manage results for {selectedExam?.name}</p>
          </div>
          <div className="flex gap-2">
            <select 
              className="p-2 border border-border rounded-lg bg-background min-w-[200px]"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setResultUploadMethod(null);
                setUploadedFile(null);
                setUploadStatus('idle');
              }}
            >
              <option value="">-- Select Class --</option>
              {examClasses.map((c: string) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
            <Button 
              className="flex-1 h-24 flex flex-col gap-2 border-2 transition-all hover:bg-accent/50" 
              variant={resultUploadMethod === 'upload' ? 'default' : 'outline'}
              disabled={!selectedClass}
              onClick={() => setResultUploadMethod('upload')}
            >
              <FileSpreadsheet size={32} className={resultUploadMethod === 'upload' ? "text-primary-foreground" : "text-emerald-500"} />
              <span className="font-semibold">Upload Results (Excel/PDF)</span>
            </Button>
            <Button 
              className="flex-1 h-24 flex flex-col gap-2 border-2 transition-all hover:bg-accent/50" 
              variant={resultUploadMethod === 'manual' ? 'default' : 'outline'}
              disabled={!selectedClass}
              onClick={() => setResultUploadMethod('manual')}
            >
              <Edit size={32} className={resultUploadMethod === 'manual' ? "text-primary-foreground" : "text-blue-500"} />
              <span className="font-semibold">Manual Entry</span>
            </Button>
        </div>

        {selectedClass && resultUploadMethod === 'upload' && renderUploadSection()}
        {selectedClass && (resultUploadMethod === 'manual' || uploadStatus === 'completed') && renderResultsTable()}
      </div>
    );
  };

  const renderStudentResultEntry = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={() => setEnteringMarksForStudent(null)}><ChevronRight className="rotate-180" /></Button>
        <div>
          <h2 className="text-xl font-bold text-foreground">Result Entry: {enteringMarksForStudent.name}</h2>
          <p className="text-sm text-muted-foreground">Enrollment: {enteringMarksForStudent.enrollmentNumber} • Class: {enteringMarksForStudent.className}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-accent/30 flex justify-between items-center border-b border-border">
          <h3 className="font-bold">Subject Marks</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 text-xs h-8"><Plus size={14}/> Add Subject</Button>
            <Button variant="outline" size="sm" className="gap-2 text-xs h-8"><Users size={14}/> Add Student</Button>
          </div>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-accent/50 text-muted-foreground text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Subject Code</th>
              <th className="px-6 py-4 w-1/3">Subject Name</th>
              <th className="px-6 py-4">Max Marks</th>
              <th className="px-6 py-4">Obtained Marks</th>
              <th className="px-6 py-4">Remarks (Optional)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subjects.slice(0, 5).map((subject, idx) => (
              <tr key={subject.id}>
                <td className="px-6 py-4 font-mono text-muted-foreground">{(subject as any).code || `SUB-10${idx}`}</td>
                <td className="px-6 py-4 font-bold">{subject.name}</td>
                <td className="px-6 py-4 font-bold text-muted-foreground">100</td>
                <td className="px-6 py-4">
                  <input type="number" className="w-24 p-2 text-center border border-border rounded-md bg-background focus:ring-2 focus:ring-primary/50" placeholder="0-100" />
                </td>
                <td className="px-6 py-4">
                  <input type="text" className="w-full p-2 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary/50" placeholder="e.g. Excellent" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-border bg-accent/20 flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button variant="secondary" className="gap-2"><Save size={16}/> Save Draft</Button>
          <Button className="bg-primary text-primary-foreground">Publish Result</Button>
        </div>
      </div>
    </motion.div>
  );

  // --- RENDER: RESULT ANALYTICS (ADMIN) ---
  const renderResultAnalytics = () => {
    const pieData = [{ name: 'Pass', value: 85, color: '#10B981' }, { name: 'Fail', value: 15, color: '#EF4444' }];
    const subjectData = [
      { name: 'Java', avg: 72, max: 98, min: 35 },
      { name: 'DBMS', avg: 68, max: 95, min: 20 },
      { name: 'OS', avg: 75, max: 92, min: 40 },
      { name: 'Network', avg: 81, max: 99, min: 45 },
    ];
    const marksDist = [
      { range: '0-33', count: 15 },
      { range: '33-50', count: 45 },
      { range: '50-75', count: 80 },
      { range: '75-90', count: 50 },
      { range: '90-100', count: 10 },
    ];

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold">Performance Analytics</h3>
        
        {/* KPI Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: '200', color: 'text-blue-500' },
            { label: 'Results Published', value: '185', color: 'text-emerald-500' },
            { label: 'Pending Results', value: '15', color: 'text-amber-500' },
            { label: 'Class Average', value: '74.5%', color: 'text-purple-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col justify-center items-center text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</span>
              <span className={cn("text-2xl font-black", stat.color)}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* KPI Row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Highest Marks', value: '99/100' },
            { label: 'Lowest Marks', value: '12/100' },
            { label: 'Highest Percentage', value: '96.4%' },
            { label: 'Lowest Percentage', value: '32.1%' },
          ].map((stat, i) => (
            <div key={i} className="bg-accent/30 border border-border rounded-xl p-4 flex flex-col justify-center items-center text-center">
              <span className="text-xs font-semibold text-muted-foreground mb-1">{stat.label}</span>
              <span className="text-lg font-bold text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Subject-wise Performance</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                  <Legend iconType="circle" />
                  <Bar dataKey="avg" name="Average Marks" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="max" name="Highest Marks" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Pass vs Fail Percentage</h4>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({name, percent}) => percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : name}>
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
           <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Marks Distribution</h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marksDist} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="count" stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>
    );
  };

  // --- RENDER: EXAM INFORMATION (NOTICES) (ADMIN & STUDENT) ---
  const renderExamInformation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">Examination Notices & Circulars</h3>
          <p className="text-sm text-muted-foreground">Important guidelines and instructions</p>
        </div>
        {['faculty', 'hod', 'coordinator'].includes(role) && (
          <Button className="gap-2 bg-primary">
            <Plus size={16}/> Publish Notice
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notices.filter(n => n.examId === selectedExam.id).map(notice => (
          <div key={notice.id} className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2.5 py-1 rounded-full">
                {notice.category}
              </span>
              <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded", 
                notice.priority === 'High' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
              )}>
                {notice.priority}
              </span>
            </div>
            <h4 className="text-xl font-bold text-foreground mb-2">{notice.title}</h4>
            <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed">{notice.description}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground font-medium">Published: {notice.publishDate}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs"><Eye size={14}/> View</Button>
                {notice.attachment && (
                  <Button variant="outline" size="sm" className="h-8 gap-1 text-xs"><DownloadCloud size={14}/> Attachment</Button>
                )}
                {['faculty', 'hod', 'coordinator'].includes(role) && (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-50"><Edit size={14}/></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-50" onClick={() => handleDeleteNotice(notice.id)}><Trash2 size={14}/></Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {notices.filter(n => n.examId === selectedExam.id).length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-accent/20">
            <FileTextIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p>No notices published for this examination yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  // --- RENDER: STUDENT RESULTS & REPORT CARD ---
  const renderStudentResults = () => {
    if (viewingSubjectResult) return renderStudentSubjectDetail();
    if (viewingReportCard) return renderStudentReportCard();

    // Mock subject results
    const subjectResults = [
      { id: 'sub-1', name: 'Java Programming', obtained: 85, max: 100, percentage: 85, grade: 'A', status: 'Pass' },
      { id: 'sub-2', name: 'DBMS', obtained: 72, max: 100, percentage: 72, grade: 'B+', status: 'Pass' },
      { id: 'sub-3', name: 'Operating Systems', obtained: 91, max: 100, percentage: 91, grade: 'A+', status: 'Pass' },
      { id: 'sub-4', name: 'Software Engineering', obtained: 42, max: 100, percentage: 42, grade: 'P', status: 'Pass' },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-lg font-bold">Subject-wise Results</h3>
          <Button className="bg-primary text-primary-foreground gap-2" onClick={() => setViewingReportCard(true)}>
            <FileText size={16}/> View Overall Report Card
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectResults.map(res => (
            <div key={res.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1",
                  res.status === 'Pass' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700'
                )}>
                  {res.status === 'Pass' ? <CheckCircle size={12}/> : <AlertTriangle size={12}/>}
                  {res.status}
                </span>
                <span className={cn("text-2xl font-black", res.status === 'Pass' ? 'text-emerald-500' : 'text-rose-500')}>{res.grade}</span>
              </div>
              
              <h4 className="text-lg font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{res.name}</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
                <div className="bg-accent/40 rounded-lg p-3 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Marks</p>
                  <p className="text-lg font-black">{res.obtained}<span className="text-xs font-medium text-muted-foreground">/{res.max}</span></p>
                </div>
                <div className="bg-accent/40 rounded-lg p-3 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Percentage</p>
                  <p className="text-lg font-black">{res.percentage}%</p>
                </div>
              </div>

              <Button variant="outline" className="w-full gap-2" onClick={() => setViewingSubjectResult(res)}>
                <Eye size={16}/> View Subject Result
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStudentSubjectDetail = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 max-w-2xl mx-auto">
      <Button variant="ghost" onClick={() => setViewingSubjectResult(null)} className="gap-2 -ml-4"><ChevronRight className="rotate-180"/> Back to Subjects</Button>
      
      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg text-center relative overflow-hidden">
        <div className={cn("absolute top-0 left-0 right-0 h-2", viewingSubjectResult.status === 'Pass' ? 'bg-emerald-500' : 'bg-rose-500')} />
        
        <h2 className="text-3xl font-black text-foreground mb-2 mt-4">{viewingSubjectResult.name}</h2>
        <p className="text-muted-foreground font-medium mb-8">Faculty: Prof. A. Sharma</p>
        
        <div className="flex justify-center items-center gap-12 mb-8">
          <div className="text-center">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Score</p>
            <p className="text-6xl font-black">{viewingSubjectResult.obtained}</p>
            <p className="text-sm font-bold text-muted-foreground mt-2">out of {viewingSubjectResult.max}</p>
          </div>
          <div className="w-px h-24 bg-border"></div>
          <div className="text-center">
             <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Grade</p>
             <p className={cn("text-6xl font-black", viewingSubjectResult.status === 'Pass' ? 'text-emerald-500' : 'text-rose-500')}>{viewingSubjectResult.grade}</p>
             <p className="text-sm font-bold text-muted-foreground mt-2">{viewingSubjectResult.percentage}%</p>
          </div>
        </div>

        <div className="bg-accent/30 rounded-xl p-5 text-left border border-border">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Remarks / Feedback</h4>
          <p className="text-sm leading-relaxed text-foreground">Excellent performance in practical implementations. Keep up the good work for finals.</p>
        </div>
      </div>
    </motion.div>
  );

  const renderStudentReportCard = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={() => setViewingReportCard(false)} className="gap-2 -ml-4"><ChevronRight className="rotate-180"/> Back to Results</Button>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
          <DownloadCloud size={16}/> Download PDF
        </Button>
      </div>

      {/* Official Report Card UI */}
      <div className="bg-white text-black p-12 rounded-xl shadow-2xl border border-slate-200 print-wrapper">
        <div className="text-center border-b-4 border-slate-900 pb-6 mb-8">
          <h1 className="text-4xl font-black uppercase tracking-[0.2em] text-slate-900 mb-3">Acropolis Institute</h1>
          <p className="text-base font-bold text-slate-600 uppercase tracking-widest">Official Examination Report Card</p>
        </div>

        <div className="flex justify-between items-start mb-10 text-sm font-bold text-slate-800 bg-slate-50 p-6 rounded-lg border border-slate-200">
          <div className="space-y-3">
            <p className="text-base"><span className="text-slate-500 uppercase tracking-wider text-xs mr-2">Student Name:</span> {user?.name}</p>
            <p className="text-base"><span className="text-slate-500 uppercase tracking-wider text-xs mr-2">Enrollment No:</span> {user?.enrollmentNumber || '0827IT201010'}</p>
            <p className="text-base"><span className="text-slate-500 uppercase tracking-wider text-xs mr-2">Program:</span> B.Tech Information Technology</p>
          </div>
          <div className="space-y-3 text-right">
            <p className="text-base"><span className="text-slate-500 uppercase tracking-wider text-xs mr-2">Examination:</span> {selectedExam?.name}</p>
            <p className="text-base"><span className="text-slate-500 uppercase tracking-wider text-xs mr-2">Semester:</span> {selectedExam?.semester}</p>
            <p className="text-base"><span className="text-slate-500 uppercase tracking-wider text-xs mr-2">Issue Date:</span> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <table className="w-full text-sm border-collapse border-2 border-slate-800 mb-10">
          <thead className="bg-slate-800 text-white uppercase tracking-wider text-xs">
            <tr>
              <th className="border border-slate-700 p-4 text-left font-bold">Subject Code</th>
              <th className="border border-slate-700 p-4 text-left font-bold w-2/5">Subject Name</th>
              <th className="border border-slate-700 p-4 text-center font-bold">Max Marks</th>
              <th className="border border-slate-700 p-4 text-center font-bold">Obtained</th>
              <th className="border border-slate-700 p-4 text-center font-bold">Grade</th>
            </tr>
          </thead>
          <tbody>
            {[
              { code: 'IT-501', name: 'Java Programming', max: 100, obt: 85, grd: 'A' },
              { code: 'IT-502', name: 'DBMS', max: 100, obt: 72, grd: 'B+' },
              { code: 'IT-503', name: 'Operating Systems', max: 100, obt: 91, grd: 'A+' },
              { code: 'IT-504', name: 'Software Engineering', max: 100, obt: 42, grd: 'P' },
              { code: 'IT-505', name: 'Computer Networks', max: 100, obt: 78, grd: 'A' },
            ].map((sub, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="border border-slate-300 p-4 font-mono text-slate-600 font-semibold">{sub.code}</td>
                <td className="border border-slate-300 p-4 font-bold text-slate-800">{sub.name}</td>
                <td className="border border-slate-300 p-4 text-center font-medium text-slate-500">{sub.max}</td>
                <td className="border border-slate-300 p-4 text-center font-black text-slate-900">{sub.obt}</td>
                <td className="border border-slate-300 p-4 text-center font-black text-emerald-600">{sub.grd}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-100 font-black border-t-2 border-slate-800 text-base">
            <tr>
              <td colSpan={3} className="border border-slate-300 p-4 text-right uppercase tracking-widest text-slate-600">Total Performance</td>
              <td className="border border-slate-300 p-4 text-center text-slate-900">368 / 500</td>
              <td className="border border-slate-300 p-4 text-center text-emerald-600">73.6%</td>
            </tr>
            <tr>
              <td colSpan={3} className="border border-slate-300 p-4 text-right uppercase tracking-widest text-slate-600">Overall Status & Rank</td>
              <td colSpan={2} className="border border-slate-300 p-4 text-center text-slate-900 tracking-wider">
                <span className="text-emerald-600">PASS</span> • Rank 14/120
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="flex justify-between items-end pt-24 px-8">
          <div className="text-center w-48">
            <div className="w-full border-b-2 border-slate-400 mb-3"></div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Class Coordinator</p>
          </div>
          <div className="text-center w-48">
            <div className="w-full border-b-2 border-slate-400 mb-3"></div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Controller of Exams</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const handleGenerateClick = () => {
    setIsSimulating(true);
    setSimulationText('Analyzing student attendance records...');
    
    setTimeout(() => setSimulationText('Evaluating assignment submissions...'), 1000);
    setTimeout(() => setSimulationText('Processing internal marks...'), 2000);
    setTimeout(() => setSimulationText('Finalizing AI Eligibility Matrix...'), 3000);
    setTimeout(() => {
      setIsSimulating(false);
      generateEligibilityList();
    }, 4000);
  };

  // Map dropdown value (e.g. '2nd Year') to mockData student year (e.g. 'Second Year')
  const yearMap: Record<string, string> = {
    '2nd Year': 'Second Year',
    '3rd Year': 'Third Year',
    '4th Year': 'Fourth Year',
  };

  const generateEligibilityList = () => {
    // Simulate AI Engine
    // Filter students by selected year and class
    const mappedYear = elgYear ? yearMap[elgYear] : '';
    const classSts = mockData.students.filter(s => {
      const matchClass = s.className === elgClass || elgClass === '';
      const matchYear = mappedYear ? s.year === mappedYear : true;
      return matchClass && matchYear;
    });
    
    let totalAssg = mockData.assignments?.filter((a: any) => a.classId === classSts[0]?.classId).length || 5;
    
    let eligibleCount = 0;
    let failAttendance = 0;
    let failAssignment = 0;
    let failQuiz = 0;

    const list = classSts.map(student => {
      const attendance = student.overallAttendance;
      
      // Mock assignment %
      const subms = mockData.assignmentSubmissions.filter(s => s.studentId === student.id).length;
      const assignment = totalAssg > 0 ? Math.round((subms / totalAssg) * 100) : 100;
      
      // Mock quiz %
      const atts = mockData.quizAttempts.filter(q => q.studentId === student.id);
      const quiz = atts.length > 0 ? Math.round(atts.reduce((acc, curr) => acc + curr.percentage, 0) / atts.length) : Math.floor(Math.random() * 40) + 40;
      
      // Mock internal %
      const internal = Math.floor(Math.random() * 40) + 50;

      let isEligible = true;
      let reason = '';

      if (elgCriteria.attendance && attendance < elgSettings.attendance) {
        isEligible = false;
        failAttendance++;
        reason = 'Attendance Shortage';
      } else if (elgCriteria.assignment && assignment < elgSettings.assignment) {
        isEligible = false;
        failAssignment++;
        reason = 'Low Assignment Submissions';
      } else if (elgCriteria.quiz && quiz < elgSettings.quiz) {
        isEligible = false;
        failQuiz++;
        reason = 'Low Quiz Performance';
      } else if (elgCriteria.internalMarks && internal < elgSettings.internal) {
        isEligible = false;
        reason = 'Low Internal Marks';
      }

      if (isEligible) eligibleCount++;

      return {
        ...student,
        attendance,
        assignment,
        quiz,
        internal,
        isEligible,
        reason
      };
    });

    // Sort Alpha A-Z
    list.sort((a, b) => a.name.localeCompare(b.name));

    const insights = {
      total: list.length,
      eligible: eligibleCount,
      notEligible: list.length - eligibleCount,
      percentage: Math.round((eligibleCount / (list.length || 1)) * 100),
      failAttendance,
      failAssignment,
      failQuiz
    };

    setElgInsights(insights);
    setElgGeneratedList(list);
  };

  const handleExportCSV = () => {
    if (!elgGeneratedList) return;
    
    const headers = ['Student Name', 'Enrollment No', 'Class', 'Attendance %', 'Assignment %', 'Quiz %', 'Internal %', 'Status', 'Reason'];
    const rows = elgGeneratedList.map(s => [
      s.name,
      s.enrollmentNumber,
      s.className,
      s.attendance,
      s.assignment,
      s.quiz,
      s.internal,
      s.isEligible ? 'Eligible' : 'Not Eligible',
      s.reason || 'N/A'
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Eligibility_List_${elgClass}.csv`.replace(/\s+/g, '_'));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderEligibilityGenerator = () => {
    // Output UI
    if (elgGeneratedList) {
      let filtered = elgGeneratedList.filter(s => {
        if (elgFilter.status === 'Eligible' && !s.isEligible) return false;
        if (elgFilter.status === 'Not Eligible' && s.isEligible) return false;
        if (elgFilter.search && !s.name.toLowerCase().includes(elgFilter.search.toLowerCase()) && !s.enrollmentNumber.toLowerCase().includes(elgFilter.search.toLowerCase())) return false;
        return true;
      });

      if (elgFilter.sort === 'Alpha') filtered.sort((a, b) => a.name.localeCompare(b.name));
      if (elgFilter.sort === 'Enrollment') filtered.sort((a, b) => a.enrollmentNumber.localeCompare(b.enrollmentNumber));
      if (elgFilter.sort === 'Attendance') filtered.sort((a, b) => b.attendance - a.attendance);

      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => setElgGeneratedList(null)}><ChevronRight className="rotate-180" /></Button>
            <div>
              <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
                <Sparkles className="text-primary"/> Eligibility Analysis Report
              </h2>
              <p className="text-sm text-muted-foreground">Class: {elgClass} • {elgSemester} • Examination: {elgExam}</p>
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" className="gap-2" onClick={handlePrint}><DownloadCloud size={16}/> PDF</Button>
              <Button variant="outline" className="gap-2" onClick={handleExportCSV}><FileSpreadsheet size={16}/> CSV</Button>
              <Button variant="outline" className="gap-2" onClick={handlePrint}><Printer size={16}/> Print</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Students</p>
              <p className="text-3xl font-black text-blue-500">{elgInsights.total}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Eligible</p>
              <p className="text-3xl font-black text-emerald-500">{elgInsights.eligible}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Not Eligible</p>
              <p className="text-3xl font-black text-rose-500">{elgInsights.notEligible}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Eligibility %</p>
              <p className="text-3xl font-black text-purple-500">{elgInsights.percentage}%</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden">
            <BrainCircuit className="absolute -right-4 -bottom-4 text-indigo-500/10 w-32 h-32" />
            <h3 className="font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center gap-2">
              <BrainCircuit size={18}/> AI Eligibility Insights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-indigo-500/10">
                <p className="text-sm font-medium">✨ {elgInsights.eligible} students are fully eligible for the examination.</p>
              </div>
              {elgInsights.failAttendance > 0 && (
                <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-indigo-500/10">
                  <p className="text-sm font-medium text-rose-600 dark:text-rose-400">⚠️ {elgInsights.failAttendance} students are not eligible due to attendance shortage.</p>
                </div>
              )}
              {elgInsights.failAssignment > 0 && (
                <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-indigo-500/10">
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">📝 {elgInsights.failAssignment} students missed eligibility because of low assignment submissions.</p>
                </div>
              )}
              {elgInsights.failQuiz > 0 && (
                <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-indigo-500/10">
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">🎯 {elgInsights.failQuiz} students failed due to low quiz performance.</p>
                </div>
              )}
              <div className="bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20 sm:col-span-2">
                <p className="text-sm font-bold text-indigo-800 dark:text-indigo-300">
                  Most common reason for ineligibility: {
                    Math.max(elgInsights.failAttendance, elgInsights.failAssignment, elgInsights.failQuiz) === elgInsights.failAttendance && elgInsights.failAttendance > 0 ? 'Attendance below threshold' :
                    Math.max(elgInsights.failAttendance, elgInsights.failAssignment, elgInsights.failQuiz) === elgInsights.failAssignment && elgInsights.failAssignment > 0 ? 'Low assignment submission' :
                    elgInsights.notEligible > 0 ? 'Low quiz performance' : 'None'
                  }.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-6">
            <div className="p-4 border-b border-border bg-accent/30 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                  type="text" 
                  placeholder="Search student..." 
                  className="pl-9 pr-4 py-2 w-full text-sm border border-border rounded-lg bg-background"
                  value={elgFilter.search}
                  onChange={e => setElgFilter({...elgFilter, search: e.target.value})}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <select 
                  className="p-2 text-sm border border-border rounded-lg bg-background flex-1 sm:flex-none"
                  value={elgFilter.status}
                  onChange={e => setElgFilter({...elgFilter, status: e.target.value})}
                >
                  <option value="All">All Status</option>
                  <option value="Eligible">Eligible Only</option>
                  <option value="Not Eligible">Not Eligible Only</option>
                </select>
                <select 
                  className="p-2 text-sm border border-border rounded-lg bg-background flex-1 sm:flex-none"
                  value={elgFilter.sort}
                  onChange={e => setElgFilter({...elgFilter, sort: e.target.value})}
                >
                  <option value="Alpha">Sort: A-Z</option>
                  <option value="Enrollment">Sort: Enrollment No</option>
                  <option value="Attendance">Sort: Attendance</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-accent/50 text-muted-foreground text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">S.No.</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Enrollment Number</th>
                    <th className="px-4 py-3">Class</th>
                    <th className="px-4 py-3 text-center">Attendance %</th>
                    <th className="px-4 py-3 text-center">Assignment %</th>
                    <th className="px-4 py-3 text-center">Quiz %</th>
                    <th className="px-4 py-3 text-center">Eligibility Status</th>
                    <th className="px-4 py-3 text-center">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-accent/20">
                      <td className="px-4 py-3 font-medium text-muted-foreground">{idx + 1}</td>
                      <td className="px-4 py-3 font-bold">{s.name}</td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{s.enrollmentNumber}</td>
                      <td className="px-4 py-3">{s.className}</td>
                      <td className="px-4 py-3 text-center font-medium">
                        <span className={s.attendance < elgSettings.attendance && elgCriteria.attendance ? 'text-rose-500' : 'text-emerald-500'}>{s.attendance}%</span>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">
                        <span className={s.assignment < elgSettings.assignment && elgCriteria.assignment ? 'text-rose-500' : 'text-emerald-500'}>{s.assignment}%</span>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">
                        <span className={s.quiz < elgSettings.quiz && elgCriteria.quiz ? 'text-rose-500' : 'text-emerald-500'}>{s.quiz}%</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 w-max mx-auto",
                          s.isEligible ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        )}>
                          {s.isEligible ? <CheckCircle size={12}/> : <X size={12}/>}
                          {s.isEligible ? 'Eligible' : 'Not Eligible'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-xs font-bold text-rose-500">
                        {!s.isEligible ? s.reason : '-'}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={10} className="p-8 text-center text-muted-foreground">No students found matching filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      );
    }

    // Input Form UI
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => setIsGeneratingEligibility(false)}><ChevronRight className="rotate-180" /></Button>
          <div>
            <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
              <Sparkles className="text-primary"/> Generate Eligible Student List
            </h2>
            <p className="text-sm text-muted-foreground">Simulate AI-based eligibility analysis</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm p-8 space-y-8">
          
          {isSimulating ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <BrainCircuit className="text-primary animate-pulse" size={32} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-foreground">AI Simulation in Progress</h3>
                <p className="text-muted-foreground animate-pulse font-medium">{simulationText}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Steps 1 – 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1: Academic Year */}
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Step 1: Academic Year</label>
                  <select 
                    className="w-full p-3 border border-border rounded-xl bg-background font-medium focus:ring-2 focus:ring-primary/50"
                    value={elgYear}
                    onChange={e => { setElgYear(e.target.value); setElgSemester(''); setElgClass(''); }}
                  >
                    <option value="">-- Choose Year --</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                {/* Step 2: Semester */}
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Step 2: Semester</label>
                  <select 
                    className="w-full p-3 border border-border rounded-xl bg-background font-medium focus:ring-2 focus:ring-primary/50"
                    value={elgSemester}
                    onChange={e => { setElgSemester(e.target.value); setElgClass(''); }}
                    disabled={!elgYear}
                  >
                    <option value="">-- Choose Semester --</option>
                    {elgYear === '2nd Year' && (<>
                      <option value="Semester 3">Semester 3</option>
                      <option value="Semester 4">Semester 4</option>
                    </>)}
                    {elgYear === '3rd Year' && (<>
                      <option value="Semester 5">Semester 5</option>
                      <option value="Semester 6">Semester 6</option>
                    </>)}
                    {elgYear === '4th Year' && (<>
                      <option value="Semester 7">Semester 7</option>
                      <option value="Semester 8">Semester 8</option>
                    </>)}
                  </select>
                </div>

                {/* Step 3: Class */}
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Step 3: Select Class</label>
                  <select 
                    className="w-full p-3 border border-border rounded-xl bg-background font-medium focus:ring-2 focus:ring-primary/50"
                    value={elgClass}
                    onChange={e => setElgClass(e.target.value)}
                    disabled={!elgSemester}
                  >
                    <option value="">-- Choose Class --</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Step 4: Exam */}
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Step 4: Select Exam</label>
                  <select 
                    className="w-full p-3 border border-border rounded-xl bg-background font-medium focus:ring-2 focus:ring-primary/50"
                    value={elgExam}
                    onChange={e => setElgExam(e.target.value)}
                    disabled={!elgClass}
                  >
                    <option value="">-- Choose Examination --</option>
                    <option value="Mid Semester Examination">Mid Semester Examination</option>
                    <option value="End Semester Examination">End Semester Examination</option>
                    <option value="Custom Examination">Custom Examination</option>
                  </select>
                </div>
              </div>

              <hr className="border-border" />

              {/* Step 5 */}
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground block mb-2">Step 5: Eligibility Criteria</label>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  
                  {/* Attendance */}
                  <div className={cn("border rounded-xl p-4 transition-all", elgCriteria.attendance ? 'border-primary bg-primary/5' : 'border-border bg-background')}>
                    <label className="flex items-start gap-3 cursor-pointer mb-3">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary" checked={elgCriteria.attendance} onChange={e => setElgCriteria({...elgCriteria, attendance: e.target.checked})} />
                      <div>
                        <span className="font-bold text-foreground">Attendance</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Filter based on overall class attendance.</p>
                      </div>
                    </label>
                    {elgCriteria.attendance && (
                      <div className="ml-7 mt-2">
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Minimum Attendance Required (%)</label>
                        <input type="number" className="w-full p-2 text-sm border border-border rounded-lg bg-background" value={elgSettings.attendance} onChange={e => setElgSettings({...elgSettings, attendance: Number(e.target.value)})} />
                      </div>
                    )}
                  </div>

                  {/* Assignment */}
                  <div className={cn("border rounded-xl p-4 transition-all", elgCriteria.assignment ? 'border-primary bg-primary/5' : 'border-border bg-background')}>
                    <label className="flex items-start gap-3 cursor-pointer mb-3">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary" checked={elgCriteria.assignment} onChange={e => setElgCriteria({...elgCriteria, assignment: e.target.checked})} />
                      <div>
                        <span className="font-bold text-foreground">Assignment Submission</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Filter based on submitted assignments.</p>
                      </div>
                    </label>
                    {elgCriteria.assignment && (
                      <div className="ml-7 mt-2">
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Minimum Submission Rate (%)</label>
                        <input type="number" className="w-full p-2 text-sm border border-border rounded-lg bg-background" value={elgSettings.assignment} onChange={e => setElgSettings({...elgSettings, assignment: Number(e.target.value)})} />
                      </div>
                    )}
                  </div>

                  {/* Quiz */}
                  <div className={cn("border rounded-xl p-4 transition-all", elgCriteria.quiz ? 'border-primary bg-primary/5' : 'border-border bg-background')}>
                    <label className="flex items-start gap-3 cursor-pointer mb-3">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary" checked={elgCriteria.quiz} onChange={e => setElgCriteria({...elgCriteria, quiz: e.target.checked})} />
                      <div>
                        <span className="font-bold text-foreground">Quiz Performance</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Filter based on average quiz scores.</p>
                      </div>
                    </label>
                    {elgCriteria.quiz && (
                      <div className="ml-7 mt-2">
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Minimum Average Quiz Marks (%)</label>
                        <input type="number" className="w-full p-2 text-sm border border-border rounded-lg bg-background" value={elgSettings.quiz} onChange={e => setElgSettings({...elgSettings, quiz: Number(e.target.value)})} />
                      </div>
                    )}
                  </div>

                  {/* Internal Marks */}
                  <div className={cn("border rounded-xl p-4 transition-all", elgCriteria.internalMarks ? 'border-primary bg-primary/5' : 'border-border bg-background')}>
                    <label className="flex items-start gap-3 cursor-pointer mb-3">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary" checked={elgCriteria.internalMarks} onChange={e => setElgCriteria({...elgCriteria, internalMarks: e.target.checked})} />
                      <div>
                        <span className="font-bold text-foreground">Previous Internal Marks</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Filter based on internal evaluations.</p>
                      </div>
                    </label>
                    {elgCriteria.internalMarks && (
                      <div className="ml-7 mt-2">
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Minimum Internal Percentage (%)</label>
                        <input type="number" className="w-full p-2 text-sm border border-border rounded-lg bg-background" value={elgSettings.internal} onChange={e => setElgSettings({...elgSettings, internal: Number(e.target.value)})} />
                      </div>
                    )}
                  </div>

                  {/* Events */}
                  <div className={cn("border rounded-xl p-4 transition-all lg:col-span-2", elgCriteria.event ? 'border-primary bg-primary/5' : 'border-border bg-background')}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary" checked={elgCriteria.event} onChange={e => setElgCriteria({...elgCriteria, event: e.target.checked})} />
                      <div>
                        <span className="font-bold text-foreground">Event Participation (Optional)</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Consider co-curricular event participation.</p>
                      </div>
                    </label>
                  </div>

                </div>
              </div>

              <div className="pt-6 border-t border-border flex justify-end">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground gap-2 font-bold w-full sm:w-auto"
                  disabled={!elgYear || !elgSemester || !elgClass || !elgExam || (!elgCriteria.attendance && !elgCriteria.assignment && !elgCriteria.quiz && !elgCriteria.internalMarks && !elgCriteria.event)}
                  onClick={handleGenerateClick}
                >
                  <BrainCircuit size={18} className="animate-pulse"/> Generate Eligible Student List
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  const handleAddRoom = () => {
    if (!newRoomName || !newRoomBenches) return;
    const benches = parseInt(newRoomBenches);
    setSeatRooms([...seatRooms, { 
      id: Date.now().toString(), 
      name: newRoomName, 
      number: newRoomNumber, 
      benches: benches, 
      capacity: benches * seatingConfig.maxPerBench 
    }]);
    setNewRoomName('');
    setNewRoomNumber('');
    setNewRoomBenches('');
  };

  const handleGenerateSeatingClick = () => {
    setIsSimulatingSeating(true);
    setSimulationText('Analyzing class strengths and room capacities...');
    
    setTimeout(() => setSimulationText('Distributing students to avoid same-class adjacent seating...'), 1500);
    setTimeout(() => setSimulationText('Finalizing AI seating matrix...'), 3000);
    setTimeout(() => {
      setIsSimulatingSeating(false);
      
      const totalCapacity = seatRooms.reduce((acc, r) => acc + (r.benches * seatingConfig.maxPerBench), 0);
      const totalStudents = seatClasses.length * 45; // arbitrary mock
      
      setSeatingGenerated({
        totalStudents,
        roomsUtilized: seatRooms.length,
        totalCapacity,
        roomAllocations: seatRooms.map((r, i) => ({
          ...r,
          allocated: Math.min(r.benches * seatingConfig.maxPerBench, Math.floor(totalStudents / (seatRooms.length || 1))),
          classes: seatClasses.slice(i % (seatClasses.length || 1), (i % (seatClasses.length || 1)) + 2)
        }))
      });
    }, 4500);
  };

  const renderSeatingGenerator = () => {
    if (seatingGenerated) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => setSeatingGenerated(null)}><ChevronRight className="rotate-180" /></Button>
            <div>
              <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
                <LayoutGrid className="text-primary"/> Seating Arrangement Generated
              </h2>
              <p className="text-sm text-muted-foreground">AI-optimized examination seating plan</p>
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" className="gap-2" onClick={handlePrint}><DownloadCloud size={16}/> PDF</Button>
              <Button variant="outline" className="gap-2" onClick={handlePrint}><Printer size={16}/> Print</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Students</p>
              <p className="text-3xl font-black text-blue-500">{seatingGenerated.totalStudents}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Rooms Utilized</p>
              <p className="text-3xl font-black text-emerald-500">{seatingGenerated.roomsUtilized}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Capacity</p>
              <p className="text-3xl font-black text-purple-500">{seatingGenerated.totalCapacity}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {seatingGenerated.roomAllocations.map((room: any) => (
              <div key={room.id} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{room.name}</h3>
                    <p className="text-sm text-muted-foreground">Room: {room.number}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {Math.round((room.allocated / (room.capacity || 1)) * 100)}%
                  </div>
                </div>
                <div className="space-y-2 mb-4 flex-grow">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Allocated</span>
                    <span className="font-bold">{room.allocated} / {room.capacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Benches</span>
                    <span className="font-bold">{room.benches} ({seatingConfig.maxPerBench}/bench)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Classes</span>
                    <span className="font-bold truncate max-w-[150px]">{room.classes.join(', ')}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-border mt-auto">
                  <Button variant="outline" className="w-full gap-2">
                    <Eye size={16}/> View Detailed Plan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => setIsGeneratingSeating(false)}><ChevronRight className="rotate-180" /></Button>
          <div>
            <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
              <LayoutGrid className="text-primary"/> Generate Seating Arrangement
            </h2>
            <p className="text-sm text-muted-foreground">Create optimal examination seating plans</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm p-8">
          
          {isSimulatingSeating ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <BrainCircuit className="text-primary animate-pulse" size={32} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-foreground">AI Seating Generation in Progress</h3>
                <p className="text-muted-foreground animate-pulse font-medium">{simulationText}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Step indicator */}
              <div className="flex items-center justify-between relative mb-8">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-border -z-10"></div>
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex flex-col items-center gap-2 bg-card px-2">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors", 
                      seatingStep === step ? "bg-primary text-primary-foreground border-primary" : 
                      seatingStep > step ? "bg-emerald-500 text-white border-emerald-500" : "bg-background text-muted-foreground border-border"
                    )}>
                      {seatingStep > step ? <CheckCircle size={20}/> : step}
                    </div>
                    <span className={cn("text-xs font-bold uppercase tracking-wider", seatingStep >= step ? "text-foreground" : "text-muted-foreground")}>
                      {step === 1 ? 'Classes' : step === 2 ? 'Rooms' : 'Config'}
                    </span>
                  </div>
                ))}
              </div>

              {seatingStep === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground block">Select Classes for Seating</label>
                    <div className="flex flex-wrap gap-3">
                      {classes.map(cls => (
                        <label 
                          key={cls} 
                          className={cn("flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium",
                            seatClasses.includes(cls) ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card hover:border-primary/30 text-foreground'
                          )}
                        >
                          <input 
                            type="checkbox" 
                            checked={seatClasses.includes(cls)} 
                            onChange={() => {
                              setSeatClasses(prev => prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]);
                            }}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                          />
                          {cls}
                        </label>
                      ))}
                    </div>
                    {seatClasses.length === 0 && (
                      <p className="text-sm text-amber-500 mt-2 flex items-center gap-1"><AlertTriangle size={14}/> Please select at least one class.</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button 
                      className="bg-primary text-primary-foreground gap-2" 
                      disabled={seatClasses.length === 0}
                      onClick={() => setSeatingStep(2)}
                    >
                      Next Step <ChevronRight size={16}/>
                    </Button>
                  </div>
                </div>
              )}

              {seatingStep === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Manage Examination Rooms</label>
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-md">{seatRooms.length} Rooms Added</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-accent/30 p-4 rounded-xl border border-border">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Room Name/Type</label>
                      <input type="text" placeholder="e.g. Lab 1, Hall A" className="w-full p-2 text-sm border border-border rounded-lg bg-background" value={newRoomName} onChange={e => setNewRoomName(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Room Number</label>
                      <input type="text" placeholder="e.g. 101, 305" className="w-full p-2 text-sm border border-border rounded-lg bg-background" value={newRoomNumber} onChange={e => setNewRoomNumber(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Total Benches</label>
                      <input type="number" placeholder="e.g. 30" className="w-full p-2 text-sm border border-border rounded-lg bg-background" value={newRoomBenches} onChange={e => setNewRoomBenches(e.target.value)} />
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full bg-slate-900 text-white hover:bg-slate-800" onClick={handleAddRoom} disabled={!newRoomName || !newRoomBenches}>Add Room</Button>
                    </div>
                  </div>

                  {seatRooms.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {seatRooms.map(room => (
                        <div key={room.id} className="bg-background border border-border rounded-lg p-3 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-sm">{room.name} <span className="text-muted-foreground font-normal">({room.number})</span></p>
                            <p className="text-xs text-muted-foreground">{room.benches} Benches</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-50" onClick={() => setSeatRooms(seatRooms.filter(r => r.id !== room.id))}>
                            <Trash2 size={14}/>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 border border-dashed border-border rounded-xl bg-accent/20">
                      <p className="text-sm text-muted-foreground">No rooms added yet. Add rooms to distribute seating.</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-4 border-t border-border">
                    <Button variant="outline" onClick={() => setSeatingStep(1)}>
                      <ChevronRight size={16} className="rotate-180 mr-1"/> Back
                    </Button>
                    <Button 
                      className="bg-primary text-primary-foreground gap-2" 
                      disabled={seatRooms.length === 0}
                      onClick={() => setSeatingStep(3)}
                    >
                      Next Step <ChevronRight size={16}/>
                    </Button>
                  </div>
                </div>
              )}

              {seatingStep === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground block mb-2">Algorithm Configuration</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Students per Bench</label>
                        <select 
                          className="w-full p-2 border border-border rounded-lg bg-background"
                          value={seatingConfig.maxPerBench}
                          onChange={e => setSeatingConfig({...seatingConfig, maxPerBench: parseInt(e.target.value)})}
                        >
                          <option value="1">1 Student (Strict spacing)</option>
                          <option value="2">2 Students (Standard)</option>
                          <option value="3">3 Students (Dense)</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Fill Strategy</label>
                        <select 
                          className="w-full p-2 border border-border rounded-lg bg-background"
                          value={seatingConfig.fillStrategy}
                          onChange={e => setSeatingConfig({...seatingConfig, fillStrategy: e.target.value})}
                        >
                          <option value="sequential">Sequential (Fill room by room)</option>
                          <option value="balanced">Balanced (Distribute evenly across rooms)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="bg-accent/30 rounded-xl p-5 border border-border">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary" 
                          checked={seatingConfig.avoidSameClass} 
                          onChange={e => setSeatingConfig({...seatingConfig, avoidSameClass: e.target.checked})} 
                        />
                        <div>
                          <span className="font-bold text-foreground block mb-1">Avoid Same-Class Adjacency</span>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            The AI will attempt to interleave students from different classes (e.g., IT-1 next to DS-1) to minimize cheating.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-6 border-t border-border">
                    <Button variant="outline" onClick={() => setSeatingStep(2)}>
                      <ChevronRight size={16} className="rotate-180 mr-1"/> Back
                    </Button>
                    <Button 
                      size="lg"
                      className="bg-primary text-primary-foreground gap-2 font-bold" 
                      onClick={handleGenerateSeatingClick}
                    >
                      <BrainCircuit size={18} className="animate-pulse"/> Generate Plan
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 lg:pb-8">
      {isGeneratingEligibility && ['faculty', 'hod', 'coordinator'].includes(role) ? (
        renderEligibilityGenerator()
      ) : isGeneratingSeating && ['faculty', 'hod', 'coordinator'].includes(role) ? (
        renderSeatingGenerator()
      ) : isCreatingExam && ['faculty', 'hod', 'coordinator'].includes(role) ? (
        renderCreateExamForm()
      ) : selectedExam ? (
        renderExamDetails()
      ) : (
        renderExamList()
      )}
      {renderDeleteModal()}
    </div>
  );
};

export default ExaminationModule;
