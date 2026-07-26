import { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Section } from './Section';
import { Users, Zap, Target } from 'lucide-react';

interface CounterProps {
    target: number;
    duration?: number;
    suffix?: string;
    decimals?: number;
}

const Counter = ({ target, duration = 1500, suffix = "", decimals = 0 }: CounterProps) => {
    const [count, setCount] = useState(0);
    const elementRef = useRef<HTMLSpanElement>(null);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!hasStarted) return;

        let start = 0;
        const end = target;
        const totalSteps = 60;
        const stepTime = duration / totalSteps;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const progress = step / totalSteps;
            const easeProgress = progress * (2 - progress);
            const currentVal = start + easeProgress * (end - start);
            
            setCount(currentVal);

            if (step >= totalSteps) {
                setCount(end);
                clearInterval(timer);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [target, duration, hasStarted]);

    return (
        <span ref={elementRef}>
            {count.toFixed(decimals)}
            {suffix}
        </span>
    );
};

export const StatsSection = () => {
    const shouldReduce = useReducedMotion();
    const stats = [
        {
            label: "Registered Schools",
            val: 150,
            suffix: "+",
            icon: Users,
            color: "bg-brandPurple text-white",
            decimals: 0
        },
        {
            label: "Administrative Hours Saved",
            val: 500,
            suffix: "k+ hrs",
            icon: Zap,
            color: "bg-brandYellow text-brandBlack",
            decimals: 0
        },
        {
            label: "System Accuracy Rate",
            val: 99.9,
            suffix: "%",
            icon: Target,
            color: "bg-brandGreen text-brandBlack",
            decimals: 1
        }
    ];

    const cardVariants = {
        hidden: { opacity: 0, y: shouldReduce ? 0 : 25, scale: shouldReduce ? 1 : 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
    };

    return (
        <Section className="py-20 bg-white border-b-4 border-brandBlack">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div 
                                key={i}
                                variants={cardVariants}
                                className="p-8 border-4 border-brandBlack rounded-[32px] bg-cream shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-6 transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-300"
                            >
                                <div className={`w-14 h-14 rounded-2xl border-2 border-brandBlack ${stat.color} flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-shrink-0`}>
                                    <Icon size={28} />
                                </div>
                                <div>
                                    <div className="text-3xl md:text-4xl font-black italic text-brandBlack tracking-tight">
                                        <Counter target={stat.val} suffix={stat.suffix} decimals={stat.decimals} />
                                    </div>
                                    <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-brandBlack/60 mt-1">
                                        {stat.label}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
};
