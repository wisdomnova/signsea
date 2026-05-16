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
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          gap: '20px',
          color: 'black',
        }}
      >
        {/* Logo - Simple anchor with border */}
        <div
          style={{
            width: '100px',
            height: '100px',
            border: '3px solid black',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',
            fontSize: '50px',
            fontWeight: 'bold',
          }}
        >
          ⚓
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            margin: '0',
            textAlign: 'center',
            maxWidth: '95%',
            lineHeight: '1.1',
            color: 'black',
            letterSpacing: '-0.02em',
          }}
        >
          Industrial Payment Infrastructure
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontSize: '36px',
            color: '#666666',
            margin: '0',
            textAlign: 'center',
            maxWidth: '90%',
            fontWeight: '500',
            lineHeight: '1.4',
          }}
        >
          Secure transactions with verifiable milestones
        </p>

        {/* Domain footer */}
        <div
          style={{
            marginTop: '50px',
            fontSize: '28px',
            color: '#999999',
            letterSpacing: '0.03em',
            fontWeight: '600',
          }}
        >
          signsea.org
        </div>
      </div>
    ),
    size
  )
}
