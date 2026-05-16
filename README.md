# SignSea Frontend

Frontend for SignSea - Fastify-powered freelance escrow platform with integrated invoice maker.

## Overview

SignSea is a modern marketplace for secure project-based work with:
- **Milestone-based Escrow**: Funds held in trust until deliverables are complete
- **Invoice Management**: Create, send, and track professional invoices
- **Project Tracking**: Monitor project status and payments
- **User Reputation**: Build trust through reviews and completed projects
- **Secure Payments**: Integrated with Paystack for Nigerian markets

## Architecture

This frontend is now connected to a **Fastify backend** instead of Supabase:

- **Frontend**: Next.js 16 with React 19
- **Backend**: Fastify with PostgreSQL
- **Auth**: JWT-based authentication
- **Database**: PostgreSQL managed by backend

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm

### Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment:**
   ```bash
   cp .env .env.local
   # Edit with your backend URL
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

Frontend runs at `http://localhost:3000`

> **Note**: Make sure the backend is running at `http://localhost:3001` (or update `NEXT_PUBLIC_API_URL` in `.env.local`)

## Features

### Dashboard
- Overview of active projects and wallet balance
- Quick access to key metrics
- Project status tracking

### Invoice Management
- **Create invoices** with multiple line items
- **Add taxes and discounts** with automatic calculations
- **Download as PDF** for sharing or printing
- **Send to clients** with secure payment links
- **Track status**: Draft → Sent → Viewed → Paid
- **Partial payments** support

### Projects
- Create new projects with custom milestones
- Set project duration and payment terms
- Track milestone completion
- Manage escrow releases

### Wallet
- View available balance
- See escrow-locked funds
- View transaction history
- Request withdrawals

### Settings
- Update profile information
- Manage notification preferences
- Configure security settings
- Update bank account for payouts

## Environment Variables

```env
# Backend API (required)
NEXT_PUBLIC_API_URL=http://localhost:3001

# App URL (for sharing links)
NEXT_PUBLIC_APP_URL=https://signsea.org

# Payment Processing
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=
```

## Development Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Run production server
- `pnpm lint` - Run ESLint

## Project Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Landing page
├── dashboard/
│   └── page.tsx           # Dashboard overview
├── invoices/
│   ├── page.tsx           # Invoice list
│   └── create/
│       └── page.tsx       # Create invoice
├── projects/
│   ├── page.tsx           # Project list
│   ├── create/
│   │   └── page.tsx       # Create project
│   └── [projectId]/
│       └── page.tsx       # Project details
├── wallet/
│   ├── page.tsx           # Wallet overview
│   └── withdraw/
│       └── page.tsx       # Withdrawal page
└── settings/
    └── page.tsx           # User settings

components/
├── dashboard-shell.tsx    # Main layout shell
├── ui/                    # Reusable components
└── ...

lib/
├── api-client.ts          # API client for backend
└── ...
```

## API Integration

The frontend uses a custom API client to communicate with the backend:

```typescript
import { apiClient } from '@/lib/api-client'

// Auth
await apiClient.login(email, password)
await apiClient.register(email, password, firstName, lastName)
await apiClient.getMe()

// Invoices
await apiClient.createInvoice(invoiceData)
await apiClient.listInvoices(status)
await apiClient.getInvoice(id)
await apiClient.sendInvoice(id)
await apiClient.downloadInvoicePDF(id)
await apiClient.updateInvoice(id, data)
await apiClient.deleteInvoice(id)
```

## Migration from Supabase

This project was migrated from Supabase to a custom Fastify backend:

**Removed:**
- `@supabase/supabase-js`
- `@supabase/auth-helpers-nextjs`
- `@prisma/client` (ORM)
- Database-related packages

**Added:**
- Custom API client (`lib/api-client.ts`)
- Custom auth flow with JWT

**Key Changes:**
- All API calls now go through `apiClient`
- Auth is handled via JWT tokens stored in localStorage
- Backend manages all database operations

## Styling

Uses Tailwind CSS with a custom color scheme:

- **Primary**: Seafoam (teal/cyan)
- **Secondary**: Marine (dark blue)
- **Text**: Abyss (very dark navy)
- **Accent**: Pearl (off-white)

## Performance

- Static generation for public pages
- Server-side rendering for authenticated pages
- Image optimization with Next.js Image
- Code splitting for faster initial loads
- Framer Motion for smooth animations

## Deployment

### Frontend (Vercel/Next.js hosting)

```bash
pnpm build
# Deploy the .next folder to your host
```

### With Docker

```bash
docker build -t signsea-frontend:latest .
docker run -p 3000:3000 signsea-frontend:latest
```

## Troubleshooting

### API Connection Issues

1. Check that backend is running at the configured `NEXT_PUBLIC_API_URL`
2. Verify CORS is properly configured in backend
3. Check browser console for detailed error messages

### Authentication Issues

1. Clear browser cache and localStorage
2. Check JWT token in localStorage: `localStorage.getItem('accessToken')`
3. Verify backend JWT_SECRET matches across frontend/backend

### Invoice Generation Issues

1. Ensure all required invoice fields are filled
2. Check browser console for jsPDF errors
3. Verify line items have positive quantities and prices

## Support

For issues or questions:
1. Check backend logs: `docker-compose logs backend`
2. Check browser DevTools console
3. Review backend README for API endpoint details

## License

MIT
