import { Shield, Timer, EyeOff, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Section } from './Section';
import { MagneticButton } from './MagneticButton';
import { useAuth } from '../context/AuthContext';
import { motion, useReducedMotion } from 'framer-motion';

export const CBTSecuritySection = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const shouldReduce = useReducedMotion();

    const handleCtaClick = () => {
        if (user) {
            navigate('/chat');
        } else {
            navigate('/signup');
        }
    };

    const leftVariants = {
        hidden: { opacity: 0, x: shouldReduce ? 0 : -35 },
        visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
    };

    const rightVariants = {
        hidden: { opacity: 0, scale: shouldReduce ? 1 : 0.92, x: shouldReduce ? 0 : 35 },
        visible: { opacity: 1, scale: 1, x: 0, transition: { type: 'spring', stiffness: 75, damping: 15 } }
    };

    return (
        <Section className="py-32 bg-cream text-brandBlack overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        variants={leftVariants}
                    >
                        <div className="flex items-center gap-3 text-brandPurple font-bold uppercase tracking-widest text-sm mb-6">
                            <Shield size={20} />
                            Exam Integrity
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                            Secure <span className="text-brandPurple">Anti-Cheat</span> Computer-Based Testing.
                        </h2>
                        <p className="text-xl text-brandBlack/60 mb-12 leading-relaxed">
                            Klasso CBT is built to run high-stakes terminal exams and class tests with complete academic integrity, even on basic school computers or tablets.
                        </p>

                        <div className="space-y-8 mb-12">
                            {[
                                {
                                    title: "Tab-Switch & Focus Tracking",
                                    desc: "Detects when students attempt to switch browser tabs or look up answers, logging violations immediately.",
                                    icon: EyeOff
                                },
                                {
                                    title: "Server-Side Timers & Auto-Submit",
                                    desc: "Guarantees timed tests submit automatically when the clock runs out, preventing local time manipulation.",
                                    icon: Timer
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <div className="w-12 h-12 bg-white border-2 border-brandBlack rounded-xl flex items-center justify-center flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                                        <p className="text-brandBlack/60 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <MagneticButton
                            onClick={handleCtaClick}
                            className="bg-brandBlack text-white px-10 py-4 rounded-full font-bold hover:bg-brandPurple transition-all shadow-[6px_6px_0px_0px_rgba(168,85,247,0.2)]"
                        >
                            {user ? 'Manage Exams' : 'Explore CBT Security'}
                        </MagneticButton>
                    </motion.div>

                    <motion.div
                        variants={rightVariants}
                        className="relative"
                    >
                        <div className="bg-white border-2 border-brandBlack p-8 rounded-[40px] shadow-[16px_16px_0px_0px_rgba(26,26,26,1)] relative z-10">
                            <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-brandBlack/5">
                                <h3 className="text-xl font-bold">Live Exam Monitor</h3>
                                <span className="px-3 py-1 bg-red-500 text-white border-2 border-brandBlack rounded-full text-xs font-bold uppercase animate-pulse">Live</span>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { student: "Chidi Nnamdi", exam: "Physics Mid-Term", status: "Focus Lost (Tab Switch)", time: "1 min ago", alert: true },
                                    { student: "Amina Yusuf", exam: "Mathematics Exam", status: "Completed & Auto-graded", time: "5 mins ago", alert: false },
                                    { student: "Oluwaseun Balogun", exam: "Chemistry Test", status: "Session Started Successfully", time: "12 mins ago", alert: false }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-cream/50 rounded-2xl border-2 border-brandBlack/5 hover:border-brandPurple/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.alert ? 'bg-red-100 text-red-500' : 'bg-brandPurple/10 text-brandPurple'}`}>
                                                {item.alert ? <AlertTriangle size={18} /> : <Shield size={18} />}
                                            </div>
                                            <div>
                                                <p className="font-bold">{item.student}</p>
                                                <p className="text-xs text-brandBlack/40">{item.exam} • {item.time}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-xs ${item.alert ? 'text-red-500' : 'text-brandPurple'}`}>{item.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brandYellow/20 rounded-full blur-3xl -z-0"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brandPurple/20 rounded-full blur-3xl -z-0"></div>
                    </motion.div>
                </div>
            </div>
        </Section>
    );
};
