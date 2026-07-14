import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockData } from '../data/mockData';
import { User, Lock, ArrowRight, Sparkles, Eye, EyeOff, Upload, CheckCircle2, X, Mail, Briefcase, BookOpen, GraduationCap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState('student');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regId, setRegId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDepartment, setRegDepartment] = useState('');
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  
  // Coordinator/Faculty Popup State
  const [showCoordinatorPopup, setShowCoordinatorPopup] = useState(false);
  const [newCoordinatorData, setNewCoordinatorData] = useState<any>(null);
  
  // Student Academic Registration States
  const [regYear, setRegYear] = useState('');
  const [regSemester, setRegSemester] = useState('');
  const [regClass, setRegClass] = useState('');
  const [regBatch, setRegBatch] = useState('');
  const [regCgpa, setRegCgpa] = useState('');
  const [regBacklogs, setRegBacklogs] = useState('');
  const [regBatchCoordinator, setRegBatchCoordinator] = useState('');
  const [regSgpas, setRegSgpas] = useState({ sem1: '', sem2: '', sem3: '', sem4: '', sem5: '', sem6: '', sem7: '', sem8: '' });
  const [regSubjects, setRegSubjects] = useState<string[]>([]);
  const [currentSubject, setCurrentSubject] = useState('');

  // Auto-calculate CGPA based on entered SGPAs and selected semester
  useEffect(() => {
    const semNum = parseInt(regSemester.replace(/\D/g, '')) || 0;
    const previousSems = Array.from({ length: Math.max(0, semNum - 1) }, (_, i) => `sem${i + 1}`);
    
    let total = 0;
    let count = 0;
    
    previousSems.forEach(sem => {
      const val = parseFloat(regSgpas[sem as keyof typeof regSgpas]);
      if (!isNaN(val) && val > 0) {
        total += val;
        count++;
      }
    });

    if (count > 0) {
      setRegCgpa((total / count).toFixed(2));
    } else {
      setRegCgpa('');
    }
  }, [regSgpas, regSemester]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // DEVELOPMENT DEMO CREDENTIALS CHECK
      if (import.meta.env.MODE === 'development') {
        if (role === 'hod' && userId === 'yogitagurjar230840@gmail.com' && password === 'Admin@123') {
           login('hod', 'A1');
           navigate('/admin');
           return;
        }
        if (role === 'coordinator' && userId === 'coordinator@acronexus.edu' && password === 'Coordinator@123') {
           login('coordinator', 'A2');
           navigate('/admin');
           return;
        }
        if (role === 'faculty' && userId === 'faculty@acronexus.edu' && password === 'Faculty@123') {
           login('faculty', 'A4');
           navigate('/admin');
           return;
        }
        if (role === 'student' && userId === 'student@acronexus.edu' && password === 'Student@123') {
           login('student', 'STU1');
           navigate('/student');
           return;
        }
      }

      if (role === 'hod' || role === 'coordinator' || role === 'faculty') {
        const admin = mockData.admins.find(a => a.id === userId || a.empId === userId || a.email === userId);
        if (admin && password === 'password' && admin.role === role) {
          login(role, admin.id);
          navigate('/admin');
        } else {
          setError(`Invalid ${role.toUpperCase()} credentials. Make sure you selected the correct role.`);
        }
      } else {
        const student = mockData.students.find(s => s.id === userId || s.enrollmentNumber === userId || s.email === userId);
        if (student && password === 'password') {
          login('student', student.id);
          navigate('/student');
        } else {
          setError('Invalid Student credentials.');
        }
      }
      setIsLoading(false);
    }, 800);
  };

  const resetRegistrationForm = () => {
      setRegName('');
      setRegEmail('');
      setRegMobile('');
      setRegDepartment('');
      setRegId('');
      setRegPassword('');
      setIdCardFile(null);
      setRegYear('');
      setRegSemester('');
      setRegClass('');
      setRegBatch('');
      setRegCgpa('');
      setRegBacklogs('');
      setRegBatchCoordinator('');
      setRegSgpas({ sem1: '', sem2: '', sem3: '', sem4: '', sem5: '', sem6: '', sem7: '', sem8: '' });
      setRegSubjects([]);
      setCurrentSubject('');
  };

  const handleCoordinatorConfirm = () => {
    mockData.admins.push({
      id: newCoordinatorData.id,
      name: newCoordinatorData.name,
      email: newCoordinatorData.email,
      empId: newCoordinatorData.empId,
      subjects: newCoordinatorData.subjects || [],
      classes: newCoordinatorData.classes || [],
      role: newCoordinatorData.role
    });
    
    setShowCoordinatorPopup(false);
    resetRegistrationForm();
    // Auto login for coordinator/faculty
    login(newCoordinatorData.role, newCoordinatorData.id);
    navigate('/admin');
  };

  const handleCoordinatorCancel = () => {
    setShowCoordinatorPopup(false);
    setNewCoordinatorData(null);
    setIsRegistering(false);
    resetRegistrationForm();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (role === 'student' && !idCardFile) {
      setError('Please upload your Student ID Card.');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      if (role === 'coordinator' || role === 'faculty') {
        const newAdmin = {
          id: `A${mockData.admins.length + 1}`,
          name: regName,
          email: regEmail,
          empId: regId,
          password: regPassword,
          subjects: role === 'faculty' ? ['Software Engineering', 'Web Development'] : ['Cloud Computing', 'Machine Learning', 'Internet of Things'],
          classes: role === 'faculty' ? ['IT-1', 'IT-3'] : ['IT-1', 'IT-2'],
          role: role
        };
        setNewCoordinatorData(newAdmin);
        setShowCoordinatorPopup(true);
        return; // Don't reset form yet
      } else {
        if (role === 'hod') {
          mockData.admins.push({
            id: `A${mockData.admins.length + 1}`,
            name: regName,
            email: regEmail,
            empId: regId,
            subjects: [],
            classes: [],
            role: role
          });
        } else if (role === 'student') {
          mockData.students.push({
            id: `STU${mockData.students.length + 1}`,
            name: regName,
            email: regEmail,
            enrollmentNumber: regId,
            classId: regClass,
            className: regClass,
            year: regYear,
            semester: regSemester.replace(/\D/g, ''),
            batch: regBatch,
            branch: regDepartment || 'Information Technology',
            overallAttendance: 0,
            avatar: `https://i.pravatar.cc/150?u=${regId}`,
            status: 'Active',
            sgpa: { ...regSgpas, sem5: null, sem6: null, sem7: null, sem8: null },
            cgpa: regCgpa,
            activeBacklogs: Number(regBacklogs) || 0,
            subjects: regSubjects,
            batchCoordinator: regBatchCoordinator
          });
        }
        setIsRegistering(false);
        setUserId(regId);
        setPassword(regPassword);
      }
      
      resetRegistrationForm();
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdCardFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex items-start md:items-center justify-center bg-background p-6 font-sans relative overflow-x-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-lighten animate-pulse duration-10000"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten animate-pulse duration-7000"></div>
      </div>

      <Card className="w-full max-w-5xl flex flex-col md:flex-row overflow-hidden min-h-[600px] max-h-[95vh] shadow-2xl shadow-primary/10 border border-border bg-card rounded-3xl z-10 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Left Side - Branding */}
        <div className="w-full md:flex-1 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 p-8 md:p-12 flex flex-col justify-center md:justify-between text-white relative overflow-hidden shrink-0">
          <div className="relative z-10 animate-in fade-in slide-in-from-left-8 duration-1000 delay-150 fill-mode-both">
            <div className="hidden md:flex w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md items-center justify-center font-bold text-3xl mb-8 shadow-xl border border-white/20">
              A
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2 md:mb-4 tracking-tight leading-tight">
              Welcome to <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-white">AcroNexus</span>
            </h1>
            <p className="text-sm md:text-lg text-primary-foreground/90 leading-relaxed max-w-sm mt-2 md:mt-4 font-medium">
              The next-generation ERP platform for the Information Technology Department.
            </p>
          </div>
          
          <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both hidden md:block">
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 py-1.5 px-3 text-sm backdrop-blur-md shadow-sm">
                <Sparkles size={14} className="mr-1.5" /> Smart Analytics
              </Badge>
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 py-1.5 px-3 text-sm backdrop-blur-md shadow-sm">
                Real-time Sync
              </Badge>
            </div>
            <p className="text-sm text-primary-foreground/70 font-medium tracking-wide uppercase">Powered by Acropolis Institute</p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -top-[20%] -right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-white/20 to-transparent blur-3xl"></div>
          <div className="absolute -bottom-[10%] -left-[20%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-emerald-400/20 to-transparent blur-3xl"></div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-6 md:p-14 bg-card overflow-y-auto custom-scrollbar">
          <div className="max-w-md w-full mx-auto min-h-full flex flex-col pt-8 pb-8 md:pt-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-10 text-center md:text-left mt-8 md:mt-0">
              <h2 className="text-3xl font-extrabold mb-2 text-foreground tracking-tight">
                {isRegistering ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-muted-foreground font-medium text-sm md:text-base">
                {isRegistering ? 'Register to access your portal.' : 'Enter your credentials to access your portal.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-8 p-1.5 bg-muted rounded-xl shrink-0">
              <Button 
                variant={role === 'student' ? 'default' : 'ghost'} 
                className={`rounded-lg transition-all ${role === 'student' ? 'shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => { setRole('student'); setError(''); }}
                type="button"
              >
                Student
              </Button>
              <Button 
                variant={role === 'faculty' ? 'default' : 'ghost'} 
                className={`rounded-lg transition-all ${role === 'faculty' ? 'shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => { setRole('faculty'); setError(''); }}
                type="button"
              >
                Faculty
              </Button>
              <Button 
                variant={role === 'coordinator' ? 'default' : 'ghost'} 
                className={`rounded-lg transition-all ${role === 'coordinator' ? 'shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => { setRole('coordinator'); setError(''); }}
                type="button"
              >
                Coordinator
              </Button>
              <Button 
                variant={role === 'hod' ? 'default' : 'ghost'} 
                className={`rounded-lg transition-all ${role === 'hod' ? 'shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => { setRole('hod'); setError(''); setIsRegistering(false); }}
                type="button"
              >
                HOD
              </Button>
            </div>

            {!isRegistering ? (
              // LOGIN FORM
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">User ID / Email / Enrollment No.</label>
                  <div className="relative group">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="text" 
                      className="pl-10 h-12 bg-background border-border focus-visible:ring-primary/30 rounded-xl transition-all shadow-sm" 
                      placeholder={role === 'student' ? "Try 'STU1'" : "Email or Employee ID"}
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-muted-foreground">Password</label>
                    <span className="text-sm text-primary cursor-pointer font-semibold hover:underline">Forgot?</span>
                  </div>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      className="pl-10 pr-10 h-12 bg-background border-border focus-visible:ring-primary/30 rounded-xl transition-all shadow-sm" 
                      placeholder="Try 'password'"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-destructive text-sm p-4 bg-destructive/10 border border-destructive/20 rounded-xl font-medium animate-in slide-in-from-top-2">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full mt-4 h-12 text-base rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 group"
                  disabled={isLoading}
                >
                  {isLoading ? 'Authenticating...' : 'Sign In'} 
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            ) : (
              // REGISTRATION FORM
              <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                  <Input 
                    type="text" 
                    className="h-11 bg-background border-border focus-visible:ring-primary/30 rounded-xl shadow-sm" 
                    placeholder="John Doe"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Email</label>
                    <Input 
                      type="email" 
                      className="h-11 bg-background border-border focus-visible:ring-primary/30 rounded-xl shadow-sm" 
                      placeholder="john@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">
                      {role === 'faculty' || role === 'coordinator' ? 'Employee ID' : 'Enrollment No.'}
                    </label>
                    <Input 
                      type="text" 
                      className="h-11 bg-background border-border focus-visible:ring-primary/30 rounded-xl shadow-sm" 
                      placeholder={role === 'faculty' || role === 'coordinator' ? "EMP001" : "0827CS... "}
                      value={regId}
                      onChange={(e) => setRegId(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {(role === 'faculty' || role === 'coordinator') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">Mobile Number</label>
                      <Input 
                        type="tel" 
                        className="h-11 bg-background border-border focus-visible:ring-primary/30 rounded-xl shadow-sm" 
                        placeholder="+91..."
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">Department</label>
                      <select 
                        className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        required
                      >
                        <option value="" disabled>Select Dept</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Data Science">Data Science</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Password</label>
                  <div className="relative group">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      className="pr-10 h-11 bg-background border-border focus-visible:ring-primary/30 rounded-xl transition-all shadow-sm" 
                      placeholder="Create a password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button 
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {role === 'student' && (
                  <div className="space-y-6">
                    <div className="space-y-2 pt-2">
                      <label className="text-sm font-semibold text-muted-foreground flex justify-between">
                        Upload ID Card 
                        <span className="text-xs text-muted-foreground font-normal">(Required for verification)</span>
                      </label>
                      <div 
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 ${idCardFile ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*,.pdf" 
                          onChange={handleFileChange} 
                        />
                        {idCardFile ? (
                          <>
                            <CheckCircle2 className="w-8 h-8 text-primary" />
                            <p className="text-sm font-medium text-foreground">{idCardFile.name}</p>
                            <p className="text-xs text-muted-foreground">Click to change file</p>
                          </>
                        ) : (
                          <>
                            <div className="p-3 bg-background rounded-full shadow-sm mb-1">
                              <Upload className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium text-foreground">Click to upload your Student ID</p>
                            <p className="text-xs text-muted-foreground">JPEG, PNG or PDF up to 5MB</p>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-border mt-4">
                      <h3 className="font-bold text-foreground">Academic Details</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Academic Year</label>
                        <select 
                          className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          value={regYear}
                          onChange={(e) => setRegYear(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Semester</label>
                        <select 
                          className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          value={regSemester}
                          onChange={(e) => {
                            setRegSemester(e.target.value);
                            // Reset SGPAs if they decrease semester to ensure no stale data in calculation
                            setRegSgpas({ sem1: '', sem2: '', sem3: '', sem4: '', sem5: '', sem6: '', sem7: '', sem8: '' });
                          }}
                          required
                        >
                          <option value="" disabled>Select Semester</option>
                          <option value="Semester 3">Semester 3</option>
                          <option value="Semester 4">Semester 4</option>
                          <option value="Semester 5">Semester 5</option>
                          <option value="Semester 6">Semester 6</option>
                          <option value="Semester 7">Semester 7</option>
                          <option value="Semester 8">Semester 8</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Class</label>
                        <select 
                          className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          value={regClass}
                          onChange={(e) => setRegClass(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select Class</option>
                          <option value="IT-1">IT-1</option>
                          <option value="IT-2">IT-2</option>
                          <option value="DS-1">DS-1</option>
                          <option value="DS-2">DS-2</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Batch</label>
                        <Input 
                          type="text" 
                          className="h-11 bg-background border-border rounded-xl" 
                          placeholder="e.g. A1"
                          value={regBatch}
                          onChange={(e) => setRegBatch(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Array.from({ length: Math.max(0, (parseInt(regSemester.replace(/\D/g, '')) || 0) - 1) }, (_, i) => i + 1).map((semNum) => {
                        const semKey = `sem${semNum}` as keyof typeof regSgpas;
                        return (
                          <div key={semKey} className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground">SGPA Sem {semNum}</label>
                            <Input 
                              type="number" step="0.01" min="0" max="10"
                              className="h-10 bg-background border-border rounded-lg text-sm" 
                              placeholder="0.00"
                              value={regSgpas[semKey]}
                              onChange={(e) => setRegSgpas({ ...regSgpas, [semKey]: e.target.value })}
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Current CGPA</label>
                        <Input 
                          type="text"
                          className="h-11 bg-muted border-border rounded-xl font-medium text-foreground cursor-not-allowed opacity-80" 
                          placeholder="Auto-calculated"
                          value={regCgpa}
                          readOnly
                          tabIndex={-1}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Active Backlogs</label>
                        <Input 
                          type="number" min="0"
                          className="h-11 bg-background border-border rounded-xl" 
                          placeholder="0"
                          value={regBacklogs}
                          onChange={(e) => setRegBacklogs(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Batch Coordinator</label>
                        <Input 
                          type="text" 
                          className="h-11 bg-background border-border rounded-xl" 
                          placeholder="Name"
                          value={regBatchCoordinator}
                          onChange={(e) => setRegBatchCoordinator(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">Current Semester Subjects</label>
                      <div className="flex gap-2">
                        <Input 
                          type="text" 
                          className="h-11 bg-background border-border rounded-xl flex-1" 
                          placeholder="Add subject (e.g. Java)"
                          value={currentSubject}
                          onChange={(e) => setCurrentSubject(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (currentSubject.trim()) {
                                setRegSubjects([...regSubjects, currentSubject.trim()]);
                                setCurrentSubject('');
                              }
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="h-11 rounded-xl shrink-0 border-border"
                          onClick={() => {
                            if (currentSubject.trim()) {
                              setRegSubjects([...regSubjects, currentSubject.trim()]);
                              setCurrentSubject('');
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      {regSubjects.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {regSubjects.map((sub, i) => (
                            <Badge key={i} variant="secondary" className="px-3 py-1 flex items-center gap-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                              {sub}
                              <X className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors ml-1" onClick={() => setRegSubjects(regSubjects.filter((_, idx) => idx !== i))} />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                )}



                {error && (
                  <div className="text-destructive text-sm p-4 bg-destructive/10 border border-destructive/20 rounded-xl font-medium">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full mt-4 h-12 text-base rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 group"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Register'} 
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            )}

            {(role === 'student' || role === 'faculty' || role === 'coordinator' || role === 'hod') && (
              <p className="text-center mt-8 text-sm text-muted-foreground font-medium">
                {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                <span 
                  className="text-primary font-bold cursor-pointer hover:underline"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                  }}
                >
                  {isRegistering ? 'Sign In' : 'Create Account'}
                </span>
              </p>
            )}

            {/* DEMO CREDENTIALS CARD - ONLY FOR DEVELOPMENT */}
            {import.meta.env.MODE === 'development' && !isRegistering && (
              <div className="mt-8 pt-6 border-t border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                    Dev Mode
                  </Badge>
                  <h3 className="text-sm font-bold text-foreground">Test Credentials</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* HOD */}
                  <div className="p-3 rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors group relative overflow-hidden">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl leading-none">👑</span>
                        <span className="text-xs font-bold text-foreground">HOD</span>
                      </div>
                      <Button 
                        size="sm" variant="ghost" 
                        className="h-6 text-[10px] px-2 py-0 hover:bg-primary hover:text-primary-foreground absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setRole('hod');
                          setUserId('yogitagurjar230840@gmail.com');
                          setPassword('Admin@123');
                        }}
                      >
                        Quick Fill
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-muted-foreground truncate" title="yogitagurjar230840@gmail.com">
                        <span className="font-semibold text-foreground/70">U:</span> yogitagurjar230840@gmail.com
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        <span className="font-semibold text-foreground/70">P:</span> Admin@123
                      </p>
                    </div>
                  </div>

                  {/* Coordinator */}
                  <div className="p-3 rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors group relative overflow-hidden">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl leading-none">🏫</span>
                        <span className="text-xs font-bold text-foreground">Coordinator</span>
                      </div>
                      <Button 
                        size="sm" variant="ghost" 
                        className="h-6 text-[10px] px-2 py-0 hover:bg-primary hover:text-primary-foreground absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setRole('coordinator');
                          setUserId('coordinator@acronexus.edu');
                          setPassword('Coordinator@123');
                        }}
                      >
                        Quick Fill
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-muted-foreground truncate" title="coordinator@acronexus.edu">
                        <span className="font-semibold text-foreground/70">U:</span> coordinator@acronexus.edu
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        <span className="font-semibold text-foreground/70">P:</span> Coordinator@123
                      </p>
                    </div>
                  </div>

                  {/* Faculty */}
                  <div className="p-3 rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors group relative overflow-hidden">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl leading-none">👨‍🏫</span>
                        <span className="text-xs font-bold text-foreground">Faculty</span>
                      </div>
                      <Button 
                        size="sm" variant="ghost" 
                        className="h-6 text-[10px] px-2 py-0 hover:bg-primary hover:text-primary-foreground absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setRole('faculty');
                          setUserId('faculty@acronexus.edu');
                          setPassword('Faculty@123');
                        }}
                      >
                        Quick Fill
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-muted-foreground truncate" title="faculty@acronexus.edu">
                        <span className="font-semibold text-foreground/70">U:</span> faculty@acronexus.edu
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        <span className="font-semibold text-foreground/70">P:</span> Faculty@123
                      </p>
                    </div>
                  </div>

                  {/* Student */}
                  <div className="p-3 rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors group relative overflow-hidden">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl leading-none">🎓</span>
                        <span className="text-xs font-bold text-foreground">Student</span>
                      </div>
                      <Button 
                        size="sm" variant="ghost" 
                        className="h-6 text-[10px] px-2 py-0 hover:bg-primary hover:text-primary-foreground absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setRole('student');
                          setUserId('student@acronexus.edu');
                          setPassword('Student@123');
                        }}
                      >
                        Quick Fill
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-muted-foreground truncate" title="student@acronexus.edu">
                        <span className="font-semibold text-foreground/70">U:</span> student@acronexus.edu
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        <span className="font-semibold text-foreground/70">P:</span> Student@123
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Coordinator Creation Confirmation Popup */}
      {showCoordinatorPopup && newCoordinatorData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md shadow-2xl border-primary/20 animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-primary to-blue-600 p-6 flex flex-col items-center justify-center text-white rounded-t-xl relative">
              <div className="w-20 h-20 rounded-full border-4 border-white/20 bg-white/10 overflow-hidden mb-3">
                <img 
                  src={`https://i.pravatar.cc/150?u=${newCoordinatorData.empId}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">{newCoordinatorData.name}</h3>
              <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-none hover:bg-white/30">
                {newCoordinatorData.role === 'coordinator' ? 'Class Coordinator' : 'Faculty Member'}
              </Badge>
            </div>
            
            <div className="p-6 space-y-4 bg-card">
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Briefcase size={14} /> Employee ID</span>
                  <p className="font-semibold text-foreground">{newCoordinatorData.empId}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Mail size={14} /> Email</span>
                  <p className="font-semibold text-foreground truncate" title={newCoordinatorData.email}>{newCoordinatorData.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Building2 size={14} /> {newCoordinatorData.role === 'coordinator' ? 'Coordinator Of (Section)' : 'Teaching (Section)'}</span>
                  <p className="font-semibold text-foreground">{newCoordinatorData.classes && newCoordinatorData.classes.length > 0 ? newCoordinatorData.classes.join(', ') : 'IT-1'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5"><BookOpen size={14} /> Semester</span>
                  <p className="font-semibold text-foreground">Semester 6</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5"><GraduationCap size={14} /> Assigned Subjects</span>
                  <p className="font-semibold text-foreground">{newCoordinatorData.subjects ? newCoordinatorData.subjects.join(', ') : '3 Subjects'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Building2 size={14} /> Total Assigned Classes</span>
                  <p className="font-semibold text-foreground">12 / Week</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-4 mt-2 border-t border-border">
                <Button variant="outline" className="flex-1" onClick={handleCoordinatorCancel}>
                  Cancel
                </Button>
                <Button className="flex-1 shadow-md shadow-primary/20" onClick={handleCoordinatorConfirm}>
                  Open Dashboard
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
