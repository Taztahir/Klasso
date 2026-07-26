import { useState, useRef, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import {
    User,
    LogOut,
    Settings,
    Camera,
    ChevronDown,
    Grid,
    Bell,
    Crown,
    Zap,
    X,
    CheckCircle,
    Info,
    AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles } from 'lucide-react';


export const DashboardLayout = () => {
    const { user, uploadAvatar, signOut } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const { setTheme, isDarkMode } = useTheme();

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Fetch notifications and initial data
    useEffect(() => {
        setNotifications([
            {
                id: 1,
                title: 'Welcome to Gemini',
                message: 'Explore your new premium dashboard.',
                time: 'Just now',
                type: 'info',
            },
        ]);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleAvatarFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        showToast('Uploading...', 'Setting your new profile picture', 'info');
        const { error } = await uploadAvatar(file);
        if (error) {
            showToast('Upload Failed', error.message || 'Something went wrong', 'error');
        } else {
            showToast('Success!', 'Profile picture updated.', 'success');
        }
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [uploadAvatar, showToast]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const isPremium = user?.user_metadata?.is_premium;
    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
    const avatarUrl = user?.user_metadata?.avatar_url;
    const initials = (displayName[0] || 'U').toUpperCase();

    return (
        <div className={`flex h-screen bg-[var(--bg)] font-sans selection:bg-[var(--brand-purple)] selection:text-white text-[var(--text-primary)] overflow-hidden theme-dashboard ${isDarkMode ? 'dark' : ''}`}>

            {/* Always-present Sidebar */}
            <Sidebar
                isExpanded={isSidebarExpanded}
                onToggle={() => setIsSidebarExpanded(prev => !prev)}
            />

            {/* Main area */}
            <main
                className={`
                    flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[var(--bg)] relative
                    transition-[margin] duration-300 ease-in-out
                    ${isSidebarExpanded ? 'ml-72' : 'ml-[68px]'}
                `}
            >
                {/* ── Header ─────────────────────────────────────────── */}
                <header className="h-16 glass-panel border-b border-[var(--border)] flex items-center justify-between px-4 md:px-6 z-30 sticky top-0 flex-shrink-0">

                    {/* Left: App name */}
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-medium tracking-tight text-[var(--text-primary)]">
                            Gemini
                        </h1>
                    </div>

                    {/* Right: Action strip */}
                    <div className="flex items-center gap-3">

                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#1e1f20] hover:bg-[#2b2c2d] border border-[#444746] text-[#e3e3e3] rounded-full text-sm font-medium transition-all group cursor-pointer" onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}>
                             <div className="flex items-center gap-2">
                                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-400 to-purple-500">
                                    <Sparkles size={12} className="text-white fill-white" />
                                </div>
                                <span className="text-[13px]">Upgrade to Google AI Plus</span>
                             </div>
                        </div>

                        {/* Grid Toggle */}
                        <button className="p-2.5 rounded-full hover:bg-[var(--surface-hover)] transition-all text-[var(--text-muted)]">
                            <Grid size={20} />
                        </button>

                        {/* Space for right icons */}

                        {/* Profile Avatar + Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => { setIsProfileOpen(p => !p); setIsNotifOpen(false); }}
                                aria-label="Open profile menu"
                                aria-expanded={isProfileOpen}
                                aria-haspopup="true"
                                className={`flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-full border transition-all hover:shadow-premium ${isProfileOpen ? 'border-[var(--brand-purple)]/30 bg-[var(--brand-purple-soft)]' : 'border-[var(--border)] bg-[var(--surface)]'}`}
                            >
                                <div className={`w-8 h-8 rounded-full overflow-hidden bg-[var(--brand-purple)] flex items-center justify-center flex-shrink-0 relative ${uploading ? 'animate-pulse' : ''}`}>
                                    {avatarUrl
                                        ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                                        : <span className="text-white text-[11px] font-black">{initials}</span>
                                    }
                                </div>
                                <ChevronDown size={12} className={`text-[var(--text-muted)] transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div
                                    role="dialog"
                                    aria-label="Profile menu"
                                    className="absolute top-full right-0 mt-3 w-72 bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-float z-50 overflow-hidden animate-scale-up"
                                >
                                    {/* User info section */}
                                    <div className="p-5 border-b border-[var(--border-soft)] bg-gradient-to-br from-[var(--bg)] to-[var(--surface)] font-sans">
                                        <div className="flex items-center gap-4 mb-4">
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`w-14 h-14 rounded-full overflow-hidden bg-[var(--brand-purple)] flex items-center justify-center relative group flex-shrink-0 border-2 border-white dark:border-[var(--border)] shadow-md ${uploading ? 'animate-pulse' : ''}`}
                                            >
                                                {avatarUrl
                                                    ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                                                    : <span className="text-white text-base font-black">{initials}</span>
                                                }
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                                                    <Camera size={16} className="text-white" />
                                                </div>
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleAvatarFileChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-black text-sm text-[var(--text-primary)] truncate">{displayName}</p>
                                                <p className="text-[10px] font-medium text-[var(--text-muted)] truncate">{user?.email}</p>
                                            </div>
                                        </div>

                                        <div className={`flex items-center justify-between p-3 rounded-2xl ${isPremium ? 'bg-yellow-400/10 border border-yellow-400/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                            <div className="flex items-center gap-2">
                                                {isPremium ? <Crown className="w-4 h-4 text-yellow-600" /> : <Zap className="w-4 h-4 text-gray-400" />}
                                                <div>
                                                    <p className={`text-[10px] font-black uppercase tracking-widest ${isPremium ? 'text-yellow-700' : 'text-gray-500'}`}>
                                                        {isPremium ? 'Pro Scholar' : 'Free Tier'}
                                                    </p>
                                                    {!isPremium && <p className="text-[8px] font-bold text-gray-400 uppercase">Limited Features</p>}
                                                </div>
                                            </div>
                                            {!isPremium && (
                                                <button
                                                    onClick={() => { navigate('/dashboard/settings'); setIsProfileOpen(false); }}
                                                    className="px-3 py-1 bg-[var(--brand-purple)] text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-md shadow-purple-500/20"
                                                >
                                                    Upgrade
                                                </button>
                                            )}
                                        </div>
                                    </div>


                                    {/* Menu Items */}
                                    <div className="p-2">
                                        <button
                                            onClick={() => { navigate('/dashboard/settings'); setIsProfileOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[var(--surface-hover)] transition-colors text-left group"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-[var(--bg)] flex items-center justify-center group-hover:bg-[var(--brand-purple)]/10 transition-colors">
                                                <User size={16} className="text-[var(--text-muted)] group-hover:text-[var(--brand-purple)]" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-[var(--text-primary)]">Edit Profile</p>
                                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Profile Preferences</p>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => { navigate('/dashboard/settings'); setIsProfileOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[var(--surface-hover)] transition-colors text-left group"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-[var(--bg)] flex items-center justify-center group-hover:bg-[var(--brand-purple)]/10 transition-colors">
                                                <Settings size={16} className="text-[var(--text-muted)] group-hover:text-[var(--brand-purple)]" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-[var(--text-primary)]">Settings</p>
                                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Account & Security</p>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Sign Out */}
                                    <div className="p-2 border-t border-[var(--border-soft)]">
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-colors group"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-colors">
                                                <LogOut size={16} className="text-red-400" />
                                            </div>
                                            <p className="text-xs font-black">Sign Out</p>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-transparent">
                    <Outlet />
                </div>
            </main>

            {/* ── Notification Drawer (Gemini Style) ───────────────── */}
            <div
                className={`fixed inset-y-0 right-0 w-80 md:w-96 glass-panel border-l border-[var(--border)] z-[60] shadow-float transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isNotifOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Drawer Header */}
                    <div className="px-6 py-6 border-b border-[var(--border)] flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-black text-[var(--text-primary)] tracking-tight">Updates & Activity</h2>
                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Your study notifications</p>
                        </div>
                        <button
                            onClick={() => setIsNotifOpen(false)}
                            className="p-2 rounded-full hover:bg-[var(--surface-hover)] transition-all"
                            aria-label="Close notifications"
                        >
                            <X size={18} className="text-[var(--text-muted)]" />
                        </button>
                    </div>

                    {/* Drawer Body */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <div key={n.id} className="p-4 rounded-3xl bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] border border-[var(--border)] hover:border-[var(--brand-purple)]/20 transition-all group cursor-default">
                                    <div className="flex gap-4">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${n.type === 'success' ? 'bg-green-100/50 text-green-600' : n.type === 'info' ? 'bg-indigo-100/50 text-indigo-600' : 'bg-red-100/50 text-red-600'}`}>
                                            {n.type === 'success' ? <CheckCircle size={16} /> : n.type === 'info' ? <Info size={16} /> : <AlertCircle size={16} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-xs font-black text-[var(--text-primary)] truncate">{n.title}</p>
                                                <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{n.time}</span>
                                            </div>
                                            <p className="text-[10px] font-medium text-[var(--text-secondary)] leading-relaxed">{n.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
                                <div className="w-16 h-16 rounded-3xl bg-[var(--surface-hover)] flex items-center justify-center">
                                    <Bell size={24} className="text-[var(--text-muted)]" />
                                </div>
                                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">No notifications</p>
                            </div>
                        )}
                    </div>

                    {/* Drawer Footer */}
                    <div className="p-6 border-t border-[var(--border)]">
                        <button
                            onClick={() => setIsNotifOpen(false)}
                            className="w-full py-3 bg-[var(--surface-hover)] text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[var(--border)] transition-all active:scale-95"
                        >
                            Mark all as read
                        </button>
                    </div>
                </div>
            </div>

            {/* Click-outside backdrop */}
            {isNotifOpen && (
                <div
                    onClick={() => setIsNotifOpen(false)}
                    className="fixed inset-0 bg-black/5 dark:bg-black/40 backdrop-blur-[2px] z-[55] animate-fade-in"
                />
            )}
        </div>
    );
};

