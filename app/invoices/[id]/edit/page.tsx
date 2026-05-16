'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { IconArrowLeft, IconPlus, IconTrash } from '@tabler/icons-react'
import Link from 'next/link'
import { Shell } from '@/components/dashboard-shell'
import { apiClient } from '@/lib/api-client'

export default function EditInvoicePage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    companyName: '',
    companyAddress: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    taxRate: 0,
    discountAmount: 0,
    notes: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadInvoice()
  }, [invoiceId])

  async function loadInvoice() {
    try {
      setLoading(true)
      const invoice: any = await apiClient.getInvoice(invoiceId)
      
      // Transform items from snake_case to camelCase
      const items = (invoice.items || []).map((item: any) => ({
        description: item.description || '',
        quantity: item.quantity || 1,
        unitPrice: item.unit_price || 0,
      }))
      
      setFormData({
        clientName: invoice.client_name || '',
        clientEmail: invoice.client_email || '',
        clientPhone: invoice.client_phone || '',
        clientAddress: invoice.client_address || '',
        companyName: invoice.creator_company_name || '',
        companyAddress: invoice.creator_address || '',
        issueDate: invoice.issue_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        dueDate: invoice.due_date?.split('T')[0] || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: items.length > 0 ? items : [{ description: '', quantity: 1, unitPrice: 0 }],
        taxRate: invoice.tax_rate || 0,
        discountAmount: invoice.discount_amount || 0,
        notes: invoice.notes || '',
      })
    } catch (error) {
      setError('Failed to load invoice')
      console.error('Error loading invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      await apiClient.updateInvoice(invoiceId, formData)
      router.push('/invoices')
    } catch (error) {
      setError('Failed to update invoice')
      console.error('Error updating invoice:', error)
    } finally {
      setSaving(false)
    }
  }

  function addItem() {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0 }],
    })
  }

  function removeItem(index: number) {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  function updateItem(index: number, field: string, value: any) {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  const taxAmount = (subtotal * formData.taxRate) / 100
  const total = subtotal + taxAmount - formData.discountAmount

  if (loading) {
    return (
      <Shell title="Edit Invoice">
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-40" />
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </Shell>
    )
  }

  return (
    <Shell title="Edit Invoice">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl"
      >
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/invoices"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IconArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Invoice</h1>
            <p className="text-gray-500 text-sm">Update your invoice details and items</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Information */}
          <div className="space-y-4 p-6 bg-white rounded-2xl border border-gray-100">
            <h3 className="font-bold text-black">Client Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Client Name"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black"
              />
              <input
                type="email"
                placeholder="Client Email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                className="px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black"
              />
              <input
                type="tel"
                placeholder="Client Phone"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                className="px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black"
              />
              <input
                type="text"
                placeholder="Client Address"
                value={formData.clientAddress}
                onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                className="px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Invoice Dates */}
          <div className="space-y-4 p-6 bg-white rounded-2xl border border-gray-100">
            <h3 className="font-bold text-black">Invoice Dates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="space-y-4 p-6 bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-black">Invoice Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 text-sm font-bold text-black hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
              >
                <IconPlus size={16} />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                    className="w-16 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                    className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tax & Discount */}
          <div className="space-y-4 p-6 bg-white rounded-2xl border border-gray-100">
            <h3 className="font-bold text-black mb-4">Tax & Discount</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Amount</label>
                <input
                  type="number"
                  value={formData.discountAmount}
                  onChange={(e) => setFormData({ ...formData, discountAmount: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Totals */}
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold">₦{subtotal.toLocaleString()}</span>
              </div>
              {formData.taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax ({formData.taxRate}%)</span>
                  <span className="font-bold">₦{taxAmount.toLocaleString()}</span>
                </div>
              )}
              {formData.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-bold">-₦{formData.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4 p-6 bg-white rounded-2xl border border-gray-100">
            <label className="block text-sm font-bold text-black">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes or terms..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Link
              href="/invoices"
              className="px-6 py-3 bg-gray-100 text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Invoice'}
            </button>
          </div>
        </form>
      </motion.div>
    </Shell>
  )
}
