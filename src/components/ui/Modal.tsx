import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LucideIcon } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    icon?: LucideIcon;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, description, icon: Icon, children }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsMounted(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isMounted && !isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-brandBlack/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white border-4 border-brandBlack rounded-[32px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 pb-4 flex justify-between items-start">
                            <div className="flex gap-4">
                                {Icon && (
                                    <div className="w-12 h-12 bg-brandPurple border-2 border-brandBlack text-white rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                                        <Icon size={24} />
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">{title}</h2>
                                    {description && (
                                        <p className="text-xs font-bold text-brandBlack/60 uppercase tracking-widest mt-1">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-cream border-2 border-transparent hover:border-brandBlack rounded-xl transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 pt-4">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
