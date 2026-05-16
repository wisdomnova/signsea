'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  IconUser, 
  IconLock, 
  IconBell, 
  IconCreditCard, 
  IconShieldCheck, 
  IconMail, 
  IconKey,
  IconFingerprint,
  IconBuildingBank,
  IconPlus,
  IconX,
  IconId,
  IconArrowRight,
  IconLoader
} from '@tabler/icons-react'
import { Shell } from '@/components/dashboard-shell'
import { motion, AnimatePresence } from 'framer-motion'
import { apiClient } from '@/lib/api-client'

export default function SettingsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
  })
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  
  // Password change
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Notifications
  const [notificationPrefs, setNotificationPrefs] = useState({
    projectMilestones: true,
    paymentSettlements: true,
    securityAlerts: true,
  })
  const [isUpdatingNotifications, setIsUpdatingNotifications] = useState(false)
  
  // 2FA
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [twoFAStatus, setTwoFAStatus] = useState(false)
  const [is2FALoading, setIs2FALoading] = useState(false)
  const [twoFACode, setTwoFACode] = useState('')
  const [twoFASecret, setTwoFASecret] = useState('')
  
  // NIN verification
  const [showNINModal, setShowNINModal] = useState(false)
  const [nin, setNin] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  
  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await apiClient.getMe() as any
        setUserData(user)
        setProfileData({
          displayName: user.display_name || '',
          bio: user.bio || '',
        })
        
        // Fetch notification preferences
        const prefs = await apiClient.getNotificationPreferences() as any
        setNotificationPrefs(prefs)
        
        // Fetch 2FA status
        const status = await apiClient.get2FAStatus() as any
        setTwoFAStatus(status.enabled || false)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }

    fetchUserData()
  }, [])

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true)
    try {
      await apiClient.updateProfile({
        displayName: profileData.displayName,
        bio: profileData.bio,
      })
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    try {
      await apiClient.verifyNIN(nin)
      setIsVerifying(false)
      setIsVerified(true)
      setTimeout(() => setShowNINModal(false), 1500)
    } catch (error: any) {
      console.error('NIN verification error:', error)
      alert('Failed to verify NIN. Please try again.')
      setIsVerifying(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    setIsChangingPassword(true)
    try {
      await apiClient.changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      alert('Password changed successfully!')
      setShowPasswordModal(false)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      alert('Failed to change password: ' + (error.message || 'Unknown error'))
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleToggle2FA = async () => {
    setIs2FALoading(true)
    try {
      if (twoFAStatus) {
        // Disable 2FA
        await apiClient.disable2FA()
        setTwoFAStatus(false)
        alert('2FA disabled')
      } else {
        // Enable 2FA - show modal with QR code
        const response = await apiClient.enable2FA() as any
        setTwoFASecret(response.secret)
        setShow2FAModal(true)
      }
    } catch (error: any) {
      alert('Failed to update 2FA: ' + (error.message || 'Unknown error'))
    } finally {
      setIs2FALoading(false)
    }
  }

  const handleConfirm2FA = async () => {
    if (twoFACode.length !== 6) {
      alert('Please enter a 6-digit code')
      return
    }
    
    setIs2FALoading(true)
    try {
      await apiClient.confirm2FA(twoFASecret, twoFACode)
      setTwoFAStatus(true)
      setShow2FAModal(false)
      setTwoFACode('')
      alert('2FA enabled successfully!')
    } catch (error: any) {
      alert('Failed to verify 2FA code: ' + (error.message || 'Invalid code'))
    } finally {
      setIs2FALoading(false)
    }
  }

  const handleToggleNotification = async (key: string) => {
    const updated = {
      ...notificationPrefs,
      [key]: !notificationPrefs[key as keyof typeof notificationPrefs]
    }
    
    setIsUpdatingNotifications(true)
    try {
      await apiClient.updateNotificationPreferences(updated as any)
      setNotificationPrefs(updated)
    } catch (error: any) {
      alert('Failed to update notification preferences')
    } finally {
      setIsUpdatingNotifications(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await apiClient.deleteAccount()
      // Clear auth and redirect to login
      apiClient.clearAuth()
      localStorage.removeItem('userInitials')
      localStorage.removeItem('userName')
      router.push('/auth/login')
    } catch (error) {
      console.error('Delete account error:', error)
      setIsDeleting(false)
      alert('Failed to delete account. Please try again.')
    }
  }

  return (
    <Shell title="Settings">
      <div className="max-w-3xl space-y-20 pb-20">
        {/* Header content */}
        <div className="space-y-2">
          <h2 className="text-[32px] font-bold tracking-tight text-black">Settings.</h2>
          <p className="text-[14px] text-gray-500 font-medium">Configure your account, security, and settlement preferences.</p>
        </div>

        {/* Verification Section */}
        <section className="space-y-8">
          <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-[16px] font-bold text-black tracking-tight">Identity Verification</h3>
              <p className="text-[13px] text-gray-400 font-medium">Verify your identity to increase limits and trust.</p>
            </div>
            <IconId className="text-gray-100" size={24} />
          </div>

          <div className="p-8 bg-[#111] rounded-[2rem] text-white relative overflow-hidden group">
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                   <div className="flex justify-center md:justify-start">
                      <span className="px-3 py-1 bg-white/10 text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] rounded border border-white/10 inline-block">
                         Requirement
                      </span>
                   </div>
                   <h2 className="text-2xl font-bold tracking-tight">
                      Confirm your <br />
                      <span className="text-gray-400">NIN Identity.</span>
                   </h2>
                   <p className="text-[13px] text-white/40 max-w-xs leading-relaxed font-medium">
                      Linking your National Identification Number instantly grants you the "Verified" badge.
                   </p>
                </div>

                <button 
                  onClick={() => setShowNINModal(true)}
                  className="px-8 h-12 bg-white text-black text-[13px] font-bold rounded-full hover:bg-gray-100 transition-all shadow-xl active:scale-95 shrink-0"
                >
                  Verify Now
                </button>
             </div>
             
             {/* Aesthetic BG element */}
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <IconShieldCheck size={180} />
             </div>
          </div>
        </section>

        {/* Profile Section */}
        <section className="space-y-8">
          <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-[16px] font-bold text-black tracking-tight">Public Profile</h3>
              <p className="text-[13px] text-gray-400 font-medium">This information is shown to your clients and partners.</p>
            </div>
            <IconUser className="text-gray-100" size={24} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-widest pl-1">Display Name</label>
              <input 
                type="text" 
                value={profileData.displayName}
                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  disabled
                  value={userData?.email || ''}
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-medium text-gray-400 cursor-not-allowed" 
                />
                <IconMail className="absolute right-4 top-3 text-gray-200" size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-widest pl-1">Professional Bio</label>
            <textarea 
              rows={4}
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              placeholder="Enter your professional bio..."
              className="w-full p-4 bg-white border border-gray-200 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all resize-none" 
            />
          </div>

          <div className="flex justify-start">
             <button 
               onClick={handleUpdateProfile}
               disabled={isUpdatingProfile}
               className="px-8 h-12 bg-black text-white text-[13px] font-bold rounded-full hover:bg-[#222] transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
             >
               {isUpdatingProfile ? <IconLoader size={16} className="animate-spin" /> : 'Update Profile'}
             </button>
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-8 pt-10">
          <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-[16px] font-bold text-black tracking-tight">Security & Access</h3>
              <p className="text-[13px] text-gray-400 font-medium">Protect your workspace with two-factor authentication.</p>
            </div>
            <IconShieldCheck className="text-gray-100" size={24} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-2xl">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-black">
                   <IconFingerprint size={20} />
                 </div>
                 <div>
                   <p className="text-[13px] font-bold text-black tracking-tight">Two-Factor Authentication</p>
                   <p className="text-[12px] text-gray-400 font-medium">{twoFAStatus ? 'Currently enabled' : 'Currently disabled'}</p>
                 </div>
               </div>
               <button 
                 onClick={handleToggle2FA}
                 disabled={is2FALoading}
                 className="text-[11px] font-bold text-black hover:underline uppercase tracking-widest disabled:opacity-50"
               >
                 {twoFAStatus ? 'Disable' : 'Enable'}
               </button>
            </div>

            <div className="flex items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-2xl">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-black">
                   <IconKey size={20} />
                 </div>
                 <div>
                   <p className="text-[13px] font-bold text-black tracking-tight">Change Password</p>
                   <p className="text-[12px] text-gray-400 font-medium">Secure your account with a new password</p>
                 </div>
               </div>
               <button 
                 onClick={() => setShowPasswordModal(true)}
                 className="text-[11px] font-bold text-black hover:underline uppercase tracking-widest"
               >
                 Update
               </button>
            </div>
          </div>
        </section>

        {/* Payout Methods Section */}
        <section className="space-y-8 pt-10">
          <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-[16px] font-bold text-black tracking-tight">Payout Methods</h3>
              <p className="text-[13px] text-gray-400 font-medium">Manage the bank accounts where your funds will be settled.</p>
            </div>
            <IconBuildingBank className="text-gray-100" size={24} />
          </div>

          <div className="p-8 border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-4 text-center">
             <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
               <IconBuildingBank size={24} />
             </div>
             <div className="space-y-1">
               <p className="text-[14px] font-bold text-black">No payout accounts</p>
               <p className="text-[13px] text-gray-400 font-medium font-sans">Connect a local bank account to start receiving settlements.</p>
             </div>
             <button className="mt-2 px-6 h-10 bg-black text-white text-[11px] font-bold rounded-lg hover:bg-[#333] transition-all flex items-center gap-2">
               <IconPlus size={14} />
               Add Bank Account
             </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-8 pt-10">
          <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-[16px] font-bold text-black tracking-tight">Notifications</h3>
              <p className="text-[13px] text-gray-400 font-medium">Choose what you want to be notified about.</p>
            </div>
            <IconBell className="text-gray-100" size={24} />
          </div>

          <div className="space-y-6">
            {[
              { key: 'projectMilestones', title: 'Project Milestones', desc: 'When a project stage is completed or approved.' },
              { key: 'paymentSettlements', title: 'Payment Settlements', desc: 'When funds are released from escrow to your wallet.' },
              { key: 'securityAlerts', title: 'Security Alerts', desc: 'New logins from unknown devices or password changes.' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between group">
                <div className="space-y-0.5">
                  <p className="text-[13px] font-bold text-black tracking-tight">{item.title}</p>
                  <p className="text-[12px] text-gray-400 font-medium">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleToggleNotification(item.key)}
                  disabled={isUpdatingNotifications}
                  className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${
                    notificationPrefs[item.key as keyof typeof notificationPrefs] ? 'bg-black' : 'bg-gray-200'
                  } disabled:opacity-50`}
                >
                  <motion.div 
                    layout
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                      notificationPrefs[item.key as keyof typeof notificationPrefs] ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-20 pb-10">
          <div className="p-8 bg-red-50/20 border border-red-50 rounded-3xl space-y-4">
             <div className="space-y-1">
               <h4 className="text-[14px] font-bold text-red-600">Danger Zone</h4>
               <p className="text-[12px] text-red-500 font-medium">Permanently delete your account and all associated trade data. This action is irreversible.</p>
             </div>
             <button 
               onClick={() => setShowDeleteModal(true)}
               className="px-6 h-10 border border-red-100 text-[11px] font-bold text-red-600 uppercase tracking-widest hover:bg-red-50 rounded-lg transition-all"
             >
               Delete Account
             </button>
          </div>
        </section>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteModal(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-[380px] bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-red-50 rounded-[1.25rem] flex items-center justify-center mx-auto mb-6 text-red-600 border border-red-100">
                  <IconShieldCheck size={28} />
                </div>
                <h2 className="text-xl font-bold text-black tracking-tight mb-2">Are you sure?</h2>
                <p className="text-[13px] text-gray-500 mb-8 leading-relaxed font-medium">
                  This will wipe all your projects, trade history, and secured funds. There is no going back once this is done.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                    className="px-4 py-3 bg-gray-50 text-gray-500 rounded-xl text-[13px] font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="px-4 py-3 bg-red-600 text-white rounded-xl text-[13px] font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? <IconLoader size={14} className="animate-spin" /> : 'Delete Now'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Password Change Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isChangingPassword && setShowPasswordModal(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-[420px] bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100"
              >
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-black tracking-tight">Change Password</h2>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] pl-1">Current Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      disabled={isChangingPassword}
                      className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-medium focus:outline-none focus:border-black transition-all disabled:opacity-50" 
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] pl-1">New Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      disabled={isChangingPassword}
                      className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-medium focus:outline-none focus:border-black transition-all disabled:opacity-50" 
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] pl-1">Confirm Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      disabled={isChangingPassword}
                      className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-medium focus:outline-none focus:border-black transition-all disabled:opacity-50" 
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <button 
                      onClick={() => setShowPasswordModal(false)}
                      disabled={isChangingPassword}
                      className="px-4 py-3 bg-gray-50 text-gray-500 rounded-xl text-[13px] font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleChangePassword}
                      disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword}
                      className="px-4 py-3 bg-black text-white rounded-xl text-[13px] font-bold hover:bg-[#222] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isChangingPassword ? <IconLoader size={16} className="animate-spin" /> : 'Change Password'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 2FA Setup Modal */}
        <AnimatePresence>
          {show2FAModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !is2FALoading && setShow2FAModal(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-[420px] bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 text-center space-y-6"
              >
                <h2 className="text-2xl font-bold text-black tracking-tight">Set Up 2FA</h2>
                <p className="text-[13px] text-gray-500 font-medium">Scan this code with your authenticator app, then enter the 6-digit code.</p>
                
                <div className="w-40 h-40 bg-gray-50 rounded-2xl mx-auto border border-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[11px] font-bold text-gray-400">QR Code</p>
                    <p className="text-[10px] text-gray-300 mt-2">Scan with authenticator app</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Verification Code</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ''))}
                    disabled={is2FALoading}
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-2xl text-[16px] font-bold tracking-[0.2em] text-center focus:outline-none focus:border-black transition-all disabled:opacity-50" 
                    placeholder="000000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button 
                    onClick={() => setShow2FAModal(false)}
                    disabled={is2FALoading}
                    className="px-4 py-3 bg-gray-50 text-gray-500 rounded-xl text-[13px] font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirm2FA}
                    disabled={is2FALoading || twoFACode.length !== 6}
                    className="px-4 py-3 bg-black text-white rounded-xl text-[13px] font-bold hover:bg-[#222] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {is2FALoading ? <IconLoader size={16} className="animate-spin" /> : 'Confirm'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* NIN Modal */}
        <AnimatePresence>
          {showNINModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isVerifying && setShowNINModal(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-[420px] bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 overflow-hidden"
              >
                {!isVerified ? (
                  <>
                    <div className="flex items-center justify-between mb-10">
                       <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-black border border-gray-100">
                          <IconId size={24} />
                       </div>
                       <button 
                         onClick={() => setShowNINModal(false)} 
                         disabled={isVerifying}
                         className="p-2 hover:bg-gray-50 rounded-full transition-colors disabled:opacity-0"
                       >
                          <IconX size={20} className="text-gray-400" />
                       </button>
                    </div>

                    <div className="space-y-2 mb-8">
                       <h2 className="text-2xl font-bold text-black tracking-tight">Identity Verification</h2>
                       <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
                          Enter your 11-digit National Identification Number (NIN) to verify your account.
                       </p>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] pl-1">NIN Number</label>
                          <input 
                            type="text" 
                            maxLength={11}
                            placeholder="00000000000"
                            value={nin}
                            onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
                            disabled={isVerifying}
                            className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-2xl text-[16px] font-bold tracking-[0.1em] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all disabled:opacity-50" 
                          />
                       </div>

                       <button 
                         onClick={handleVerify}
                         disabled={nin.length !== 11 || isVerifying}
                         className="w-full h-14 bg-black text-white text-[13px] font-bold rounded-2xl hover:bg-[#222] transition-all shadow-lg shadow-black/10 active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-3"
                       >
                         {isVerifying ? (
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         ) : (
                           <>
                             Verify My Identity
                             <IconArrowRight size={16} />
                           </>
                         )}
                       </button>
                    </div>

                    <p className="text-center text-[11px] text-gray-400 font-medium mt-8 leading-relaxed">
                       Your data is encrypted and secure. By proceeding, you agree <br /> to the NIMC verification terms.
                    </p>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-10 text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white mx-auto shadow-2xl shadow-black/20">
                       <IconShieldCheck size={40} />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-2xl font-bold text-black tracking-tight">Verified.</h2>
                       <p className="text-[13px] text-gray-500 font-medium">Your identity has been successfully confirmed.</p>
                    </div>
                  </motion.div>
                )}
                
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-gray-50 rounded-full opacity-50 blur-3xl pointer-events-none" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Shell>
  )
}
