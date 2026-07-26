import { Star, MessageSquare, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Section } from './Section';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export const Testimonials = () => {
    const reviews = [
        {
            name: "Mrs. Folasade Adebayo",
            role: "Proprietor, Grace Field Schools",
            content: "Klasso transformed our terminal reporting. What used to take two weeks of manual report aggregation is now generated in seconds. Parents love their dashboard access.",
            avatar: "FA",
            color: "bg-brandPurple"
        },
        {
            name: "Mr. Emeka Nwosu",
            role: "Principal, Leadway Academy",
            content: "The CBT security is top-tier. We run timed mid-term tests and terminal exams without worrying about students switching tabs. It's built beautifully.",
            avatar: "EN",
            color: "bg-brandGreen"
        },
        {
            name: "Dr. Funmi Alabi",
            role: "Academic Director, Spring College",
            content: "Sharing lesson notes, tracking CBE competencies, and collecting term fees online. Klasso solves real operational problems for schools in Nigeria.",
            avatar: "FA",
            color: "bg-brandYellow"
        },
        {
            name: "Alhaji Ibrahim Musa",
            role: "Proprietor, Al-Mizan Model School",
            content: "Since migrating our school to Klasso, fee tracking has been painless. Invoices are sent automatically and parents pay securely via Paystack.",
            avatar: "IM",
            color: "bg-blue-500"
        },
        {
            name: "Sister Mary Clara",
            role: "Administrator, St. Jude Secondary",
            content: "The competency-based evaluation module allows us to track student progress separately from scores. A must-have for modern curriculum standards.",
            avatar: "MC",
            color: "bg-orange-500"
        },
        {
            name: "Oluwaseun Balogun",
            role: "PTA Chairperson, Greenwood High",
            content: "As a parent, being able to track school fee payments, view assignment grades, and print terminal report cards directly is extremely convenient.",
            avatar: "OB",
            color: "bg-indigo-500"
        }
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(3);

    const updateVisibleCount = useCallback(() => {
        if (window.innerWidth < 768) setVisibleCount(1);
        else if (window.innerWidth < 1024) setVisibleCount(2);
        else setVisibleCount(3);
    }, []);

    useEffect(() => {
        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);
        return () => window.removeEventListener('resize', updateVisibleCount);
    }, [updateVisibleCount]);

    const maxIndex = Math.max(0, reviews.length - visibleCount);

    const next = () => setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    const prev = () => setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));

    useEffect(() => {
        const interval = setInterval(next, 6000);
        return () => clearInterval(interval);
    }, [maxIndex]);

    return (
        <Section id="testimonials" className="py-32 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-2 text-brandPurple font-bold uppercase tracking-wider text-sm mb-4"
                        >
                            <MessageSquare size={18} />
                            Success Stories
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold italic"
                        >
                            Loved by Proprietors, Teachers, & Parents.
                        </motion.h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="items-center gap-4 bg-brandPurple/5 p-4 rounded-full border-2 border-brandBlack hidden sm:flex">
                            <div className="flex -space-x-3">
                                {reviews.slice(0, 4).map((r, i) => (
                                    <div key={i} className={`w-10 h-10 rounded-full ${r.color} border-2 border-brandBlack flex items-center justify-center text-[10px] text-white font-black`}>
                                        {r.avatar}
                                    </div>
                                ))}
                            </div>
                            <div className="pr-2">
                                <div className="flex text-brandYellow">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-tighter">4.9/5 Rating</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={prev} className="w-12 h-12 rounded-xl border-2 border-brandBlack flex items-center justify-center hover:bg-brandBlack hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none bg-white">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={next} className="w-12 h-12 rounded-xl border-2 border-brandBlack flex items-center justify-center hover:bg-brandBlack hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none bg-white">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="overflow-visible">
                        <motion.div
                            className="flex"
                            animate={{ x: `-${activeIndex * (100 / visibleCount)}%` }}
                            transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        >
                            {reviews.map((review, i) => (
                                <div
                                    key={i}
                                    className="shrink-0 px-4"
                                    style={{ width: `${100 / visibleCount}%` }}
                                >
                                    <motion.div
                                        whileHover={{ y: -8 }}
                                        className="bg-cream border-4 border-brandBlack p-8 md:p-10 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] h-full flex flex-col"
                                    >
                                        <div className="flex flex-col gap-6 flex-1">
                                            <div className="flex justify-between items-start">
                                                <div className="shrink-0 relative">
                                                    <div className={`w-20 h-20 ${review.color} rounded-2xl border-4 border-brandBlack flex items-center justify-center text-2xl text-white font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                                                        {review.avatar}
                                                    </div>
                                                    <div className="absolute -bottom-2 -right-2 bg-brandYellow border-2 border-brandBlack p-2 rounded-xl">
                                                        <Quote size={12} fill="currentColor" />
                                                    </div>
                                                </div>
                                                <div className="flex text-brandYellow gap-1">
                                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                                                </div>
                                            </div>

                                            <p className="text-lg font-bold leading-tight italic text-brandBlack flex-1">
                                                "{review.content}"
                                            </p>

                                            <div className="pt-6 border-t-2 border-brandBlack/5">
                                                <p className="text-xl font-black uppercase tracking-tight leading-none mb-1">{review.name}</p>
                                                <p className="text-brandPurple font-black uppercase text-[10px] tracking-widest">{review.role}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <div className="flex justify-center gap-3 mt-16">
                        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`h-3 rounded-full border-2 border-brandBlack transition-all ${activeIndex === i ? 'w-12 bg-brandPurple' : 'w-3 bg-white hover:bg-brandPurple/20'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
};
