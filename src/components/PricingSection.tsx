import { useNavigate } from 'react-router-dom';
import { Section } from './Section';
import { Check, Zap } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { useAuth } from '../context/AuthContext';

export const PricingSection = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

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
            popular: false,
            cta: 'Start Trial'
        },
        {
            id: 'growth',
            name: 'Growth Plan',
            price: '₦35,000',
            period: '/month',
            desc: 'Ideal for mid-sized private schools.',
            features: ['Up to 300 students', 'Assignments & Lesson Notes', 'CBT with anti-cheat tools', 'CBE competency tracking', 'Paystack fee invoicing', 'Priority Support'],
            popular: true,
            cta: 'Start Trial'
        },
        {
            id: 'standard',
            name: 'Standard Plan',
            price: '₦60,000',
            period: '/month',
            desc: 'For established private institutions.',
            features: ['Up to 700 students', 'Everything in Growth', 'Automated balance tracking', 'Priority CBT server priority', 'Custom school domain setup', '24/7 Phone Support'],
            popular: false,
            cta: 'Start Trial'
        }
    ];

    return (
        <Section id="pricing" className="bg-cream py-20 px-6 text-brandBlack">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <span className="text-brandPurple font-bold uppercase tracking-widest text-xs block">Pricing Plans</span>
                    <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-4 text-brandBlack">Choose Your School's Tier</h2>
                    <p className="text-lg text-brandBlack/60 font-bold italic">Flat monthly rates based on student count. No hidden fees.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative p-6 rounded-[40px] border-4 bg-white flex flex-col transition-all
                                ${plan.popular
                                    ? 'border-brandPurple ring-4 ring-brandPurple/30 ring-offset-2 scale-[1.04] hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                                    : 'border-brandBlack hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                                }`}
                        >
                            {plan.popular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brandPurple text-white px-5 py-1.5 rounded-full text-xs font-black border-2 border-brandBlack flex items-center gap-1.5 whitespace-nowrap">
                                    <Zap size={11} fill="currentColor" /> MOST POPULAR
                                </span>
                            )}
                            <div className="mb-8">
                                <h3 className="text-2xl font-black uppercase mb-2 text-brandBlack">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold italic text-brandBlack">{plan.price}</span>
                                    {plan.period && <span className="text-sm font-bold opacity-40 uppercase">{plan.period}</span>}
                                </div>
                                <p className="text-sm font-medium text-brandBlack/50 mt-2">{plan.desc}</p>
                            </div>

                            <ul className="space-y-4 mb-12 flex-1">
                                {plan.features.map((feature, fi) => (
                                    <li key={fi} className="flex items-center gap-3 text-sm font-bold text-brandBlack">
                                        <div className="w-5 h-5 rounded-full bg-brandGreen/20 flex items-center justify-center border border-brandGreen/30 shrink-0">
                                            <Check className="w-3 h-3 text-brandGreen" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <MagneticButton
                                onClick={handleCtaClick}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest border-2 transition-all
                                    ${plan.popular
                                        ? 'bg-brandPurple text-white border-brandPurple hover:brightness-110'
                                        : 'bg-brandBlack text-white border-brandBlack hover:bg-brandPurple hover:border-brandPurple'
                                    }`}
                            >
                                {user ? 'Go to Settings' : plan.cta}
                            </MagneticButton>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};
