import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import '@/index.css';
import { Providers } from '@/components/Providers';

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
    weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
    title: 'Klasso — School Management SaaS for Private Schools',
    description:
        'Klasso is a modern school management platform built for private schools. Streamline administration, track performance, and empower educators.',
    icons: {
        icon: '/logo.svg',
        shortcut: '/logo.svg',
        apple: '/logo.svg',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning className={outfit.variable}>
            <body className="min-h-screen bg-cream text-brandBlack font-sans" suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
