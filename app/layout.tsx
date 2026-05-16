import './globals.css'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { CurrencyProvider } from '@/lib/currency-context'
import { jsonLd, organizationSchema } from '@/lib/schema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SignSea - Industrial Payment Infrastructure',
  description: 'Secure digital transactions with milestone-based escrow. Professional billing and verifiable payment infrastructure for modern businesses.',
  keywords: [
    'escrow',
    'payment',
    'invoice',
    'milestone',
    'payment gateway',
    'secure transactions',
    'billing software',
    'digital payments',
    'freelance payment',
    'project payment',
  ],
  metadataBase: new URL('https://signsea.org'),
  openGraph: {
    title: 'SignSea - Industrial Payment Infrastructure',
    description: 'Secure digital transactions with milestone-based escrow.',
    url: 'https://signsea.org',
    siteName: 'SignSea',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'SignSea Payment Infrastructure',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SignSea - Industrial Payment Infrastructure',
    description: 'Secure digital transactions with milestone-based escrow.',
    images: ['/opengraph-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Canonical URL */}
        <link rel="canonical" href="https://signsea.org" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        
        {/* Google Tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6NTM9004G0"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6NTM9004G0');
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  )
}
