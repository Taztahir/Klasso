import { Section } from './Section';
import { motion, useReducedMotion } from 'framer-motion';

export const AboutSection = () => {
    const shouldReduce = useReducedMotion();

    return (
        <Section id="about" className="bg-cream py-32 border-t-2 border-brandBlack/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    {/* Left: Narrative Content */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, x: shouldReduce ? 0 : -35 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.15 }}
                            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                        >
                            <span className="text-brandPurple font-bold uppercase tracking-widest text-xs">Our Mission</span>
                            <h2 className="text-4xl md:text-6xl font-black mt-6 mb-10 italic leading-tight">
                                Making premium school management <span className="text-brandPurple">accessible</span> to every school.
                            </h2>
                            <div className="space-y-6 text-lg md:text-xl font-medium leading-relaxed text-brandBlack/70 mb-12">
                                <p>
                                    Klasso was born from a simple realization: private schools are bogged down by administrative complexity, leaving proprietors stressed and teachers overworked.
                                </p>
                                <p>
                                    We are building a secure, multi-tenant portal that isolates and streamlines operations for each school — enabling proprietors, staff, and parents to collaborate with ease.
                                </p>
                             </div>
                        </motion.div>
                    </div>

                    {/* Right: Trust Visual Card */}
                    <div className="lg:col-span-5 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: shouldReduce ? 1 : 0.9, rotate: shouldReduce ? 0 : 2 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: false, amount: 0.15 }}
                            transition={{ type: 'spring', stiffness: 70, damping: 15 }}
                            className="bg-white border-4 border-brandBlack p-10 rounded-[48px] shadow-[24px_24px_0px_0px_rgba(168,85,247,0.1)] relative z-10"
                        >
                            <div className="mb-8 p-4 bg-brandPurple/5 rounded-3xl border-2 border-brandBlack/5 w-fit">
                                <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 50C20 33.4315 33.4315 20 50 20C66.5685 20 80 33.4315 80 50V80H20V50Z" fill="#1E3A5F" />
                                    <circle cx="50" cy="50" r="10" fill="#E8A838" />
                                </svg>
                            </div>
                            <blockquote className="text-2xl font-bold italic leading-relaxed mb-8">
                                "We wanted to build something that feels like a calm harbor for school management, serving proprietors first."
                            </blockquote>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brandYellow border-2 border-brandBlack rounded-full flex items-center justify-center font-black">KL</div>
                                <div>
                                    <p className="font-black uppercase text-sm tracking-wider">The Founders</p>
                                    <p className="text-xs font-bold text-brandPurple">Klasso.app Team</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Interactive blobs */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brandYellow/20 rounded-full blur-3xl -z-0"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brandPurple/10 rounded-full blur-3xl -z-0"></div>
                    </div>
                </div>
            </div>
        </Section>
    );
};
