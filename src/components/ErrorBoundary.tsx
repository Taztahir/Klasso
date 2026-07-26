import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-cream p-6">
                    <div className="max-w-md w-full bg-white border-2 border-brandBlack rounded-[40px] p-12 text-center shadow-xl">
                        <div className="w-20 h-20 bg-brandPink rounded-full border-2 border-brandBlack flex items-center justify-center mx-auto mb-8 animate-wiggle">
                            <AlertTriangle className="w-10 h-10 text-brandBlack" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
                        <p className="text-brandBlack/60 font-medium mb-12">
                            The AI had a small hiccup. Don't worry, your data is safe.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full flex items-center justify-center gap-2 bg-brandBlack text-white py-4 rounded-xl font-bold hover:bg-brandPurple transition-all"
                        >
                            <RefreshCcw size={18} />
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
