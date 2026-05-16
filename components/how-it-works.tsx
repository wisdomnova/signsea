import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'projects'>('invoices')
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <section id="how-it-works" className="py-[160px] px-6 border-b border-gray-100">
      <div className="max-w-[1300px] mx-auto space-y-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-[48px] md:text-[84px] font-bold leading-[0.95] tracking-tighter mb-8 text-black">How it works.</h2>
            <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-lg leading-relaxed">Simple, surgical, and professional. Here is exactly how you secure your next deal.</p>
          </motion.div>

          {/* Toggle with Animation */}
          <div className="inline-flex p-1.5 bg-gray-100 rounded-[20px] self-start md:self-end relative">
            <motion.div 
              layoutId="activeTabSlot"
              className="absolute inset-1.5 w-[calc(50%-6px)] bg-white shadow-xl rounded-[14px]"
              initial={false}
              animate={{ 
                x: activeTab === 'invoices' ? 0 : '100%',
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button 
              onClick={() => { setActiveTab('invoices'); setActiveFeature(0); }}
              className={`relative z-10 px-10 py-4 rounded-[14px] text-[14px] font-bold tracking-tight transition-colors duration-300 ${activeTab === 'invoices' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
            >
              Invoices
            </button>
            <button 
              onClick={() => { setActiveTab('projects'); setActiveFeature(0); }}
              className={`relative z-10 px-10 py-4 rounded-[14px] text-[14px] font-bold tracking-tight transition-colors duration-300 ${activeTab === 'projects' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
            >
              Projects
            </button>
          </div>
        </div>

        {/* HORIZONTAL SCROLL MOCKUPS */}
        <div className="relative mt-24">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-12 overflow-x-auto pb-20 snap-x no-scrollbar px-4"
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
                  mockup: "REPLACE WITH INVOICE EDITOR MOCKUP" 
                },
                { 
                  step: "02", 
                  title: "Automated deposit", 
                  desc: "Clients receive the invoice and deposit funds into a secure escrow wallet.", 
                  mockup: "REPLACE WITH ESCROW DEPOSIT MOCKUP" 
                },
                { 
                  step: "03", 
                  title: "Instant liquidation", 
                  desc: "Funds are released to your bank account the moment work is approved.", 
                  mockup: "REPLACE WITH PAYOUT CONFIRMATION MOCKUP" 
                }
              ] : [
                { 
                  step: "01", 
                  title: "Define scope", 
                  desc: "Build a technical roadmap with specific milestones and protected payouts.", 
                  mockup: "REPLACE WITH MILESTONE BUILDER MOCKUP" 
                },
                { 
                  step: "02", 
                  title: "Clinical execution", 
                  desc: "Submit deliverables for each phase while the next milestone secures automatically.", 
                  mockup: "REPLACE WITH ACTIVE WORKSPACE MOCKUP" 
                },
                { 
                  step: "03", 
                  title: "Project closure", 
                  desc: "Complete final review and trigger the automated project closeout.", 
                  mockup: "REPLACE WITH PROJECT CLOSURE MOCKUP" 
                }
              ]).map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="min-w-[85vw] md:min-w-[1000px] snap-center group"
                >
                  <div className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
                      <div className="space-y-4 max-w-xl">
                        <span className="text-[14px] font-bold text-black uppercase tracking-[0.3em] flex items-center gap-3">
                          <span className="w-8 h-[1px] bg-black" /> Step {item.step}
                        </span>
                        <h4 className="text-[42px] font-bold tracking-tight text-black">{item.title}</h4>
                        <p className="text-gray-500 text-xl font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    <div className="relative p-3 bg-gray-50 border border-gray-100 rounded-[40px] shadow-2xl overflow-hidden aspect-[16/10]">
                      <div className="bg-white rounded-[32px] border border-gray-200 h-full w-full flex flex-col shadow-inner overflow-hidden">
                        <div className="h-12 border-b border-gray-100 flex items-center px-6 gap-2 bg-gray-50/50">
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                          </div>
                          <div className="ml-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                            {activeTab === 'invoices' ? `Invoicing // ${item.title}` : `Project Workspace // ${item.title}`}
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center p-12">
                          <div className="text-center space-y-4">
                            <p className="text-[11px] font-bold text-black uppercase tracking-[0.5em]">{item.mockup}</p>
                            <p className="text-gray-400 text-sm font-medium">Full viewport 1440px desktop view</p>
                          </div>
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
  )
}
