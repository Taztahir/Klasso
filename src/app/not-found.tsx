import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-16 bg-cream">
            <div className="max-w-md w-full bg-white border-2 border-brandBlack rounded-[32px] p-8 sm:p-10 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">

                {/* Top Decorative Tag */}
                <div className="inline-block bg-brandBlack text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6">
                    Page Not Found
                </div>

                {/* 404 Headline */}
                <h1 className="text-6xl sm:text-7xl font-black text-brandBlack tracking-tight mb-2 leading-none">
                    404<span className="text-brandPurple">.</span>
                </h1>

                <p className="text-brandBlack/70 font-bold text-lg mb-2">
                    You&apos;ve strayed off the map!
                </p>

                <p className="text-brandBlack/60 font-medium text-sm mb-8 leading-relaxed">
                    The page you&apos;re looking for doesn&apos;t exist or might have been moved.
                </p>

                {/* Action Button */}
                <Link
                    href="/"
                    className="inline-flex items-center justify-center w-full bg-brandBlack text-white py-4 rounded-2xl font-bold text-sm shadow-[4px_4px_0px_0px_rgba(139,92,246,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-[0.98]"
                >
                    Back to Home Page →
                </Link>
            </div>
        </div>
    );
}
