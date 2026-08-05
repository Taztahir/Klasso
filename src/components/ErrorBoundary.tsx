'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, RotateCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error boundary catch:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div
                    className="relative flex min-h-screen w-full items-center justify-center px-6 py-12 font-sans overflow-hidden"
                    style={{ background: 'var(--cream, #FAF8F5)' }}
                >
                    {/* ── Background Floating Accent Shapes ── */}
                    <div className="absolute top-10 left-10 pointer-events-none opacity-40 max-sm:hidden">
                        <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                            <circle cx="50" cy="50" r="40" fill="#F472B6" />
                            <path d="M35 35L65 65" stroke="#18181B" strokeWidth="6" strokeLinecap="round" />
                        </svg>
                    </div>

                    <div className="absolute bottom-12 right-12 pointer-events-none opacity-40 max-sm:hidden">
                        <svg width="90" height="90" viewBox="0 0 100 100" fill="none">
                            <rect x="15" y="15" width="70" height="70" rx="16" fill="var(--brand-yellow, #FBBF24)" stroke="#18181B" strokeWidth="4" transform="rotate(12 50 50)" />
                        </svg>
                    </div>

                    {/* ── Main Error Card ── */}
                    <div className="relative z-10 w-full max-w-[440px] text-center">
                        <div className="rounded-[32px] border-2 border-brandBlack bg-white p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

                            {/* Animated Error Badge */}
                            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-brandBlack shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ background: '#FF4D4D' }}>
                                <AlertTriangle className="h-10 w-10 text-white animate-bounce" />
                            </div>

                            {/* Heading */}
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-brandBlack">
                                Something went wrong<span className="italic font-light" style={{ color: 'var(--brand-purple, #8B5CF6)' }}>.</span>
                            </h2>

                            {/* Description */}
                            <p className="mt-3 text-sm font-medium text-brandBlack/60 leading-relaxed">
                                The app ran into an unexpected hiccup. Don't worry, your data is safe and sound!
                            </p>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={this.handleReset}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-brandBlack bg-white py-3.5 text-sm font-black text-brandBlack shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-[0.98]"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Try Again
                                </button>

                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-brandBlack py-3.5 text-sm font-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-[0.98]"
                                    style={{ background: 'var(--brand-purple, #8B5CF6)' }}
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                    Reload Page
                                </button>
                            </div>

                            {/* Subtext Link */}
                            <div className="mt-6">
                                <a
                                    href="/"
                                    className="text-xs font-bold text-brandBlack/50 hover:text-brandBlack hover:underline transition-colors"
                                >
                                    Return to Home Screen →
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}