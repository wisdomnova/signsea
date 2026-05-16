'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { IconArrowLeft, IconDownload } from '@tabler/icons-react'
import { Shell } from '@/components/dashboard-shell'
import { apiClient } from '@/lib/api-client'

export default function InvoiceViewPage() {
  const params = useParams()
  const invoiceId = params.id as string

  const [invoice, setInvoice] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadInvoice()
  }, [invoiceId])

  async function loadInvoice() {
    try {
      setLoading(true)
      const data: any = await apiClient.getInvoice(invoiceId)
      setInvoice(data)
      setItems(data.items || [])
    } catch (err) {
      setError('Failed to load invoice')
      console.error('Error loading invoice:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Shell title="View Invoice">
        <div className="space-y-4 max-w-4xl">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-40" />
          <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </Shell>
    )
  }

  if (error || !invoice) {
    return (
      <Shell title="View Invoice">
        <div className="max-w-4xl">
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800">
            <p className="font-bold mb-2">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </Shell>
    )
  }

  const currencySymbol = invoice.currency === 'NGN' ? '₦' : invoice.currency === 'USD' ? '$' : '£'
  const brandColor = invoice.brand_color || '#000000'
  const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0)

  return (
    <Shell title="View Invoice">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header with Download */}
        <div className="flex items-center justify-between">
          <Link
            href="/invoices"
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <IconArrowLeft size={18} />
            <span className="text-[14px] font-medium">Back to Invoices</span>
          </Link>
          <button 
            onClick={() => {
              const token = localStorage.getItem('accessToken') || ''
              window.open(`http://localhost:3001/invoices/${invoice.id}/pdf?token=${token}`)
            }}
            className="flex items-center gap-2 px-6 h-11 bg-black text-white rounded-full text-[14px] font-bold hover:bg-gray-800 transition-all"
          >
            <IconDownload size={18} />
            Download PDF
          </button>
        </div>

        {/* Invoice Document - Exact Match to Live Preview */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          {/* Header with Logo and Title */}
          <div className="flex justify-between items-start mb-12">
            <div 
              className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-black text-[18px]"
              style={{ backgroundColor: brandColor }}
            >
              {invoice.creator_company_name ? invoice.creator_company_name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="text-right">
              <h1 className="text-[20px] font-bold text-black tracking-tight mb-1">INVOICE</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">#{invoice.invoice_number}</p>
            </div>
          </div>

          {/* From / Bill To Section */}
          <div className="grid grid-cols-2 gap-8 mb-12 text-left">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: brandColor !== '#000000' ? brandColor : '#000000' }}>From</p>
              <p className="text-[13px] font-bold text-black leading-tight">{invoice.creator_company_name || 'Your Name'}</p>
              <p className="text-[11px] text-gray-500 font-medium mt-1 whitespace-pre-wrap">{invoice.creator_address || 'Your Address'}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Bill To</p>
              <p className="text-[13px] font-bold text-black leading-tight">{invoice.client_name || 'Client Name'}</p>
              <p className="text-[11px] text-gray-500 font-medium mt-1 whitespace-pre-wrap">{invoice.client_address || 'Client Address'}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="w-full mb-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                  <th className="py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">Qty</th>
                  <th className="py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-4 text-[12px] font-medium text-black">{item.description || 'Empty Position'}</td>
                    <td className="py-4 text-[12px] font-medium text-black text-right">{item.quantity}</td>
                    <td className="py-4 text-[12px] font-medium text-black text-right">{currencySymbol}{item.unit_price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer with Totals */}
          <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
            {invoice.notes && (
              <div className="mb-4">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Notes</p>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-medium text-gray-500">Subtotal</span>
              <span className="text-[12px] font-bold text-black">{currencySymbol}{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[18px] font-bold tracking-tight pt-2 border-t border-gray-50" style={{ color: brandColor }}>
              <span className="text-black">Total Due</span>
              <span>{currencySymbol}{invoice.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Shell>
  )
}
