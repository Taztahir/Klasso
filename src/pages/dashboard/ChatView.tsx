import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Sparkles,
    ThumbsUp,
    Copy,
    Edit2,
    Check,
    Mic,
    RotateCcw,
    Image as ImageIcon,
    Music,
    Zap,
    GraduationCap,
    PenTool,
    Plus,
    Grid,
    ChevronDown,
} from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import { aiService } from '../../services/aiService';
import { chatService } from '../../services/chatService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

/* ─── Types ─────────────────────────────────────────── */
interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: Date;
    isLiked?: boolean;
    isStreaming?: boolean;
}

/* ─── Streaming word-by-word animation ─────────────── */
const StreamingText = ({ text, onDone }: { text: string; onDone: () => void }) => {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);
    const idx = useRef(0);

    useEffect(() => {
        idx.current = 0;
        setDisplayed('');
        setDone(false);
        const words = text.split(' ');
        const interval = setInterval(() => {
            if (idx.current < words.length) {
                setDisplayed(prev => (idx.current === 0 ? words[0] : prev + ' ' + words[idx.current]));
                idx.current++;
            } else {
                clearInterval(interval);
                setDone(true);
                onDone();
            }
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return (
        <div className="prose-premium max-w-none leading-relaxed">
            <ReactMarkdown>{displayed || '…'}</ReactMarkdown>
            {!done && (
                <span className="inline-block w-2 h-4 bg-[var(--brand-purple)] rounded-sm ml-0.5 animate-pulse align-middle" />
            )}
        </div>
    );
};

/* ─── Shimmer skeleton ──────────────────────────────── */
const ThinkingShimmer = () => (
    <div className="flex gap-4 items-start px-4 md:px-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-purple)] to-purple-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
            <Sparkles size={14} className="text-white fill-white" />
        </div>
        <div className="flex-1 space-y-2.5 pt-1 max-w-[600px]">
            <div className="h-3 rounded-full skeleton w-3/4" />
            <div className="h-3 rounded-full skeleton w-full" />
            <div className="h-3 rounded-full skeleton w-2/3" />
        </div>
    </div>
);

/* ─── Prompt suggestions ─────────────────────────────── */

/* ═══════════════════════════════════════════════════════
   Main ChatView Component
════════════════════════════════════════════════════════ */
export const ChatView = () => {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [streamingId, setStreamingId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You';
    const avatarUrl = user?.user_metadata?.avatar_url;
    const initials = (displayName[0] || 'U').toUpperCase();

    /* Init chat session */
    useEffect(() => {
        const init = async () => {
            try {
                const sessions = await chatService.getSessions();
                let session = sessions.length > 0 ? sessions[0] : await chatService.createSession('Study Session');
                setSessionId(session.id);
                const history = await chatService.getMessages(session.id);
                if (history.length > 0) {
                    setMessages(history.map(m => ({
                        id: m.id,
                        role: m.role,
                        content: m.content,
                        timestamp: new Date(m.created_at),
                        isLiked: m.is_liked,
                    })));
                }
            } catch (err) {
                console.error('Chat init error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    /* Auto-scroll */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isSending]);

    /* Auto-resize textarea */
    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = 'auto';
        ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }, [input]);

    /* Send message */
    const handleSend = useCallback(async (override?: string) => {
        const text = (override ?? input).trim();
        if (!text || isSending || !sessionId) return;
        setInput('');
        setIsSending(true);

        const tempUserId = `user-${Date.now()}`;
        const newUserMsg: Message = { id: tempUserId, role: 'user', content: text, timestamp: new Date() };
        setMessages(prev => [...prev, newUserMsg]);

        try {
            const userMsg = await chatService.saveMessage(sessionId, 'user', text);
            setMessages(prev => prev.map(m => m.id === tempUserId ? { ...m, id: userMsg.id } : m));

            const history = [...messages.filter(m => m.id !== 'welcome'), { role: 'user' as const, content: text }];
            const response = await aiService.getChatResponse(history.map(m => ({ role: m.role, content: m.content })));

            const botMsg = await chatService.saveMessage(sessionId, 'model', response);
            const streamId = botMsg.id;
            setStreamingId(streamId);
            setMessages(prev => [...prev, {
                id: streamId,
                role: 'model',
                content: response,
                timestamp: new Date(botMsg.created_at || Date.now()),
                isStreaming: true,
            }]);
        } catch {
            showToast('AI Error', 'Failed to get a response. Please try again.', 'error');
        } finally {
            setIsSending(false);
        }
    }, [input, isSending, sessionId, messages, showToast]);

    const handleStreamDone = useCallback((id: string) => {
        setStreamingId(null);
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isStreaming: false } : m));
    }, []);

    /* Key handler */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    /* Copy */
    const handleCopy = (content: string, id: string) => {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    /* Like */
    const handleLike = async (id: string, current?: boolean) => {
        try {
            await chatService.toggleLike(id, !current);
            setMessages(prev => prev.map(m => m.id === id ? { ...m, isLiked: !current } : m));
        } catch { /* silent */ }
    };


    /* Edit */
    const saveEdit = async () => {
        if (!editingId) return;
        try {
            await chatService.updateMessage(editingId, editContent);
            setMessages(prev => prev.map(m => m.id === editingId ? { ...m, content: editContent } : m));
            setEditingId(null);
        } catch {
            showToast('Error', 'Failed to update message.', 'error');
        }
    };

    const isEmpty = messages.length === 0 && !isLoading;

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] relative bg-transparent">

            {/* ── Sticky sub-header ───────────────────────── */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-transparent flex-shrink-0">
                {/* Minimal subheader */}
            </div>

            {/* ── Message thread ───────────────────────────── */}
            <div
                role="log"
                aria-live="polite"
                aria-label="Chat messages"
                className="flex-1 overflow-y-auto scrollbar-hide"
            >
                <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8 space-y-8">

                    {/* ── Loading init skeleton ─────────────── */}
                    {isLoading && (
                        <div className="space-y-6">
                            {[0.4, 0.7, 1].map((opacity, i) => (
                                <div key={i} className="flex gap-4" style={{ opacity }}>
                                    <div className="w-8 h-8 rounded-full skeleton flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 skeleton rounded-full w-1/2" />
                                        <div className="h-3 skeleton rounded-full w-3/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Empty state / welcome ─────────────── */}
                    {isEmpty && (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-left max-w-2xl mx-auto space-y-12 animate-fade-in">
                            <div className="w-full">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles size={24} className="text-[#4285F4] animate-pulse" />
                                    <h2 className="text-4xl font-medium text-[var(--text-primary)]">
                                        Hi {displayName.split(' ')[0]}
                                    </h2>
                                </div>
                                <h1 className="text-5xl font-medium text-[var(--text-muted)] leading-tight">
                                    Where should we start?
                                </h1>
                            </div>

                            {/* Suggestion pills at the bottom center */}
                            <div className="flex flex-wrap items-center justify-center gap-4 mt-auto">
                                {[
                                    { label: 'Create image', icon: ImageIcon, color: 'text-orange-400' },
                                    { label: 'Create music', icon: Music, color: 'text-pink-400' },
                                    { label: 'Boost my day', icon: Zap, color: 'text-yellow-400' },
                                    { label: 'Help me learn', icon: GraduationCap, color: 'text-blue-400' },
                                    { label: 'Write anything', icon: PenTool, color: 'text-green-400' },
                                ].map(({ label, icon: Icon, color }) => (
                                    <button
                                        key={label}
                                        onClick={() => handleSend(label)}
                                        className="flex items-center gap-2.5 px-6 py-3 bg-[#1e1f20] hover:bg-[#2b2c2d] border border-transparent rounded-full text-sm font-medium text-[#e3e3e3] transition-all hover:shadow-md active:scale-95"
                                    >
                                        <Icon size={18} className={color} />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Messages ─────────────────────────── */}
                    {!isLoading && messages.map((msg) => (
                        <article key={msg.id} className={`flex gap-3 group animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                            {/* Avatar */}
                            {msg.role === 'model' ? (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-purple)] to-purple-400 flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-500/20 self-start mt-0.5">
                                    <Sparkles size={13} className="text-white fill-white" />
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 self-start mt-0.5 border-2 border-white shadow-md bg-[var(--brand-purple)]">
                                    {avatarUrl
                                        ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                                        : <span className="w-full h-full flex items-center justify-center text-white text-[11px] font-black">{initials}</span>
                                    }
                                </div>
                            )}

                            {/* Bubble */}
                            <div className={`flex-1 min-w-0 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                                {/* Role label */}
                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1.5 px-1">
                                    {msg.role === 'user' ? displayName : 'Study Lit AI'}
                                </p>

                                {/* Edit mode */}
                                {editingId === msg.id ? (
                                    <div className="w-full space-y-3 bg-white border border-[var(--brand-purple)]/20 p-4 rounded-2xl shadow-sm">
                                        <textarea
                                            value={editContent}
                                            onChange={e => setEditContent(e.target.value)}
                                            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium leading-relaxed resize-none min-h-[80px]"
                                            autoFocus
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setEditingId(null)} className="px-4 py-1.5 text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">CANCEL</button>
                                            <button onClick={saveEdit} className="px-5 py-1.5 bg-[var(--brand-purple)] text-white rounded-lg text-[10px] font-black tracking-widest hover:opacity-90 transition-all shadow-md shadow-purple-500/20">SAVE</button>
                                        </div>
                                    </div>
                                ) : msg.role === 'user' ? (
                                    /* User bubble */
                                    <div className="inline-block max-w-[85%] bg-[var(--brand-purple)] text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md shadow-purple-500/15">
                                        <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                ) : (
                                    /* AI bubble with streaming */
                                    <div className="max-w-none">
                                        {msg.isStreaming && streamingId === msg.id ? (
                                            <StreamingText text={msg.content} onDone={() => handleStreamDone(msg.id)} />
                                        ) : (
                                            <div className="prose-premium max-w-none leading-relaxed text-[var(--text-primary)]">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Action bar — hover reveal */}
                                <div className={`flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-1">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <div className="flex items-center gap-0.5">
                                        <button onClick={() => handleCopy(msg.content, msg.id)} aria-label="Copy" className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-all" title="Copy">
                                            {copiedId === msg.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                        </button>
                                        <button onClick={() => handleLike(msg.id, msg.isLiked)} aria-label="Like" className={`p-1.5 rounded-lg transition-all ${msg.isLiked ? 'text-[var(--brand-purple)] bg-[var(--brand-purple)]/10' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5'}`} title="Like">
                                            <ThumbsUp size={12} className={msg.isLiked ? 'fill-current' : ''} />
                                        </button>
                                        {msg.role === 'user' && (
                                            <button onClick={() => { setEditingId(msg.id); setEditContent(msg.content); }} aria-label="Edit" className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-all" title="Edit">
                                                <Edit2 size={12} />
                                            </button>
                                        )}
                                        {msg.role === 'model' && (
                                            <button onClick={() => handleSend(messages.find(m => m.role === 'user')?.content || '')} aria-label="Regenerate" className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-all" title="Regenerate">
                                                <RotateCcw size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}

                    {/* ── AI Thinking shimmer ───────────────── */}
                    {isSending && <ThinkingShimmer />}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* ── Floating Input Bar ───────────────────────── */}
            <div className="flex-shrink-0 px-4 md:px-6 pb-4 pt-2 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/90 to-transparent">
                <div className="max-w-[800px] mx-auto">
                    <input type="file" ref={fileInputRef} className="hidden" aria-label="Attach file" />
                    <form
                        onSubmit={e => { e.preventDefault(); handleSend(); }}
                        className="relative"
                    >
                        <div className="relative flex flex-col bg-[#1e1f20] rounded-[32px] overflow-hidden transition-all duration-300 focus-within:bg-[#2b2c2d]">

                            {/* Textarea */}
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask Gemini 3"
                                rows={1}
                                disabled={isSending}
                                aria-label="Chat input"
                                className="w-full bg-transparent px-6 pt-5 pb-2 text-[16px] text-[#e3e3e3] placeholder:text-[#8e918f] border-none focus:ring-0 focus:outline-none resize-none max-h-[200px] leading-snug disabled:opacity-50"
                                style={{ minHeight: '64px' }}
                            />

                            {/* Bottom toolbar */}
                            <div className="flex items-center justify-between px-4 pb-4 pt-1">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2.5 rounded-full text-[#e3e3e3] hover:bg-white/10 transition-all"
                                    >
                                        <Plus size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[#c4c7c5] hover:bg-white/5 transition-all text-xs border border-[#444746]"
                                    >
                                        <Grid size={14} />
                                        <span>Tools</span>
                                    </button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#c4c7c5] hover:bg-white/5 transition-all text-xs"
                                    >
                                        <span>Fast</span>
                                        <ChevronDown size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        className="p-2.5 rounded-full text-[#e3e3e3] hover:bg-white/10 transition-all"
                                    >
                                        <Mic size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Glow ring on focus */}
                        <div className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 opacity-0 focus-within:opacity-100 ring-1 ring-[var(--brand-purple)]/20" />
                    </form>

                    <p className="text-center text-[8px] font-medium text-[var(--text-muted)] mt-2 opacity-60">
                        Study Lit AI can make mistakes. Verify important information.
                    </p>
                </div>
            </div>
        </div>
    );
};

