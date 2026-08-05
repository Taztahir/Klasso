'use client';

import { useState } from 'react';
import { Send, Mail, User, MessageSquare, Loader2, CheckCircle2, AlertCircle, ArrowUpRight, Building2 } from 'lucide-react';

export const ContactSection = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [selectedRole, setSelectedRole] = useState<string>('School Leader');

    const roles = ['School Leader', 'Teacher', 'IT / Admin', 'Parent / Other'];

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const form = e.currentTarget;
        const formData = new FormData(form);

        const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || process.env.VITE_WEB3FORMS_KEY || "eb9cef46-c37d-40cc-85fe-f28fd9f45a63";
        if (!accessKey) {
            console.error("Web3Forms API key is missing from environment variables.");
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
            return;
        }

        formData.append("access_key", accessKey);
        formData.append("subject", `[${selectedRole}] New Inquiry - Klasso`);
        formData.append("from_name", "Klasso Contact Form");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setStatus('success');
                form.reset();
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
        <section id="contact" className="py-16 md:py-24 relative overflow-hidden bg-cream">
            {/* Background Decorative Ambient Glows */}
            <div className="absolute top-1/4 -left-32 w-72 h-72 bg-brandPurple/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 -right-32 w-72 h-72 bg-brandYellow/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-5 relative z-10">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">

                    {/* Left Column: Context & Quick Info */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brandPurple/10 text-brandPurple text-[11px] font-extrabold uppercase tracking-widest mb-4">

                                Contact Us
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] text-brandBlack mb-4">
                                Let's get <br />
                                <span className="text-brandPurple italic relative">
                                    in touch.
                                    <svg className="absolute -bottom-1.5 left-0 w-full h-2.5 text-brandYellow/60 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                                        <path d="M0,15 Q50,5 100,15" stroke="currentColor" strokeWidth="8" fill="none" />
                                    </svg>
                                </span>
                            </h2>
                            <p className="text-sm md:text-lg text-brandBlack/70 font-medium leading-relaxed max-w-sm">
                                Have questions about onboarding, data migration, or pricing? Our team typically responds within a few business hours.
                            </p>
                        </div>

                        {/* Interactive Direct Contact Cards */}
                        <div className="space-y-3">
                            <a
                                href="mailto:taztaz162004@gmail.com"
                                className="group flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-brandBlack/5 shadow-sm hover:shadow-md hover:border-brandBlack/20 transition-all duration-300"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 bg-brandBlack text-white rounded-xl flex items-center justify-center group-hover:bg-brandPurple group-hover:scale-105 transition-all duration-300 shadow-sm">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-extrabold text-brandBlack/40 uppercase tracking-widest mb-0.5">Email Us</p>
                                        <p className="text-base font-black text-brandBlack group-hover:text-brandPurple transition-colors">hello@klasso.app</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                                    <ArrowUpRight className="w-4 h-4 text-brandBlack" />
                                </div>
                            </a>

                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-brandBlack/5 shadow-sm hover:shadow-md hover:border-brandBlack/20 transition-all duration-300 group">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 bg-brandYellow text-brandBlack rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-sm">
                                        <MessageSquare size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-extrabold text-brandBlack/40 uppercase tracking-widest mb-0.5">Support Desk</p>
                                        <p className="text-base font-black text-brandBlack">School Admin Help</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black uppercase bg-green-100 text-green-700 px-2.5 py-1 rounded-full border border-green-200">
                                    Fast Priority
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form Container */}
                    <div className="lg:col-span-7 relative">
                        {/* Shadow Backing for Neubrutalist Depth */}
                        <div className="absolute inset-0 bg-brandBlack rounded-[28px] md:rounded-[32px] translate-x-2 translate-y-2" />

                        <div className="relative bg-white border-2 border-brandBlack rounded-[28px] md:rounded-[32px] p-5 md:p-8 shadow-xl">
                            <form onSubmit={onSubmit} className="space-y-4">

                                {/* Role Selection Pills */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brandBlack/50 ml-1">
                                        I am a...
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {roles.map((role) => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => setSelectedRole(role)}
                                                className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition-all border-2 ${selectedRole === role
                                                    ? 'bg-brandPurple text-white border-brandPurple shadow-sm scale-[1.02]'
                                                    : 'bg-cream text-brandBlack/70 border-brandBlack/5 hover:border-brandBlack/20'
                                                    }`}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Name Input */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brandBlack/50 ml-1">Your Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brandBlack/30 group-focus-within:text-brandPurple transition-colors" />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                aria-label="Your Name"
                                                placeholder="e.g. Sarah Jenkins"
                                                className="w-full bg-cream/60 border-2 border-brandBlack/10 rounded-xl py-2.5 pl-10 pr-3 outline-none focus:border-brandPurple focus:bg-white transition-all text-sm font-bold text-brandBlack placeholder:text-brandBlack/30"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Input */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brandBlack/50 ml-1">Work Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brandBlack/30 group-focus-within:text-brandPurple transition-colors" />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                aria-label="Your Email"
                                                placeholder="sarah@school.edu"
                                                className="w-full bg-cream/60 border-2 border-brandBlack/10 rounded-xl py-2.5 pl-10 pr-3 outline-none focus:border-brandPurple focus:bg-white transition-all text-sm font-bold text-brandBlack placeholder:text-brandBlack/30"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* School / Org Field */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brandBlack/50 ml-1">School / Organization Name</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brandBlack/30 group-focus-within:text-brandPurple transition-colors" />
                                        <input
                                            type="text"
                                            name="school_name"
                                            required
                                            placeholder="Oakridge Academy"
                                            className="w-full bg-cream/60 border-2 border-brandBlack/10 rounded-xl py-2.5 pl-10 pr-3 outline-none focus:border-brandPurple focus:bg-white transition-all text-sm font-bold text-brandBlack placeholder:text-brandBlack/30"
                                        />
                                    </div>
                                </div>

                                {/* Message Field */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brandBlack/50 ml-1">How can we help?</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={3}
                                        placeholder="Tell us about your team size, timeline, or features you'd like to explore..."
                                        className="w-full bg-cream/60 border-2 border-brandBlack/10 rounded-xl py-2.5 px-3.5 outline-none focus:border-brandPurple focus:bg-white transition-all text-sm font-bold text-brandBlack placeholder:text-brandBlack/30 resize-none"
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={status === 'loading' || status === 'success'}
                                    className={`
                                        w-full py-3.5 rounded-xl font-black text-sm transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:shadow-lg
                                        ${status === 'success'
                                            ? 'bg-green-600 text-white border-2 border-green-700'
                                            : status === 'error'
                                                ? 'bg-red-500 text-white border-2 border-red-600'
                                                : 'bg-brandBlack text-white hover:bg-brandPurple border-2 border-brandBlack active:scale-[0.98]'
                                        }
                                        disabled:opacity-80 disabled:cursor-not-allowed
                                    `}
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : status === 'success' ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            Message Received!
                                        </>
                                    ) : status === 'error' ? (
                                        <>
                                            <AlertCircle className="w-4 h-4" />
                                            Try Again
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Send Message
                                        </>
                                    )}
                                </button>

                                {/* Helper Notifications */}
                                {status === 'success' && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-center">
                                        <p className="text-green-700 text-xs font-bold">
                                            Thanks for reaching out! A specialist will reply within 24 hours. 📬
                                        </p>
                                    </div>
                                )}

                                {status === 'error' && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center">
                                        <p className="text-red-600 text-xs font-bold">
                                            Something went wrong. Please check your connection or email hello@klasso.app directly.
                                        </p>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};