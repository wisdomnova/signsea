'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { IconAnchor, IconArrowRight, IconLoader, IconMail } from '@tabler/icons-react'
import { motion } from 'framer-motion'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Mocking the reset flow as per minimalist industrial standards
    setTimeout(() => {
      setIsLoading(false)
      setIsSent(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-white text-[#111] font-sans antialiased flex flex-col items-center justify-center px-4 sm:px-6">
      <Link href="/" className="fixed top-6 sm:top-8 flex items-center gap-2 hover:opacity-70 transition-opacity z-50 flex-shrink-0">
        <IconAnchor className="w-4 sm:w-5 h-4 sm:h-5 text-black" />
        <span className="text-[13px] sm:text-[16px] md:text-[17px] font-semibold tracking-tight">SignSea</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] space-y-6 sm:space-y-8"
      >
        {!isSent ? (
          <>
            <div className="space-y-2 text-center">
              <h1 className="text-[22px] sm:text-[24px] md:text-[26px] font-bold tracking-tight">Reset password</h1>
              <p className="text-[13px] sm:text-[14px] text-gray-500 font-medium">Enter your email and we&apos;ll send you a link</p>
            </div>

            <form onSubmit={handleReset} className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] sm:text-[12px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email</label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 sm:h-12 px-3 sm:px-4 bg-[#F5F5F7] border-none rounded-lg sm:rounded-xl text-[13px] sm:text-[14px] font-medium focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  placeholder="name@company.com"
                />
              </div>

              <button 
                disabled={isLoading}
                className="w-full h-11 sm:h-12 bg-black text-white text-[13px] sm:text-[14px] font-medium rounded-full flex items-center justify-center gap-2 hover:bg-[#333] transition-all shadow-sm disabled:opacity-50"
              >
                {isLoading ? <IconLoader className="w-4 h-4 animate-spin" /> : 'Send reset link'}
                {!isLoading && <IconArrowRight size={14} />}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-4 sm:space-y-6 text-center">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-[#F5F5F7] rounded-full flex items-center justify-center mx-auto">
              <IconMail className="w-4 sm:w-5 h-4 sm:h-5 text-black" />
            </div>
            <div className="space-y-2">
              <h1 className="text-[22px] sm:text-[24px] md:text-[26px] font-bold tracking-tight">Check your email</h1>
              <p className="text-[12px] sm:text-[14px] text-gray-500 font-medium">We sent a reset link to <span className="text-black font-semibold">{email}</span></p>
            </div>
            <button 
              onClick={() => setIsSent(false)}
              className="text-[12px] sm:text-[13px] font-medium text-gray-400 hover:text-black transition-colors"
            >
              Didn&apos;t receive it? Try again
            </button>
          </div>
        )}

        <div className="pt-3 sm:pt-4 text-center">
          <Link href="/auth/login" className="text-[12px] sm:text-[13px] text-gray-500 font-medium hover:text-black transition-colors">
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
