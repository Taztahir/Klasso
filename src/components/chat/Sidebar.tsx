import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Settings, LogOut, ChevronLeft, ChevronRight, User, X, Brain } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const menuItems = [
        { id: 'chat', label: 'AI Chat', icon: MessageSquare, path: '/chat' },
        { id: 'quiz', label: 'Quiz Hub', icon: Brain, path: '/quiz' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    ];

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <>
            {/* Backdrop for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-brandBlack/40 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 lg:relative lg:flex
                bg-white/80 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                flex flex-col m-0 lg:m-4 lg:rounded-3xl border border-brandBlack/5 shadow-2xl shadow-brandBlack/5
                ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'}
            `}>

                {/* Desktop Toggle Button - Floating Style */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="hidden lg:flex absolute -right-4 top-12 bg-brandPurple text-white rounded-xl p-1.5 shadow-lg shadow-brandPurple/40 hover:scale-110 active:scale-95 transition-all z-50"
                >
                    {isOpen ? <ChevronLeft size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
                </button>

                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden absolute right-6 top-6 p-2 rounded-full bg-brandBlack/5 text-brandBlack/40 hover:text-brandPurple"
                >
                    <X size={20} />
                </button>

                {/* Logo Area */}
                <div className={`p-8 mb-4 flex items-center ${isOpen ? 'justify-start' : 'justify-center'}`}>
                    <Link to="/" className="group flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                            <svg className="group-hover:rotate-12 transition-transform duration-500" width={isOpen ? "36" : "32"} height={isOpen ? "36" : "32"} viewBox="0 0 100 100" fill="none">
                                <rect x="10" y="10" width="80" height="80" rx="24" fill="#7C3AED" />
                                <circle cx="50" cy="50" r="18" fill="#FFDE03" />
                                <path d="M35 65C35 65 42 58 50 58C58 58 65 65 65 65" stroke="white" strokeWidth="6" strokeLinecap="round" />
                            </svg>
                            <div className="absolute -inset-1 bg-brandPurple/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {isOpen && (
                            <span className="font-black tracking-tighter text-brandBlack text-xl uppercase italic leading-none">
                                Study<span className="text-brandPurple">lite</span>
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                onClick={() => { if (window.innerWidth < 1024) setIsOpen(false); }}
                                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group overflow-hidden ${isActive
                                    ? 'text-white'
                                    : 'text-brandBlack/40 hover:text-brandPurple'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-brandPurple shadow-inner animate-in fade-in zoom-in duration-300" />
                                )}

                                <Icon size={20} className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />

                                {isOpen && (
                                    <span className="relative z-10 font-bold text-[14px] uppercase tracking-wide">
                                        {item.label}
                                    </span>
                                )}

                                {!isOpen && isActive && (
                                    <div className="absolute right-0 w-1 h-6 bg-white rounded-l-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section - Enhanced Card style */}
                <div className="p-4 mt-auto space-y-3">
                    <div className={`
                        flex items-center gap-3 p-2 rounded-2xl transition-all duration-300
                        ${isOpen ? 'bg-brandBlack/5 hover:bg-brandBlack/10' : 'justify-center'}
                    `}>
                        <div className="relative group shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-brandPurple/10 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                                {user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={18} className="text-brandPurple" />
                                )}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        </div>

                        {isOpen && (
                            <div className="min-w-0">
                                <p className="text-[11px] font-black text-brandBlack truncate uppercase tracking-tighter italic">
                                    {user?.user_metadata?.full_name || 'The Student'}
                                </p>
                                <p className="text-[9px] font-bold text-brandBlack/40 truncate uppercase tracking-widest">
                                    {user?.email?.split('@')[0]}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSignOut}
                        className={`
                            w-full flex items-center gap-4 px-4 py-3 rounded-2xl 
                            text-red-500 hover:bg-red-50 transition-all 
                            font-black text-[12px] uppercase tracking-tighter
                            ${!isOpen && 'justify-center'}
                        `}
                    >
                        <LogOut size={20} className="shrink-0" />
                        {isOpen && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};