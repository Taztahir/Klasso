'use client';

import React, { useEffect, useState } from 'react';
import { X, Shield, FileText, HelpCircle, BookOpen, Cookie } from 'lucide-react';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'privacy' | 'terms' | 'cookie' | 'about' | 'help' | 'blog' | null;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsMounted(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isMounted && !isOpen) return null;

    const getContent = () => {
        switch (type) {
            case 'privacy':
                return {
                    icon: Shield,
                    title: "Privacy Policy",
                    subtitle: "Last updated: Feb 22, 2026",
                    content: (
                        <div className="space-y-8">
                            <section>
                                <h4 className="text-lg font-bold mb-3">1. Data Isolation & Security</h4>
                                <p className="text-brandBlack/60 leading-relaxed">Each school portal runs in a fully isolated tenant database. Your school grades, class notes, student profiles, and parent contact details are encrypted and never shared between portals.</p>
                            </section>
                            <section>
                                <h4 className="text-lg font-bold mb-3">2. Financial Data Privacy</h4>
                                <p className="text-brandBlack/60 leading-relaxed">Klasso does not store student credit/debit card numbers. All online payments are handled directly by Paystack, our secure PCI-DSS-compliant payment gateway partner.</p>
                            </section>
                            <section>
                                <h4 className="text-lg font-bold mb-3">3. Support & Access Control</h4>
                                <p className="text-brandBlack/60 leading-relaxed">Only authorized administrators in your school can access or modify report cards and fee invoices. Klasso support staff access data only when explicitly requested to resolve technical tickets.</p>
                            </section>
                        </div>
                    )
                };
            case 'terms':
                return {
                    icon: FileText,
                    title: "Terms of Service",
                    subtitle: "Last updated: Feb 22, 2026",
                    content: (
                        <div className="space-y-8">
                            <section>
                                <h4 className="text-lg font-bold mb-3">1. Subscription Plans & Licensing</h4>
                                <p className="text-brandBlack/60 leading-relaxed">Klasso grants your school a non-transferable, multi-user license to manage operations. Subscription tiers are billed monthly based on total active student counts.</p>
                            </section>
                            <section>
                                <h4 className="text-lg font-bold mb-3">2. Fair Use & CBT Conduct</h4>
                                <p className="text-brandBlack/60 leading-relaxed">Schools are responsible for their exams, CBT question banks, and grading metrics. Bypassing student limits or generating bulk spam accounts violates our service terms.</p>
                            </section>
                            <section>
                                <h4 className="text-lg font-bold mb-3">3. Service Uptime</h4>
                                <p className="text-brandBlack/60 leading-relaxed">We strive for 99.9% uptime to ensure exams run smoothly. We are not liable for local internet outages or device failures during examination sessions.</p>
                            </section>
                        </div>
                    )
                };
            case 'help':
                return {
                    icon: HelpCircle,
                    title: "Help Center",
                    subtitle: "How can we assist your school?",
                    content: (
                        <div className="space-y-8">
                            <section>
                                <h4 className="text-lg font-bold mb-3">Frequently Asked Questions</h4>
                                <ul className="space-y-4">
                                    <li className="p-4 bg-brandPurple/5 rounded-2xl border border-brandPurple/10">
                                        <div className="font-bold mb-1">How do I invite teachers and parents?</div>
                                        <div className="text-sm text-brandBlack/60">Invite teachers via email from your school portal under "Staff Settings". Parents can log in using unique admission codes generated for their children.</div>
                                    </li>
                                    <li className="p-4 bg-brandYellow/5 rounded-2xl border border-brandYellow/10">
                                        <div className="font-bold mb-1">How secure are online school fee payments?</div>
                                        <div className="text-sm text-brandBlack/60">Extremely secure. All transactions are processed through Paystack, and receipts are auto-generated on parent dashboards instantly.</div>
                                    </li>
                                </ul>
                            </section>
                            <section>
                                <h4 className="text-lg font-bold mb-3">Contact Support</h4>
                                <p className="text-brandBlack/60">Need technical assistance? Email us at <span className="text-brandPurple font-bold italic">hello@klasso.app</span></p>
                            </section>
                        </div>
                    )
                };
            case 'about':
                return {
                    icon: BookOpen,
                    title: "Our Story",
                    subtitle: "Built for African private schools",
                    content: (
                        <div className="space-y-8">
                            <p className="text-lg font-medium italic">"We wanted to bring absolute calm to school administration."</p>
                            <p className="text-brandBlack/60 leading-relaxed">Klasso was founded with a singular focus: to modernize school portals for primary and secondary private schools in Nigeria. By offering isolated multi-tenant dashboards, we help administrators streamline report cards, secure CBT exams, and manage collections beautifully.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-cream rounded-2xl">
                                    <div className="text-3xl font-black text-brandPurple">150+</div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-brandBlack/40">Private Schools</div>
                                </div>
                                <div className="p-4 bg-cream rounded-2xl">
                                    <div className="text-3xl font-black text-brandYellow">100k+</div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-brandBlack/40">Students Enrolled</div>
                                </div>
                            </div>
                        </div>
                    )
                };
            case 'cookie':
                return {
                    icon: Cookie,
                    title: "Cookie Policy",
                    subtitle: "Preserving your session security",
                    content: (
                        <div className="space-y-8 text-brandBlack/60 leading-relaxed">
                            <p>We use essential cookies to maintain secure sessions in your school tenant portal. These cookies keep you logged into the correct dashboard and protect dashboard state during CBT exams.</p>
                            <p>By using Klasso, you agree to our use of these session cookies to ensure operational integrity.</p>
                        </div>
                    )
                };
            default:
                return null;
        }
    };

    const data = getContent();
    if (!data) return null;

    const Icon = data.icon;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-brandBlack/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden transition-all duration-500 transform ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
                    }`}
            >
                {/* Header Backdrop Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brandPurple/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                {/* Header */}
                <div className="relative p-8 md:p-12 pb-6 flex justify-between items-start border-b border-brandBlack/5">
                    <div className="flex gap-6">
                        <div className="w-16 h-16 bg-brandBlack text-white rounded-3xl flex items-center justify-center shadow-lg transform -rotate-6">
                            <Icon size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-1.5">{data.title}</h2>
                            <p className="text-sm font-bold text-brandBlack/30 italic">{data.subtitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-brandBlack/5 rounded-xl transition-colors text-brandBlack/20 hover:text-brandBlack"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-8 md:p-12 pt-8 max-h-[60vh] overflow-y-auto scrollbar-hide font-sans">
                    {data.content}
                </div>

                {/* Footer */}
                <div className="p-8 md:p-10 pt-6 bg-cream/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs font-bold text-brandBlack/40">© 2026 klasso.app. All rights reserved.</p>
                    <button
                        onClick={onClose}
                        className="w-full md:w-auto bg-brandBlack text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-brandPurple transition-all transform active:scale-95"
                    >
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </div>
    );
};
