'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'

const SKILL_LISTS = [
  ['React', 'Angular', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'WordPress'],
  ['Node.js', 'Python', 'PHP', 'Django', 'Flask', 'REST APIs', 'GraphQL'],
  ['SQL', 'PostgreSQL', 'MongoDB', 'Salesforce CRM'],
  ['AWS', 'AWS Solutions Architect', 'Git', 'GitHub', 'CI/CD'],
  ['AI Prompt Engineering', 'LLM Integration', 'Pandas', 'NumPy', 'Automation'],
  ['Figma', 'Adobe Creative Suite', 'UI/UX Design', 'SEO', 'Branding'],
]

const CERTS = [
  'AWS Certified Solutions Architect - Associate',
  'Certified Salesforce Administrator',
  'Full-Stack Web Development Bootcamp Certification',
]

const sH = {
  margin: '0 0 10px',
  fontSize: 12,
  fontWeight: 700,
  color: '#0891b2',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  paddingBottom: 6,
  borderBottom: '1px solid #e2e8f0',
}

export default function ResumePage() {
  const { lang, setLang, t } = useLang()
  const r = t.resume

  useEffect(() => {
    fetch('/api/resume/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'view' }),
    }).catch(() => {})
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Arial, sans-serif' }}>

      {/* Action bar - hidden on print */}
      <div
        className="print:hidden"
        style={{
          maxWidth: 880,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <Link
          href="/"
          style={{ color: '#0891b2', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}
        >
          &larr; {r.backBtn}
        </Link>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              border: '1px solid #e2e8f0',
              background: 'white',
              color: '#374151',
            }}
            aria-label="Select language"
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="es">ES</option>
            <option value="ru">RU</option>
            <option value="sw">SW</option>
          </select>
          <button
            onClick={() => window.print()}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              background: '#0891b2',
              color: 'white',
            }}
          >
            {r.printBtn}
          </button>
        </div>
      </div>

      {/* Resume paper */}
      <div
        style={{
          maxWidth: 880,
          margin: '0 auto 48px',
          background: 'white',
          padding: '48px 56px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '3px solid #0891b2' }}>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Papy Kabukanyi
          </h1>
          <p style={{ margin: '6px 0 14px', fontSize: 14, fontWeight: 600, color: '#0891b2' }}>
            {t.footer.role}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', fontSize: 13, color: '#475569' }}>
            <span>Papykabukanyi@gmail.com</span>
            <span>&middot;</span>
            <span>737.710.6090</span>
            <span>&middot;</span>
            <span>Austin, TX</span>
            <span>&middot;</span>
            <span>github.com/papykabukanyi</span>
          </div>
        </div>

        {/* Summary */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={sH}>{r.summaryLabel}</h2>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.75, color: '#374151' }}>{r.summary}</p>
        </section>

        {/* Experience */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={sH}>{r.experienceLabel}</h2>
          {t.experience.jobs.map((job, i) => (
            <div key={i} style={{ marginBottom: i < t.experience.jobs.length - 1 ? 20 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{job.role}</span>
                  <span style={{ color: '#0891b2', fontSize: 13, fontWeight: 600, marginLeft: 8 }}>{job.company}</span>
                </div>
                <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace', whiteSpace: 'nowrap', paddingTop: 2 }}>
                  {job.period}
                </span>
              </div>
              <ul style={{ margin: '4px 0 0 14px', padding: 0, fontSize: 13, color: '#374151', lineHeight: 1.65 }}>
                {job.bullets.map((b, j) => (
                  <li key={j} style={{ marginBottom: 2 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={sH}>{r.skillsLabel}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 32px' }}>
            {SKILL_LISTS.map((skills, i) => (
              <p key={i} style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                <strong style={{ color: '#0f172a' }}>{t.skills.categories[i]}:</strong> {skills.join(', ')}
              </p>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section>
          <h2 style={sH}>{r.certificationsLabel}</h2>
          <ul style={{ margin: '0 0 0 14px', padding: 0, fontSize: 13, color: '#374151', lineHeight: 1.8 }}>
            {CERTS.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      </div>

      <style>{`
        @media print {
          body { background: white; margin: 0; }
        }
      `}</style>
    </div>
  )
}
