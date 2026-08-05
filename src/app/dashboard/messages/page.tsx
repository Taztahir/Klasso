'use client';

import * as React from 'react';
import { 
    Search, 
    SlidersHorizontal, 
    Phone, 
    Video, 
    Info, 
    Paperclip, 
    Image as ImageIcon, 
    FileText, 
    Smile, 
    Send, 
    MoreVertical, 
    Download, 
    Plus, 
    ChevronDown,
    Calendar,
    MessageSquare,
    CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

/* ── Types ── */
interface Message {
    id: string;
    text: string;
    time: string;
    sender: 'me' | 'them';
    reactions?: { emoji: string; count: number }[];
}

interface SharedFile {
    name: string;
    size: string;
    date: string;
    type: 'pdf' | 'docx' | 'xlsx';
}

interface Conversation {
    id: string;
    name: string;
    role: 'Parent' | 'Teacher' | 'Group' | 'Staff';
    subtitle: string;
    avatar: string;
    online: boolean;
    lastSeen?: string;
    email: string;
    phone: string;
    location: string;
    studentName?: string;
    studentAvatar?: string;
    studentGrade?: string;
    time: string;
    unreadCount: number;
    messages: Message[];
    sharedFiles: SharedFile[];
    firstMessageDate: string;
}

const mockConversations: Conversation[] = [
    {
        id: '1',
        name: 'Aisha Lawal',
        role: 'Parent',
        subtitle: 'Parent of Maryam Bello (Grade 10A)',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
        online: true,
        email: 'aisha.lawal@email.com',
        phone: '+234 803 987 6543',
        location: 'Lagos, Nigeria',
        studentName: 'Maryam Bello',
        studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
        studentGrade: 'Grade 10A',
        time: '2:30 PM',
        unreadCount: 2,
        firstMessageDate: 'May 20, 2025',
        messages: [
            { id: '1', text: 'Good afternoon, I would like to know Maryam\'s performance in the last mathematics test.', time: '2:20 PM', sender: 'them' },
            { id: '2', text: 'Good afternoon Mrs. Lawal, Maryam scored 78% in the last mathematics test.', time: '2:22 PM', sender: 'me' },
            { id: '3', text: 'That\'s good to hear. Are there any areas she needs to improve on?', time: '2:24 PM', sender: 'them' },
            { id: '4', text: 'Yes, word problems and algebraic expressions. I will send you a detailed report shortly.', time: '2:25 PM', sender: 'me' },
            { id: '5', text: 'Thank you very much.', time: '2:26 PM', sender: 'them', reactions: [{ emoji: '👍', count: 1 }] }
        ],
        sharedFiles: [
            { name: 'Term 2 Report Card.pdf', size: '245 KB', date: 'May 20, 2025', type: 'pdf' },
            { name: 'Math Performance Tips.docx', size: '120 KB', date: 'May 18, 2025', type: 'docx' },
            { name: 'Attendance Record.xlsx', size: '98 KB', date: 'May 15, 2025', type: 'xlsx' }
        ]
    },
    {
        id: '2',
        name: 'Mr. Kamal Tahir',
        role: 'Teacher',
        subtitle: 'Head of Mathematics',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
        online: true,
        email: 'kamal.tahir@klasso.com',
        phone: '+234 806 123 4567',
        location: 'Abuja, Nigeria',
        time: '1:15 PM',
        unreadCount: 1,
        firstMessageDate: 'April 12, 2025',
        messages: [
            { id: '1', text: 'Please find attached the termly math scheme of work.', time: '1:15 PM', sender: 'them' }
        ],
        sharedFiles: [
            { name: 'Math Scheme of Work.pdf', size: '1.2 MB', date: 'April 12, 2025', type: 'pdf' }
        ]
    },
    {
        id: '3',
        name: 'Grade 10A Students',
        role: 'Group',
        subtitle: 'General Group for Grade 10A',
        avatar: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=80&h=80&q=80',
        online: false,
        email: 'grade10a@klasso.com',
        phone: 'Group Chat',
        location: 'Block A, Floor 2',
        time: '11:45 AM',
        unreadCount: 5,
        firstMessageDate: 'January 10, 2025',
        messages: [
            { id: '1', text: 'Welcome to Grade 10A group chat.', time: '11:45 AM', sender: 'them' }
        ],
        sharedFiles: [
            { name: 'Class Timetable.xlsx', size: '42 KB', date: 'Jan 10, 2025', type: 'xlsx' }
        ]
    },
    {
        id: '4',
        name: 'Fatima Usman',
        role: 'Parent',
        subtitle: 'Parent of Yusuf Usman (Grade 9A)',
        avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=80&h=80&q=80',
        online: true,
        email: 'fatima.usman@email.com',
        phone: '+234 805 678 9012',
        location: 'Lagos, Nigeria',
        studentName: 'Yusuf Usman',
        studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&h=80&q=80',
        studentGrade: 'Grade 9A',
        time: 'Yesterday',
        unreadCount: 0,
        firstMessageDate: 'March 15, 2025',
        messages: [
            { id: '1', text: 'Thank you for the update.', time: '4:15 PM', sender: 'them' }
        ],
        sharedFiles: []
    },
    {
        id: '5',
        name: 'Dr. Sarah Jenkins',
        role: 'Staff',
        subtitle: 'School Medical Officer',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=80&h=80&q=80',
        online: false,
        email: 'sarah.jenkins@klasso.com',
        phone: '+234 802 345 6789',
        location: 'Clinic, Main Building',
        time: 'Yesterday',
        unreadCount: 0,
        firstMessageDate: 'May 1, 2025',
        messages: [
            { id: '1', text: 'Meeting reminder for tomorrow regarding first aid kits.', time: '11:00 AM', sender: 'them' }
        ],
        sharedFiles: []
    },
    {
        id: '6',
        name: 'Bursary Office',
        role: 'Staff',
        subtitle: 'Bursary and Finance Dept.',
        avatar: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=80&h=80&q=80',
        online: true,
        email: 'bursar@klasso.com',
        phone: 'Ext 104',
        location: 'Admin Block, Ground Floor',
        time: 'May 23',
        unreadCount: 0,
        firstMessageDate: 'May 23, 2025',
        messages: [
            { id: '1', text: 'Your payment has been confirmed.', time: '9:00 AM', sender: 'them' }
        ],
        sharedFiles: [
            { name: 'Receipt_1042.pdf', size: '105 KB', date: 'May 23, 2025', type: 'pdf' }
        ]
    }
];

export default function MessagesPage() {
    const [conversations, setConversations] = React.useState<Conversation[]>(mockConversations);
    const [activeId, setActiveId] = React.useState('1');
    const [activeTab, setActiveTab] = React.useState<'Inbox' | 'Sent' | 'Announcements' | 'Archived'>('Inbox');
    const [filterChip, setFilterChip] = React.useState<'All' | 'Unread' | 'Students' | 'Parents' | 'Teachers' | 'Staff'>('All');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [inputValue, setInputValue] = React.useState('');

    const activeConversation = conversations.find(c => c.id === activeId) || conversations[0];

    // Filter conversations based on selected filters & search query
    const filteredConversations = React.useMemo(() => {
        return conversations.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesChip = filterChip === 'All' ||
                (filterChip === 'Unread' && c.unreadCount > 0) ||
                (filterChip === 'Parents' && c.role === 'Parent') ||
                (filterChip === 'Teachers' && c.role === 'Teacher') ||
                (filterChip === 'Staff' && c.role === 'Staff');

            return matchesSearch && matchesChip;
        });
    }, [conversations, filterChip, searchQuery]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newMessage: Message = {
            id: String(activeConversation.messages.length + 1),
            text: inputValue,
            time: timeString,
            sender: 'me'
        };

        setConversations(prev => prev.map(c => {
            if (c.id === activeConversation.id) {
                return {
                    ...c,
                    unreadCount: 0,
                    time: timeString,
                    messages: [...c.messages, newMessage]
                };
            }
            return c;
        }));

        setInputValue('');
        toast.success('Message sent');
    };

    // Mark active conversation as read when selected
    React.useEffect(() => {
        if (activeConversation.unreadCount > 0) {
            setConversations(prev => prev.map(c => {
                if (c.id === activeConversation.id) {
                    return { ...c, unreadCount: 0 };
                }
                return c;
            }));
        }
    }, [activeId]);

    const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[600px]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 pb-4 border-b border-gray-100">
                <div>
                    <h1 className="text-2.5xl font-black text-brandBlack tracking-tight">Messages</h1>
                    <p className="text-xs font-bold text-gray-400 mt-1">Communicate with students, parents, teachers and staff.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => toast.success('Starting a new message flow')}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-brandPurple text-white hover:bg-brandPurple/90 transition-all text-xs font-black shadow-sm"
                    >
                        <Plus className="h-4.5 w-4.5" />
                        <span>New Message</span>
                        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-100 gap-8 shrink-0">
                {(['Inbox', 'Sent', 'Announcements', 'Archived'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            toast.info(`Switched to ${tab}`);
                        }}
                        className={`pb-3 text-xs font-black relative transition-all ${
                            activeTab === tab ? 'text-brandPurple' : 'text-gray-400 hover:text-brandBlack'
                        }`}
                    >
                        {tab} {tab === 'Inbox' && totalUnread > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-brandPurple text-white text-[10px] font-black">
                                {totalUnread}
                            </span>
                        )}
                        {activeTab === tab && (
                            <motion.div 
                                layoutId="activeTabUnderline" 
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brandPurple" 
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Main Content Layout Container */}
            <div className="flex flex-1 gap-6 min-h-0">
                
                {/* ── Left Column: Conversation List ── */}
                <div className="w-[340px] flex flex-col gap-4 bg-white rounded-3xl border border-gray-100 p-4 shrink-0 min-h-0">
                    {/* Search & Filter Trigger */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-full rounded-2xl border border-gray-200 pl-4 pr-10 text-xs font-semibold text-brandBlack placeholder-gray-400 bg-white outline-none focus:border-brandPurple focus:ring-1 focus:ring-brandPurple"
                            />
                            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                        <button 
                            onClick={() => toast.info('Filters options toggled')}
                            className="h-10 w-10 flex items-center justify-center rounded-2xl border border-gray-200 bg-white hover:bg-slate-50 transition-colors shrink-0"
                        >
                            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                    </div>

                    {/* Filter Chips Scroll container */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide shrink-0">
                        {(['All', 'Unread', 'Parents', 'Teachers', 'Staff'] as const).map(chip => (
                            <button
                                key={chip}
                                onClick={() => setFilterChip(chip)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all border shrink-0 ${
                                    filterChip === chip 
                                        ? 'bg-brandPurple text-white border-brandPurple' 
                                        : 'bg-slate-50 text-gray-500 border-gray-100 hover:bg-slate-100'
                                }`}
                            >
                                {chip === 'Unread' && totalUnread > 0 ? `Unread (${totalUnread})` : chip}
                            </button>
                        ))}
                    </div>

                    {/* Scrollable Conversation List */}
                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1.5 scrollbar-hide">
                        {filteredConversations.length > 0 ? (
                            filteredConversations.map(conv => {
                                const isConvActive = conv.id === activeId;
                                const lastMsg = conv.messages[conv.messages.length - 1];

                                return (
                                    <div
                                        key={conv.id}
                                        onClick={() => setActiveId(conv.id)}
                                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                                            isConvActive 
                                                ? 'bg-slate-50 border-brandPurple/20' 
                                                : 'bg-white border-transparent hover:bg-slate-50/50'
                                        }`}
                                    >
                                        {/* Avatar area */}
                                        <div className="relative shrink-0">
                                            <div className="h-11 w-11 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-slate-100">
                                                <img src={conv.avatar} alt={conv.name} className="h-full w-full object-cover" />
                                            </div>
                                            {conv.online && (
                                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                                            )}
                                        </div>

                                        {/* Main details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <span className="text-xs font-bold text-brandBlack truncate leading-none">{conv.name}</span>
                                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                                        conv.role === 'Parent' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                                        conv.role === 'Teacher' ? 'bg-indigo-50 text-brandPurple border border-indigo-100' :
                                                        conv.role === 'Group' ? 'bg-slate-100 text-slate-600' :
                                                        'bg-teal-50 text-teal-600 border border-teal-100'
                                                    }`}>
                                                        {conv.role}
                                                    </span>
                                                </div>
                                                <span className="text-[9px] font-bold text-gray-400 shrink-0">{conv.time}</span>
                                            </div>
                                            <p className="text-[11px] font-semibold text-gray-500 mt-1.5 truncate">
                                                {lastMsg ? lastMsg.text : 'No messages yet'}
                                            </p>
                                        </div>

                                        {/* Unread dot */}
                                        {conv.unreadCount > 0 && (
                                            <span className="h-5 min-w-[20px] px-1 rounded-full bg-brandPurple text-white text-[9px] font-black flex items-center justify-center shrink-0">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-xs font-bold text-gray-400">
                                No conversations found.
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Middle Column: Chat Panel ── */}
                <div className="flex-1 flex flex-col bg-white rounded-3xl border border-gray-100 min-w-0 h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="relative shrink-0">
                                <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-100 bg-slate-100">
                                    <img src={activeConversation.avatar} alt={activeConversation.name} className="h-full w-full object-cover" />
                                </div>
                                {activeConversation.online && (
                                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                                )}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-black text-brandBlack truncate leading-none">{activeConversation.name}</span>
                                <span className="text-[10px] font-bold text-gray-400 mt-1 truncate">
                                    {activeConversation.subtitle} {activeConversation.online && ' • Online'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => toast.info('Starting voice call...')}
                                className="p-2 rounded-xl hover:bg-slate-50 text-gray-600 transition-colors"
                            >
                                <Phone className="h-4.5 w-4.5" />
                            </button>
                            <button 
                                onClick={() => toast.info('Starting video call...')}
                                className="p-2 rounded-xl hover:bg-slate-50 text-gray-600 transition-colors"
                            >
                                <Video className="h-4.5 w-4.5" />
                            </button>
                            <button 
                                onClick={() => toast.info('Info panel toggled')}
                                className="p-2 rounded-xl hover:bg-slate-50 text-gray-600 transition-colors"
                            >
                                <Info className="h-4.5 w-4.5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0 bg-slate-50/20">
                        <div className="flex justify-center my-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-slate-100 px-3 py-1 rounded-full">
                                Today
                            </span>
                        </div>

                        {activeConversation.messages.map((msg) => {
                            const isMe = msg.sender === 'me';
                            return (
                                <div 
                                    key={msg.id}
                                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                >
                                    <div 
                                        className={`max-w-[70%] px-4 py-3 rounded-2xl text-xs font-bold leading-relaxed relative ${
                                            isMe 
                                                ? 'bg-[#F3E8FF] text-brandPurple rounded-tr-none' 
                                                : 'bg-white text-brandBlack border border-gray-100 rounded-tl-none shadow-sm'
                                        }`}
                                    >
                                        <p>{msg.text}</p>
                                        
                                        <div className="flex items-center justify-end gap-1 mt-2.5">
                                            <span className={`text-[9px] font-bold ${isMe ? 'text-brandPurple/60' : 'text-gray-400'}`}>
                                                {msg.time}
                                            </span>
                                            {isMe && <CheckCheck className="h-3.5 w-3.5 text-brandPurple/80" />}
                                        </div>
                                    </div>

                                    {/* Reactions */}
                                    {msg.reactions && msg.reactions.length > 0 && (
                                        <div className="flex gap-1 mt-1">
                                            {msg.reactions.map((react, i) => (
                                                <span 
                                                    key={i} 
                                                    className="inline-flex items-center gap-1 bg-white border border-gray-150 px-2 py-0.5 rounded-full text-[10px] font-black shadow-sm"
                                                >
                                                    {react.emoji} {react.count}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Message Input Footer Form */}
                    <form 
                        onSubmit={handleSendMessage}
                        className="px-6 py-4 border-t border-gray-100 shrink-0 bg-white"
                    >
                        <div className="flex items-center gap-3 bg-slate-50/50 border border-gray-150 rounded-2xl px-4 py-2.5">
                            {/* Attachments buttons */}
                            <button 
                                type="button"
                                onClick={() => toast.info('File attachment clicked')}
                                className="text-gray-400 hover:text-brandBlack transition-colors p-1"
                            >
                                <Paperclip className="h-4.5 w-4.5" />
                            </button>
                            <button 
                                type="button"
                                onClick={() => toast.info('Image attachment clicked')}
                                className="text-gray-400 hover:text-brandBlack transition-colors p-1"
                            >
                                <ImageIcon className="h-4.5 w-4.5" />
                            </button>
                            <button 
                                type="button"
                                onClick={() => toast.info('Document attachment clicked')}
                                className="text-gray-400 hover:text-brandBlack transition-colors p-1"
                            >
                                <FileText className="h-4.5 w-4.5" />
                            </button>
                            
                            {/* Input Field */}
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="flex-1 bg-transparent text-xs font-semibold text-brandBlack placeholder-gray-400 outline-none border-none py-1.5"
                            />
                            
                            {/* Emoji trigger */}
                            <button 
                                type="button"
                                onClick={() => toast.info('Emoji picker coming soon')}
                                className="text-gray-400 hover:text-brandBlack transition-colors p-1"
                            >
                                <Smile className="h-4.5 w-4.5" />
                            </button>

                            {/* Send Button */}
                            <button
                                type="submit"
                                className="h-8 w-8 rounded-full bg-brandPurple text-white flex items-center justify-center hover:bg-brandPurple/90 transition-all shrink-0 active:scale-95"
                            >
                                <Send className="h-3.5 w-3.5 fill-white text-transparent rotate-0 translate-x-[1px]" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Right Column: Contact Details ── */}
                <div className="w-[300px] flex flex-col gap-6 bg-white rounded-3xl border border-gray-100 p-5 shrink-0 overflow-y-auto scrollbar-hide">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                        <span className="text-xs font-black text-brandBlack tracking-tight">Contact Details</span>
                        <button className="text-gray-400 hover:text-brandBlack transition-colors">
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Big Avatar details */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-3">
                            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-gray-150 bg-slate-100 shadow-md">
                                <img src={activeConversation.avatar} alt={activeConversation.name} className="h-full w-full object-cover" />
                            </div>
                            {activeConversation.online && (
                                <span className="absolute bottom-0 right-0 h-4.5 w-4.5 rounded-full bg-emerald-500 border-4 border-white" />
                            )}
                        </div>
                        <h3 className="text-sm font-black text-brandBlack">{activeConversation.name}</h3>
                        <div className="flex gap-2 items-center mt-2.5">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[9px] font-black uppercase">
                                {activeConversation.role}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">
                                {activeConversation.online ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>

                    {/* Info items list */}
                    <div className="space-y-3.5 text-xs">
                        <div className="flex items-center gap-3">
                            <MailIcon className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold text-gray-600 truncate">{activeConversation.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold text-gray-600">{activeConversation.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <LocationIcon className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold text-gray-600">{activeConversation.location}</span>
                        </div>
                    </div>

                    {/* Associated Student section */}
                    {activeConversation.studentName && (
                        <div className="border-t border-gray-100 pt-5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Student</span>
                            <div className="flex items-center justify-between gap-2 mt-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                        <img src={activeConversation.studentAvatar} alt={activeConversation.studentName} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold text-brandBlack truncate leading-none">{activeConversation.studentName}</span>
                                        <span className="text-[9px] font-bold text-gray-400 mt-1">{activeConversation.studentGrade}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => toast.info(`Navigating to profile of ${activeConversation.studentName}`)}
                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-[9px] font-black hover:bg-slate-50 transition-colors shadow-sm shrink-0"
                                >
                                    View Profile
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Shared Files list */}
                    <div className="border-t border-gray-100 pt-5 flex-1 min-h-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Shared Files</span>
                        <div className="mt-3.5 space-y-3">
                            {activeConversation.sharedFiles.length > 0 ? (
                                activeConversation.sharedFiles.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between gap-3 bg-white hover:bg-slate-50/50 p-1.5 rounded-xl border border-transparent transition-all">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border ${
                                                file.type === 'pdf' ? 'bg-red-50 text-red-500 border-red-100' :
                                                file.type === 'docx' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                                                'bg-emerald-50 text-emerald-500 border-emerald-100'
                                            }`}>
                                                <FileText className="h-4.5 w-4.5" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-bold text-brandBlack truncate leading-none">{file.name}</span>
                                                <span className="text-[9px] font-bold text-gray-400 mt-1">{file.size} • {file.date}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => toast.success(`Downloading ${file.name}`)}
                                            className="p-1.5 rounded-lg border border-gray-150 hover:bg-slate-100 text-gray-500 transition-colors cursor-pointer"
                                        >
                                            <Download className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[10px] font-bold text-gray-400 text-center py-4">No shared files found.</p>
                            )}
                        </div>
                    </div>

                    {/* Conversation Info metadata */}
                    <div className="border-t border-gray-100 pt-5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Conversation Info</span>
                        <div className="mt-3.5 space-y-3.5 text-xs text-gray-500">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="font-semibold">First message: <span className="text-brandBlack font-black">{activeConversation.firstMessageDate}</span></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MessageSquare className="h-4 w-4 text-gray-400" />
                                <span className="font-semibold">Messages count: <span className="text-brandBlack font-black">{activeConversation.messages.length} messages</span></span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

/* ── Custom helper SVGs to avoid missing icons ── */
const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const LocationIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);
