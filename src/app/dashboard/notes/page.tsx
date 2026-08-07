'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Note } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FormModal } from '@/components/dashboard/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, FileText, Calendar, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const subjects = ['Mathematics', 'Biology', 'Chemistry', 'Physics', 'English Literature', 'Computer Science'];
const classes = ['Grade 9-A', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B', 'Grade 12-C'];

function NotesGridSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="border-2 border-gray-100 shadow-sm">
                    <CardHeader className="flex flex-col gap-3 p-5">
                        <div className="flex justify-between gap-3"><Skeleton className="h-5 w-24" /><Skeleton className="h-5 w-20" /></div>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5 p-5"><Skeleton className="h-20 w-full" /><Skeleton className="h-5 w-32" /></CardContent>
                </Card>
            ))}
        </div>
    );
}

export default function NotesPage() {
    const { user, profile } = useAuth();
    const supabase = createClient();
    const [notes, setNotes] = React.useState<Note[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [fetchError, setFetchError] = React.useState<string | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [formTitle, setFormTitle] = React.useState('');
    const [formSubject, setFormSubject] = React.useState('');
    const [formClass, setFormClass] = React.useState('');
    const [formContent, setFormContent] = React.useState('');
    const [saving, setSaving] = React.useState(false);

    const fetchNotes = React.useCallback(async () => {
        if (!profile?.school_id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setFetchError(null);
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('school_id', profile.school_id)
            .order('created_at', { ascending: false });

        if (error) {
            setNotes([]);
            setFetchError(error.message || 'Failed to load notes.');
        } else {
            setNotes((data ?? []).map((row: any) => ({
                id: row.id,
                title: row.title,
                subject: row.subject,
                class: row.class ?? row.class_grade ?? '',
                content: row.content,
                date: row.created_at ?? row.date ?? new Date().toISOString(),
            })));
        }
        setLoading(false);
    }, [profile?.school_id, supabase]);

    React.useEffect(() => {
        void fetchNotes();
    }, [fetchNotes]);

    const resetForm = () => {
        setEditingId(null);
        setFormTitle('');
        setFormSubject('');
        setFormClass('');
        setFormContent('');
    };

    const openCreate = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const openEdit = (note: Note) => {
        setEditingId(note.id);
        setFormTitle(note.title);
        setFormSubject(note.subject);
        setFormClass(note.class);
        setFormContent(note.content);
        setIsModalOpen(true);
    };

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!formTitle.trim() || !formSubject || !formClass || !formContent.trim()) {
            toast.error('Validation failed', { description: 'Please fill in all required fields.' });
            return;
        }
        if (!profile?.school_id || !user) {
            toast.error('School session unavailable', { description: 'Please sign in again.' });
            return;
        }

        setSaving(true);
        try {
            const payload = {
                title: formTitle.trim(),
                subject: formSubject,
                class: formClass,
                content: formContent.trim(),
            };
            const result = editingId
                ? await supabase.from('notes').update(payload).eq('id', editingId).eq('school_id', profile.school_id)
                : await supabase.from('notes').insert({ ...payload, school_id: profile.school_id, created_by: user.id });

            if (result.error) throw result.error;
            toast.success(editingId ? 'Note updated.' : 'Note published.');
            setIsModalOpen(false);
            resetForm();
            await fetchNotes();
        } catch (error: any) {
            toast.error('Failed to save note', { description: error.message || 'Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (note: Note) => {
        if (!window.confirm(`Delete “${note.title}”?`)) return;
        if (!profile?.school_id) return;
        const { error } = await supabase.from('notes').delete().eq('id', note.id).eq('school_id', profile.school_id);
        if (error) {
            toast.error('Failed to delete note', { description: error.message });
            return;
        }
        toast.success('Note deleted.');
        await fetchNotes();
    };

    const getSubjectColor = (subject: string) => {
        const lower = subject.toLowerCase();
        if (lower.includes('math')) return { bg: 'bg-brandPurple/5', border: 'border-brandPurple', text: 'text-brandPurple', badge: 'bg-brandPurple text-white' };
        if (lower.includes('biol') || lower.includes('chem') || lower.includes('phys')) return { bg: 'bg-brandGreen/5', border: 'border-brandGreen', text: 'text-brandGreen', badge: 'bg-brandGreen text-white' };
        if (lower.includes('eng') || lower.includes('lit')) return { bg: 'bg-brandPink/5', border: 'border-brandPink', text: 'text-brandPink', badge: 'bg-brandPink text-white' };
        return { bg: 'bg-brandYellow/10', border: 'border-brandYellow', text: 'text-brandYellow', badge: 'bg-brandYellow text-brandBlack' };
    };

    const filteredNotes = notes.filter((note) => {
        const query = searchQuery.toLowerCase();
        return note.title.toLowerCase().includes(query) || note.subject.toLowerCase().includes(query) || note.class.toLowerCase().includes(query) || note.content.toLowerCase().includes(query);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border-2 border-brandBlack bg-white p-4 shadow-[4px_4px_0px_0px_rgba(13,14,20,1)] sm:flex-row">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brandBlack/40" />
                    <Input type="text" placeholder="Search notes, subjects, content..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="h-10 rounded-xl border-2 border-brandBlack bg-cream pl-9 pr-4 text-xs font-bold" />
                </div>
                <Button onClick={openCreate} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border-2 border-brandBlack bg-brandPurple font-black text-white shadow-[2px_2px_0px_0px_rgba(13,14,20,1)] hover:bg-brandPurple/90 sm:w-auto"><Plus className="h-4 w-4" />Create Note</Button>
            </div>

            {loading ? <NotesGridSkeleton /> : fetchError ? (
                <div className="rounded-2xl border-2 border-brandBlack bg-white py-12 text-center shadow-[4px_4px_0px_0px_rgba(13,14,20,1)]"><p className="text-sm font-bold text-rose-600">{fetchError}</p><button onClick={() => void fetchNotes()} className="mt-3 text-xs font-bold text-brandPurple underline">Try again</button></div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredNotes.length > 0 ? filteredNotes.map((note) => {
                        const style = getSubjectColor(note.subject);
                        return <Card key={note.id} className={`flex flex-col justify-between border-2 ${style.border} ${style.bg} shadow-[4px_4px_0px_0px_rgba(13,14,20,1)] transition-all hover:-translate-y-0.5`}>
                            <CardHeader className="border-b border-brandBlack/10 p-5"><div className="mb-2 flex items-center justify-between gap-2"><span className={`rounded-full border border-brandBlack px-2 py-0.5 text-[10px] font-black ${style.badge}`}>{note.subject}</span><span className="rounded-full border border-brandBlack bg-white px-2 py-0.5 text-[10px] font-black text-brandPurple">{note.class}</span></div><CardTitle className="line-clamp-1 text-base font-black tracking-tight text-brandBlack">{note.title}</CardTitle><CardDescription className="mt-1 flex items-center gap-1.5 text-[9px] font-bold text-brandBlack/40"><Calendar className="h-3 w-3" />Published: {new Date(note.date).toLocaleDateString()}</CardDescription></CardHeader>
                            <CardContent className="flex flex-1 flex-col justify-between gap-4 p-5"><p className="line-clamp-4 text-xs font-bold leading-relaxed text-brandBlack/70">{note.content}</p><div className="flex items-center justify-between border-t border-brandBlack/5 pt-3 text-[10px] font-black text-brandPurple"><button onClick={() => toast.info(`Viewing Note: ${note.title}`, { description: note.content })} className="flex items-center gap-1 hover:underline"><FileText className="h-3.5 w-3.5" />View Full Note</button><div className="flex items-center gap-1"><button onClick={() => openEdit(note)} aria-label={`Edit ${note.title}`} className="rounded-md p-1.5 hover:bg-white"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => void handleDelete(note)} aria-label={`Delete ${note.title}`} className="rounded-md p-1.5 text-rose-600 hover:bg-white"><Trash2 className="h-3.5 w-3.5" /></button></div></div></CardContent>
                        </Card>;
                    }) : <div className="col-span-full rounded-2xl border-2 border-brandBlack bg-white py-12 text-center font-bold text-brandBlack/40 shadow-[4px_4px_0px_0px_rgba(13,14,20,1)]">No class notes found matching &quot;{searchQuery}&quot;</div>}
                </div>
            )}

            <FormModal isOpen={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) resetForm(); }} title={editingId ? 'Edit Class Note' : 'Create Class Note'} description="Write and publish reference notes for staff and students to read." onSubmit={handleSave} submitText={editingId ? 'Save Changes' : 'Publish Note'} loading={saving}>
                <div className="space-y-2"><Label htmlFor="note-title" className="text-xs font-black text-brandBlack">Note Title *</Label><Input id="note-title" required placeholder="e.g. Intro to Trigonometry" value={formTitle} onChange={(event) => setFormTitle(event.target.value)} className="h-10 rounded-xl border-2 border-brandBlack bg-cream text-xs font-bold" /></div>
                <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="note-subject" className="text-xs font-black text-brandBlack">Subject *</Label><select id="note-subject" required value={formSubject} onChange={(event) => setFormSubject(event.target.value)} className="h-10 w-full rounded-xl border-2 border-brandBlack bg-cream px-3 text-xs font-bold outline-none"><option value="">Select</option>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select></div><div className="space-y-2"><Label htmlFor="note-class" className="text-xs font-black text-brandBlack">Target Class *</Label><select id="note-class" required value={formClass} onChange={(event) => setFormClass(event.target.value)} className="h-10 w-full rounded-xl border-2 border-brandBlack bg-cream px-3 text-xs font-bold outline-none"><option value="">Select</option>{classes.map((schoolClass) => <option key={schoolClass}>{schoolClass}</option>)}</select></div></div>
                <div className="space-y-2"><Label htmlFor="note-content" className="text-xs font-black text-brandBlack">Content / Lecture Summary *</Label><textarea id="note-content" required rows={6} placeholder="Write detailed notes here..." value={formContent} onChange={(event) => setFormContent(event.target.value)} className="w-full rounded-xl border-2 border-brandBlack bg-cream p-3 text-xs font-bold outline-none focus:border-brandPurple" /></div>
            </FormModal>
        </div>
    );
}
