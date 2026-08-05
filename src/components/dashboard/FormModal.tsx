'use client';

import * as React from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface FormModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    onSubmit: (e: React.FormEvent) => void;
    submitText?: string;
    loading?: boolean;
    children: React.ReactNode;
}

export function FormModal({
    isOpen,
    onOpenChange,
    title,
    description,
    onSubmit,
    submitText = 'Save Changes',
    loading = false,
    children,
}: FormModalProps) {
    /* Close on Escape */
    React.useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !loading) onOpenChange(false);
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKey);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, loading, onOpenChange]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* ── Backdrop ── */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[80] h-full"
                        style={{ background: 'rgba(13,14,20,0.45)', backdropFilter: 'blur(6px)' }}
                        onClick={() => !loading && onOpenChange(false)}
                        aria-hidden="true"
                    />

                    {/* ── Centered modal panel ── */}
                    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            key="modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="form-modal-title"
                            initial={{ opacity: 0, scale: 0.94, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 20 }}
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            className="pointer-events-auto w-full max-w-lg"
                        >
                            <form
                                onSubmit={onSubmit}
                                className="relative flex flex-col rounded-3xl overflow-hidden border-2 border-brandBlack"
                                style={{
                                    background: '#FFFFFF',
                                    boxShadow: '8px 8px 0px 0px rgba(13,14,20,1)',
                                    maxHeight: '90dvh',
                                }}
                            >
                                {/* ── Accent top bar ── */}
                                <div
                                    className="h-1 w-full shrink-0"
                                    style={{ background: 'linear-gradient(90deg, var(--brand-purple), var(--brand-yellow), var(--brand-green))' }}
                                />

                                {/* ── Header ── */}
                                <div
                                    className="flex items-start justify-between gap-4 px-7 py-5 shrink-0 border-b-2 border-brandBlack"
                                    style={{ background: 'var(--cream)' }}
                                >
                                    <div>
                                        <h2
                                            id="form-modal-title"
                                            className="text-xl font-black text-brandBlack tracking-tight"
                                        >
                                            {title}
                                        </h2>
                                        {description && (
                                            <p className="text-xs font-bold text-brandBlack/50 mt-1 leading-relaxed">
                                                {description}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => !loading && onOpenChange(false)}
                                        disabled={loading}
                                        aria-label="Close"
                                        className="shrink-0 mt-0.5 w-8 h-8 rounded-xl border-2 border-brandBlack bg-white flex items-center justify-center hover:bg-cream transition-colors shadow-[2px_2px_0px_0px_rgba(13,14,20,1)] active:shadow-none active:translate-x-px active:translate-y-px disabled:opacity-40"
                                    >
                                        <X className="h-4 w-4 text-brandBlack" />
                                    </button>
                                </div>

                                {/* ── Scrollable body ── */}
                                <div className="flex-1 overflow-y-auto px-7 py-6 space-y-4">
                                    {children}
                                </div>

                                {/* ── Footer ── */}
                                <div
                                    className="flex gap-3 px-7 py-5 shrink-0 border-t-2 border-brandBlack"
                                    style={{ background: 'var(--cream)' }}
                                >
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => onOpenChange(false)}
                                        disabled={loading}
                                        className="flex-1 border-2 border-brandBlack bg-white text-brandBlack font-black rounded-xl py-5 shadow-[3px_3px_0px_0px_rgba(13,14,20,1)] hover:bg-cream active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(13,14,20,1)] transition-all"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 border-2 border-brandBlack bg-brandPurple text-white font-black rounded-xl py-5 shadow-[3px_3px_0px_0px_rgba(13,14,20,1)] hover:bg-brandPurple/90 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(13,14,20,1)] transition-all"
                                    >
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                        ) : (
                                            submitText
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
