'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck, Scales, Scroll, Cookie, SealCheck, CaretRight } from '@phosphor-icons/react'

const docs = {
  'terms': {
    title: "Terms of Service",
    icon: Scales,
    subtitle: "Service Agreement",
    content: [
      "1. PROVISION OF SERVICES: SignSea (a product of Loin Tech) provides a technology platform to facilitate secure payments between Clients and Freelancers via an escrow mechanism. We are not a party to the actual project agreements between users but provide the infrastructure to enforce them.",
      "2. ESCROW MECHANISM: When a project is launched, the Client deposits the total project value into a secure escrow account managed by our payment partners. These funds are locked and can only be released upon: (a) Manual approval by the Client, (b) Successful milestone completion as per the agreed schedule, or (c) A final decision through our Dispute Resolution process.",
      "3. USER OBLIGATIONS: Users must provide accurate, KYC-compliant information. Using the platform for money laundering, unauthorized financial transactions, or bypassing the 2.5% platform fee by taking payments off-platform is strictly prohibited and will result in immediate account termination.",
      "4. FEES: SignSea charges a flat 2.5% service fee on all successful payouts. This fee covers contract generation, escrow security, and platform maintenance. Fees are non-refundable once funds have been released to the freelancer.",
      "5. LIMITATION OF LIABILITY: Loin Tech and SignSea shall not be liable for the quality of work delivered by freelancers or the conduct of clients. Our responsibility is limited to the secure handling of funds according to user-defined parameters."
    ]
  },
  'privacy': {
    title: "Privacy Policy",
    icon: ShieldCheck,
    subtitle: "Data Protection",
    content: [
      "1. DATA COLLECTION: We collect personal identifiers (Name, Email, Phone), financial data (Bank account details for payouts), and transaction history. This data is essential for maintaining your wallet and complying with financial regulations in Nigeria and internationally.",
      "2. DATA USAGE: Your information is used primarily to verify your identity (KYC), process withdrawals, and send automated project notifications. We do not sell your personal data to third-party advertisers.",
      "3. SECURITY MEASURES: All sensitive financial information is encrypted at rest and in transit. We use Paystack and other PCI-DSS compliant providers to handle payment processing, ensuring your bank details are never stored directly on our primary servers.",
      "4. DATA RETENTION: We retain transaction records for the period required by financial auditing laws. Users may request account deletion, but certain transactional data must be preserved for regulatory compliance."
    ]
  },
  'dispute': {
    title: "Dispute Resolution",
    icon: Scroll,
    subtitle: "How We Handle Disputes",
    content: [
      "1. OPENING A DISPUTE: Either party can initiate a 'Dispute' if they believe the terms of the project have not been met. This action immediately freezes any remaining funds in the project escrow.",
      "2. NEGOTIATION PHASE: Parties are encouraged to reach a mutual agreement within the platform. If a resolution is reached, the funds will be disbursed according to the new agreed-upon split.",
      "3. ARBITRATION PHASE: If no agreement is reached within 7 days, the SignSea Resolution Team will review the 'Evidence Ledger' (including project messages, file uploads, and milestone descriptions).",
      "4. FINAL DECISION: Our team will issue a final decision within 72 hours of the review phase. This decision may involve a full refund to the client, a full payout to the freelancer, or a split based on the work verified as completed. The decision of the SignSea Resolution Team is final and binding within the ecosystem."
    ]
  },
  'cookies': {
    title: "Cookie Policy",
    icon: Cookie,
    subtitle: "How We Use Cookies",
    content: [
      "1. NECESSARY COOKIES: These are essential for you to browse the website and use its features, such as accessing secure areas of the site (your dashboard and wallet).",
      "2. PERFORMANCE COOKIES: We use cookies to understand how visitors interact with the platform (e.g., how long it takes to create a project). This data is anonymized and used only for platform optimization.",
      "3. PREFERENCE COOKIES: These allow our platform to remember choices you have made in the past, like your preferred currency (NGN/USD) or your login state.",
      "4. COOKIE MANAGEMENT: You can choose to disable cookies through your browser settings, but please note that this may result in certain features of the SignSea platform becoming unavailable or non-functional."
    ]
  }
}

export default function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const resolvedParams = React.use(params)
  const docKey = resolvedParams.doc as keyof typeof docs
  const doc = docs[docKey] || docs['terms']
  const Icon = doc.icon

  return (
    <div className="min-h-screen bg-mist pt-24 sm:pt-32 pb-20 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navigation */}
        <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3">
                <div className="w-10 h-10 bg-abyss rounded-xl flex items-center justify-center group-hover:bg-seafoam transition-all duration-500">
                    <ArrowLeft size={20} weight="bold" className="text-pearl group-hover:text-abyss" />
                </div>
                <span className="text-xs font-black text-abyss uppercase tracking-[0.2em]">Back to Home</span>
            </Link>
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm opacity-40">
                <SealCheck size={18} weight="bold" className="text-seafoam" />
                <span className="text-[10px] uppercase font-black text-abyss tracking-widest">Verified</span>
            </div>
        </div>

        {/* Hero Section */}
        <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-abyss p-8 sm:p-12 md:p-16 rounded-[2rem] sm:rounded-[4rem] text-white relative overflow-hidden group shadow-2xl shadow-abyss/40"
        >
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 bg-seafoam/10 border border-seafoam/20 rounded-[2.5rem] flex items-center justify-center text-seafoam shadow-xl shadow-seafoam/10">
                    <Icon size={48} weight="duotone" />
                </div>
                <div className="text-center md:text-left space-y-4">
                    <p className="text-xs font-black text-seafoam uppercase tracking-[0.4em] mb-2">{doc.subtitle}</p>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight">{doc.title}.</h1>
                </div>
            </div>
            
            <div className="absolute top-0 right-0 p-16 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                <Icon size={320} weight="thin" />
            </div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-seafoam/5 rounded-full blur-[100px]" />
        </motion.section>

        {/* Content Layout */}
        <div className="grid lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-8 space-y-8"
            >
                <div className="bg-white p-6 sm:p-12 md:p-16 rounded-[2rem] sm:rounded-[3.5rem] border border-slate-100 shadow-lg shadow-abyss/5 space-y-8 sm:space-y-12">
                    {doc.content.map((p, i) => (
                        <div key={i} className="group/clause relative">
                            <div className="absolute -left-4 top-0 w-1 h-0 bg-seafoam group-hover/clause:h-full transition-all duration-500 rounded-full" />
                            <p className="text-lg text-marine/80 leading-relaxed font-medium transition-colors group-hover/clause:text-abyss">
                                {p}
                            </p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Sidebar Navigation / Links */}
            <div className="lg:col-span-4 space-y-8">
                <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                    <h3 className="text-xl font-serif font-black text-abyss">Legal Archive</h3>
                    <nav className="space-y-2">
                        {Object.entries(docs).map(([key, d]) => (
                            <Link 
                                key={key} 
                                href={`/legal/${key}`}
                                className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                                    docKey === key 
                                    ? 'bg-abyss border-abyss text-white shadow-xl shadow-abyss/10' 
                                    : 'bg-mist/30 border-transparent text-abyss hover:border-seafoam/30'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <d.icon size={20} weight={docKey === key ? 'fill' : 'duotone'} className={docKey === key ? 'text-seafoam' : 'text-marine/40'} />
                                    <span className="text-xs font-black uppercase tracking-widest">{d.title}</span>
                                </div>
                                <CaretRight size={14} weight="bold" />
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="p-10 bg-mist/50 rounded-[3rem] border border-dashed border-slate-200 text-center space-y-4">
                    <ShieldCheck size={40} weight="thin" className="mx-auto text-seafoam" />
                    <p className="text-[10px] font-black text-abyss uppercase tracking-widest">Official Document</p>
                    <p className="text-[9px] text-marine/40 font-bold leading-relaxed">
                        These terms are enforced by SignSea to ensure trust and security.
                    </p>
                </div>
            </div>
        </div>
        
      </div>
    </div>
  )
}
