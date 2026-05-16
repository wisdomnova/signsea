'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  IconArrowLeft,
  IconPlus,
  IconTrash,
  IconCheck,
  IconDeviceFloppy,
  IconPalette,
  IconEye,
  IconBuildingCommunity,
  IconUser,
  IconCalendar,
  IconReceipt,
  IconFileText,
  IconSettings,
  IconChevronDown,
} from '@tabler/icons-react'
import { Shell } from '@/components/dashboard-shell'
import { apiClient } from '@/lib/api-client'
import { format } from 'date-fns'

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export default function ProfessionalInvoiceMaker() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'design'>('editor')

  // --- STATE ---
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [companyName, setCompanyName] = useState('My Company')
  const [companyAddress, setCompanyAddress] = useState('')

  const [issueDate, setIssueDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [dueDate, setDueDate] = useState(format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'))
  const [currency, setCurrency] = useState('NGN')
  const [brandColor, setBrandColor] = useState('#000000')

  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: 'Web Design & Development', quantity: 1, unitPrice: 0 },
  ])

  const [taxRate, setTaxRate] = useState(0)
  const [notes, setNotes] = useState('')

  // --- CALCULATIONS ---
  const subtotal = useMemo(() => items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0), [items])
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount

  const currencySymbol = currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : '£'

  // --- ACTIONS ---
  async function handleSubmit() {
    setLoading(true)
    try {
      await apiClient.createInvoice({
        clientName, clientEmail, clientAddress,
        companyName, companyAddress,
        issueDate, dueDate, currency, brandColor,
        items: items.map(i => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice })),
        taxRate, notes
      })
      router.push('/invoices')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Shell title="Invoice Generator">
      <div className="flex flex-col lg:flex-row gap-12 min-h-screen">
        
        {/* LEFT PANEL: Editor */}
        <div className="w-full lg:w-[60%] space-y-10">
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[28px] font-bold text-black tracking-tight">Create Invoice.</h2>
                <p className="text-[14px] text-gray-500 font-medium">Issue professional billing for your clients.</p>
              </div>
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-all"
              >
                <IconArrowLeft size={18} />
              </button>
            </div>

            <div className="flex p-1 bg-gray-50 rounded-full w-fit border border-gray-100">
              {[
                { id: 'editor', label: 'Details', icon: IconFileText },
                { id: 'design', label: 'Appearance', icon: IconPalette },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-[12px] font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab.id ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black font-bold'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'editor' ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {/* Entities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                       <IconUser size={16} className="text-black" />
                       <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">Client Information</span>
                    </div>
                    <div className="space-y-3">
                      <input 
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-black transition-all outline-none" 
                        placeholder="Client Name" 
                        value={clientName} 
                        onChange={e => setClientName(e.target.value)} 
                      />
                      <input 
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-black transition-all outline-none" 
                        placeholder="Email Address" 
                        value={clientEmail} 
                        onChange={e => setClientEmail(e.target.value)} 
                      />
                      <textarea 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-black transition-all outline-none min-h-[100px] resize-none" 
                        placeholder="Client Physical Address" 
                        value={clientAddress} 
                        onChange={e => setClientAddress(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                       <IconBuildingCommunity size={16} className="text-black" />
                       <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">Your Details</span>
                    </div>
                    <div className="space-y-3">
                      <input 
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-black transition-all outline-none" 
                        placeholder="Your Company/Name" 
                        value={companyName} 
                        onChange={e => setCompanyName(e.target.value)} 
                      />
                      <textarea 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-black transition-all outline-none min-h-[100px] resize-none" 
                        placeholder="Company Address" 
                        value={companyAddress} 
                        onChange={e => setCompanyAddress(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <IconReceipt size={16} className="text-black" />
                       <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">Line Items</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {items.map((item, idx) => (
                      <div key={item.id} className="flex flex-col md:flex-row gap-3 items-center group">
                        <div className="flex-1 w-full relative">
                          <input 
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-black transition-all outline-none" 
                            placeholder="Description of service/product" 
                            value={item.description}
                            onChange={e => setItems(items.map(i => i.id === item.id ? {...i, description: e.target.value} : i))}
                          />
                        </div>
                        <div className="w-full md:w-24">
                          <input 
                            type="number" 
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-black transition-all outline-none text-center" 
                            value={item.quantity}
                            onChange={e => setItems(items.map(i => i.id === item.id ? {...i, quantity: parseFloat(e.target.value) || 0} : i))}
                          />
                        </div>
                        <div className="w-full md:w-32 relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[12px] font-bold">{currencySymbol}</span>
                          <input 
                            type="number" 
                            className="w-full h-12 pl-8 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-black transition-all outline-none" 
                            value={item.unitPrice}
                            onChange={e => setItems(items.map(i => i.id === item.id ? {...i, unitPrice: parseFloat(e.target.value) || 0} : i))}
                          />
                        </div>
                        <button 
                          onClick={() => setItems(items.filter(i => i.id !== item.id))}
                          className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent"
                        >
                          <IconTrash size={18} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }])}
                      className="flex items-center gap-2 px-6 h-12 rounded-xl text-[13px] font-bold text-black bg-white border border-gray-100 hover:border-black transition-all w-fit"
                    >
                      <IconPlus size={16} /> Add Position
                    </button>
                  </div>
                </div>

                {/* Configuration */}
                <div className="space-y-6">
                   <div className="flex items-center gap-2 mb-2">
                       <IconSettings size={16} className="text-black" />
                       <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">Invoice Settings</span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5 relative">
                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Currency</label>
                        <div className="relative">
                          <select 
                            className="w-full h-11 px-3 bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-bold outline-none appearance-none cursor-pointer focus:bg-white focus:border-black transition-all pr-10"
                            value={currency}
                            onChange={e => setCurrency(e.target.value)}
                          >
                            <option value="NGN">NGN (₦)</option>
                            <option value="USD">USD ($)</option>
                            <option value="GBP">GBP (£)</option>
                          </select>
                          <IconChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Issue Date</label>
                        <input type="date" className="w-full h-11 px-3 bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-bold outline-none" value={issueDate} onChange={e=>setIssueDate(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Due Date</label>
                        <input type="date" className="w-full h-11 px-3 bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-bold outline-none" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
                      </div>
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="design"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                 <div className="p-8 bg-gray-50 border border-gray-100 rounded-3xl space-y-6">
                    <div>
                      <h4 className="text-[15px] font-bold text-black mb-1">Brand Color.</h4>
                      <p className="text-[13px] text-gray-500 font-medium">Select the primary accent for your invoice PDF.</p>
                    </div>
                    <div className="flex gap-4">
                      {['#000000', '#2563eb', '#16a34a', '#dc2626', '#d97706'].map(color => (
                        <button
                          key={color}
                          onClick={() => setBrandColor(color)}
                          className={`w-12 h-12 rounded-full border-2 transition-all ${brandColor === color ? 'border-black' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <input 
                        type="color" 
                        value={brandColor} 
                        onChange={e => setBrandColor(e.target.value)}
                        className="w-12 h-12 rounded-full border-none bg-transparent cursor-pointer p-0"
                      />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-black pl-1">Footer Notes</label>
                    <textarea 
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[14px] font-medium focus:bg-white focus:border-black transition-all outline-none min-h-[120px] resize-none" 
                      placeholder="Add payment terms, banking details, or a thank you message..." 
                      value={notes} 
                      onChange={e => setNotes(e.target.value)} 
                    />
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL: Live Preview */}
        <div className="w-full lg:w-[40%]">
          <div className="sticky top-10 space-y-8">
            <div className="flex items-center gap-2 mb-4">
              <IconEye size={18} className="text-black" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">Live Preview</span>
            </div>

            {/* Invoice Artifact */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 aspect-[1/1.4] flex flex-col scale-[0.98] origin-top transition-all">
               <div className="flex justify-between items-start mb-12">
                  <div 
                    className="h-10 w-10 rounded-lg logo-placeholder flex items-center justify-center text-white font-black text-[18px]"
                    style={{ backgroundColor: brandColor }}
                  >
                    {companyName ? companyName.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="text-right">
                    <h1 className="text-[20px] font-bold text-black tracking-tight mb-1">INVOICE</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">#PV-0000</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8 mb-12 text-left">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3" style={{ color: brandColor !== '#000000' ? brandColor : undefined }}>From</p>
                    <p className="text-[13px] font-bold text-black leading-tight">{companyName || 'Your Name'}</p>
                    <p className="text-[11px] text-gray-500 font-medium mt-1 whitespace-pre-wrap">{companyAddress || 'Your Address'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Bill To</p>
                    <p className="text-[13px] font-bold text-black leading-tight">{clientName || 'Client Name'}</p>
                    <p className="text-[11px] text-gray-500 font-medium mt-1 whitespace-pre-wrap">{clientAddress || 'Client Address'}</p>
                  </div>
               </div>

               <div className="flex-1 w-full">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                        <th className="py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">Qty</th>
                        <th className="py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-4 text-[12px] font-medium text-black">{item.description || 'Empty Position'}</td>
                          <td className="py-4 text-[12px] font-medium text-black text-right">{item.quantity}</td>
                          <td className="py-4 text-[12px] font-medium text-black text-right">{currencySymbol}{item.unitPrice.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>

               <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                  {notes && (
                    <div className="mb-4">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Notes</p>
                      <p className="text-[10px] text-gray-500 font-medium leading-relaxed whitespace-pre-wrap">{notes}</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-gray-500">Subtotal</span>
                    <span className="text-[12px] font-bold text-black">{currencySymbol}{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[18px] font-bold text-black tracking-tight pt-2 border-t border-gray-50">
                    <span>Total Due</span>
                    <span style={{ color: brandColor !== '#000000' ? brandColor : undefined }}>{currencySymbol}{total.toLocaleString()}</span>
                  </div>
               </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !clientName || items[0].unitPrice === 0}
              className="w-full h-14 bg-black text-white rounded-full text-[14px] font-bold flex items-center justify-center gap-3 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xl shadow-black/10 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <IconDeviceFloppy size={20} />
                  Issue Invoice
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Shell>
  )
}
