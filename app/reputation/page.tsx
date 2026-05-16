'use client'

import { Shell } from '@/components/dashboard-shell'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IconStar, 
  IconShieldCheck, 
  IconClock,
  IconTrophy,
  IconMedal,
  IconTrendingUp,
  IconCircleCheck,
  IconAward,
  IconChevronRight,
  IconUserCheck,
  IconInfoCircle,
  IconShield,
  IconShieldLock,
  IconFingerprint,
  IconX
} from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

export default function ReputationPage() {
  const [loading, setLoading] = useState(true)
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [reputation, setReputation] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadReputation()
  }, [])

  async function loadReputation() {
    try {
      setLoading(true)
      const data = await apiClient.getReputation()
      setReputation(data)
    } catch (err) {
      console.error('Failed to load reputation:', err)
      setError('Failed to load reputation data')
    } finally {
      setLoading(false)
    }
  }

  const tiers = [
    { 
        label: 'Starter', 
        range: '0 - 2.5', 
        icon: IconMedal,
        features: ['Manual Approvals', 'Standard Fees', 'Community Support'],
        color: 'text-gray-400',
        bg: 'bg-gray-100/50'
    },
    { 
        label: 'Verified', 
        range: '2.5 - 4.5', 
        icon: IconUserCheck,
        features: ['Priority Support', 'Verified Badge', 'Lower Fees'],
        color: 'text-black',
        bg: 'bg-gray-50'
    },
    { 
        label: 'Expert', 
        range: '4.5 - 5.0', 
        icon: IconTrophy,
        features: ['Instant Release', 'Zero Fees', 'Priority Visibility'],
        color: 'text-black',
        bg: 'bg-gray-50'
    },
  ]

  const getTierIndex = (score: number) => {
    if (score >= 4.5) return 2
    if (score >= 2.5) return 1
    return 0
  }

  return (
    <Shell title="Trust & Reputation">
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="w-full space-y-12 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div className="h-4 w-24 bg-gray-50 rounded" />
                <div className="h-10 w-64 bg-gray-50 rounded-lg" />
                <div className="h-4 w-96 bg-gray-50 rounded" />
              </div>
              <div className="h-20 w-48 bg-gray-50 rounded-2xl border border-gray-100" />
            </div>

            {/* Hero Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-[300px] bg-gray-50 rounded-3xl border border-gray-100" />
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-[92px] bg-gray-50 rounded-2xl border border-gray-100" />
                ))}
              </div>
            </div>

            {/* Tiers Skeleton */}
            <div className="space-y-8 pt-8">
              <div className="flex justify-between items-center">
                <div className="h-4 w-32 bg-gray-50 rounded" />
                <div className="h-4 w-24 bg-gray-50 rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-[400px] bg-gray-50 rounded-[2.5rem] border border-gray-100" />
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800">
            <p className="font-bold mb-2">Error</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={loadReputation}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-12"
          >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Trust Dashboard</p>
                <h1 className="text-4xl font-bold tracking-tighter text-black">Your Reputation.</h1>
                <p className="text-[13px] text-gray-500 max-w-md">
                   This is how others see you on SignSea. Complete projects and stay honest to grow your score.
                </p>
              </div>
              
              <div className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl">
                 <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black">
                    <IconTrendingUp size={20} />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Growth</p>
                    <p className="text-[13px] font-bold text-black">{reputation?.total_completed || 0} projects</p>
                 </div>
              </div>
            </div>

            {/* Score Hero - Industrial Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#111] rounded-3xl p-10 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="relative z-10 space-y-6 text-center md:text-left">
                  <div>
                    <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                      <span className={`w-1.5 h-1.5 rounded-full ${reputation?.tier === 'Starter' ? 'bg-gray-500' : reputation?.tier === 'Verified' ? 'bg-blue-500' : 'bg-yellow-500'} ${reputation?.tier === 'Starter' ? '' : 'animate-pulse'}`} />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Level {getTierIndex(reputation?.reputation_score || 0) + 1}: {reputation?.tier || 'Starter'}</span>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tighter leading-[1.1]">
                      Your Trust <br />
                      <span className="text-gray-500">Starts Here.</span>
                    </h2>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${reputation?.tier === 'Verified' || reputation?.tier === 'Expert' ? 'bg-white/10 border-white/10' : 'bg-white/5 border-white/10'}`}>
                      <IconFingerprint size={14} className={reputation?.tier === 'Verified' || reputation?.tier === 'Expert' ? 'text-white' : 'text-gray-500'} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${reputation?.tier === 'Verified' || reputation?.tier === 'Expert' ? 'text-white' : 'text-gray-400'}`}>{reputation?.tier === 'Verified' || reputation?.tier === 'Expert' ? 'Verified' : 'Unverified'}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                      <IconShieldLock size={14} className="text-gray-500" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lvl {getTierIndex(reputation?.reputation_score || 0) + 1} Security</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="text-[80px] font-bold tracking-tighter leading-none mb-2">{reputation?.reputation_score?.toFixed(1) || '0.0'}</div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <IconStar 
                        key={i} 
                        size={14} 
                        className={i <= Math.floor(reputation?.reputation_score || 0) ? 'text-yellow-400' : 'text-white/10'} 
                        fill="currentColor" 
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Reputation Score</p>
                </div>

                {/* Industrial Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
                  <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4">
                    <IconShield size={400} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border border-gray-100 rounded-2xl flex flex-col gap-3 hover:border-black transition-colors group">
                   <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                          <IconCircleCheck size={18} />
                      </div>
                      <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Completion</span>
                   </div>
                   <span className="text-2xl font-bold text-black">{Math.round(reputation?.completion_rate || 0)}%</span>
                </div>
                <div className="p-6 bg-white border border-gray-100 rounded-2xl flex flex-col gap-3 hover:border-black transition-colors group">
                   <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                         <IconClock size={18} />
                      </div>
                      <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Timeliness</span>
                   </div>
                   <span className="text-2xl font-bold text-black">{Math.round(reputation?.timeliness_rate || 0)}%</span>
                </div>
                <div className="p-6 bg-white border border-gray-100 rounded-2xl flex flex-col gap-3 hover:border-black transition-colors group">
                   <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                         <IconStar size={18} />
                      </div>
                      <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Projects</span>
                   </div>
                   <span className="text-2xl font-bold text-black">{reputation?.total_completed || 0}</span>
                </div>
              </div>
            </div>

            {/* Tiers Section */}
            <div className="space-y-8 pt-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Unlocked Tiers</h3>
                  <button 
                    onClick={() => setShowHowItWorks(true)}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-black border-b border-black pb-0.5 cursor-pointer hover:opacity-70 transition-opacity"
                  >
                     How it works <IconChevronRight size={12} />
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {tiers.map((tier, i) => {
                    const isActive = getTierIndex(reputation?.reputation_score || 0) === i
                    return (
                    <div 
                       key={i} 
                       className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                          isActive
                          ? 'border-black bg-black text-white shadow-2xl shadow-black/20' 
                          : 'border-gray-100 bg-white grayscale opacity-50 hover:opacity-100 hover:grayscale-0'
                       }`}
                    >
                       {/* Status Badge */}
                       <div className="flex items-center justify-between mb-10 relative z-10">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                             isActive ? 'bg-white text-black' : 'bg-gray-50 text-gray-400 group-hover:bg-black group-hover:text-white'
                          }`}>
                             <tier.icon size={28} />
                          </div>
                          {isActive && (
                             <span className="px-3 py-1 bg-white/10 text-[10px] font-bold uppercase tracking-widest border border-white/10 rounded-full animate-pulse">
                                Current
                             </span>
                          )}
                       </div>
                       
                       <div className="mb-10 relative z-10">
                          <h4 className="text-2xl font-bold tracking-tight mb-1">{tier.label}</h4>
                          <p className={`text-[12px] font-bold uppercase tracking-[0.2em] ${isActive ? 'text-gray-400' : 'text-gray-300'}`}>
                             {tier.range} Score
                          </p>
                       </div>

                       <ul className="space-y-4 relative z-10">
                          {tier.features.map((f, j) => (
                             <li key={j} className="flex items-center gap-3 text-[13px] font-medium leading-none">
                                <IconCircleCheck size={16} className={isActive ? 'text-white' : 'text-gray-200 group-hover:text-black'} />
                                <span className={isActive ? 'text-gray-300' : 'text-gray-500'}>{f}</span>
                             </li>
                          ))}
                       </ul>

                       {/* Aesthetic Background Decal */}
                       <div className={`absolute -bottom-6 -right-6 opacity-[0.05] pointer-events-none transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-12 ${
                          isActive ? 'text-white' : 'text-black'
                       }`}>
                          <tier.icon size={120} />
                       </div>
                    </div>
                    )
                  })}
               </div>
            </div>

            {/* How It Works Modal */}
            {showHowItWorks && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setShowHowItWorks(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={e => e.stopPropagation()}
                  className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-black">How Reputation Works</h3>
                    <button 
                      onClick={() => setShowHowItWorks(false)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <IconX size={20} />
                    </button>
                  </div>
                  <div className="space-y-4 text-sm text-gray-600">
                    <p><strong>Completion Rate:</strong> Percentage of projects you've completed out of total projects.</p>
                    <p><strong>Timeliness:</strong> Percentage of projects completed before or on the deadline.</p>
                    <p><strong>Score Calculation:</strong> Your reputation score is calculated based on completion rate (50%) and timeliness (50%).</p>
                    <p><strong>Tiers:</strong> Unlock benefits and lower fees as your reputation score increases.</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  )
}
