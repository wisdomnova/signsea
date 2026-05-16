'use client'

import { Shell } from '@/components/dashboard-shell'
import { motion } from 'framer-motion'
import { ShieldCheck, ChatTeardropText, ArrowLeft, WarningCircle, Gavel } from '@phosphor-icons/react'
import Link from 'next/link'

export default function WorkPolicyPage() {
  const policies = [
    {
      title: "Milestone Deadlines",
      description: "Freelancers must deliver work within 24 hours of the agreed milestone date. Extensions must be requested and approved via the platform.",
      icon: <ShieldCheck size={32} weight="duotone" className="text-seafoam" />
    },
    {
      title: "Quality Standards",
      description: "Deliverables must match the specifications outlined in the project brief. Incomplete or placeholder work does not qualify for milestone release.",
      icon: <ChatTeardropText size={32} weight="duotone" className="text-marine" />
    },
    {
      title: "Auto-Release Logic",
      description: "For milestones set to 'Auto-Release', funds are automatically moved to the freelancer after 72 hours of delivery unless a dispute is raised.",
      icon: <WarningCircle size={32} weight="duotone" className="text-orange-500" />
    },
    {
      title: "Dispute Resolution",
      description: "If a conflict arises, SignSea mediation will review the brief and deliverables to determine a fair fund allocation.",
      icon: <Gavel size={32} weight="duotone" className="text-abyss" />
    }
  ]

  return (
    <Shell title="Work Policy">
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        <div className="space-y-4">
          <Link href="/projects" className="flex items-center gap-2 text-[10px] font-black text-marine/40 uppercase tracking-widest hover:text-abyss transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-abyss tracking-tight">Standard Work Policy.</h1>
          <p className="text-lg text-marine/60 font-medium">Clear rules for a secure and professional engagement on SignSea.</p>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {policies.map((policy, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 sm:p-10 bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start gap-4 sm:gap-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-mist flex items-center justify-center shrink-0">
                {policy.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-black text-abyss">{policy.title}</h3>
                <p className="text-marine/60 leading-relaxed font-medium">{policy.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-6 sm:p-10 bg-abyss rounded-[2rem] sm:rounded-[3rem] text-white flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 text-center sm:text-left">
           <div className="space-y-2">
              <h4 className="text-2xl font-serif font-bold">Have a specific question?</h4>
              <p className="text-white/60 font-medium text-sm">Our support team is available 24/7 to help with policy clarifications.</p>
           </div>
           <button className="px-10 py-5 bg-seafoam text-abyss rounded-2xl font-black text-sm hover:scale-105 transition-all">
             Contact Support
           </button>
        </div>
      </div>
    </Shell>
  )
}
