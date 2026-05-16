'use client'

export default function GlobalError() {
  return (
    <html>
      <body>
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong!</h2>
          <p>An unexpected error occurred. Please try refreshing the page.</p>
        </div>
      </body>
    </html>
  )
}
