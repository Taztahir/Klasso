import { useRef, ReactNode, MouseEvent } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    className?: string;
}

export const MagneticButton = ({ children, className = "", onClick, ...props }: MagneticButtonProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        buttonRef.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
    };

    const handleMouseLeave = () => {
        if (!buttonRef.current) return;
        buttonRef.current.style.transform = '';
    };

    return (
        <button
            ref={buttonRef}
            className={`hover-lift ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            {...props}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
