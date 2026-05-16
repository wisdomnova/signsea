import { useState } from 'react'
import { apiClient } from './api-client'
import { generateProjectShareLink, generateInvoiceShareLink } from './link-generator'

export function useCreateProject() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProject = async (data: {
    title: string
    description?: string
    type: 'SINGLE' | 'MILESTONES'
    totalAmount: number
    currency: string
    durationDays?: number
  }) => {
    try {
      setLoading(true)
      setError(null)

      const response: any = await apiClient.createProject({
        title: data.title,
        description: data.description,
        type: data.type,
        total_amount: data.totalAmount,
        currency: data.currency,
        duration_days: data.durationDays,
      })

      // Generate shareable link
      const projectId = response?.id || ''
      const shareLink = generateProjectShareLink(projectId)

      return {
        projectId,
        shareLink,
        project: response,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createProject, loading, error }
}

export function useCreateInvoice() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createInvoice = async (data: {
    clientName: string
    clientEmail: string
    clientPhone?: string
    clientAddress?: string
    projectId?: string
    issueDate: string
    dueDate: string
    items: Array<{
      description: string
      quantity: number
      unitPrice: number
    }>
    taxRate?: number
    discountAmount?: number
    notes?: string
    paymentTerms?: string
  }) => {
    try {
      setLoading(true)
      setError(null)

      const response: any = await apiClient.createInvoice({
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        clientAddress: data.clientAddress,
        projectId: data.projectId,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        items: data.items,
        taxRate: data.taxRate || 0,
        discountAmount: data.discountAmount || 0,
        notes: data.notes,
        paymentTerms: data.paymentTerms,
      })

      // Generate shareable link
      const invoiceId = response?.id || ''
      const shareLink = generateInvoiceShareLink(invoiceId)

      return {
        invoiceId,
        shareLink,
        invoiceNumber: response?.invoice_number || '',
        invoice: response,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create invoice'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createInvoice, loading, error }
}
