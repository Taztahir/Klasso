import { useState } from 'react';
import { Send, Mail, User, MessageSquare, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactSection = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY || "eb9cef46-c37d-40cc-85fe-f28fd9f45a63");
        formData.append("subject", "New Contact Inquiry - Klasso");
        formData.append("from_name", "Klasso Contact Form");

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
        <section id="contact" className="py-32 relative overflow-hidden bg-cream">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brandPurple/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-brandYellow/10 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Content Column */}
                    <div className="space-y-8">
                        <div>
                            <span className="inline-block px-4 py-1.5 rounded-full bg-brandPurple/10 text-brandPurple text-sm font-bold uppercase tracking-wider mb-6">
                                Contact Us
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-8">
                                Let's get <br />
                                <span className="text-brandPurple italic">in touch.</span>
                            </h2>
                            <p className="text-lg md:text-xl text-brandBlack/60 font-medium leading-relaxed max-w-md">
                                Have questions about setting up Klasso for your school? Our team is ready to assist you with onboarding, data migration, and training.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-brandBlack/5 shadow-sm hover:shadow-md transition-all group">
                                <div className="w-14 h-14 bg-brandBlack text-white rounded-2xl flex items-center justify-center group-hover:bg-brandPurple transition-colors">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brandBlack/40 uppercase tracking-widest">Email Us</p>
                                    <p className="text-xl font-bold">hello@klasso.app</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-brandBlack/5 shadow-sm hover:shadow-md transition-all group">
                                <div className="w-14 h-14 bg-brandYellow text-brandBlack rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brandBlack/40 uppercase tracking-widest">Support</p>
                                    <p className="text-xl font-bold">School Admin Priority Help</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-brandBlack rounded-[40px] translate-x-3 translate-y-3" />
                        <div className="relative bg-white border-2 border-brandBlack rounded-[40px] p-8 md:p-12 shadow-2xl">
                            <form onSubmit={onSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-widest text-brandBlack/40 ml-1">Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brandBlack/20" />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                aria-label="Your Name"
                                                placeholder="Your Name"
                                                className="w-full bg-cream border-2 border-brandBlack/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brandPurple transition-all font-bold placeholder:text-brandBlack/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-widest text-brandBlack/40 ml-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brandBlack/20" />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                aria-label="Your Email"
                                                placeholder="your@email.com"
                                                className="w-full bg-cream border-2 border-brandBlack/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brandPurple transition-all font-bold placeholder:text-brandBlack/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-widest text-brandBlack/40 ml-1">Subject</label>
                                    <input
                                        type="text"
                                        name="subject_line"
                                        required
                                        placeholder="How can we help your school?"
                                        className="w-full bg-cream border-2 border-brandBlack/5 rounded-2xl py-4 px-6 outline-none focus:border-brandPurple transition-all font-bold placeholder:text-brandBlack/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-widest text-brandBlack/40 ml-1">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={4}
                                        placeholder="Tell us about your school and how we can support you..."
                                        className="w-full bg-cream border-2 border-brandBlack/5 rounded-2xl py-4 px-6 outline-none focus:border-brandPurple transition-all font-bold placeholder:text-brandBlack/20 resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading' || status === 'success'}
                                    className={`
                                        w-full py-5 rounded-2xl font-black text-lg transition-all uppercase tracking-widest flex items-center justify-center gap-3
                                        ${status === 'success' ? 'bg-green-500 text-white' : 'bg-brandBlack text-white hover:bg-brandPurple'}
                                        disabled:opacity-80 disabled:cursor-not-allowed transform active:scale-[0.98]
                                    `}
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            Sending...
                                        </>
                                    ) : status === 'success' ? (
                                        <>
                                            <CheckCircle2 className="w-6 h-6" />
                                            Message Sent!
                                        </>
                                    ) : status === 'error' ? (
                                        <>
                                            <AlertCircle className="w-6 h-6" />
                                            Try Again
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>

                                {status === 'success' && (
                                    <p className="text-green-600 text-sm font-bold text-center animate-pulse">
                                        We'll get back to your school within 24 hours! 📬
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
