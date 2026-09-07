'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('SignSea Global Fatal Error:', error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#000000' }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '540px', width: '100%', backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', padding: '36px', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontFamily: 'monospace', fontSize: '12px', color: '#dc2626' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#dc2626', display: 'inline-block' }} />
              <span>SIGNSEA_FATAL_EXCEPTION</span>
            </div>
            
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.03em' }}>
              Critical Execution Failure
            </h1>
            
            <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              The application encountered a fatal unrecoverable exception. Ledger integrity has been locked.
            </p>

            {error?.digest && (
              <div style={{ backgroundColor: '#f5f5f5', border: '1px solid #e5e5e5', padding: '10px 14px', fontFamily: 'monospace', fontSize: '12px', color: '#444444', marginBottom: '24px' }}>
                DIGEST: {error.digest}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => reset()}
                style={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reload Application
              </button>

              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  backgroundColor: '#f5f5f5',
                  color: '#000000',
                  border: '1px solid #e5e5e5',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
