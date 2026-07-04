export const generateMockData = () => {
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
    { id: 'A1', name: 'Dr. Rahul Sharma', email: 'rahul.sharma@acropolis.in', empId: 'EMP001', subjects: ['S1', 'S4'], classes: ['2_IT1', '2_IT2', '3_IT1'], role: 'hod' },
    { id: 'A2', name: 'Prof. Neha Patel', email: 'neha.patel@acropolis.in', empId: 'EMP002', subjects: ['S2'], classes: ['2_IT1', '2_DS1'], role: 'coordinator' },
    { id: 'A3', name: 'Prof. Amit Singh', email: 'amit.singh@acropolis.in', empId: 'EMP003', subjects: ['S3'], classes: ['3_IT2', '3_DS2'], role: 'coordinator' },
    { id: 'A4', name: 'Dr. Priya Verma', email: 'priya.verma@acropolis.in', empId: 'EMP004', subjects: ['S5'], classes: ['3_IT1', '3_IT2'], role: 'faculty' },
    { id: 'A5', name: 'Prof. Sanjay Kumar', email: 'sanjay.kumar@acropolis.in', empId: 'EMP005', subjects: ['S6'], classes: ['3_DS1', '3_DS2'], role: 'faculty' },
    { id: 'A6', name: 'Dr. Anjali Gupta', email: 'anjali.gupta@acropolis.in', empId: 'EMP006', subjects: ['S7'], classes: ['3_IT1', '3_DS1'], role: 'faculty' },
    { id: 'A7', name: 'Prof. Vikram Rathore', email: 'vikram.rathore@acropolis.in', empId: 'EMP007', subjects: ['S8'], classes: ['2_DS1', '2_DS2'], role: 'faculty' },
    { id: 'A8', name: 'Dr. Megha Singh', email: 'megha.singh@acropolis.in', empId: 'EMP008', subjects: ['S1', 'S2'], classes: ['2_DS2', '3_DS1'], role: 'faculty' },
    { id: 'A9', name: 'Prof. Rohit Jain', email: 'rohit.jain@acropolis.in', empId: 'EMP009', subjects: ['S4'], classes: ['2_IT1', '2_DS1'], role: 'faculty' },
    { id: 'A10', name: 'Dr. Kavita Joshi', email: 'kavita.joshi@acropolis.in', empId: 'EMP010', subjects: ['S5', 'S3'], classes: ['3_IT1', '3_IT2', '3_DS1'], role: 'faculty' },
  ];

  const students: any[] = [];
  let studentCounter = 1;
  const firstNames = ['Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Advik', 'Kabir', 'Anika', 'Navya', 'Ayaan', 'Dhruv', 'Sanya', 'Tara', 'Rohan', 'Arjun', 'Meera', 'Riya', 'Ishaan', 'Kriti', 'Aditya'];
  const lastNames = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Joshi', 'Chauhan', 'Rajput', 'Jain', 'Mehta', 'Bansal', 'Agarwal', 'Mishra', 'Pandey', 'Tiwari', 'Yadav', 'Reddy', 'Nair', 'Das'];

  const facultyRequests = [
    { id: 'FR1', name: 'Ravi Verma', email: 'ravi.verma@acropolis.in', empId: 'EMP101', mobile: '+91 9876543210', department: 'Information Technology', requestedClasses: ['2_IT1', '2_IT2'], status: 'Pending', requestedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'FR2', name: 'Simran Kaur', email: 'simran.kaur@acropolis.in', empId: 'EMP102', mobile: '+91 8765432109', department: 'Computer Science', requestedClasses: ['3_DS1', '3_DS2'], status: 'Pending', requestedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: 'FR3', name: 'Kunal Desai', email: 'kunal.desai@acropolis.in', empId: 'EMP103', mobile: '+91 7654321098', department: 'Data Science', requestedClasses: ['2_DS1'], status: 'Pending', requestedAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  ];

  classes.forEach((cls) => {
    for (let i = 0; i < 60; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const enrollNum = `0827${cls.name.replace('-', '')}${23000 + studentCounter}`;
      
      const overallAttendance = Math.floor(Math.random() * 40) + 60; // 60-100%
      const cgpa = (Math.random() * 4 + 6).toFixed(2);
      
      students.push({
        id: `STU${studentCounter}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${studentCounter}@acropolis.in`,
        enrollmentNumber: enrollNum,
        phone: `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`,
        classId: cls.id,
        className: cls.name,
        year: cls.year,
        semester: cls.year === 'Second Year' ? '3rd' : '5th',
        batch: i < 30 ? 'A1' : 'A2',
        branch: 'Information Technology',
        overallAttendance,
        avatar: `https://i.pravatar.cc/150?u=${enrollNum}`,
        sgpa: {
          sem1: (Math.random() * 3 + 7).toFixed(2),
          sem2: (Math.random() * 3 + 7).toFixed(2),
          sem3: cls.year !== 'First Year' ? (Math.random() * 3 + 7).toFixed(2) : null,
          sem4: cls.year === 'Third Year' ? (Math.random() * 3 + 7).toFixed(2) : null,
          sem5: null, sem6: null, sem7: null, sem8: null
        },
        cgpa,
        activeBacklogs: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0,
        subjects: ['S1', 'S2', 'S3', 'S4', 'S5'].map(id => subjects.find(s => s.id === id)?.name),
        batchCoordinator: admins[Math.floor(Math.random() * admins.length)].name,
      });
      studentCounter++;
    }
  });

  const noticeTemplates = [
    {
      title: 'Revised Schedule for Mid-Semester Examinations',
      category: 'Examination',
      priority: 'High',
      description: 'This is to inform all students that the Mid-Semester Examinations for the current session have been rescheduled. The exams will now commence on the 15th of next month. Please check the attached revised timetable. Ensure you carry your college ID card and hall ticket. No student will be permitted to enter the examination hall without valid identification. Reach out to the examination cell for any discrepancies.'
    },
    {
      title: 'TCS Campus Recruitment Drive - Registration Details',
      category: 'Placement',
      priority: 'Urgent',
      description: 'Tata Consultancy Services (TCS) will be conducting a campus recruitment drive for final and pre-final year students. Eligible branches: IT, CS, DS, EC. Criteria: Minimum 60% or 6.0 CGPA throughout academic career with no active backlogs. Interested students must register via the TNP portal by EOD tomorrow. The selection process includes an online aptitude test followed by technical and HR interviews.'
    },
    {
      title: 'Declaration of Diwali Holidays',
      category: 'Holiday',
      priority: 'Normal',
      description: 'The college will remain closed on account of Diwali festival from 20th October to 25th October. Regular classes will resume on 26th October. Hostel students planning to leave for their hometowns must submit a leave application to their respective wardens before departure. Wishing all students and staff a very Happy and Safe Diwali.'
    },
    {
      title: 'Call for Papers: International Conference on AI & Data Science',
      category: 'Academic',
      priority: 'Normal',
      description: 'The Department of Computer Science is hosting the International Conference on AI & Data Science (ICAIDS-2026). Students and faculty members are invited to submit their original research papers. Accepted papers will be published in Scopus-indexed proceedings. The deadline for paper submission is 30th November. Refer to the attached brochure for submission guidelines and formatting rules.'
    },
    {
      title: 'Mandatory Seminar on Cyber Security Awareness',
      category: 'Seminar',
      priority: 'Important',
      description: 'A mandatory seminar on "Emerging Threats in Cyber Security" will be conducted by industry experts from Cisco. All Second and Third-year students must attend. Attendance will be recorded and will count towards your term evaluation. Venue: Main Auditorium. Time: 10:00 AM onwards. Please take your seats 15 minutes before the start of the session.'
    },
    {
      title: 'Submission of Final Year Project Synopsis',
      category: 'Assignment',
      priority: 'Urgent',
      description: 'All final year students must submit their project synopsis to their respective guides by the end of this week. The synopsis should follow the standard IEEE format and clearly outline the problem statement, proposed methodology, and expected outcomes. Late submissions will not be entertained and may result in a grade penalty for the continuous evaluation phase.'
    },
    {
      title: 'Inter-College Sports Meet 2026 Selection Trials',
      category: 'Sports',
      priority: 'Normal',
      description: 'Selections for the upcoming Inter-College Sports Meet will be held at the college sports grounds starting next Monday. Events include Cricket, Football, Basketball, Athletics, and Badminton. Interested students should report in proper sports attire. For detailed schedules of specific sports, please contact the Sports Officer.'
    },
    {
      title: 'Annual Cultural Fest "Aarohan" - Call for Volunteers',
      category: 'Cultural',
      priority: 'Normal',
      description: 'Our annual cultural festival "Aarohan" is scheduled for next month. We are looking for enthusiastic student volunteers for various committees including Stage Management, Hospitality, Sponsorship, and Media. Interested students can apply via the student portal. Let\'s work together to make this year\'s fest the biggest one yet!'
    },
    {
      title: 'Notice regarding pending fee payment',
      category: 'Urgent',
      priority: 'Urgent',
      description: 'Students who have not yet paid their tuition and hostel fees for the current semester are strictly advised to clear their dues within 3 days. Failure to do so will result in suspension of library privileges and blocking of the student portal. Ignore this notice if you have already paid the fees.'
    },
    {
      title: 'State Government Scholarship Renewal Application',
      category: 'Scholarship',
      priority: 'Important',
      description: 'Students availing the State Government Post-Matric Scholarship must renew their applications on the state scholarship portal. The last date for online renewal and submission of hard copies to the scholarship department in the college is 15th of this month. Required documents include income certificate, previous semester mark sheet, and Aadhaar card copy.'
    }
  ];

  const notices = Array.from({ length: 40 }).map((_, i) => {
    const template = noticeTemplates[i % noticeTemplates.length];
    const publishDate = new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000); // within last 15 days
    const expiryDate = new Date(publishDate.getTime() + (Math.random() * 20 + 5) * 24 * 60 * 60 * 1000); // 5 to 25 days later
    const statuses = ['Active', 'Active', 'Active', 'Draft', 'Archived'];
    return {
      id: `not-${i + 1}`,
      title: `${template.title} ${Math.floor(i / noticeTemplates.length) > 0 ? `(Update ${Math.floor(i / noticeTemplates.length)})` : ''}`,
      category: template.category,
      priority: template.priority,
      publishDate: publishDate.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      description: template.description,
      attachments: Math.random() > 0.4 ? [
        { name: `${template.title.split(' ')[0]}_Details.pdf`, type: 'PDF', size: `${(Math.random() * 4 + 0.5).toFixed(1)} MB` },
        ...(Math.random() > 0.8 ? [{ name: 'Annexure.docx', type: 'DOCX', size: '1.2 MB' }] : [])
      ] : [],
      views: Math.floor(Math.random() * 1000) + 50,
      downloads: Math.floor(Math.random() * 300),
      isPinned: Math.random() > 0.85,
      allowDownloads: true,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      classId: classes[Math.floor(Math.random() * classes.length)].id,
      targetClasses: [classes[Math.floor(Math.random() * classes.length)].name],
      targetYear: ['2nd Year', '3rd Year', '4th Year'][Math.floor(Math.random() * 3)],
      targetSemester: `Semester ${Math.floor(Math.random() * 6) + 3}`,
      postedBy: admins[Math.floor(Math.random() * admins.length)].name,
    };
  });

  const eventTemplates = [
    { title: 'Annual Tech Symposium "Avishkar"', desc: 'A two-day national level technical fest featuring coding competitions, hackathons, and robotics challenges.', venue: 'Main Auditorium' },
    { title: 'Workshop on Generative AI & LLMs', desc: 'Hands-on workshop covering fundamentals of Large Language Models and prompt engineering by industry experts.', venue: 'Lab 1' },
    { title: 'Alumni Mentorship Session', desc: 'Interactive session with distinguished alumni working at top tech companies. Great opportunity for career guidance.', venue: 'Seminar Hall' },
    { title: 'Inter-College Hackathon 2026', desc: '36-hour continuous coding challenge to build innovative solutions for smart city problems.', venue: 'Main Auditorium' },
    { title: 'Seminar on Higher Education Abroad', desc: 'Guidance seminar on GRE/TOEFL preparation, university shortlisting, and scholarship opportunities.', venue: 'Virtual' }
  ];

  const events = Array.from({ length: 15 }).map((_, i) => {
    const template = eventTemplates[i % eventTemplates.length];
    return {
      id: `E${i + 1}`,
      title: `${template.title} ${Math.floor(i / eventTemplates.length) > 0 ? `(Vol ${Math.floor(i / eventTemplates.length) + 1})` : ''}`,
      description: template.desc,
      date: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next 60 days
      time: ['10:00 AM', '02:00 PM', '11:30 AM', '04:00 PM'][Math.floor(Math.random() * 4)],
      venue: template.venue,
      registrationDeadline: new Date(Date.now() + Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      attendanceIncluded: Math.random() > 0.5,
    };
  });

  const assignmentTypes = ['PDF Assignment', 'Document Assignment', 'ZIP/File Submission', 'Online Assignment'];
  
  const assignmentTemplates = [
    { title: 'Data Structures Implementation', type: 'Practical', desc: 'Implement Binary Search Tree and AVL tree in Java. Compare their insertion and search time complexities with a dataset of 10,000 random integers.' },
    { title: 'Process Scheduling Simulation', type: 'Project', desc: 'Create a simulation program for FCFS, SJF, and Round Robin scheduling algorithms. Generate a comprehensive report comparing their average turnaround times.' },
    { title: 'Database Normalization Case Study', type: 'Theory', desc: 'Analyze the given unnormalized e-commerce database schema. Convert it into 1NF, 2NF, 3NF, and BCNF, explaining the functional dependencies at each step.' },
    { title: 'Web App Clone - Frontend UI', type: 'Practical', desc: 'Develop a responsive frontend clone of a popular video streaming platform using React and Tailwind CSS. Ensure cross-browser compatibility.' },
    { title: 'Subnetting Exercise', type: 'Theory', desc: 'Solve the 15 subnetting problems provided in the attached document. Show all calculations for network addresses, broadcast addresses, and valid host ranges.' },
    { title: 'SRS Document Creation', type: 'Project', desc: 'Draft a complete Software Requirements Specification (SRS) document for a hypothetical Library Management System following IEEE standards.' },
    { title: 'Data Analysis Project', type: 'Practical', desc: 'Analyze the provided COVID-19 dataset using Pandas and Matplotlib. Create visualizations for daily active cases and vaccination rates across different regions.' },
    { title: 'Machine Learning Deployment', type: 'Research', desc: 'Train a basic image classification model using TensorFlow and deploy it as a REST API using FastAPI. Provide the GitHub repository link.' }
  ];

  const assignments = Array.from({ length: 50 }).map((_, i) => {
    const classObj = classes[Math.floor(Math.random() * classes.length)];
    const template = assignmentTemplates[i % assignmentTemplates.length];
    const type = assignmentTypes[Math.floor(Math.random() * assignmentTypes.length)];
    const deadlineDate = new Date(Date.now() + (Math.random() * 40 - 20) * 86400000); // Past or future
    const isExpired = deadlineDate < new Date();
    const createdAt = new Date(deadlineDate.getTime() - 7 * 86400000);
    
    return {
      id: `AS${i + 1}`,
      title: `${template.title} (Batch ${classObj.name})`,
      subjectId: subjects[Math.floor(Math.random() * subjects.length)].id,
      classId: classObj.id,
      department: classObj.name.includes('IT') ? 'IT' : 'DS',
      academicYear: classObj.year,
      type,
      deadline: deadlineDate.toISOString(),
      maxMarks: [10, 20, 50][Math.floor(Math.random() * 3)],
      description: template.desc,
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

  const assignmentSubmissions: any[] = [];
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
           fileName: `${student.enrollmentNumber}_${assignment.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
           fileSize: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
           marksAwarded: assignment.status === 'Graded' ? Math.floor(Math.random() * assignment.maxMarks) : null,
           aiSimilarity: `${Math.floor(Math.random() * 25 + 2)}%`
         });
       }
    });
  });

  const quizTemplates = [
    { title: 'Arrays and Strings', type: 'Theory', diff: 'Easy' },
    { title: 'Linked Lists and Trees', type: 'Practical', diff: 'Medium' },
    { title: 'OS Memory Management', type: 'Theory', diff: 'Hard' },
    { title: 'SQL Joins and Normalization', type: 'Practical', diff: 'Medium' },
    { title: 'React Hooks Deep Dive', type: 'Mock', diff: 'Hard' },
    { title: 'Software Engineering Life Cycle', type: 'Theory', diff: 'Easy' },
    { title: 'Machine Learning Basics', type: 'Mock', diff: 'Medium' },
    { title: 'Network OSI Layers', type: 'Theory', diff: 'Medium' }
  ];

  const quizzes = Array.from({ length: 30 }).map((_, i) => {
    const classObj = classes[Math.floor(Math.random() * classes.length)];
    const template = quizTemplates[i % quizTemplates.length];
    const dateObj = new Date(Date.now() + (Math.random() * 60 - 30) * 86400000); // Past or future
    const isPast = dateObj < new Date();
    const totalMarks = [20, 30, 50, 100][Math.floor(Math.random() * 4)];
    const numQuestions = totalMarks / (Math.random() > 0.5 ? 1 : 2);

    return {
      id: `Q${i + 1}`,
      title: `${template.title} Quiz - ${template.type}`,
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

  const quizAttempts: any[] = [];
  quizzes.forEach(quiz => {
    if (quiz.status !== 'Upcoming') {
      const eligibleStudents = students.filter(s => s.classId === quiz.classId);
      const attemptsForQuiz: any[] = [];
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

  const examinationResults: any[] = [];
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

  const activityTypes = ['Lecture', 'Lab', 'Meeting', 'Admin Work', 'Mentoring', 'Research'];
  const facultyActivities = Array.from({ length: 50 }).map((_, i) => {
    const faculty = admins[Math.floor(Math.random() * admins.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 14)); // Last 14 days
    date.setHours(8 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60)); // Random time between 8 AM and 4 PM
    
    return {
      id: `FA_${i + 1}`,
      facultyId: faculty.id,
      facultyName: faculty.name,
      department: 'Information Technology', // Default for mock
      type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      description: `Covered important topics regarding recent developments.`,
      date: date.toISOString(),
      duration: `${Math.floor(Math.random() * 2) + 1} hours`,
      status: Math.random() > 0.2 ? 'Completed' : 'In Progress'
    };
  });

  return { classes, subjects, admins, students, notices, events, assignments, assignmentSubmissions, quizzes, quizAttempts, examinations, examinationResults, examTimetables, facultyRequests, facultyActivities };
};

export const mockData = generateMockData();
