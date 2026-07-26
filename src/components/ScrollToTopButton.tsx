import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[60] p-4 bg-brandYellow border-2 border-brandBlack rounded-2xl shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] hover:-translate-y-1 hover:-translate-x-1 active:shadow-none active:translate-y-0 active:translate-x-0 transition-all flex items-center justify-center"
            title="Scroll to Top"
        >
            <ArrowUp className="text-brandBlack" size={24} />
        </button>
    );
};
