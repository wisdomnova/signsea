import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const puppeteer = require('/Users/user/signsea-backend/node_modules/puppeteer')
import { writeFileSync } from 'fs'

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background-color: #020712;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
      display: flex;
    }

    /* Deep Ocean Background */
    .deep-ocean {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 88% 86%, #034574 0%, #032B4F 30%, #021830 58%, #010A17 85%, #01060E 100%);
    }

    /* Bioluminescent Ocean Glow Aura */
    .ocean-glow {
      position: absolute;
      bottom: -160px;
      right: -120px;
      width: 800px;
      height: 700px;
      background: radial-gradient(circle at 65% 65%, rgba(14, 165, 233, 0.45) 0%, rgba(6, 182, 212, 0.25) 30%, rgba(3, 105, 161, 0.12) 55%, transparent 75%);
      filter: blur(45px);
      pointer-events: none;
    }

    /* Canvas for SVG waves */
    .bg-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    /* Bottom Right Branding */
    .branding-corner {
      position: absolute;
      bottom: 72px;
      right: 84px;
      display: flex;
      align-items: center;
      gap: 22px;
      z-index: 50;
    }

    .logo-container {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 
        0 0 50px rgba(56, 189, 248, 0.7),
        0 0 100px rgba(14, 165, 233, 0.45),
        0 16px 32px rgba(1, 10, 23, 0.8);
      border: 1.5px solid rgba(255, 255, 255, 0.95);
    }

    .logo-svg {
      width: 42px;
      height: 42px;
    }

    .brand-title {
      font-size: 56px;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #FFFFFF;
      line-height: 1;
      text-shadow: 0 4px 24px rgba(1, 10, 23, 0.95);
    }
  </style>
</head>
<body>
  <div class="deep-ocean"></div>
  <div class="ocean-glow"></div>

  <!-- Pure Oceanic Wave Horizons & Ripple Contours (No Stars / No Sparkles) -->
  <svg class="bg-canvas" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#BAE6FD" stop-opacity="0.15" />
        <stop offset="60%" stop-color="#38BDF8" stop-opacity="0.5" />
        <stop offset="100%" stop-color="#E0F2FE" stop-opacity="0.85" />
      </linearGradient>

      <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.1" />
        <stop offset="60%" stop-color="#0284C7" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#7DD3FC" stop-opacity="0.65" />
      </linearGradient>

      <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0284C7" stop-opacity="0.05" />
        <stop offset="100%" stop-color="#0369A1" stop-opacity="0.25" />
      </linearGradient>

      <filter id="oceanGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Outer Deep Sea Ripple 5 -->
    <rect x="-40" y="-220" width="1500" height="1050" rx="525"
          fill="none" stroke="rgba(14, 165, 233, 0.08)" stroke-width="1.5" />

    <!-- Oceanic Swell Ripple 4 -->
    <rect x="140" y="-120" width="1300" height="950" rx="475"
          fill="rgba(2, 132, 199, 0.02)" stroke="url(#waveGrad3)" stroke-width="2" />

    <!-- Current Wave Contour 3 -->
    <rect x="320" y="-20" width="1100" height="850" rx="425"
          fill="rgba(14, 165, 233, 0.04)" stroke="url(#waveGrad2)" stroke-width="2.5" />

    <!-- Tidal Wave Contour 2 -->
    <rect x="500" y="80" width="900" height="750" rx="375"
          fill="rgba(6, 182, 212, 0.07)" stroke="url(#waveGrad1)" stroke-width="3" filter="url(#oceanGlowFilter)" />

    <!-- Core Aqua Horizon 1 -->
    <rect x="680" y="190" width="700" height="630" rx="315"
          fill="rgba(2, 132, 199, 0.14)" stroke="rgba(186, 230, 253, 0.8)" stroke-width="3.5" />

    <!-- Innermost Ocean Focal Pool -->
    <rect x="820" y="300" width="520" height="480" rx="240"
          fill="rgba(14, 165, 233, 0.22)" stroke="rgba(240, 249, 255, 0.95)" stroke-width="2" />
  </svg>

  <!-- Bottom Right Branding -->
  <div class="branding-corner">
    <div class="logo-container">
      <svg class="logo-svg" viewBox="0 0 24 24" fill="none" stroke="#020B14" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 9v12" />
        <path d="M4 13a8 8 0 0 0 16 0" />
        <path d="M19 13h2" />
        <path d="M3 13h2" />
        <circle cx="12" cy="6" r="3" />
      </svg>
    </div>
    <div class="brand-title">SignSea</div>
  </div>
</body>
</html>
`

async function run() {
  console.log('Rendering pure Oceanic OG Image without stars/sparkles (1200x630)...')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 })
  await page.setContent(html, { waitUntil: 'networkidle0' })
  
  const buffer = await page.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  })
  await browser.close()

  const publicOg = '/Users/user/signsea/public/og.png'
  const publicOpengraph = '/Users/user/signsea/public/opengraph-image.png'
  const publicTwitter = '/Users/user/signsea/public/twitter-image.png'
  const artifactPreview = '/Users/user/.gemini/antigravity-ide/brain/15a964cf-f5c9-4bd9-82c4-ae921b2056eb/og_preview.png'

  writeFileSync(publicOg, buffer)
  writeFileSync(publicOpengraph, buffer)
  writeFileSync(publicTwitter, buffer)
  writeFileSync(artifactPreview, buffer)

  console.log('✓ Successfully rendered clean Oceanic OG image to:')
  console.log('  -', publicOg)
  console.log('  -', publicOpengraph)
  console.log('  -', publicTwitter)
  console.log('  -', artifactPreview)
}

run().catch((err) => {
  console.error('Render error:', err)
  process.exit(1)
})
