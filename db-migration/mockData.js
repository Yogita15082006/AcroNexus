const generateMockData = () => {
  const classes = [
    { id: '2_IT1', year: 'Second Year', name: 'IT-1' },
    { id: '2_IT2', year: 'Second Year', name: 'IT-2' },
    { id: '2_DS1', year: 'Second Year', name: 'DS-1' },
    { id: '2_DS2', year: 'Second Year', name: 'DS-2' },
    { id: '3_IT1', year: 'Third Year', name: 'IT-1' },
    { id: '3_IT2', year: 'Third Year', name: 'IT-2' },
    { id: '3_DS1', year: 'Third Year', name: 'DS-1' },
    { id: '3_DS2', year: 'Third Year', name: 'DS-2' },
  ];

  const subjects = [
    { id: 'S1', name: 'Java' },
    { id: 'S2', name: 'DBMS' },
    { id: 'S3', name: 'Operating System' },
    { id: 'S4', name: 'Python' },
    { id: 'S5', name: 'Web Development' },
    { id: 'S6', name: 'Computer Networks' },
    { id: 'S7', name: 'Software Engineering' },
    { id: 'S8', name: 'Data Structures' },
  ];

  const admins = [
    { id: 'A1', name: 'Dr. Rahul Sharma', email: 'rahul.sharma@acropolis.in', empId: 'EMP001', subjects: ['S1', 'S4'], classes: ['2_IT1', '2_IT2', '3_IT1'] },
    { id: 'A2', name: 'Prof. Neha Patel', email: 'neha.patel@acropolis.in', empId: 'EMP002', subjects: ['S2'], classes: ['2_IT1', '2_DS1'] },
    { id: 'A3', name: 'Prof. Amit Singh', email: 'amit.singh@acropolis.in', empId: 'EMP003', subjects: ['S3'], classes: ['3_IT2', '3_DS2'] },
    { id: 'A4', name: 'Dr. Priya Verma', email: 'priya.verma@acropolis.in', empId: 'EMP004', subjects: ['S5'], classes: ['3_IT1', '3_IT2'] },
    { id: 'A5', name: 'Prof. Sanjay Kumar', email: 'sanjay.kumar@acropolis.in', empId: 'EMP005', subjects: ['S6'], classes: ['3_DS1', '3_DS2'] },
    { id: 'A6', name: 'Dr. Anjali Gupta', email: 'anjali.gupta@acropolis.in', empId: 'EMP006', subjects: ['S7'], classes: ['3_IT1', '3_DS1'] },
    { id: 'A7', name: 'Prof. Vikram Rathore', email: 'vikram.rathore@acropolis.in', empId: 'EMP007', subjects: ['S8'], classes: ['2_DS1', '2_DS2'] },
    { id: 'A8', name: 'Dr. Megha Singh', email: 'megha.singh@acropolis.in', empId: 'EMP008', subjects: ['S1', 'S2'], classes: ['2_DS2', '3_DS1'] },
    { id: 'A9', name: 'Prof. Rohit Jain', email: 'rohit.jain@acropolis.in', empId: 'EMP009', subjects: ['S4'], classes: ['2_IT1', '2_DS1'] },
    { id: 'A10', name: 'Dr. Kavita Joshi', email: 'kavita.joshi@acropolis.in', empId: 'EMP010', subjects: ['S5', 'S3'], classes: ['3_IT1', '3_IT2', '3_DS1'] },
  ];

  const students = [];
  let studentCounter = 1;
  const firstNames = ['Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Advik', 'Kabir', 'Anika', 'Navya', 'Ayaan', 'Dhruv', 'Sanya', 'Tara', 'Rohan', 'Arjun', 'Meera', 'Riya', 'Ishaan', 'Kriti', 'Aditya'];
  const lastNames = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Joshi', 'Chauhan', 'Rajput', 'Jain', 'Mehta', 'Bansal', 'Agarwal', 'Mishra', 'Pandey', 'Tiwari', 'Yadav', 'Reddy', 'Nair', 'Das'];

  classes.forEach((cls) => {
    for (let i = 0; i < 60; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const enrollNum = `0827${cls.name.replace('-', '')}${23000 + studentCounter}`;
      
      const overallAttendance = Math.floor(Math.random() * 40) + 60; // 60-100%
      
      students.push({
        id: `STU${studentCounter}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${studentCounter}@acropolis.in`,
        enrollmentNumber: enrollNum,
        phone: `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`,
        classId: cls.id,
        className: cls.name,
        year: cls.year,
        branch: 'Information Technology',
        overallAttendance,
        avatar: `https://i.pravatar.cc/150?u=${enrollNum}`
      });
      studentCounter++;
    }
  });

  const notices = Array.from({ length: 30 }).map((_, i) => ({
    id: `N${i + 1}`,
    title: `Important Notice regarding ${['Mid-Sem Exams', 'Hackathon Registration', 'Holiday', 'Placement Drive', 'Guest Lecture'][Math.floor(Math.random() * 5)]}`,
    category: ['Academic', 'Department', 'Placement', 'Hackathon', 'Holiday', 'Emergency', 'Events'][Math.floor(Math.random() * 7)],
    date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
    content: 'Please find the details attached for the upcoming event. All students are requested to be present.',
    postedBy: admins[Math.floor(Math.random() * admins.length)].name,
  }));

  const events = Array.from({ length: 15 }).map((_, i) => ({
    id: `E${i + 1}`,
    title: `${['Tech Symposium', 'AI Workshop', 'Annual Hackathon', 'Alumni Meet', 'Code Debugging Contest'][Math.floor(Math.random() * 5)]} 2026`,
    description: 'Join us for an exciting session of learning and networking.',
    date: new Date(Date.now() + Math.random() * 10000000000).toISOString().split('T')[0],
    time: '10:00 AM',
    venue: ['Main Auditorium', 'Lab 1', 'Lab 2', 'Seminar Hall', 'Virtual'][Math.floor(Math.random() * 5)],
    registrationDeadline: new Date(Date.now() + Math.random() * 5000000000).toISOString().split('T')[0],
    attendanceIncluded: Math.random() > 0.5,
  }));

  const assignmentTypes = ['PDF Assignment', 'Document Assignment', 'ZIP/File Submission', 'Online Assignment'];
  
  const assignments = Array.from({ length: 50 }).map((_, i) => {
    const classObj = classes[Math.floor(Math.random() * classes.length)];
    const type = assignmentTypes[Math.floor(Math.random() * assignmentTypes.length)];
    const deadlineDate = new Date(Date.now() + (Math.random() * 40 - 20) * 86400000); // Past or future
    const isExpired = deadlineDate < new Date();
    const createdAt = new Date(deadlineDate.getTime() - 7 * 86400000);
    
    return {
      id: `AS${i + 1}`,
      title: `Assignment ${Math.floor(Math.random() * 5) + 1} - ${['Practical', 'Theory', 'Project', 'Research'][Math.floor(Math.random() * 4)]}`,
      subjectId: subjects[Math.floor(Math.random() * subjects.length)].id,
      classId: classObj.id,
      department: classObj.name.includes('IT') ? 'IT' : 'DS',
      academicYear: classObj.year,
      type,
      deadline: deadlineDate.toISOString(),
      maxMarks: [10, 20, 50][Math.floor(Math.random() * 3)],
      description: 'Complete all questions and upload the required file before the deadline.',
      instructions: '1. Follow naming convention.\n2. Ensure no plagiarism.\n3. Submit in allowed format.',
      allowedFileTypes: type === 'PDF Assignment' ? ['.pdf'] : type === 'ZIP/File Submission' ? ['.zip', '.rar'] : ['.pdf', '.docx'],
      maxUploadSize: '10MB',
      attachmentUrl: 'https://example.com/assignment.pdf',
      lateSubmissionAllowed: Math.random() > 0.5,
      lateSubmissionDeduction: 10,
      status: isExpired ? (Math.random() > 0.5 ? 'Graded' : 'Expired') : (Math.random() > 0.8 ? 'Upcoming' : 'Open'),
      createdAt: createdAt.toISOString()
    };
  });

  const assignmentSubmissions = [];
  assignments.forEach(assignment => {
    const eligibleStudents = students.filter(s => s.classId === assignment.classId);
    eligibleStudents.forEach(student => {
       const submitted = Math.random() > (assignment.status === 'Upcoming' ? 1.0 : 0.3); // 70% submission rate if not upcoming
       if (submitted) {
         const submitDate = new Date(new Date(assignment.createdAt).getTime() + Math.random() * (new Date(assignment.deadline).getTime() - new Date(assignment.createdAt).getTime() + 86400000));
         const isLate = submitDate > new Date(assignment.deadline);
         
         assignmentSubmissions.push({
           id: `SUB_${assignment.id}_${student.id}`,
           assignmentId: assignment.id,
           studentId: student.id,
           submitDate: submitDate.toISOString(),
           status: isLate ? 'Late Submitted' : (assignment.status === 'Graded' ? 'Graded' : 'Submitted'),
           fileUrl: 'https://example.com/submission.pdf',
           fileName: `${student.enrollmentNumber}_${assignment.id}.pdf`,
           fileSize: '2.4 MB',
           marksAwarded: assignment.status === 'Graded' ? Math.floor(Math.random() * assignment.maxMarks) : null
         });
       }
    });
  });

  const quizzes = Array.from({ length: 30 }).map((_, i) => {
    const classObj = classes[Math.floor(Math.random() * classes.length)];
    const dateObj = new Date(Date.now() + (Math.random() * 60 - 30) * 86400000); // Past or future
    const isPast = dateObj < new Date();
    const totalMarks = [20, 30, 50, 100][Math.floor(Math.random() * 4)];
    const numQuestions = totalMarks / (Math.random() > 0.5 ? 1 : 2);

    return {
      id: `Q${i + 1}`,
      title: `Unit ${Math.floor(Math.random() * 5) + 1} Quiz - ${['Practical', 'Theory', 'Mock', 'Final'][Math.floor(Math.random() * 4)]}`,
      subjectId: subjects[Math.floor(Math.random() * subjects.length)].id,
      classId: classObj.id,
      department: classObj.name.includes('IT') ? 'IT' : 'DS',
      academicYear: classObj.year,
      facultyName: admins[Math.floor(Math.random() * admins.length)].name,
      date: dateObj.toISOString().split('T')[0],
      startTime: dateObj.toISOString(),
      duration: [15, 30, 45, 60][Math.floor(Math.random() * 4)], // minutes
      type: ['MCQ', 'Programming', 'Mixed'][Math.floor(Math.random() * 3)],
      difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
      totalMarks,
      passingMarks: Math.floor(totalMarks * 0.4),
      numQuestions,
      status: isPast ? 'Completed' : (Math.random() > 0.5 ? 'Active' : 'Upcoming'),
      createdAt: new Date(dateObj.getTime() - 7 * 86400000).toISOString()
    };
  });

  const quizAttempts = [];
  quizzes.forEach(quiz => {
    if (quiz.status !== 'Upcoming') {
      const eligibleStudents = students.filter(s => s.classId === quiz.classId);
      const attemptsForQuiz = [];
      eligibleStudents.forEach(student => {
        const attempted = Math.random() > (quiz.status === 'Completed' ? 0.1 : 0.6);
        if (attempted) {
          const score = Math.floor(Math.random() * (quiz.totalMarks + 1));
          const timeTaken = Math.floor(Math.random() * quiz.duration) + 1;
          const percentage = (score / quiz.totalMarks) * 100;
          const status = percentage >= 40 ? 'Passed' : 'Failed';
          const submitDate = new Date(new Date(quiz.startTime).getTime() + timeTaken * 60000);
          
          attemptsForQuiz.push({
            id: `QA_${quiz.id}_${student.id}`,
            quizId: quiz.id,
            studentId: student.id,
            score,
            percentage,
            timeTaken, // in minutes
            status,
            submissionTime: submitDate.toISOString(),
            correctAnswers: score, // simplified
            incorrectAnswers: quiz.numQuestions - score - (Math.floor(Math.random() * 2)), 
            unattemptedQuestions: Math.floor(Math.random() * 2)
          });
        }
      });
      // Sort by score to assign ranks
      attemptsForQuiz.sort((a, b) => b.score - a.score);
      attemptsForQuiz.forEach((attempt, index) => {
        attempt.rank = index + 1;
        quizAttempts.push(attempt);
      });
    }
  });

  const aiInsights = [
    "Attendance is dropping in IT-2 for Data Structures. Consider scheduling a remedial class.",
    "Student STU45 is at risk due to consecutive missed assignments in Web Development.",
    "Mid-Sem performance in Operating System is 15% lower than last year. Topic 'Deadlocks' needs revision.",
    "Notice engagement is low. 40% of 2nd-year students haven't viewed the recent Hackathon update.",
    "AI Prediction: 12 students in DS-1 might fall below 75% attendance if they miss 2 more classes.",
    "Study Recommendation for IT-1: Focus on Python standard libraries for the upcoming placement drive.",
    "Assignment Analysis: 80% of students submitted the Java assignment late. Consider adjusting future deadlines."
  ];

  const examinations = Array.from({ length: 15 }).map((_, i) => {
    const classObj = classes[Math.floor(Math.random() * classes.length)];
    const isPast = Math.random() > 0.4;
    return {
      id: `EXM${i + 1}`,
      name: `${['Mid Semester', 'Final Semester', 'Class Test'][Math.floor(Math.random() * 3)]} 2026`,
      subjectId: subjects[Math.floor(Math.random() * subjects.length)].id,
      classId: classObj.id,
      department: classObj.name.includes('IT') ? 'IT' : 'DS',
      academicYear: classObj.year,
      date: new Date(Date.now() + (isPast ? -1 : 1) * Math.random() * 30 * 86400000).toISOString().split('T')[0],
      duration: [120, 180][Math.floor(Math.random() * 2)], // minutes
      status: isPast ? 'Completed' : 'Upcoming'
    };
  });

  const examinationResults = [];
  examinations.filter(e => e.status === 'Completed').forEach(exam => {
    const eligibleStudents = students.filter(s => s.classId === exam.classId);
    eligibleStudents.forEach(student => {
      const maxMarks = 100;
      const obtainedMarks = Math.floor(Math.random() * (maxMarks - 20)) + 20;
      const percentage = (obtainedMarks / maxMarks) * 100;
      const status = percentage >= 40 ? 'Pass' : 'Fail';
      let grade = 'F';
      if (percentage >= 90) grade = 'O';
      else if (percentage >= 80) grade = 'A+';
      else if (percentage >= 70) grade = 'A';
      else if (percentage >= 60) grade = 'B+';
      else if (percentage >= 50) grade = 'B';
      else if (percentage >= 40) grade = 'C';
      
      examinationResults.push({
        id: `EXMR_${exam.id}_${student.id}`,
        examinationId: exam.id,
        studentId: student.id,
        obtainedMarks,
        maxMarks,
        percentage,
        grade,
        status,
        remarks: status === 'Pass' ? 'Good performance' : 'Needs improvement'
      });
    });
  });

  const examTimetables = examinations.map(exam => ({
    id: `EXT_${exam.id}`,
    examinationId: exam.id,
    day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][Math.floor(Math.random() * 5)],
    time: '10:00 AM - 01:00 PM',
    hall: `Block ${['A', 'B', 'C'][Math.floor(Math.random() * 3)]} - ${Math.floor(Math.random() * 300) + 100}`,
    facultyId: admins[Math.floor(Math.random() * admins.length)].id,
    instructions: '1. Carry your ID card.\n2. No electronic devices allowed.'
  }));

  return { classes, subjects, admins, students, notices, events, assignments, assignmentSubmissions, quizzes, quizAttempts, aiInsights, examinations, examinationResults, examTimetables };
};

const mockData = generateMockData();

module.exports = { mockData, generateMockData };
