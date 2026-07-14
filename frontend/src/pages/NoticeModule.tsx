import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Bell, FileText, ChevronRight, DownloadCloud, Eye, Plus, Calendar, Clock, Image as ImageIcon,
  Paperclip, Pin, CheckCircle, X, Trash2, Edit, AlertTriangle, Users,
  Search, CalendarDays, FileArchive, Layers, Activity, PieChart, Bold, Italic, Underline, List, Link as LinkIcon
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { mockData } from '../data/mockData';

const CATEGORIES = ['General', 'Academic', 'Examination', 'Assignment', 'Placement', 'Internship', 'Scholarship', 'Event', 'Holiday', 'Workshop', 'Seminar', 'Sports', 'Cultural', 'Urgent', 'Other'];
const PRIORITIES = ['Normal', 'Important', 'High', 'Urgent'];

export const NoticeModule = () => {
  const { role, user } = useAuth();
  const isAdmin = ['hod', 'coordinator'].includes(role);
  const canCreateNotice = isAdmin || role === 'faculty' || role === 'both';

  
  // UI State
  const [currentView, setCurrentView] = useState<'dashboard' | 'create_notice' | 'notice_details'>('dashboard');
  
  // Notice State
  const initialNotices = isAdmin 
    ? mockData.notices 
    : mockData.notices.filter((n: any) => {
        if (role === 'faculty' || role === 'both') {
          const facultyClassNames = (user?.classes || []).map((c: string) => {
            const parts = c.split('_');
            return parts.length > 1 ? parts[1].replace(/(\D+)(\d+)/, '$1-$2') : c;
          });
          const facultyYears = (user?.classes || []).map((c: string) => 
            c.startsWith('1_') ? 'First Year' :
            c.startsWith('2_') ? 'Second Year' : 
            c.startsWith('3_') ? 'Third Year' : 
            c.startsWith('4_') ? 'Fourth Year' : ''
          );
          
          let matchesClass = true;
          if (n.targetClasses && n.targetClasses.length > 0) {
             matchesClass = n.targetClasses.some((tc: string) => facultyClassNames.includes(tc));
          }
          
          let matchesYear = true;
          if (n.targetYear) {
             const targetYrMapped = n.targetYear === '1st Year' ? 'First Year' :
                                    n.targetYear === '2nd Year' ? 'Second Year' : 
                                    n.targetYear === '3rd Year' ? 'Third Year' : 
                                    n.targetYear === '4th Year' ? 'Fourth Year' : n.targetYear;
             matchesYear = facultyYears.includes(targetYrMapped);
          }
          
          return matchesClass && matchesYear;
        }

        // Class Matching
        const matchesClass = n.targetClasses && n.targetClasses.length > 0 
           ? (n.targetClasses.includes(user?.className) || n.targetClasses.includes(user?.classId))
           : (n.classId ? n.classId === user?.classId : true);
        
        // Year Matching
        const normalizedUserYear = user?.academicYear || user?.year;
        let matchesYear = true;
        if (n.targetYear) {
          if (n.targetYear === '2nd Year' && normalizedUserYear === 'Second Year') matchesYear = true;
          else if (n.targetYear === '3rd Year' && normalizedUserYear === 'Third Year') matchesYear = true;
          else if (n.targetYear === '4th Year' && normalizedUserYear === 'Fourth Year') matchesYear = true;
          else matchesYear = n.targetYear === normalizedUserYear;
        }

        // Semester Matching
        const normalizedUserSemester = user?.semester; // '3rd', '5th', etc., or 'Semester 3'
        let matchesSemester = true;
        if (n.targetSemester) {
          const expectedNum = String(n.targetSemester).replace(/\D/g, ''); // extracts '3' from 'Semester 3'
          const userNum = normalizedUserSemester ? String(normalizedUserSemester).replace(/\D/g, '') : '';
          matchesSemester = expectedNum === userNum;
        }

        return matchesClass && matchesYear && matchesSemester;
      });
  const [notices] = useState<any[]>(initialNotices);
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null);
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  
  // Create Notice State
  const [newNoticeForm, setNewNoticeForm] = useState<{
    title: string; category: string; priority: string; description: string;
    publishDate: string; expiryDate: string; allowDownloads: boolean; pinNotice: boolean;
    targetYears: string[]; targetSemesters: string[]; targetClasses: string[];
  }>({
    title: '', category: 'General', priority: 'Normal', description: '',
    publishDate: '', expiryDate: '',
    allowDownloads: true, pinNotice: false,
    targetYears: [], targetSemesters: [], targetClasses: []
  });
  const [attachments] = useState<any[]>([]);

  const filteredNoticesList = useMemo(() => {
    return notices.filter(n => {
      const matchSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = filterCategory === 'All' || n.category === filterCategory;
      const matchPriority = filterPriority === 'All' || n.priority === filterPriority;
      return matchSearch && matchCategory && matchPriority;
    }).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }, [notices, searchTerm, filterCategory, filterPriority]);

  // Derived metrics
  const activeNotices = notices.filter(n => n.status === 'Active');
  const draftNotices = notices.filter(n => n.status === 'Draft');
  const archivedNotices = notices.filter(n => n.status === 'Archived');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-rose-500 text-white shadow-rose-500/20';
      case 'High': return 'bg-orange-500 text-white shadow-orange-500/20';
      case 'Important': return 'bg-amber-500 text-white shadow-amber-500/20';
      default: return 'bg-blue-500 text-white shadow-blue-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Examination': return <FileText size={16} />;
      case 'Placement': return <Users size={16} />;
      case 'Academic': return <CalendarDays size={16} />;
      case 'Urgent': return <AlertTriangle size={16} />;
      default: return <Bell size={16} />;
    }
  };

  const renderAdminDashboard = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Notices', value: notices.length, icon: <Layers size={24}/>, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-800' },
          { label: 'Active Notices', value: activeNotices.length, icon: <Activity size={24}/>, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', borderColor: 'border-emerald-200 dark:border-emerald-800' },
          { label: 'Draft Notices', value: draftNotices.length, icon: <FileText size={24}/>, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', borderColor: 'border-amber-200 dark:border-amber-800' },
          { label: 'Archived Notices', value: archivedNotices.length, icon: <FileArchive size={24}/>, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', borderColor: 'border-rose-200 dark:border-rose-800' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl border shadow-sm ${stat.bg} ${stat.borderColor} flex flex-col items-center justify-center text-center transition-transform hover:scale-105 cursor-pointer`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${stat.color} bg-background/50 shadow-sm`}>{stat.icon}</div>
            <h3 className="text-4xl font-black text-foreground leading-none mb-2">{stat.value}</h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-border flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-foreground">Notice Management</h2>
            <p className="text-sm text-muted-foreground font-medium">View, edit, or manage notices for your assigned class.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input type="text" placeholder="Search notices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-border rounded-xl bg-background text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="p-2 border border-border rounded-xl bg-background text-sm font-bold outline-none">
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="p-2 border border-border rounded-xl bg-background text-sm font-bold outline-none">
              <option value="All">All Priorities</option>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 md:p-8 bg-accent/10">
          {filteredNoticesList.map((notice) => (
            <div key={notice.id} className="bg-background border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getPriorityColor(notice.priority)}`}>{notice.priority}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${notice.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : notice.status === 'Draft' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'}`}>{notice.status}</span>
              </div>
              <h3 className="text-lg font-black text-foreground mb-2 line-clamp-2" title={notice.title}>{notice.title}</h3>
              <div className="flex items-center gap-2 mb-4 text-primary font-bold text-[11px] uppercase tracking-wider">
                {getCategoryIcon(notice.category)} {notice.category}
              </div>
              <div className="mt-auto space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <span className="flex items-center gap-1"><CheckCircle size={14} className="text-emerald-500"/> {notice.publishDate}</span>
                  <span className="flex items-center gap-1"><Clock size={14} className="text-rose-500"/> {notice.expiryDate}</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground pt-2 border-t border-border/50">
                   <span className="flex items-center gap-1"><Paperclip size={14}/> {notice.attachments?.length || 0}</span>
                   {notice.isPinned && <span className="flex items-center gap-1 text-amber-500"><Pin size={14}/> Pinned</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1 font-bold text-xs shadow-sm" onClick={() => { setSelectedNotice(notice); setCurrentView('notice_details'); }}><Eye size={14} className="mr-1"/> View</Button>
                <Button variant="outline" size="sm" className="flex-1 font-bold text-xs shadow-sm"><Edit size={14} className="mr-1"/> Edit</Button>
                <Button variant="outline" size="sm" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"><Trash2 size={14}/></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderCreateNotice = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('dashboard')} className="rounded-full hover:bg-accent"><ChevronRight className="rotate-180" /></Button>
        <div>
          <h2 className="text-2xl font-black">Create New Notice</h2>
          <p className="text-muted-foreground font-medium">Publish a new announcement for your assigned class.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* SECTION 1 : BASIC INFORMATION */}
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-accent/30 px-8 py-5 border-b border-border">
            <h3 className="text-lg font-black flex items-center gap-2"><FileText size={20} className="text-primary"/> 1. Notice Information</h3>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Notice Title</label>
              <input type="text" placeholder="e.g. End Semester Exam Schedule" value={newNoticeForm.title} onChange={e => setNewNoticeForm({...newNoticeForm, title: e.target.value})} className="w-full p-4 mt-2 border border-border rounded-xl bg-background font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Category</label>
                <select value={newNoticeForm.category} onChange={e => setNewNoticeForm({...newNoticeForm, category: e.target.value})} className="w-full p-4 mt-2 border border-border rounded-xl bg-background font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                  {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Priority</label>
                <select value={newNoticeForm.priority} onChange={e => setNewNoticeForm({...newNoticeForm, priority: e.target.value})} className="w-full p-4 mt-2 border border-border rounded-xl bg-background font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Notice Description</label>
              <div className="border border-border rounded-xl mt-2 overflow-hidden bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <div className="bg-accent/30 border-b border-border p-2 flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg"><Bold size={16}/></Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg"><Italic size={16}/></Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg"><Underline size={16}/></Button>
                  <div className="w-[1px] h-4 bg-border mx-1"></div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg"><List size={16}/></Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg"><LinkIcon size={16}/></Button>
                </div>
                <textarea placeholder="Write the complete notice content here..." value={newNoticeForm.description} onChange={e => setNewNoticeForm({...newNoticeForm, description: e.target.value})} rows={8} className="w-full p-4 bg-transparent font-medium outline-none resize-y" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2 : ATTACHMENTS */}
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-accent/30 px-8 py-5 border-b border-border">
            <h3 className="text-lg font-black flex items-center gap-2"><Paperclip size={20} className="text-primary"/> 2. Attachments</h3>
          </div>
          <div className="p-8">
            <div className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent/30 hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <DownloadCloud size={32} />
              </div>
              <h4 className="text-lg font-black text-foreground mb-1">Click to upload or drag and drop</h4>
              <p className="text-sm text-muted-foreground font-medium mb-4">Support for PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, CSV, Images, ZIP</p>
              <Button variant="outline" className="font-bold">Browse Files</Button>
            </div>
            
            {attachments.length > 0 && (
              <div className="mt-6 space-y-3">
                {attachments.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-border rounded-xl bg-background">
                     <div className="flex items-center gap-3">
                       <FileText size={18} className="text-primary" />
                       <span className="font-bold text-sm">{file.name}</span>
                     </div>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"><X size={16}/></Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3 : TARGET AUDIENCE */}
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-accent/30 px-8 py-5 border-b border-border">
            <h3 className="text-lg font-black flex items-center gap-2"><Users size={20} className="text-primary"/> 3. Target Audience</h3>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1 block mb-3">Selected Targets</label>
              <div className="flex flex-wrap gap-2 mb-6">
                {newNoticeForm.targetYears.map(yr => (
                  <span key={yr} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    {yr} <X size={14} className="cursor-pointer hover:text-rose-500" onClick={() => setNewNoticeForm({...newNoticeForm, targetYears: newNoticeForm.targetYears.filter(y => y !== yr)})}/>
                  </span>
                ))}
                {newNoticeForm.targetSemesters.map(sem => (
                  <span key={sem} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    {sem} <X size={14} className="cursor-pointer hover:text-rose-500" onClick={() => setNewNoticeForm({...newNoticeForm, targetSemesters: newNoticeForm.targetSemesters.filter(s => s !== sem)})}/>
                  </span>
                ))}
                {newNoticeForm.targetClasses.map(cls => (
                  <span key={cls} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    {cls} <X size={14} className="cursor-pointer hover:text-rose-500" onClick={() => setNewNoticeForm({...newNoticeForm, targetClasses: newNoticeForm.targetClasses.filter(c => c !== cls)})}/>
                  </span>
                ))}
                {newNoticeForm.targetYears.length === 0 && newNoticeForm.targetSemesters.length === 0 && newNoticeForm.targetClasses.length === 0 && (
                  <span className="text-sm text-muted-foreground italic">No targets selected</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1 block mb-3">Academic Years</label>
                <div className="grid grid-cols-2 gap-3">
                  {['2nd Year', '3rd Year', '4th Year'].map(yr => (
                    <label key={yr} className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-accent/30 transition-colors">
                      <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary" checked={newNoticeForm.targetYears.includes(yr)} onChange={e => {
                        if(e.target.checked) setNewNoticeForm({...newNoticeForm, targetYears: [...newNoticeForm.targetYears, yr]});
                        else setNewNoticeForm({...newNoticeForm, targetYears: newNoticeForm.targetYears.filter(y => y !== yr)});
                      }}/>
                      <span className="font-bold text-sm">{yr}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1 block mb-3">Semesters</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map(sem => (
                    <label key={sem} className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-accent/30 transition-colors">
                      <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary" checked={newNoticeForm.targetSemesters.includes(sem)} onChange={e => {
                        if(e.target.checked) setNewNoticeForm({...newNoticeForm, targetSemesters: [...newNoticeForm.targetSemesters, sem]});
                        else setNewNoticeForm({...newNoticeForm, targetSemesters: newNoticeForm.targetSemesters.filter(s => s !== sem)});
                      }}/>
                      <span className="font-bold text-sm">{sem}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1 block mb-3">Target Classes</label>
              <div className="flex items-center gap-3 mb-4">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-sm">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                    checked={newNoticeForm.targetClasses.length === 4}
                    onChange={e => {
                      if(e.target.checked) setNewNoticeForm({...newNoticeForm, targetClasses: ['IT-1', 'IT-2', 'DS-1', 'DS-2']});
                      else setNewNoticeForm({...newNoticeForm, targetClasses: []});
                    }}
                  />
                  Select All
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['IT-1', 'IT-2', 'DS-1', 'DS-2'].map(cls => (
                  <label key={cls} className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-accent/30 transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                      checked={newNoticeForm.targetClasses.includes(cls)}
                      onChange={e => {
                        if(e.target.checked) {
                          setNewNoticeForm({...newNoticeForm, targetClasses: [...newNoticeForm.targetClasses, cls]});
                        } else {
                          setNewNoticeForm({...newNoticeForm, targetClasses: newNoticeForm.targetClasses.filter(c => c !== cls)});
                        }
                      }}
                    />
                    <span className="font-bold text-sm">{cls}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4 : NOTICE SETTINGS */}
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-accent/30 px-8 py-5 border-b border-border">
            <h3 className="text-lg font-black flex items-center gap-2"><CheckCircle size={20} className="text-primary"/> 4. Settings</h3>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Publish Date</label>
                <input type="date" value={newNoticeForm.publishDate} onChange={e => setNewNoticeForm({...newNoticeForm, publishDate: e.target.value})} className="w-full p-4 mt-2 border border-border rounded-xl bg-background font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Expiry Date</label>
                <input type="date" value={newNoticeForm.expiryDate} onChange={e => setNewNoticeForm({...newNoticeForm, expiryDate: e.target.value})} className="w-full p-4 mt-2 border border-border rounded-xl bg-background font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-4 border border-border rounded-xl cursor-pointer hover:bg-accent/30 transition-colors">
                <div>
                  <p className="font-bold text-sm text-foreground">Allow Downloads</p>
                  <p className="text-xs text-muted-foreground">Students can download attachments</p>
                </div>
                <input type="checkbox" checked={newNoticeForm.allowDownloads} onChange={e => setNewNoticeForm({...newNoticeForm, allowDownloads: e.target.checked})} className="w-5 h-5 rounded text-primary focus:ring-primary accent-primary" />
              </label>
              <label className="flex items-center justify-between p-4 border border-border rounded-xl cursor-pointer hover:bg-accent/30 transition-colors">
                <div>
                  <p className="font-bold text-sm text-foreground">Pin Notice</p>
                  <p className="text-xs text-muted-foreground">Keep at the top of the board</p>
                </div>
                <input type="checkbox" checked={newNoticeForm.pinNotice} onChange={e => setNewNoticeForm({...newNoticeForm, pinNotice: e.target.checked})} className="w-5 h-5 rounded text-primary focus:ring-primary accent-primary" />
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 4 : ACTIONS */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border mt-8">
          <Button variant="ghost" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-bold px-6">Delete Draft</Button>
          <Button variant="outline" className="font-bold px-6">Save Draft</Button>
          <Button variant="secondary" className="font-bold px-6 bg-primary/10 text-primary hover:bg-primary/20">Preview</Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-black px-8 rounded-xl shadow-lg shadow-primary/30" onClick={() => { alert('Notice published successfully!'); setCurrentView('dashboard'); }}>Publish Notice</Button>
        </div>
      </div>
    </motion.div>
  );

  const renderNoticeDetails = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('dashboard')} className="rounded-full hover:bg-accent"><ChevronRight className="rotate-180" /></Button>
        <div>
          <h2 className="text-2xl font-black">Notice Details</h2>
          <p className="text-muted-foreground font-medium">View complete notice and attachments.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getPriorityColor(selectedNotice.priority)}`}>{selectedNotice.priority}</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent text-muted-foreground uppercase tracking-wider">{selectedNotice.category}</span>
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 ml-2"><Calendar size={14}/> Published: {selectedNotice.publishDate}</span>
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1"><Clock size={14}/> Expiry: {selectedNotice.expiryDate}</span>
          </div>
          {canCreateNotice && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="font-bold"><Edit size={14} className="mr-2"/> Edit</Button>
              <Button variant="outline" size="sm" className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 font-bold"><Trash2 size={14} className="mr-2"/> Delete</Button>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-black text-foreground mb-6 leading-tight">{selectedNotice.title}</h1>
        
        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none mb-10 text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap">
          {selectedNotice.description}
        </div>

        {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
          <div className="border-t border-border pt-8">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2"><Paperclip size={20} className="text-primary"/> Attachments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedNotice.attachments.map((file: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 border border-border rounded-xl bg-accent/30 hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                      {file.type === 'PDF' ? <FileText size={20}/> : file.type === 'PPT' || file.type === 'PPTX' ? <PieChart size={20}/> : ['DOC', 'DOCX'].includes(file.type) ? <FileText size={20}/> : <ImageIcon size={20}/>}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm text-foreground truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground uppercase font-bold">{file.type} • {file.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10" title="View Attachment"><Eye size={16}/></Button>
                    {(selectedNotice.allowDownloads || canCreateNotice) && <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent" title="Download Attachment"><DownloadCloud size={16}/></Button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderStudentDashboard = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input type="text" placeholder="Search notices by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-background text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="p-3 border border-border rounded-xl bg-background text-sm font-bold flex-1 sm:w-40 outline-none">
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="p-3 border border-border rounded-xl bg-background text-sm font-bold flex-1 sm:w-40 outline-none">
            <option value="All">All Priorities</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNoticesList.filter(n => n.status === 'Active').map((notice) => (
          <div key={notice.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:border-primary/50 transition-colors flex flex-col group cursor-pointer" onClick={() => { setSelectedNotice(notice); setCurrentView('notice_details'); }}>
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getPriorityColor(notice.priority)}`}>{notice.priority}</span>
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1"><Calendar size={14}/> {notice.publishDate}</span>
            </div>
            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-wider">
              {getCategoryIcon(notice.category)} {notice.category}
            </div>
            <h3 className="text-xl font-black text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">{notice.title}</h3>
            <p className="text-sm text-muted-foreground font-medium line-clamp-3 mb-6 flex-1">{notice.description}</p>
            
            <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
              <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                <span className="flex items-center gap-1"><Paperclip size={14}/> {notice.attachments?.length || 0} Attachments</span>
              </div>
              <Button variant="ghost" className="text-primary hover:bg-primary/10 font-bold group-hover:translate-x-1 transition-transform">View Notice <ChevronRight size={16} className="ml-1"/></Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <>
      <div className="bg-background border-b border-border sticky top-0 z-20 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
              <Bell className="text-primary" size={28} /> Notice Board
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              {canCreateNotice ? 'Digital notice management system.' : 'Stay updated with the latest class announcements.'}
            </p>
          </div>
          {canCreateNotice && currentView === 'dashboard' && (
            <Button onClick={() => setCurrentView('create_notice')} className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-primary/20 transition-all gap-2">
              <Plus size={18} /> Create Notice
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-8 max-w-screen-2xl mx-auto pb-24 lg:pb-8">
        {currentView === 'dashboard' && isAdmin && renderAdminDashboard()}
        {currentView === 'create_notice' && canCreateNotice && renderCreateNotice()}
        {currentView === 'dashboard' && !isAdmin && renderStudentDashboard()}
        {currentView === 'notice_details' && selectedNotice && renderNoticeDetails()}
      </div>
    </>
  );
};
