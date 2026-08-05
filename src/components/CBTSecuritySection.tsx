'use client';

import { useState, useEffect } from 'react';
import {
    Shield,
    Timer,
    EyeOff,
    AlertTriangle,
    CheckCircle2,
    Lock,
    Play,
    Pause,
    Zap,
    Camera,
    Activity,
    Wifi
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Section } from './Section';
import { MagneticButton } from './MagneticButton';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const CBTSecuritySection = () => {
    const { user } = useAuth();
    const router = useRouter();

    // State Management
    const [isLivePaused, setIsLivePaused] = useState(false);
    const [violationsCount, setViolationsCount] = useState(1);
    const [activeSessions, setActiveSessions] = useState(142);
    const [securityRules, setSecurityRules] = useState({
        tabLock: true,
        aiProctor: true,
        serverSync: true
    });

    // Initial Live Monitor Feed Data
    const [feed, setFeed] = useState([
        { id: 1, student: "Chidi Nnamdi", exam: "Physics Mid-Term", status: "Focus Lost (Tab Switch)", time: "Just now", alert: true },
        { id: 2, student: "Amina Yusuf", exam: "Mathematics Exam", status: "Completed & Auto-graded", time: "3 mins ago", alert: false },
        { id: 3, student: "Oluwaseun Balogun", exam: "Chemistry Test", status: "Session Started", time: "8 mins ago", alert: false },
    ]);

    // Helper to append events
    const pushNewEvent = (event: { student: string; exam: string; status: string; alert: boolean }) => {
        const newEntry = {
            id: Date.now(),
            ...event,
            time: "Just now",
        };

        setFeed((prevFeed) => [newEntry, ...prevFeed.slice(0, 2)]);

        if (event.alert) {
            setViolationsCount((c) => c + 1);
        }

        // Slightly fluctuate active sessions for dynamism
        setActiveSessions((prev) => Math.min(200, Math.max(100, prev + (Math.random() > 0.5 ? 1 : -1))));
    };

    // Manual Trigger Incident
    const handleManualIncident = () => {
        const incidentList = [
            { student: "David Adeleke", exam: "Computer Science", status: "Secondary Screen Detected", alert: true },
            { student: "Fatima Umar", exam: "Biology Terminal", status: "Face Out of Frame", alert: true },
            { student: "Nnamdi Eze", exam: "Further Maths", status: "Developer Tools Opened", alert: true },
            { student: "Grace John", exam: "English Language", status: "Clipboard Pasting Attempted", alert: true }
        ];
        const randomIncident = incidentList[Math.floor(Math.random() * incidentList.length)];
        pushNewEvent(randomIncident);
    };

    // Simulated real-time exam monitor activity feed update
    useEffect(() => {
        if (isLivePaused) return;

        const simulatedEvents = [
            { student: "Kemi Adeleke", exam: "Biology Quiz", status: "Window Unfocused", alert: true },
            { student: "Tunde Bakare", exam: "English Essay", status: "Auto-submitted (Time Up)", alert: false },
            { student: "Emeka Okafor", exam: "Economics Exam", status: "Session Started", alert: false },
            { student: "Zainab Bello", exam: "Physics Mid-Term", status: "Multiple Display Detected", alert: true },
            { student: "Bisi Akande", exam: "Chemistry Test", status: "Answers Synced", alert: false }
        ];

        const interval = setInterval(() => {
            const randomEvent = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
            pushNewEvent(randomEvent);
        }, 4500);

        return () => clearInterval(interval);
    }, [isLivePaused]);

    const toggleRule = (rule: keyof typeof securityRules) => {
        setSecurityRules((prev) => ({ ...prev, [rule]: !prev[rule] }));
    };

    const handleCtaClick = () => {
        if (user) {
            router.push('/chat');
        } else {
            router.push('/signup');
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -24 },
        visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
    };

    return (
        <Section className="py-16 sm:py-24 md:py-32 bg-cream text-brandBlack overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">

                    {/* Left Column: Information & Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* Eyebrow Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 bg-brandPurple/10 border border-brandPurple/20 text-brandPurple px-3 py-1.5 rounded-full font-black uppercase tracking-widest text-xs mb-6"
                        >
                            <Shield size={16} className="animate-pulse" />
                            Exam Integrity & Proctoring
                        </motion.div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
                            Secure <span className="text-brandPurple underline decoration-brandYellow decoration-wavy decoration-2">Anti-Cheat</span> Computer-Based Testing.
                        </h2>

                        <p className="text-base sm:text-lg text-brandBlack/70 mb-8 leading-relaxed font-medium">
                            Klasso CBT is engineered to run high-stakes terminal exams and continuous assessments with total academic integrity, even on low-spec hardware or shared tablets.
                        </p>

                        {/* Feature Cards Staggered */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-4 mb-8"
                        >
                            {[
                                {
                                    title: "Tab-Switch & Focus Tracking",
                                    desc: "Detects when students attempt to switch browser tabs, open external applications, or look up answers, logging instant violations.",
                                    icon: EyeOff
                                },
                                {
                                    title: "Server-Side Timers & Auto-Submit",
                                    desc: "Guarantees timed assessments submit strictly when the clock runs out, blocking local system clock manipulation.",
                                    icon: Timer
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={itemVariants}
                                    whileHover={{ x: 6, transition: { duration: 0.2 } }}
                                    className="flex gap-4 sm:gap-5 items-start p-4 bg-white/70 backdrop-blur-sm border-2 border-brandBlack/10 rounded-2xl hover:border-brandBlack shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-brandBlack rounded-xl flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] text-brandPurple">
                                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-base sm:text-lg font-black mb-1 text-brandBlack">{item.title}</h4>
                                        <p className="text-xs sm:text-sm text-brandBlack/60 font-medium leading-normal">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <MagneticButton
                            onClick={handleCtaClick}
                            className="w-full sm:w-auto bg-brandBlack text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider text-xs border-2 border-brandBlack hover:bg-brandPurple transition-colors shadow-[4px_4px_0px_0px_rgba(168,85,247,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                        >
                            {user ? 'Manage Exams' : 'Explore CBT Security'}
                        </MagneticButton>
                    </motion.div>

                    {/* Right Column: Live Interactive Monitor UI */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="relative"
                    >
                        {/* Main Container Card */}
                        <div className="bg-white border-2 border-brandBlack p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] sm:shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] relative z-10">

                            {/* Card Header & Controls */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b-2 border-brandBlack/10">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full border border-brandBlack ${isLivePaused ? 'bg-amber-400' : 'bg-brandGreen animate-pulse'}`}></div>
                                    <h3 className="text-base sm:text-lg font-black tracking-wide text-brandBlack flex items-center gap-2">
                                        Live Exam Monitor <Lock size={14} className="text-brandBlack/40" />
                                    </h3>
                                </div>

                                <div className="flex items-center gap-2 self-start sm:self-auto">
                                    <button
                                        onClick={() => setIsLivePaused(!isLivePaused)}
                                        className="flex items-center gap-1 px-2.5 py-1 bg-cream border border-brandBlack/20 hover:border-brandBlack rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                                    >
                                        {isLivePaused ? <Play size={12} className="text-green-600" /> : <Pause size={12} className="text-amber-600" />}
                                        {isLivePaused ? 'Resume' : 'Pause'}
                                    </button>

                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${isLivePaused
                                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                                        : 'bg-red-500/10 text-red-600 border-red-500/30'
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full ${isLivePaused ? 'bg-amber-500' : 'bg-red-500 animate-ping'}`}></span>
                                        {isLivePaused ? 'Stream Paused' : 'Realtime Sync'}
                                    </div>
                                </div>
                            </div>

                            {/* Interactive Security Toggles Bar */}
                            <div className="mb-5 p-3 bg-cream/60 border border-brandBlack/10 rounded-xl">
                                <p className="text-[10px] font-black uppercase tracking-wider text-brandBlack/50 mb-2 flex items-center gap-1">
                                    <Activity size={12} /> Active Anti-Cheat Modules
                                </p>
                                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                                    <button
                                        onClick={() => toggleRule('tabLock')}
                                        className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between ${securityRules.tabLock
                                            ? 'bg-brandPurple/10 border-brandPurple text-brandPurple'
                                            : 'bg-white border-brandBlack/10 text-brandBlack/40'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <Zap size={14} />
                                            <span className={`w-2 h-2 rounded-full ${securityRules.tabLock ? 'bg-brandPurple' : 'bg-gray-300'}`}></span>
                                        </div>
                                        <span className="text-[10px] sm:text-xs font-black truncate mt-1">Tab Lock</span>
                                    </button>

                                    <button
                                        onClick={() => toggleRule('aiProctor')}
                                        className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between ${securityRules.aiProctor
                                            ? 'bg-brandPurple/10 border-brandPurple text-brandPurple'
                                            : 'bg-white border-brandBlack/10 text-brandBlack/40'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <Camera size={14} />
                                            <span className={`w-2 h-2 rounded-full ${securityRules.aiProctor ? 'bg-brandPurple' : 'bg-gray-300'}`}></span>
                                        </div>
                                        <span className="text-[10px] sm:text-xs font-black truncate mt-1">AI Guard</span>
                                    </button>

                                    <button
                                        onClick={() => toggleRule('serverSync')}
                                        className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between ${securityRules.serverSync
                                            ? 'bg-brandPurple/10 border-brandPurple text-brandPurple'
                                            : 'bg-white border-brandBlack/10 text-brandBlack/40'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <Wifi size={14} />
                                            <span className={`w-2 h-2 rounded-full ${securityRules.serverSync ? 'bg-brandPurple' : 'bg-gray-300'}`}></span>
                                        </div>
                                        <span className="text-[10px] sm:text-xs font-black truncate mt-1">Server Timer</span>
                                    </button>
                                </div>
                            </div>

                            {/* Animated Feed List */}
                            <div className="space-y-3 min-h-[250px]">
                                <AnimatePresence initial={false}>
                                    {feed.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 rounded-xl border-2 gap-2 sm:gap-0 transition-all ${item.alert
                                                ? 'bg-red-500/5 border-red-500/30 shadow-[2px_2px_0px_0px_rgba(239,68,68,0.2)]'
                                                : 'bg-cream/40 border-brandBlack/10 hover:border-brandBlack/30'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center shrink-0 ${item.alert
                                                    ? 'bg-red-500/10 text-red-600 border-red-500/30'
                                                    : 'bg-brandPurple/10 text-brandPurple border-brandPurple/20'
                                                    }`}>
                                                    {item.alert ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                                                </div>
                                                <div className="overflow-hidden min-w-0">
                                                    <p className="font-black text-xs sm:text-sm text-brandBlack truncate">{item.student}</p>
                                                    <p className="text-[10px] font-bold text-brandBlack/50 truncate">
                                                        {item.exam} • <span className="text-brandBlack/40">{item.time}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="self-end sm:self-auto shrink-0">
                                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase ${item.alert
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-brandPurple/10 text-brandPurple'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Simulation Trigger & Metrics Bar */}
                            <div className="mt-4 pt-4 border-t border-brandBlack/10 space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <button
                                        onClick={handleManualIncident}
                                        className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 rounded-xl font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm active:translate-y-0.5"
                                    >
                                        <AlertTriangle size={14} /> Trigger Incident Test
                                    </button>
                                </div>

                                <div className="flex flex-wrap items-center justify-between text-[11px] font-bold text-brandBlack/60 gap-2">
                                    <span>Active Sessions: <strong className="text-brandBlack font-black">{activeSessions}</strong></span>
                                    <span>Violations Logged: <strong className="text-red-600 font-black">{violationsCount}</strong></span>
                                    <span className="text-brandGreen font-black flex items-center gap-1">
                                        <Shield size={12} /> 100% Encrypted
                                    </span>
                                </div>
                            </div>

                        </div>

                        {/* Background Glow Blobs */}
                        <div className="absolute -top-8 -right-8 w-48 h-48 bg-brandYellow/30 rounded-full blur-3xl -z-0 pointer-events-none" />
                        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-brandPurple/30 rounded-full blur-3xl -z-0 pointer-events-none" />
                    </motion.div>

                </div>
            </div>
        </Section>
    );
};