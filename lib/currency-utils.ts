// Convert kobo to naira (1 naira = 100 kobo)
export const koboToNaira = (kobo: number): number => {
  return kobo / 100
}

// Convert naira to kobo
export const nairaToKobo = (naira: number): number => {
  return Math.round(naira * 100)
}

// Format currency for display
export const formatCurrency = (amount: number, currency: string = 'NGN', rates?: Record<string, number>): string => {
  const symbols: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    GBP: '£',
    EUR: '€',
  }

  const symbol = symbols[currency] || currency
  
  // Convert from NGN to target currency if rates provided and not NGN
  let displayAmount = amount
  if (currency !== 'NGN' && rates && rates['NGN'] && rates[currency]) {
    // Convert from naira to USD first, then to target currency
    const inUSD = amount / rates['NGN']
    displayAmount = inUSD * rates[currency]
  }

  return `${symbol}${displayAmount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

// Format amount with short notation (1.2M, 450k, etc)
export const formatAmountShort = (amount: number, currency: string = 'NGN', rates?: Record<string, number>): string => {
  const symbols: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    GBP: '£',
    EUR: '€',
  }

  const symbol = symbols[currency] || currency
  
  // Convert from NGN to target currency if rates provided and not NGN
  let displayAmount = amount
  if (currency !== 'NGN' && rates && rates['NGN'] && rates[currency]) {
    // Convert from naira to USD first, then to target currency
    const inUSD = amount / rates['NGN']
    displayAmount = inUSD * rates[currency]
  }

  if (displayAmount >= 1000000) {
    return `${symbol}${(displayAmount / 1000000).toFixed(1)}M`
  } else if (displayAmount >= 1000) {
    return `${symbol}${(displayAmount / 1000).toFixed(0)}k`
  } else {
    return `${symbol}${displayAmount.toFixed(0)}`
  }
}
