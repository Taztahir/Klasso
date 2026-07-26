import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rect',
    width,
    height
}) => {
    const baseStyles = 'bg-brandBlack/5 animate-pulse overflow-hidden';

    const variantStyles = {
        text: 'rounded-md h-4 w-full',
        rect: 'rounded-2xl w-full h-full',
        circle: 'rounded-full h-12 w-12',
    };

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            style={{ width, height }}
        />
    );
};
