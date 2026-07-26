import { useRef } from 'react';
import { Section } from './Section';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const AboutSection = () => {
    // 3D Tilt Card Motion Values
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <Section id="about" className="bg-cream py-32 border-t-2 border-brandBlack/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-10 items-center">

                    {/* Left: Narrative Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-7"
                    >
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 bg-brandPurple/10 px-4 py-1.5 rounded-full border border-brandPurple/20 mb-6"
                            >
                                <span className="text-brandPurple font-bold uppercase tracking-widest text-xs">Our Mission</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.7 }}
                                className="text-4xl md:text-5xl font-black mb-10 leading-tight text-brandBlack"
                            >
                                Making premium school management{' '}
                                <span className="relative inline-block text-brandPurple">
                                    accessible
                                    <motion.svg
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.8, duration: 0.8 }}
                                        className="absolute -bottom-2 left-0 w-full"
                                        height="12"
                                        viewBox="0 0 200 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M3 9C50 3 150 3 197 9"
                                            stroke="#A855F7"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                        />
                                    </motion.svg>
                                </span>{' '}
                                to every school.
                            </motion.h2>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.7 }}
                                className="space-y-6 text-lg md:text-xl font-medium leading-relaxed text-brandBlack/70 mb-12"
                            >
                                <p>
                                    Klasso was born from a simple realization: private schools are bogged down by administrative complexity, leaving proprietors stressed and teachers overworked.
                                </p>
                                <p>
                                    We are building a secure, multi-tenant portal that isolates and streamlines operations for each school — enabling proprietors, staff, and parents to collaborate with ease.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right: Interactive 3D Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-5 relative perspective-1000"
                    >
                        <motion.div
                            ref={cardRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                rotateX,
                                rotateY,
                                transformStyle: "preserve-3d",
                            }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="bg-white border-4 border-brandBlack p-6 md:p-10 rounded-[48px] shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] relative z-10 cursor-pointer"
                        >
                            {/* Animated SVG Icon Header */}
                            <motion.div
                                whileHover={{ rotate: 12, scale: 1.1 }}
                                className="mb-8 p-4 bg-brandPurple/5 rounded-3xl border-2 border-brandBlack w-fit shadow-[4px_4px_0px_0px_rgba(24,24,27,1)]"
                            >
                                <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 50C20 33.4315 33.4315 20 50 20C66.5685 20 80 33.4315 80 50V80H20V50Z" fill="#1E3A5F" />
                                    <circle cx="50" cy="50" r="10" fill="#E8A838" />
                                </svg>
                            </motion.div>

                            <blockquote className="md:text-2xl text-md font-bold italic mb-8 relative text-brandBlack">
                                "We wanted to build something that feels like a calm harbor for school management, serving proprietors first."
                            </blockquote>

                            <div className="flex items-center gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    className="w-12 h-12 bg-brandYellow border-2 border-brandBlack rounded-full flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]"
                                >
                                    KL
                                </motion.div>
                                <div>
                                    <p className="font-black uppercase text-sm tracking-wider text-brandBlack">The Founders</p>
                                    <p className="text-xs font-bold text-brandPurple">Klasso.app Team</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Pulsating Animated Blobs */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                x: [0, 15, 0],
                                y: [0, -15, 0],
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 w-48 h-48 bg-brandYellow/30 rounded-full blur-3xl -z-0"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                x: [0, -20, 0],
                                y: [0, 20, 0],
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-10 -left-10 w-48 h-48 bg-brandPurple/20 rounded-full blur-3xl -z-0"
                        />
                    </motion.div>
                </div>
            </div>
        </Section>
    );
};