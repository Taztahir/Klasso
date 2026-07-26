import { useState } from 'react';
import { 
    Brain, 
    Sparkles, 
    ChevronRight, 
    GraduationCap, 
    Timer, 
    Command, 
    ArrowRight, 
    Zap, 
    Target 
} from 'lucide-react';

export const QuizView = () => {
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState<'casual' | 'scholar' | 'genius'>('casual');

    const categories = [
        { id: 'math', title: 'Mathematics', questions: 12, icon: 'Math' },
        { id: 'bio', title: 'Biology', questions: 8, icon: 'Bio' },
        { id: 'hist', title: 'History', questions: 15, icon: 'Hist' },
        { id: 'chem', title: 'Chemistry', questions: 10, icon: 'Chem' }
    ];

    const handleStartQuiz = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Starting ${difficulty} quiz on: ${topic}`);
        // Logic to trigger AI quiz generation
    };

    return (
        <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto py-6 lg:py-10 px-4 lg:px-6 overflow-y-auto no-scrollbar">
            
            {/* Minimalist Challenge Engine Header */}
            <div className="text-center mb-12 animate-in fade-in zoom-in duration-700">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-[24px] bg-white shadow-2xl shadow-brandPurple/20 border border-brandBlack/5 mb-6 group hover:rotate-6 transition-transform">
                    <Brain className="text-brandPurple group-hover:scale-110 transition-transform" size={32} />
                </div>
                <h1 className="text-3xl font-black text-brandBlack tracking-tighter italic uppercase mb-2">
                    Challenge <span className="text-brandPurple">Engine</span>
                </h1>
                <p className="text-[10px] font-bold text-brandBlack/30 uppercase tracking-[0.3em]">
                    Define your subject • Master the concept
                </p>
            </div>

            {/* Main Interaction Area (The Generator) */}
            <form onSubmit={handleStartQuiz} className="w-full max-w-2xl mx-auto space-y-8 mb-16 animate-in slide-in-from-bottom-4 duration-500 delay-150">

                {/* Topic Input Bar */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-brandPurple/5 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <div className="relative flex items-center bg-white border-2 border-brandBlack/5 p-2 rounded-[30px] shadow-xl transition-all focus-within:border-brandPurple/30">
                        <div className="pl-4 pr-2 text-brandBlack/20">
                            <Target size={20} />
                        </div>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="What should I quiz you on today?"
                            className="flex-1 bg-transparent py-4 text-brandBlack focus:outline-none placeholder:text-brandBlack/20 text-sm font-black uppercase italic tracking-tight"
                        />
                        <button
                            type="submit"
                            disabled={!topic.trim()}
                            className="bg-brandBlack text-white p-4 rounded-full disabled:opacity-10 transition-all hover:bg-brandPurple hover:scale-105 active:scale-95 shadow-lg shadow-brandPurple/20"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Settings Tier */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">

                    {/* Level Selector */}
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-brandBlack/30 uppercase tracking-widest italic">Level:</span>
                        <div className="flex gap-1 p-1 bg-white border border-brandBlack/5 rounded-2xl shadow-sm">
                            {(['casual', 'scholar', 'genius'] as const).map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => setDifficulty(d)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${difficulty === d
                                            ? 'bg-brandPurple text-white shadow-lg shadow-brandPurple/20'
                                            : 'text-brandBlack/40 hover:text-brandBlack hover:bg-brandBlack/5'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Hint */}
                    <div className="flex items-center gap-2 text-brandBlack/20">
                        <Command size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Enter to deploy</span>
                    </div>
                </div>
            </form>

            {/* Quick Stats (From Original Hub) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                {[
                    { label: 'Avg Score', value: '84%', icon: GraduationCap, color: 'text-brandPurple' },
                    { label: 'Quizzes Done', value: '24', icon: Sparkles, color: 'text-orange-500' },
                    { label: 'Study Time', value: '12h', icon: Timer, color: 'text-blue-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-brandBlack/5 p-4 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-brandBlack/20 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-lg font-black text-brandBlack italic uppercase tracking-tighter">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Selection Grid (Categories) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black text-brandBlack uppercase tracking-[0.2em] italic">Pick a Domain</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className="group bg-white border border-brandBlack/5 p-6 rounded-[24px] shadow-sm hover:shadow-xl hover:border-brandPurple/20 transition-all text-left relative overflow-hidden active:scale-[0.98]"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity rotate-12 group-hover:rotate-0 transform duration-500">
                                <Brain size={80} strokeWidth={1} />
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-brandPurple/5 text-brandPurple text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                    {cat.questions} Questions
                                </span>
                                <ChevronRight size={16} className="text-brandBlack/10 group-hover:text-brandPurple transition-colors" />
                            </div>

                            <h3 className="text-xl font-black text-brandBlack uppercase italic tracking-tighter mb-1 select-none">
                                {cat.title}
                            </h3>
                            <p className="text-[10px] font-bold text-brandBlack/30 uppercase tracking-widest select-none">
                                Tap to begin session
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Background Decorative Element */}
            <div className="fixed bottom-0 right-0 p-10 pointer-events-none opacity-[0.02]">
                <Zap size={400} strokeWidth={1} className="text-brandBlack" />
            </div>
        </div>
    );
};
