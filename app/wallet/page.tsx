'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shell } from '@/components/dashboard-shell'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IconWallet, 
  IconArrowUpRight, 
  IconArrowDownLeft, 
  IconPlus, 
  IconCreditCard,
  IconBuildingBank,
  IconDotsVertical,
  IconArrowLeftRight,
  IconCurrencyNaira
} from '@tabler/icons-react'
import { apiClient } from '@/lib/api-client'
import { koboToNaira, formatCurrency, formatAmountShort } from '@/lib/currency-utils'
import { useCurrency } from '@/lib/currency-context'

export default function WalletPage() {
  const { selectedCurrency, rates } = useCurrency()
  const [loading, setLoading] = useState(true)
  const [walletData, setWalletData] = useState<any>(null)
  const [escrowData, setEscrowData] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true)
        const wallet = await apiClient.getWalletBalance()
        setWalletData(wallet)
        
        const escrow = await apiClient.getEscrowDetails()
        setEscrowData(escrow)
        
        const txns = await apiClient.getWalletTransactions(10, 0) as any
        setTransactions(txns?.transactions || [])
      } catch (err) {
        console.error('Failed to fetch wallet data:', err)
        setError('Failed to load wallet data')
      } finally {
        setLoading(false)
      }
    }

    fetchWalletData()
  }, [])

  return (
    <Shell title="Wallet">
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="space-y-12 animate-pulse">
            <div className="space-y-3">
              <div className="h-10 w-32 bg-gray-50 rounded-lg" />
              <div className="h-4 w-64 bg-gray-50 rounded-md" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[220px] bg-gray-50 rounded-2xl border border-gray-100" />
              <div className="h-[220px] bg-gray-50 rounded-2xl border border-gray-100" />
            </div>

            <div className="space-y-6">
              <div className="h-8 w-40 bg-gray-50 rounded-md" />
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-gray-50 rounded-2xl border border-gray-100" />
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-900"
            >
              Try Again
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 sm:space-y-12"
          >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
              <div className="space-y-1">
                <h2 className="text-[22px] sm:text-[28px] md:text-[32px] font-bold tracking-tight text-black">Wallet.</h2>
                <p className="text-[12px] sm:text-[14px] text-gray-500 font-medium max-w-md">Manage your trade balances, escrow payments, and withdrawal methods.</p>
              </div>
            </div>

            {/* Balance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-black p-5 sm:p-8 rounded-lg sm:rounded-2xl flex flex-col justify-between h-[180px] sm:h-[220px]">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] sm:text-[11px] font-bold text-white/40 uppercase tracking-[0.2em]">Available Balance</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-[28px] sm:text-[40px] font-bold text-white tracking-tighter">{formatAmountShort(koboToNaira(walletData?.availableBalance || 0), selectedCurrency, rates)}</h3>
                      <span className="text-[12px] sm:text-[14px] font-medium text-white/50">{selectedCurrency}</span>
                    </div>
                  </div>
                  <IconWallet className="text-white/20 flex-shrink-0" size={20} />
                </div>
                
                <div className="flex gap-2">
                  <Link 
                    href={koboToNaira(walletData?.availableBalance || 0) > 0 ? "/wallet/withdraw" : "#"}
                    className={`flex-1 h-9 sm:h-12 text-[12px] sm:text-[13px] font-bold rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all border border-transparent shadow-sm ${
                      koboToNaira(walletData?.availableBalance || 0) > 0
                        ? 'bg-white text-black hover:bg-gray-100 cursor-pointer'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      if (koboToNaira(walletData?.availableBalance || 0) === 0) {
                        e.preventDefault()
                      }
                    }}
                  >
                      <IconArrowUpRight size={14} stroke={3} />
                      <span className="hidden sm:inline">Withdraw</span>
                      <span className="sm:hidden">Withdraw</span>
                  </Link>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-5 sm:p-8 rounded-lg sm:rounded-2xl flex flex-col justify-between h-[180px] sm:h-[220px]">
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Escrow Lock</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-[28px] sm:text-[40px] font-bold text-black tracking-tighter">{formatAmountShort(koboToNaira(walletData?.escrowLocked || 0), selectedCurrency, rates)}</h3>
                    <span className="text-[12px] sm:text-[14px] font-medium text-black/30">{selectedCurrency}</span>
                  </div>
                  <p className="text-[11px] sm:text-[12px] text-gray-400 font-medium">
                    Currently secured in {escrowData?.escrowedProjects?.length || 0} active {escrowData?.escrowedProjects?.length === 1 ? 'project' : 'projects'}.
                  </p>
                </div>
                
                <div className="pt-3 sm:pt-4 border-t border-gray-100 flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-black/30 uppercase tracking-widest pl-1">
                    SECURED BY SIGNSEA PROTOCOL
                </div>
              </div>
            </div>

            {/* Transactions Section */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100">
                <h4 className="text-[13px] sm:text-[15px] font-bold text-black tracking-tight">Recent Activity</h4>
                <Link 
                  href="/wallet/history" 
                  className="text-[11px] sm:text-[12px] font-bold text-black underline underline-offset-4 flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                >
                  Transactions
                  <IconArrowLeftRight size={12} className="flex-shrink-0" />
                </Link>
              </div>

              <div className="space-y-2 sm:space-y-4">
                {transactions.length > 0 ? (
                  transactions.map((tx: any) => {
                    const isInbound = tx.type === 'EARNED' || tx.type === 'DEPOSIT'
                    const amount = koboToNaira(tx.amount)
                    const date = new Date(tx.created_at).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                    
                    return (
                      <div key={tx.id} className="flex items-center justify-between py-3 sm:py-4 group cursor-pointer hover:bg-gray-50/50 px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-lg sm:rounded-xl transition-all border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isInbound ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                          }`}>
                            {isInbound ? <IconArrowDownLeft size={16} /> : <IconArrowUpRight size={16} />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] sm:text-[13px] font-bold text-black tracking-tight truncate">{tx.description}</p>
                            <p className="text-[11px] sm:text-[12px] text-gray-400 font-medium">{date}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-[12px] sm:text-[13px] font-bold tracking-tight ${
                            isInbound ? 'text-black' : 'text-gray-900'
                          }`}>{isInbound ? '+' : '-'}{formatCurrency(amount, selectedCurrency, rates)}</p>
                          <p className="text-[10px] sm:text-[11px] font-bold text-gray-300 uppercase tracking-widest">{tx.status}</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-center py-8 text-gray-400 text-[13px]">No transactions yet</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  )
}
