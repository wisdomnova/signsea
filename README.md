<div align="center">

# ⚓ SignSea

**Industrial Payment Infrastructure & Milestone-Based Escrow Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

[Live Demo](https://signsea.org) • [Backend API Repository](https://github.com/wisdomnova/proofchain) • [Documentation](https://signsea.org)

</div>

---

## ✦ Overview

**SignSea** is a high-trust, cyber-industrial financial infrastructure designed for high-value freelance contracts, project-based work, and digital commerce. It eliminates counterparty payment risk through verifiable milestone-locked escrow, integrated invoicing, automated identity verification (NIN/BVN), and instant automated settlements.

```
                  ┌──────────────────────────────────────────────┐
                  │                 CLIENT FUNDS                 │
                  └──────────────────────┬───────────────────────┘
                                         │  (Deposit into Escrow)
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │         SIGNSEA MILESTONE ESCROW VAULT       │
                  │    [Funds Locked & Cryptographically Verified] │
                  └──────────────────────┬───────────────────────┘
                                         │  (Milestone Approved)
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │              INSTANT SETTLEMENT              │
                  │         [Freelancer Wallet / Payout]         │
                  └──────────────────────────────────────────────┘
```

---

## ⚡ Core Features

### 1. Milestone-Based Escrow Engine
- **Fund Lock & Trust**: Payments are pre-funded into escrow before work begins.
- **Verifiable Deliverables**: Multi-stage milestone tracking with custom deadlines and acceptance criteria.
- **Dispute Resolution**: Built-in mediation protocol with audit trail logs.

### 2. Full-Featured Invoice Generator
- **Multi-Line Item Support**: Quantities, unit pricing, dynamic tax rates, and discount calculations.
- **Brand Customization**: Custom company logos, signature attachments, brand themes, and terms.
- **Direct Client Portal**: Secure, token-based payment links (`/pay/[projectId]`) allowing one-click settlement.
- **PDF Generation**: Server-rendered, pixel-perfect PDF export via Puppeteer & jsPDF.

### 3. Identity Verification & KYC
- **Regional Trust Verification**: Native integration with national identity registers (**NIN** and **BVN**).
- **Phone OTP Validation**: Two-factor verification for security-sensitive operations and withdrawals.

### 4. Financial Ledger & Wallet
- **Dual Balance Ledger**: Clear separation between *Available Funds* and *Escrow-Locked Funds*.
- **Payout Management**: Direct bank account linking, payout validation, and instant withdrawals powered by Paystack.
- **Audit-Ready History**: Comprehensive transaction history for deposits, releases, withdrawals, and fees.

### 5. Reputation Protocol
- Dynamic reputation scoring derived from completed milestone volume, dispute-free record, and verified client reviews.

---

## 🛠 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | React 19 server/client components, Turbopack |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) | Strict type safety across UI and API layers |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS | High-performance CSS engine with CSS variables |
| **Design System** | Swiss Cyber-Industrial | Dark mode (`#050505`), Geist Sans, Geist Mono |
| **Icons & UI** | Phosphor Icons, Tabler Icons, Lucide | Crisp vector iconography |
| **State & Data** | React Hook Form, Zod, TanStack Query | Type-safe form validation and caching |
| **API Client** | Typed REST Client (`lib/api-client.ts`) | Fastify JWT-authenticated REST communication |
| **Payment Gateway**| [Paystack](https://paystack.com/) | Secure card, bank transfer, and USSD payments |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v20.x or later
- **pnpm**: v9.x or v10.x (`npm install -g pnpm`)
- **Backend API**: Running instance of [signsea-backend](https://github.com/wisdomnova/proofchain)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/wisdomnova/signsea.git
   cd signsea
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   # Backend API Endpoint
   NEXT_PUBLIC_API_URL=http://localhost:3001

   # Application URL
   NEXT_PUBLIC_APP_URL=https://signsea.org

   # Paystack Public Key
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...

   # Sentry DSN (Optional)
   NEXT_PUBLIC_SENTRY_DSN=
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
signsea/
├── app/
│   ├── layout.tsx              # Root HTML & metadata layout
│   ├── page.tsx                # Marketing landing page
│   ├── opengraph-image.tsx     # Dynamic Swiss cyber-industrial OG generator
│   ├── sitemap.ts              # SEO sitemap generator
│   ├── auth/                   # Authentication pages (Login, Register, Reset)
│   ├── dashboard/              # User analytics and operational metrics
│   ├── invoices/               # Invoicing suite (Create, Edit, View, List)
│   ├── projects/               # Milestone escrow management
│   ├── wallet/                 # Wallet balance, withdrawal & ledger history
│   ├── pay/[projectId]/        # Client payment portal & checkout
│   ├── settings/               # Profile, 2FA, notifications, bank accounts
│   ├── reputation/             # Reputation metrics & review management
│   └── legal/                  # Terms, Privacy Policy, Work Policy
├── components/
│   ├── dashboard-shell.tsx     # Navigation sidebar & authenticated layout
│   ├── delete-modal.tsx        # Destructive action confirmations
│   ├── footer.tsx              # Global footer
│   └── ui/                     # Reusable design system primitives
├── lib/
│   ├── api-client.ts           # Centralized typed Fastify REST client
│   ├── currency-context.tsx    # Multi-currency provider (NGN, USD, EUR, GBP)
│   └── schema.ts               # Structured JSON-LD metadata
└── public/                     # Static icons, manifest, and branding assets
```

---

## 📜 Development Scripts

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Start Next.js development server with Turbopack |
| `pnpm build` | Build optimized production bundle |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint static code analysis |

---

## 🛡 Security & Verification

- **JWT Authentication**: Secure token-based session handling with automatic refresh mechanisms.
- **Client-Side Sanitization**: Zod-validated payloads across all form submissions.
- **Isolated Client Portals**: Public invoice and payment links (`/pay/[projectId]`) access strictly scoped milestone data without exposing private account information.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
