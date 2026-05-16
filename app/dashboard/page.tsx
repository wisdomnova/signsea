'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  IconWallet, 
  IconArrowRight,
  IconPlus,
  IconShieldCheck,
  IconAnalyze,
  IconTarget,
  IconChevronRight,
  IconTrendingUp,
  IconBriefcase
} from '@tabler/icons-react'
import { Shell } from '@/components/dashboard-shell'
import { apiClient } from '@/lib/api-client'
import { koboToNaira, formatAmountShort } from '@/lib/currency-utils'
import { useCurrency } from '@/lib/currency-context'
import { getDisplayStatus } from '@/lib/status-mapping'

// Helper to group transactions by date
const groupTransactionsByDate = (transactions: any[], range: '7D' | '30D') => {
  const now = new Date()
  const grouped: Record<string, number> = {}
  
  // Calculate cutoff date
  const daysBack = range === '7D' ? 7 : 30
  const cutoff = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
  
  // Group by day
  transactions.forEach((tx: any) => {
    const txDate = new Date(tx.created_at)
    if (txDate >= cutoff && (tx.type === 'EARNED' || tx.type === 'DEPOSIT')) {
      const key = txDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      grouped[key] = (grouped[key] || 0) + koboToNaira(tx.amount)
    }
  })
  
  // Create sorted array with last N days
  const result = []
  for (let i = daysBack - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const label = d.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3)
    const value = grouped[key] || 0
    
    result.push({
      label,
      value: Math.round(value), // Use actual amount for scaling
      amt: `₦${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    })
  }
  
  return result
}

const TrendChart = ({ range, transactions }: { range: '7D' | '30D', transactions: any[] }) => {
  const data = useMemo(() => groupTransactionsByDate(transactions, range), [transactions, range])
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  
  // Create path based on data points
  const points = useMemo(() => {
    const width = 600
    const height = 200
    const step = width / (data.length - 1)
    const maxValue = Math.max(...data.map(d => d.value), 1) // Prevent divide by zero
    
    return data.map((d, i) => ({
      x: i * step,
      y: height - (d.value / maxValue) * height * 0.9 // Leave 10% padding
    }))
  }, [data])

  const pathD = useMemo(() => {
    if (points.length === 0) return ""
    return `M ${points[0].x} ${points[0].y} ` + 
      points.slice(1).map((p, i) => {
        const prev = points[i]
        const cx = (prev.x + p.x) / 2
        return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`
      }).join(" ")
  }, [points])

  const areaD = useMemo(() => {
    return `${pathD} V 200 H 0 Z`
  }, [pathD])

  return (
    <div className="h-[200px] w-full relative group mt-8">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid Lines */}
        {[0, 1, 2, 3].map((i) => (
          <line 
            key={i} 
            x1="0" 
            y1={i * 66} 
            x2="600" 
            y2={i * 66} 
            stroke="#F1F1F1" 
            strokeWidth="1" 
          />
        ))}

        {/* Animated Area */}
        <motion.path 
          d={areaD}
          fill="url(#chartGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Animated Path */}
        <motion.path 
          d={pathD}
          fill="none" 
          stroke="#000" 
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Interaction Points */}
        {points.map((p, i) => (
          <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="12" 
              fill="transparent" 
              className="cursor-pointer"
            />
            <motion.circle 
              cx={p.x} 
              cy={p.y} 
              r={hoveredIdx === i ? 5 : 0} 
              fill="#000" 
              initial={false}
            />
          </g>
        ))}
      </svg>
      
      {/* Tooltip */}
      <AnimatePresence>
        {hoveredIdx !== null && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bg-black text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-xl pointer-events-none"
            style={{ 
              left: `${(points[hoveredIdx].x / 600) * 100}%`, 
              top: `${(points[hoveredIdx].y / 200) * 100}%`,
              transform: 'translate(-50%, -130%)'
            }}
          >
            {data[hoveredIdx].amt}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute -top-6 left-0 text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
        Live Revenue Stream
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { selectedCurrency, rates } = useCurrency()
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState<'7D' | '30D'>('7D')
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [walletData, setWalletData] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Only fetch dashboard stats - consolidated endpoint
        const dashData = await apiClient.getDashboardStats()
        setDashboardData(dashData)
        
        // Try to fetch wallet data with fallback
        try {
          const walletBalance = await apiClient.getWalletBalance()
          setWalletData(walletBalance)
        } catch (walletErr) {
          console.warn('Failed to fetch wallet balance:', walletErr)
          // Use default wallet data
          setWalletData({ availableBalance: 0, escrowLocked: 0 })
        }
        
        // Try to fetch recent transactions with fallback
        try {
          const txns = await apiClient.getWalletTransactions(50, 0) as any
          setTransactions(txns?.transactions || [])
        } catch (txErr) {
          console.warn('Failed to fetch transactions:', txErr)
          setTransactions([])
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data. Please refresh.')
        // Set fallback data
        setDashboardData(null)
        setWalletData({ availableBalance: 0, escrowLocked: 0 })
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  // Calculate transaction history
  const calculatedStats = useMemo(() => {
    // Provide safe fallback values
    if (!walletData || !transactions.length) {
      return {
        inEscrow: 0,
        withdrawn: 0,
        pendingPayouts: 0,
        totalEarned: 0,
      }
    }

    let withdrawn = 0
    let pendingPayouts = 0

    transactions.forEach((tx: any) => {
      if (tx.type === 'WITHDRAWAL' && tx.status === 'COMPLETED') {
        withdrawn += koboToNaira(tx.amount || 0)
      } else if (tx.type === 'WITHDRAWAL' && tx.status === 'PROCESSING') {
        pendingPayouts += koboToNaira(tx.amount || 0)
      }
    })

    return {
      inEscrow: koboToNaira(walletData?.escrowLocked || 0),
      withdrawn,
      pendingPayouts,
      totalEarned: koboToNaira(walletData?.availableBalance || 0),
    }
  }, [walletData, transactions])

  const stats = dashboardData
    ? [
        { label: 'Total Invoiced', value: `₦${(dashboardData.stats?.total_earnings || 0).toLocaleString()}`, icon: IconAnalyze },
        { label: 'Active Projects', value: dashboardData.stats?.active_projects || '0', icon: IconTarget },
        { label: 'Paid Invoices', value: dashboardData.stats?.paid_invoices || '0', icon: IconWallet },
      ]
    : [
        { label: 'Total Invoiced', value: '₦0', icon: IconAnalyze },
        { label: 'Active Projects', value: '0', icon: IconTarget },
        { label: 'Paid Invoices', value: '0', icon: IconWallet },
      ]

  const activeProjects = dashboardData?.recent?.projects?.slice(0, 2) || []

  if (error && !loading) {
    return (
      <Shell title="Dashboard">
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell title="Dashboard">
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="space-y-12 animate-pulse">
            <div className="h-10 w-48 bg-gray-50 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-50 rounded-2xl border border-gray-100" />)}
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Top Insight Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6">
              <div className="space-y-1">
                <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Quick Summary</p>
                <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold tracking-tight text-black flex items-center gap-2 sm:gap-3">
                  Overview.
                </h2>
              </div>
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <Link 
                  href="/project/create" 
                  className="px-4 sm:px-6 h-10 sm:h-12 bg-black text-white text-[12px] sm:text-[13px] font-bold rounded-full flex items-center gap-2 hover:bg-[#222] transition-all flex-1 sm:flex-none justify-center sm:justify-start"
                >
                  <IconPlus size={16} />
                  <span className="hidden sm:inline">New Project</span>
                  <span className="sm:hidden">New</span>
                </Link>
              </div>
            </div>

            {/* Performance Snapshot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              <div className="lg:col-span-8 p-6 sm:p-8 md:p-10 bg-white border border-gray-100 rounded-[20px] sm:rounded-[32px] space-y-4 sm:space-y-6 group overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="space-y-1">
                    <h3 className="text-[16px] sm:text-[18px] font-bold text-black tracking-tight">Income History</h3>
                    <p className="text-[12px] sm:text-[14px] text-gray-400 font-medium font-sans">See how your earnings have changed over the month.</p>
                  </div>
                  <div className="flex p-1 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100 flex-shrink-0">
                    <button 
                      onClick={() => setRange('7D')}
                      className={`px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all ${range === '7D' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
                    >
                      7D
                    </button>
                    <button 
                      onClick={() => setRange('30D')}
                      className={`px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all ${range === '30D' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
                    >
                      30D
                    </button>
                  </div>
                </div>

                <TrendChart range={range} transactions={transactions} />

                <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-10 border-t border-gray-50">
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-300 uppercase tracking-widest">In Escrow</p>
                    <p className="text-[14px] sm:text-[17px] font-bold text-black mt-1">{formatAmountShort(calculatedStats.inEscrow, selectedCurrency, rates)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-300 uppercase tracking-widest">Withdrawn</p>
                    <p className="text-[14px] sm:text-[17px] font-bold text-black mt-1">{formatAmountShort(calculatedStats.withdrawn, selectedCurrency, rates)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-300 uppercase tracking-widest">Pending Payouts</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[14px] sm:text-[17px] font-bold text-black">{formatAmountShort(calculatedStats.pendingPayouts, selectedCurrency, rates)}</p>
                      {calculatedStats.pendingPayouts > 0 && <IconTrendingUp size={14} className="text-green-500 flex-shrink-0" />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                {stats.map((stat, i) => (
                  <div key={i} className="p-6 sm:p-8 bg-gray-50 border border-gray-100 rounded-[20px] sm:rounded-[32px] group hover:bg-white hover:border-black transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-gray-100 flex items-center justify-center text-black transition-colors group-hover:bg-black group-hover:text-white">
                        <stat.icon size={18} stroke={2} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                      <h3 className="text-[18px] sm:text-[24px] font-bold text-black tracking-tighter leading-none">{stat.value}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Progress Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
               <div className="lg:col-span-12 space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[14px] sm:text-[16px] font-bold text-black tracking-tight">Current Projects</h3>
                     <Link href="/projects" className="text-[11px] sm:text-[12px] font-bold text-gray-400 hover:text-black uppercase tracking-widest flex items-center gap-2">
                        View All
                        <IconChevronRight size={14} />
                     </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {activeProjects && activeProjects.length > 0 ? activeProjects.map((project: any) => (
                      <Link key={project.id} href={`/p/${project.id}`} className="p-6 sm:p-8 border border-gray-100 rounded-[20px] sm:rounded-[32px] hover:border-black transition-all cursor-pointer group block">
                        <div className="flex justify-between items-start mb-6 sm:mb-10">
                           <div className="space-y-1">
                              <h4 className="text-[14px] sm:text-[18px] font-bold text-black tracking-tight">{project.title}</h4>
                              <p className="text-[12px] sm:text-[13px] text-gray-400 font-medium font-sans capitalize">{getDisplayStatus(project.status)}</p>
                           </div>
                           <div className="text-right flex-shrink-0">
                              <p className="text-[14px] sm:text-[16px] font-bold text-black">{project.currency} {Math.round(koboToNaira(project.total_amount || project.amount || 0)).toLocaleString()}</p>
                              <p className="text-[9px] sm:text-[10px] font-bold text-gray-300 uppercase tracking-widest">Total</p>
                           </div>
                        </div>

                        <div className="space-y-3">
                           <div className="flex justify-between items-end text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-300">
                              <span>Created</span>
                              <span className="text-black text-[12px]">{new Date(project.created_at).toLocaleDateString()}</span>
                           </div>
                        </div>
                      </Link>
                    )) : (
                      <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-200 mb-6 shadow-sm">
                          <IconBriefcase size={32} />
                        </div>
                        <h4 className="text-[15px] font-bold text-black mb-2 tracking-tight">No active projects yet</h4>
                        <p className="text-[12px] text-gray-400 font-medium max-w-[200px] leading-relaxed mb-8">
                          Start your creative journey by creating your first project.
                        </p>
                        <Link href="/project/create" className="inline-flex h-11 px-6 rounded-xl bg-black text-white text-[12px] font-bold items-center hover:scale-[1.02] active:scale-[0.98] transition-all">
                          Create Project
                        </Link>
                      </div>
                    )}
                  </div>
               </div>
            </div>
            
            {/* Minimal Footer Spacer */}
            <div className="pb-10" />
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  )
}
