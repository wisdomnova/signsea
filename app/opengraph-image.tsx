import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  // Fetch Geist font files directly for crisp typography rendering
  const [geistBoldData, geistRegularData, geistMonoData] = await Promise.all([
    fetch('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Bold.ttf').then((res) =>
      res.arrayBuffer()
    ),
    fetch('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Regular.ttf').then((res) =>
      res.arrayBuffer()
    ),
    fetch('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-mono/GeistMono-Regular.ttf').then((res) =>
      res.arrayBuffer()
    ),
  ])

  // Grid cell dimensions (10 columns x 5 rows across 1200x630 canvas)
  const cellSize = 100
  const startX = 100
  const startY = 65

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#fafafa',
          color: '#000000',
          fontFamily: 'Geist, system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Full Grid Lines Matrix (Light Mode Architectural Grid) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            backgroundImage:
              'linear-gradient(to right, rgba(0, 0, 0, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.06) 1px, transparent 1px)',
            backgroundSize: '100px 100px',
            backgroundPosition: '0 15px',
          }}
        />

        {/* Minimalist Grid Matrix Layout (Inspired by Reference 2 & 3) */}
        
        {/* Top-Right Accent Black Block */}
        <div
          style={{
            position: 'absolute',
            top: '115px',
            right: '200px',
            width: '100px',
            height: '100px',
            backgroundColor: '#000000',
            display: 'flex',
          }}
        />

        {/* Electric Cobalt Blue Block with Anchor Icon */}
        <div
          style={{
            position: 'absolute',
            top: '215px',
            right: '300px',
            width: '100px',
            height: '100px',
            backgroundColor: '#0052FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="square">
            <path d="M12 8v13" />
            <path d="M4 14a8 8 0 0 0 16 0" />
            <path d="M19 14h2" />
            <path d="M3 14h2" />
            <circle cx="12" cy="5" r="3" />
          </svg>
        </div>

        {/* Subtle Peach/Coral Accent Tile */}
        <div
          style={{
            position: 'absolute',
            top: '315px',
            right: '200px',
            width: '100px',
            height: '100px',
            backgroundColor: '#ffedea',
            border: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
          }}
        />

        {/* Soft Grey Accent Tile */}
        <div
          style={{
            position: 'absolute',
            top: '215px',
            right: '100px',
            width: '100px',
            height: '100px',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
          }}
        />

        {/* Main Clean Typographic Core */}
        <div
          style={{
            position: 'absolute',
            left: '100px',
            top: '160px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10,
          }}
        >
          {/* Top Label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#0052FF',
                display: 'flex',
              }}
            />
            <span
              style={{
                fontFamily: 'GeistMono, monospace',
                fontSize: '13px',
                letterSpacing: '0.12em',
                color: '#666666',
                textTransform: 'uppercase',
              }}
            >
              Escrow & Payment Infrastructure
            </span>
          </div>

          {/* Main Title with Superscript */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <h1
              style={{
                fontSize: '92px',
                fontWeight: 700,
                color: '#000000',
                letterSpacing: '-0.04em',
                lineHeight: '0.95',
                margin: 0,
              }}
            >
              SignSea
            </h1>
            <span
              style={{
                fontFamily: 'GeistMono, monospace',
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
                letterSpacing: '0.08em',
                marginTop: '10px',
              }}
            >
              // 01
            </span>
          </div>

          {/* Minimalist Subtitle */}
          <p
            style={{
              fontSize: '24px',
              fontWeight: 400,
              color: '#555555',
              letterSpacing: '-0.02em',
              margin: '28px 0 0 0',
              maxWidth: '520px',
              lineHeight: '1.35',
            }}
          >
            High-trust milestone escrow and verifiable financial settlements for modern contracts.
          </p>
        </div>

        {/* Minimalist Bottom Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '100px',
            right: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            paddingTop: '20px',
          }}
        >
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'GeistMono, monospace',
                fontSize: '13px',
                color: '#888888',
                letterSpacing: '0.05em',
              }}
            >
              SPEC: MILESTONE_LOCKED
            </span>
            <span
              style={{
                fontFamily: 'GeistMono, monospace',
                fontSize: '13px',
                color: '#888888',
                letterSpacing: '0.05em',
              }}
            >
              VERIFICATION: BVN // NIN
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'GeistMono, monospace',
                fontSize: '15px',
                fontWeight: 600,
                color: '#000000',
                letterSpacing: '0.02em',
              }}
            >
              signsea.org
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Geist',
          data: geistBoldData,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'Geist',
          data: geistRegularData,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'GeistMono',
          data: geistMonoData,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
