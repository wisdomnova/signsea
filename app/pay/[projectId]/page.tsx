'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IconCreditCard, 
  IconShieldCheck, 
  IconLock, 
  IconChecks, 
  IconCircleCheck, 
  IconArrowRight, 
  IconClock, 
  IconAlertCircle,
  IconLoader2,
  IconUserCircle,
  IconDownload,
  IconX,
  IconBriefcase,
  IconShieldLock,
  IconCalendar,
  IconUser,
  IconChevronRight
} from '@tabler/icons-react'
import { apiClient } from '@/lib/api-client'
import { formatCurrency, koboToNaira } from '@/lib/currency-utils'
import { useCurrency } from '@/lib/currency-context'
import { PublicLayout } from '@/components/public-layout'
import { CustomToast, ToastType } from '@/components/ui/custom-toast'

export default function ClientPaymentPage() {
  const params = useParams()
  const projectId = params?.projectId as string
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isPaid, setIsPaid] = useState(false)
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [showPasscodeModal, setShowPasscodeModal] = useState(false)
  const [passcodeSaved, setPasscodeSaved] = useState(false)
  const [showReleaseModal, setShowReleaseModal] = useState(false)
  const [releasePasscode, setReleasePasscode] = useState('')
  const [showAgreement, setShowAgreement] = useState(false)
  const [isReleasing, setIsReleasing] = useState(false)
  const { selectedCurrency, rates } = useCurrency()

  const [toast, setToast] = useState({
    isOpen: false,
    message: '',
    type: 'info' as ToastType
  })

  const showToast = (message: string, type: ToastType) => {
    setToast({ isOpen: true, message, type })
  }

  useEffect(() => {
    async function loadProject() {
      if (!projectId) return
      try {
        setLoading(true)
        const data: any = await apiClient.request('/projects/' + projectId, 'GET')
        setProject(data)
        if (data?.payment_received_at) {
          setIsPaid(true)
        }
        if (data?.passcode_created_at) {
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

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const projectTotal = project?.total_amount ? koboToNaira(project.total_amount) : 0
  const totalPayable = projectTotal

  const handleTestPayment = async () => {
    try {
      console.log('Starting test payment for project:', projectId)
      setIsPaymentLoading(true)
      
      const testResponse: any = await apiClient.request(
        `/projects/${projectId}/test-payment`,
        'POST',
        {}
      )

      console.log('Test payment response:', testResponse)

      if (testResponse.success) {
        console.log('Test payment succeeded, updating UI')
        setIsPaid(true)
        setIsPaymentLoading(false)
        setShowPasscodeModal(true)
        showToast('Test payment successful! Please set your release passcode.', 'success')
        
        // Refresh project data
        const updatedProject: any = await apiClient.request('/projects/' + projectId, 'GET')
        setProject(updatedProject)
      } else {
        console.error('Test payment failed:', testResponse.error)
        setIsPaymentLoading(false)
        showToast(`Test payment failed: ${testResponse.error || 'Unknown error'}`, 'error')
      }
    } catch (err: any) {
      console.error('Test payment error caught:', err)
      setIsPaymentLoading(false)
      showToast(err?.message || 'Test payment failed', 'error')
    }
  }

  const handlePayNow = async () => {
    if (!project) return
    
    try {
      setIsPaymentLoading(true)
      showToast('Initializing payment...', 'loading')
      
      // Get client email from project or use a default
      const clientEmail = project.client_email || 'client@example.com'
      
      // Initialize payment with backend
      const initResponse: any = await apiClient.request(
        `/projects/${projectId}/init-payment`,
        'POST',
        {
          email: clientEmail,
          amount: project.total_amount,
        }
      )

      if (!initResponse.success || !initResponse.authorizationUrl) {
        throw new Error('Failed to initialize payment')
      }

      // Close loading toast
      setToast(prev => ({ ...prev, isOpen: false }))

      // Open Paystack payment modal
      const PaystackPop = (window as any).PaystackPop
      if (!PaystackPop) {
        throw new Error('Paystack script not loaded')
      }

      PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_8da1a1e3d7e1e1e1e1e1e1e1e1e1e1e',
        email: clientEmail,
        amount: project.total_amount,
        ref: initResponse.reference,
        onClose: () => {
          setIsPaymentLoading(false)
          showToast('Payment cancelled', 'info')
          console.log('Payment cancelled by user')
        },
        onSuccess: async (transaction: any) => {
          console.log('Paystack onSuccess triggered:', transaction)
          try {
            showToast('Verifying payment...', 'loading')
            
            // Add timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Payment verification timed out')), 30000)
            )
            
            const verifyPromise = apiClient.request(
              `/projects/${projectId}/verify-payment`,
              'POST',
              {
                reference: initResponse.reference,
              }
            )

            // Race between verification and timeout
            const verifyResponse: any = await Promise.race([verifyPromise, timeoutPromise])

            console.log('Verify response:', verifyResponse)

            if (verifyResponse.success) {
              setIsPaid(true)
              setIsPaymentLoading(false)
              setShowPasscodeModal(true)
              showToast('Payment successful! Please set your release passcode.', 'success')
              
              // Refresh project data
              const updatedProject: any = await apiClient.request('/projects/' + projectId, 'GET')
              setProject(updatedProject)
            } else {
              setIsPaymentLoading(false)
              showToast(`Payment verification failed: ${verifyResponse.error || 'Unknown error'}`, 'error')
              console.error('Verification failed:', verifyResponse)
            }
          } catch (err: any) {
            setIsPaymentLoading(false)
            showToast(err?.message || 'Failed to verify payment. Please contact support with your transaction reference.', 'error')
            console.error('Verification error:', err)
          }
        },
      }).openIframe()
    } catch (err: any) {
      setIsPaymentLoading(false)
      showToast(err?.message || 'Payment processing failed', 'error')
      console.error('Payment error:', err)
    }
  }

  const handleSavePasscode = async () => {
    if (passcode.length !== 4 || !/^[0-9]+$/.test(passcode)) {
      showToast('Passcode must be exactly 4 digits', 'error')
      return
    }
    try {
      showToast('Saving passcode...', 'loading')
      await apiClient.request('/projects/' + projectId + '/set-passcode', 'POST', { passcode })
      setPasscodeSaved(true)
      setShowPasscodeModal(false)
      setPasscode('')
      showToast('Passcode saved!', 'success')
    } catch (err: any) {
      console.error('Passcode save error:', err)
      showToast(err?.message || 'Failed to save passcode', 'error')
    }
  }

  const handleReleaseEscrow = async () => {
    if (releasePasscode.length !== 4 || !/^[0-9]+$/.test(releasePasscode)) {
      showToast('Passcode must be exactly 4 digits', 'error')
      return
    }
    try {
      setIsReleasing(true)
      showToast('Releasing funds...', 'loading')
      await apiClient.request('/projects/' + projectId + '/release-escrow', 'POST', { passcode: releasePasscode })
      setShowReleaseModal(false)
      setShowAgreement(false)
      setReleasePasscode('')
      showToast('Escrow released successfully!', 'success')
      const data: any = await apiClient.request('/projects/' + projectId, 'GET')
      setProject(data)
    } catch (err: any) {
      showToast(err?.message || 'Failed to release escrow', 'error')
    } finally {
      setIsReleasing(false)
    }
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="max-w-[1200px] mx-auto py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full animate-pulse" />
            <div className="h-4 w-32 bg-gray-50 rounded animate-pulse" />
        </div>
      </PublicLayout>
    )
  }

  if (!project) {
    return (
      <PublicLayout>
        <div className="max-w-[1200px] mx-auto py-20 flex flex-col items-center justify-center text-center">
            <IconAlertCircle size={48} className="text-gray-200 mb-6" />
            <h2 className="text-[20px] font-bold text-black mb-2 tracking-tight">Project Not Found</h2>
            <p className="text-gray-500 text-[14px]">The sequence requested does not exist or has been archived.</p>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Secure Payment Portal</span>
                </div>
                <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight leading-[1.1] mb-6">{project.title}</h1>
                <p className="text-[16px] text-gray-500 leading-relaxed font-medium">{project.description}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {[
                   { label: 'Payment', status: isPaid ? 'completed' : 'pending', icon: IconCreditCard },
                   { label: 'Security', status: isPaid ? 'completed' : 'pending', icon: IconLock },
                   { label: 'Work', status: project?.status === 'COMPLETED' ? 'completed' : (isPaid ? 'in-progress' : 'pending'), icon: IconBriefcase },
                   { label: 'Release', status: project?.status === 'COMPLETED' ? 'completed' : 'pending', icon: IconChecks },
                 ].map((step, i) => (
                   <div key={i} className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center text-center space-y-2">
                      <div className={step.status === 'completed' ? 'bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center' : step.status === 'in-progress' ? 'bg-gray-100 text-black border border-black/10 w-10 h-10 rounded-xl flex items-center justify-center' : 'bg-gray-50 text-gray-300 w-10 h-10 rounded-xl flex items-center justify-center'}>
                         <step.icon size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{step.label}</span>
                   </div>
                 ))}
              </div>
              <div className="p-8 border border-gray-100 rounded-3xl bg-white flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 uppercase font-bold text-gray-400 overflow-hidden text-[20px]">
                    {project.freelancer?.avatar ? <img src={project.freelancer.avatar} className="w-full h-full object-cover" /> : project.freelancer?.name?.charAt(0) || 'F'}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-1">Freelancer</h4>
                    <p className="text-[16px] font-bold text-black">{project.freelancer?.name || 'Verified Member'}</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gray-50 rounded-full text-[12px] font-bold text-gray-500">
                  <IconShieldCheck size={14} className="text-black" />
                  {project.freelancer?.email || 'Verified Freelancer'}
                </div>
              </div>

              {/* Client Info */}
              {(project.client_name || project.client_email) && (
                <div className="p-8 border border-gray-100 rounded-3xl bg-white flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 uppercase font-bold text-gray-400 overflow-hidden text-[20px]">
                      {project.client_name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-1">Client</h4>
                      <p className="text-[16px] font-bold text-black">{project.client_name || 'Client'}</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gray-50 rounded-full text-[12px] font-bold text-gray-500">
                    <IconUser size={14} className="text-black" />
                    {project.client_email || 'Client'}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          <div className="lg:col-span-5">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="sticky top-32">
              <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-100">
                  <h3 className="text-[14px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">Payment Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-4 border-b border-gray-50">
                      <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Frequency</span>
                      <span className="text-[13px] font-bold text-black">{project.type === 'MILESTONES' ? 'Milestone Based' : 'Full Payment'}</span>
                    </div>
                  </div>
                </div>
                <div className="p-8 bg-[#FAFAFA]">
                   <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-end">
                      <div>
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total</h4>
                        <div className="text-[32px] font-bold tracking-tight">
                          {formatCurrency(totalPayable, selectedCurrency, rates)}
                        </div>
                      </div>
                    </div>
                   </div>
                   <div className="space-y-4">
                    {!isPaid ? (
                      <>
                        <button onClick={handlePayNow} disabled={isPaymentLoading} className="w-full h-16 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#111] transition-all active:scale-[0.98] disabled:opacity-50">
                          {isPaymentLoading ? <IconLoader2 size={20} className="animate-spin" /> : <><span>Pay Now</span><IconArrowRight size={20} /></>}
                        </button>
                        <button onClick={handleTestPayment} disabled={isPaymentLoading} className="w-full h-12 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all disabled:opacity-50">
                          {isPaymentLoading ? 'Processing...' : 'Test Payment (Dev)'}
                        </button>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3">
                          <IconShieldCheck className="text-green-600" size={20} />
                          <span className="text-[13px] font-bold text-green-700">Funds secured for release</span>
                        </div>
                        {!passcodeSaved ? (
                          <button onClick={() => setShowPasscodeModal(true)} className="w-full h-16 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#111]">
                            <span>Set Release Passcode</span><IconLock size={20} />
                          </button>
                        ) : (
                          <button onClick={() => setShowAgreement(true)} disabled={project.status === 'COMPLETED'} className={project.status === 'COMPLETED' ? 'bg-gray-100 text-gray-400 cursor-not-allowed w-full h-16 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all' : 'bg-black text-white hover:bg-[#111] w-full h-16 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all'}>
                            <span>{project.status === 'COMPLETED' ? 'Funds Released' : 'Authorize Release'}</span><IconShieldLock size={20} />
                          </button>
                        )}
                      </div>
                    )}
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showPasscodeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPasscodeModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-[32px] p-10">
              <IconLock size={32} className="mx-auto mb-6" />
              <h3 className="text-[24px] font-bold mb-3">Set Release Passcode</h3>
              <p className="text-gray-500 text-[14px] mb-8">Create a 4-digit code. Share it only when work is approved.</p>
              <input type="text" maxLength={4} value={passcode} onChange={(e) => setPasscode(e.target.value.replace(/[^0-9]/g, ''))} placeholder="0000" className="w-full h-16 bg-gray-50 border rounded-2xl text-center text-[24px] font-bold tracking-[0.5em] mb-4 outline-none" />
              <button onClick={handleSavePasscode} className="w-full h-16 bg-black text-white rounded-2xl font-bold">Confirm & Save</button>
            </motion.div>
          </div>
        )}
        {showAgreement && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAgreement(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-[32px] p-10">
              <IconShieldCheck size={48} className="mx-auto mb-6" />
              <h3 className="text-[24px] font-bold mb-3">Confirm Release</h3>
              <p className="text-gray-500 text-[14px] mb-8">This action is irreversible.</p>
              <button onClick={() => { setShowAgreement(false); setShowReleaseModal(true); }} className="w-full h-16 bg-black text-white rounded-2xl font-bold mb-3">I Understand, Proceed</button>
              <button onClick={() => setShowAgreement(false)} className="w-full h-16 border rounded-2xl font-bold text-gray-400">Cancel</button>
            </motion.div>
          </div>
        )}
        {showReleaseModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReleaseModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-[32px] p-10">
              <IconShieldLock size={32} className="mx-auto mb-6" />
              <h3 className="text-[24px] font-bold mb-3">Verify Passcode</h3>
              <input type="text" maxLength={4} value={releasePasscode} onChange={(e) => setReleasePasscode(e.target.value.replace(/[^0-9]/g, ''))} placeholder="0000" className="w-full h-16 bg-gray-50 border rounded-2xl text-center text-[24px] font-bold tracking-[0.5em] mb-4 outline-none" />
              <button onClick={handleReleaseEscrow} disabled={isReleasing} className="w-full h-16 bg-black text-white rounded-2xl font-bold disabled:opacity-50">{isReleasing ? 'Releasing...' : 'Finalize Release'}</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <CustomToast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, isOpen: false }))}
      />
    </PublicLayout>
  )
}
