import React, { useState } from 'react';
import { User, Camera, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SettingsView = () => {
    const { user, updateProfile, uploadAvatar } = useAuth();
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        const { error } = await updateProfile({ full_name: fullName });
        
        if (!error) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
        setLoading(false);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatarLoading(true);
        const { error } = await uploadAvatar(file);
        if (error) {
            console.error('Avatar upload failed:', error);
        }
        setAvatarLoading(false);
    };

    return (
        <div className="flex-1 flex flex-col h-full max-w-xl mx-auto py-6 lg:py-10 px-4 lg:px-6 overflow-y-auto scrollbar-hide">
            <header className="mb-6 lg:mb-8 animate-slide-up">
                <h1 className="text-2xl lg:text-3xl font-black text-brandBlack tracking-tight mb-1.5 uppercase italic leading-none">Settings</h1>
                <p className="text-xs lg:text-sm text-brandBlack/40 font-black uppercase tracking-widest italic">Update your presence on Klasso</p>
            </header>

            <div className="space-y-4 lg:space-y-6 animate-fade-in">
                {/* Profile Picture Section - Scaled Down */}
                <div className="bg-white border-2 border-brandBlack/5 p-5 lg:p-6 rounded-xl lg:rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-3 lg:mb-4">
                            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-cream border-2 border-brandBlack shadow-lg overflow-hidden flex items-center justify-center">
                                {avatarLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-brandPurple" />
                                ) : user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 lg:w-10 lg:h-10 text-brandBlack/20" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-brandPurple text-white p-1.5 lg:p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all border-2 border-white">
                                <Camera size={14} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={avatarLoading} />
                            </label>
                        </div>
                        <h3 className="font-black text-sm text-brandBlack uppercase italic">Profile Picture</h3>
                        <p className="text-[9px] font-bold text-brandBlack/40 mt-0.5 uppercase tracking-tight">PNG or JPG. Max 2MB.</p>
                    </div>
                </div>

                {/* Name Settings - Scaled Down */}
                <form onSubmit={handleUpdateProfile} className="bg-white border-2 border-brandBlack/5 p-5 lg:p-6 rounded-xl lg:rounded-2xl shadow-sm space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-brandBlack/40 uppercase tracking-[0.2em] ml-1 italic">Display Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full bg-cream border-2 border-brandBlack focus:border-brandPurple rounded-lg lg:rounded-xl px-4 py-2.5 font-black text-brandBlack focus:outline-none transition-all text-xs lg:text-sm uppercase italic tracking-tight"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brandBlack text-white py-3 rounded-lg font-black text-sm uppercase italic border-2 border-brandBlack shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                {success ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        Updated!
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </>
                        )}
                    </button>
                </form>

                <div className="pt-6 border-t border-brandBlack/5">
                    <p className="text-[9px] font-black text-brandBlack/20 uppercase tracking-[0.3em] text-center italic">
                        Klasso — School Tenant OS
                    </p>
                </div>
            </div>
        </div>
    );
};
