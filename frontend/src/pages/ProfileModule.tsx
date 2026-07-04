import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Mail, Hash, BookOpen, Users, GraduationCap, Building, Moon, Sun, LogOut, Info, Key, Camera, Eye, EyeOff, Save, Smartphone, CheckCircle2, Lock, Plus, X, Edit } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { mockData } from '../data/mockData';

export const ProfileModule = () => {
  const { user, role, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  // Profile Edit State
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=4F46E5&color=fff&size=128`);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Notifications State
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  // Admin Class Management State
  const [adminClasses, setAdminClasses] = useState<string[]>(user.classes || []);
  const [isEditingClasses, setIsEditingClasses] = useState(false);

  // Academic Edit State
  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [academicData, setAcademicData] = useState({
    year: user.year || '',
    semester: user.semester || '',
    batch: user.batch || '',
    cgpa: user.cgpa || '',
    activeBacklogs: user.activeBacklogs || 0,
    batchCoordinator: user.batchCoordinator || '',
    sgpa: {
      sem1: user.sgpa?.sem1 || '',
      sem2: user.sgpa?.sem2 || '',
      sem3: user.sgpa?.sem3 || '',
      sem4: user.sgpa?.sem4 || '',
      sem5: user.sgpa?.sem5 || '',
      sem6: user.sgpa?.sem6 || '',
      sem7: user.sgpa?.sem7 || '',
      sem8: user.sgpa?.sem8 || '',
    },
    subjects: user.subjects || []
  });
  const [newSubject, setNewSubject] = useState('');

  const handleAddSubject = () => {
    if (newSubject.trim() && !academicData.subjects.includes(newSubject.trim())) {
      setAcademicData({
        ...academicData,
        subjects: [...academicData.subjects, newSubject.trim()]
      });
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (subjectToRemove: string) => {
    setAcademicData({
      ...academicData,
      subjects: academicData.subjects.filter((s: string) => s !== subjectToRemove)
    });
  };

  const handleSaveAcademic = () => {
    // Save to backend logic goes here
    // For prototype, we could update the context but we don't have a setUser in useAuth, so we'll just mock saving.
    setIsEditingAcademic(false);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingProfile(false);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatarPreview(url);
    }
  };

  const toggleClass = (classId: string) => {
    if (adminClasses.includes(classId)) {
      setAdminClasses(adminClasses.filter(id => id !== classId));
    } else {
      setAdminClasses([...adminClasses, classId]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-5xl mx-auto">
      
      {/* PROFESSIONAL PROFILE HEADER */}
      <Card className="bg-card border-border shadow-md overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/80 to-primary w-full relative">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        </div>
        
        <CardContent className="px-6 sm:px-10 pb-8 relative pt-0">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
            
            {/* Avatar with Camera Overlay */}
            <div className="-mt-16 relative group/avatar cursor-pointer shrink-0 z-10" onClick={() => fileInputRef.current?.click()}>
              <div className="relative">
                <img 
                  src={avatarPreview} 
                  alt={user.name} 
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-background shadow-xl object-cover bg-muted transition-all duration-300 group-hover/avatar:scale-[1.02] ring-2 ring-primary/20"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 border-4 border-background rounded-full" title="Online"></div>
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white mb-1" />
                <span className="text-white text-xs font-medium">Update Photo</span>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>

            {/* Profile Info */}
            <div className="pt-2 sm:pt-6 flex-1 text-center sm:text-left space-y-3">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  {user.name}
                </h1>
                <p className="text-lg text-primary font-medium mt-1 flex items-center justify-center sm:justify-start gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {['faculty', 'hod', 'coordinator'].includes(role) ? 'Administrator' : 'Student'}
                  </Badge>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground mt-4">
                {role === 'student' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      <span className="font-medium text-foreground">{user.enrollmentNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>{user.className}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{user.department}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      <span className="font-medium text-foreground">{user.empId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{user.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {adminClasses.length > 0 
                          ? `${adminClasses.length} Assigned Class${adminClasses.length > 1 ? 'es' : ''}`
                          : 'No Assigned Classes'
                        }
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CONTACT INFO */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-4 pt-6 px-6 border-b border-border/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Contact Information</CardTitle>
                <CardDescription>Update your email address and mobile number.</CardDescription>
              </div>
              <Button 
                variant={isEditingProfile ? 'default' : 'outline'}
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="gap-2"
              >
                {isEditingProfile ? 'Cancel' : (
                  <>
                    <Edit className="w-4 h-4" /> Edit
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-6">
              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditingProfile}
                        className="pl-10 bg-background disabled:opacity-70 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Mobile Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!isEditingProfile}
                        className="pl-10 bg-background disabled:opacity-70 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
                {isEditingProfile && (
                  <div className="flex justify-end">
                    <Button type="submit" className="gap-2">
                      <Save className="w-4 h-4" /> Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* CLASS ACCESS MANAGEMENT (ADMIN ONLY) */}
          {['faculty', 'hod', 'coordinator'].includes(role) && (
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Class Access Management</CardTitle>
                  <CardDescription>Manage your assigned classes.</CardDescription>
                </div>
                <Button 
                  variant={isEditingClasses ? 'default' : 'outline'} 
                  className="gap-2"
                  onClick={() => setIsEditingClasses(!isEditingClasses)}
                >
                  {isEditingClasses ? 'Cancel' : (
                    <>
                      <Edit className="w-4 h-4" /> Edit Assigned Classes
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {isEditingClasses ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mockData.classes.map(c => (
                        <label key={c.id} className="flex items-start gap-3 p-4 rounded-xl border-2 border-border/50 bg-background hover:bg-muted/50 cursor-pointer transition-all hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                          <input 
                            type="checkbox" 
                            className="mt-1 rounded border-input text-primary focus:ring-primary w-5 h-5 transition-all cursor-pointer"
                            checked={adminClasses.includes(c.id)}
                            onChange={() => toggleClass(c.id)}
                          />
                          <div className="space-y-1">
                            <p className="text-base font-semibold text-foreground">{c.name}</p>
                            <p className="text-sm text-muted-foreground">{c.year} • {(c as any).department || 'Department'}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="flex justify-end pt-2 gap-3">
                       <Button variant="outline" onClick={() => setIsEditingClasses(false)}>
                         Cancel
                       </Button>
                       <Button 
                        onClick={() => {
                          // In real app, save to backend here
                          setIsEditingClasses(false);
                        }}
                        className="gap-2"
                      >
                        <Save className="w-4 h-4" /> Save Class Assignments
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {adminClasses.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-2">No classes assigned.</p>
                    ) : (
                      adminClasses.map((classId: string) => {
                        const classInfo = mockData.classes.find(c => c.id === classId);
                        return classInfo ? (
                          <div key={classId} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-sm">
                            <Users className="w-4 h-4 opacity-70" />
                            <span className="font-semibold">{classInfo.name}</span>
                            <span className="text-xs opacity-70 border-l border-primary/30 pl-3 py-1">{classInfo.year}</span>
                          </div>
                        ) : null;
                      })
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ASSIGNED SUBJECTS (ADMIN ONLY) */}
          {['faculty', 'hod', 'coordinator'].includes(role) && (
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-border/40">
                <CardTitle className="text-xl">Assigned Subjects</CardTitle>
                <CardDescription>Your teaching assignments for the current session.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {user.classes && user.subjects && user.classes.length > 0 && user.subjects.length > 0 ? (
                  <ul className="space-y-3">
                    {user.classes.flatMap((classId: string) => {
                      const classObj = mockData.classes.find(c => c.id === classId);
                      if (!classObj) return [];
                      
                      const yearFormatted = classObj.year === 'First Year' ? '1st Year' :
                                           classObj.year === 'Second Year' ? '2nd Year' :
                                           classObj.year === 'Third Year' ? '3rd Year' : '4th Year';
                      
                      const semesterFormatted = classObj.year === 'First Year' ? '1' :
                                                classObj.year === 'Second Year' ? '3' :
                                                classObj.year === 'Third Year' ? '5' : '7';

                      return user.subjects.map((subjectId: string) => {
                        const subjectObj = mockData.subjects.find(s => s.id === subjectId);
                        if (!subjectObj) return null;
                        
                        return (
                          <li key={`${classId}-${subjectId}`} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-muted/20 text-sm">
                            <BookOpen className="w-4 h-4 text-primary shrink-0" />
                            <span className="font-medium text-foreground">
                              {yearFormatted} &bull; Semester {semesterFormatted} &bull; {classObj.name} &bull; {subjectObj.name}
                            </span>
                          </li>
                        );
                      }).filter(Boolean);
                    }).slice(0, 5)}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No assigned subjects available.</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* CURRENT SEMESTER SUBJECTS (STUDENT ONLY) */}
          {role === 'student' && (
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-border/40">
                <CardTitle className="text-xl">Current Semester Subjects</CardTitle>
                <CardDescription>Subjects you are currently enrolled in.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {user.subjects && user.subjects.length > 0 ? (
                  <ul className="space-y-3">
                    {user.subjects.map((subject: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-muted/20">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                          {subject.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground text-sm">{subject}</p>
                          <p className="text-xs text-muted-foreground">Subject Code: SUB{idx+101} &bull; Credits: 4</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No subjects enrolled for current semester.</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* ACADEMIC DETAILS (STUDENT ONLY) */}
          {role === 'student' && (
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Academic Record</CardTitle>
                  <CardDescription>Comprehensive view of your academic performance and enrollment.</CardDescription>
                </div>
                <Button 
                  variant={isEditingAcademic ? 'default' : 'outline'}
                  onClick={() => setIsEditingAcademic(!isEditingAcademic)}
                  className="gap-2"
                >
                  {isEditingAcademic ? 'Cancel' : (
                    <>
                      <Edit className="w-4 h-4" /> Edit Details
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {isEditingAcademic ? (
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Academic Year</label>
                        <select 
                          value={academicData.year}
                          onChange={(e) => setAcademicData({...academicData, year: e.target.value})}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select Year</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Semester</label>
                        <select 
                          value={academicData.semester}
                          onChange={(e) => setAcademicData({...academicData, semester: e.target.value})}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
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
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Batch</label>
                        <Input value={academicData.batch} onChange={(e) => setAcademicData({...academicData, batch: e.target.value})} placeholder="e.g. 2021-2025" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">CGPA</label>
                        <Input type="number" step="0.01" max="10" value={academicData.cgpa} onChange={(e) => setAcademicData({...academicData, cgpa: e.target.value})} placeholder="e.g. 8.5" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Active Backlogs</label>
                        <Input type="number" min="0" value={academicData.activeBacklogs} onChange={(e) => setAcademicData({...academicData, activeBacklogs: parseInt(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Batch Coordinator</label>
                        <Input value={academicData.batchCoordinator} onChange={(e) => setAcademicData({...academicData, batchCoordinator: e.target.value})} placeholder="Coordinator Name" />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/40">
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> SGPA per Semester
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                          <div key={sem} className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground">Semester {sem}</label>
                            <Input 
                              type="number" 
                              step="0.01" 
                              max="10"
                              placeholder="SGPA"
                              value={academicData.sgpa[`sem${sem}` as keyof typeof academicData.sgpa]}
                              onChange={(e) => setAcademicData({
                                ...academicData, 
                                sgpa: { ...academicData.sgpa, [`sem${sem}`]: e.target.value }
                              })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/40">
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Current Subjects
                      </h4>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add new subject" 
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubject())}
                        />
                        <Button type="button" onClick={handleAddSubject}><Plus className="w-4 h-4" /></Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {academicData.subjects.map((sub: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-background px-3 py-1.5 text-sm font-medium border-border/60 flex items-center gap-2">
                            {sub}
                            <button type="button" onClick={() => handleRemoveSubject(sub)} className="text-muted-foreground hover:text-destructive">
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button onClick={handleSaveAcademic} className="gap-2">
                        <Save className="w-4 h-4" /> Save Academic Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 border-b border-border/40 bg-muted/20">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Academic Year</p>
                    <p className="text-lg font-semibold text-foreground">{user.year || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Semester</p>
                    <p className="text-lg font-semibold text-foreground">{user.semester || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Batch</p>
                    <p className="text-lg font-semibold text-foreground">{user.batch || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">CGPA</p>
                    <p className="text-lg font-bold text-primary">{user.cgpa ? Number(user.cgpa).toFixed(2) : 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Backlogs</p>
                    <p className={`text-lg font-semibold ${user.activeBacklogs > 0 ? 'text-destructive' : 'text-green-600'}`}>{user.activeBacklogs || 0}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Batch Coordinator</p>
                    <p className="text-lg font-semibold text-foreground">{user.batchCoordinator || 'N/A'}</p>
                  </div>
                </div>

                {/* SGPA Section */}
                <div className="p-6 border-b border-border/40">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Semester Performance (SGPA)
                  </h4>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                      const sgpaValue = user.sgpa ? user.sgpa[`sem${sem}` as keyof typeof user.sgpa] : undefined;
                      return (
                        <div key={sem} className={`rounded-lg border p-2 sm:p-3 text-center shadow-sm flex flex-col justify-center items-center ${sgpaValue ? 'bg-background border-border' : 'bg-muted/30 border-dashed border-border/50 opacity-60'}`}>
                          <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 font-medium">Sem {sem}</div>
                          <div className={`text-sm sm:text-base font-semibold ${sgpaValue ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                            {sgpaValue ? Number(sgpaValue).toFixed(2) : '-'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>


              </>
            )}
          </CardContent>
        </Card>
      )}

          {/* SECURITY */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-4 pt-6 px-6 border-b border-border/40">
              <CardTitle className="text-xl">Security & Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2 md:col-span-2 max-w-md">
                    <label className="text-sm font-semibold text-muted-foreground">Current Password</label>
                    <div className="relative group">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pl-10 pr-10 bg-background"
                        required
                      />
                      <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 max-w-md">
                    <label className="text-sm font-semibold text-muted-foreground">New Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 pr-10 bg-background"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2 max-w-md">
                    <label className="text-sm font-semibold text-muted-foreground">Confirm New Password</label>
                    <div className="relative group">
                      <CheckCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 bg-background"
                        required
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit" disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}>
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* PREFERENCES */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-4 pt-6 px-6 border-b border-border/40">
              <CardTitle className="text-xl">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Theme */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground">Theme Appearance</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10' : 'border-border bg-card hover:bg-muted text-muted-foreground hover:border-muted-foreground/30'}`}
                  >
                    <Sun className="w-4 h-4" /> Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10' : 'border-border bg-card hover:bg-muted text-muted-foreground hover:border-muted-foreground/30'}`}
                  >
                    <Moon className="w-4 h-4" /> Dark
                  </button>
                </div>
              </div>

              <hr className="border-border/40" />

              {/* Notifications */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-muted-foreground">Notifications</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Email Alerts</span>
                  <button 
                    onClick={() => setEmailNotif(!emailNotif)}
                    className={`w-10 h-5 rounded-full transition-colors relative flex items-center shadow-inner ${emailNotif ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  >
                    <span className={`absolute w-4 h-4 rounded-full bg-white transition-all shadow-sm ${emailNotif ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">SMS Alerts</span>
                  <button 
                    onClick={() => setSmsNotif(!smsNotif)}
                    className={`w-10 h-5 rounded-full transition-colors relative flex items-center shadow-inner ${smsNotif ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  >
                    <span className={`absolute w-4 h-4 rounded-full bg-white transition-all shadow-sm ${smsNotif ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* SESSION MANAGEMENT */}
          <Card className="bg-destructive/5 border-destructive/20 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-destructive mb-1">Session Management</h3>
                <p className="text-sm text-muted-foreground">Log out if you notice suspicious activity.</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout Current Device
                </Button>
                <Button variant="destructive" className="w-full" onClick={logout}>
                  Log out all devices
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ABOUT */}
          <Card className="bg-card border-border shadow-sm">
             <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                    <Info className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground">AcroNexus ERP</h4>
                  <p className="text-xs text-muted-foreground">Version 2.4.1 (Stable)</p>
                  <div className="flex gap-4 mt-4 pt-4 border-t border-border/40 w-full justify-center">
                    <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy</a>
                    <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms</a>
                    <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Licenses</a>
                  </div>
                </div>
             </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

