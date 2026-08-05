import { Student, Note, Assignment, CBTTest, FeeRecord, StaffMember } from './types';

export const initialStudents: Student[] = [
    { id: 'STU001', name: 'Zayd Tahir', class: 'Grade 10-A', guardian: 'Kamal Tahir', status: 'Active' },
    { id: 'STU002', name: 'Amina Bello', class: 'Grade 11-B', guardian: 'Ibrahim Bello', status: 'Active' },
    { id: 'STU003', name: 'Chidi Okafor', class: 'Grade 10-A', guardian: 'Nneka Okafor', status: 'Active' },
    { id: 'STU004', name: 'Fatima Yusuf', class: 'Grade 12-C', guardian: 'Yusuf Aliyu', status: 'Active' },
    { id: 'STU005', name: 'David Mensah', class: 'Grade 10-B', guardian: 'Kofi Mensah', status: 'Inactive' },
    { id: 'STU006', name: 'Sarah Connor', class: 'Grade 12-A', guardian: 'John Connor', status: 'Suspended' },
    { id: 'STU007', name: 'Elena Gilbert', class: 'Grade 11-A', guardian: 'Miranda Gilbert', status: 'Active' },
    { id: 'STU008', name: 'Marcus Aurelius', class: 'Grade 9-A', guardian: 'Antoninus Pius', status: 'Active' }
];

export const initialNotes: Note[] = [
    { id: 'NTE001', title: 'Calculus Introduction Notes', subject: 'Mathematics', class: 'Grade 12-A', content: 'Calculus focuses on limits, functions, derivatives, integrals, and infinite series. Remember to review the power rule before the quiz on Friday.', date: '2026-07-28' },
    { id: 'NTE002', title: 'Photosynthesis Lecture Slides Summary', subject: 'Biology', class: 'Grade 10-B', content: 'Key phases: Light-dependent reactions (takes place in thylakoid membrane) and Light-independent reactions (Calvin cycle, takes place in stroma). Key outputs: Glucose & Oxygen.', date: '2026-07-29' },
    { id: 'NTE003', title: 'Hamlet Act III Analysis', subject: 'English Literature', class: 'Grade 11-A', content: 'Analysis of the "To be or not to be" soliloquy. The theme of action vs. inaction. Hamlet contemplates death, suicide, and the fear of the unknown after death.', date: '2026-07-30' },
    { id: 'NTE004', title: 'Newtonian Physics & Mechanics', subject: 'Physics', class: 'Grade 11-B', content: 'First Law (Inertia), Second Law (F=ma), and Third Law (Action & Reaction). Be ready to solve friction problems with vector decomposition.', date: '2026-07-31' }
];

export const initialAssignments: Assignment[] = [
    { id: 'ASM001', title: 'Quadratic Equations Exercise', subject: 'Mathematics', class: 'Grade 10-A', dueDate: '2026-08-05', status: 'Upcoming' },
    { id: 'ASM002', title: 'Periodic Table Trends Essay', subject: 'Chemistry', class: 'Grade 11-B', dueDate: '2026-08-02', status: 'Upcoming' },
    { id: 'ASM003', title: 'French Revolution Timeline', subject: 'History', class: 'Grade 10-B', dueDate: '2026-07-30', status: 'Graded' },
    { id: 'ASM004', title: 'JavaScript DOM Manipulation Lab', subject: 'Computer Science', class: 'Grade 12-A', dueDate: '2026-07-29', status: 'Submitted' }
];

export const initialCBTTests: CBTTest[] = [
    { id: 'CBT001', title: 'Term 1 Algebra Examination', subject: 'Mathematics', date: '2026-08-10', status: 'Scheduled', isSecure: true },
    { id: 'CBT002', title: 'Cell Biology Quick Assessment', subject: 'Biology', date: '2026-08-01', status: 'Live', isSecure: false },
    { id: 'CBT003', title: 'Organic Chemistry Mock Quiz', subject: 'Chemistry', date: '2026-07-25', status: 'Completed', isSecure: true },
    { id: 'CBT004', title: 'Shakespeare Soliloquy Test', subject: 'English Literature', date: '2026-08-15', status: 'Draft', isSecure: false }
];

export const initialFeeRecords: FeeRecord[] = [
    { id: 'FEE001', studentName: 'Zayd Tahir', class: 'Grade 10-A', amount: 1200, status: 'Paid', dueDate: '2026-07-15' },
    { id: 'FEE002', studentName: 'Amina Bello', class: 'Grade 11-B', amount: 1200, status: 'Unpaid', dueDate: '2026-08-15' },
    { id: 'FEE003', studentName: 'Chidi Okafor', class: 'Grade 10-A', amount: 1500, status: 'Paid', dueDate: '2026-07-15' },
    { id: 'FEE004', studentName: 'Fatima Yusuf', class: 'Grade 12-C', amount: 1200, status: 'Overdue', dueDate: '2026-06-30' },
    { id: 'FEE005', studentName: 'David Mensah', class: 'Grade 10-B', amount: 1200, status: 'Unpaid', dueDate: '2026-08-15' }
];

export const initialStaffMembers: StaffMember[] = [
    { id: 'STF001', name: 'Dr. Sarah Jenkins', role: 'Principal / Administrator', department: 'Administration', status: 'Active' },
    { id: 'STF002', name: 'Mr. John Dumelo', role: 'Head Teacher (Science)', department: 'Science', subject: 'Physics & Chemistry', status: 'Active' },
    { id: 'STF003', name: 'Mrs. Elizabeth Carter', role: 'Language Instructor', department: 'Humanities', subject: 'English & French', status: 'Active' },
    { id: 'STF004', name: 'Mr. Alan Turing', role: 'Senior CS Instructor', department: 'Technology', subject: 'Computer Science', status: 'Active' },
    { id: 'STF005', name: 'Miss Clara Oswald', role: 'Math Teacher', department: 'Mathematics', subject: 'Calculus & Algebra', status: 'On Leave' }
];
