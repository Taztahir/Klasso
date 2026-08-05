'use client';

import { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollToTopButton } from './ScrollToTopButton';
import { LegalModal } from './LegalModal';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [modalType, setModalType] = useState<'privacy' | 'terms' | 'cookie' | 'about' | 'help' | 'blog' | null>(null);

    const openModal = (type: 'privacy' | 'terms' | 'cookie' | 'about' | 'help' | 'blog') => setModalType(type);
    const closeModal = () => setModalType(null);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer onOpenModal={openModal} />
            <ScrollToTopButton />

            <LegalModal
                isOpen={modalType !== null}
                onClose={closeModal}
                type={modalType}
            />
        </div>
    );
};
