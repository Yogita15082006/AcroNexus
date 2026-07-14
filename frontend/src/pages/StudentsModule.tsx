import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { mockData } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import {
  Search, X, GraduationCap, ArrowLeft, Printer,
  Calendar, CheckCircle, Upload, Plus, Eye, Edit, Trash2, AlertTriangle, Users
} from 'lucide-react';
import { ProfileModule } from './ProfileModule';

// Auto-calculate academic year and semester from batch
function calcFromBatch(batch: string) {
  if (!batch || !batch.includes('-')) return { year: '', semester: '' };
  const startYear = parseInt(batch.split('-')[0]);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  const yearsElapsed = currentYear - startYear;
  const academicYear = currentMonth >= 6 ? yearsElapsed + 1 : yearsElapsed;
  const sem = currentMonth >= 6 ? (academicYear - 1) * 2 + 1 : (academicYear - 1) * 2;
  const yearLabels: Record<number, string> = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' };
  const clampedYear = Math.max(1, Math.min(4, academicYear));
  const clampedSem = Math.max(1, Math.min(8, sem));
  return { year: yearLabels[clampedYear] || `${clampedYear}th Year`, semester: `Semester ${clampedSem}` };
}

export const StudentsModule = () => {
  const { role } = useAuth();
  const isHod = role === 'hod';

  const [students, setStudents] = useState<any[]>(mockData.students);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // Dialogs
  const [showUpload, setShowUpload] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState<any | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Form state
  const [form, setForm] = useState({ enrollmentNumber: '', name: '', gender: 'Male', batch: '2024-2028' });

  const batches = ['2023-2027', '2024-2028', '2025-2029'];
  const classesList = Array.from(new Set(mockData.classes.map(c => c.name)));

  const filtered = useMemo(() => {
    let res = students;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(s => s.name.toLowerCase().includes(q) || s.enrollmentNumber.toLowerCase().includes(q));
    }
    if (filterBatch) res = res.filter(s => s.batch === filterBatch);
    if (filterClass) res = res.filter(s => s.className === filterClass);
    if (filterStatus) res = res.filter(s => s.status === filterStatus);
    return res.slice(0, 100); // Limit for performance
  }, [students, searchQuery, filterBatch, filterClass, filterStatus]);

  const stats = useMemo(() => ({
    total: students.length,
    active: students.filter(s => s.status === 'Active').length,
    inactive: students.filter(s => s.status !== 'Active').length,
    batches: new Set(students.map(s => s.batch)).size,
  }), [students]);

  const handleUpload = () => {
    if (!uploadFile) return;
    
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: `AI processing ${uploadFile.name}...`,
        success: () => {
           setStudents(prev => prev.map(s => {
             const { year, semester } = calcFromBatch(s.batch);
             return { 
               ...s, 
               className: s.className === 'Unassigned' ? 'IT-1' : s.className, 
               year, 
               semester: semester.replace('Semester ', '') 
             };
           }));
           return 'AI Processing Complete: Students automatically assigned to Sections & Semester updated.';
        },
        error: 'Failed to process file',
      }
    );
    setShowUpload(false);
    setUploadFile(null);
  };

  const handleAddStudent = () => {
    if (!form.enrollmentNumber || !form.name) { toast.error('Fill all fields'); return; }
    const { year, semester } = calcFromBatch(form.batch);
    const newStudent = {
      id: `STU_NEW_${Date.now()}`,
      ...form,
      email: `${form.name.toLowerCase().replace(/\s/g, '.')}@acropolis.in`,
      phone: `+91 9${Math.floor(Math.random() * 999999999)}`,
      classId: '', className: 'Unassigned', year, semester: semester.replace('Semester ', ''),
      batch: form.batch, branch: 'Information Technology',
      overallAttendance: 0, avatar: `https://ui-avatars.com/api/?name=${form.name}&background=4F46E5&color=fff`,
      status: 'Active', sgpa: {}, cgpa: '0.00', activeBacklogs: 0, subjects: [], batchCoordinator: '-',
    };
    setStudents([newStudent, ...students]);
    setShowAdd(false);
    setForm({ enrollmentNumber: '', name: '', gender: 'Male', batch: '2024-2028' });
    toast.success('Student added successfully');
  };

  const handleEditStudent = () => {
    if (!form.enrollmentNumber || !form.name) { toast.error('Fill all fields'); return; }
    const { year, semester } = calcFromBatch(form.batch);
    setStudents(students.map(s => s.id === showEdit ? {
      ...s, ...form, year, semester: semester.replace('Semester ', ''),
    } : s));
    setShowEdit(false);
    toast.success('Student updated');
  };

  const handleDelete = () => {
    setStudents(students.filter(s => s.id !== showDelete?.id));
    setShowDelete(null);
    toast.success('Student permanently deleted');
  };

  const openEdit = (s: any) => {
    setForm({ enrollmentNumber: s.enrollmentNumber, name: s.name, gender: s.gender, batch: s.batch });
    setShowEdit(s.id);
  };

  // Student Profile View
  if (selectedStudent) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 pb-10">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedStudent(null)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Student List
          </Button>
          <Button variant="outline" onClick={() => window.print()} className="gap-2 bg-primary/5 text-primary border-primary/20">
            <Printer className="w-4 h-4" /> Print
          </Button>
        </div>
        <ProfileModule viewingStudent={selectedStudent} />
      </div>
    );
  }

  // Main list view
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <GraduationCap className="text-primary" size={24} /> Student Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isHod ? 'Manage all students across batches and classes.' : 'View and search student profiles.'}
          </p>
        </div>
        {isHod && (
          <div className="flex gap-2">
            <Button onClick={() => setShowUpload(true)} variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
              <Upload size={16} /> Upload Student List
            </Button>
            <Button onClick={() => setShowAdd(true)} className="gap-2 shadow-md">
              <Plus size={16} /> Add Student
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      {isHod && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: stats.total, icon: <Users size={18}/>, color: 'primary' },
            { label: 'Active', value: stats.active, icon: <CheckCircle size={18}/>, color: 'green-500' },
            { label: 'Inactive', value: stats.inactive, icon: <AlertTriangle size={18}/>, color: 'orange-500' },
            { label: 'Batches', value: stats.batches, icon: <Calendar size={18}/>, color: 'blue-500' },
          ].map((s, i) => (
            <Card key={i} className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${s.color}/10 flex items-center justify-center text-${s.color}`}>{s.icon}</div>
                <div><p className="text-xs text-muted-foreground font-medium">{s.label}</p><p className="text-xl font-bold text-foreground">{s.value}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-end">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name or enrollment..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring">
              <option value="">All Batches</option>
              {batches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring">
              <option value="">All Classes</option>
              {classesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {isHod && (
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            )}
            <Button variant="ghost" size="icon" onClick={() => { setSearchQuery(''); setFilterBatch(''); setFilterClass(''); setFilterStatus(''); }}>
              <X size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="pb-0 pt-5 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Students</CardTitle>
            <Badge variant="secondary">{filtered.length} shown</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-y border-border/60">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Enrollment</th>
                  <th className="px-4 py-3 font-semibold">Gender</th>
                  <th className="px-4 py-3 font-semibold">Batch</th>
                  <th className="px-4 py-3 font-semibold">Year</th>
                  <th className="px-4 py-3 font-semibold">Semester</th>
                  <th className="px-4 py-3 font-semibold">Class</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">No students found</td></tr>
                ) : filtered.map(s => {
                  const { year: calcY, semester: calcS } = calcFromBatch(s.batch);
                  return (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={s.avatar} alt="" className="w-8 h-8 rounded-full border border-border object-cover" />
                          <span className="font-semibold text-foreground">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{s.enrollmentNumber}</td>
                      <td className="px-4 py-3">{s.gender}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{s.batch}</Badge></td>
                      <td className="px-4 py-3 text-xs">{calcY}</td>
                      <td className="px-4 py-3 text-xs">{calcS}</td>
                      <td className="px-4 py-3"><Badge variant="secondary" className="text-xs">{s.className}</Badge></td>
                      <td className="px-4 py-3">
                        <Badge variant={s.status === 'Active' ? 'default' : 'destructive'} className="text-xs">
                          {s.status || 'Active'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => setSelectedStudent(s)}>
                            <Eye size={14} />
                          </Button>
                          {isHod && (
                            <>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => openEdit(s)}>
                                <Edit size={14} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setShowDelete(s)}>
                                <Trash2 size={14} />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Upload size={18} className="text-primary" /> Upload Student List</DialogTitle>
            <DialogDescription>Upload Excel (.xlsx), CSV, or PDF file. Academic Year and Semester are auto-calculated from Batch.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById('student-upload')?.click()}>
              <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">{uploadFile ? uploadFile.name : 'Click to upload or drag & drop'}</p>
              <p className="text-xs text-muted-foreground mt-1">Supports .xlsx, .csv, .pdf</p>
              <input id="student-upload" type="file" className="hidden" accept=".xlsx,.csv,.pdf"
                onChange={e => setUploadFile(e.target.files?.[0] || null)} />
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Expected Columns:</p>
              <p className="text-xs text-muted-foreground">Enrollment Number, Student Name, Gender, Batch (e.g. 2024-2028)</p>
              <p className="text-xs text-primary mt-1">⚡ Academic Year & Semester are auto-calculated from Batch</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setShowUpload(false); setUploadFile(null); }}>Cancel</Button>
            <Button onClick={handleUpload} disabled={!uploadFile}>Upload & Process</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus size={18} className="text-primary" /> Add Student</DialogTitle>
            <DialogDescription>Manually add a student. Year and semester auto-populate from batch.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Enrollment Number</label>
              <Input value={form.enrollmentNumber} onChange={e => setForm({...form, enrollmentNumber: e.target.value})} placeholder="e.g. 0827IT23001" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Student Name</label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Gender</label>
                <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Batch</label>
                <select value={form.batch} onChange={e => setForm({...form, batch: e.target.value})}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                  {batches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            {form.batch && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex gap-4">
                <div><p className="text-[10px] uppercase text-muted-foreground font-bold">Academic Year</p><p className="text-sm font-semibold text-primary">{calcFromBatch(form.batch).year}</p></div>
                <div><p className="text-[10px] uppercase text-muted-foreground font-bold">Semester</p><p className="text-sm font-semibold text-primary">{calcFromBatch(form.batch).semester}</p></div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAddStudent}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={!!showEdit} onOpenChange={() => setShowEdit(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Edit size={18} className="text-primary" /> Edit Student</DialogTitle>
            <DialogDescription>Modify student details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Enrollment Number</label>
              <Input value={form.enrollmentNumber} onChange={e => setForm({...form, enrollmentNumber: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Student Name</label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Gender</label>
                <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Batch</label>
                <select value={form.batch} onChange={e => setForm({...form, batch: e.target.value})}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                  {batches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            {form.batch && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex gap-4">
                <div><p className="text-[10px] uppercase text-muted-foreground font-bold">Academic Year</p><p className="text-sm font-semibold text-primary">{calcFromBatch(form.batch).year}</p></div>
                <div><p className="text-[10px] uppercase text-muted-foreground font-bold">Semester</p><p className="text-sm font-semibold text-primary">{calcFromBatch(form.batch).semester}</p></div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button onClick={handleEditStudent}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!showDelete} onOpenChange={() => setShowDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle size={18} /> Delete Student</DialogTitle>
            <DialogDescription>
              This action is permanent. Are you sure you want to delete <strong>{showDelete?.name}</strong> ({showDelete?.enrollmentNumber})?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Permanently</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
