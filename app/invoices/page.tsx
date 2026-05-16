'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  IconFileText,
  IconPlus,
  IconArrowRight,
  IconDownload,
  IconTrash,
  IconClock,
  IconCircleCheck,
  IconSearch,
  IconChevronRight,
  IconAlertCircle,
  IconFilter,
  IconEye,
  IconPencil,
  IconCheck,
  IconX
} from '@tabler/icons-react'
import { Shell } from '@/components/dashboard-shell'
import { DeleteModal } from '@/components/delete-modal'
import { apiClient } from '@/lib/api-client'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, invoiceId: null as string | null })
  const [deleting, setDeleting] = useState(false)
  const [actionModal, setActionModal] = useState({ isOpen: false, invoiceId: null as string | null, action: null as 'complete' | 'cancel' | null })
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadInvoices()
  }, [filter])

  async function loadInvoices() {
    try {
      setLoading(true)
      const data = await apiClient.listInvoices(filter || undefined)
      setInvoices((data as any) || [])
    } catch (error) {
      console.error('Failed to load invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this invoice?')) return
    try {
      await apiClient.deleteInvoice(id)
      setInvoices(invoices.filter(inv => inv.id !== id))
    } catch (error) {
      console.error('Failed to delete invoice:', error)
    }
  }

  function openDeleteModal(invoiceId: string) {
    setDeleteModal({ isOpen: true, invoiceId })
  }

  function closeDeleteModal() {
    setDeleteModal({ isOpen: false, invoiceId: null })
  }

  async function confirmDelete() {
    if (!deleteModal.invoiceId) return
    try {
      setDeleting(true)
      await apiClient.deleteInvoice(deleteModal.invoiceId)
      setInvoices(invoices.filter(inv => inv.id !== deleteModal.invoiceId))
      closeDeleteModal()
    } catch (error) {
      console.error('Failed to delete invoice:', error)
    } finally {
      setDeleting(false)
    }
  }

  function openActionModal(invoiceId: string, action: 'complete' | 'cancel') {
    setActionModal({ isOpen: true, invoiceId, action })
  }

  function closeActionModal() {
    setActionModal({ isOpen: false, invoiceId: null, action: null })
  }

  async function confirmAction() {
    if (!actionModal.invoiceId || !actionModal.action) return
    try {
      setActionLoading(true)
      if (actionModal.action === 'complete') {
        await apiClient.completeInvoice(actionModal.invoiceId)
      } else {
        await apiClient.cancelInvoice(actionModal.invoiceId)
      }
      await loadInvoices()
      closeActionModal()
    } catch (error) {
      console.error('Failed to update invoice:', error)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleSend(id: string) {
    try {
      await apiClient.sendInvoice(id)
      await loadInvoices()
    } catch (error) {
      console.error('Failed to send invoice:', error)
    }
  }

  const stats = [
    { label: 'Total Invoices', value: invoices.length.toString(), icon: IconFileText },
    { label: 'Completed', value: invoices.filter(i => i.status === 'COMPLETED').length.toString(), icon: IconCircleCheck },
    { label: 'Pending', value: invoices.filter(i => i.status === 'CREATED').length.toString(), icon: IconClock },
  ]

  return (
    <Shell title="Invoices">
      <div className="space-y-8 sm:space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-6">
          <div className="space-y-1">
            <h2 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-black">Invoices.</h2>
            <p className="text-[12px] sm:text-[14px] text-gray-500 font-medium">Manage your industrial billing and payment requests.</p>
          </div>
          <Link 
            href="/invoices/create" 
            className="px-4 sm:px-5 h-10 sm:h-11 bg-black text-white text-[12px] sm:text-[13px] font-bold rounded-full flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/5 flex-shrink-0"
          >
            <IconPlus size={16} />
            <span className="hidden sm:inline">New Invoice</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-28 sm:h-32 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 animate-pulse" />
            ))
          ) : (
            stats.map((stat, i) => (
              <div 
                key={i}
                className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-gray-100 transition-all"
              >
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg sm:rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                    <stat.icon size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-[18px] sm:text-[22px] font-bold text-black tracking-tight">{stat.value}</h3>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* List Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setFilter(null)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === null ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 hover:text-black'
                }`}
              >
                All
              </button>
              {['CREATED', 'COMPLETED', 'CANCELLED'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                    filter === status ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 hover:text-black'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 sm:h-[88px] bg-gray-50 rounded-lg sm:rounded-2xl border border-gray-100 animate-pulse" />
                ))}
              </div>
            ) : invoices.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 sm:py-20 text-center bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-3xl"
              >
                <IconAlertCircle size={40} className="mx-auto text-gray-200 mb-4 sm:mb-6" />
                <h4 className="text-[14px] sm:text-[16px] font-bold text-black mb-2">No invoices found.</h4>
                <Link href="/invoices/create" className="text-[12px] sm:text-[13px] font-bold text-black hover:underline underline-offset-4">Create your first invoice</Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2 sm:space-y-3"
              >
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="p-3 sm:p-5 bg-white rounded-lg sm:rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 group hover:border-gray-200 transition-all"
                  >
                    <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 flex-shrink-0">
                        <IconFileText size={16} className="text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h4 className="text-[13px] sm:text-[15px] font-bold text-black leading-none">{invoice.invoice_number}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-gray-50 text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] border border-gray-100 flex-shrink-0">
                            {invoice.status}
                          </span>
                        </div>
                        <p className="text-[12px] sm:text-[13px] text-gray-500 font-medium truncate">{invoice.client_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-10 flex-shrink-0">
                      <div className="text-left sm:text-right">
                        <p className="text-[14px] sm:text-[16px] font-bold text-black mb-1">₦{parseFloat(invoice.total_amount).toLocaleString()}</p>
                        <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest">Due {new Date(invoice.due_date).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <Link href={`/invoices/${invoice.id}/view`} className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm font-medium" title="View">
                          <IconEye size={16} className="text-gray-400" />
                          <span className="hidden sm:inline text-gray-600">View</span>
                        </Link>
                        {invoice.status === 'CREATED' && (
                          <>
                            <Link href={`/invoices/${invoice.id}/edit`} className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-blue-50 rounded-lg transition-colors text-xs sm:text-sm font-medium" title="Edit">
                              <IconPencil size={16} className="text-blue-500" />
                              <span className="hidden sm:inline text-blue-600">Edit</span>
                            </Link>
                            <button 
                              onClick={() => openActionModal(invoice.id, 'complete')} 
                              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-green-50 rounded-lg transition-colors text-xs sm:text-sm font-medium" 
                              title="Mark as Complete"
                            >
                              <IconCheck size={16} className="text-green-500" />
                              <span className="hidden sm:inline text-green-600">Complete</span>
                            </button>
                            <button 
                              onClick={() => openActionModal(invoice.id, 'cancel')} 
                              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-orange-50 rounded-lg transition-colors text-xs sm:text-sm font-medium" 
                              title="Mark as Cancelled"
                            >
                              <IconX size={16} className="text-orange-500" />
                              <span className="hidden sm:inline text-orange-600">Cancel</span>
                            </button>
                            <button 
                              onClick={() => openDeleteModal(invoice.id)} 
                              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-red-50 rounded-lg transition-colors text-xs sm:text-sm font-medium" 
                              title="Delete"
                            >
                              <IconTrash size={16} className="text-red-500" />
                              <span className="hidden sm:inline text-red-600">Delete</span>
                            </button>
                          </>
                        )}
                        <button onClick={() => apiClient.downloadInvoicePDF(invoice.id)} className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm font-medium" title="Download">
                          <IconDownload size={16} className="text-gray-400" />
                          <span className="hidden sm:inline text-gray-600">Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Invoice?"
        description="This invoice will be permanently removed. This action cannot be undone."
      />

      {/* Action Modal */}
      <AnimatePresence>
        {actionModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeActionModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md w-full p-6 sm:p-8"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  actionModal.action === 'complete' ? 'bg-green-50' : 'bg-orange-50'
                }`}>
                  {actionModal.action === 'complete' ? (
                    <IconCheck size={24} className="text-green-500" />
                  ) : (
                    <IconX size={24} className="text-orange-500" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black">
                    {actionModal.action === 'complete' ? 'Mark as Complete?' : 'Mark as Cancelled?'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {actionModal.action === 'complete' 
                      ? 'Mark this invoice as completed and it will be locked from further edits.'
                      : 'Mark this invoice as cancelled. You can still view it but cannot edit it.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={closeActionModal}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-sm font-bold text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  disabled={actionLoading}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-bold text-white transition-colors disabled:opacity-50 ${
                    actionModal.action === 'complete' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {actionLoading ? 'Processing...' : (actionModal.action === 'complete' ? 'Complete' : 'Cancel')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  )
}
