-- ==============================================================================
-- AcroNexus ERP - Production PostgreSQL Schema
-- ==============================================================================
-- This script contains the DDL for the complete backend schema mapped 1:1
-- from the frontend requirements and mock data structures.
-- Includes full support for History, Versioning, Bulk Uploads, and AI.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUM TYPES
-- ==============================================================================
CREATE TYPE user_role AS ENUM ('HOD', 'COORDINATOR', 'FACULTY', 'STUDENT');
CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE blood_group AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');
CREATE TYPE faculty_activity_status AS ENUM ('PRESENT', 'ABSENT', 'CLASS_MISSED', 'HOLIDAY');
CREATE TYPE exam_type AS ENUM ('MID_TERM', 'END_TERM', 'PRACTICAL', 'QUIZ');
CREATE TYPE exam_status AS ENUM ('UPCOMING', 'ACTIVE', 'COMPLETED', 'PUBLISHED');
CREATE TYPE notice_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE assignment_status AS ENUM ('UPCOMING', 'ACTIVE', 'COMPLETED', 'GRADED');
CREATE TYPE leave_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE upload_type AS ENUM ('STUDENT_LIST', 'FACULTY_LIST', 'SCHEME', 'SYLLABUS', 'TIMETABLE', 'RESULT');
CREATE TYPE processing_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'PARTIAL_SUCCESS');
CREATE TYPE degree_type AS ENUM ('BACHELOR', 'MASTER', 'PHD', 'DIPLOMA');

-- 2. CORE ORGANIZATION
-- ==============================================================================
CREATE TABLE campuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE degree_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID REFERENCES campuses(id),
    name VARCHAR(150) NOT NULL,
    type degree_type NOT NULL,
    duration_years INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID REFERENCES campuses(id),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. USERS & PROFILES
-- ==============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    gender gender,
    dob DATE,
    blood_group blood_group,
    profile_picture_url VARCHAR(500),
    department_id UUID REFERENCES departments(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by UUID, -- References users(id) but omitted constraint to avoid circular init
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    enrollment_no VARCHAR(50) UNIQUE NOT NULL,
    roll_no VARCHAR(50),
    degree_program_id UUID REFERENCES degree_programs(id),
    batch_year VARCHAR(20) NOT NULL
);

CREATE TABLE faculties (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    designation VARCHAR(100),
    joining_date DATE,
    qualification VARCHAR(255),
    experience_years INTEGER,
    expertise_areas TEXT[]
);

-- Historical & Profile Data
CREATE TABLE academic_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
    education_level VARCHAR(50) NOT NULL, -- '10th', '12th', 'Diploma'
    institution_name VARCHAR(255) NOT NULL,
    passing_year INTEGER NOT NULL,
    percentage DECIMAL(5,2),
    document_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE professional_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID REFERENCES faculties(user_id) ON DELETE CASCADE,
    resume_url VARCHAR(500),
    publications JSONB, -- Array of objects: title, year, link
    certifications JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. FILE STORAGE (Centralized for versions, AI)
-- ==============================================================================
CREATE TABLE file_storage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    parsed_content TEXT,
    ai_metadata JSONB,
    content_embedding REAL[],
    version_number INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SYSTEM LOGS & UPLOADS
-- ==============================================================================
CREATE TABLE bulk_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    upload_type upload_type NOT NULL,
    file_id UUID REFERENCES file_storage(id),
    processing_status processing_status DEFAULT 'PENDING',
    total_records INTEGER DEFAULT 0,
    successful_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    error_log JSONB,
    ai_mapping_log JSONB,
    rolled_back BOOLEAN DEFAULT FALSE,
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE ai_match_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    triggered_by UUID REFERENCES users(id),
    trigger_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    students_processed INTEGER DEFAULT 0,
    faculty_processed INTEGER DEFAULT 0,
    subjects_processed INTEGER DEFAULT 0,
    classes_created INTEGER DEFAULT 0,
    faculty_assignments_created INTEGER DEFAULT 0,
    coordinator_assignments_created INTEGER DEFAULT 0,
    warnings JSONB,
    manual_corrections JSONB
);

-- 6. ACADEMIC STRUCTURE
-- ==============================================================================
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year VARCHAR(20) UNIQUE NOT NULL, -- '2023-2024'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE
);

CREATE TABLE semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    semester_number INTEGER NOT NULL,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT FALSE,
    UNIQUE(academic_year_id, semester_number)
);

CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id),
    degree_program_id UUID REFERENCES degree_programs(id),
    name VARCHAR(50) NOT NULL, -- e.g., 'CS-A'
    section VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    credits INTEGER,
    type VARCHAR(20), -- 'Theory', 'Practical'
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subject_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id), semester_id UUID REFERENCES semesters(id),
    resource_type VARCHAR(50) NOT NULL, -- 'SYLLABUS', 'SCHEME'
    version_number INTEGER DEFAULT 1,
    file_id UUID REFERENCES file_storage(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ENROLLMENTS & ASSIGNMENTS (With History)
-- ==============================================================================
CREATE TABLE student_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id), semester_id UUID REFERENCES semesters(id),
    semester_id UUID REFERENCES semesters(id),
    class_id UUID REFERENCES classes(id),
    effective_from DATE NOT NULL,
    effective_to DATE,
    sgpa DECIMAL(4,2),
    cgpa DECIMAL(4,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE faculty_class_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID REFERENCES faculties(user_id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id), semester_id UUID REFERENCES semesters(id),
    semester_id UUID REFERENCES semesters(id),
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE coordinator_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coordinator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id), semester_id UUID REFERENCES semesters(id),
    semester_id UUID REFERENCES semesters(id),
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE class_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculties(user_id) ON DELETE SET NULL,
    academic_year_id UUID REFERENCES academic_years(id), semester_id UUID REFERENCES semesters(id),
    semester_id UUID REFERENCES semesters(id),
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. ACADEMIC OPERATIONS
-- ==============================================================================
CREATE TABLE lecture_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_subject_id UUID REFERENCES class_subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    unit_number INTEGER,
    version_number INTEGER DEFAULT 1,
    file_id UUID REFERENCES file_storage(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resource_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID REFERENCES lecture_materials(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id), semester_id UUID REFERENCES semesters(id),
    semester_id UUID REFERENCES semesters(id),
    version_number INTEGER DEFAULT 1,
    file_id UUID REFERENCES file_storage(id),
    is_active BOOLEAN DEFAULT TRUE,
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    priority notice_priority DEFAULT 'LOW',
    file_id UUID REFERENCES file_storage(id),
    publish_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    target_department_id UUID REFERENCES departments(id),
    target_class_id UUID REFERENCES classes(id),
    target_role user_role
);

-- 9. ATTENDANCE & FACULTY ACTIVITY (Immutable / With History)
-- ==============================================================================
CREATE TABLE student_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_subject_id UUID REFERENCES class_subjects(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL,
    marked_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_subject_id, student_id, date)
);

CREATE TABLE student_attendance_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attendance_id UUID REFERENCES student_attendance(id) ON DELETE CASCADE,
    previous_status attendance_status,
    new_status attendance_status NOT NULL,
    reason TEXT,
    modified_by UUID REFERENCES users(id),
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE faculty_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID REFERENCES faculties(user_id) ON DELETE CASCADE,
    class_subject_id UUID REFERENCES class_subjects(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    lecture_number INTEGER DEFAULT 1,
    status faculty_activity_status NOT NULL,
    reason TEXT,
    marked_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(faculty_id, class_subject_id, date, lecture_number)
);


-- 10. ASSIGNMENTS & QUIZZES
-- ==============================================================================
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_subject_id UUID REFERENCES class_subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_id UUID REFERENCES file_storage(id),
    max_marks INTEGER,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
    file_id UUID REFERENCES file_storage(id),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    marks_awarded DECIMAL(5,2),
    feedback TEXT,
    is_late BOOLEAN DEFAULT FALSE,
    UNIQUE(assignment_id, student_id)
);

CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_subject_id UUID REFERENCES class_subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    total_marks INTEGER,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    marks INTEGER DEFAULT 1
);

CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
    score DECIMAL(5,2),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(quiz_id, student_id)
);


-- 11. EXAMINATIONS
-- ==============================================================================
CREATE TABLE examinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id),
    semester_id UUID REFERENCES semesters(id),
    name VARCHAR(255) NOT NULL,
    type exam_type NOT NULL,
    status exam_status DEFAULT 'UPCOMING',
    start_date DATE,
    end_date DATE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exam_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    examination_id UUID REFERENCES examinations(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(50)
);

CREATE TABLE exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    examination_id UUID REFERENCES examinations(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5,2),
    max_marks DECIMAL(5,2),
    grade VARCHAR(5),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(examination_id, student_id, subject_id)
);

CREATE TABLE exam_results_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    result_id UUID REFERENCES exam_results(id) ON DELETE CASCADE,
    previous_marks_obtained DECIMAL(5,2),
    new_marks_obtained DECIMAL(5,2),
    modification_reason TEXT,
    modified_by UUID REFERENCES users(id),
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exam_ai_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    examination_id UUID REFERENCES examinations(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
    overall_performance TEXT,
    strengths TEXT[],
    areas_of_improvement TEXT[],
    action_plan TEXT,
    feedback_embedding REAL[],
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(examination_id, student_id)
);


-- 12. SYSTEM NOTIFICATIONS
-- ==============================================================================
CREATE TABLE user_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    action_path VARCHAR(255),
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ==============================================================================
-- INDEXES FOR PERFORMANCE & JSONB/VECTOR
-- ==============================================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_students_enrollment ON students(enrollment_no);

CREATE INDEX idx_class_subjects_class ON class_subjects(class_id);
CREATE INDEX idx_class_subjects_faculty ON class_subjects(faculty_id);

CREATE INDEX idx_student_attendance_date ON student_attendance(date);
CREATE INDEX idx_faculty_activities_date ON faculty_activities(date);

CREATE INDEX idx_assignments_deadline ON assignments(deadline);
CREATE INDEX idx_user_notifications_user ON user_notifications(user_id, is_read);

-- GIN Indexes for JSONB searchability
CREATE INDEX idx_file_storage_ai_metadata ON file_storage USING GIN (ai_metadata);
CREATE INDEX idx_bulk_uploads_errors ON bulk_uploads USING GIN (error_log);
CREATE INDEX idx_bulk_uploads_ai ON bulk_uploads USING GIN (ai_mapping_log);

-- HNSW Index for Vector Embeddings (Requires pgvector)
-- Indexes removed due to pgvector absence:
-- CREATE INDEX idx_file_storage_embedding ON file_storage USING hnsw (content_embedding vector_l2_ops);
-- CREATE INDEX idx_exam_ai_feedback_embedding ON exam_ai_feedback USING hnsw (feedback_embedding vector_l2_ops);

-- ==============================================================================
-- 13. EVENTS & EXTRA-CURRICULAR MANAGEMENT
-- ==============================================================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    venue VARCHAR(255),
    event_date TIMESTAMP WITH TIME ZONE,
    registration_start TIMESTAMP WITH TIME ZONE,
    registration_end TIMESTAMP WITH TIME ZONE,
    max_participants INT,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    target_class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    poster_file_id UUID REFERENCES file_storage(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(user_id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    attendance_status VARCHAR(50) DEFAULT 'PENDING',
    certificate_generated BOOLEAN DEFAULT FALSE,
    UNIQUE(event_id, student_id)
);
