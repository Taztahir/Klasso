'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type AuthModalTab = 'login' | 'signup';

interface AuthModalContextType {
    isOpen: boolean;
    activeTab: AuthModalTab;
    openModal: (tab?: AuthModalTab) => void;
    closeModal: () => void;
    setActiveTab: (tab: AuthModalTab) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const useAuthModal = () => {
    const ctx = useContext(AuthModalContext);
    if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider');
    return ctx;
};

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<AuthModalTab>('login');

    const openModal = useCallback((tab: AuthModalTab = 'login') => {
        setActiveTab(tab);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <AuthModalContext.Provider value={{ isOpen, activeTab, openModal, closeModal, setActiveTab }}>
            {children}
        </AuthModalContext.Provider>
    );
};
