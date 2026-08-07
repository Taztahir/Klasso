'use client';

import * as React from 'react';
import { Building2, User, Bell, Shield, Users, GraduationCap, DollarSign, Sliders, Database, Link2, FileText, RotateCcw, Lock, Camera, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

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

type SchoolForm = { name: string; address: string; phone: string; email: string; logo_url: string };
type ProfileForm = { full_name: string; phone: string; avatar_url: string };

export default function SettingsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [activeTab, setActiveTab] = React.useState('profile');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [school, setSchool] = React.useState<SchoolForm>({ name: '', address: '', phone: '', email: '', logo_url: '' });
  const [profileForm, setProfileForm] = React.useState<ProfileForm>({ full_name: '', phone: '', avatar_url: '' });

  const loadSettings = React.useCallback(async () => {
    if (authLoading || !user || !profile?.school_id) return;
    setLoading(true);
    setError(null);
    const [schoolResult, userResult] = await Promise.all([
      supabase.from('schools').select('name,address,phone,email,logo_url').eq('id', profile.school_id).single(),
      supabase.from('users').select('full_name,phone,avatar_url').eq('id', user.id).single(),
    ]);
    if (schoolResult.error || userResult.error) {
      setError(schoolResult.error?.message || userResult.error?.message || 'Unable to load settings.');
    } else {
      setSchool({ name: schoolResult.data?.name ?? '', address: schoolResult.data?.address ?? '', phone: schoolResult.data?.phone ?? '', email: schoolResult.data?.email ?? '', logo_url: schoolResult.data?.logo_url ?? '' });
      setProfileForm({ full_name: userResult.data?.full_name ?? '', phone: userResult.data?.phone ?? '', avatar_url: userResult.data?.avatar_url ?? '' });
    }
    setLoading(false);
  }, [authLoading, profile?.school_id, supabase, user]);

  React.useEffect(() => { void loadSettings(); }, [loadSettings]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error: saveError } = await supabase.from('users').update({ full_name: profileForm.full_name.trim(), phone: profileForm.phone.trim() || null, avatar_url: profileForm.avatar_url.trim() || null }).eq('id', user.id);
    setSaving(false);
    if (saveError) return toast.error('Could not save profile', { description: saveError.message });
    toast.success('Profile updated');
  };

  const saveSchool = async () => {
    if (!profile?.school_id) return;
    setSaving(true);
    const { error: saveError } = await supabase.from('schools').update({ name: school.name.trim(), address: school.address.trim() || null, phone: school.phone.trim() || null, email: school.email.trim() || null, logo_url: school.logo_url.trim() || null }).eq('id', profile.school_id);
    setSaving(false);
    if (saveError) return toast.error('Could not save school information', { description: saveError.message });
    toast.success('School information updated');
  };

  const field = (label: string, value: string, onChange: (value: string) => void, placeholder?: string) => (
    <div className="flex flex-col gap-2"><Label className="text-xs font-bold text-brandBlack">{label}</Label><Input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-xl border border-gray-200 bg-white text-xs font-bold text-brandBlack" /></div>
  );

  return <div className="flex flex-col gap-8">
    <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-center md:justify-between"><div><h2 className="text-2xl font-black tracking-tight text-brandBlack">Settings</h2><p className="mt-1.5 text-xs font-bold text-gray-400">Manage your account and school settings.</p></div><Button variant="outline" onClick={() => toast.info('Settings reset is coming soon')} className="self-start rounded-2xl text-xs font-bold"><RotateCcw data-icon="inline-start" />Reset to Default</Button></div>
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <div className="flex max-h-[calc(100vh-180px)] flex-col gap-1.5 overflow-y-auto pr-2 lg:col-span-4">{settingsTabs.map((tab) => { const Icon = tab.icon; return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex w-full items-start gap-3.5 rounded-2xl p-3 text-left transition-all ${activeTab === tab.id ? 'bg-[#F4F4FF] text-brandPurple shadow-sm' : 'text-gray-500 hover:bg-slate-50'}`}><Icon className="mt-0.5 size-5 shrink-0" /><span className="flex min-w-0 flex-col"><span className="text-xs font-bold leading-tight">{tab.title}</span><span className="mt-1 truncate text-[10px] font-semibold text-gray-400">{tab.desc}</span></span></button>; })}</div>
      <div className="flex flex-col gap-6 lg:col-span-8">
        {error && <Card className="border-destructive/30"><CardContent className="flex items-center justify-between gap-4 p-5 text-sm text-destructive"><span>{error}</span><Button variant="outline" size="sm" onClick={() => void loadSettings()}>Retry</Button></CardContent></Card>}
        {loading ? <Card className="rounded-3xl"><CardHeader><Skeleton className="h-5 w-48" /><Skeleton className="h-4 w-72" /></CardHeader><CardContent className="grid gap-5 md:grid-cols-2"><Skeleton className="h-10" /><Skeleton className="h-10" /><Skeleton className="h-10" /><Skeleton className="h-10" /></CardContent></Card> : activeTab === 'profile' ? <Card className="rounded-3xl"><CardHeader className="flex flex-row items-center justify-between border-b border-gray-50"><div><CardTitle className="text-base font-extrabold">Profile Information</CardTitle><CardDescription className="text-xs font-semibold">Update your personal information.</CardDescription></div><Button onClick={saveProfile} disabled={saving} className="rounded-xl text-xs font-bold">{saving && <Loader2 className="animate-spin" data-icon="inline-start" />}Save Changes</Button></CardHeader><CardContent className="flex flex-col gap-6 p-6"><div className="flex items-center gap-4"><div className="flex size-20 items-center justify-center overflow-hidden rounded-full border bg-slate-100">{profileForm.avatar_url ? <img src={profileForm.avatar_url} alt="Profile avatar" className="size-full object-cover" /> : <User className="size-8 text-gray-400" />}</div><Button variant="outline" size="sm" onClick={() => toast.info('Avatar upload is coming soon; use the URL field below.') }><Camera data-icon="inline-start" />Upload coming soon</Button></div><div className="grid gap-5 md:grid-cols-2">{field('Full Name', profileForm.full_name, (value) => setProfileForm((current) => ({ ...current, full_name: value })))}{field('Email Address', user?.email ?? '', () => {}, 'Managed by authentication')}{field('Phone Number', profileForm.phone, (value) => setProfileForm((current) => ({ ...current, phone: value })))}{field('Avatar URL', profileForm.avatar_url, (value) => setProfileForm((current) => ({ ...current, avatar_url: value })), 'https://...')}<div className="flex flex-col gap-2"><Label className="text-xs font-bold text-brandBlack">Role</Label><div className="relative"><Input value={profile?.role?.replace('_', ' ') ?? ''} disabled className="h-10 rounded-xl bg-slate-50 text-xs font-bold capitalize text-gray-400" /><Lock className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" /></div></div><div className="flex flex-col gap-2"><Label className="text-xs font-bold text-brandBlack">School ID</Label><div className="relative"><Input value={profile?.school_id ?? ''} disabled className="h-10 rounded-xl bg-slate-50 text-xs font-bold text-gray-400" /><Lock className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" /></div></div></div></CardContent></Card> : activeTab === 'school' ? <Card className="rounded-3xl"><CardHeader className="flex flex-row items-center justify-between border-b border-gray-50"><div><CardTitle className="text-base font-extrabold">School Information</CardTitle><CardDescription className="text-xs font-semibold">Update the details for your current school.</CardDescription></div><Button onClick={saveSchool} disabled={saving} className="rounded-xl text-xs font-bold">{saving && <Loader2 className="animate-spin" data-icon="inline-start" />}Save Changes</Button></CardHeader><CardContent className="grid gap-5 p-6 md:grid-cols-2">{field('School Name', school.name, (value) => setSchool((current) => ({ ...current, name: value })))}{field('School Email', school.email, (value) => setSchool((current) => ({ ...current, email: value })))}{field('School Phone', school.phone, (value) => setSchool((current) => ({ ...current, phone: value })))}{field('Address', school.address, (value) => setSchool((current) => ({ ...current, address: value })))}<div className="flex flex-col gap-2 md:col-span-2">{field('Logo URL', school.logo_url, (value) => setSchool((current) => ({ ...current, logo_url: value })), 'https://...')}<p className="text-[10px] font-semibold text-gray-400">Storage uploads are coming soon. Paste an existing image URL for now.</p></div></CardContent></Card> : <Card className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl p-8"><Check className="size-10 text-gray-300" /><h3 className="mt-4 text-sm font-extrabold text-brandBlack">{settingsTabs.find((tab) => tab.id === activeTab)?.title} Settings</h3><p className="mt-2 max-w-sm text-center text-xs font-semibold text-gray-400">This settings section is not wired yet.</p><Button variant="outline" size="sm" className="mt-5" onClick={() => toast.info('This settings section is coming soon.')}>Coming Soon</Button></Card>}
      </div>
    </div>
  </div>;
}
