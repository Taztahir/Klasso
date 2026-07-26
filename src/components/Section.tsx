import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    id?: string;
}

export const Section = ({ children, className = "", id }: SectionProps) => {
    const shouldReduceMotion = useReducedMotion();

    const variants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 35,
            scale: shouldReduceMotion ? 1 : 0.99,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 80,
                damping: 20,
                staggerChildren: 0.1,
                delayChildren: 0.05,
            },
        },
    };

    return (
        <motion.section
            id={id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.12 }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.section>
    );
};
