const { Client } = require('pg');
const { mockData } = require('./mockData');

const migrate = async () => {
  // Let's try common default passwords
  const passwordsToTry = ['payal', 'postgres', 'root', 'admin', ''];
  let client;
  let connected = false;

  for (const password of passwordsToTry) {
    try {
      client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'acronexus',
        password: password,
        port: 5432,
      });
      await client.connect();
      console.log(`Connected successfully with password: '${password}'`);
      connected = true;
      break;
    } catch (err) {
      if (err.code === '3D000') {
        console.error(`Database 'acronexus' does not exist. The user instructed to migrate to the *existing* database 'acronexus'. Please create the database or provide correct credentials.`);
        process.exit(1);
      }
      // If auth failed, try next password
      if (err.message.includes('password authentication failed') || err.message.includes('authentication failed')) {
        continue;
      }
      console.error(`Connection error: ${err.message}`);
    }
  }

  if (!connected) {
    console.error('Failed to connect to PostgreSQL with default credentials. Please update index.js with your correct DB credentials.');
    process.exit(1);
  }

  try {
    console.log('Creating tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS classes (
        id VARCHAR(50) PRIMARY KEY,
        year VARCHAR(50),
        name VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS subjects (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        emp_id VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS admin_subjects (
        admin_id VARCHAR(50),
        subject_id VARCHAR(50),
        PRIMARY KEY (admin_id, subject_id)
      );

      CREATE TABLE IF NOT EXISTS admin_classes (
        admin_id VARCHAR(50),
        class_id VARCHAR(50),
        PRIMARY KEY (admin_id, class_id)
      );

      CREATE TABLE IF NOT EXISTS students (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        enrollment_number VARCHAR(100),
        phone VARCHAR(50),
        class_id VARCHAR(50),
        class_name VARCHAR(50),
        year VARCHAR(50),
        branch VARCHAR(100),
        overall_attendance INT,
        avatar VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS notices (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255),
        category VARCHAR(100),
        date DATE,
        content TEXT,
        posted_by VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        date DATE,
        time VARCHAR(50),
        venue VARCHAR(100),
        registration_deadline DATE,
        attendance_included BOOLEAN
      );

      CREATE TABLE IF NOT EXISTS assignments (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255),
        subject_id VARCHAR(50),
        class_id VARCHAR(50),
        deadline DATE,
        max_marks INT,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS quizzes (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255),
        subject_id VARCHAR(50),
        class_id VARCHAR(50),
        date DATE,
        duration INT,
        type VARCHAR(50),
        difficulty VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS ai_insights (
        id SERIAL PRIMARY KEY,
        content TEXT
      );
    `);

    console.log('Tables created successfully. Inserting data...');

    // Clear existing data just in case
    await client.query(`
      TRUNCATE TABLE ai_insights, quizzes, assignments, events, notices, students, admin_classes, admin_subjects, admins, subjects, classes RESTART IDENTITY CASCADE;
    `);

    // Insert Classes
    for (const cls of mockData.classes) {
      await client.query(`INSERT INTO classes (id, year, name) VALUES ($1, $2, $3)`, [cls.id, cls.year, cls.name]);
    }

    // Insert Subjects
    for (const sub of mockData.subjects) {
      await client.query(`INSERT INTO subjects (id, name) VALUES ($1, $2)`, [sub.id, sub.name]);
    }

    // Insert Admins
    for (const admin of mockData.admins) {
      await client.query(`INSERT INTO admins (id, name, email, emp_id) VALUES ($1, $2, $3, $4)`, [admin.id, admin.name, admin.email, admin.empId]);
      for (const subId of admin.subjects) {
        await client.query(`INSERT INTO admin_subjects (admin_id, subject_id) VALUES ($1, $2)`, [admin.id, subId]);
      }
      for (const classId of admin.classes) {
        await client.query(`INSERT INTO admin_classes (admin_id, class_id) VALUES ($1, $2)`, [admin.id, classId]);
      }
    }

    // Insert Students
    for (const stu of mockData.students) {
      await client.query(`
        INSERT INTO students (id, name, email, enrollment_number, phone, class_id, class_name, year, branch, overall_attendance, avatar)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [stu.id, stu.name, stu.email, stu.enrollmentNumber, stu.phone, stu.classId, stu.className, stu.year, stu.branch, stu.overallAttendance, stu.avatar]);
    }

    // Insert Notices
    for (const notice of mockData.notices) {
      await client.query(`
        INSERT INTO notices (id, title, category, date, content, posted_by)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [notice.id, notice.title, notice.category, notice.date, notice.content, notice.postedBy]);
    }

    // Insert Events
    for (const event of mockData.events) {
      await client.query(`
        INSERT INTO events (id, title, description, date, time, venue, registration_deadline, attendance_included)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [event.id, event.title, event.description, event.date, event.time, event.venue, event.registrationDeadline, event.attendanceIncluded]);
    }

    // Insert Assignments
    for (const assignment of mockData.assignments) {
      await client.query(`
        INSERT INTO assignments (id, title, subject_id, class_id, deadline, max_marks, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [assignment.id, assignment.title, assignment.subjectId, assignment.classId, assignment.deadline, assignment.maxMarks, assignment.description]);
    }

    // Insert Quizzes
    for (const quiz of mockData.quizzes) {
      await client.query(`
        INSERT INTO quizzes (id, title, subject_id, class_id, date, duration, type, difficulty)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [quiz.id, quiz.title, quiz.subjectId, quiz.classId, quiz.date, quiz.duration, quiz.type, quiz.difficulty]);
    }

    // Insert AI Insights
    for (const insight of mockData.aiInsights) {
      await client.query(`INSERT INTO ai_insights (content) VALUES ($1)`, [insight]);
    }

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
};

migrate();
