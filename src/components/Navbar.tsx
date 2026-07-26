import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const KlassoLogo = () => (
    <svg aria-hidden="true" width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="84" height="84" rx="22" fill="#1E3A5F" />
        <rect x="28" y="26" width="10" height="48" rx="5" fill="#E8A838" />
        <path d="M38 50 L66 26" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" />
        <path d="M38 50 L66 74" stroke="#2A8C8C" stroke-width="10" stroke-linecap="round" />
    </svg>
);

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className="sticky top-0 z-50 bg-cream backdrop-blur-md border-b border-brandBlack/5 shadow-sm">
            <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between" aria-label="Main navigation">
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-3 font-bold text-xl tracking-tight text-brandPurple">
                        <KlassoLogo />
                        Klasso
                    </Link>
                    <div className="hidden lg:flex items-center gap-8">
                        <a href="#about" className="text-sm font-medium text-brandBlack/70 hover:text-brandPurple transition-colors">About</a>
                        <a href="#pricing" className="text-sm font-medium text-brandBlack/70 hover:text-brandPurple transition-colors">Pricing</a>
                        <a href="#how-it-works" className="text-sm font-medium text-brandBlack/70 hover:text-brandPurple transition-colors">How It Works</a>
                        <a href="#testimonials" className="text-sm font-medium text-brandBlack/70 hover:text-brandPurple transition-colors">Reviews</a>
                        <a href="#contact" className="text-sm font-medium text-brandBlack/70 hover:text-brandPurple transition-colors">Contact</a>
                    </div>
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/chat"
                                className="bg-brandPurple text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:brightness-115 transition-all"
                            >
                                Go to Portal
                            </Link>
                            <button
                                onClick={async () => { await signOut(); navigate('/'); }}
                                className="flex items-center gap-2 p-2 text-brandBlack/60 hover:text-red-500 transition-colors text-sm font-medium"
                                title="Log Out"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden xl:inline">Log Out</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-semibold text-brandBlack/70 hover:text-brandPurple transition-colors">
                                Log In
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-brandYellow text-brandBlack border-2 border-brandBlack px-6 py-2.5 rounded-full text-sm font-bold hover:bg-brandPurple hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            >
                                Start Free Trial
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden p-2 text-brandBlack hover:bg-brandBlack/5 rounded-lg transition-colors"
                    onClick={toggleMenu}
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                    aria-controls="mobile-menu"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                id="mobile-menu"
                className={`
                    lg:hidden fixed inset-x-0 top-20 bg-white border-b border-brandBlack/10 transition-all duration-300 ease-in-out z-40
                    ${isOpen ? 'opacity-100 translate-y-0 shadow-lg' : 'opacity-0 -translate-y-4 pointer-events-none'}
                `}
            >
                <div className="px-6 py-10 flex flex-col gap-8 max-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="flex flex-col gap-5">
                        <a href="#features" onClick={toggleMenu} className="text-xl font-bold text-brandPurple hover:text-brandGreen transition-colors">Features</a>
                        <a href="#pricing" onClick={toggleMenu} className="text-xl font-bold text-brandPurple hover:text-brandGreen transition-colors">Pricing</a>
                        <a href="#how-it-works" onClick={toggleMenu} className="text-xl font-bold text-brandPurple hover:text-brandGreen transition-colors">How It Works</a>
                        <a href="#testimonials" onClick={toggleMenu} className="text-xl font-bold text-brandPurple hover:text-brandGreen transition-colors">Reviews</a>
                        <a href="#contact" onClick={toggleMenu} className="text-xl font-bold text-brandPurple hover:text-brandGreen transition-colors">Contact</a>
                    </div>
                    <div className="pt-6 border-t border-brandBlack/5 flex flex-col gap-3">
                        {user ? (
                            <Link to="/chat" onClick={toggleMenu} className="bg-brandPurple text-white px-6 py-4 rounded-xl text-center font-bold">
                                Go to Portal
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" onClick={toggleMenu} className="px-6 py-4 rounded-xl text-center font-bold border-2 border-brandPurple text-brandPurple">
                                    Log In
                                </Link>
                                <Link to="/signup" onClick={toggleMenu} className="bg-brandYellow text-brandBlack border-2 border-brandBlack px-6 py-4 rounded-full text-center font-bold">
                                    Start Free Trial
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
