import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#050505',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          padding: '48px 56px',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        {/* Ambient Dark Gradient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            right: '-100px',
            width: '650px',
            height: '650px',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(34, 197, 94, 0.05) 45%, transparent 70%)',
            borderRadius: '50%',
            display: 'flex',
          }}
        />

        {/* Blueprint Grid Lines Pattern (Background) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            backgroundImage:
              'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.8,
          }}
        />

        {/* Top Wireframe / Coordinate Grid Block (Right side architectural visual) */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '56px',
            width: '280px',
            height: '160px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backgroundColor: 'rgba(10, 10, 10, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '12px 14px',
          }}
        >
          {/* Inner Grid Coordinates */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.1em' }}>
              GRID.REF: // 04-A
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'flex' }} />
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#22c55e', letterSpacing: '0.05em' }}>
                LIVE
              </span>
            </div>
          </div>

          {/* Micro Blueprint Grid inside */}
          <div
            style={{
              display: 'flex',
              height: '80px',
              width: '100%',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundImage:
                'linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#050505',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'monospace',
                letterSpacing: '0.08em',
                display: 'flex',
              }}
            >
              ESCROW_PROTOCOL
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'monospace', color: '#666666' }}>
            <span>(A) SECURE_LEDGER</span>
            <span>(B) 100%_AUDITED</span>
          </div>
        </div>

        {/* Top Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', zIndex: 10 }}>
          {/* Brand Logo & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#050505',
              }}
            >
              {/* Geometric Anchor Logo Icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="2.5" strokeLinecap="square">
                <path d="M12 8v13" />
                <path d="M4 14a8 8 0 0 0 16 0" />
                <path d="M19 14h2" />
                <path d="M3 14h2" />
                <circle cx="12" cy="5" r="3" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
                SignSea
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#888888', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Cyber-Industrial Escrow
              </span>
            </div>
          </div>

          {/* Coordinate Marks */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginRight: '300px' }}>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>
              (C) SYS_SPEC_2.0
            </span>
          </div>
        </div>

        {/* Center Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '820px', zIndex: 10, marginTop: '20px' }}>
          {/* Tag / Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '6px 14px',
                fontSize: '12px',
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
                color: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'flex' }} />
              HIGH-TRUST PAYMENT INFRASTRUCTURE
            </div>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#666666' }}>
              // VERIFIABLE_MILESTONES
            </span>
          </div>

          {/* Bold Modern Headline */}
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: '1.08',
              margin: 0,
              color: '#ffffff',
              textTransform: 'uppercase',
            }}
          >
            Industrial Escrow & <br />
            Payment Infrastructure.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '20px',
              color: '#a0a0a0',
              lineHeight: '1.45',
              margin: 0,
              fontWeight: 400,
              maxWidth: '720px',
            }}
          >
            Milestone-based financial trust for high-value contracts. Zero disputes, automated verification, and instant cross-border settlement.
          </p>
        </div>

        {/* Bottom Metrics / Technical Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '20px',
            width: '100%',
            zIndex: 10,
          }}
        >
          {/* Feature Specs */}
          <div style={{ display: 'flex', gap: '36px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#666666', letterSpacing: '0.08em' }}>
                PROTOCOL
              </span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', fontFamily: 'monospace' }}>
                Milestone-Locked Escrow
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#666666', letterSpacing: '0.08em' }}>
                SECURITY
              </span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', fontFamily: 'monospace' }}>
                KYC & NIN/BVN Verified
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#666666', letterSpacing: '0.08em' }}>
                SETTLEMENT
              </span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#22c55e', fontFamily: 'monospace' }}>
                Instant Automated Payouts
              </span>
            </div>
          </div>

          {/* Domain & Crosshair Marker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', fontFamily: 'monospace', color: '#888888', letterSpacing: '0.05em' }}>
              signsea.org
            </span>
            <div
              style={{
                width: '24px',
                height: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#888888',
                fontFamily: 'monospace',
              }}
            >
              +
            </div>
          </div>
        </div>
      </div>
    ),
    size
  )
}
