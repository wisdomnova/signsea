'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { IconAlertTriangle, IconRefresh, IconArrowLeft } from '@tabler/icons-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('SignSea Client Error caught by boundary:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#fafafa] text-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans select-none">
      {/* Subtle Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Center Diagnostic Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full bg-white border border-black/10 p-8 sm:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative z-10"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-black/10 pb-6 mb-8 font-mono text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-500" />
            <span className="font-semibold text-black tracking-wider uppercase">System Diagnostic</span>
          </div>
          <span className="tracking-widest uppercase text-rose-600 font-medium">ERR_500 // EXCEPTION</span>
        </div>

        {/* Headline & Warning Icon */}
        <div className="flex items-start gap-5 mb-6">
          <div className="w-14 h-14 bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <IconAlertTriangle size={28} stroke={1.75} />
          </div>
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider text-rose-500 uppercase mb-1">
              [SYSTEM_UNEXPECTED_STATE]
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight leading-tight">
              Execution Interrupted
            </h1>
          </div>
        </div>

        {/* Description */}
        <p className="text-neutral-600 text-base leading-relaxed mb-6">
          An unexpected error occurred during operation execution. The system has prevented partial state modifications to preserve ledger integrity.
        </p>

        {/* Error Code Diagnostic Box (if available) */}
        {error?.digest && (
          <div className="bg-neutral-50 border border-neutral-200 p-3 mb-8 font-mono text-xs text-neutral-600 flex items-center justify-between">
            <span>DIAGNOSTIC_DIGEST:</span>
            <span className="font-semibold text-neutral-800">{error.digest}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 bg-black text-white px-5 py-3.5 text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <IconRefresh size={16} />
            <span>Retry Operation</span>
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-neutral-50 text-black border border-neutral-200 px-5 py-3.5 text-sm font-medium hover:bg-neutral-100 transition-colors"
          >
            <IconArrowLeft size={16} />
            <span>Return to Safety</span>
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-8 font-mono text-xs text-neutral-400 tracking-wider">
        signsea.org // Industrial Escrow Infrastructure
      </div>
    </div>
  )
}
