import { Section } from './Section';
import { AlertCircle, Calendar, CreditCard } from 'lucide-react';

export const ProblemSection = () => {
    const problems = [
        {
            icon: AlertCircle,
            title: "Admin Overhead",
            desc: "Managing attendance, schedules, and curriculum documents across disjointed spreadsheets and WhatsApp groups consumes hours daily.",
            color: "bg-red-500/10 text-red-600 border-red-200"
        },
        {
            icon: Calendar,
            title: "Report Card Delays",
            desc: "Manually calculating grades, CBT scores, and teachers' remarks takes weeks of stressful work at the end of every school term.",
            color: "bg-brandPurple/10 text-brandPurple border-brandPurple/20"
        },
        {
            icon: CreditCard,
            title: "Fee Collection Gaps",
            desc: "Tracking school fees, handling payment plans, and writing paper receipts leads to bookkeeping errors and cash flow delays.",
            color: "bg-brandYellow/10 text-brandYellow border-brandYellow/20"
        }
    ];

    return (
        <Section className="bg-white py-32 border-y-2 border-brandBlack/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-brandPurple font-bold uppercase tracking-widest text-xs block">
                        School Admin Stress
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold mt-4 leading-tight text-brandBlack">
                        Running a school is <span className="text-red-500">complex.</span>
                    </h2>
                    <p className="mt-4 text-brandBlack/60 font-medium text-lg">
                        Every proprietor we spoke to said the same thing — too many tools, too little time.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-visible">
                    {problems.map((problem, i) => (
                        <div
                            key={i}
                            className="p-10 pt-8 rounded-[32px] border-4 border-brandBlack bg-white shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                        >
                            <div className={`w-16 h-16 ${problem.color} border-2 border-brandBlack rounded-2xl flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)]`}>
                                <problem.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-black uppercase mb-4 text-brandBlack">{problem.title}</h3>
                            <p className="text-brandBlack/60 font-medium leading-relaxed">
                                {problem.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};
