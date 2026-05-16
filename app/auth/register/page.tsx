'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { IconAnchor, IconArrowRight, IconLoader, IconCircleCheckFilled } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Email/Password, 2: Name/Details
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) setStep(2)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await apiClient.register(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName
      ) as any
      apiClient.setAccessToken(response.accessToken)
      
      // Store user initials
      const initials = `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase()
      localStorage.setItem('userInitials', initials)
      localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`)
      
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#111] font-sans antialiased flex flex-col items-center justify-center px-4 sm:px-6">
      {/* Brand Header */}
      <Link href="/" className="fixed top-6 sm:top-8 flex items-center gap-2 hover:opacity-70 transition-opacity z-50 flex-shrink-0">
        <IconAnchor className="w-4 sm:w-5 h-4 sm:h-5 text-black" />
        <span className="text-[13px] sm:text-[16px] md:text-[17px] font-semibold tracking-tight">SignSea</span>
      </Link>

      <div className="w-full max-w-[400px] space-y-6 sm:space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-[22px] sm:text-[24px] md:text-[26px] font-bold tracking-tight">Create your account</h1>
          <p className="text-[12px] sm:text-[14px] text-gray-500 font-medium tracking-tight">
            Step {step} of 2 : {step === 1 ? 'Credentials' : 'Your details'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleNext} 
              className="space-y-3 sm:space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-[11px] sm:text-[12px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-11 sm:h-12 px-3 sm:px-4 bg-[#F5F5F7] border-none rounded-lg sm:rounded-xl text-[13px] sm:text-[14px] font-medium focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  placeholder="name@company.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] sm:text-[12px] font-bold text-gray-400 uppercase tracking-widest pl-1">Password</label>
                <input 
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-11 sm:h-12 px-3 sm:px-4 bg-[#F5F5F7] border-none rounded-lg sm:rounded-xl text-[13px] sm:text-[14px] font-medium focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <button className="w-full h-11 sm:h-12 bg-black text-white text-[13px] sm:text-[14px] font-medium rounded-full flex items-center justify-center gap-2 hover:bg-[#333] transition-all shadow-sm">
                Continue
                <IconArrowRight size={14} />
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleRegister} 
              className="space-y-3 sm:space-y-4"
            >
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] sm:text-[12px] font-bold text-gray-400 uppercase tracking-widest pl-1">First Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full h-11 sm:h-12 px-3 sm:px-4 bg-[#F5F5F7] border-none rounded-lg sm:rounded-xl text-[13px] sm:text-[14px] font-medium focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    placeholder="Jane"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] sm:text-[12px] font-bold text-gray-400 uppercase tracking-widest pl-1">Last Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full h-11 sm:h-12 px-3 sm:px-4 bg-[#F5F5F7] border-none rounded-lg sm:rounded-xl text-[13px] sm:text-[14px] font-medium focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    placeholder="Doe"
                  />
                </div>
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
                {isLoading ? <IconLoader className="w-4 h-4 animate-spin" /> : 'Complete Setup'}
                {!isLoading && <IconArrowRight size={14} />}
              </button>

              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-[13px] text-gray-400 font-medium hover:text-black transition-colors"
              >
                Back to step 1
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="pt-4 text-center">
          <p className="text-[13px] text-gray-500 font-medium">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-black hover:underline underline-offset-4">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
