'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Upload, 
    ChevronRight, 
    ArrowLeft, 
    GraduationCap, 
    User, 
    BookOpen, 
    Users, 
    Plus, 
    FileText, 
    HelpCircle, 
    Save, 
    X,
    Check,
    Calendar,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

/* ── Step definitions ── */
const steps = [
    { number: 1, label: 'Personal Information', desc: 'Basic student details', icon: User },
    { number: 2, label: 'Academic Information', desc: 'Class, grade and admission', icon: GraduationCap },
    { number: 3, label: 'Parent / Guardian', desc: 'Contact and relationship', icon: Users },
    { number: 4, label: 'Additional Information', desc: 'Medical, address and more', icon: BookOpen },
    { number: 5, label: 'Review & Submit', desc: 'Review and save record', icon: FileText }
];

export default function AddStudentPage() {
    const router = useRouter();
    const { profile } = useAuth();
    const supabase = createClient();
    const [currentStep, setCurrentStep] = React.useState(1);
    const [saving, setSaving] = React.useState(false);
    
    /* Form state fields */
    const [firstName, setFirstName] = React.useState('');
    const [middleName, setMiddleName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [gender, setGender] = React.useState('');
    const [dob, setDob] = React.useState('');
    const [bloodGroup, setBloodGroup] = React.useState('');
    const [studentId, setStudentId] = React.useState('KLA-' + Math.floor(100000 + Math.random() * 900000));
    const [admissionNo, setAdmissionNo] = React.useState('');
    const [religion, setReligion] = React.useState('');
    const [photo, setPhoto] = React.useState<string | null>(null);

    const [classGrade, setClassGrade] = React.useState('');
    const [armStream, setArmStream] = React.useState('');
    const [currentTerm, setCurrentTerm] = React.useState('');
    const [admissionDate, setAdmissionDate] = React.useState('');
    const [prevSchool, setPrevSchool] = React.useState('');
    const [studentStatus, setStudentStatus] = React.useState('Active');

    const [guardianName, setGuardianName] = React.useState('');
    const [relationship, setRelationship] = React.useState('');
    const [guardianPhone, setGuardianPhone] = React.useState('');
    const [guardianEmail, setGuardianEmail] = React.useState('');
    const [occupation, setOccupation] = React.useState('');
    const [address, setAddress] = React.useState('');

    const [medicalConditions, setMedicalConditions] = React.useState('');
    const [allergies, setAllergies] = React.useState('');
    const [emergencyContact, setEmergencyContact] = React.useState('');
    const [transportMode, setTransportMode] = React.useState('');

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
                toast.success('Student photo uploaded');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNext = () => {
        if (currentStep < 5) {
            // Validation simple triggers
            if (currentStep === 1 && (!firstName || !lastName || !gender || !dob)) {
                toast.error('Required fields missing', { description: 'Please fill in all starred (*) fields.' });
                return;
            }
            if (currentStep === 2 && (!classGrade || !armStream || !admissionDate)) {
                toast.error('Required fields missing', { description: 'Please fill in class, arm and admission date.' });
                return;
            }
            if (currentStep === 3 && (!guardianName || !relationship || !guardianPhone)) {
                toast.error('Required fields missing', { description: 'Please fill in parent name, relationship and phone.' });
                return;
            }
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSave = async () => {
        if (!profile?.school_id) {
            toast.error('Configuration Required', {
                description: 'We could not detect an active school tenant linked to your administrator account. Please onboard a school first.'
            });
            return;
        }

        setSaving(true);
        const toastId = toast.loading('Registering student profile...');

        try {
            const { data, error } = await supabase
                .from('students')
                .insert({
                    school_id: profile.school_id,
                    first_name: firstName,
                    last_name: lastName,
                    middle_name: middleName || null,
                    admission_no: admissionNo || null,
                    class_grade: classGrade,
                    arm_stream: armStream || null,
                    gender,
                    dob: dob || null,
                    blood_group: bloodGroup || null,
                    religion: religion || null,
                    photo_url: null, // skip photo upload logic for now
                    status: studentStatus,
                    guardian_name: guardianName,
                    guardian_phone: guardianPhone,
                    guardian_email: guardianEmail || null,
                    guardian_relationship: relationship,
                    address: address || null,
                    medical_notes: `Allergies: ${allergies || 'None'}. Conditions: ${medicalConditions || 'None'}. Emergency Contact: ${emergencyContact || 'None'}`
                })
                .select();

            if (error) throw error;

            toast.dismiss(toastId);
            toast.success('Registration Complete', {
                description: `${firstName} ${lastName} has been successfully added to ${classGrade || 'the database'}.`
            });
            router.push('/dashboard/students');
        } catch (err: any) {
            toast.dismiss(toastId);
            toast.error('Registration Failed', {
                description: err.message || 'An unexpected error occurred while saving.'
            });
            setSaving(false);
        }
    };

    const fullName = `${firstName} ${middleName} ${lastName}`.trim().replace(/\s+/g, ' ') || '—';

    return (
        <div className="space-y-6">
            
            {/* Breadcrumb path navigation */}
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <span className="cursor-pointer hover:text-brandBlack" onClick={() => router.push('/dashboard')}>Dashboard</span>
                <ChevronRight className="h-3 w-3" />
                <span className="cursor-pointer hover:text-brandBlack" onClick={() => router.push('/dashboard/students')}>Students</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-brandBlack">Add New Student</span>
            </div>

            {/* Title block */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                    <h1 className="text-2.5xl font-black text-brandBlack tracking-tight">Add New Student</h1>
                    <p className="text-xs font-bold text-gray-400 mt-1">Create a new student record and add to the system.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/dashboard/students')}
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-xs font-black text-gray-700 shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brandPurple text-white hover:bg-brandPurple/90 text-xs font-black shadow-sm"
                    >
                        <Save className="h-4 w-4" />
                        <span>Save Student</span>
                        <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                    </button>
                </div>
            </div>

            {/* Stepped Main layout */}
            <div className="grid gap-6 lg:grid-cols-4 items-start">
                
                {/* Stepper Navigation Column */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-3xl border border-gray-100 p-4 space-y-2.5 shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block px-2.5 mb-1.5">Steps</span>
                        {steps.map(step => {
                            const isCompleted = currentStep > step.number;
                            const isActive = currentStep === step.number;
                            return (
                                <button
                                    key={step.number}
                                    onClick={() => {
                                        // Allow jumping to completed steps or next immediate step if validation allows
                                        if (step.number <= currentStep || isCompleted) {
                                            setCurrentStep(step.number);
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left border transition-all ${
                                        isActive 
                                            ? 'bg-slate-50 border-brandPurple/20' 
                                            : 'bg-white border-transparent'
                                    }`}
                                >
                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                        isCompleted 
                                            ? 'bg-emerald-500 text-white' 
                                            : isActive 
                                                ? 'bg-brandPurple text-white' 
                                                : 'bg-slate-50 text-gray-400'
                                    }`}>
                                        {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : step.number}
                                    </span>
                                    <div className="min-w-0">
                                        <h4 className={`text-xs font-black truncate ${isActive ? 'text-brandBlack' : 'text-gray-500'}`}>{step.label}</h4>
                                        <span className="text-[9px] font-bold text-gray-400 block truncate mt-0.5">{step.desc}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Need Help Banner Box */}
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-5 shadow-sm space-y-3.5">
                        <div className="flex items-center gap-2">
                            <span className="p-2 rounded-xl bg-indigo-50 text-brandPurple shrink-0"><HelpCircle className="h-4 w-4" /></span>
                            <span className="text-xs font-black text-brandBlack">Need Help?</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
                            Learn how to add student record, upload photo, and map parents/guardians to the student profile.
                        </p>
                        <button 
                            onClick={() => toast.info('Loading guide...')}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-200 bg-white text-[9px] font-black text-brandPurple hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <span>View Guide</span>
                        </button>
                    </div>
                </div>

                {/* Form fields Column (middle span 2) */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm min-h-[400px] flex flex-col justify-between">
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -12 }}
                                transition={{ duration: 0.18 }}
                            >
                                {/* Step 1: Personal Information */}
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-black text-brandBlack uppercase tracking-wider">Personal Information</h3>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1">Basic details about the student</p>
                                        </div>

                                        {/* Avatar upload placeholder */}
                                        <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                            <div className="h-14 w-14 rounded-full overflow-hidden border border-gray-200 bg-slate-100 flex items-center justify-center shrink-0">
                                                {photo ? (
                                                    <img src={photo} alt="Student Preview" className="h-full w-full object-cover" />
                                                ) : (
                                                    <User className="h-6 w-6 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-[10px] font-black text-gray-700 hover:bg-slate-50 cursor-pointer shadow-sm">
                                                    <Upload className="h-3.5 w-3.5 text-gray-400" />
                                                    <span>Upload Photo</span>
                                                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                                                </label>
                                                <span className="text-[9px] font-bold text-gray-400 block">JPG, PNG (Max 2MB)</span>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">First Name *</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="First Name" 
                                                    value={firstName} 
                                                    onChange={e => setFirstName(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Middle Name</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Middle Name" 
                                                    value={middleName} 
                                                    onChange={e => setMiddleName(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Last Name *</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Last Name" 
                                                    value={lastName} 
                                                    onChange={e => setLastName(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Gender *</label>
                                                <select 
                                                    value={gender} 
                                                    onChange={e => setGender(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                >
                                                    <option value="">Select gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Date of Birth *</label>
                                                <input 
                                                    type="date" 
                                                    value={dob} 
                                                    onChange={e => setDob(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Blood Group</label>
                                                <select 
                                                    value={bloodGroup} 
                                                    onChange={e => setBloodGroup(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                >
                                                    <option value="">Select blood group</option>
                                                    <option value="A+">A+</option>
                                                    <option value="A-">A-</option>
                                                    <option value="B+">B+</option>
                                                    <option value="B-">B-</option>
                                                    <option value="O+">O+</option>
                                                    <option value="O-">O-</option>
                                                    <option value="AB+">AB+</option>
                                                    <option value="AB-">AB-</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Student ID *</label>
                                                <input 
                                                    type="text" 
                                                    disabled
                                                    value={studentId} 
                                                    className="h-10 border border-gray-150 rounded-xl px-3 text-xs font-bold bg-slate-50 text-gray-500 cursor-not-allowed"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Admission Number *</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter admission number" 
                                                    value={admissionNo} 
                                                    onChange={e => setAdmissionNo(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Religion</label>
                                                <select 
                                                    value={religion} 
                                                    onChange={e => setReligion(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                >
                                                    <option value="">Select religion</option>
                                                    <option value="Christianity">Christianity</option>
                                                    <option value="Islam">Islam</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Academic Information */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-black text-brandBlack uppercase tracking-wider">Academic Information</h3>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1">Class and academic details</p>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Class / Grade *</label>
                                                <select 
                                                    value={classGrade} 
                                                    onChange={e => setClassGrade(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                >
                                                    <option value="">Select class or grade</option>
                                                    <option value="Grade 7A">Grade 7A</option>
                                                    <option value="Grade 8A">Grade 8A</option>
                                                    <option value="Grade 9A">Grade 9A</option>
                                                    <option value="Grade 10A">Grade 10A</option>
                                                    <option value="Grade 10B">Grade 10B</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Arm / Stream *</label>
                                                <select 
                                                    value={armStream} 
                                                    onChange={e => setArmStream(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                >
                                                    <option value="">Select arm or stream</option>
                                                    <option value="Science">Science Arm</option>
                                                    <option value="Art">Art Arm</option>
                                                    <option value="General">General Stream</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Current Term *</label>
                                                <select 
                                                    value={currentTerm} 
                                                    onChange={e => setCurrentTerm(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                >
                                                    <option value="">Select term</option>
                                                    <option value="Term 1">First Term</option>
                                                    <option value="Term 2">Second Term</option>
                                                    <option value="Term 3">Third Term</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Admission Date *</label>
                                                <input 
                                                    type="date" 
                                                    value={admissionDate} 
                                                    onChange={e => setAdmissionDate(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Previous School</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter previous school" 
                                                    value={prevSchool} 
                                                    onChange={e => setPrevSchool(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Student Status *</label>
                                                <select 
                                                    value={studentStatus} 
                                                    onChange={e => setStudentStatus(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Parent / Guardian Information */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-black text-brandBlack uppercase tracking-wider">Parent / Guardian Information</h3>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1">Contact details of parent or guardian</p>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Full Name *</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter parent/guardian name" 
                                                    value={guardianName} 
                                                    onChange={e => setGuardianName(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Relationship *</label>
                                                <select 
                                                    value={relationship} 
                                                    onChange={e => setRelationship(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                >
                                                    <option value="">Select relationship</option>
                                                    <option value="Father">Father</option>
                                                    <option value="Mother">Mother</option>
                                                    <option value="Guardian">Guardian</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Phone Number *</label>
                                                <input 
                                                    type="tel" 
                                                    placeholder="Phone Number" 
                                                    value={guardianPhone} 
                                                    onChange={e => setGuardianPhone(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    placeholder="Enter email address" 
                                                    value={guardianEmail} 
                                                    onChange={e => setGuardianEmail(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Occupation</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter occupation" 
                                                    value={occupation} 
                                                    onChange={e => setOccupation(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-brandBlack pl-1">Residential Address</label>
                                            <textarea 
                                                placeholder="Enter residential address" 
                                                value={address} 
                                                onChange={e => setAddress(e.target.value)}
                                                rows={2}
                                                className="border border-gray-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-brandPurple bg-white resize-none"
                                            />
                                        </div>

                                        <button 
                                            type="button"
                                            onClick={() => toast.success('Guardian fields duplicated')}
                                            className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-gray-300 rounded-xl text-[10px] font-black text-brandPurple bg-white hover:bg-slate-50 transition-colors"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            <span>Add Another Guardian</span>
                                        </button>
                                    </div>
                                )}

                                {/* Step 4: Additional Information */}
                                {currentStep === 4 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-black text-brandBlack uppercase tracking-wider">Additional Information</h3>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1">Medical records and emergency contacts</p>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Medical Conditions</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. Asthma, none" 
                                                    value={medicalConditions} 
                                                    onChange={e => setMedicalConditions(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Allergies</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. Peanut, none" 
                                                    value={allergies} 
                                                    onChange={e => setAllergies(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Emergency Contact Number</label>
                                                <input 
                                                    type="tel" 
                                                    placeholder="Emergency contact" 
                                                    value={emergencyContact} 
                                                    onChange={e => setEmergencyContact(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-brandBlack pl-1">Transport Mode</label>
                                                <select 
                                                    value={transportMode} 
                                                    onChange={e => setTransportMode(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl px-3 text-xs font-bold outline-none focus:border-brandPurple bg-white"
                                                >
                                                    <option value="">Select transport mode</option>
                                                    <option value="School Bus">School Bus</option>
                                                    <option value="Parent Drop-off">Parent Drop-off</option>
                                                    <option value="Self / Walk">Self / Walk</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 5: Review & Submit */}
                                {currentStep === 5 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-black text-brandBlack uppercase tracking-wider">Review & Submit</h3>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1">Review student profile details before saving</p>
                                        </div>

                                        <div className="border border-gray-150 rounded-2xl p-4 divide-y divide-gray-100 space-y-3.5 text-xs">
                                            <div className="pb-3 grid grid-cols-2">
                                                <span className="font-bold text-gray-400">Full Name</span>
                                                <span className="font-black text-brandBlack">{fullName}</span>
                                            </div>
                                            <div className="py-3.5 grid grid-cols-2">
                                                <span className="font-bold text-gray-400">Admission No.</span>
                                                <span className="font-black text-brandBlack">{admissionNo || '—'}</span>
                                            </div>
                                            <div className="py-3.5 grid grid-cols-2">
                                                <span className="font-bold text-gray-400">Class / Grade</span>
                                                <span className="font-black text-brandBlack">{classGrade || '—'}</span>
                                            </div>
                                            <div className="py-3.5 grid grid-cols-2">
                                                <span className="font-bold text-gray-400">Guardian Name</span>
                                                <span className="font-black text-brandBlack">{guardianName || '—'}</span>
                                            </div>
                                            <div className="py-3.5 grid grid-cols-2">
                                                <span className="font-bold text-gray-400">Guardian Phone</span>
                                                <span className="font-black text-brandBlack">{guardianPhone || '—'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation buttons at the bottom of form card */}
                    <div className="flex gap-3 border-t border-gray-100 pt-5 mt-6 shrink-0 justify-between">
                        <button
                            type="button"
                            onClick={handlePrev}
                            disabled={currentStep === 1}
                            className="flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-xs font-black text-gray-700 bg-white hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-40 disabled:hover:bg-white"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Previous</span>
                        </button>
                        
                        {currentStep < 5 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex items-center justify-center gap-1.5 px-5 py-2 bg-brandPurple text-white rounded-xl text-xs font-black hover:bg-brandPurple/90 transition-all shadow-sm"
                            >
                                <span>Save & Continue</span>
                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center justify-center gap-1.5 px-5 py-2 bg-brandPurple text-white rounded-xl text-xs font-black hover:bg-brandPurple/90 transition-all shadow-sm disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                <span>Submit Record</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Student Summary preview column (right span 1) */}
                <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block border-b border-gray-50 pb-2">Student Summary</span>

                    {/* Avatar circle */}
                    <div className="flex flex-col items-center text-center">
                        <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-gray-150 bg-slate-50 flex items-center justify-center mb-3.5 shadow-md">
                            {photo ? (
                                <img src={photo} alt="Student Preview" className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-8 w-8 text-gray-400" />
                            )}
                        </div>
                        {photo ? null : <span className="text-[10px] font-bold text-gray-400">No photo uploaded</span>}
                    </div>

                    {/* Details list previews */}
                    <div className="space-y-3.5 text-xs">
                        <div className="flex items-center gap-3">
                            <span className="p-1.5 rounded-lg bg-indigo-50 text-brandPurple shrink-0"><User className="h-4 w-4" /></span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9px] font-bold text-gray-400">Full Name</span>
                                <span className="font-black text-brandBlack truncate">{fullName}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0"><FileText className="h-4 w-4" /></span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9px] font-bold text-gray-400">Student ID</span>
                                <span className="font-black text-brandBlack truncate">{studentId}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="p-1.5 rounded-lg bg-emerald-50 text-brandGreen shrink-0"><GraduationCap className="h-4 w-4" /></span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9px] font-bold text-gray-400">Class / Grade</span>
                                <span className="font-black text-brandBlack truncate">{classGrade || '—'}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 shrink-0"><Calendar className="h-4 w-4" /></span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9px] font-bold text-gray-400">Admission Date</span>
                                <span className="font-black text-brandBlack truncate">{admissionDate || '—'}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 shrink-0"><Check className="h-4 w-4" /></span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9px] font-bold text-gray-400">Status</span>
                                <span className="inline-flex px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-black text-[9px] w-max uppercase mt-0.5">{studentStatus}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tip Box */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 text-[10px] font-bold text-gray-400 leading-relaxed space-y-1">
                        <span className="text-brandBlack font-black block">Quick Tip</span>
                        <span>All fields marked with * are required. Make sure to review all information before saving.</span>
                    </div>

                </div>

            </div>

        </div>
    );
}
