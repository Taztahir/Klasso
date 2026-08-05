'use client';

import { Section } from './Section';
import { AlertCircle, Calendar, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProblemSection = () => {
    const problems = [
        {
            icon: AlertCircle,
            title: "Admin Overhead",
            desc: "Managing attendance, schedules, and curriculum documents across disjointed spreadsheets and WhatsApp groups consumes hours daily.",
            cardBg: "#E8A838",
            iconBg: "rgba(232, 168, 56, 0.2)",
        },
        {
            icon: Calendar,
            title: "Report Card Delays",
            desc: "Manually calculating grades, CBT scores, and teachers' remarks takes weeks of stressful work at the end of every school term.",
            cardBg: "#2A8C8C",
            iconBg: "rgba(42, 140, 140, 0.2)",
        },
        {
            icon: CreditCard,
            title: "Fee Collection Gaps",
            desc: "Tracking school fees, handling payment plans, and writing paper receipts leads to bookkeeping errors and cash flow delays.",
            cardBg: "#E8704A",
            iconBg: "rgba(232, 112, 74, 0.2)",
        }
    ];

    // Animation variants for staggered grid loading
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // Delay between each card animating in
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.215, 0.61, 0.355, 1], // Smooth cubic-bezier
            },
        },
    };

    return (
        <Section className="bg-white py-32 border-y-2 border-brandBlack/5">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header with Fade-Up Animation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-10"
                >
                    <span className="text-brandPurple font-bold uppercase tracking-widest text-xs block">
                        School Admin Stress
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold mt-4 leading-tight text-brandBlack">
                        Running a school is <span className="text-red-500">complex.</span>
                    </h2>
                    <p className="mt-4 text-brandBlack/60 font-medium text-lg">
                        Every proprietor we spoke to said the same thing — too many tools, too little time.
                    </p>
                </motion.div>

                {/* Staggered Animated Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-visible"
                >
                    {problems.map((problem, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            whileHover={{
                                y: -6,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                            style={{ backgroundColor: problem.cardBg }}
                            className="p-10 pt-8 rounded-[32px] transition-shadow hover:shadow-[10px_10px_0px_0px_rgba(24,24,27,1)] cursor-pointer"
                        >
                            <motion.div
                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 0.4 }}
                                style={{ backgroundColor: problem.iconBg }}
                                className="w-16 h-16 text-brandBlack border-2 border-brandBlack rounded-2xl flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)]"
                            >
                                <problem.icon size={32} />
                            </motion.div>
                            <h3 className="text-xl font-black uppercase mb-4 text-brandBlack">{problem.title}</h3>
                            <p className="text-brandBlack/80 font-medium leading-relaxed">
                                {problem.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </Section>
    );
};