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
          backgroundColor: '#06040A',
          color: '#ffffff',
          fontFamily: 'Geist, system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Concentric Radiant Glow & Curves (Inspired by Reference 3) */}
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
            {/* Deep Cosmic Radial Gradient */}
            <radialGradient id="bgGlow" cx="82%" cy="80%" r="85%" fx="82%" fy="80%">
              <stop offset="0%" stopColor="#2E1065" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#1E0B3C" stopOpacity="0.75" />
              <stop offset="55%" stopColor="#0F061E" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#050308" stopOpacity="1" />
            </radialGradient>

            {/* Vibrant Core Glow at Bottom Right */}
            <radialGradient id="coreAura" cx="84%" cy="82%" r="35%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
              <stop offset="40%" stopColor="#6366F1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06040A" stopOpacity="0" />
            </radialGradient>

            {/* Linear strokes for concentric rounded stadium rings */}
            <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#7C3AED" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="ringGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.12" />
              <stop offset="70%" stopColor="#4F46E5" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#A5B4FC" stopOpacity="0.5" />
            </linearGradient>

            <linearGradient id="ringGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#4338CA" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0F0D24" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Base Ambient Canvas */}
          <rect width="1200" height="630" fill="url(#bgGlow)" />
          <rect width="1200" height="630" fill="url(#coreAura)" />

          {/* Concentric Layered Curved Horizons radiating toward bottom right */}
          {/* Outer Ring 5 */}
          <rect
            x="20"
            y="-180"
            width="1400"
            height="950"
            rx="475"
            fill="none"
            stroke="rgba(139, 92, 246, 0.07)"
            strokeWidth="1.5"
          />

          {/* Outer Ring 4 */}
          <rect
            x="180"
            y="-80"
            width="1200"
            height="850"
            rx="425"
            fill="none"
            stroke="url(#ringGrad3)"
            strokeWidth="2"
          />

          {/* Middle Ring 3 */}
          <rect
            x="340"
            y="20"
            width="1000"
            height="750"
            rx="375"
            fill="rgba(124, 58, 237, 0.04)"
            stroke="url(#ringGrad2)"
            strokeWidth="2.5"
          />

          {/* Inner Ring 2 */}
          <rect
            x="500"
            y="120"
            width="800"
            height="650"
            rx="325"
            fill="rgba(139, 92, 246, 0.07)"
            stroke="url(#ringGrad1)"
            strokeWidth="3"
          />

          {/* Core Focus Ring 1 */}
          <rect
            x="660"
            y="220"
            width="620"
            height="550"
            rx="275"
            fill="rgba(167, 139, 250, 0.1)"
            stroke="rgba(196, 181, 253, 0.7)"
            strokeWidth="3.5"
          />

          {/* Innermost Horizon Fill */}
          <rect
            x="780"
            y="320"
            width="480"
            height="450"
            rx="225"
            fill="rgba(147, 51, 234, 0.16)"
            stroke="rgba(233, 213, 255, 0.85)"
            strokeWidth="2"
          />

          {/* Scattered Subtle 4-Point Sparkling Stars (Inspired by Reference 2 & 3) */}
          {/* Star 1 - Top Left */}
          <g transform="translate(180, 140)" opacity="0.65">
            <path d="M0,-12 Q0,0 12,0 Q0,0 0,12 Q0,0 -12,0 Q0,0 0,-12 Z" fill="#ffffff" />
          </g>

          {/* Star 2 - Top Center */}
          <g transform="translate(540, 95)" opacity="0.8">
            <path d="M0,-16 Q0,0 16,0 Q0,0 0,16 Q0,0 -16,0 Q0,0 0,-16 Z" fill="#ffffff" />
          </g>

          {/* Star 3 - Mid Left */}
          <g transform="translate(110, 360)" opacity="0.4">
            <path d="M0,-8 Q0,0 8,0 Q0,0 0,8 Q0,0 -8,0 Q0,0 0,-8 Z" fill="#ffffff" />
          </g>

          {/* Star 4 - Mid Center Upper */}
          <g transform="translate(420, 290)" opacity="0.55">
            <path d="M0,-10 Q0,0 10,0 Q0,0 0,10 Q0,0 -10,0 Q0,0 0,-10 Z" fill="#ffffff" />
          </g>

          {/* Star 5 - Top Right */}
          <g transform="translate(980, 110)" opacity="0.85">
            <path d="M0,-18 Q0,0 18,0 Q0,0 0,18 Q0,0 -18,0 Q0,0 0,-18 Z" fill="#ffffff" />
          </g>

          {/* Star 6 - Center Right */}
          <g transform="translate(820, 210)" opacity="0.7">
            <path d="M0,-11 Q0,0 11,0 Q0,0 0,11 Q0,0 -11,0 Q0,0 0,-11 Z" fill="#ffffff" />
          </g>

          {/* Small micro star dust points */}
          <circle cx="280" cy="220" r="1.5" fill="#ffffff" opacity="0.4" />
          <circle cx="340" cy="460" r="1.8" fill="#ffffff" opacity="0.5" />
          <circle cx="680" cy="150" r="2" fill="#ffffff" opacity="0.6" />
          <circle cx="890" cy="80" r="1.5" fill="#ffffff" opacity="0.45" />
          <circle cx="1060" cy="260" r="2" fill="#ffffff" opacity="0.55" />
          <circle cx="220" cy="510" r="1.2" fill="#ffffff" opacity="0.35" />
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
          {/* Logo Mark Icon Container */}
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '18px',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                '0 0 40px rgba(167, 139, 250, 0.6), 0 0 80px rgba(124, 58, 237, 0.35), 0 12px 24px rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
            }}
          >
            {/* SignSea Anchor Mark */}
            <svg
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#070510"
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
                textShadow: '0 4px 24px rgba(0, 0, 0, 0.8)',
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
