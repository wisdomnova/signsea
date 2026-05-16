/**
 * Generate shareable links for projects and invoices
 * These links are token-based and secure for client viewing
 */

export function generateProjectShareLink(projectId: string, token?: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const params = new URLSearchParams()
  if (token) params.append('token', token)
  return `${appUrl}/p/${projectId}${params.toString() ? `?${params}` : ''}`
}

export function generateInvoiceShareLink(invoiceId: string, token?: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const params = new URLSearchParams()
  if (token) params.append('token', token)
  return `${appUrl}/invoices/${invoiceId}/view${params.toString() ? `?${params}` : ''}`
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export async function generateShareableLink(
  itemType: 'project' | 'invoice',
  itemId: string,
  token?: string
): Promise<string> {
  if (itemType === 'project') {
    return generateProjectShareLink(itemId, token)
  } else {
    return generateInvoiceShareLink(itemId, token)
  }
}
