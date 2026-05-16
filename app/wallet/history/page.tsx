'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  IconArrowLeft,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconClock,
  IconChevronRight,
  IconSearch
} from '@tabler/icons-react'
import { Shell } from '@/components/dashboard-shell'
import { apiClient } from '@/lib/api-client'
import { koboToNaira } from '@/lib/currency-utils'

interface Transaction {
  id: string
  type: 'DEPOSIT' | 'WITHDRAW' | 'ESCROW_PAY' | 'ESCROW_REFUND' | 'WITHDRAWAL' | 'EARNED'
  amount: string | number
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'PROCESSING'
  date?: string
  created_at?: string
  description: string
  reference?: string
}

export default function TransactionHistoryPage() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getWalletTransactions(100, 0) as any
        setTransactions(data?.transactions || [])
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-black bg-gray-50'
      case 'PENDING': return 'text-gray-400 bg-gray-50'
      case 'PROCESSING': return 'text-gray-400 bg-gray-50'
      case 'FAILED': return 'text-red-500 bg-red-50'
      default: return 'text-gray-400 bg-gray-50'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return <IconArrowDownLeft size={16} className="text-black" />
      case 'WITHDRAW': return <IconArrowUpRight size={16} className="text-gray-400" />
      case 'WITHDRAWAL': return <IconArrowUpRight size={16} className="text-gray-400" />
      case 'ESCROW_PAY': return <IconClock size={16} className="text-gray-400" />
      case 'EARNED': return <IconArrowDownLeft size={16} className="text-black" />
      case 'ESCROW_REFUND': return <IconArrowDownLeft size={16} className="text-black" />
      default: return <IconArrowDownLeft size={16} />
    }
  }

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(txn => 
    txn.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.id?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Shell title="Transaction History">
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-black uppercase tracking-widest mb-2 transition-colors"
            >
              <IconArrowLeft size={14} />
              Back to Wallet
            </Link>
            <h2 className="text-[28px] font-bold tracking-tight text-black">History.</h2>
            <p className="text-[14px] text-gray-500 font-medium">View all your transactions and escrow movement.</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <input 
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 px-11 bg-white border border-gray-100 rounded-full text-[13px] font-medium placeholder:text-gray-400 focus:outline-none focus:border-gray-200 transition-all"
            />
            <IconSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 bg-gray-50 rounded-2xl border border-gray-100 animate-pulse" />
                ))}
              </motion.div>
            ) : filteredTransactions.length > 0 ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {filteredTransactions.map((txn) => (
                  <div 
                    key={txn.id}
                    className="p-5 bg-white rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-gray-200 transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        {getTypeIcon(txn.type)}
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-black leading-none mb-1.5">{txn.description}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            {new Date(txn.created_at || txn.date || '').toLocaleDateString()}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-200" />
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{txn.reference || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-10">
                      <div className="text-left md:text-right">
                        <p className="text-[16px] font-bold text-black mb-1">
                          ₦{koboToNaira(Number(txn.amount)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </p>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(txn.status)}`}>
                          {txn.status}
                        </span>
                      </div>
                      {txn.status !== 'COMPLETED' && (
                        <IconChevronRight size={18} className="text-gray-300 group-hover:text-black transition-colors hidden md:block" />
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="text-gray-400 mb-2">
                  <IconSearch size={32} className="mx-auto mb-4 opacity-50" />
                </div>
                <h4 className="text-[15px] font-bold text-black mb-2">No transactions found</h4>
                <p className="text-[12px] text-gray-400 font-medium">
                  {searchQuery ? 'Try adjusting your search' : 'Your transaction history will appear here'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Shell>
  )
}
