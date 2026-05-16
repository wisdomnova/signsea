'use client'

import React from 'react'
import Link from 'next/link'
import { IconAnchor } from '@tabler/icons-react'

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-black selection:text-white">
      {/* Mini Header */}
      <nav className="h-20 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <IconAnchor size={24} className="text-black" />
            <span className="text-[20px] font-bold tracking-tight text-black">SignSea</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
              Secure Payment Portal
            </span>
          </div>
        </div>
      </nav>

      <main className="px-6 py-10">
        {children}
      </main>

      {/* Mini Footer */}
      <footer className="py-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[12px] text-gray-400 font-medium">
            © 2026 SignSea Technology. All rights secured.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/legal/terms" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">Terms</Link>
            <Link href="/legal/privacy" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
