'use client';

import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

/**
 * Client-side providers wrapper.
 * Next.js root layout is a Server Component, so all client-side
 * context providers are grouped here and rendered as a single
 * 'use client' boundary.
 */
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <AuthProvider>
                <ThemeProvider>
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </ThemeProvider>
            </AuthProvider>
        </ToastProvider>
    );
}
