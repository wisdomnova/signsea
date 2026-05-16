export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SignSea",
  "description": "Industrial payment infrastructure with secure escrow and milestone-based transactions",
  "url": "https://signsea.org",
  "image": "https://signsea.org/opengraph-image.png",
  "applicationCategory": "FinanceApplication",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "price": "0",
    "priceValidUntil": "2027-12-31"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "ratingCount": "1"
  }
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SignSea",
  "url": "https://signsea.org",
  "logo": "https://signsea.org/logo.svg",
  "description": "Secure digital transaction infrastructure with milestone-based escrow",
  "sameAs": [
    "https://twitter.com/signsea",
    "https://linkedin.com/company/signsea"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "url": "https://signsea.org"
  }
}
