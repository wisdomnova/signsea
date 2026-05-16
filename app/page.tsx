'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IconAnchor, 
  IconArrowRight, 
  IconArrowLeft, 
  IconCheck, 
  IconShieldLock, 
  IconLayersIntersect, 
  IconChartBar,
  IconCalendar,
  IconCertificate,
  IconClock,
  IconCreditCard,
  IconFileText,
  IconBriefcase
} from '@tabler/icons-react'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'projects' | 'clients'>('invoices')
  const [activeFeature, setActiveFeature] = useState(0)

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Account for clinical header height
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl h-16 flex items-center border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Image src="/logo.svg" alt="SignSea Logo" width={20} height={20} />
            <span className="text-[14px] sm:text-[16px] font-bold tracking-tight">SignSea</span>
          </div>

          <div className="hidden md:flex items-center gap-8 lg:gap-10 text-[12px] sm:text-[13px] font-bold text-gray-400">
            <a onClick={(e) => scrollToSection(e, 'product')} href="#product" className="hover:text-black transition-colors">How it works</a>
            <a onClick={(e) => scrollToSection(e, 'features')} href="#features" className="hover:text-black transition-colors">Features</a>
            <a onClick={(e) => scrollToSection(e, 'trust')} href="#trust" className="hover:text-black transition-colors">Trust</a>
            <a onClick={(e) => scrollToSection(e, 'faq')} href="#faq" className="hover:text-black transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            <Link href="/auth/login" className="text-[12px] sm:text-[13px] font-bold text-gray-400 hover:text-black transition-colors">Sign in</Link>
            <Link 
              href="/auth/register" 
              className="px-4 sm:px-5 h-9 bg-black text-white text-[12px] sm:text-[13px] font-bold rounded-full flex items-center justify-center hover:bg-gray-800 transition-all active:scale-95 whitespace-nowrap"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO SECTION - CAP.SO STYLE */}
        <section className="pt-[120px] sm:pt-[160px] pb-[80px] sm:pb-[100px] px-4 sm:px-6">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <h1 className="text-[40px] sm:text-[56px] md:text-[92px] font-bold leading-[0.95] tracking-[-0.05em] mb-8 sm:mb-10 text-black">
                Industrial payment<br />
                infrastructure.
              </h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-[16px] sm:text-[19px] md:text-2xl text-gray-500 max-w-2xl mb-10 sm:mb-12 font-medium leading-relaxed tracking-tight"
              >
                Secure your digital transactions with verifiable milestone-based escrow. Build trust through clinical precision and professional billing.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link 
                  href="/auth/register" 
                  className="px-8 h-14 bg-black text-white text-[15px] font-bold rounded-full flex items-center justify-center gap-3 hover:bg-gray-800 transition-all active:scale-95 shadow-2xl shadow-black/10"
                >
                  Enter SignSea
                  <IconArrowRight size={18} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* PRIMARY MOCKUP SPACE - DASHBOARD */}
        <section className="px-4 sm:px-6 relative -mt-8 sm:-mt-10 mb-[120px] sm:mb-[160px]">
          <div className="max-w-[1300px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.9, rotateX: 15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              transition={{ delay: 0.4, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: "1000px" }}
              className="relative p-3 bg-gray-50/50 border border-gray-100 rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] group overflow-hidden"
            >
              <div className="bg-white rounded-[32px] border border-gray-200 overflow-hidden aspect-[16/10] flex flex-col shadow-inner">
                <div className="h-12 border-b border-gray-100 flex items-center px-6 gap-2 bg-white/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>
                {/* MOCKUP 1: MAIN DASHBOARD */}
                <div className="flex-1 bg-white flex items-center justify-center relative overflow-hidden">
                   <Image 
                     src="/mockups/dashboard.png" 
                     alt="Dashboard overview" 
                     fill
                     className="object-contain"
                     priority
                   />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS - HORIZONTAL STEP-BY-STEP WALKTHROUGH */}
        <section id="product" className="py-[120px] sm:py-[160px] px-4 sm:px-6 overflow-hidden">
          <div className="max-w-[1300px] mx-auto space-y-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl"
              >
                <h2 className="text-[36px] sm:text-[48px] md:text-[84px] font-bold leading-[0.95] tracking-tighter mb-6 sm:mb-8 text-black">How it works.</h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-500 font-medium max-w-lg leading-relaxed">Simple, surgical, and professional. Here is exactly how you secure your next deal.</p>
              </motion.div>

              {/* Toggle with Animation */}
              <div className="inline-flex p-1.5 bg-gray-100 rounded-[20px] self-start md:self-end relative min-w-[320px] sm:min-w-[480px] w-full sm:w-auto">
                <motion.div 
                  layoutId="activeTabSlot"
                  className="absolute inset-1.5 w-[calc(33.33%-6px)] bg-white shadow-xl rounded-[14px]"
                  initial={false}
                  animate={{ 
                    x: activeTab === 'invoices' ? 0 : activeTab === 'projects' ? '100%' : '200%',
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <button 
                  onClick={() => { setActiveTab('invoices'); setActiveFeature(0); }}
                  className={`flex-1 relative z-10 px-4 sm:px-10 py-3 sm:py-4 rounded-[14px] text-[12px] sm:text-[14px] font-bold tracking-tight transition-colors duration-300 ${activeTab === 'invoices' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                >
                  Invoicing
                </button>
                <button 
                  onClick={() => { setActiveTab('projects'); setActiveFeature(0); }}
                  className={`flex-1 relative z-10 px-4 sm:px-10 py-3 sm:py-4 rounded-[14px] text-[12px] sm:text-[14px] font-bold tracking-tight transition-colors duration-300 ${activeTab === 'projects' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                >
                  Projects
                </button>
                <button 
                  onClick={() => { setActiveTab('clients'); setActiveFeature(0); }}
                  className={`flex-1 relative z-10 px-4 sm:px-10 py-3 sm:py-4 rounded-[14px] text-[12px] sm:text-[14px] font-bold tracking-tight transition-colors duration-300 ${activeTab === 'clients' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                >
                  For Clients
                </button>
              </div>
            </div>

            {/* HORIZONTAL SCROLL MOCKUPS */}
            <div className="relative mt-24 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-8 sm:gap-12 overflow-x-auto pb-20 snap-x no-scrollbar px-2 sm:px-4"
                  style={{
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                  }}
                >
                  {(activeTab === 'invoices' ? [
                    { 
                      step: "01", 
                      title: "Draft and customize", 
                      desc: "Define your line items, tax details, and branding in a high-precision editor.", 
                      mockup: "invoice-create" 
                    },
                    { 
                      step: "02", 
                      title: "Automated deposit", 
                      desc: "Clients receive the invoice and deposit funds into a secure escrow wallet.", 
                      mockup: "active-invoice" 
                    },
                    { 
                      step: "03", 
                      title: "Instant liquidation", 
                      desc: "Funds are released to your bank account the moment work is approved.", 
                      mockup: "invoices" 
                    }
                  ] : activeTab === 'projects' ? [
                    { 
                      step: "01", 
                      title: "Define scope", 
                      desc: "Build a technical roadmap with specific milestones and protected payouts.", 
                      mockup: "project-create" 
                    },
                    { 
                      step: "02", 
                      title: "Clinical execution", 
                      desc: "Submit deliverables for each phase while the next milestone secures automatically.", 
                      mockup: "active-project" 
                    },
                    { 
                      step: "03", 
                      title: "Project closure", 
                      desc: "Complete final review and trigger the automated project closeout.", 
                      mockup: "projects" 
                    }
                  ] : [
                    { 
                      step: "01", 
                      title: "Receive & Review", 
                      desc: "Get a secure payment link from your freelancer. Review milestones and terms before paying.", 
                      mockup: "pay-link" 
                    },
                    { 
                      step: "02", 
                      title: "Secure & Set Code", 
                      desc: "Deposit funds into escrow and set a personalized security passcode.", 
                      mockup: "set-code" 
                    },
                    { 
                      step: "03", 
                      title: "Authorize Payout", 
                      desc: "Enter your passcode to release funds only once the work is delivered and approved.", 
                      mockup: "authorize-release" 
                    }
                  ]).map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="min-w-[90vw] sm:min-w-[85vw] md:min-w-[1000px] snap-center group"
                    >
                      <div className="space-y-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
                          <div className="space-y-4 max-w-xl">
                            <span className="text-[14px] font-bold text-black uppercase tracking-[0.3em] flex items-center gap-3">
                              <span className="w-8 h-[1px] bg-black" /> Step {item.step}
                            </span>
                            <h4 className="text-[28px] sm:text-[36px] md:text-[42px] font-bold tracking-tight text-black">{item.title}</h4>
                            <p className="text-gray-500 text-base sm:text-lg md:text-xl font-medium leading-relaxed">{item.desc}</p>
                          </div>
                        </div>

                        <div className="relative p-3 bg-gray-50 border border-gray-100 rounded-[40px] shadow-2xl overflow-hidden aspect-[16/10]">
                          <div className="bg-white rounded-[32px] border border-gray-200 h-full w-full flex flex-col shadow-inner overflow-hidden">
                            <div className="h-12 border-b border-gray-100 flex items-center px-6 gap-2 bg-gray-50/50">
                              <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                              </div>
                              <div className="ml-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                {activeTab === 'invoices' ? `Invoicing // ${item.title}` : activeTab === 'projects' ? `Project Workspace // ${item.title}` : `Client Payment // ${item.title}`}
                              </div>
                            </div>
                            <div className="flex-1 relative overflow-hidden bg-white">
                              <Image 
                                src={`/mockups/${item.mockup}.png`}
                                alt={item.title}
                                fill
                                className="object-contain"
                                priority
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Scroll Indicator Tags */}
              <div className="flex justify-center gap-2 mt-8">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${activeFeature === i ? 'w-12 bg-black' : 'w-2 bg-gray-200'}`} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* INDUSTRIAL TRUST - FULL WIDTH SECTION */}
        <section id="trust" className="py-[120px] sm:py-[160px] px-4 sm:px-6 bg-black text-white rounded-[40px] sm:rounded-[60px] mx-4 sm:mx-6">
          <div className="max-w-[1300px] mx-auto space-y-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="max-w-4xl space-y-8 sm:space-y-12"
            >
              <h2 className="text-[36px] sm:text-[56px] md:text-[110px] font-bold leading-[0.9] tracking-tighter">Your reputation is your equity.</h2>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-400 font-medium max-w-2xl leading-relaxed">
                Build a verifiable history of successful transactions via our industrial trust scoring system.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-3 bg-white/5 border border-white/10 rounded-[48px] overflow-hidden"
            >
              <div className="bg-gray-900 rounded-[36px] aspect-[16/10] flex flex-col border border-white/10 overflow-hidden">
                 <div className="h-14 border-b border-white/5 flex items-center px-8 gap-3 bg-white/5">
                    <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-500/70" />
                      <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/70" />
                      <div className="w-3.5 h-3.5 rounded-full bg-green-500/70" />
                    </div>
                 </div>
                 <div className="flex-1 relative bg-gray-950">
                    <Image 
                      src="/mockups/reputation.png"
                      alt="Reputation dashboard"
                      fill
                      className="object-contain"
                      priority
                    />
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CALENDAR - THE CONTROL CENTER */}
        <section className="py-[120px] sm:py-[160px] px-4 sm:px-6">
          <div className="max-w-[1300px] mx-auto space-y-16 sm:space-y-24">
            <div className="max-w-4xl space-y-6 sm:space-y-12">
              <h2 className="text-[36px] sm:text-[48px] md:text-[84px] font-bold leading-[0.95] tracking-tighter text-black">Manage your timeline.</h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-500 font-medium max-w-2xl leading-relaxed">
                Operational precision means never missing a milestone. Our integrated calendar syncs your project deadlines with your financial payouts.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-3 bg-gray-50 border border-gray-100 rounded-[48px] shadow-2xl overflow-hidden"
            >
               <div className="bg-white rounded-[36px] border border-gray-200 aspect-[16/10] flex flex-col shadow-inner overflow-hidden">
                  <div className="h-14 border-b border-gray-100 flex items-center px-8 gap-3 bg-gray-50/50">
                    <div className="flex gap-2">
                       <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
                       <div className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                       <div className="w-3.5 h-3.5 rounded-full bg-green-400" />
                    </div>
                  </div>
                  <div className="flex-1 relative bg-white">
                    <Image 
                      src="/mockups/planner.png"
                      alt="Calendar and planner"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* SECONDARY MOCKUP - WALLET & CURRENCY */}
        <section id="product-legacy" className="py-[160px] px-6 bg-gray-50/50 border-y border-gray-100">
          <div className="max-w-[1200px] mx-auto space-y-20">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="max-w-2xl"
            >
              <h2 className="text-[48px] md:text-[64px] font-bold leading-[1.1] tracking-tight mb-8">Global reach.<br />Local precision.</h2>
              <p className="text-[19px] text-gray-500 font-medium leading-relaxed">
                Operate seamlessly in NGN, USD, and GBP. Secure your funds in escrow and release them only when conditions are met.
              </p>
            </motion.div>
            
            {/* LARGE MOCKUP 2: WALLET / CURRENCY SELECTOR */}
            <motion.div 
               initial={{ opacity: 0, y: 60, scale: 0.95 }}
               whileInView={{ opacity: 1, y: 0, scale: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
               className="relative p-3 bg-gray-50 border border-gray-100 rounded-[40px] shadow-2xl overflow-hidden"
            >
               <div className="bg-white rounded-[32px] aspect-[16/9] flex flex-col border border-gray-200 shadow-inner overflow-hidden">
                  <div className="h-12 border-b border-gray-100 flex items-center px-6 gap-2 bg-gray-50/50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                  </div>
                  <div className="flex-1 relative bg-white">
                    <Image 
                      src="/mockups/wallet.png"
                      alt="Wallet dashboard"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* THIRD MOCKUP - INVOICING */}
        <section id="features" className="py-[160px] px-6">
          <div className="max-w-[1200px] mx-auto space-y-20">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="max-w-2xl"
            >
              <h2 className="text-[48px] md:text-[64px] font-bold leading-[1.1] tracking-tight mb-8">Professional Billing.</h2>
              <p className="text-[19px] text-gray-500 font-medium leading-relaxed">
                Generate clinical-grade invoices with live previews. Customize brand colors and manage professional footer notes for every transaction.
              </p>
            </motion.div>

            {/* LARGE MOCKUP 3: INVOICE CREATOR */}
            <motion.div 
               initial={{ opacity: 0, y: 60, scale: 0.95 }}
               whileInView={{ opacity: 1, y: 0, scale: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
               className="relative p-3 bg-gray-50 border border-gray-100 rounded-[40px] shadow-2xl overflow-hidden"
            >
               <div className="bg-white rounded-[32px] aspect-[16/9] flex flex-col border border-gray-200 shadow-inner overflow-hidden">
                  <div className="h-12 border-b border-gray-100 flex items-center px-6 gap-2 bg-gray-50/50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                  </div>
                  <div className="flex-1 relative bg-white">
                    <Image 
                      src="/mockups/invoices.png"
                      alt="Invoices listing"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-[160px] px-6 border-t border-gray-100 bg-[#FAFAFB]">
          <div className="max-w-[1200px] mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                <div>
                   <h2 className="text-[48px] font-bold tracking-tight mb-8">Common<br />Questions.</h2>
                   <p className="text-gray-500 font-medium mb-12">Everything you need to know about industrial escrow and secured payments.</p>
                   <a 
                      onClick={(e) => scrollToSection(e, 'features')}
                      href="#features" 
                      className="text-black font-bold uppercase text-[11px] tracking-widest flex items-center gap-2 group cursor-pointer"
                   >
                      Get Started Today <IconArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </a>
                </div>
                <div className="space-y-12">
                   {[
                      { q: "How does the escrow work?", a: "Funds are held in a secure wallet and only released when both parties confirm milestone completion or delivery." },
                      { q: "Can I use multiple currencies?", a: "Yes, you can operate wallets and issue invoices in NGN, USD, and GBP natively within the industrial dashboard." },
                      { q: "What is the Trust Score?", a: "It's a verifiable reputation metric based on your history of successful, dispute-free transactions." },
                      { q: "How do you verify users?", a: "We use industrial-grade identity verification and historical performance tracking to ensure every participant on SignSea is legitimate and reliable." },
                      { q: "Is it secure?", a: "We use clinical-grade security protocols for all transactions, with full audit trails for every project." }
                   ].map((item, i) => (
                      <div key={i} className="space-y-4">
                         <h4 className="text-[15px] font-bold text-black uppercase tracking-wider">{item.q}</h4>
                         <p className="text-gray-500 font-medium leading-relaxed">{item.a}</p>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </section>

        {/* CTA FOOTER */}
        <section className="py-[180px] px-6 text-center">
           <div className="max-w-4xl mx-auto">
              <h2 className="text-[48px] md:text-[64px] font-bold text-black tracking-tight mb-8">Secure your next deal.</h2>
              <Link 
                href="/auth/register" 
                className="inline-flex px-12 h-16 bg-black text-white text-[17px] font-bold rounded-full items-center justify-center gap-4 hover:bg-gray-800 transition-all active:scale-95"
              >
                Get Started
                <IconArrowRight size={20} />
              </Link>
           </div>
        </section>
      </main>

      {/* Basic Footer */}
      <footer className="py-8 sm:py-12 border-t border-gray-100 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">
           <div className="flex items-center gap-2 text-black">
             <IconAnchor size={18} />
             <span className="text-[14px] sm:text-[16px] font-bold tracking-tight">SignSea</span>
           </div>
           <div className="flex gap-6 sm:gap-10 text-[12px] sm:text-[13px] font-bold text-gray-400 flex-wrap justify-center sm:justify-end">
             <span>© 2026 SignSea</span>
             <Link href="/legal/privacy" className="hover:text-black">Privacy</Link>
             <Link href="/legal/terms" className="hover:text-black">Terms</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
