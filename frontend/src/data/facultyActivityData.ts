import { mockData } from './mockData';

export interface FacultySubjectAssignment {
  subjectId: string; subjectName: string; facultyId: string; facultyName: string;
  academicYear: string; semester: string; className: string;
}

export interface ActivityRecord {
  id: string; facultyId: string; facultyName: string; subjectName: string;
  date: string; status: 'Present' | 'Absent' | 'Class Missed' | 'Holiday';
  reason: string; className: string; semester: string; academicYear: string;
  avatar?: string;
}


const semYearMap: Record<string, string> = {
  'Semester 3': '2nd Year', 'Semester 4': '2nd Year', 'Semester 5': '3rd Year',
  'Semester 6': '3rd Year', 'Semester 7': '4th Year', 'Semester 8': '4th Year'
};

// Build subject-faculty-class assignments
export const subjectAssignments: FacultySubjectAssignment[] = [];
const classOptions = ['IT-1','IT-2','DS-1','DS-2'];
const yearOptions = ['2nd Year','3rd Year','4th Year'];
const semOptions = ['Semester 3','Semester 4','Semester 5','Semester 6','Semester 7','Semester 8'];

mockData.admins.forEach(admin => {
  admin.subjects.forEach(subId => {
    const sub = mockData.subjects.find(s => s.id === subId);
    if (!sub) return;
    admin.classes.forEach(clsId => {
      const cls = mockData.classes.find(c => c.id === clsId);
      if (!cls) return;
      const yr = cls.year === 'Second Year' ? '2nd Year' : cls.year === 'Third Year' ? '3rd Year' : '4th Year';
      const sems = semOptions.filter(s => semYearMap[s] === yr);
      sems.forEach(sem => {
        subjectAssignments.push({
          subjectId: subId, subjectName: sub.name, facultyId: admin.id,
          facultyName: admin.name, academicYear: yr, semester: sem, className: cls.name
        });
      });
    });
  });
});

// Generate mock activity records

const reasons = ['Medical Leave','Emergency','Official Work','Personal Leave','Late Arrival','Department Duty','Other'];
const holidayReasons = ['College Holiday','Government Holiday','Festival','Examination Leave','Department Activity','Maintenance','Faculty Meeting'];

export const mockActivityRecords: ActivityRecord[] = [];
const today = new Date('2026-07-03');

// Generate 60 days of records
for (let d = 0; d < 60; d++) {
  const date = new Date(today);
  date.setDate(date.getDate() - d);
  if (date.getDay() === 0 || date.getDay() === 6) continue;
  const dateStr = date.toISOString().split('T')[0];

  // ~8% chance of holiday
  if (Math.random() < 0.08) {
    classOptions.forEach(cls => {
      yearOptions.forEach(yr => {
        const sems = semOptions.filter(s => semYearMap[s] === yr);
        sems.forEach(sem => {
          mockActivityRecords.push({
            id: `HOL-${dateStr}-${cls}-${sem}`, facultyId: '', facultyName: 'All Faculty',
            subjectName: '-', date: dateStr, status: 'Holiday',
            reason: holidayReasons[Math.floor(Math.random() * holidayReasons.length)],
            className: cls, semester: sem, academicYear: yr
          });
        });
      });
    });
    continue;
  }

  // For each assignment, generate activity
  subjectAssignments.forEach((asgn, idx) => {
    if (Math.random() < 0.35) return; // not every subject every day
    const rand = Math.random();
    let status: 'Present'|'Absent'|'Class Missed' = 'Present';
    let reason = '';
    if (rand < 0.08) { status = 'Absent'; reason = reasons[Math.floor(Math.random() * reasons.length)]; }
    else if (rand < 0.14) { status = 'Class Missed'; reason = reasons[Math.floor(Math.random() * reasons.length)]; }
    const admin = mockData.admins.find(a => a.id === asgn.facultyId);
    mockActivityRecords.push({
      id: `ACT-${dateStr}-${idx}-${Math.random().toString(36).slice(2,6)}`,
      facultyId: asgn.facultyId, facultyName: asgn.facultyName,
      subjectName: asgn.subjectName, date: dateStr, status, reason,
      className: asgn.className, semester: asgn.semester, academicYear: asgn.academicYear,
      avatar: admin ? `https://ui-avatars.com/api/?name=${admin.name.replace(/ /g,'+')}&background=4F46E5&color=fff` : undefined
    });
  });
}

export const holidayReasonOptions = ['College Holiday','Government Holiday','Festival','Examination Leave','Department Activity','Maintenance','Faculty Meeting','Other'];
export const absenceReasonOptions = ['Medical Leave','Emergency','Official Work','Personal Leave','Late Arrival','Department Duty','Other'];
export { classOptions, yearOptions, semOptions };
