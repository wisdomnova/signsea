'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  IconPlus, 
  IconTrash, 
  IconCircleCheck, 
  IconAnchor, 
  IconCurrencyNaira, 
  IconChevronLeft, 
  IconCircleCheckFilled,
  IconLoader2,
  IconArrowRight,
  IconShieldCheck,
  IconCalendar, 
  IconHourglassLow, 
  IconLayoutList, 
  IconSend,
  IconInfoCircle,
  IconBriefcase,
  IconTarget,
  IconBolt,
  IconX,
  IconCreditCard,
  IconStack2
} from '@tabler/icons-react'
import { createProjectAction } from '../../../lib/project-actions'
import { apiClient } from '@/lib/api-client'
import { koboToNaira } from '@/lib/currency-utils'

interface Milestone {
  id: string
  title: string
  amount: string
  dueDate: string
  dueTime: string
  isAutoRelease: boolean
}

export default function CreateProjectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  
  const [step, setStep] = useState(1)
  const [projectType, setProjectType] = useState<'SINGLE' | 'MILESTONES'>('MILESTONES')
  const [currency, setCurrency] = useState('NGN')
  const [duration, setDuration] = useState('14') // Days
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(!!editId)
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '1', title: 'Initial Draft', amount: '', dueDate: '', dueTime: '12:00', isAutoRelease: false }
  ])

  const currencySymbol = currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : '£'

  // Load existing project if editing
  useEffect(() => {
    if (editId) {
      const loadProject = async () => {
        try {
          const data: any = await apiClient.request(`/projects/${editId}`, 'GET')
          
          setTitle(data.title || '')
          setDescription(data.description || '')
          setCurrency(data.currency || 'NGN')
          setClientName(data.client_name || '')
          setClientEmail(data.client_email || '')
          setProjectType(data.type === 'SINGLE' ? 'SINGLE' : 'MILESTONES')
          
          // Parse milestones or convert single payment
          if (data.type === 'SINGLE') {
            setMilestones([{
              id: '1',
              title: 'Total Project Amount',
              amount: String(koboToNaira(data.total_amount || 0)),
              dueDate: data.created_at || new Date().toISOString().split('T')[0],
              dueTime: '12:00',
              isAutoRelease: false
            }])
          } else if (data.milestones && Array.isArray(data.milestones)) {
            setMilestones(data.milestones.map((m: any, idx: number) => ({
              id: String(idx + 1),
              title: m.title || '',
              amount: String(koboToNaira(m.amount || 0)),
              dueDate: m.releaseDate ? new Date(m.releaseDate).toISOString().split('T')[0] : '',
              dueTime: '12:00',
              isAutoRelease: m.isAutoRelease || false
            })))
          }
        } catch (err) {
          console.error('Failed to load project:', err)
          alert('Failed to load project')
          router.back()
        } finally {
          setIsLoading(false)
        }
      }
      
      loadProject()
    }
  }, [editId, router])

  const handleCancel = () => {
    router.back()
  }

  const addMilestone = () => {
    setMilestones([...milestones, { 
      id: Math.random().toString(), 
      title: '', 
      amount: '', 
      dueDate: '', 
      dueTime: '12:00' ,
      isAutoRelease: false
    }])
  }

  const removeMilestone = (id: string) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter(m => m.id !== id))
    }
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: string | boolean) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const totalAmount = milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0)

  const handleSubmit = async () => {
    if (!title || !description) {
      alert('Please fill in title and description')
      setStep(1)
      return
    }

    // Validate email if provided
    if (clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      alert('Please enter a valid email address or leave it blank')
      setStep(1)
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('projectType', projectType)
      formData.append('duration', duration)
      formData.append('currency', currency)
      formData.append('clientName', clientName)
      // Only send email if it's not empty
      if (clientEmail) {
        formData.append('clientEmail', clientEmail)
      }
      if (editId) {
        formData.append('projectId', editId)
      }
      formData.append('milestones', JSON.stringify(
        projectType === 'SINGLE'
          ? [{ title: 'Total Project Amount', amount: totalAmount.toString(), releaseDate: new Date().toISOString(), isAutoRelease: false }]
          : milestones.map(m => {
              // If dueDate is not set, use 30 days from now as default
              const dueDateStr = m.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              return {
                title: m.title,
                amount: m.amount,
                releaseDate: new Date(dueDateStr).toISOString(),
                isAutoRelease: m.isAutoRelease
              }
            })
      ))

      const result = await createProjectAction(formData)
      if (result.success) {
        setIsSubmitting(false)
        const projectData = result.project as any
        router.push(`/p/${projectData.id}?new=${editId ? 'false' : 'true'}`)
      } else {
        throw new Error(result.error as string)
      }
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
      alert('Failed to ' + (editId ? 'update' : 'create') + ' project')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleCancel}
              className="text-[12px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors"
            >
              Cancel
            </button>
            <div className="h-4 w-px bg-gray-100" />
            <div className="text-[12px] font-bold text-black uppercase tracking-widest">
              {isLoading ? 'Loading...' : `Step ${step} of 2`}
            </div>
          </div>
        </div>
      </nav>

      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <IconLoader2 size={48} className="animate-spin text-black" />
            <p className="text-gray-400 font-medium">Loading project...</p>
          </div>
        </div>
      ) : (
        <main className="max-w-6xl mx-auto py-20 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-12">
               <div className="space-y-4">
                  <h1 className="text-[36px] font-bold leading-tight tracking-tight text-black">{editId ? 'Edit Project' : 'Create Project'}</h1>
                  <p className="text-[15px] text-gray-500 font-medium leading-relaxed max-w-md">
                     {editId ? 'Update your project details and milestones.' : 'Set your terms and milestones. We will keep the funds safe until the job is done perfectly.'}
                  </p>
               </div>

               <div className="flex flex-col gap-8">
                  <div className="flex gap-5 items-center">
                     <div className={`w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[12px] font-bold transition-all ${step >= 1 ? 'bg-black text-white' : 'text-gray-300'}`}>1</div>
                     <div className="flex flex-col border-none">
                        <span className={`text-[12px] font-bold uppercase tracking-[0.1em] ${step >= 1 ? 'text-black' : 'text-gray-300'}`}>Step 01</span>
                        <span className={`text-[14px] font-bold ${step >= 1 ? 'text-black' : 'text-gray-300'}`}>Project Details</span>
                     </div>
                  </div>
                  <div className="flex gap-5 items-center">
                     <div className={`w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[12px] font-bold transition-all ${step >= 2 ? 'bg-black text-white' : 'text-gray-300'}`}>2</div>
                     <div className="flex flex-col">
                        <span className={`text-[12px] font-bold uppercase tracking-[0.1em] ${step >= 2 ? 'text-black' : 'text-gray-300'}`}>Step 02</span>
                        <span className={`text-[14px] font-bold ${step >= 2 ? 'text-black' : 'text-gray-300'}`}>Milestone Plans</span>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 space-y-8">
                  <div className="space-y-6">
                     <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        <span>Project Total</span>
                        <span className="text-black">{currencySymbol}{totalAmount.toLocaleString()}</span>
                     </div>
                     <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        <span>Service Fee (0%)</span>
                        <span className="text-black">{currencySymbol}0</span>
                     </div>
                     <div className="h-px bg-gray-200" />
                     <div className="pt-2">
                        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 block mb-3">Total Payment</span>
                        <div className="text-[32px] font-bold text-black tracking-tight leading-none">
                           {currencySymbol}{totalAmount.toLocaleString()}
                        </div>
                        <p className="text-[12px] text-gray-400 font-medium mt-3 leading-relaxed">
                           Money is held securely and released only when you confirm the work is completed.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7">
               <AnimatePresence mode="wait">
                 {step === 1 ? (
                   <motion.div 
                     key="step1"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="space-y-12"
                   >
                      <div className="space-y-10">
                         <div className="space-y-4">
                            <label className="text-[12px] font-bold text-black uppercase tracking-[0.15em] pl-1">Project Name</label>
                            <input 
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="e.g. Website Design or Monthly Supplies"
                              className="w-full h-14 px-6 bg-white border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all font-medium text-black"
                            />
                         </div>

                         <div className="space-y-4">
                            <label className="text-[12px] font-bold text-black uppercase tracking-[0.15em] pl-1">Currency</label>
                            <div className="grid grid-cols-3 gap-3">
                               {[
                                  { code: 'NGN', label: '🇳🇬 Naira (₦)' },
                                  { code: 'USD', label: '🇺🇸 Dollar ($)' },
                                  { code: 'GBP', label: '🇬🇧 Pound (£)' }
                               ].map((curr) => (
                                  <button
                                     key={curr.code}
                                     onClick={() => setCurrency(curr.code)}
                                     className={`h-12 rounded-lg border text-[13px] font-bold transition-all ${
                                        currency === curr.code 
                                        ? 'bg-black border-black text-white shadow-lg' 
                                        : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:text-black'
                                     }`}
                                  >
                                     {curr.label}
                                  </button>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-4">
                            <label className="text-[12px] font-bold text-black uppercase tracking-[0.15em] pl-1">Description</label>
                            <textarea 
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Describe the work or items you are paying for..."
                              className="w-full px-6 py-5 bg-white border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all font-medium text-black min-h-[140px] resize-none"
                            />
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-4">
                               <label className="text-[12px] font-bold text-black uppercase tracking-[0.15em] pl-1">Client Full Name</label>
                               <input 
                                 value={clientName}
                                 onChange={(e) => setClientName(e.target.value)}
                                 placeholder="e.g. John Smith"
                                 className="w-full h-14 px-6 bg-white border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all font-medium text-black"
                               />
                            </div>
                            <div className="space-y-4">
                               <label className="text-[12px] font-bold text-black uppercase tracking-[0.15em] pl-1">Client Email</label>
                               <input 
                                 type="email"
                                 value={clientEmail}
                                 onChange={(e) => setClientEmail(e.target.value)}
                                 placeholder="e.g. john@example.com"
                                 className="w-full h-14 px-6 bg-white border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all font-medium text-black"
                               />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[12px] font-bold text-black uppercase tracking-[0.15em] pl-1">Payment Strategy</label>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <button 
                             onClick={() => setProjectType('SINGLE')}
                             className={`group p-6 rounded-xl border text-left transition-all duration-200 ${projectType === 'SINGLE' ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-black hover:border-gray-200'}`}
                            >
                               <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-6 transition-all duration-200 ${projectType === 'SINGLE' ? 'bg-white/10' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                                  <IconCreditCard size={20} className={projectType === 'SINGLE' ? 'text-white' : 'text-gray-400'} />
                               </div>
                               <p className="text-[14px] font-bold mb-1 tracking-tight">One-off Payment</p>
                               <p className={`text-[12px] font-medium leading-relaxed ${projectType === 'SINGLE' ? 'text-white/60' : 'text-gray-400'}`}>Pay everything at once on completion.</p>
                            </button>

                            <button 
                             onClick={() => setProjectType('MILESTONES')}
                             className={`group p-6 rounded-xl border text-left transition-all duration-200 ${projectType === 'MILESTONES' ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-black hover:border-gray-200'}`}
                            >
                               <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-6 transition-all duration-200 ${projectType === 'MILESTONES' ? 'bg-white/10' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                                  <IconStack2 size={20} className={projectType === 'MILESTONES' ? 'text-white' : 'text-gray-400'} />
                               </div>
                               <p className="text-[14px] font-bold mb-1 tracking-tight">Milestone Steps</p>
                               <p className={`text-[12px] font-medium leading-relaxed ${projectType === 'MILESTONES' ? 'text-white/60' : 'text-gray-400'}`}>Release funds in stages as work progress.</p>
                            </button>
                         </div>
                      </div>

                      <div className="flex justify-between items-center bg-gray-50 p-6 rounded-xl border border-gray-100">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center">
                               <IconStack2 size={20} className="text-black" />
                            </div>
                            <div>
                               <p className="text-[14px] font-bold text-black tracking-tight">Timeline</p>
                               <p className="text-[12px] text-gray-500 font-medium leading-none">Estimated duration</p>
                            </div>
                         </div>
                         <div className="relative">
                            <select 
                               value={duration}
                               onChange={(e) => setDuration(e.target.value)}
                               className="h-10 pl-4 pr-10 bg-white border border-gray-200 rounded-lg focus:border-black outline-none transition-all font-bold text-black text-[13px] appearance-none cursor-pointer"
                            >
                               <option value="1 week">1 Week</option>
                               <option value="2 weeks">2 Weeks</option>
                               <option value="1 month">1 Month</option>
                               <option value="Custom">Custom</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                         </div>
                      </div>

                      <div className="flex justify-end pt-10">
                        <button 
                          type="button"
                          onClick={() => setStep(2)}
                          className="px-12 h-14 bg-black text-white text-[13px] font-bold rounded-full hover:bg-gray-800 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl active:scale-95"
                        >
                           Next Step
                           <IconArrowRight size={18} />
                        </button>
                      </div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="step2"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="space-y-12"
                   >
                      <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                         <div className="flex items-center gap-4">
                            <button onClick={() => setStep(1)} className="p-2 -ml-2 text-gray-400 hover:text-black transition-colors">
                               <IconChevronLeft size={20} />
                            </button>
                            <h2 className="text-[20px] font-bold text-black tracking-tight">Payment Setup</h2>
                         </div>
                         {projectType === 'MILESTONES' && (
                           <button 
                             onClick={addMilestone}
                             className="flex items-center gap-2 px-4 h-11 bg-black text-white text-[11px] uppercase tracking-wider font-bold rounded-lg hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                           >
                             <IconPlus size={16} />
                             Add Milestone
                           </button>
                         )}
                      </div>

                      <div className="space-y-6">
                        {projectType === 'SINGLE' ? (
                          <div className="p-8 bg-white rounded-xl border border-gray-100 space-y-8">
                             <div className="space-y-4 text-center py-4">
                               <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                 <IconTarget size={32} className="text-black" />
                               </div>
                               <h3 className="text-[18px] font-bold text-black tracking-tight">Fixed Price</h3>
                               <p className="text-[14px] text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">The full amount will be held securely and released on your command.</p>
                             </div>
                             
                             <div className="space-y-3">
                                <label className="text-[11px] font-bold text-black uppercase tracking-[0.2em] pl-1">Payment Amount ({currencySymbol})</label>
                                <div className="relative">
                                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{currencySymbol}</div>
                                  <input 
                                    value={milestones[0].amount}
                                    onChange={(e) => updateMilestone(milestones[0].id, 'amount', e.target.value)}
                                    placeholder="0.00"
                                    type="number"
                                    className="w-full h-16 pl-14 pr-6 bg-gray-50 border-none rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all font-bold text-[24px] text-black"
                                  />
                                </div>
                             </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {milestones.map((m, index) => (
                              <div key={m.id} className="p-6 border border-gray-100 rounded-xl bg-white space-y-6">
                                 <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-bold text-black uppercase tracking-[0.2em]">Milestone {index + 1}</span>
                                    {milestones.length > 1 && (
                                      <button onClick={() => removeMilestone(m.id)} className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors">
                                        <IconTrash size={18} />
                                      </button>
                                    )}
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[11px] font-bold text-black uppercase tracking-[0.1em] pl-1 text-gray-400">Deliverable</label>
                                       <input 
                                         value={m.title}
                                         onChange={(e) => updateMilestone(m.id, 'title', e.target.value)}
                                         placeholder="e.g. Initial Draft"
                                         className="w-full h-12 px-4 bg-gray-50 border-none rounded-lg focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all font-bold text-black text-[14px]"
                                       />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[11px] font-bold text-black uppercase tracking-[0.1em] pl-1 text-gray-400">Amount ({currencySymbol})</label>
                                       <div className="relative">
                                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[12px]">{currencySymbol}</div>
                                          <input 
                                            value={m.amount}
                                            onChange={(e) => updateMilestone(m.id, 'amount', e.target.value)}
                                            placeholder="0.00"
                                            type="number"
                                            className="w-full h-12 pl-10 pr-4 bg-gray-50 border-none rounded-lg focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all font-bold text-black text-[14px]"
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end pt-10">
                        <button 
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="px-12 h-14 bg-black text-white text-[13px] font-bold rounded-full hover:bg-gray-800 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95"
                        >
                           {isSubmitting ? (
                             <>
                               <IconLoader2 size={18} className="animate-spin" />
                               {editId ? 'Updating...' : 'Deploying...'}
                             </>
                           ) : (
                             <>
                               {editId ? 'Update Project' : 'Confirm & Create'}
                               <IconArrowRight size={18} />
                             </>
                           )}
                        </button>
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
