'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { motion, useScroll, useTransform, MotionValue, useMotionTemplate, type Variants } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...props}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

/* ── Three-layer floating shape component ── */
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
    const exitX = useTransform(containerProgress, [0, 0.75], [0, exitDirection.x ?? 0]);
    const exitY = useTransform(containerProgress, [0, 0.75], [0, exitDirection.y ?? 0]);
    const exitOpacity = useTransform(containerProgress, [0, 0.45], [1, 0]);
    const exitTransform = useMotionTemplate`translateX(${exitX}px) translateY(${exitY}px)`;

    return (
        <div className={`absolute pointer-events-none ${className} ${floatClass}`}>
            <motion.div style={{ opacity: exitOpacity, transform: exitTransform }}>
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

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.09, delayChildren: 0.05 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { type: 'spring', stiffness: 320, damping: 26 },
    },
};

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { signIn, signInWithGoogle } = useAuth();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError(null);
        try {
            const { error } = await signInWithGoogle();
            if (error) { setError(error.message); setGoogleLoading(false); }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
            setGoogleLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await signIn({ email, password });
        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
        router.replace('/dashboard/overview');
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative flex min-h-screen w-full items-center justify-center px-6 py-12 font-sans overflow-hidden"
            style={{ background: 'var(--cream)' }}
        >
            {/* ── Top-left: Smiley Face ── */}
            <FloatingShape
                className="top-12 left-12 max-lg:top-6 max-lg:left-4"
                floatClass="animate-float"
                enterFrom={{ x: -100, y: -50 }}
                exitDirection={{ x: -140, y: -90 }}
                delay={0.15}
                containerProgress={scrollYProgress}
            >
                <svg aria-hidden="true" width="100" height="100" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="50" fill="#F472B6" fillOpacity="0.2" />
                    <path d="M40 45C40 45 45 40 60 40C75 40 80 45 80 45V75C80 75 75 80 60 80C45 80 40 75 40 75V45Z" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="50" cy="55" r="3" fill="#18181B" />
                    <circle cx="70" cy="55" r="3" fill="#18181B" />
                    <path d="M55 65C55 65 60 68 65 65" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
                    <path d="M20 20L35 35" stroke="var(--brand-purple)" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="100" cy="30" r="5" fill="var(--brand-yellow)" />
                </svg>
            </FloatingShape>

            {/* ── Top-right: Triangle/Circle ── */}
            <FloatingShape
                className="top-12 right-12 max-lg:top-6 max-lg:right-4"
                floatClass="animate-float-delayed"
                enterFrom={{ x: 100, y: -50 }}
                exitDirection={{ x: 140, y: -90 }}
                delay={0.25}
                containerProgress={scrollYProgress}
            >
                <svg aria-hidden="true" width="100" height="100" viewBox="0 0 120 120" fill="none">
                    <path d="M60 10L110 96H10L60 10Z" fill="var(--brand-purple)" fillOpacity="0.1" stroke="var(--brand-purple)" strokeWidth="2" />
                    <circle cx="60" cy="60" r="25" stroke="#18181B" strokeWidth="3" />
                    <path d="M50 55C50 55 55 50 60 50C65 50 70 55 70 55" stroke="#18181B" strokeWidth="2" />
                    <line x1="45" y1="70" x2="75" y2="70" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
                </svg>
            </FloatingShape>

            {/* ── Bottom-left: Green Badge ── */}
            <FloatingShape
                className="bottom-12 left-12 max-lg:bottom-6 max-lg:left-4"
                floatClass="animate-float-reverse"
                enterFrom={{ x: -80, y: 70 }}
                exitDirection={{ x: -120, y: 70 }}
                delay={0.35}
                containerProgress={scrollYProgress}
            >
                <svg aria-hidden="true" width="90" height="90" viewBox="0 0 100 100" fill="none">
                    <rect x="20" y="20" width="60" height="60" rx="30" fill="var(--brand-green)" fillOpacity="0.2" stroke="var(--brand-green)" strokeWidth="2" />
                    <path d="M40 45L50 55L60 45" stroke="#18181B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </FloatingShape>

            {/* ── Bottom-right: Yellow Square ── */}
            <FloatingShape
                className="bottom-12 right-12 max-lg:bottom-6 max-lg:right-4"
                floatClass="animate-float-delayed-reverse"
                enterFrom={{ x: 80, y: 70 }}
                exitDirection={{ x: 120, y: 70 }}
                delay={0.3}
                containerProgress={scrollYProgress}
            >
                <svg aria-hidden="true" width="90" height="90" viewBox="0 0 100 100" fill="none">
                    <rect x="20" y="20" width="60" height="60" rx="10" fill="var(--brand-yellow)" fillOpacity="0.2" stroke="var(--brand-yellow)" strokeWidth="2" transform="rotate(15 50 50)" />
                    <circle cx="45" cy="45" r="4" fill="#18181B" />
                    <circle cx="65" cy="45" r="4" fill="#18181B" />
                    <path d="M45 60C45 60 55 65 65 60" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </FloatingShape>

            {/* Main Form Container */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-[400px]"
            >
                {/* Logo + Title */}
                <motion.div variants={itemVariants} className="mb-10 text-center">
                    <Link href="/" className="inline-flex items-center gap-3 mb-7">
                        <svg width="38" height="38" viewBox="0 0 100 100" fill="none" aria-label="Klasso logo">
                            <rect x="8" y="8" width="84" height="84" rx="22" fill="var(--brand-purple)" />
                            <rect x="28" y="26" width="10" height="48" rx="5" fill="var(--brand-yellow)" />
                            <path d="M38 50 L66 26" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
                            <path d="M38 50 L66 74" stroke="var(--brand-green)" strokeWidth="10" strokeLinecap="round" />
                        </svg>
                        <span className="text-2xl font-black tracking-tight" style={{ color: 'var(--brand-purple)' }}>klasso</span>
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight text-brandBlack">
                        Welcome back<span className="italic font-light" style={{ color: 'var(--brand-purple)' }}>.</span>
                    </h1>
                    <p className="mt-2 text-sm font-medium text-brandBlack/50">Sign in to your school portal</p>
                </motion.div>

                {/* Error */}
                {error && (
                    <motion.div
                        variants={itemVariants}
                        className="mb-6 p-4 rounded-2xl border-2 border-red-400 text-red-600 text-sm font-bold"
                        style={{ background: '#fff0f0' }}
                    >
                        {error}
                    </motion.div>
                )}

                {/* Google Button */}
                <motion.div variants={itemVariants} className="mb-6">
                    <button
                        type="button"
                        id="login-google-btn"
                        onClick={handleGoogleLogin}
                        disabled={googleLoading || loading}
                        className="w-full flex items-center justify-center gap-2.5 rounded-2xl border-2 border-brandBlack bg-white py-3.5 text-sm font-bold text-brandBlack shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-[0.97] disabled:opacity-50"
                    >
                        {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon className="text-[18px]" />}
                        Continue with Google
                    </button>
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemVariants} className="relative mb-6 flex items-center gap-4">
                    <div className="grow border-t-2 border-brandBlack/10"></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-brandBlack/30">Or</span>
                    <div className="grow border-t-2 border-brandBlack/10"></div>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                        <label htmlFor="login-email" className="text-sm font-bold text-brandBlack ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brandBlack/30" />
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="principal@school.com"
                                required
                                autoComplete="email"
                                className="w-full rounded-xl border-2 border-brandBlack pl-10 pr-4 py-3.5 text-sm font-medium text-brandBlack placeholder:text-brandBlack/30 focus:outline-none focus:ring-2 transition-all"
                                style={{ background: 'var(--cream)', '--tw-ring-color': 'var(--brand-purple)' } as React.CSSProperties}
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                        <label htmlFor="login-password" className="text-sm font-bold text-brandBlack ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brandBlack/30" />
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                className="w-full rounded-xl border-2 border-brandBlack pl-10 pr-4 py-3.5 text-sm font-medium text-brandBlack placeholder:text-brandBlack/30 focus:outline-none focus:ring-2 transition-all"
                                style={{ background: 'var(--cream)', '--tw-ring-color': 'var(--brand-purple)' } as React.CSSProperties}
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mt-1">
                        <button
                            id="login-submit-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl border-2 border-brandBlack py-4 text-sm font-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-[0.97] disabled:opacity-60"
                            style={{ background: 'var(--brand-purple)' }}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Sign in to Portal'}
                        </button>
                    </motion.div>
                </form>

                {/* Footer link */}
                <motion.p variants={itemVariants} className="mt-8 text-center text-sm font-bold text-brandBlack/50">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-black transition-colors hover:underline" style={{ color: 'var(--brand-purple)' }}>
                        Register your school
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    );
};
