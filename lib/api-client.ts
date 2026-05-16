'use client'

import { useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export class ApiClient {
  private accessToken: string | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken')
    }
  }

  setAccessToken(token: string) {
    this.accessToken = token
    localStorage.setItem('accessToken', token)
  }

  getAccessToken(): string | null {
    // Always check localStorage for the latest token
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken')
    }
    return this.accessToken
  }

  clearAuth() {
    this.accessToken = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  private getHeaders() {
    const headers: any = {
      'Content-Type': 'application/json',
    }

    const token = this.getAccessToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  async request<T>(
    path: string,
    method: string,
    body?: any,
  ): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    })

    if (response.status === 401) {
      // Only redirect to login if we are not on a public page
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/pay/')) {
        this.clearAuth()
        window.location.href = '/auth/login'
      }
      throw new Error('Unauthorized')
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `API Error: ${response.status}`)
    }

    return data
  }

  // Auth
  register(email: string, password: string, firstName?: string, lastName?: string) {
    return this.request('/auth/register', 'POST', {
      email,
      password,
      firstName,
      lastName,
    })
  }

  login(email: string, password: string) {
    return this.request('/auth/login', 'POST', {
      email,
      password,
    })
  }

  getMe() {
    return this.request('/auth/me', 'GET')
  }

  updateProfile(data: any) {
    return this.request('/auth/profile', 'PATCH', data)
  }

  logout() {
    return this.request('/auth/logout', 'POST')
  }

  deleteAccount() {
    return this.request('/auth/account', 'DELETE')
  }

  // Invoices
  createInvoice(data: any) {
    return this.request('/invoices', 'POST', data)
  }

  getInvoice(id: string) {
    return this.request(`/invoices/${id}`, 'GET')
  }

  listInvoices(status?: string) {
    const query = new URLSearchParams()
    if (status) query.append('status', status)
    return this.request(`/invoices?${query}`, 'GET')
  }

  updateInvoice(id: string, data: any) {
    return this.request(`/invoices/${id}`, 'PATCH', data)
  }

  sendInvoice(id: string) {
    return this.request(`/invoices/${id}/send`, 'POST', {})
  }

  downloadInvoicePDF(id: string) {
    window.open(`${API_URL}/invoices/${id}/pdf?token=${this.accessToken}`, '_blank')
  }

  deleteInvoice(id: string) {
    return this.request(`/invoices/${id}`, 'DELETE')
  }

  completeInvoice(id: string) {
    return this.request(`/invoices/${id}/complete`, 'POST', {})
  }

  cancelInvoice(id: string) {
    return this.request(`/invoices/${id}/cancel`, 'POST', {})
  }

  // Projects
  createProject(data: any) {
    return this.request('/projects', 'POST', data)
  }

  getProject(id: string) {
    return this.request(`/projects/${id}`, 'GET')
  }

  listProjects(status?: string) {
    const query = new URLSearchParams()
    if (status) query.append('status', status)
    return this.request(`/projects?${query}`, 'GET')
  }

  updateProject(id: string, data: any) {
    return this.request(`/projects/${id}`, 'PATCH', data)
  }

  deleteProject(id: string) {
    return this.request(`/projects/${id}`, 'DELETE')
  }

  // Milestones
  addMilestone(projectId: string, data: any) {
    return this.request(`/projects/${projectId}/milestones`, 'POST', data)
  }

  getMilestones(projectId: string) {
    return this.request(`/projects/${projectId}/milestones`, 'GET')
  }

  updateMilestone(projectId: string, milestoneId: string, data: any) {
    return this.request(`/projects/${projectId}/milestones/${milestoneId}`, 'PATCH', data)
  }

  // Dashboard
  getDashboardStats() {
    return this.request('/dashboard/stats', 'GET')
  }

  // KYC
  verifyNIN(nin: string) {
    return this.request('/kyc/verify-nin', 'POST', { nin })
  }

  verifyBVN(bvn: string) {
    return this.request('/kyc/verify-bvn', 'POST', { bvn })
  }

  requestPhoneOTP(phone_number: string) {
    return this.request('/kyc/phone-otp', 'POST', { phone_number })
  }

  validatePhoneOTP(otp_reference: string, otp: string) {
    return this.request('/kyc/validate-otp', 'POST', { otp_reference, otp })
  }

  getKYCStatus() {
    return this.request('/kyc/status', 'GET')
  }

  // Wallet
  getWalletBalance() {
    return this.request('/wallet/balance', 'GET')
  }

  getWalletTransactions(limit?: number, offset?: number) {
    const query = new URLSearchParams()
    if (limit) query.append('limit', limit.toString())
    if (offset) query.append('offset', offset.toString())
    return this.request(`/wallet/transactions?${query}`, 'GET')
  }

  getEscrowDetails() {
    return this.request('/wallet/escrow', 'GET')
  }

  withdrawFunds(amount: number, currency: string, bankAccountId: string) {
    return this.request('/wallet/withdraw', 'POST', {
      amount,
      currency,
      bankAccountId,
    })
  }

  // Bank Accounts
  getBankAccounts() {
    return this.request('/bank-accounts', 'GET')
  }

  addBankAccount(accountNumber: string, bankCode: string, accountHolderName: string) {
    return this.request('/bank-accounts', 'POST', {
      accountNumber,
      bankCode,
      accountHolderName,
    })
  }

  setDefaultBankAccount(accountId: string) {
    return this.request(`/bank-accounts/${accountId}/default`, 'PATCH')
  }

  deleteBankAccount(accountId: string) {
    return this.request(`/bank-accounts/${accountId}`, 'DELETE')
  }

  getDefaultBankAccount() {
    return this.request('/bank-accounts/default', 'GET')
  }

  // Settings
  changePassword(currentPassword: string, newPassword: string) {
    return this.request('/settings/password', 'POST', {
      currentPassword,
      newPassword,
    })
  }

  getNotificationPreferences() {
    return this.request('/settings/notifications', 'GET')
  }

  updateNotificationPreferences(prefs: {
    projectMilestones?: boolean
    paymentSettlements?: boolean
    securityAlerts?: boolean
  }) {
    return this.request('/settings/notifications', 'PATCH', prefs)
  }

  enable2FA() {
    return this.request('/settings/2fa/enable', 'POST')
  }

  confirm2FA(secret: string, code: string) {
    return this.request('/settings/2fa/confirm', 'POST', { secret, code })
  }

  disable2FA() {
    return this.request('/settings/2fa/disable', 'POST')
  }

  get2FAStatus() {
    return this.request('/settings/2fa/status', 'GET')
  }

  // Reputation
  getReputation() {
    return this.request('/reputation', 'GET')
  }

  recalculateReputation() {
    return this.request('/reputation/recalculate', 'POST')
  }
}

export const apiClient = new ApiClient()

// Hook for using API client
export function useApi() {
  return apiClient
}
