import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, User } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...props}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.09, delayChildren: 0.05 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 320, damping: 26 },
    },
};

export const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { signUp, signInWithGoogle } = useAuth();
    useLocation(); // keep import alive

    const handleGoogleSignUp = async () => {
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

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        });
        if (error) {
            if (error.message.includes('already registered')) {
                setError('An account with this email already exists. Try logging in or using Google instead!');
            } else {
                setError(error.message);
            }
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div
                className="flex min-h-screen w-full items-center justify-center px-6 font-sans"
                style={{ background: 'var(--cream)' }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[400px] text-center"
                >
                    <div className="mb-6 flex justify-center">
                        <div
                            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-brandBlack"
                            style={{ background: 'var(--brand-green)' }}
                        >
                            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-brandBlack">Check your email</h1>
                    <p className="mt-3 text-sm font-medium text-brandBlack/60">
                        We've sent a confirmation link to{' '}
                        <span className="font-black text-brandBlack">{email}</span>.{' '}
                        Click the link to activate your account.
                    </p>
                    <Link
                        to="/login"
                        className="mt-8 block w-full rounded-2xl border-2 border-brandBlack py-4 text-sm font-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                        style={{ background: 'var(--brand-purple)' }}
                    >
                        Back to Login
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div
            className="flex items-center justify-center min-h-screen w-full font-sans"
            style={{ background: 'var(--cream)' }}
        >


            {/* ── Left Form Panel ────────────────────────────── */}
            <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-16 sm:px-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-[400px]"
                >
                    {/* Logo + Title */}
                    <motion.div variants={itemVariants} className="mb-8 text-center">
                        <Link to="/" className="inline-flex items-center gap-3 mb-7">
                            <svg width="38" height="38" viewBox="0 0 100 100" fill="none" aria-label="Klasso logo">
                                <rect x="8" y="8" width="84" height="84" rx="22" fill="var(--brand-purple)" />
                                <rect x="28" y="26" width="10" height="48" rx="5" fill="var(--brand-yellow)" />
                                <path d="M38 50 L66 26" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
                                <path d="M38 50 L66 74" stroke="var(--brand-green)" strokeWidth="10" strokeLinecap="round" />
                            </svg>
                            <span className="text-2xl font-black tracking-tight" style={{ color: 'var(--brand-purple)' }}>klasso</span>
                        </Link>
                        <h1 className="text-3xl font-black tracking-tight text-brandBlack">
                            Register your school<span className="italic font-light" style={{ color: 'var(--brand-green)' }}>.</span>
                        </h1>
                        <p className="mt-2 text-sm font-medium text-brandBlack/50">Get started free — no credit card required</p>
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

                    {/* Google */}
                    <motion.div variants={itemVariants} className="mb-6">
                        <button
                            type="button"
                            id="signup-google-btn"
                            onClick={handleGoogleSignUp}
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
                    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                        <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                            <label htmlFor="signup-name" className="text-sm font-bold text-brandBlack ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brandBlack/30" />
                                <input
                                    id="signup-name"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Your full name"
                                    required
                                    autoComplete="name"
                                    className="w-full rounded-xl border-2 border-brandBlack pl-10 pr-4 py-3.5 text-sm font-medium text-brandBlack placeholder:text-brandBlack/30 focus:outline-none focus:ring-2 transition-all"
                                    style={{ background: 'var(--cream)' }}
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                            <label htmlFor="signup-email" className="text-sm font-bold text-brandBlack ml-1">Work Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brandBlack/30" />
                                <input
                                    id="signup-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@yourschool.com"
                                    required
                                    autoComplete="email"
                                    className="w-full rounded-xl border-2 border-brandBlack pl-10 pr-4 py-3.5 text-sm font-medium text-brandBlack placeholder:text-brandBlack/30 focus:outline-none focus:ring-2 transition-all"
                                    style={{ background: 'var(--cream)' }}
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                            <label htmlFor="signup-password" className="text-sm font-bold text-brandBlack ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brandBlack/30" />
                                <input
                                    id="signup-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min 8 characters"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    className="w-full rounded-xl border-2 border-brandBlack pl-10 pr-4 py-3.5 text-sm font-medium text-brandBlack placeholder:text-brandBlack/30 focus:outline-none focus:ring-2 transition-all"
                                    style={{ background: 'var(--cream)' }}
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="mt-1">
                            <button
                                id="signup-submit-btn"
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-2xl border-2 border-brandBlack py-4 text-sm font-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-[0.97] disabled:opacity-60"
                                style={{ background: 'var(--brand-green)' }}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create Free Account'}
                            </button>
                        </motion.div>
                    </form>

                    {/* Terms */}
                    <motion.p variants={itemVariants} className="mt-4 text-center text-[11px] font-medium text-brandBlack/40">
                        By signing up, you agree to our{' '}
                        <span className="underline underline-offset-2 cursor-pointer hover:text-brandBlack/70 transition-colors">Terms of Service</span>{' '}
                        and{' '}
                        <span className="underline underline-offset-2 cursor-pointer hover:text-brandBlack/70 transition-colors">Privacy Policy</span>.
                    </motion.p>

                    {/* Footer link */}
                    <motion.p variants={itemVariants} className="mt-6 text-center text-sm font-bold text-brandBlack/50">
                        Already have an account?{' '}
                        <Link to="/login" className="font-black transition-colors hover:underline" style={{ color: 'var(--brand-purple)' }}>
                            Sign in
                        </Link>
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
};
