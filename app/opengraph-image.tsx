import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  // Fetch Geist font files for crisp typography rendering
  const [geistBoldData, geistRegularData] = await Promise.all([
    fetch('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Bold.ttf')
      .then((res) => res.arrayBuffer())
      .catch(() => null),
    fetch('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Regular.ttf')
      .then((res) => res.arrayBuffer())
      .catch(() => null),
  ])

  const fonts: any[] = []
  if (geistBoldData) {
    fonts.push({
      name: 'Geist',
      data: geistBoldData,
      weight: 700,
      style: 'normal',
    })
  }
  if (geistRegularData) {
    fonts.push({
      name: 'Geist',
      data: geistRegularData,
      weight: 400,
      style: 'normal',
    })
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#020712',
          color: '#ffffff',
          fontFamily: 'Geist, system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Oceanic Background & Wave Ripple Contours */}
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <defs>
            {/* Deep Abyssal Radial Gradient */}
            <radialGradient id="oceanBgGlow" cx="88%" cy="86%" r="85%" fx="88%" fy="86%">
              <stop offset="0%" stopColor="#034574" stopOpacity="0.95" />
              <stop offset="28%" stopColor="#032B4F" stopOpacity="0.85" />
              <stop offset="58%" stopColor="#021830" stopOpacity="0.92" />
              <stop offset="85%" stopColor="#010A17" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#01060E" stopOpacity="1" />
            </radialGradient>

            {/* Bioluminescent Radiant Aura at Bottom Right */}
            <radialGradient id="oceanCoreAura" cx="86%" cy="84%" r="40%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.45" />
              <stop offset="35%" stopColor="#0284C7" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#020712" stopOpacity="0" />
            </radialGradient>

            {/* Tidal wave contour gradients */}
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.2" />
              <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.12" />
              <stop offset="60%" stopColor="#0284C7" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.65" />
            </linearGradient>

            <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Deep Sea Ambient Base */}
          <rect width="1200" height="630" fill="url(#oceanBgGlow)" />
          <rect width="1200" height="630" fill="url(#oceanCoreAura)" />

          {/* Concentric Oceanic Horizon Ripples */}
          {/* Outer Ripple 5 */}
          <rect
            x="-40"
            y="-220"
            width="1500"
            height="1050"
            rx="525"
            fill="none"
            stroke="rgba(14, 165, 233, 0.08)"
            strokeWidth="1.5"
          />

          {/* Swell Ripple 4 */}
          <rect
            x="140"
            y="-120"
            width="1300"
            height="950"
            rx="475"
            fill="rgba(2, 132, 199, 0.02)"
            stroke="url(#waveGrad3)"
            strokeWidth="2"
          />

          {/* Wave Ripple 3 */}
          <rect
            x="320"
            y="-20"
            width="1100"
            height="850"
            rx="425"
            fill="rgba(14, 165, 233, 0.04)"
            stroke="url(#waveGrad2)"
            strokeWidth="2.5"
          />

          {/* Current Ripple 2 */}
          <rect
            x="500"
            y="80"
            width="900"
            height="750"
            rx="375"
            fill="rgba(6, 182, 212, 0.07)"
            stroke="url(#waveGrad1)"
            strokeWidth="3"
          />

          {/* Inner Tidal Arc 1 */}
          <rect
            x="680"
            y="190"
            width="700"
            height="630"
            rx="315"
            fill="rgba(2, 132, 199, 0.14)"
            stroke="rgba(186, 230, 253, 0.8)"
            strokeWidth="3.5"
          />

          {/* Innermost Aqua Pool */}
          <rect
            x="820"
            y="300"
            width="520"
            height="480"
            rx="240"
            fill="rgba(14, 165, 233, 0.22)"
            stroke="rgba(240, 249, 255, 0.95)"
            strokeWidth="2"
          />
        </svg>

        {/* BOTTOM RIGHT CORNER: Pure, Minimalist, Precise Logo & Text */}
        <div
          style={{
            position: 'absolute',
            bottom: '68px',
            right: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '22px',
            zIndex: 50,
          }}
        >
          {/* Logo Mark Container */}
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '18px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                '0 0 50px rgba(56, 189, 248, 0.7), 0 0 100px rgba(14, 165, 233, 0.45), 0 16px 32px rgba(1, 10, 23, 0.8)',
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
            }}
          >
            {/* SignSea Anchor Mark */}
            <svg
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#020B14"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 9v12" />
              <path d="M4 13a8 8 0 0 0 16 0" />
              <path d="M19 13h2" />
              <path d="M3 13h2" />
              <circle cx="12" cy="6" r="3" />
            </svg>
          </div>

          {/* Typography: "SignSea" */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '52px',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                color: '#ffffff',
                lineHeight: 1,
                textShadow: '0 4px 24px rgba(1, 10, 23, 0.95)',
              }}
            >
              SignSea
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  )
}
