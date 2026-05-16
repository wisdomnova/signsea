'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconAnchor, IconArrowRight } from '@tabler/icons-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full"
      >
        {/* Brand Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 shadow-sm text-black">
            <IconAnchor size={32} stroke={1.5} />
          </div>
        </div>

        {/* Error Code */}
        <span className="text-sm font-medium tracking-widest uppercase text-neutral-400 mb-4 block">
          Error 404
        </span>

        {/* Messaging */}
        <h1 className="text-4xl font-bold text-black tracking-tight mb-4">
          Lost at sea
        </h1>
        <p className="text-neutral-500 mb-10 leading-relaxed">
          The page you're looking for has drifted away or never existed. 
          Let's guide you back to safe harbor.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-neutral-800 transition-colors group"
          >
            Return Home
            <IconArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-white text-black border border-neutral-200 px-6 py-3 rounded-xl font-medium hover:bg-neutral-50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Search Suggestion (Optional context) */}
        <div className="mt-12 pt-12 border-t border-neutral-100">
          <p className="text-sm text-neutral-400 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Projects', 'Payments', 'Legal'].map((tag) => (
              <span key={tag} className="text-xs font-medium text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Subtle Background Element */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neutral-50 rounded-full blur-[120px] opacity-50" />
      </div>
    </div>
  );
}
