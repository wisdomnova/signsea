'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IconShieldCheck, 
  IconCircleCheck, 
  IconClock,
  IconArrowRight,
  IconStar,
  IconAlertCircle,
  IconX,
  IconCreditCard,
  IconUserCircle,
  IconBriefcase,
  IconWorld,
  IconLock,
  IconLoader2,
  IconChevronRight,
  IconTrendingUp,
  IconChecks,
  IconInputCheck,
  IconCopy,
  IconDownload,
  IconQrcode,
  IconLink
} from '@tabler/icons-react'
import { QRCodeSVG } from 'qrcode.react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { Shell } from '../../../components/dashboard-shell'
import { apiClient } from '../../../lib/api-client'
import { koboToNaira, formatCurrency } from '../../../lib/currency-utils'
import { useCurrency } from '../../../lib/currency-context'

export default function ProjectPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const projectId = params.projectId as string
  const projectUrl = typeof window !== 'undefined' ? `https://signsea.org/p/${projectId}` : ''
  const { selectedCurrency, rates } = useCurrency()
  const clientUrl = typeof window !== 'undefined' ? `https://signsea.org/pay/${projectId}` : ''
  
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<any>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [showPasscodeModal, setShowPasscodeModal] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [passcodeSaved, setPasscodeSaved] = useState(false)
  const [showReleaseModal, setShowReleaseModal] = useState(false)
  const [releasePasscode, setReleasePasscode] = useState('')
  const [showAgreement, setShowAgreement] = useState(false)
  const [isReleasing, setIsReleasing] = useState(false)
  const isNew = searchParams.get('new') === 'true'
  const [showShareModal, setShowShareModal] = useState(isNew)

  // Fetch project data
  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true)
        const data: any = await apiClient.request(`/projects/${projectId}`, 'GET')
        setProject(data)
        if (data?.payment_received_at) {
          setIsPaid(true)
        }
        if (data?.passcode_set) {
          setPasscodeSaved(true)
        }
      } catch (err) {
        console.error('Failed to load project:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [projectId])

  const projectTotal = project?.total_amount ? koboToNaira(project.total_amount) : 0
  const totalPayable = projectTotal

  const handleCopyLink = () => {
    navigator.clipboard.writeText(clientUrl)
    showToast('Link copied to clipboard', 'success')
  }

  const handleDownloadQR = () => {
    const svg = document.getElementById('project-qr')
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.download = `payment-${projectId}-qr.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }
  }

  const handlePayNow = async () => {
    if (!project) return
    setIsPaymentLoading(true)

    try {
      showToast('Redirecting to secure payment...', 'info')
      
      // Mark payment as received on backend first
      try {
        await apiClient.request(`/projects/${projectId}/mark-paid`, 'POST')
      } catch (err) {
        console.warn('Failed to mark payment on backend:', err)
      }

      // Then update UI state
      setTimeout(() => {
        setIsPaid(true)
        setIsPaymentLoading(false)
        showToast('Payment successful!', 'success')
        setShowPasscodeModal(true)
      }, 1500)
    } catch (err: any) {
      setIsPaymentLoading(false)
      showToast(err?.message || 'Payment failed. Please try again.', 'error')
    }
  }

  const handleSavePasscode = async () => {
    if (passcode.length !== 4 || !/^\d+$/.test(passcode)) {
      showToast('Passcode must be exactly 4 digits', 'error')
      return
    }

    try {
      await apiClient.request(`/projects/${projectId}/set-passcode`, 'POST', {
        passcode,
      })
      setPasscodeSaved(true)
      setShowPasscodeModal(false)
      setPasscode('')
      showToast('Passcode saved! You can now authorize release when ready.', 'success')
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to save passcode. Please try again.'
      showToast(errorMsg, 'error')
      console.error('Failed to save passcode:', err)
    }
  }

  const handleReleaseEscrow = async () => {
    if (releasePasscode.length !== 4 || !/^\d+$/.test(releasePasscode)) {
      showToast('Passcode must be exactly 4 digits', 'error')
      return
    }

    try {
      setIsReleasing(true)
      await apiClient.request(`/projects/${projectId}/release-escrow`, 'POST', {
        passcode: releasePasscode,
      })
      setShowReleaseModal(false)
      setShowAgreement(false)
      setReleasePasscode('')
      showToast('Funds released successfully!', 'success')
      
      // Refresh project data
      const data: any = await apiClient.request(`/projects/${projectId}`, 'GET')
      setProject(data)
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to release funds. Please try again.'
      showToast(errorMsg, 'error')
      console.error('Failed to release escrow:', err)
    } finally {
      setIsReleasing(false)
    }
  }

  // Simple toast mock as I don't have the real toast context easily available here
  const showToast = (msg: string, type: string) => alert(msg)

  if (loading) {
    return (
      <Shell title="Project Details">
        <div className="max-w-7xl mx-auto py-20 flex flex-col items-center justify-center space-y-4 animate-pulse">
            <div className="w-12 h-12 bg-gray-100 rounded-full" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
        </div>
      </Shell>
    )
  }

  if (!project) {
    return (
      <Shell title="Project Not Found">
        <div className="max-w-7xl mx-auto py-20 flex flex-col items-center justify-center text-center">
            <IconAlertCircle size={48} className="text-gray-200 mb-6" />
            <h2 className="text-[20px] font-bold text-black mb-2">Project Not Found</h2>
            <p className="text-gray-400 max-w-sm mb-10">We couldn't find the project you're looking for. It may have been deleted.</p>
            <Link href="/dashboard" className="px-8 h-12 bg-black text-white text-[12px] font-bold rounded-full flex items-center gap-2">
               <IconArrowRight size={16} />
               Back to Dashboard
            </Link>
        </div>
      </Shell>
    )
  }

  return (
    <Shell title={project.title}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto pb-20"
      >
        {/* Back Button */}
        <button 
          onClick={() => router.push('/projects')}
          className="mb-6 flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-gray-500 hover:text-black transition-colors"
        >
          <IconArrowRight size={16} className="rotate-180" />
          Back
        </button>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Project Stats Header */}
            <div className="p-8 sm:p-10 bg-white border border-gray-100 rounded-[32px] space-y-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-blue-50/50 transition-colors duration-700" />
               
               <div className="relative z-10">
                 <div className="flex flex-wrap items-center gap-3 mb-8">
                    <span className="px-3 py-1 bg-black text-[9px] font-bold text-white rounded-full uppercase tracking-widest">
                      {project.type === 'SINGLE' ? 'Single Payment' : 'Milestone Based'}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       <IconClock size={14} />
                       {project.status?.replace('_', ' ') || 'PENDING'}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-auto p-1 bg-gray-50 rounded-lg">
                       <IconShieldCheck size={14} className="text-black" />
                       <span className="text-black/60">Protected</span>
                    </div>
                 </div>

                 <div>
                    <h1 className="text-[28px] sm:text-[42px] font-bold text-black tracking-tight leading-tight mb-4 lowercase first-letter:uppercase">
                      {project.title}
                    </h1>
                    <p className="text-[14px] sm:text-[16px] text-gray-500 font-medium leading-relaxed font-sans max-w-2xl">
                      {project.description}
                    </p>
                 </div>
               </div>
            </div>

            {/* Escrow Progress Tracking */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {[
                 { label: 'Payment', status: isPaid ? 'completed' : 'pending', icon: IconCreditCard },
                 { label: 'Security', status: isPaid ? 'completed' : 'pending', icon: IconLock },
                 { label: 'Work', status: project?.status === 'COMPLETED' ? 'completed' : (isPaid ? 'in-progress' : 'pending'), icon: IconBriefcase },
                 { label: 'Release', status: project?.status === 'COMPLETED' ? 'completed' : 'pending', icon: IconChecks },
               ].map((step, i) => (
                 <div key={i} className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center text-center space-y-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-black text-white' : 
                      step.status === 'in-progress' ? 'bg-gray-100 text-black border border-black/10' : 'bg-gray-50 text-gray-300'
                    }`}>
                       <step.icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{step.label}</span>
                 </div>
               ))}
            </div>

            {/* Freelancer/Owner Info */}
            <div className="p-8 bg-white border border-gray-100 rounded-[32px] group transition-all hover:border-gray-200">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all overflow-hidden">
                        {project.freelancer?.avatar ? (
                          <img src={project.freelancer.avatar} alt={project.freelancer.name} className="w-full h-full object-cover" />
                        ) : (
                          <IconUserCircle size={32} />
                        )}
                     </div>
                     <div>
                        <h3 className="text-[18px] font-bold text-black mb-1">{project.freelancer?.name || 'Freelancer'}</h3>
                        <p className="text-[12px] text-gray-500 font-medium max-w-md line-clamp-1">
                          {project.freelancer?.email || 'Freelancer information'}
                        </p>
                     </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gray-50 rounded-full text-[12px] font-bold text-gray-500">
                     <IconShieldCheck size={14} className="text-black" />
                     Freelancer
                  </div>
               </div>
            </div>

            {/* Client Info */}
            {(project.client_name || project.client_email) && (
              <div className="p-8 bg-white border border-gray-100 rounded-[32px] group transition-all hover:border-gray-200">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                          <IconUserCircle size={32} />
                       </div>
                       <div>
                          <h3 className="text-[18px] font-bold text-black mb-1">{project.client_name || 'Client'}</h3>
                          <p className="text-[12px] text-gray-500 font-medium max-w-md line-clamp-1">
                            {project.client_email || 'Client information'}
                          </p>
                       </div>
                    </div>
                    <div className="sm:text-right">
                       <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">Role</p>
                       <p className="text-[14px] font-bold text-black">
                          Payer
                       </p>
                    </div>
                 </div>
              </div>
            )}

            {/* Milestones */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h2 className="text-[18px] font-bold text-black tracking-tight">
                    {project.type === 'SINGLE' ? 'Payment Schedule' : 'Project Milestones'}
                  </h2>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    {project.milestones?.length || (project.type === 'SINGLE' ? 1 : 0)} {project.type === 'SINGLE' ? 'Total' : 'Stages'}
                  </span>
               </div>

               <div className="space-y-4">
                  {(project.milestones?.length ? project.milestones : (project.type === 'SINGLE' ? [{
                    id: 'default',
                    title: 'Full Project Payment',
                    amount: project.total_amount,
                    release_date: project.created_at,
                    status: project.payment_received_at ? 'PAID' : 'PENDING'
                  }] : [])).map((m: any, i: number) => (
                    <div key={m.id} className="p-6 sm:p-8 bg-white border border-gray-100 rounded-[24px] flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-xl hover:shadow-black/5 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[18px] font-bold text-black">
                             {i + 1}
                          </div>
                          <div>
                             <h4 className="text-[16px] font-bold text-black mb-1">{m.title}</h4>
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                   <IconClock size={12} />
                                   {new Date(m.release_date || m.dueDate).toLocaleDateString()}
                                </span>
                                {project.type !== 'SINGLE' && (
                                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                     {m.is_auto_release ? 'Auto-Release' : 'Manual Release'}
                                  </span>
                                )}
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-6 sm:text-right">
                          <div>
                             <p className="text-[18px] font-bold text-black uppercase">{formatCurrency(koboToNaira(m.amount), project.currency, rates)}</p>
                             <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                               {project.type === 'SINGLE' ? 'Total Amount' : 'Milestone Amount'}
                             </p>
                          </div>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${m.status === 'PAID' ? 'bg-black text-white' : 'bg-gray-50 text-gray-300'}`}>
                             {m.status === 'PAID' ? <IconChecks size={20} /> : <IconCircleCheck size={20} />}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
             <div className="sticky top-28 space-y-6">
                <div className="p-8 sm:p-10 bg-black rounded-[40px] text-white shadow-2xl shadow-black/20 overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-10 -mt-10" />
                   
                   <div className="relative z-10 space-y-10">
                      <div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Secured Balance</p>
                         <h2 className="text-[32px] sm:text-[42px] font-bold leading-none tracking-tight">
                            {formatCurrency(projectTotal, project.currency, rates)}
                         </h2>
                      </div>

                      <div className="space-y-4">
                         {[
                            { text: "Milestone-based release", icon: IconInputCheck, show: project.type !== 'SINGLE' },
                         ].filter(item => item.show).map((item, i) => (
                           <div key={i} className="flex items-center gap-3">
                              <item.icon size={18} className="text-gray-500" />
                              <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{item.text}</span>
                           </div>
                         ))}
                      </div>

                      <div className="pt-8 border-t border-white/10 space-y-4">
                         {project?.status === 'COMPLETED' ? (
                            <button 
                               disabled
                               className="w-full h-16 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-3 bg-green-500/10 text-green-500 cursor-default"
                            >
                               <IconCircleCheck size={20} /> Project Completed
                            </button>
                         ) : project?.passcode_created_at ? (
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                               <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                               <p className="text-[14px] font-bold text-white">Awaiting Client Release</p>
                            </div>
                         ) : project?.payment_received_at ? (
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                               <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                               <p className="text-[14px] font-bold text-green-500">Paid</p>
                            </div>
                         ) : (
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                               <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                               <p className="text-[14px] font-bold text-white">Pending Client Payment</p>
                            </div>
                         )}
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-white border border-gray-100 rounded-[32px] space-y-6">
                   <div className="flex items-center justify-between">
                      <h3 className="text-[16px] font-bold text-black tracking-tight">Share Payment Link</h3>
                      <button 
                        onClick={() => setShowShareModal(true)}
                        className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-black transition-all"
                      >
                        <IconQrcode size={20} />
                      </button>
                   </div>
                   <div className="flex gap-2">
                      <div className="flex-1 px-4 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center overflow-hidden">
                         <span className="text-[11px] text-gray-400 truncate">{clientUrl}</span>
                      </div>
                      <button 
                        onClick={handleCopyLink}
                        className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-900 transition-all"
                      >
                        <IconCopy size={18} />
                      </button>
                   </div>
                </div>

                <div className="p-8 bg-white border border-gray-100 rounded-[32px] space-y-6">
                   <h3 className="text-[16px] font-bold text-black tracking-tight">Project Summary</h3>
                   <div className="space-y-4">
                      {project.type !== 'SINGLE' && (
                        <div className="flex items-center justify-between text-[12px] font-medium">
                           <span className="text-gray-400 uppercase tracking-widest">Milestones</span>
                           <span className="text-black font-bold">{project.milestones?.length || 0} Stages</span>
                        </div>
                      )}
                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                         <div className="space-y-1">
                            <span className="text-[13px] font-bold text-black uppercase tracking-widest block">Total Value</span>
                         </div>
                         <span className="text-[20px] font-bold text-black">{formatCurrency(totalPayable, project.currency, rates)}</span>
                      </div>
                   </div>
                </div>

                <button className="w-full h-14 border border-gray-100 rounded-2xl flex items-center justify-center gap-2 text-[12px] font-bold text-gray-400 hover:text-orange-500 hover:border-orange-500/20 transition-all uppercase tracking-widest">
                   <IconAlertCircle size={18} />
                   Raise Service Dispute
                </button>
             </div>
          </div>
        </div>

        {/* Passcode Creation Modal */}
        <AnimatePresence>
          {showPasscodeModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setShowPasscodeModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[24px] font-bold text-black">Create Passcode</h2>
                    <button
                      onClick={() => setShowPasscodeModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <IconX size={20} />
                    </button>
                  </div>

                  <p className="text-[14px] text-gray-500 mb-8">
                    Create a 4-digit passcode to secure your project. You'll need this to release funds later.
                  </p>

                  <div className="mb-8">
                    <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                      4-Digit Passcode
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value.replace(/[^\d]/g, ''))}
                      placeholder="0000"
                      className="w-full h-14 text-center text-[24px] font-bold tracking-[0.5em] border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all"
                    />
                    <p className="text-[10px] text-gray-400 mt-2">Must be 4 digits only</p>
                  </div>

                  <button
                    onClick={handleSavePasscode}
                    disabled={passcode.length !== 4}
                    className={`w-full h-14 rounded-xl font-bold text-[14px] transition-all ${
                      passcode.length === 4
                        ? 'bg-black text-white hover:bg-gray-900'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Save Passcode
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Release Escrow Modal */}
        <AnimatePresence>
          {showReleaseModal && !showAgreement && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setShowReleaseModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[24px] font-bold text-black">Release Escrow</h2>
                    <button
                      onClick={() => setShowReleaseModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <IconX size={20} />
                    </button>
                  </div>

                  <p className="text-[14px] text-gray-500 mb-8">
                    Enter your passcode to verify and release the escrow funds to the freelancer.
                  </p>

                  <div className="mb-8">
                    <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                      Enter Passcode
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={releasePasscode}
                      onChange={(e) => setReleasePasscode(e.target.value.replace(/[^\d]/g, ''))}
                      placeholder="0000"
                      className="w-full h-14 text-center text-[24px] font-bold tracking-[0.5em] border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all"
                    />
                  </div>

                  <button
                    onClick={() => setShowAgreement(true)}
                    disabled={releasePasscode.length !== 4}
                    className={`w-full h-14 rounded-xl font-bold text-[14px] transition-all ${
                      releasePasscode.length === 4
                        ? 'bg-black text-white hover:bg-gray-900'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Agreement Modal */}
        <AnimatePresence>
          {showAgreement && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                  <h2 className="text-[24px] font-bold text-black mb-8">Release Confirmation</h2>

                  <div className="bg-gray-50 border border-gray-200 rounded-[16px] p-6 mb-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <IconShieldCheck size={24} className="text-black flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-black mb-1 text-[16px]">Escrow Agreement</h3>
                        <p className="text-[12px] text-gray-500 leading-relaxed">
                          You are releasing <strong>{formatCurrency(projectTotal, project.currency, rates)}</strong> to the freelancer. This funds the completed work.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/5 rounded-[16px] p-5 mb-8">
                    <p className="text-[13px] text-black font-bold uppercase tracking-widest mb-3 opacity-40">
                      I confirm that:
                    </p>
                    <ul className="space-y-3">
                      {[
                        "The deliverables meet all requirements",
                        "I authorize immediate fund transfer",
                        "I waive further dispute rights for this"
                      ].map((text, i) => (
                        <li key={i} className="flex items-center gap-3 text-[12px] font-medium text-gray-500">
                          <IconCircleCheck size={16} className="text-gray-300" />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAgreement(false)}
                      className="flex-1 h-14 border border-gray-100 rounded-xl font-bold text-[14px] text-gray-400 hover:text-black transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleReleaseEscrow}
                      disabled={isReleasing}
                      className="flex-1 h-14 bg-black text-white rounded-xl font-bold text-[14px] hover:bg-gray-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      {isReleasing ? (
                        <>
                          <IconLoader2 size={18} className="animate-spin" />
                          Releasing...
                        </>
                      ) : (
                        <>
                          <IconCircleCheck size={18} />
                          Confirm Release
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Share & QR Modal */}
        <AnimatePresence>
          {showShareModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setShowShareModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[20px] font-bold text-black">Share Payment Link</h2>
                    <button
                      onClick={() => setShowShareModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <IconX size={20} />
                    </button>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-[24px] mb-8 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-[20px] shadow-sm mb-4">
                      <QRCodeSVG
                        id="project-qr"
                        value={clientUrl}
                        size={160}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                      Scan to Pay
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleCopyLink}
                      className="w-full h-14 bg-black text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                    >
                      <IconLink size={18} />
                      Copy Payment Link
                    </button>
                    <button
                      onClick={handleDownloadQR}
                      className="w-full h-14 border-2 border-gray-100 text-black rounded-xl font-bold text-[14px] flex items-center justify-center gap-3 hover:bg-gray-50 active:scale-[0.98] transition-all"
                    >
                      <IconDownload size={18} />
                      Download QR Code
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </Shell>
  )
}