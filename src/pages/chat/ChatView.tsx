import { useState, useRef, useEffect } from 'react';
import { Send, User, Paperclip } from 'lucide-react';
import { aiService } from '../../services/aiService';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const KlassoLogo = ({ size = "24" }: { size?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect x="8" y="8" width="84" height="84" rx="22" fill="#1E3A5F" />
        <rect x="28" y="26" width="10" height="48" rx="5" fill="#E8A838" />
        <path d="M38 50 L66 26" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
        <path d="M38 50 L66 74" stroke="#2A8C8C" strokeWidth="10" strokeLinecap="round" />
    </svg>
);

export const ChatView = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Rebranded suggestions for school portal / academic management assistance
    const suggestions = [
        "Create high school physics CBT questions",
        "Draft class notes for biology lesson",
        "Generate a CBE grading rubric",
        "Write template parent email for fees",
        "Plan terminal exam timetable"
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const chatHistory = [...messages, userMessage].map(m => ({
                role: m.role === 'user' ? 'user' as const : 'model' as const,
                content: m.content
            }));
            const responseText = await aiService.getChatResponse(chatHistory);
            
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm sorry, I encountered an error. Please try again.",
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-2xl mx-auto w-full relative">

            {/* Scrollable Chat Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-8">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-700">
                        <div className="mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-brandPurple/10 border border-brandBlack/5 flex items-center justify-center">
                                <KlassoLogo size="32" />
                            </div>
                        </div>

                        <h1 className="text-xl font-black text-brandBlack tracking-tighter italic uppercase text-center mb-1">
                            Klasso Assistant <span className="text-brandPurple">Active</span>
                        </h1>
                        <p className="text-[9px] font-bold text-brandBlack/25 uppercase tracking-[0.2em] mb-10 text-center">
                            Awaiting Parameters
                        </p>

                        {/* Minimalist Pill Suggestions */}
                        <div className="flex flex-wrap justify-center gap-2 max-w-md">
                            {suggestions.map((text, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(text)}
                                    className="px-4 py-2 rounded-full bg-white border border-brandBlack/5 text-[11px] font-black text-brandBlack/60 uppercase italic hover:border-brandPurple hover:text-brandPurple hover:shadow-sm transition-all active:scale-95"
                                >
                                    {text}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border ${m.role === 'assistant' ? 'bg-white border-brandBlack/5' : 'bg-brandBlack border-brandBlack'
                                    }`}>
                                    {m.role === 'assistant' ? <KlassoLogo size="16" /> : <User size={14} className="text-white" />}
                                </div>

                                <div className={`flex flex-col max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`
                                        px-4 py-3 rounded-2xl text-[13px] font-medium leading-relaxed
                                        ${m.role === 'assistant'
                                            ? 'bg-white text-brandBlack border border-brandBlack/5 rounded-tl-none shadow-sm'
                                            : 'bg-brandPurple text-white rounded-tr-none'
                                        }
                                    `}>
                                        {m.content}
                                    </div>
                                    <span className="mt-1.5 text-[8px] font-black text-brandBlack/20 uppercase tracking-widest italic">
                                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-xl bg-white border border-brandBlack/5 flex items-center justify-center shadow-sm">
                                    <KlassoLogo size="16" />
                                </div>
                                <div className="bg-white/50 px-4 py-3 rounded-2xl rounded-tl-none border border-brandBlack/5 flex gap-1 items-center">
                                    <div className="w-1 h-1 bg-brandPurple rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1 h-1 bg-brandPurple rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1 h-1 bg-brandPurple rounded-full animate-bounce" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-12" />
                    </div>
                )}
            </div>

            {/* Compact Input Tier */}
            <div className="px-6 pb-6 pt-2">
                <div className="relative">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                        className="relative flex items-center gap-2 bg-white border border-brandBlack/5 p-1.5 rounded-2xl shadow-lg transition-all focus-within:ring-2 ring-brandPurple/5"
                    >
                        <button type="button" className="p-2 text-brandBlack/30 hover:text-brandPurple transition-colors">
                            <Paperclip size={18} />
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a command..."
                            className="flex-1 bg-transparent py-2 text-brandBlack focus:outline-none placeholder:text-brandBlack/20 text-xs font-bold tracking-tight"
                        />

                        <div className="flex items-center gap-2 pr-1">
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="bg-brandPurple text-white p-2 rounded-xl disabled:opacity-20 transition-all hover:brightness-110 active:scale-95 shadow-md shadow-brandPurple/20"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};