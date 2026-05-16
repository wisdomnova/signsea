'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { IconAnchor, IconArrowLeft } from '@tabler/icons-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl h-16 flex items-center border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity flex-shrink-0">
            <IconAnchor size={18} />
            <span className="text-[14px] sm:text-[16px] font-bold tracking-tight">SignSea</span>
          </Link>
          
          <Link href="/" className="text-[12px] sm:text-[13px] font-bold text-gray-400 hover:text-black transition-colors flex items-center gap-2 flex-shrink-0">
            <IconArrowLeft size={14} />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </nav>

      <main className="pt-24 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-[800px] mx-auto">
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 sm:mb-24"
          >
            <h1 className="text-[32px] sm:text-[48px] md:text-[84px] font-bold leading-[0.95] tracking-tighter mb-6 sm:mb-8 text-black">Terms of Service.</h1>
            <p className="text-[12px] sm:text-[14px] font-bold text-gray-400 uppercase tracking-[0.2em]">Last Revised: May 13, 2026</p>
          </motion.header>

          <div className="space-y-16 sm:space-y-24 text-gray-600 text-base sm:text-lg leading-relaxed">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-[20px] sm:text-[24px] font-bold text-black tracking-tight flex items-center gap-3 sm:gap-4">
                <span className="w-6 sm:w-8 h-[1px] bg-black flex-shrink-0" /> 01. Agreement to Terms
              </h2>
              <p className="pl-9 sm:pl-12">
                By accessing SignSea, you agree to operate within our industrial payment framework. These terms govern the use of our escrow infrastructure and milestone management tools.
              </p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-[20px] sm:text-[24px] font-bold text-black tracking-tight flex items-center gap-3 sm:gap-4">
                <span className="w-6 sm:w-8 h-[1px] bg-black flex-shrink-0" /> 02. Escrow Conduct
              </h2>
              <div className="pl-9 sm:pl-12 space-y-4 sm:space-y-6">
                <p>
                  Users must provide accurate milestone documentation. Funds deposited into the SignSea wallet are held until specific conditions are met:
                </p>
                <div className="grid gap-3 sm:gap-4">
                  {[
                    "Milestone approval by the client triggers automatic release.",
                    "Disputes are resolved through industrial arbitration protocols.",
                    "Currency conversion between NGN, USD, and GBP follows live audit rates."
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 sm:gap-4 group">
                      <span className="text-[10px] sm:text-[11px] font-bold text-gray-300 pt-1 font-mono flex-shrink-0">0{i+1}</span>
                      <p className="font-medium text-black text-sm sm:text-base">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-[20px] sm:text-[24px] font-bold text-black tracking-tight flex items-center gap-3 sm:gap-4">
                <span className="w-6 sm:w-8 h-[1px] bg-black flex-shrink-0" /> 03. Professional Liability
              </h2>
              <p className="pl-9 sm:pl-12">
                SignSea provides the infrastructure for secure payments. We are not responsible for the quality of the deliverables provided between parties. Our role is the clinical execution of the payment contract.
              </p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-[20px] sm:text-[24px] font-bold text-black tracking-tight flex items-center gap-3 sm:gap-4">
                <span className="w-6 sm:w-8 h-[1px] bg-black flex-shrink-0" /> 04. Termination
              </h2>
              <p className="pl-9 sm:pl-12">
                Violation of escrow protocols or fraudulent activity results in immediate account suspension and fund freezing for compliance review.
              </p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="pt-12 border-t border-gray-100"
            >
              <p className="text-black font-bold">Direct all technical queries to industrial@signsea.com.</p>
            </motion.section>
          </div>
        </div>
      </main>

      <footer className="py-8 sm:py-12 border-t border-gray-100 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">
           <div className="flex items-center gap-2 text-black">
             <IconAnchor size={18} />
             <span className="text-[14px] sm:text-[16px] font-bold tracking-tight">SignSea</span>
           </div>
           <div className="flex gap-6 sm:gap-10 text-[12px] sm:text-[13px] font-bold text-gray-400 flex-wrap justify-center sm:justify-end">
             <span>© 2026 SignSea</span>
             <Link href="/legal/privacy" className="hover:text-black">Privacy Policy</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
