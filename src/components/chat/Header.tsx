import { useLocation } from 'react-router-dom';
import { Menu, Bell, Flame, Shield, User as UserIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
    onOpenSidebar: () => void;
}

export const Header = ({ onOpenSidebar }: HeaderProps) => {
    const { user } = useAuth();
    const location = useLocation();

    // const currentSection = location.pathname.includes('settings') ? 'Settings' : 'AI Chat';

    return (
        <header className="sticky top-0 z-30 px-6 lg:px-10 py-5 pointer-events-none">
            <div className="flex items-center justify-between pointer-events-auto">

                {/* LEFT SIDE: Minimal Page Branding */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onOpenSidebar}
                        className="lg:hidden p-2.5 bg-white border border-brandBlack/5 text-brandBlack shadow-sm rounded-xl active:scale-95 transition-all"
                    >
                        <Menu size={20} />
                    </button>

                    {/* <div className="hidden sm:block">
                        <h1 className="text-xl font-black text-brandBlack italic uppercase tracking-tighter leading-none">
                            {currentSection}
                        </h1>
                        <div className="flex items-center gap-1 mt-1 opacity-30">
                            <div className="w-1 h-1 rounded-full bg-brandPurple animate-pulse" />
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">System Active</span>
                        </div>
                    </div> */}
                </div>

                {/* RIGHT SIDE: The Unified Command Dock */}
                <div className="flex items-center p-1.5 bg-white/40 backdrop-blur-3xl border border-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] rounded-[26px]">

                    {/* Stat Group: Streak & Plan */}
                    <div className="hidden md:flex items-center gap-1 px-2">
                        <div className="flex items-center gap-2 px-3 py-2 hover:bg-white/60 rounded-2xl transition-colors cursor-default group">
                            <Flame size={15} className="text-orange-500 fill-orange-500/20 group-hover:animate-bounce" />
                            <span className="text-[11px] font-black text-brandBlack uppercase tracking-tight">5</span>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2 hover:bg-white/60 rounded-2xl transition-colors cursor-default group">
                            <Shield size={14} className="text-brandPurple group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-black text-brandPurple uppercase tracking-tight">Pro</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-6 bg-brandBlack/5 mx-1" />

                    {/* Notification Hub */}
                    <button className="relative p-3 text-brandBlack/40 hover:text-brandPurple transition-all group">
                        <Bell size={18} strokeWidth={2.5} className="group-hover:rotate-[15deg] transition-transform" />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-brandPurple rounded-full border-2 border-white shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                    </button>

                    {/* User Profile Card */}
                    <div className="flex items-center gap-3 pl-2 pr-1 py-1 ml-1 bg-white rounded-[20px] border border-brandBlack/5 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-[10px] font-black text-brandBlack uppercase italic leading-none group-hover:text-brandPurple transition-colors">
                                {user?.user_metadata?.full_name?.split(' ')[0] || 'Scholar'}
                            </span>
                            <span className="text-[8px] font-bold text-brandBlack/30 uppercase tracking-widest mt-1">
                                Rank #12
                            </span>
                        </div>

                        <div className="relative shrink-0">
                            <div className="w-9 h-9 rounded-[14px] bg-brandBlack flex items-center justify-center overflow-hidden border-2 border-white transition-transform group-hover:scale-105">
                                {user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon size={16} className="text-white/70" />
                                )}
                            </div>
                            <div className="absolute -bottom-1 -left-1 bg-brandPurple text-white rounded-full p-0.5 border-2 border-white">
                                <ChevronDown size={8} strokeWidth={4} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};