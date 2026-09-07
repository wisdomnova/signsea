'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { IconAnchor, IconArrowRight, IconCompass, IconLayoutDashboard, IconReceipt, IconShieldCheck } from '@tabler/icons-react'

export default function NotFound() {
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

      {/* Center Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full bg-white border border-black/10 p-8 sm:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative z-10"
      >
        {/* Top Blueprint Coordinates Header */}
        <div className="flex items-center justify-between border-b border-black/10 pb-6 mb-8 font-mono text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#0052FF]" />
            <span className="font-semibold text-black tracking-wider uppercase">SignSea Protocol</span>
          </div>
          <span className="tracking-widest uppercase text-neutral-400 font-medium">ERR_404 // NOT_FOUND</span>
        </div>

        {/* Icon & Error Headline */}
        <div className="flex items-start gap-5 mb-6">
          <div className="w-14 h-14 bg-black text-white flex items-center justify-center shrink-0">
            <IconAnchor size={28} stroke={1.75} />
          </div>
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider text-neutral-400 uppercase mb-1">
              [HTTP_STATUS_404]
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight leading-tight">
              Coordinate Not Found
            </h1>
          </div>
        </div>

        {/* Message */}
        <p className="text-neutral-600 text-base leading-relaxed mb-8">
          The destination you requested does not exist on the SignSea ledger or has been relocated.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-black text-white px-5 py-3.5 text-sm font-medium hover:bg-neutral-800 transition-colors group"
          >
            <span>Return to Home</span>
            <IconArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-neutral-50 text-black border border-neutral-200 px-5 py-3.5 text-sm font-medium hover:bg-neutral-100 transition-colors"
          >
            <IconLayoutDashboard size={16} />
            <span>Go to Dashboard</span>
          </Link>
        </div>

        {/* Quick Directory Links */}
        <div className="border-t border-black/10 pt-6">
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-3">
            Quick Navigation:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/projects"
              className="flex items-center gap-1.5 p-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700 transition-colors"
            >
              <IconCompass size={14} className="text-neutral-500" />
              <span>Projects</span>
            </Link>
            <Link
              href="/invoices"
              className="flex items-center gap-1.5 p-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700 transition-colors"
            >
              <IconReceipt size={14} className="text-neutral-500" />
              <span>Invoices</span>
            </Link>
            <Link
              href="/wallet"
              className="flex items-center gap-1.5 p-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700 transition-colors"
            >
              <IconShieldCheck size={14} className="text-neutral-500" />
              <span>Wallet</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="mt-8 font-mono text-xs text-neutral-400 tracking-wider">
        signsea.org // Industrial Escrow Infrastructure
      </div>
    </div>
  )
}
