'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, MotionValue, useMotionTemplate } from 'framer-motion';
import { MagneticButton } from './MagneticButton';
import { useAuth } from '../context/AuthContext';

/**
 * FloatingShape — three-layer animation architecture:
 *  1. Outer static div:  positions the shape and applies CSS float keyframe (translateY).
 *  2. Middle motion.div: scroll-exit — translates + fades as hero scrolls away.
 *  3. Inner motion.div:  spring entry — slides in from enterFrom offset on mount.
 *
 * Keeping scroll-exit and spring-entry on SEPARATE elements is critical:
 * mixing style.transform (scroll) with animate.x/y (spring) on the same
 * motion.div causes Framer Motion to produce conflicting CSS variables.
 */
const FloatingShape = ({
    children,
    className,
    enterFrom,
    exitDirection,
    delay = 0,
    containerProgress,
    floatClass = 'animate-float',
}: {
    children: React.ReactNode;
    className: string;
    enterFrom: { x?: number; y?: number };
    exitDirection: { x?: number; y?: number };
    delay?: number;
    containerProgress: MotionValue<number>;
    floatClass?: string;
}) => {
    // Layer 2: scroll-exit — move away + fade as hero scrolls out
    const exitX = useTransform(containerProgress, [0, 0.75], [0, exitDirection.x ?? 0]);
    const exitY = useTransform(containerProgress, [0, 0.75], [0, exitDirection.y ?? 0]);
    const exitOpacity = useTransform(containerProgress, [0, 0.45], [1, 0]);
    const exitTransform = useMotionTemplate`translateX(${exitX}px) translateY(${exitY}px)`;

    return (
        // Layer 1: static position + CSS float (only translateY — no FM conflict)
        <div className={`absolute ${className} ${floatClass}`}>
            {/* Layer 2: scroll-exit via style.transform & opacity — NO x/y in animate */}
            <motion.div style={{ opacity: exitOpacity, transform: exitTransform }}>
                {/* Layer 3: spring entry — x/y animate only, no scroll style here */}
                <motion.div
                    initial={{ opacity: 0, x: enterFrom.x ?? 0, y: enterFrom.y ?? 0 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ type: 'spring', stiffness: 70, damping: 16, delay }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </div>
    );
};


/* Stagger variants for the main content block */
const contentVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.13, delayChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { type: 'spring', stiffness: 85, damping: 20 },
    },
};

export const Hero = () => {
    const { user } = useAuth();
    const router = useRouter();
    const sectionRef = useRef<HTMLElement>(null);

    /* Track how far the section has scrolled out of the viewport */
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    const handleCtaClick = () => {
        if (user) {
            router.push('/dashboard/overview');
        } else {
            router.push('/signup');
        }
    };

    // Scroll-out for the main content block
    const contentY = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <section ref={sectionRef} className="relative pt-28 pb-36 bg-cream overflow-hidden">

            {/* ── Top-left: smiley face ── */}
            <FloatingShape
                className="top-20 left-10 max-lg:top-4 max-lg:left-2"
                floatClass="animate-float"
                enterFrom={{ x: -100, y: -50 }}
                exitDirection={{ x: -140, y: -90 }}
                delay={0.15}
                containerProgress={scrollYProgress}
            >
                <svg aria-hidden="true" width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="50" fill="#F472B6" fillOpacity="0.2" />
                    <path d="M40 45C40 45 45 40 60 40C75 40 80 45 80 45V75C80 75 75 80 60 80C45 80 40 75 40 75V45Z" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="50" cy="55" r="3" fill="#18181B" />
                    <circle cx="70" cy="55" r="3" fill="#18181B" />
                    <path d="M55 65C55 65 60 68 65 65" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
                    <path d="M20 20L35 35" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="100" cy="30" r="5" fill="#FACC15" />
                </svg>
            </FloatingShape>

            {/* ── Top-right: triangle-circle ── */}
            <FloatingShape
                className="top-20 right-10 max-lg:top-20 max-lg:right-1"
                floatClass="animate-float-delayed"
                enterFrom={{ x: 100, y: -50 }}
                exitDirection={{ x: 140, y: -90 }}
                delay={0.25}
                containerProgress={scrollYProgress}
            >
                <svg aria-hidden="true" width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <path d="M60 10L110 96H10L60 10Z" fill="#A855F7" fillOpacity="0.1" stroke="#A855F7" strokeWidth="2" />
                    <circle cx="60" cy="60" r="25" stroke="#18181B" strokeWidth="3" />
                    <path d="M50 55C50 55 55 50 60 50C65 50 70 55 70 55" stroke="#18181B" strokeWidth="2" />
                    <line x1="45" y1="70" x2="75" y2="70" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
                </svg>
            </FloatingShape>

            {/* ── Bottom-left: green circle arrow ── */}
            <FloatingShape
                className="bottom-40 left-20 max-lg:bottom-30 max-lg:left-1"
                floatClass="animate-float-reverse"
                enterFrom={{ x: -80, y: 70 }}
                exitDirection={{ x: -120, y: 70 }}
                delay={0.35}
                containerProgress={scrollYProgress}
            >
                <svg aria-hidden="true" width="100" height="100" viewBox="0 0 100 100" fill="none">
                    <rect x="20" y="20" width="60" height="60" rx="30" fill="#22C55E" fillOpacity="0.2" stroke="#22C55E" strokeWidth="2" />
                    <path d="M40 45L50 55L60 45" stroke="#18181B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </FloatingShape>

            {/* ── Bottom-right: rotated square ── */}
            <FloatingShape
                className="bottom-40 right-20 max-lg:bottom-20 max-lg:right-1"
                floatClass="animate-float-delayed-reverse"
                enterFrom={{ x: 80, y: 70 }}
                exitDirection={{ x: 120, y: 70 }}
                delay={0.3}
                containerProgress={scrollYProgress}
            >
                <svg aria-hidden="true" width="100" height="100" viewBox="0 0 100 100" fill="none">
                    <rect x="20" y="20" width="60" height="60" rx="10" fill="#FACC15" fillOpacity="0.2" stroke="#FACC15" strokeWidth="2" transform="rotate(15 50 50)" />
                    <circle cx="45" cy="45" r="4" fill="#18181B" />
                    <circle cx="65" cy="45" r="4" fill="#18181B" />
                    <path d="M45 60C45 60 55 65 65 60" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </FloatingShape>

            <motion.div
                className="max-w-4xl mx-auto px-6 font-sans text-center relative z-10"
                style={{ y: contentY }}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl font-sans sm:text-[54px] font-semibold leading-[1.1] mb-8 tracking-tight"
                >
                    Run Your Private School <br className="hidden sm:block" />
                    From One{' '}
                    <span className="relative inline-block mt-2 sm:mt-0">
                        <span className="relative z-10 px-4 py-1 text-brandBlack">Dashboard</span>
                        <span className="absolute inset-0 bg-brandYellow rounded-lg -rotate-1 -z-0 animate-wiggle border-2 border-brandBlack"></span>
                    </span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-base md:text-lg text-brandBlack/60 max-w-xl mx-auto mb-10 leading-relaxed font-medium"
                >
                    Klasso is the multi-tenant school OS built for primary and secondary private schools in Nigeria. Manage exams (CBT), competency grades, report cards, class notes, and fee payments in one peaceful dashboard.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <MagneticButton
                        onClick={handleCtaClick}
                        className="bg-brandBlack text-white px-8 py-4 rounded-full font-bold hover:bg-brandPurple transition-all transform hover:-translate-y-1"
                    >
                        {user ? 'Open Portal' : 'Start Free Trial'}
                    </MagneticButton>
                    <a href="#how-it-works">
                        <MagneticButton className="bg-white border-2 border-brandBlack px-8 py-4 rounded-full font-bold hover:bg-brandBlack hover:text-white transition-all transform hover:-translate-y-1">
                            See How It Works
                        </MagneticButton>
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
};

