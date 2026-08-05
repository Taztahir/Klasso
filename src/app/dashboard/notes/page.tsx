'use client';

import * as React from 'react';
import { initialNotes } from '@/lib/mock-data';
import { Note } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FormModal } from '@/components/dashboard/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, FileText, Calendar, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function NotesPage() {
    const [notes, setNotes] = React.useState<Note[]>(initialNotes);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

    // Form state
    const [formTitle, setFormTitle] = React.useState('');
    const [formSubject, setFormSubject] = React.useState('');
    const [formClass, setFormClass] = React.useState('');
    const [formContent, setFormContent] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    // Filter notes
    const filteredNotes = React.useMemo(() => {
        return notes.filter(note =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [notes, searchQuery]);

    const getSubjectColor = (subject: string) => {
        const lowerSub = subject.toLowerCase();
        if (lowerSub.includes('math')) return { bg: 'bg-brandPurple/5', border: 'border-brandPurple', text: 'text-brandPurple', badge: 'bg-brandPurple text-white' };
        if (lowerSub.includes('biol') || lowerSub.includes('chem') || lowerSub.includes('phys')) return { bg: 'bg-brandGreen/5', border: 'border-brandGreen', text: 'text-brandGreen', badge: 'bg-brandGreen text-white' };
        if (lowerSub.includes('eng') || lowerSub.includes('lit')) return { bg: 'bg-brandPink/5', border: 'border-brandPink', text: 'text-brandPink', badge: 'bg-brandPink text-white' };
        return { bg: 'bg-brandYellow/10', border: 'border-brandYellow', text: 'text-brandYellow', badge: 'bg-brandYellow text-brandBlack' };
    };

    // Handle Create Note
    const handleCreateNote = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formTitle || !formSubject || !formClass || !formContent) {
            toast.error('Validation Failed', {
                description: 'Please fill in all required fields.'
            });
            return;
        }

        setLoading(true);

        setTimeout(() => {
            const newNote: Note = {
                id: `NTE${String(notes.length + 1).padStart(3, '0')}`,
                title: formTitle,
                subject: formSubject,
                class: formClass,
                content: formContent,
                date: new Date().toISOString().split('T')[0]
            };

            setNotes([newNote, ...notes]);
            setLoading(false);
            setIsCreateModalOpen(false);

            // Reset
            setFormTitle('');
            setFormSubject('');
            setFormClass('');
            setFormContent('');

            toast.success('Class Note Created!', {
                description: `"${formTitle}" added to ${formSubject} (${formClass}).`
            });
        }, 800);
    };

    return (
        <div className="space-y-6">
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border-2 border-brandBlack rounded-2xl shadow-[4px_4px_0px_0px_rgba(13,14,20,1)]">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-brandBlack/40" />
                    <Input
                        type="text"
                        placeholder="Search notes, subjects, content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 pl-9 pr-4 rounded-xl border-2 border-brandBlack bg-cream font-bold text-xs"
                    />
                </div>

                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full sm:w-auto h-10 border-2 border-brandBlack bg-brandPurple text-white font-black rounded-xl shadow-[2px_2px_0px_0px_rgba(13,14,20,1)] hover:bg-brandPurple/90 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(13,14,20,1)] flex items-center justify-center gap-2"
                >
                    <Plus className="h-4.5 w-4.5" />
                    Create Note
                </Button>
            </div>

            {/* Notes Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.length > 0 ? (
                    filteredNotes.map((note) => {
                        const style = getSubjectColor(note.subject);
                        return (
                            <Card 
                                key={note.id} 
                                className={`border-2 ${style.border} ${style.bg} shadow-[4px_4px_0px_0px_rgba(13,14,20,1)] hover:translate-y-[-2px] transition-all flex flex-col justify-between`}
                            >
                                <CardHeader className="p-5 border-b border-brandBlack/10">
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-brandBlack ${style.badge}`}>
                                            {note.subject}
                                        </span>
                                        <span className="text-[10px] font-black text-brandPurple bg-white border border-brandBlack px-2 py-0.5 rounded-full">
                                            {note.class}
                                        </span>
                                    </div>
                                    <CardTitle className="text-base font-black text-brandBlack tracking-tight line-clamp-1">
                                        {note.title}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1.5 text-[9px] font-bold text-brandBlack/40 mt-1">
                                        <Calendar className="h-3 w-3" />
                                        Published: {note.date}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                                    <p className="text-xs font-bold text-brandBlack/70 leading-relaxed line-clamp-4">
                                        {note.content}
                                    </p>
                                    <div className="flex items-center justify-between border-t border-brandBlack/5 pt-3 mt-4 text-[10px] font-black text-brandPurple hover:underline cursor-pointer"
                                         onClick={() => toast.info(`Viewing Note: ${note.title}`, { description: note.content })}>
                                        <span className="flex items-center gap-1">
                                            <FileText className="h-3.5 w-3.5" />
                                            View Full Note
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-12 bg-white border-2 border-brandBlack rounded-2xl shadow-[4px_4px_0px_0px_rgba(13,14,20,1)] text-brandBlack/40 font-bold">
                        No class notes found matching "{searchQuery}"
                    </div>
                )}
            </div>

            {/* Create Note Modal */}
            <FormModal
                isOpen={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                title="Create Class Note"
                description="Write and publish reference notes for students to read."
                onSubmit={handleCreateNote}
                submitText="Publish Note"
                loading={loading}
            >
                <div className="space-y-2">
                    <Label htmlFor="note-title" className="text-xs font-black text-brandBlack">Note Title *</Label>
                    <Input
                        id="note-title"
                        required
                        placeholder="e.g. Intro to Trigonometry"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="h-10 border-2 border-brandBlack rounded-xl text-xs font-bold bg-cream"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="note-subject" className="text-xs font-black text-brandBlack">Subject *</Label>
                        <select
                            id="note-subject"
                            required
                            value={formSubject}
                            onChange={(e) => setFormSubject(e.target.value)}
                            className="w-full h-10 px-3 border-2 border-brandBlack rounded-xl text-xs font-bold bg-cream outline-none"
                        >
                            <option value="">Select</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Biology">Biology</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Physics">Physics</option>
                            <option value="English Literature">English Literature</option>
                            <option value="Computer Science">Computer Science</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note-class" className="text-xs font-black text-brandBlack">Target Class *</Label>
                        <select
                            id="note-class"
                            required
                            value={formClass}
                            onChange={(e) => setFormClass(e.target.value)}
                            className="w-full h-10 px-3 border-2 border-brandBlack rounded-xl text-xs font-bold bg-cream outline-none"
                        >
                            <option value="">Select</option>
                            <option value="Grade 9-A">Grade 9-A</option>
                            <option value="Grade 10-A">Grade 10-A</option>
                            <option value="Grade 10-B">Grade 10-B</option>
                            <option value="Grade 11-A">Grade 11-A</option>
                            <option value="Grade 11-B">Grade 11-B</option>
                            <option value="Grade 12-A">Grade 12-A</option>
                            <option value="Grade 12-B">Grade 12-B</option>
                            <option value="Grade 12-C">Grade 12-C</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="note-content" className="text-xs font-black text-brandBlack">Content / Lecture Summary *</Label>
                    <textarea
                        id="note-content"
                        required
                        rows={6}
                        placeholder="Write detailed notes here..."
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        className="w-full p-3 border-2 border-brandBlack rounded-xl text-xs font-bold bg-cream outline-none focus:border-brandPurple"
                    />
                </div>
            </FormModal>
        </div>
    );
}
