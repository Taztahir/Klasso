import { motion } from 'framer-motion';
import { Bell, Shield, Smartphone, LogOut, ChevronRight, WifiOff } from 'lucide-react';
import { UserProfile } from './types';

interface SettingsViewProps {
    isLowData: boolean;
    setIsLowData: (val: boolean) => void;
    userData: UserProfile;
    onUpdateUser: (data: UserProfile) => void;
    onLogout?: () => void;
    itemVariants: any;
}

export const SettingsView = ({ isLowData, setIsLowData, userData, onUpdateUser, onLogout, itemVariants }: SettingsViewProps) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="max-w-4xl mx-auto space-y-12 animate-fadeIn"
        >
            <div>
                <h2 className="text-3xl font-black">Account Settings</h2>
                <p className="text-dash-text-muted font-medium">Manage your profile, preferences, and study configuration.</p>
            </div>

            <div className="grid gap-8">
                {/* Profile Section */}
                <motion.section variants={itemVariants} className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_#000]">
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b-2 border-zinc-50">
                        <div className="relative group">
                            <div className="w-20 h-20 rounded-2xl border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_#000] bg-white">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.avatarSeed}`}
                                    alt={userData.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black">{userData.name}</h3>
                            <p className="text-dash-text-muted font-medium capitalize">{userData.handle}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-dash-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest leading-none">Pro Member</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-dash-text-muted">Display Name</label>
                            <input
                                type="text"
                                value={userData.name}
                                onChange={(e) => onUpdateUser({ ...userData, name: e.target.value })}
                                className="w-full bg-zinc-50 border-2 border-black rounded-xl p-3 font-bold focus:bg-white transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-dash-text-muted">Handle / Plan</label>
                            <input
                                type="text"
                                value={userData.handle}
                                onChange={(e) => onUpdateUser({ ...userData, handle: e.target.value })}
                                className="w-full bg-zinc-50 border-2 border-black rounded-xl p-3 font-bold focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>
                </motion.section>

                {/* Preference Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { icon: <Bell className="text-dash-primary" />, title: "Notifications", desc: "Manage alerts, reminders, and streaks." },
                        { icon: <Shield className="text-green-500" />, title: "Privacy & Security", desc: "Change password and data visibility." },
                        { icon: <Smartphone className="text-blue-500" />, title: "App Experience", desc: "Dark mode, haptics, and interface settings." },
                    ].map((item, i) => (
                        <motion.div key={i} variants={itemVariants} className="bg-white border-2 border-black rounded-2xl p-6 flex items-center justify-between hover:translate-x-2 transition-transform cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-zinc-50 border-2 border-black rounded-xl">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold">{item.title}</h4>
                                    <p className="text-xs text-dash-text-muted font-medium">{item.desc}</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-zinc-300" />
                        </motion.div>
                    ))}

                    {/* Low Data Toggle Card */}
                    <motion.div variants={itemVariants} className={`border-2 border-black rounded-2xl p-6 flex items-center justify-between transition-all cursor-pointer ${isLowData ? 'bg-dash-secondary shadow-[4px_4px_0px_0px_#000]' : 'bg-white'}`} onClick={() => setIsLowData(!isLowData)}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 border-2 border-black rounded-xl ${isLowData ? 'bg-white' : 'bg-zinc-50'}`}>
                                <WifiOff className={isLowData ? 'text-black' : 'text-zinc-400'} />
                            </div>
                            <div>
                                <h4 className="font-bold">Offline / Low Data</h4>
                                <p className="text-xs text-dash-text-muted font-medium">Disable heavy animations & blurs.</p>
                            </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full border-2 border-black relative transition-colors ${isLowData ? 'bg-black' : 'bg-zinc-200'}`}>
                            <motion.div
                                animate={{ x: isLowData ? 24 : 0 }}
                                className="absolute w-5 h-5 bg-white border-2 border-black rounded-full top-[-1px] left-[-1px]"
                            />
                        </div>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="pt-8">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 text-rose-500 font-black uppercase text-sm tracking-widest hover:text-rose-600 transition-colors"
                    >
                        <LogOut size={20} />
                        Logout from all devices
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};
