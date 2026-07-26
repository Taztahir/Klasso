import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Twitter, Linkedin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface FooterProps {
    onOpenModal?: (type: 'privacy' | 'terms' | 'cookie' | 'about' | 'help' | 'blog') => void;
}

export const Footer = ({ onOpenModal }: FooterProps) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleModalLink = (e: React.MouseEvent, type: 'privacy' | 'terms' | 'cookie' | 'about' | 'help' | 'blog') => {
        if (onOpenModal) {
            e.preventDefault();
            onOpenModal(type);
        }
    };

    const onSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY || "eb9cef46-c37d-40cc-85fe-f28fd9f45a63");
        formData.append("subject", "New Newsletter Subscription - Klasso");
        formData.append("from_name", "Klasso Newsletter");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 5000);
            }
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <footer className="bg-brandBlack text-white pt-24 pb-12 overflow-hidden relative">

            {/* Background Accent */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brandPurple/10 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3 font-bold text-2xl tracking-tight group">
                            <svg
                                aria-hidden="true"
                                width="36"
                                height="36"
                                viewBox="0 0 100 100"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="group-hover:rotate-12 transition-transform"
                            >
                                <rect x="8" y="8" width="84" height="84" rx="22" fill="#1E3A5F" />
                                <rect x="28" y="26" width="10" height="48" rx="5" fill="#E8A838" />
                                <path d="M38 50 L66 26" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
                                <path d="M38 50 L66 74" stroke="#2A8C8C" strokeWidth="10" strokeLinecap="round" />
                            </svg>
                            Klasso

                        </Link>
                        <p className="text-white/60 leading-relaxed max-w-xs font-medium">
                            The secure, multi-tenant school OS for Nigerian private schools. Coordinate notes, CBT, CBE report cards, and fee collections calmly.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Twitter, href: 'https://twitter.com/klassoapp', label: 'Twitter' },
                                { icon: Github, href: 'https://github.com/klassoapp', label: 'GitHub' },
                                { icon: Linkedin, href: 'https://linkedin.com/company/klasso', label: 'LinkedIn' },
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brandPurple hover:border-brandPurple transition-all group"
                                >
                                    <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="font-bold text-lg mb-8">Product</h4>
                        <ul className="space-y-4 text-white/50 font-medium">
                            <li><a href="#features" className="hover:text-brandPurple transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-brandPurple transition-colors">Pricing</a></li>
                            <li><a href="#testimonials" className="hover:text-brandPurple transition-colors">Testimonials</a></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-bold text-lg mb-8">Company</h4>
                        <ul className="space-y-4 text-white/50 font-medium">
                            <li><a href="#team" className="hover:text-brandPurple transition-colors">The Team</a></li>
                            <li><a href="#about" className="hover:text-brandPurple transition-colors">Our Story</a></li>
                            <li><a href="/help" onClick={(e) => handleModalLink(e, 'help')} className="hover:text-brandPurple transition-colors">Support</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-lg mb-2">Weekly School Tidbits</h4>
                        <p className="text-white/50 text-sm font-medium">Join 5,000+ proprietors getting school growth tips.</p>
                        <form onSubmit={onSubscribe} className="flex flex-col gap-3">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="yourschool@email.com"
                                    disabled={status === 'loading' || status === 'success'}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brandPurple transition-all text-sm disabled:opacity-50"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                                className={`
                                    py-3 rounded-xl font-bold text-sm transition-all uppercase tracking-widest flex items-center justify-center gap-2
                                    ${status === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-brandPurple hover:brightness-110'}
                                    disabled:opacity-80 disabled:cursor-not-allowed
                                `}
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Subscribing...
                                    </>
                                ) : status === 'success' ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        Subscribed!
                                    </>
                                ) : status === 'error' ? (
                                    <>
                                        <AlertCircle className="w-4 h-4" />
                                        Try Again
                                    </>
                                ) : (
                                    'Subscribe Now'
                                )}
                            </button>
                            {status === 'success' && (
                                <p className="text-green-400 text-xs font-bold text-center animate-bounce">Welcome to the school growth network! 🚀</p>
                            )}
                            {status === 'error' && (
                                <p className="text-red-400 text-xs font-bold text-center">Something went wrong. Please try again.</p>
                            )}
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">

                        <div className="flex gap-6">
                            <a href="/terms" onClick={(e) => handleModalLink(e, 'terms')} className="text-white/40 text-xs hover:text-white transition-colors">Terms of Service</a>
                            <a href="/privacy" onClick={(e) => handleModalLink(e, 'privacy')} className="text-white/40 text-xs hover:text-white transition-colors">Privacy Policy</a>
                            <a href="/help" onClick={(e) => handleModalLink(e, 'cookie')} className="text-white/40 text-xs hover:text-white transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                    <p className="text-white/40 text-sm font-medium">
                        © 2026 klasso.app. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
