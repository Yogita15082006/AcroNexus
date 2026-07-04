import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Check, Trash2, Search, X, 
  BookOpen, Users, Clock, GraduationCap, Calendar, 
  MessageSquare, Settings, UserCircle, Info
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../context/AuthContext';
import { mockData } from '../data/mockData';

// Types
export interface NotificationAction {
  label: string;
  action: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export interface SmartNotification {
  id: string;
  module: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  path: string;
  type: 'info' | 'warning' | 'destructive' | 'success' | 'primary' | 'secondary';
  buttons?: NotificationAction[];
}

const MODULE_ICONS: Record<string, React.ReactNode> = {
  'Attendance': <Users size={16} />,
  'Assignments': <BookOpen size={16} />,
  'Quiz': <Clock size={16} />,
  'Examination': <GraduationCap size={16} />,
  'Events': <Calendar size={16} />,
  'Notice': <MessageSquare size={16} />,
  'Profile Updates': <UserCircle size={16} />,
  'System': <Settings size={16} />,
  'Default': <Info size={16} />
};

const MODULE_COLORS: Record<string, string> = {
  'Attendance': 'text-blue-500 bg-blue-500/10',
  'Assignments': 'text-amber-500 bg-amber-500/10',
  'Quiz': 'text-indigo-500 bg-indigo-500/10',
  'Examination': 'text-rose-500 bg-rose-500/10',
  'Events': 'text-emerald-500 bg-emerald-500/10',
  'Notice': 'text-orange-500 bg-orange-500/10',
  'System': 'text-slate-500 bg-slate-500/10',
};

const getBadgeColor = (type: string) => {
  switch(type) {
    case 'destructive': return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'warning': return 'bg-warning/10 text-warning border-warning/20';
    case 'success': return 'bg-success/10 text-success border-success/20';
    case 'primary': return 'bg-primary/10 text-primary border-primary/20';
    case 'secondary': return 'bg-secondary/10 text-secondary border-secondary/20';
    default: return 'bg-muted text-muted-foreground border-border';
  }
};

const getTimeLeftText = (deadlineStr: string) => {
  const diffMs = new Date(deadlineStr).getTime() - new Date().getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffDays > 1) return `${diffDays} Days Remaining`;
  if (diffDays === 1) return `Tomorrow`;
  if (diffDays === 0 && diffHours > 0) return `${diffHours} Hours Left`;
  if (diffMins > 0) return `${diffMins} Minutes Left`;
  return `Deadline Passed`;
}

const getPriority = (deadlineStr: string): 'destructive' | 'warning' | 'primary' | 'info' => {
  const diffMs = new Date(deadlineStr).getTime() - new Date().getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return 'destructive'; 
  if (diffDays <= 1) return 'destructive';
  if (diffDays <= 3) return 'warning';
  return 'primary';
}

const formatTimeAgo = (dateStr: string) => {
  const diffMs = new Date().getTime() - new Date(dateStr).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffDays > 0) return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  if (diffHours > 0) return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  if (diffMins > 0) return diffMins === 1 ? '1 min ago' : `${diffMins} mins ago`;
  return 'Just now';
};

interface NotificationPanelProps {
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { role, user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [filterRead, setFilterRead] = useState('All'); 
  const [filterPriority, setFilterPriority] = useState('All');

  // Generate Smart Notifications
  useEffect(() => {
    let generated: SmartNotification[] = [];

    if (role === 'student') {
      // ASSIGNMENTS
      const studentAssignments = mockData.assignments.filter(a => a.classId === user.classId);
      studentAssignments.forEach(assignment => {
        const isSubmitted = mockData.assignmentSubmissions.some(sub => sub.assignmentId === assignment.id && sub.studentId === user.id);
        const deadlinePassed = new Date(assignment.deadline) < new Date();
        const timeAgo = formatTimeAgo(assignment.createdAt);
        const timeLeft = getTimeLeftText(assignment.deadline);
        const priority = getPriority(assignment.deadline);
        
        if (!isSubmitted && !deadlinePassed && assignment.status !== 'Upcoming') {
          generated.push({
            id: `N_A_${assignment.id}`,
            module: 'Assignments',
            title: `Assignment due ${timeLeft.toLowerCase()}`,
            message: `You have not submitted "${assignment.title}" yet.`,
            time: timeAgo,
            read: false,
            path: '/student/assignments',
            type: priority,
            buttons: [
              { label: 'View', action: '/student/assignments' },
              { label: 'Submit Now', action: '/student/assignments', variant: 'default' }
            ]
          });
        } else if (!isSubmitted && deadlinePassed) {
           generated.push({
            id: `N_A_EXP_${assignment.id}`,
            module: 'Assignments',
            title: 'Assignment deadline has passed',
            message: `The deadline for "${assignment.title}" expired.`,
            time: formatTimeAgo(assignment.deadline),
            read: true,
            path: '/student/assignments',
            type: 'destructive',
            buttons: [
              { label: 'View Assignment', action: '/student/assignments' }
            ]
          });
        } else if (isSubmitted) {
          // If submitted recently
          const sub = mockData.assignmentSubmissions.find(s => s.assignmentId === assignment.id && s.studentId === user.id);
          if (sub && new Date().getTime() - new Date(sub.submitDate).getTime() < 86400000 * 3) {
            generated.push({
              id: `N_A_SUB_${assignment.id}`,
              module: 'Assignments',
              title: 'Assignment submitted successfully',
              message: `Your submission for "${assignment.title}" was received.`,
              time: formatTimeAgo(sub.submitDate),
              read: true,
              path: '/student/assignments',
              type: 'success',
              buttons: [
                { label: 'View Submission', action: '/student/assignments' }
              ]
            });
          }
        }
      });

      // QUIZZES
      const studentQuizzes = mockData.quizzes.filter(q => q.classId === user.classId);
      studentQuizzes.forEach(quiz => {
        const isAttempted = mockData.quizAttempts.some(qa => qa.quizId === quiz.id && qa.studentId === user.id);
        const timeAgo = formatTimeAgo(quiz.createdAt);
        const timeLeft = getTimeLeftText(quiz.startTime);
        
        if (!isAttempted && quiz.status === 'Active') {
          generated.push({
            id: `N_Q_${quiz.id}`,
            module: 'Quiz',
            title: `Quiz starts in ${timeLeft.toLowerCase().replace(' left', '')}`,
            message: `You have not attempted "${quiz.title}" yet.`,
            time: timeAgo,
            read: false,
            path: '/student/quiz',
            type: getPriority(quiz.startTime),
            buttons: [
              { label: 'Start Quiz', action: '/student/quiz', variant: 'default' }
            ]
          });
        }
      });

      // EVENTS
      mockData.events.forEach(event => {
        const deadlinePassed = new Date(event.registrationDeadline) < new Date();
        if (!deadlinePassed) {
          generated.push({
            id: `N_E_${event.id}`,
            module: 'Events',
            title: `Registration for "${event.title}" is open`,
            message: `Event starts ${getTimeLeftText(event.date).toLowerCase()}.`,
            time: '2 hours ago',
            read: false,
            path: '/student/events',
            type: 'primary',
            buttons: [
              { label: 'View Event', action: '/student/events' },
              { label: 'Register Now', action: '/student/events', variant: 'default' }
            ]
          });
        }
      });

      // NOTICES
      const studentNotices = mockData.notices.filter(n => n.classId === user.classId && n.status === 'Active');
      studentNotices.slice(0, 3).forEach(notice => {
        generated.push({
          id: `N_N_${notice.id}`,
          module: 'Notice',
          title: notice.priority === 'Urgent' ? 'Urgent Department Notice' : 'New Important Notice',
          message: notice.title,
          time: formatTimeAgo(new Date(notice.publishDate).toISOString()),
          read: false,
          path: '/student/notice',
          type: notice.priority === 'Urgent' ? 'destructive' : 'info',
          buttons: [
            { label: 'View Notice', action: '/student/notice' }
          ]
        });
      });

      // EXAMINATIONS
      const studentExams = mockData.examinations.filter(e => e.classId === user.classId);
      studentExams.forEach(exam => {
        if (exam.status === 'Upcoming') {
           generated.push({
            id: `N_EXM_${exam.id}`,
            module: 'Examination',
            title: 'Mid Semester timetable uploaded',
            message: `Check timetable for ${exam.name}. Examination starts ${getTimeLeftText(exam.date).toLowerCase().replace(' remaining', '')}.`,
            time: '1 day ago',
            read: false,
            path: '/student/examinations',
            type: 'warning',
            buttons: [
              { label: 'View Timetable', action: '/student/examinations', variant: 'default' }
            ]
          });
        } else if (exam.status === 'Completed') {
          generated.push({
            id: `N_EXMR_${exam.id}`,
            module: 'Examination',
            title: 'Result published',
            message: `The result for ${exam.name} is now available.`,
            time: '1 hour ago',
            read: true,
            path: '/student/examinations',
            type: 'success',
            buttons: [
              { label: 'View Result', action: '/student/examinations', variant: 'default' }
            ]
          });
        }
      });

      // ATTENDANCE (Static example for student)
      generated.push({
        id: `N_ATT_1`,
        module: 'Attendance',
        title: 'Attendance is now open',
        message: 'You have not marked today\'s attendance yet. Closes in 10 minutes.',
        time: 'Just now',
        read: false,
        path: '/student/attendance',
        type: 'destructive',
        buttons: [
          { label: 'Mark Attendance', action: '/student/attendance', variant: 'default' }
        ]
      });

    } else if (['faculty', 'hod', 'coordinator'].includes(role)) {
      // ADMIN NOTIFICATIONS
      
      // ASSIGNMENTS
      const adminAssignments = mockData.assignments.filter(a => user.classes?.includes(a.classId));
      adminAssignments.slice(0, 3).forEach(assignment => {
        const subs = mockData.assignmentSubmissions.filter(s => s.assignmentId === assignment.id);
        const deadlinePassed = new Date(assignment.deadline) < new Date();
        if (subs.length > 0) {
          generated.push({
            id: `N_A_AD_${assignment.id}`,
            module: 'Assignments',
            title: `${subs.length} students submitted ${assignment.title}`,
            message: deadlinePassed ? 'Assignment review pending.' : 'Assignment deadline expires tomorrow.',
            time: formatTimeAgo(assignment.createdAt),
            read: false,
            path: '/admin/assignments',
            type: deadlinePassed ? 'warning' : 'primary',
            buttons: [
              { label: 'Review Submissions', action: '/admin/assignments', variant: 'default' }
            ]
          });
        }
      });

      // QUIZ
      const adminQuizzes = mockData.quizzes.filter(q => user.classes?.includes(q.classId));
      adminQuizzes.slice(0, 2).forEach(quiz => {
        if (quiz.status === 'Completed') {
          const attempts = mockData.quizAttempts.filter(qa => qa.quizId === quiz.id).length;
          generated.push({
            id: `N_Q_AD_${quiz.id}`,
            module: 'Quiz',
            title: 'Quiz submissions completed',
            message: `${attempts} students attempted the quiz. Results pending publication.`,
            time: '2 hours ago',
            read: false,
            path: '/admin/quiz',
            type: 'success',
            buttons: [
              { label: 'Publish Results', action: '/admin/quiz', variant: 'default' }
            ]
          });
        }
      });

      // ATTENDANCE
      generated.push({
        id: `N_ATT_AD_1`,
        module: 'Attendance',
        title: 'Attendance not created',
        message: 'Attendance has not been created for today\'s Java class.',
        time: '30 mins ago',
        read: false,
        path: '/admin/attendance',
        type: 'destructive',
        buttons: [
          { label: 'Take Attendance', action: '/admin/attendance', variant: 'default' }
        ]
      });

      // EVENTS
      generated.push({
        id: `N_EV_AD_1`,
        module: 'Events',
        title: '35 students registered for Hackathon',
        message: 'Registration closes tomorrow. Event attendance pending.',
        time: '5 hours ago',
        read: true,
        path: '/admin/events',
        type: 'info',
        buttons: [
          { label: 'Manage Registrations', action: '/admin/events' }
        ]
      });

      // NOTICES
      generated.push({
        id: `N_NO_AD_1`,
        module: 'Notice',
        title: 'Notice successfully published',
        message: 'Mid-Sem Examination schedule has been broadcasted.',
        time: '1 day ago',
        read: true,
        path: '/admin/notice',
        type: 'success',
        buttons: [
          { label: 'View Notice', action: '/admin/notice' }
        ]
      });
    }

    // Sort by unread first, then by priority (destructive > warning > primary > others)
    generated.sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      const priorityOrder: Record<string, number> = { 'destructive': 0, 'warning': 1, 'primary': 2, 'success': 3, 'info': 4, 'secondary': 5 };
      return (priorityOrder[a.type] ?? 99) - (priorityOrder[b.type] ?? 99);
    });

    setNotifications(generated);
  }, [role, user]);

  const modules = ['All', ...Array.from(new Set(notifications.map(n => n.module)))];


  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleActionClick = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(action);
    onClose();
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            n.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModule = filterModule === 'All' || n.module === filterModule;
      const matchesRead = filterRead === 'All' || 
                          (filterRead === 'Read' && n.read) || 
                          (filterRead === 'Unread' && !n.read);
      const matchesPriority = filterPriority === 'All' || n.type === filterPriority;
      return matchesSearch && matchesModule && matchesRead && matchesPriority;
    });
  }, [notifications, searchQuery, filterModule, filterRead, filterPriority]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute top-14 right-4 md:right-6 w-full max-w-md sm:w-[450px] bg-card border border-border shadow-2xl rounded-xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-300 flex flex-col max-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground text-lg tracking-tight">Smart Reminders</h3>
          {unreadCount > 0 && (
            <Badge variant="default" className="bg-primary text-primary-foreground text-xs px-2 py-0.5 ml-2 shadow-sm">
              {unreadCount} New
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" onClick={handleMarkAllAsRead} title="Mark all as read">
            <Check className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors" onClick={handleClearAll} title="Clear all">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground md:hidden transition-colors" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 border-b border-border bg-background space-y-3 z-10 relative shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search reminders..." 
            className="w-full bg-muted/40 border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <select 
            className="text-xs font-medium bg-muted/40 border border-border rounded-md px-2.5 py-1.5 focus:outline-none focus:border-primary/50 text-foreground cursor-pointer transition-colors hover:bg-muted/60"
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
          </select>
          <select 
            className="text-xs font-medium bg-muted/40 border border-border rounded-md px-2.5 py-1.5 focus:outline-none focus:border-primary/50 text-foreground cursor-pointer transition-colors hover:bg-muted/60"
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
          >
            <option value="All">All Modules</option>
            {modules.filter(m => m !== 'All').map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select 
            className="text-xs font-medium bg-muted/40 border border-border rounded-md px-2.5 py-1.5 focus:outline-none focus:border-primary/50 text-foreground cursor-pointer transition-colors hover:bg-muted/60"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="destructive">Urgent</option>
            <option value="warning">High</option>
            <option value="primary">Normal</option>
            <option value="success">Success</option>
          </select>
        </div>
      </div>

      {/* Notification List */}
      <div className="overflow-y-auto flex-1 p-3 space-y-2 bg-muted/10 custom-scrollbar relative">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-base font-semibold text-foreground">No reminders found.</p>
            <p className="text-sm opacity-80 mt-1">You're all caught up for now!</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`group p-4 rounded-xl border transition-all duration-200 cursor-pointer ${notif.read ? 'bg-background border-border/40 opacity-75 hover:opacity-100 hover:border-border hover:shadow-sm' : 'bg-background border-border shadow-sm hover:shadow-md hover:border-primary/30 relative overflow-hidden'}`}
              onClick={() => { handleMarkAsRead(notif.id); navigate(notif.path); onClose(); }}
            >
              {!notif.read && (
                 <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              )}
              <div className="flex gap-4">
                <div className={`mt-1 p-2.5 rounded-xl shrink-0 h-fit transition-transform group-hover:scale-105 shadow-sm ${MODULE_COLORS[notif.module] || 'bg-primary/10 text-primary'}`}>
                  {MODULE_ICONS[notif.module] || MODULE_ICONS['Default']}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{notif.module}</span>
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 rounded font-semibold uppercase tracking-wider border-0 ${getBadgeColor(notif.type)}`}>
                        {notif.type === 'destructive' ? 'Urgent' : notif.type === 'warning' ? 'High' : notif.type}
                      </Badge>
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">{notif.time}</span>
                  </div>
                  <h4 className={`text-sm mb-1 truncate ${notif.read ? 'font-medium text-foreground/90' : 'font-bold text-foreground'}`}>
                    {notif.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>
                  
                  {/* Action Buttons */}
                  {notif.buttons && notif.buttons.length > 0 && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border/40">
                      {notif.buttons.map((btn, idx) => (
                        <Button 
                          key={idx} 
                          variant={btn.variant || 'outline'} 
                          size="sm" 
                          className={`h-7 text-[11px] px-3 ${btn.variant === 'default' ? 'shadow-sm' : ''}`}
                          onClick={(e) => handleActionClick(btn.action, e)}
                        >
                          {btn.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button 
                    onClick={(e) => handleDelete(notif.id, e)}
                    className="p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors rounded-md"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {!notif.read && (
                    <button 
                      onClick={(e) => handleMarkAsRead(notif.id, e)}
                      className="p-1.5 text-primary hover:bg-primary/10 transition-colors rounded-md"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/30 text-center backdrop-blur-sm sticky bottom-0 z-10">
        <Button variant="ghost" size="sm" className="w-full text-xs font-semibold h-8 text-primary hover:text-primary hover:bg-primary/10 transition-colors" onClick={() => navigate(`/${role}/notice`)}>
          View All Activities & Notices
        </Button>
      </div>
    </div>
  );
};

