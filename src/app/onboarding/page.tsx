'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Loader2, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function OnboardingPage() {
  const [schoolName, setSchoolName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/setup-school', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schoolName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete school setup');
      }

      // Hard refresh to reload router/middleware states with new profile schema
      window.location.href = '/dashboard/overview';
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center px-6 py-12 font-sans overflow-hidden bg-cream"
      style={{ background: 'var(--cream)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="relative z-10 w-full max-w-[440px] rounded-3xl border-2 border-brandBlack bg-white p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-brandBlack bg-brandYellow/20 mb-4">
            <Building2 className="w-7 h-7 text-brandPurple" />
          </div>
          <h1 className="text-2.5xl font-black tracking-tight text-brandBlack">
            Onboard Your School
          </h1>
          <p className="mt-2 text-xs font-semibold text-brandBlack/50">
            Tell us about your school to configure your portal tenant.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl border-2 border-red-400 bg-red-50 text-red-600 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="school-name" className="text-xs font-bold text-brandBlack ml-1">
              School Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brandBlack/30" />
              <input
                id="school-name"
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. Greenfield Academy"
                required
                className="w-full rounded-xl border-2 border-brandBlack pl-11 pr-4 py-3.5 text-xs font-bold text-brandBlack placeholder:text-brandBlack/30 focus:outline-none focus:ring-2 bg-cream"
                style={{ '--tw-ring-color': 'var(--brand-green)' } as React.CSSProperties}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !schoolName.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-brandBlack bg-brandPurple py-4 text-xs font-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-[0.97] disabled:opacity-50 cursor-pointer"
            style={{ background: 'var(--brand-purple)' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Configure School Tenant
          </button>

          <button
            type="button"
            onClick={async () => {
              await signOut();
              router.push('/login');
            }}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-brandBlack bg-white py-3.5 text-xs font-bold text-brandBlack shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-[0.97] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </motion.div>
    </div>
  );
}
