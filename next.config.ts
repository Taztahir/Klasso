import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Use Turbopack for significantly faster dev compilation
    turbopack: {},

    // Allow importing SVGs and other assets
    images: {
        remotePatterns: [],
    },

    // Tell the compiler to tree-shake barrel imports from heavy libraries.
    // This prevents Webpack/Turbopack from resolving the entire library
    // when you only import a few symbols.
    experimental: {
        optimizePackageImports: ['framer-motion', 'lucide-react'],
    },
};

export default nextConfig;

