export interface Student {
    id: string;
    name: string;
    class: string;
    guardian: string;
    status: 'Active' | 'Inactive' | 'Suspended';
}

export interface Note {
    id: string;
    title: string;
    subject: string;
    class: string;
    content: string;
    date: string;
}

export interface Assignment {
    id: string;
    title: string;
    subject: string;
    class: string;
    dueDate: string;
    status: 'Upcoming' | 'Submitted' | 'Graded';
}

export interface CBTTest {
    id: string;
    title: string;
    subject: string;
    date: string;
    status: 'Draft' | 'Scheduled' | 'Live' | 'Completed';
    isSecure: boolean;
}

export interface FeeRecord {
    id: string;
    studentName: string;
    class: string;
    amount: number;
    status: 'Paid' | 'Unpaid' | 'Overdue';
    dueDate: string;
}

export interface StaffMember {
    id: string;
    name: string;
    role: string;
    department: string;
    subject?: string;
    status: 'Active' | 'On Leave';
}
