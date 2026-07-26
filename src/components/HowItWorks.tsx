import { Upload, Cpu, GraduationCap } from 'lucide-react';
import { Section } from './Section';

export const HowItWorks = () => {
    const steps = [
        {
            icon: Upload,
            title: "Register Your School Portal",
            description: "Create an isolated tenant dashboard under the klasso.app domain for your institution.",
            color: "brandYellow"
        },
        {
            icon: Cpu,
            title: "Invite Staff & Define Structure",
            description: "Easily set up your school classes, subjects, fee schedules, and invite teachers and parents.",
            color: "brandPurple"
        },
        {
            icon: GraduationCap,
            title: "Run Everything Calmly",
            description: "Manage CBT exams, auto-generate report cards, and collect fee payments via Paystack.",
            color: "brandGreen"
        }
    ];

    return (
        <Section id="how-it-works" className="py-32 bg-brandBlack text-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">
                        Go from scattered paper records and WhatsApp messages to a unified school portal in three simple steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className="relative p-8 rounded-3xl border border-white/10 hover:border-brandPurple/50 transition-all group"
                        >
                            <div className="absolute -top-6 -left-6 w-12 h-12 bg-white text-brandBlack rounded-full flex items-center justify-center font-bold text-xl border-4 border-brandBlack">
                                {i + 1}
                            </div>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border-2 border-white ${step.color === 'brandYellow' ? 'bg-brandYellow' :
                                step.color === 'brandPurple' ? 'bg-brandPurple' :
                                    'bg-brandGreen'
                                }`}>
                                <step.icon className="w-8 h-8 text-brandBlack" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                            <p className="text-white/60 leading-relaxed font-medium">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};
