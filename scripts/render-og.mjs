import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const puppeteer = require('/Users/user/signsea-backend/node_modules/puppeteer')
import { writeFileSync, copyFileSync } from 'fs'
import { join } from 'path'

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Space+Grotesk:wght@500;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background-color: #06040A;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
      display: flex;
    }

    /* Cosmic Radial Glow Background */
    .bg-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    /* Ambient Bottom-Right Glow Aura */
    .glow-aura {
      position: absolute;
      bottom: -150px;
      right: -100px;
      width: 750px;
      height: 650px;
      background: radial-gradient(circle at 65% 65%, rgba(139, 92, 246, 0.45) 0%, rgba(99, 102, 241, 0.22) 35%, rgba(67, 24, 153, 0.1) 60%, transparent 80%);
      filter: blur(40px);
      pointer-events: none;
    }

    .deep-ambient {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 88% 85%, #250E52 0%, #150833 30%, #0C051D 60%, #06040A 100%);
    }

    /* Logo Lockup in Bottom Right */
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
        0 0 50px rgba(167, 139, 250, 0.65),
        0 0 100px rgba(124, 58, 237, 0.4),
        0 16px 32px rgba(0, 0, 0, 0.6);
      border: 1.5px solid rgba(255, 255, 255, 0.9);
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
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.9);
    }
  </style>
</head>
<body>
  <div class="deep-ambient"></div>
  <div class="glow-aura"></div>

  <!-- Concentric Layered Stadium / Rounded Contour Curves -->
  <svg class="bg-canvas" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="curveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.15" />
        <stop offset="60%" stop-color="#8B5CF6" stop-opacity="0.45" />
        <stop offset="100%" stop-color="#DDD6FE" stop-opacity="0.8" />
      </linearGradient>

      <linearGradient id="curveGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#818CF8" stop-opacity="0.1" />
        <stop offset="60%" stop-color="#6366F1" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#C7D2FE" stop-opacity="0.6" />
      </linearGradient>

      <linearGradient id="curveGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6366F1" stop-opacity="0.05" />
        <stop offset="100%" stop-color="#4F46E5" stop-opacity="0.2" />
      </linearGradient>

      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Outer Arc 5 -->
    <rect x="-40" y="-220" width="1500" height="1050" rx="525"
          fill="none" stroke="rgba(139, 92, 246, 0.08)" stroke-width="1.5" />

    <!-- Outer Arc 4 -->
    <rect x="140" y="-120" width="1300" height="950" rx="475"
          fill="rgba(124, 58, 237, 0.02)" stroke="url(#curveGrad3)" stroke-width="2" />

    <!-- Middle Arc 3 -->
    <rect x="320" y="-20" width="1100" height="850" rx="425"
          fill="rgba(139, 92, 246, 0.04)" stroke="url(#curveGrad2)" stroke-width="2.5" />

    <!-- Inner Arc 2 -->
    <rect x="500" y="80" width="900" height="750" rx="375"
          fill="rgba(124, 58, 237, 0.07)" stroke="url(#curveGrad1)" stroke-width="3" filter="url(#softGlow)" />

    <!-- Core Arc 1 -->
    <rect x="680" y="190" width="700" height="630" rx="315"
          fill="rgba(147, 51, 234, 0.12)" stroke="rgba(216, 180, 254, 0.75)" stroke-width="3.5" />

    <!-- Innermost Focal Bed -->
    <rect x="820" y="300" width="520" height="480" rx="240"
          fill="rgba(168, 85, 247, 0.2)" stroke="rgba(243, 232, 255, 0.9)" stroke-width="2" />

    <!-- Subtle 4-Point Sparkling Star Accents (Precision Vectors) -->
    <!-- Star 1 (Top Left) -->
    <g transform="translate(180, 140)" opacity="0.75">
      <path d="M0,-14 Q0,0 14,0 Q0,0 0,14 Q0,0 -14,0 Q0,0 0,-14 Z" fill="#FFFFFF" />
      <circle cx="0" cy="0" r="3" fill="#FFFFFF" filter="url(#softGlow)" />
    </g>

    <!-- Star 2 (Top Center) -->
    <g transform="translate(560, 95)" opacity="0.85">
      <path d="M0,-18 Q0,0 18,0 Q0,0 0,18 Q0,0 -18,0 Q0,0 0,-18 Z" fill="#FFFFFF" />
      <circle cx="0" cy="0" r="4" fill="#FFFFFF" filter="url(#softGlow)" />
    </g>

    <!-- Star 3 (Mid Left) -->
    <g transform="translate(120, 380)" opacity="0.45">
      <path d="M0,-9 Q0,0 9,0 Q0,0 0,9 Q0,0 -9,0 Q0,0 0,-9 Z" fill="#FFFFFF" />
    </g>

    <!-- Star 4 (Upper Right) -->
    <g transform="translate(1020, 110)" opacity="0.9">
      <path d="M0,-20 Q0,0 20,0 Q0,0 0,20 Q0,0 -20,0 Q0,0 0,-20 Z" fill="#FFFFFF" />
      <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" filter="url(#softGlow)" />
    </g>

    <!-- Star 5 (Right Center) -->
    <g transform="translate(850, 210)" opacity="0.7">
      <path d="M0,-12 Q0,0 12,0 Q0,0 0,12 Q0,0 -12,0 Q0,0 0,-12 Z" fill="#FFFFFF" />
    </g>

    <!-- Delicate Micro Celestial Points -->
    <circle cx="300" cy="230" r="1.8" fill="#FFFFFF" opacity="0.45" />
    <circle cx="440" cy="480" r="2" fill="#FFFFFF" opacity="0.55" />
    <circle cx="710" cy="140" r="2.2" fill="#FFFFFF" opacity="0.6" />
    <circle cx="920" cy="70" r="1.6" fill="#FFFFFF" opacity="0.5" />
    <circle cx="1090" cy="270" r="2" fill="#FFFFFF" opacity="0.6" />
    <circle cx="230" cy="520" r="1.4" fill="#FFFFFF" opacity="0.35" />
  </svg>

  <!-- Bottom Right Branding -->
  <div class="branding-corner">
    <div class="logo-container">
      <svg class="logo-svg" viewBox="0 0 24 24" fill="none" stroke="#06040A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
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
  console.log('Rendering high-res OG Image (1200x630)...')
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

  console.log('✓ Successfully rendered and saved OG images to:')
  console.log('  -', publicOg)
  console.log('  -', publicOpengraph)
  console.log('  -', publicTwitter)
  console.log('  -', artifactPreview)
}

run().catch((err) => {
  console.error('Render error:', err)
  process.exit(1)
})
