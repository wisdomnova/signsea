'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { IconAnchor, IconArrowRight, IconLoader } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await apiClient.login(email, password) as any
      apiClient.setAccessToken(response.accessToken)
      
      // Store user initials
      if (response.user?.firstName && response.user?.lastName) {
        const initials = `${response.user.firstName[0]}${response.user.lastName[0]}`.toUpperCase()
        localStorage.setItem('userInitials', initials)
        localStorage.setItem('userName', `${response.user.firstName} ${response.user.lastName}`)
      }
      
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
        <div className="space-y-2 text-center">
          <h1 className="text-[22px] sm:text-[24px] md:text-[26px] font-bold tracking-tight">Welcome back</h1>
          <p className="text-[13px] sm:text-[14px] text-gray-500 font-medium">Log in to your account to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
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

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] sm:text-[12px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
              <Link href="/auth/reset" className="text-[11px] sm:text-[12px] font-medium text-gray-400 hover:text-black">Forgot?</Link>
            </div>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 sm:h-12 px-3 sm:px-4 bg-[#F5F5F7] border-none rounded-lg sm:rounded-xl text-[13px] sm:text-[14px] font-medium focus:ring-2 focus:ring-black/5 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-2 sm:p-3 bg-red-50 text-red-500 text-[12px] sm:text-[13px] font-medium rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button 
            disabled={isLoading}
            className="w-full h-11 sm:h-12 bg-black text-white text-[13px] sm:text-[14px] font-medium rounded-full flex items-center justify-center gap-2 hover:bg-[#333] transition-all shadow-sm disabled:opacity-50"
          >
            {isLoading ? <IconLoader className="w-4 h-4 animate-spin" /> : 'Log in'}
            {!isLoading && <IconArrowRight size={14} />}
          </button>
        </form>

        <div className="pt-3 sm:pt-4 text-center">
          <p className="text-[12px] sm:text-[13px] text-gray-500 font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-black hover:underline underline-offset-4">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
