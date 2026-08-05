'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Section } from './Section';
import { Check, Zap, HelpCircle } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const PricingSection = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [isAnnual, setIsAnnual] = useState(false);

    const handleCtaClick = () => {
        if (user) {
            router.push('/settings');
        } else {
            router.push('/signup');
        }
    };

    const plans = [
        {
            id: 'starter',
            name: 'Starter Plan',
            priceMonthly: '₦15,000',
            priceAnnual: '₦12,000',
            period: '/mo',
            desc: 'For small and growing schools.',
            features: [
                'Up to 100 students',
                'Core Class Notes module',
                'Basic CBT Exams',
                'Printable Report Cards',
                'Email Support'
            ],
            popular: false,
            cta: 'Start Free Trial'
        },
        {
            id: 'growth',
            name: 'Growth Plan',
            priceMonthly: '₦35,000',
            priceAnnual: '₦28,000',
            period: '/mo',
            desc: 'For mid-sized private schools.',
            features: [
                'Up to 300 students',
                'Assignments & Lesson Notes',
                'CBT with anti-cheat tools',
                'CBE competency tracking',
                'Paystack fee invoicing',
                'Priority Support'
            ],
            popular: true,
            cta: 'Start Free Trial'
        },
        {
            id: 'standard',
            name: 'Standard Plan',
            priceMonthly: '₦60,000',
            priceAnnual: '₦48,000',
            period: '/mo',
            desc: 'For established private institutions.',
            features: [
                'Up to 700 students',
                'Everything in Growth',
                'Automated balance tracking',
                'Priority CBT server access',
                'Custom school domain setup',
                '24/7 Phone Support'
            ],
            popular: false,
            cta: 'Start Free Trial'
        }
    ];

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 260, damping: 20 }
        }
    };

    return (
        <Section id="pricing" className="bg-cream pt-28 max-lg:px-4 text-brandBlack overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Header Animation */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b-2 border-brandBlack/10 gap-4"
                >
                    <div>
                        <span className="text-brandPurple font-black uppercase tracking-wider text-xs block mb-1">
                            Pricing Tiers
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-brandBlack tracking-tight">
                            Simple, Predictable School Billing
                        </h2>
                    </div>

                    {/* Low-profile Toggle Switch */}
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border-2 border-brandBlack shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] self-start md:self-auto">
                        <span className={`text-xs font-bold transition-colors duration-200 ${!isAnnual ? 'text-brandBlack' : 'text-brandBlack/50'}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="w-11 h-6 bg-brandBlack rounded-full p-1 relative transition-colors focus:outline-none"
                            aria-label="Toggle annual pricing"
                        >
                            <motion.div
                                className="w-4 h-4 bg-brandYellow rounded-full"
                                animate={{ x: isAnnual ? 20 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={`text-xs font-bold flex items-center gap-1 transition-colors duration-200 ${isAnnual ? 'text-brandBlack' : 'text-brandBlack/50'}`}>
                            Annual
                            <motion.span
                                animate={{ scale: isAnnual ? [1, 1.15, 1] : 1 }}
                                transition={{ duration: 0.3 }}
                                className="text-[10px] bg-brandPurple/10 text-brandPurple font-black px-1.5 py-0.5 rounded"
                            >
                                20% OFF
                            </motion.span>
                        </span>
                    </div>
                </motion.div>

                {/* Staggered Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch"
                >
                    {plans.map((plan) => (
                        <motion.div
                            key={plan.id}
                            variants={cardVariants}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            className={`relative bg-white rounded-2xl p-5 border-2 flex flex-col justify-between transition-shadow duration-200 ${plan.popular
                                ? 'border-brandPurple shadow-[6px_6px_0px_0px_rgba(168,85,247,1)] ring-2 ring-brandPurple/20'
                                : 'border-brandBlack shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                }`}
                        >
                            {/* Card Top Section */}
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                        <h3 className="text-lg font-black uppercase text-brandBlack tracking-wide">
                                            {plan.name}
                                        </h3>
                                        <p className="text-xs font-medium text-brandBlack/60">
                                            {plan.desc}
                                        </p>
                                    </div>
                                    {plan.popular && (
                                        <motion.span
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.4, type: 'spring' }}
                                            className="bg-brandPurple text-white px-2.5 py-1 rounded-md text-[10px] font-black border border-brandBlack flex items-center gap-1 whitespace-nowrap shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                        >
                                            <Zap size={10} fill="currentColor" /> POPULAR
                                        </motion.span>
                                    )}
                                </div>

                                {/* Price Banner with Animated Transition */}
                                <div className="bg-cream/60 rounded-xl p-3 my-4 border border-brandBlack/10 flex items-baseline justify-between overflow-hidden">
                                    <div className="flex items-baseline gap-1">
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={isAnnual ? 'annual' : 'monthly'}
                                                initial={{ opacity: 0, y: -12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 12 }}
                                                transition={{ duration: 0.18, ease: 'easeOut' }}
                                                className="text-2xl font-black text-brandBlack inline-block"
                                            >
                                                {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                                            </motion.span>
                                        </AnimatePresence>
                                        <span className="text-xs font-bold text-brandBlack/50">
                                            {plan.period}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-brandBlack/40 uppercase">
                                        Billed {isAnnual ? 'Yearly' : 'Monthly'}
                                    </span>
                                </div>

                                {/* Feature List */}
                                <ul className="space-y-2 mb-6 text-xs font-bold text-brandBlack">
                                    {plan.features.map((feature, fi) => (
                                        <li key={fi} className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-brandGreen/20 flex items-center justify-center border border-brandGreen/40 shrink-0">
                                                <Check className="w-2.5 h-2.5 text-brandGreen stroke-[3]" />
                                            </div>
                                            <span className="truncate">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Action Button */}
                            <MagneticButton
                                onClick={handleCtaClick}
                                className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${plan.popular
                                    ? 'bg-brandPurple text-white border-brandBlack hover:brightness-110'
                                    : 'bg-brandBlack text-white border-brandBlack hover:bg-brandPurple'
                                    }`}
                            >
                                {user ? 'Go to Settings' : plan.cta}
                            </MagneticButton>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer Note Animation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="mt-6 text-center text-xs font-bold text-brandBlack/50 flex items-center justify-center gap-1.5"
                >
                    <HelpCircle size={14} />
                    <span>Need custom student capacity beyond 700? Contact our support team for Enterprise terms.</span>
                </motion.div>
            </div>
        </Section>
    );
};