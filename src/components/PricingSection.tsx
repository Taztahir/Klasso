import { useNavigate } from 'react-router-dom';
import { Section } from './Section';
import { Check } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { useAuth } from '../context/AuthContext';
import { motion, useReducedMotion } from 'framer-motion';

export const PricingSection = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const shouldReduce = useReducedMotion();

    const handleCtaClick = () => {
        if (user) {
            navigate('/settings');
        } else {
            navigate('/signup');
        }
    };

    const plans = [
        {
            id: 'starter',
            name: 'Starter Plan',
            price: '₦15,000',
            period: '/month',
            desc: 'Perfect for small and growing schools.',
            features: ['Up to 100 students', 'Core Class Notes module', 'Basic CBT Exams', 'Printable Report Cards', 'Email Support'],
            color: 'bg-white',
            btnColor: 'bg-brandBlack text-white',
            cta: 'Start Trial'
        },
        {
            id: 'growth',
            name: 'Growth Plan',
            price: '₦35,000',
            period: '/month',
            desc: 'Ideal for mid-sized private schools.',
            features: ['Up to 300 students', 'Assignments & Lesson Notes', 'CBT with anti-cheat tools', 'CBE competency tracking', 'Paystack fee invoicing', 'Priority Support'],
            color: 'bg-brandPurple/10 border-brandPurple',
            btnColor: 'bg-brandPurple text-white',
            cta: 'Start Trial',
            popular: true
        },
        {
            id: 'standard',
            name: 'Standard Plan',
            price: '₦60,000',
            period: '/month',
            desc: 'For established private institutions.',
            features: ['Up to 700 students', 'Everything in Growth', 'Automated balance tracking', 'Priority CBT server priority', 'Custom school domain setup', '24/7 Phone Support'],
            color: 'bg-brandYellow/10 border-brandYellow',
            btnColor: 'bg-brandYellow text-brandBlack',
            cta: 'Start Trial'
        }
    ];

    const cardVariants = {
        hidden: { opacity: 0, y: shouldReduce ? 0 : 35, scale: shouldReduce ? 1 : 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 90, damping: 15 } }
    };

    return (
        <Section id="pricing" className="bg-cream py-32 px-6 text-brandBlack">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <motion.span variants={cardVariants} className="text-brandPurple font-bold uppercase tracking-widest text-xs block">Pricing Plans</motion.span>
                    <motion.h2 variants={cardVariants} className="text-4xl md:text-6xl font-bold mt-4 mb-4">Choose Your School's Tier</motion.h2>
                    <motion.p variants={cardVariants} className="text-lg text-brandBlack/60 font-bold italic">Flat monthly rates based on student count. No hidden fees.</motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            className={`relative p-8 rounded-[40px] border-4 border-brandBlack shadow-[12px_12px_0px_0px_rgba(24,24,27,1)] flex flex-col ${plan.color} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all`}
                        >
                            {plan.popular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brandPurple text-white px-4 py-1 rounded-full text-xs font-bold border-2 border-brandBlack">
                                    MOST POPULAR
                                </span>
                            )}
                            <div className="mb-8">
                                <h3 className="text-2xl font-black uppercase mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold italic">{plan.price}</span>
                                    {plan.period && <span className="text-sm font-bold opacity-40 uppercase">{plan.period}</span>}
                                </div>
                                <p className="text-sm font-medium opacity-60 mt-2">{plan.desc}</p>
                            </div>

                            <ul className="space-y-4 mb-12 flex-1">
                                {plan.features.map((feature, fi) => (
                                    <li key={fi} className="flex items-center gap-3 text-sm font-bold">
                                        <div className="w-5 h-5 rounded-full bg-brandGreen/20 flex items-center justify-center border border-brandGreen/30">
                                            <Check className="w-3 h-3 text-brandGreen" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <MagneticButton
                                onClick={handleCtaClick}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest border-2 border-brandBlack transition-all ${plan.btnColor}`}
                            >
                                {user ? 'Go to Settings' : plan.cta}
                            </MagneticButton>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
};
