'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shell } from '@/components/dashboard-shell'
import { 
  IconChevronLeft, 
  IconBuildingBank, 
  IconArrowRight, 
  IconCheck, 
  IconAlertCircle,
  IconCurrencyNaira,
  IconClock,
  IconShieldCheck,
  IconLoader,
} from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { koboToNaira, formatCurrency } from '@/lib/currency-utils'
import { useCurrency } from '@/lib/currency-context'

export default function WithdrawPage() {
  const router = useRouter()
  const { selectedCurrency, rates } = useCurrency()

  const [walletData, setWalletData] = useState<any>(null)
  const [bankAccounts, setBankAccounts] = useState<any[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState('input') // input, confirm, success
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [wallet, accounts] = await Promise.all([
          apiClient.getWalletBalance() as any,
          apiClient.getBankAccounts() as any,
        ])

        setWalletData(wallet)
        setBankAccounts(accounts.accounts || [])

        // Set default account if available
        const defaultAccount = accounts.accounts?.find((a: any) => a.is_default)
        if (defaultAccount) {
          setSelectedAccountId(defaultAccount.id)
        } else if (accounts.accounts?.length > 0) {
          setSelectedAccountId(accounts.accounts[0].id)
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load wallet data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const availableBalance = koboToNaira(walletData?.availableBalance || 0)
  const amountNum = parseFloat(amount) || 0
  const selectedAccount = bankAccounts.find((a) => a.id === selectedAccountId)

  const handleWithdraw = () => {
    if (amountNum <= 0) {
      setError('Please enter a valid amount')
      return
    }
    if (amountNum > availableBalance) {
      setError('Insufficient balance')
      return
    }
    setError('')
    setStep('confirm')
  }

  const handleFinalConfirm = async () => {
    setIsProcessing(true)
    setError('')

    try {
      // Convert naira to kobo for backend
      const amountInKobo = amountNum * 100
      const result = await apiClient.withdrawFunds(
        amountInKobo,
        selectedCurrency,
        selectedAccountId
      ) as any

      setStep('success')
    } catch (err: any) {
      console.error('Withdraw error:', err)
      setError(err.message || 'Failed to process withdrawal')
      setStep('confirm')
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <Shell title="Withdraw Funds">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-black rounded-full animate-spin" />
        </div>
      </Shell>
    )
  }

  if (bankAccounts.length === 0 && step === 'input') {
    return (
      <Shell title="Withdraw Funds">
        <div className="max-w-2xl mx-auto py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 p-8 bg-gray-50 rounded-3xl border border-gray-100"
          >
            <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mx-auto">
              <IconBuildingBank className="text-gray-300" size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-black">No Bank Accounts</h2>
              <p className="text-sm text-gray-500">
                You need to add a bank account before you can withdraw funds.
              </p>
            </div>
            <button
              onClick={() => router.push('/settings')}
              className="px-6 py-3 bg-black text-white text-sm font-bold rounded-full hover:bg-[#222] transition-all"
            >
              Add Bank Account
            </button>
          </motion.div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell title="Withdraw Funds">
      <div className="max-w-2xl space-y-10">
        {/* Navigation / Back Button */}
        <Link 
          href="/wallet" 
          className="inline-flex items-center gap-2 text-[13px] font-bold text-gray-400 hover:text-black transition-colors group"
        >
          <IconChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Wallet
        </Link>

        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <div className="space-y-2">
                <h2 className="text-[32px] font-bold tracking-tight text-black">Withdraw Funds.</h2>
                <p className="text-[14px] text-gray-500 font-medium">Transfer your available balance to your connected bank account.</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3"
                >
                  <IconAlertCircle className="text-red-600 shrink-0" size={20} />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </motion.div>
              )}

              <div className="p-8 bg-gray-50 border border-gray-100 rounded-2xl space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Amount to Withdraw</label>
                    <span className="text-[12px] font-bold text-black/40">Available: {formatCurrency(availableBalance, selectedCurrency, rates)}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[24px] font-bold text-black/20">
                      {selectedCurrency === 'NGN' ? '₦' : selectedCurrency === 'USD' ? '$' : '£'}
                    </span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      disabled={isProcessing}
                      className="w-full h-20 pl-12 pr-6 bg-white border border-gray-200 rounded-xl text-[28px] font-bold text-black outline-none focus:border-black transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Destination Account</label>
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    disabled={isProcessing}
                    className="w-full px-5 py-5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-black outline-none focus:border-black transition-all disabled:opacity-50"
                  >
                    {bankAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.bank_name} — •••{account.account_number.slice(-4)} ({account.account_holder_name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-blue-50/30 border border-blue-50 rounded-2xl sticky-info">
                 <IconClock className="text-blue-500 shrink-0" size={20} />
                 <p className="text-[13px] text-blue-600 font-medium leading-relaxed">
                   Withdrawals to verified local bank accounts are typically processed within 24 hours.
                 </p>
              </div>

              <button 
                disabled={!amount || amountNum <= 0 || amountNum > availableBalance || isProcessing}
                onClick={handleWithdraw}
                className="w-full h-14 bg-black text-white text-[14px] font-bold rounded-full hover:bg-[#222] transition-all flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                Review Withdrawal
                <IconArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div 
              key="confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              <div className="space-y-2">
                <h2 className="text-[24px] font-bold tracking-tight text-black">Confirm Withdrawal.</h2>
                <p className="text-[14px] text-gray-500 font-medium">Please verify the details before we initiate the transfer.</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3"
                >
                  <IconAlertCircle className="text-red-600 shrink-0" size={20} />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </motion.div>
              )}

              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="p-8 bg-gray-50/50 space-y-6">
                   <div className="flex justify-between items-center text-[13px] font-medium">
                      <span className="text-gray-400">Withdrawal Amount</span>
                      <span className="font-bold text-black">{formatCurrency(amountNum, selectedCurrency, rates)}</span>
                   </div>
                   <div className="h-px bg-gray-100" />
                   <div className="flex justify-between items-center text-[15px] font-bold">
                      <span className="text-black">Total to receive</span>
                      <span className="text-black text-[20px]">{formatCurrency(amountNum, selectedCurrency, rates)}</span>
                   </div>
                </div>
                <div className="p-8 bg-white border-t border-gray-100">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-black">
                        <IconBuildingBank size={24} />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-black tracking-tight">{selectedAccount?.bank_name} — •••{selectedAccount?.account_number.slice(-4)}</p>
                        <p className="text-[12px] text-gray-400 font-medium">{selectedAccount?.account_holder_name}</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep('input')}
                  disabled={isProcessing}
                  className="flex-1 h-14 bg-gray-50 text-black text-[14px] font-bold rounded-full hover:bg-gray-100 transition-all disabled:opacity-50"
                >
                  Edit Details
                </button>
                <button 
                  onClick={handleFinalConfirm}
                  disabled={isProcessing}
                  className="flex-[2] h-14 bg-black text-white text-[14px] font-bold rounded-full hover:bg-[#222] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <IconLoader size={18} className="animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      Confirm & Transfer
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-8"
            >
              <div className="w-20 h-20 bg-black text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-black/20">
                 <IconShieldCheck size={40} stroke={1.5} />
              </div>
              <div className="space-y-2">
                <h2 className="text-[28px] font-bold tracking-tight text-black">Withdrawal Initiated.</h2>
                <p className="text-[15px] text-gray-500 font-medium max-w-sm">
                   Your funds are on the way. You can track this transfer in your transaction ledger.
                </p>
              </div>
              <div className="pt-4 flex flex-col w-full max-w-xs gap-3">
                <Link 
                  href="/wallet"
                  className="h-12 bg-black text-white text-[13px] font-bold rounded-full flex items-center justify-center transition-all hover:bg-[#222]"
                >
                  Return to Wallet
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Shell>
  )
}
