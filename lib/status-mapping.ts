export const statusDisplayMap: Record<string, string> = {
  'DRAFT': 'Awaiting Payment',
  'PENDING': 'Pending',
  'ACTIVE': 'Paid',
  'FUNDED': 'In Progress',
  'COMPLETED': 'Completed',
  'DISPUTED': 'Disputed',
  'CANCELLED': 'Cancelled',
}

export const getDisplayStatus = (status: string): string => {
  return statusDisplayMap[status] || status
}
