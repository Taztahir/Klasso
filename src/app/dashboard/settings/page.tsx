'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    User, 
    Building2, 
    Bell, 
    Shield, 
    Users, 
    GraduationCap, 
    DollarSign, 
    Sliders, 
    Database, 
    Link2, 
    FileText,
    RotateCcw,
    Lock,
    Camera,
    Eye,
    EyeOff,
    Monitor,
    Smartphone,
    MoreVertical,
    Check
} from 'lucide-react';
import { toast } from 'sonner';

// Sidebar tabs metadata
const settingsTabs = [
    { id: 'profile', title: 'Profile & Account', desc: 'Manage your personal info', icon: User },
    { id: 'school', title: 'School Information', desc: 'Update school details', icon: Building2 },
    { id: 'notifications', title: 'Notifications', desc: 'Configure notification preferences', icon: Bell },
    { id: 'security', title: 'Security', desc: 'Password and security settings', icon: Shield },
    { id: 'roles', title: 'Users & Roles', desc: 'Manage users and permissions', icon: Users },
    { id: 'academic', title: 'Academic Settings', desc: 'Grading, terms and academic preferences', icon: GraduationCap },
    { id: 'finance', title: 'Finance Settings', desc: 'Payment methods and fee settings', icon: DollarSign },
    { id: 'preferences', title: 'System Preferences', desc: 'General system configurations', icon: Sliders },
    { id: 'backup', title: 'Backup & Restore', desc: 'Backup and restore data', icon: Database },
    { id: 'integrations', title: 'Integrations', desc: 'Third-party integrations', icon: Link2 },
    { id: 'audit', title: 'Audit Logs', desc: 'View system activity logs', icon: FileText },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = React.useState('profile');
    
    // Profile Fields State
    const [fullName, setFullName] = React.useState('Zayd Tahir');
    const [email, setEmail] = React.useState('zayd.tahir@klasso.edu.ng');
    const [phone, setPhone] = React.useState('+234 806 123 4567');
    const [department, setDepartment] = React.useState('Administration');

    // Password visibility states
    const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    // Form inputs state
    const [currentPassword, setCurrentPassword] = React.useState('••••••••••••');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const [saving, setSaving] = React.useState(false);

    const handleSaveProfile = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success('Changes Saved Successfully', {
                description: 'Profile information updated.'
            });
        }, 500);
    };

    const handleUpdatePassword = () => {
        toast.success('Password Updated', {
            description: 'Your security credentials have been changed.'
        });
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleResetSettings = () => {
        toast.info('Settings restored to default configurations.');
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                    <h2 className="text-2.5xl font-black text-brandBlack tracking-tight">Settings</h2>
                    <p className="text-xs font-bold text-gray-400 mt-1.5">Manage your account, preferences and system settings.</p>
                </div>
                <button 
                    onClick={handleResetSettings}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-xs font-bold text-gray-700 shadow-sm cursor-pointer self-start md:self-auto"
                >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset to Default</span>
                </button>
            </div>

            {/* Left/Right Two-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Settings Sidebar */}
                <div className="lg:col-span-4 flex flex-col gap-1.5 max-h-[calc(100vh-180px)] overflow-y-auto pr-2 scrollbar-hide">
                    {settingsTabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-start gap-3.5 p-3 rounded-2xl transition-all text-left cursor-pointer ${
                                    isActive
                                        ? 'bg-[#F4F4FF] text-brandPurple font-bold shadow-sm'
                                        : 'hover:bg-slate-50 text-gray-500 hover:text-brandBlack'
                                }`}
                            >
                                <tab.icon className={`h-5 w-5 shrink-0 mt-0.5 ${isActive ? 'text-brandPurple' : 'text-gray-400'}`} />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold leading-tight">{tab.title}</span>
                                    <span className="text-[10px] font-semibold text-gray-400 mt-1 truncate">{tab.desc}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Right Column: Settings Form Stack */}
                <div className="lg:col-span-8 space-y-6">
                    {activeTab === 'profile' ? (
                        <>
                            {/* Card 1: Profile Information */}
                            <Card className="border border-gray-100 bg-white shadow-sm rounded-3xl overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50 px-6 pt-6">
                                    <div className="grid gap-1">
                                        <CardTitle className="text-base font-extrabold text-brandBlack">Profile Information</CardTitle>
                                        <CardDescription className="text-xs font-semibold text-gray-400">Update your personal information and profile details.</CardDescription>
                                    </div>
                                    <Button 
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="h-9 px-4 rounded-xl bg-brandPurple text-white hover:bg-brandPurple/90 transition-all font-bold text-xs cursor-pointer shadow-sm"
                                    >
                                        Save Changes
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    {/* Profile Avatar Editor */}
                                    <div className="relative w-20 h-20 group">
                                        <div className="w-full h-full rounded-full border border-gray-200 overflow-hidden bg-slate-100 shadow-sm">
                                            <img 
                                                src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=256&h=256&q=80" 
                                                alt="Avatar profile image" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button 
                                            onClick={() => toast.info('Upload photo feature is coming soon!')}
                                            className="absolute bottom-0 right-0 p-1.5 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 text-gray-500 cursor-pointer"
                                        >
                                            <Camera className="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    {/* Input fields grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-brandBlack">Full Name</Label>
                                            <Input
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack focus:ring-1 focus:ring-brandPurple"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-brandBlack">Email Address</Label>
                                            <Input
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack focus:ring-1 focus:ring-brandPurple"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-brandBlack">Phone Number</Label>
                                            <Input
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack focus:ring-1 focus:ring-brandPurple"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-brandBlack">Role</Label>
                                            <div className="relative">
                                                <Input
                                                    value="Super Admin"
                                                    disabled
                                                    className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-slate-50/50 text-gray-400 pr-10 cursor-not-allowed select-none"
                                                />
                                                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-xs font-bold text-brandBlack">Department</Label>
                                            <select
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack outline-none focus:border-brandPurple focus:ring-1 focus:ring-brandPurple"
                                            >
                                                <option value="Administration">Administration</option>
                                                <option value="Academic Board">Academic Board</option>
                                                <option value="Finance Department">Finance Department</option>
                                                <option value="Information Technology">Information Technology</option>
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 2: Change Password */}
                            <Card className="border border-gray-100 bg-white shadow-sm rounded-3xl overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50 px-6 pt-6">
                                    <div className="grid gap-1">
                                        <CardTitle className="text-base font-extrabold text-brandBlack">Change Password</CardTitle>
                                        <CardDescription className="text-xs font-semibold text-gray-400">Update your password to keep your account secure.</CardDescription>
                                    </div>
                                    <button 
                                        onClick={handleUpdatePassword}
                                        className="h-9 px-4 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-all shadow-sm"
                                    >
                                        Update Password
                                    </button>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        {/* Current Password */}
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-brandBlack">Current Password</Label>
                                            <div className="relative">
                                                <Input
                                                    type={showCurrentPassword ? 'text' : 'password'}
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack pr-10"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                                >
                                                    {showCurrentPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                </button>
                                            </div>
                                        </div>
                                        {/* New Password */}
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-brandBlack">New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Enter new password"
                                                    className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack pr-10"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                                >
                                                    {showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                </button>
                                            </div>
                                        </div>
                                        {/* Confirm Password */}
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-brandBlack">Confirm New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Confirm new password"
                                                    className="h-10 border border-gray-200 rounded-xl text-xs font-bold bg-white text-brandBlack pr-10"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 3: Two-Factor Authentication */}
                            <Card className="border border-gray-100 bg-white shadow-sm rounded-3xl overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50 px-6 pt-6">
                                    <div className="grid gap-1">
                                        <CardTitle className="text-base font-extrabold text-brandBlack">Two-Factor Authentication</CardTitle>
                                        <CardDescription className="text-xs font-semibold text-gray-400">Add an extra layer of security to your account.</CardDescription>
                                    </div>
                                    <button 
                                        onClick={() => toast.info('Manage 2FA screen is coming soon!')}
                                        className="h-9 px-4 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-all shadow-sm"
                                    >
                                        Manage 2FA
                                    </button>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                        <span>Status:</span>
                                        <span className="flex items-center gap-1.5 text-brandGreen">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            Enabled
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 4: Active Sessions */}
                            <Card className="border border-gray-100 bg-white shadow-sm rounded-3xl overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50 px-6 pt-6">
                                    <div className="grid gap-1">
                                        <CardTitle className="text-base font-extrabold text-brandBlack">Active Sessions</CardTitle>
                                        <CardDescription className="text-xs font-semibold text-gray-400">Manage your active sessions across all devices.</CardDescription>
                                    </div>
                                    <button 
                                        onClick={() => toast.success('All other sessions signed out.')}
                                        className="h-9 px-4 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-all shadow-sm"
                                    >
                                        Sign Out All
                                    </button>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    {/* Session 1: Windows Chrome */}
                                    <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 bg-slate-50/50">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 shrink-0">
                                                <Monitor className="h-4.5 w-4.5" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold text-brandBlack">Windows • Chrome</span>
                                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E0E0FF]/60 text-brandPurple">
                                                        Current Session
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-semibold text-gray-400 mt-1">
                                                    Lagos, Nigeria • IP: 102.89.45.23 • <span className="text-emerald-600 font-bold">Active now</span>
                                                </span>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-brandBlack cursor-pointer">
                                            <MoreVertical className="h-4.5 w-4.5" />
                                        </button>
                                    </div>

                                    {/* Session 2: iPhone Safari */}
                                    <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 bg-slate-50/50">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 shrink-0">
                                                <Smartphone className="h-4.5 w-4.5" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-bold text-brandBlack">iPhone 14 • Safari</span>
                                                <span className="text-[10px] font-semibold text-gray-400 mt-1">
                                                    Lagos, Nigeria • <span className="text-brandPink font-bold">2 hours ago</span>
                                                </span>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-brandBlack cursor-pointer">
                                            <MoreVertical className="h-4.5 w-4.5" />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (() => {
                        const ActiveIcon = settingsTabs.find(t => t.id === activeTab)?.icon || User;
                        return (
                            <Card className="border border-gray-100 bg-white shadow-sm rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px]">
                                <ActiveIcon className="h-10 w-10 text-gray-300" />
                                <h3 className="text-sm font-extrabold text-brandBlack mt-4">
                                    {settingsTabs.find(t => t.id === activeTab)?.title} Settings
                                </h3>
                                <p className="text-xs font-semibold text-gray-400 mt-2 text-center max-w-sm">
                                    Configurations for this section are managed through regional policies. Contact administrative support if changes are required.
                                </p>
                            </Card>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}
