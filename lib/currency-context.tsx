'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ExchangeRates {
  [key: string]: number
}

interface CurrencyContextType {
  selectedCurrency: string
  setSelectedCurrency: (currency: string) => void
  rates: ExchangeRates
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'NGN', 'KES', 'GHS']

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState('NGN')
  const [rates, setRates] = useState<ExchangeRates>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load initial currency from backend OR localStorage
  useEffect(() => {
    const loadCurrency = async () => {
      try {
        // Try fetch from backend first
        const { apiClient } = await import('./api-client')
        const user = await apiClient.getMe() as any
        if (user && user.preferred_currency) {
          setSelectedCurrency(user.preferred_currency)
          return
        }
      } catch (err) {
        // Fallback to localStorage if backend/auth fails
        const saved = localStorage.getItem('selectedCurrency')
        if (saved) setSelectedCurrency(saved)
      }
    }
    loadCurrency()
  }, [])

  // Sync with backend on change
  const handleCurrencyChange = async (currency: string) => {
    if (SUPPORTED_CURRENCIES.includes(currency)) {
      setSelectedCurrency(currency)
      localStorage.setItem('selectedCurrency', currency)
      try {
        const { apiClient } = await import('./api-client')
        await apiClient.updateProfile({ preferredCurrency: currency } as any)
      } catch (err) {
        console.error('Failed to sync currency to backend:', err)
      }
    }
  }

  // Fetch rates on mount and when currency changes
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setIsLoading(true)
        // Using open.er-api.com which is completely free, no API key required, and has good CORS support
        const response = await fetch('https://open.er-api.com/v6/latest?base=USD')
        const data = await response.json()
        
        if (data.result === 'success' && data.rates) {
          setRates(data.rates)
        } else {
          console.warn('Failed to fetch exchange rates, using fallback rates')
          // Fallback rates (approximate as of May 2026)
          setRates({
            USD: 1,
            EUR: 0.92,
            GBP: 0.79,
            JPY: 150,
            AUD: 1.53,
            CAD: 1.36,
            NGN: 1550,
            KES: 130,
            GHS: 12.5,
          })
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
        // Fallback rates
        setRates({
          USD: 1,
          EUR: 0.92,
          GBP: 0.79,
          JPY: 150,
          AUD: 1.53,
          CAD: 1.36,
          NGN: 1550,
          KES: 130,
          GHS: 12.5,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRates()

    // Refresh rates every hour
    const interval = setInterval(fetchRates, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount
    if (!rates[fromCurrency] || !rates[toCurrency]) return amount

    // Convert to USD first, then to target currency
    const inUSD = amount / rates[fromCurrency]
    return inUSD * rates[toCurrency]
  }

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency: handleCurrencyChange,
        rates,
        convertAmount,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}
