import { motion } from 'framer-motion';

export const Logo = ({ size = 24, className = "" }: { size?: number, className?: string }) => {
    return (
        <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            className={`flex items-center justify-center ${className}`}
        >
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="20" width="60" height="60" rx="12" fill="#A855F7" />
                <circle cx="50" cy="50" r="15" fill="#FACC15" />
                <rect x="45" y="45" width="10" height="25" rx="2" fill="#18181B" transform="rotate(-45 45 45)" />
                <path d="M30 70C30 70 40 60 50 60C60 60 70 70 70 70" stroke="white" strokeWidth="4" strokeLinecap="round" />
            </svg>
        </motion.div>
    );
};
