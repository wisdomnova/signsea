'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  IconHome,
  IconBriefcase,
  IconCalendar,
  IconWallet,
  IconSettings,
  IconCircleCheck,
  IconPlus,
  IconList,
  IconX,
  IconAnchor,
  IconArrowLeftRight,
  IconBell,
  IconSearch,
  IconArrowUpRight,
  IconHeadphones,
  IconChevronDown,
  IconInfoCircle,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconTrash,
  IconCoin,
  IconStar,
  IconShieldCheck,
  IconFile,
  IconLogout,
  IconShield,
  IconCurrencyNaira,
  IconCurrencyDollar,
  IconCurrencyPound,
  IconWorld
} from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrency } from '@/lib/currency-context'
import { apiClient } from '@/lib/api-client'

export function Sidebar({ isOpen, setIsOpen, onSignOut }: { isOpen: boolean, setIsOpen: (val: boolean) => void, onSignOut: () => void }) {
  const pathname = usePathname()
  
  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: IconHome },
    { label: 'Projects', href: '/projects', icon: IconBriefcase },
    { label: 'Invoices', href: '/invoices', icon: IconFile },
    { label: 'Planner', href: '/planner', icon: IconCalendar },
    { label: 'Wallet', href: '/wallet', icon: IconWallet },
    { label: 'Settings', href: '/settings', icon: IconSettings },
    { label: 'Trust Score', href: '/reputation', icon: IconShield },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-all duration-300" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full bg-white text-[#111] p-6 flex flex-col items-start border-r border-gray-100 z-50 transition-all duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:w-64'
      }`}>
        <div className="flex items-center justify-between w-full mb-10 relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <IconAnchor size={18} className="text-black" />
            <span className="text-[17px] font-bold tracking-tighter text-black">SignSea</span>
          </Link>
          <button className="md:hidden p-2 text-gray-400 hover:text-black transition-colors" onClick={() => setIsOpen(false)}>
            <IconX size={20} />
          </button>
        </div>
        
        <nav className="flex-grow space-y-1 w-full relative z-10">
          <p className="px-3 text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase mb-4">Account</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const isTrust = item.label === 'Trust Score'
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-[#F5F5F7] text-black font-semibold' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-black font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`transition-colors duration-200 ${isActive ? 'text-black' : 'group-hover:text-black'}`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-[13px] tracking-tight">{item.label}</span>
                </div>
                
                {isTrust && (
                  <span className={`text-[11px] font-black ${isActive ? 'text-black' : 'text-gray-400'}`}>0.0</span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto w-full relative z-10 pt-4 border-t border-gray-50">
          <button 
            onClick={onSignOut}
            className="w-full flex items-center justify-between group transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
          >
             <span className="text-[9px] font-bold tracking-[0.2em] text-red-500/60 uppercase group-hover:text-red-600 transition-colors">Sign Out</span>
             <IconLogout size={14} className="text-red-500/60 group-hover:text-red-600 transition-colors" />
          </button>
        </div>
      </aside>
    </>
  )
}

export function Shell({ title, children }: { title: string, children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showCurrencySelector, setShowCurrencySelector] = useState(false)
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const [userInitials, setUserInitials] = useState('U')
  const { selectedCurrency, setSelectedCurrency } = useCurrency()
  const router = useRouter()

  React.useEffect(() => {
    // Set user initials from localStorage after mount
    const initials = localStorage.getItem('userInitials') || 'U'
    setUserInitials(initials)
  }, [])

  const currencyMap: Record<string, { label: string; icon: any }> = {
    NGN: { label: 'Naira', icon: IconCurrencyNaira },
    USD: { label: 'Dollar', icon: IconCurrencyDollar },
    GBP: { label: 'Pound', icon: IconCurrencyPound },
  }

  const currencies = ['NGN', 'USD', 'GBP']

  const handleSignOut = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear all stored data
      apiClient.clearAuth()
      localStorage.removeItem('userInitials')
      localStorage.removeItem('userName')
      setShowSignOutModal(false)
      router.push('/auth/login')
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-[#111]">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        onSignOut={() => setShowSignOutModal(true)} 
      />
      
      <main className="md:pl-64 min-h-screen">
        <header className="h-[60px] bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-1.5 text-black hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <IconList size={22} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowCurrencySelector(!showCurrencySelector)}
                className={`flex items-center gap-2 px-3 h-9 rounded-lg border transition-all ${
                  showCurrencySelector ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-gray-400 hover:text-black hover:border-gray-200'
                }`}
              >
                <div className={showCurrencySelector ? 'text-white' : 'text-black'}>
                  {currencyMap[selectedCurrency]?.icon ? (
                    React.createElement(currencyMap[selectedCurrency].icon, { size: 16 })
                  ) : (
                    <IconCurrencyDollar size={16} />
                  )}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest">{selectedCurrency}</span>
                <IconChevronDown size={14} className={`transition-transform duration-200 ${showCurrencySelector ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showCurrencySelector && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowCurrencySelector(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden"
                    >
                      <div className="p-3 border-b border-gray-50">
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">Select Currency</span>
                      </div>
                      <div className="p-1.5">
                        {currencies.map((curr) => (
                          <button
                            key={curr}
                            onClick={() => {
                              setSelectedCurrency(curr)
                              setShowCurrencySelector(false)
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                              selectedCurrency === curr ? 'bg-gray-50 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${selectedCurrency === curr ? 'bg-black text-white' : 'bg-gray-50 text-gray-400'}`}>
                              {currencyMap[curr]?.icon ? (
                                React.createElement(currencyMap[curr].icon, { size: 14 })
                              ) : (
                                <IconCurrencyDollar size={14} />
                              )}
                            </div>
                            <span className="text-[12px] font-bold flex-grow">{currencyMap[curr]?.label || curr}</span>
                            {selectedCurrency === curr && <IconCheck size={14} className="text-black" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 transition-colors relative rounded-lg ${showNotifications ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-black'}`}
              >
                 <IconBell size={18} />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowNotifications(false)} 
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                        <span className="text-[12px] font-bold text-black uppercase tracking-widest">Notifications</span>
                        <span className="text-[10px] font-bold text-gray-300">0 New</span>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        <div className="p-8 text-center">
                          <p className="text-[13px] text-gray-400 font-medium">No notifications yet</p>
                          <p className="text-[12px] text-gray-300 mt-2">You're all caught up!</p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
               <span className="text-[11px] font-bold text-gray-600">{userInitials}</span>
            </div>
          </div>
        </header>

        <div className="px-6 md:px-10 py-10">
          {children}
        </div>
      </main>

      {/* Custom Sign Out Modal */}
      <AnimatePresence>
        {showSignOutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSignOutModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[360px] bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-600 border border-red-100">
                <IconLogout size={28} />
              </div>
              <h2 className="text-xl font-bold text-black tracking-tight mb-2">Leaving so soon?</h2>
              <p className="text-[13px] text-gray-500 mb-8 leading-relaxed">
                You'll need to sign back in to access your projects and secured funds.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowSignOutModal(false)}
                  className="px-4 py-3 bg-gray-50 text-gray-500 rounded-xl text-[13px] font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSignOut}
                  className="px-4 py-3 bg-red-600 text-white rounded-xl text-[13px] font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
