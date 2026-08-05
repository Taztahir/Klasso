'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, User, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';

/* ── Google SVG Icon ── */
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...props}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

/* ── Decorative floating orb ── */
const Orb = ({ style, className }: { style?: React.CSSProperties; className?: string }) => (
    <div
        className={`absolute rounded-full pointer-events-none ${className}`}
        style={style}
        aria-hidden="true"
    />
);

/* ── Input Field ── */
const InputField = ({
    id,
    label,
    type,
    value,
    onChange,
    placeholder,
    icon: Icon,
    autoComplete,
    minLength,
    required = true,
    accentColor,
}: {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    icon: React.ElementType;
    autoComplete?: string;
    minLength?: number;
    required?: boolean;
    accentColor: string;
}) => (
    <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {label}
        </label>
        <div className="relative">
            <Icon
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--brand-black)', opacity: 0.35 }}
            />
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
                minLength={minLength}
                className="w-full rounded-xl border-2 pl-10 pr-4 py-3 text-sm font-medium focus:outline-none transition-all duration-200"
                style={{
                    background: 'rgba(255,251,247,0.8)',
                    borderColor: 'rgba(13,14,20,0.15)',
                    color: 'var(--brand-black)',
                    /* Focus ring via JS */
                } as React.CSSProperties}
                onFocus={(e) => { e.target.style.borderColor = accentColor; e.target.style.boxShadow = `0 0 0 3px ${accentColor}22`; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(13,14,20,0.15)'; e.target.style.boxShadow = 'none'; }}
            />
        </div>
    </div>
);

/* ── Main AuthModal ── */
export const AuthModal: React.FC = () => {
    const { isOpen, activeTab, closeModal, setActiveTab } = useAuthModal();
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const router = useRouter();

    /* form state */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [signupSuccess, setSignupSuccess] = useState(false);

    /* reset state when modal opens or tab changes */
    useEffect(() => {
        if (isOpen) {
            setEmail('');
            setPassword('');
            setFullName('');
            setError(null);
            setLoading(false);
            setGoogleLoading(false);
            setSignupSuccess(false);
        }
    }, [isOpen, activeTab]);

    /* close on Escape key */
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') closeModal();
    }, [closeModal]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    const redirectToDashboard = () => {
        closeModal();
        router.replace('/dashboard/overview');
    };

    const handleGoogleAuth = async () => {
        setGoogleLoading(true);
        setError(null);
        try {
            const { error } = await signInWithGoogle();
            if (error) {
                setError(error.message);
                setGoogleLoading(false);
            } else {
                redirectToDashboard();
            }
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
            redirectToDashboard();
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
                setError('An account with this email already exists. Try logging in instead.');
            } else {
                setError(error.message);
            }
            setLoading(false);
        } else {
            redirectToDashboard();
        }
    };

    const isLogin = activeTab === 'login';
    const accentColor = isLogin ? 'var(--brand-purple)' : 'var(--brand-green)';
    const accentHex = isLogin ? '#1E3A5F' : '#2A8C8C';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* ── Backdrop ── */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="fixed inset-0 z-[80]"
                        style={{ background: 'rgba(13,14,20,0.55)', backdropFilter: 'blur(8px)' }}
                        onClick={closeModal}
                        aria-hidden="true"
                    />

                    {/* ── Modal panel ── */}
                    <motion.div
                        key="modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label={isLogin ? 'Sign in to Klasso' : 'Create your Klasso account'}
                        initial={{ opacity: 0, scale: 0.92, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 24 }}
                        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                        className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="relative w-full max-w-md pointer-events-auto overflow-hidden rounded-3xl"
                            style={{
                                background: 'rgba(255,251,247,0.97)',
                                boxShadow: '0 32px 80px -8px rgba(13,14,20,0.25), 0 0 0 1px rgba(13,14,20,0.06)',
                                backdropFilter: 'blur(24px)',
                            }}
                        >
                            {/* ── Decorative gradient blobs ── */}
                            <Orb
                                className="w-64 h-64 -top-16 -right-16 opacity-30"
                                style={{
                                    background: isLogin
                                        ? 'radial-gradient(circle, #1E3A5F44, transparent 70%)'
                                        : 'radial-gradient(circle, #2A8C8C44, transparent 70%)',
                                }}
                            />
                            <Orb
                                className="w-48 h-48 -bottom-12 -left-12 opacity-20"
                                style={{ background: 'radial-gradient(circle, #E8A83866, transparent 70%)' }}
                            />

                            {/* ── Accent top strip ── */}
                            <div
                                className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                                style={{
                                    background: `linear-gradient(90deg, ${accentHex}, var(--brand-yellow), ${isLogin ? 'var(--brand-pink)' : 'var(--brand-purple)'})`,
                                }}
                            />

                            {/* ── Close button ── */}
                            <button
                                onClick={closeModal}
                                id="auth-modal-close"
                                aria-label="Close modal"
                                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110"
                                style={{ background: 'rgba(13,14,20,0.06)', color: 'var(--brand-black)' }}
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="relative z-10 px-8 pt-10 pb-8">
                                {/* ── Logo ── */}
                                <div className="flex items-center gap-2.5 mb-8">
                                    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" aria-label="Klasso logo">
                                        <rect x="8" y="8" width="84" height="84" rx="22" fill="var(--brand-purple)" />
                                        <rect x="28" y="26" width="10" height="48" rx="5" fill="var(--brand-yellow)" />
                                        <path d="M38 50 L66 26" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
                                        <path d="M38 50 L66 74" stroke="var(--brand-green)" strokeWidth="10" strokeLinecap="round" />
                                    </svg>
                                    <span className="text-xl font-black tracking-tight" style={{ color: 'var(--brand-purple)' }}>klasso</span>
                                </div>

                                {/* ── Tab switcher ── */}
                                <div
                                    className="flex p-1 rounded-2xl mb-8 gap-1"
                                    style={{ background: 'rgba(13,14,20,0.06)' }}
                                    role="tablist"
                                    aria-label="Authentication options"
                                >
                                    {(['login', 'signup'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            role="tab"
                                            aria-selected={activeTab === tab}
                                            id={`auth-tab-${tab}`}
                                            onClick={() => setActiveTab(tab)}
                                            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 relative"
                                            style={{
                                                background: activeTab === tab ? '#fff' : 'transparent',
                                                color: activeTab === tab ? 'var(--brand-black)' : 'rgba(13,14,20,0.45)',
                                                boxShadow: activeTab === tab ? '0 2px 8px rgba(13,14,20,0.08)' : 'none',
                                            }}
                                        >
                                            {tab === 'login' ? 'Sign In' : 'Create Account'}
                                        </button>
                                    ))}
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, x: isLogin ? -12 : 12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: isLogin ? 12 : -12 }}
                                        transition={{ duration: 0.18 }}
                                    >
                                        {/* ── Heading ── */}
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--brand-black)' }}>
                                                {isLogin
                                                    ? <>Welcome back<span className="italic font-light" style={{ color: accentColor }}>.</span></>
                                                    : <>Register your school<span className="italic font-light" style={{ color: accentColor }}>.</span></>
                                                }
                                            </h2>
                                            <p className="mt-1 text-sm font-medium" style={{ color: 'rgba(13,14,20,0.5)' }}>
                                                {isLogin ? 'Sign in to your school portal' : 'Get started free — no credit card required'}
                                            </p>
                                        </div>

                                        {/* ── Error ── */}
                                        <AnimatePresence>
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -8 }}
                                                    className="mb-5 p-3.5 rounded-xl border-2 border-red-300 text-red-600 text-sm font-semibold"
                                                    style={{ background: '#fff5f5' }}
                                                    role="alert"
                                                >
                                                    {error}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* ── Google Button ── */}
                                        <button
                                            type="button"
                                            id={`auth-${activeTab}-google-btn`}
                                            onClick={handleGoogleAuth}
                                            disabled={googleLoading || loading}
                                            className="w-full flex items-center justify-center gap-2.5 rounded-2xl border-2 border-black py-3.5 text-sm font-bold text-black mb-5 transition-all duration-150 disabled:opacity-50"
                                            style={{
                                                background: '#fff',
                                                boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                                            }}
                                            onMouseEnter={e => { (e.currentTarget.style.transform = 'translate(2px,2px)'); (e.currentTarget.style.boxShadow = 'none'); }}
                                            onMouseLeave={e => { (e.currentTarget.style.transform = ''); (e.currentTarget.style.boxShadow = '4px 4px 0px 0px rgba(0,0,0,1)'); }}
                                        >
                                            {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon className="text-[18px]" />}
                                            Continue with Google
                                        </button>

                                        {/* ── Divider ── */}
                                        <div className="relative flex items-center gap-3 mb-5">
                                            <div className="grow border-t-2" style={{ borderColor: 'rgba(13,14,20,0.08)' }} />
                                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(13,14,20,0.3)' }}>or</span>
                                            <div className="grow border-t-2" style={{ borderColor: 'rgba(13,14,20,0.08)' }} />
                                        </div>

                                        {/* ── Form ── */}
                                        <form
                                            onSubmit={isLogin ? handleLogin : handleSignUp}
                                            className="flex flex-col gap-4"
                                        >
                                            {!isLogin && (
                                                <InputField
                                                    id="auth-fullname"
                                                    label="Full Name"
                                                    type="text"
                                                    value={fullName}
                                                    onChange={setFullName}
                                                    placeholder="Your full name"
                                                    icon={User}
                                                    autoComplete="name"
                                                    accentColor={accentHex}
                                                />
                                            )}
                                            <InputField
                                                id="auth-email"
                                                label={isLogin ? 'Email' : 'Work Email'}
                                                type="email"
                                                value={email}
                                                onChange={setEmail}
                                                placeholder={isLogin ? 'principal@school.com' : 'admin@yourschool.com'}
                                                icon={Mail}
                                                autoComplete="email"
                                                accentColor={accentHex}
                                            />
                                            <InputField
                                                id="auth-password"
                                                label="Password"
                                                type="password"
                                                value={password}
                                                onChange={setPassword}
                                                placeholder={isLogin ? '••••••••' : 'Min 8 characters'}
                                                icon={Lock}
                                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                                                minLength={isLogin ? undefined : 8}
                                                accentColor={accentHex}
                                            />

                                            {/* ── Submit ── */}
                                            <button
                                                id={`auth-${activeTab}-submit-btn`}
                                                type="submit"
                                                disabled={loading}
                                                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-black py-3.5 text-sm font-black text-white mt-1 transition-all duration-150 disabled:opacity-60"
                                                style={{
                                                    background: accentColor,
                                                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                                                }}
                                                onMouseEnter={e => { if (!loading) { (e.currentTarget.style.transform = 'translate(2px,2px)'); (e.currentTarget.style.boxShadow = 'none'); } }}
                                                onMouseLeave={e => { (e.currentTarget.style.transform = ''); (e.currentTarget.style.boxShadow = '4px 4px 0px 0px rgba(0,0,0,1)'); }}
                                            >
                                                {loading
                                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                                    : (
                                                        <>
                                                            {isLogin ? 'Sign in to Portal' : 'Create Free Account'}
                                                            <ArrowRight className="w-4 h-4" />
                                                        </>
                                                    )
                                                }
                                            </button>
                                        </form>

                                        {/* ── Footer switch ── */}
                                        <p className="mt-6 text-center text-sm font-medium" style={{ color: 'rgba(13,14,20,0.5)' }}>
                                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                            <button
                                                id={`auth-switch-to-${isLogin ? 'signup' : 'login'}`}
                                                onClick={() => setActiveTab(isLogin ? 'signup' : 'login')}
                                                className="font-black underline-offset-2 hover:underline transition-colors"
                                                style={{ color: accentColor }}
                                            >
                                                {isLogin ? 'Register your school' : 'Sign in'}
                                            </button>
                                        </p>

                                        {/* ── Terms (signup only) ── */}
                                        {!isLogin && (
                                            <p className="mt-3 text-center text-[11px] font-medium" style={{ color: 'rgba(13,14,20,0.38)' }}>
                                                By signing up, you agree to our{' '}
                                                <span className="underline underline-offset-2 cursor-pointer hover:opacity-70">Terms of Service</span>{' '}
                                                and{' '}
                                                <span className="underline underline-offset-2 cursor-pointer hover:opacity-70">Privacy Policy</span>.
                                            </p>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
