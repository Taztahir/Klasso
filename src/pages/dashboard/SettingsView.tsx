import React, { useState } from 'react';
import {
    User,
    Settings as SettingsIcon,
    CreditCard,
    Zap,
    ChevronRight,
    Sparkles,
    Trash2,
    ShieldCheck,
    Palette,
    LogOut,
    ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';

export const SettingsView = () => {
    const { user, updateProfile, uploadAvatar, deleteAccount, signOut } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || '');
    const [lastName, setLastName] = useState(user?.user_metadata?.last_name || '');
    const [username, setUsername] = useState(user?.user_metadata?.username || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingAvatar(true);
        try {
            const { error } = await uploadAvatar(file);
            if (error) {
                showToast('Upload Failed', error.message || 'Failed to upload image.', 'error');
            } else {
                showToast('Avatar Updated', 'Your new profile picture is live!', 'success');
            }
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const confirmProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isUpdating) return;

        setIsUpdating(true);
        try {
            const { error } = await updateProfile({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                username: username.trim(),
                full_name: `${firstName.trim()} ${lastName.trim()}`.trim()
            });
            if (error) {
                showToast('Update Failed', error.message, 'error');
            } else {
                showToast('Profile Updated', 'Your identity has been synchronized.', 'success');
                setIsProfileModalOpen(false);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const { error } = await deleteAccount();
            if (error) {
                showToast('Action Failed', 'Could not delete account. Try again later.', 'error');
            } else {
                showToast('Account Deleted', 'Everything has been wiped from our servers.', 'success');
                navigate('/');
            }
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const sections = [
        {
            title: 'Account',
            icon: User,
            items: [
                { label: 'Profile Information', desc: 'Name, email, and avatar', action: () => setIsProfileModalOpen(true), icon: User },
                { label: 'Security', desc: 'Password and authentication', action: () => showToast('Security', 'Password reset link sent.', 'success'), icon: ShieldCheck },
            ]
        },
        {
            title: 'Experience',
            icon: SettingsIcon,
            items: [
                { label: 'Visuals', desc: 'Themes and colors', action: () => showToast('Theme', 'System theme applied.', 'info'), icon: Palette },
                {
                    label: 'Privacy Mode',
                    desc: user?.user_metadata?.private_profile ? 'Hidden from Leaderboard' : 'Public Profile',
                    action: async () => {
                        const newState = !user?.user_metadata?.private_profile;
                        const { error } = await updateProfile({
                            private_profile: newState
                        });
                        if (error) {
                            showToast('Update Failed', error.message, 'error');
                        } else {
                            showToast('Privacy Updated', `Profile is now ${newState ? 'Private' : 'Public'}.`, 'success');
                        }
                    },
                    icon: ShieldCheck
                },
            ]
        },
        {
            title: 'Billing',
            icon: CreditCard,
            items: [
                { label: user?.user_metadata?.is_premium ? 'Manage Premium' : 'Upgrade to Premium', desc: 'Pro feature access', action: () => showToast('Billing', 'Paystack integration ready.', 'info'), icon: Sparkles },
                { label: 'Statements', desc: 'Recent history', action: () => showToast('History', 'No records found.', 'info'), icon: ExternalLink },
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-brandBlack">Settings</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Personalize your study experience</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[var(--border)] rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all shadow-sm"
                >
                    <LogOut size={14} /> Sign Out
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-[var(--border)] shadow-sm flex flex-col items-center text-center">
                        <div className="relative mb-5">
                            <input
                                type="file"
                                id="settings-avatar"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={isUploadingAvatar}
                            />
                            <label
                                htmlFor="settings-avatar"
                                className={`w-24 h-24 rounded-full border-4 border-[var(--brand-cream-dark)] flex items-center justify-center overflow-hidden shadow-sm relative cursor-pointer hover:scale-105 transition-all group ${isUploadingAvatar ? 'opacity-50' : ''}`}
                            >
                                {user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-brandPurple flex items-center justify-center text-white font-black text-2xl italic">
                                        {(username?.[0] || user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-brandBlack/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-white uppercase font-black">
                                    <Sparkles className="w-4 h-4 mb-1" />
                                    Edit Photo
                                </div>
                            </label>
                            {isUploadingAvatar && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-brandPurple border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-black text-brandBlack tracking-tighter">
                            {user?.user_metadata?.full_name || username || 'Academic'}
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">@{username || 'academic'}</p>
                        <p className="text-[9px] font-medium text-gray-300 mt-0.5">{user?.email}</p>

                        <div className="w-full h-px bg-gray-50 my-6"></div>

                        <div className="flex gap-2 justify-center">
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${user?.user_metadata?.is_premium
                                ? 'bg-[var(--brand-yellow)]/20 text-[var(--brand-yellow)] border-[var(--brand-yellow)]/20'
                                : 'bg-[var(--brand-cream-dark)] text-[var(--text-muted)] border-[var(--border)]'
                                }`}>
                                {user?.user_metadata?.is_premium ? 'Pro Member' : 'Free Tier'}
                            </div>
                            <div className="px-4 py-1.5 bg-[var(--brand-cream-dark)] text-[var(--text-muted)] rounded-full text-[10px] font-black uppercase tracking-widest border border-[var(--border)]">
                                ACTIVE
                            </div>
                        </div>
                    </div>

                    {/* Pro Card Overlay */}
                    {!user?.user_metadata?.is_premium && (
                        <div className="bg-[var(--brand-black)] rounded-2xl p-6 text-white relative overflow-hidden group shadow-lg">
                            <div className="relative z-10">
                                <Zap className="w-6 h-6 text-[var(--brand-yellow)] mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-black tracking-tight">Access Pro features</h3>
                                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1 mb-5">Unlimited AI Tutor & Storage</p>
                                <button className="w-full bg-[var(--brand-purple)] text-white py-3.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all">
                                    UPGRADE NOW
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Settings Items */}
                <div className="lg:col-span-2 space-y-8">
                    {sections.map((section, si) => (
                        <div key={si} className="bg-white rounded-2xl p-6 border border-[var(--border)] shadow-sm space-y-6">
                            <div className="flex items-center gap-3.5">
                                <div className="w-9 h-9 bg-[var(--brand-cream-dark)] rounded-lg flex items-center justify-center">
                                    <section.icon className="w-4.5 h-4.5 text-[var(--text-muted)]" />
                                </div>
                                <h3 className="text-lg font-black tracking-tight text-[var(--brand-black)]">{section.title}</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {section.items.map((item, ii) => (
                                    <button
                                        key={ii}
                                        onClick={item.action}
                                        className="flex items-center justify-between p-4.5 rounded-xl hover:bg-[var(--brand-cream)] transition-all group border border-transparent hover:border-[var(--border)] text-left"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            {item.icon && (
                                                <div className="w-9 h-9 bg-white border border-[var(--border)] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <item.icon size={16} className="text-[var(--brand-black)]" />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-black text-[13px] italic text-[var(--brand-black)]">{item.label}</h4>
                                                <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">{item.desc}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-gray-200 group-hover:text-[var(--brand-purple)] transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Danger Zone */}
                    <div className="bg-red-50 rounded-2xl p-6 border border-red-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3.5">
                            <Trash2 className="w-4.5 h-4.5 text-red-500" />
                            <h3 className="text-lg font-black tracking-tight text-red-500">Danger Zone</h3>
                        </div>
                        <p className="text-[11px] font-bold text-red-700/60 max-w-lg">
                            Deleting your account is permanent. All your projects, quiz results, and study sessions will be wiped immediately.
                        </p>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="bg-white border border-red-200 text-red-500 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                            DELETE ACCOUNT FOREVER
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Update Modal */}
            <Modal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                title="Profile Details"
                description="Update your display identity"
                icon={User}
            >
                <form onSubmit={confirmProfileUpdate} className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Alex"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Scholar"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-sm"
                        />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="alex_study"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="col-span-2 bg-brandBlack text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50 mt-4 h-14"
                    >
                        {isUpdating ? 'Synchronizing...' : 'Save Profile'}
                    </button>
                </form>
            </Modal>

            {/* Delete Account Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Wipe Account?"
                description="This action cannot be undone."
                icon={Trash2}
            >
                <div className="space-y-6">
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                        <p className="text-xs font-bold text-red-700 leading-relaxed italic">
                            By proceeding, you authorize the immediate deletion of all data associated with {user?.email}.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="w-full bg-red-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all disabled:opacity-50"
                        >
                            {isDeleting ? 'Deleting Data...' : 'Confirm Destruction'}
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="w-full py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-brandBlack transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
