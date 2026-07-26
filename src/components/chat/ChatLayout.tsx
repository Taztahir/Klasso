import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const ChatLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#FDFCF9] text-brandBlack overflow-hidden font-sans selection:bg-brandPurple/10 selection:text-brandPurple">
            {/* Sidebar Stage */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className="flex-1 relative flex flex-col min-w-0 h-full overflow-hidden">
                {/* Floating Navigation Tier */}
                <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

                {/* Main Content Workspace */}
                <div className="flex-1 relative flex flex-col min-h-0 px-4 lg:px-8 pb-4 lg:pb-8">

                    {/* The Content Canvas: A recessed area for the actual chat/settings */}
                    <div className="flex-1 relative bg-white/40 backdrop-blur-sm border border-brandBlack/[0.03] rounded-[32px] overflow-hidden flex flex-col shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)] transition-all duration-500">

                        {/* Dynamic Background Glows - Layered behind the Outlet */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[32px]">
                            {/* Top Right Purple Glow */}
                            <div className="absolute -top-[10%] -right-[5%] w-[45%] h-[45%] bg-brandPurple/5 blur-[80px] rounded-full animate-pulse-slow" />

                            {/* Bottom Left Yellow/Cream Glow */}
                            <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-[#FFDE03]/5 blur-[70px] rounded-full animate-pulse-slow delay-700" />

                            {/* Center Subtle Wash */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-transparent via-brandPurple/[0.01] to-transparent blur-3xl opacity-50" />
                        </div>

                        {/* Route Content Area */}
                        <div className="flex-1 relative z-10 flex flex-col min-h-0">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </main>

            {/* Global Style Injector for Animations */}
            <style jsx global>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                /* Hide scrollbars but keep functionality */
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};