import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Papy Kabukanyi — Web Developer & AI Prompt Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #050508 0%, #0d0d1a 50%, #1a0a2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Accent blob */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
          }}
        />
        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.35)',
            borderRadius: 40,
            padding: '8px 24px',
            marginBottom: 32,
          }}
        >
          <span style={{ color: '#818cf8', fontSize: 18, fontWeight: 600 }}>
            Available for hire
          </span>
        </div>
        {/* Name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#f8fafc',
            lineHeight: 1.1,
            marginBottom: 16,
            letterSpacing: '-2px',
          }}
        >
          Papy Kabukanyi
        </div>
        {/* Title */}
        <div
          style={{
            fontSize: 34,
            fontWeight: 400,
            background: 'linear-gradient(90deg, #818cf8, #c084fc)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 48,
          }}
        >
          Web Developer &amp; AI Prompt Engineer
        </div>
        {/* Tags */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {['React', 'Next.js', 'Node.js', 'Python', 'AWS', 'LLMs'].map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8,
                padding: '10px 22px',
                color: '#cbd5e1',
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 80,
            color: 'rgba(148,163,184,0.6)',
            fontSize: 20,
          }}
        >
          papykabukanyi.up.railway.app
        </div>
      </div>
    ),
    { ...size }
  )
}
