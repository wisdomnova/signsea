'use client'

import { Shell } from '@/components/dashboard-shell'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  ArrowLeft, 
  SealCheck, 
  ChatTeardropText, 
  UserCircle,
  Briefcase,
  Quotes
} from '@phosphor-icons/react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { EmptyState } from '@/components/ui/empty-state'

export default function ReviewArchivePage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const reviews: any[] = []

  return (
    <Shell title="Review Archive">
      <div className="max-w-5xl mx-auto space-y-12 pb-24">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/settings/reputation" className="flex items-center gap-2 text-[10px] font-black text-marine/40 uppercase tracking-widest hover:text-abyss transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Reputation
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl font-serif font-black text-abyss tracking-tight">Public Feedback.</h1>
              <p className="text-lg text-marine/60 font-medium">Your complete history of client endorsements and verified ratings.</p>
            </div>
            <div className="p-6 bg-mist rounded-3xl border border-slate-100 flex items-center gap-6">
               <div className="flex flex-col items-center">
                  <span className="text-3xl font-serif font-black text-marine/30 leading-none">0.0</span>
                  <div className="flex gap-0.5 mt-1">
                     {[1,2,3,4,5].map(s => <Star key={s} size={10} weight="regular" className="text-marine/20" />)}
                  </div>
               </div>
               <div className="w-px h-10 bg-slate-200" />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-marine/40 uppercase tracking-widest">Global Rank</span>
                  <span className="text-sm font-black text-marine/40">Unranked</span>
               </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <EmptyState 
            title="No reviews yet."
            description="Complete projects and receive feedback from clients to build your public reputation."
            action={{
              label: "Start a Project",
              href: "/project/create"
            }}
          />
        ) : (
          <div className="grid gap-6">
            {reviews.map((rev: any, i: number) => (
            <motion.div 
              key={rev.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group p-10 bg-white rounded-[3.5rem] border border-slate-100 hover:border-seafoam/30 hover:shadow-2xl hover:shadow-abyss/5 transition-all duration-500 relative flex flex-col md:flex-row gap-10 items-start"
            >
              <div className="w-20 h-20 rounded-[2.2rem] bg-mist flex items-center justify-center shrink-0 text-marine/20 group-hover:text-seafoam group-hover:bg-seafoam/5 transition-all duration-700">
                <Quotes size={40} weight="fill" />
              </div>

              <div className="flex-grow space-y-6 pt-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                     <span className="px-2.5 py-1 bg-mist text-[9px] font-black text-marine/40 uppercase tracking-widest rounded-md mb-2 inline-block">
                        {rev.type}
                     </span>
                     <h3 className="text-2xl font-serif font-black text-abyss tracking-tight">{rev.project}</h3>
                  </div>
                  <div className="flex flex-col md:items-end">
                     <div className="flex gap-0.5 mb-1">
                        {[1,2,3,4,5].map(s => <Star key={s} size={14} weight="fill" className="text-seafoam" />)}
                     </div>
                     <span className="text-[10px] font-black text-marine/20 uppercase tracking-widest">{rev.date}</span>
                  </div>
                </div>

                <p className="text-xl font-medium text-marine/70 leading-relaxed italic">
                  "{rev.review}"
                </p>

                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-mist flex items-center justify-center text-abyss">
                         <UserCircle size={28} weight="duotone" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-marine/40 uppercase tracking-widest leading-none mb-1">Signed By</p>
                         <p className="text-sm font-black text-abyss">{rev.from}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 bg-seafoam/10 rounded-full border border-seafoam/20">
                      <SealCheck size={14} weight="bold" className="text-seafoam" />
                      <span className="text-[8px] font-black text-abyss uppercase tracking-widest">Funds Verified</span>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        )}

      </div>
    </Shell>
  )
}
