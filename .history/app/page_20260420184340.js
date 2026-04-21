'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/lib/LangContext'

// ── Data ───────────────────────────────────────────────────────────────────────
const SERVICES = [
  { num: '01', title: 'Residential Demo', desc: 'Full house teardowns, partial demo, and structure removal for homes of any size.', tags: ['House Teardown', 'Partial Demo', 'Foundation'] },
  { num: '02', title: 'Commercial Demo', desc: 'Safe, code-compliant demolition for retail, offices, warehouses, and industrial sites.', tags: ['Retail', 'Office', 'Warehouse'] },
  { num: '03', title: 'Interior Demo', desc: 'Selective interior removal — walls, ceilings, flooring, and fixtures without structural damage.', tags: ['Walls', 'Ceilings', 'Flooring'] },
  { num: '04', title: 'Site Clearing & Grading', desc: 'Full land clearing, grubbing, and grading to prep your site before new construction.', tags: ['Land Clearing', 'Grading', 'Vegetation'] },
  { num: '05', title: 'Concrete Breaking', desc: 'Driveways, slabs, sidewalks, patios, and foundations broken up and hauled away.', tags: ['Driveway', 'Slab', 'Patio'] },
  { num: '06', title: 'Debris Removal', desc: 'Full-service cleanup and hauling. We leave your site clean and ready for the next phase.', tags: ['Junk Removal', 'Haul Away', 'Site Cleanup'] },
]

const STATS = [
  { value: '500+', label: 'Projects Done' },
  { value: '15+', label: 'Years Experience' },
  { value: '1,000mi', label: 'Service Radius' },
  { value: '100%', label: 'Licensed & Insured' },
]

const STATES = ['TX', 'OK', 'LA', 'AR', 'NM', 'AZ', 'CO', 'KS', 'MO', 'TN', 'MS', 'AL', 'FL', 'GA', 'NE']

const CITIES = [
  'Austin', 'Dallas', 'Houston', 'San Antonio', 'Fort Worth',
  'Oklahoma City', 'Tulsa', 'Shreveport', 'New Orleans', 'Albuquerque',
  'Phoenix', 'Denver', 'Atlanta', 'Nashville', 'Memphis',
  'Waco', 'Round Rock', 'Cedar Park', 'Kyle', 'Temple',
  'Corpus Christi', 'Lubbock', 'Amarillo', 'El Paso', 'Midland',
  'College Station', 'Tyler', 'Beaumont', 'Wichita Falls', 'Laredo',
]

const STEPS = [
  {
    id: 'services', question: 'What type of work do you need?',
    subtitle: 'Select all that apply.',
    type: 'multi',
    options: [
      { label: 'Demolition', icon: '💥', desc: 'Tear down or remove structures' },
      { label: 'Construction / Renovation', icon: '🏗️', desc: 'Build new or renovate' },
      { label: 'Site Clearing', icon: '🌿', desc: 'Clear land for development' },
      { label: 'Concrete Work', icon: '⛏️', desc: 'Break up slabs, driveways' },
      { label: 'Debris Removal', icon: '🚛', desc: 'Haul away waste and materials' },
    ],
  },
  {
    id: 'scope', question: 'Residential or commercial?',
    subtitle: 'Helps us send the right crew and equipment.',
    type: 'single',
    options: [
      { label: 'Residential', icon: '🏠', desc: 'Home or private property' },
      { label: 'Commercial', icon: '🏢', desc: 'Business, office, or industrial' },
      { label: 'Mixed-Use', icon: '🏙️', desc: 'Both residential and commercial' },
    ],
  },
  {
    id: 'size', question: 'How large is the project?',
    subtitle: 'A rough estimate is fine.',
    type: 'single',
    options: [
      { label: 'Small', icon: '📦', desc: 'Single room or minor job' },
      { label: 'Medium', icon: '🏡', desc: 'Full floor or partial structure' },
      { label: 'Large', icon: '🏗️', desc: 'Full building or multi-unit' },
      { label: 'Very Large / Industrial', icon: '🏭', desc: 'Complex or large acreage' },
    ],
  },
  {
    id: 'timeline', question: 'When do you need it done?',
    subtitle: 'We work fast — tell us your urgency.',
    type: 'single',
    options: [
      { label: 'ASAP — This Week', icon: '🚨', desc: 'Need it started right away' },
      { label: 'Within a Month', icon: '📅', desc: 'Planning the near future' },
      { label: '1–3 Months', icon: '🗓️', desc: 'Still in planning phase' },
      { label: 'Just Exploring', icon: '💭', desc: 'Getting prices and options' },
    ],
  },
  {
    id: 'budget', question: "What's your estimated budget?",
    subtitle: 'Helps us tailor the right solution.',
    type: 'single',
    options: [
      { label: 'Under $5,000', icon: '💵', desc: 'Small or targeted projects' },
      { label: '$5,000 – $20,000', icon: '💰', desc: 'Mid-size demo or clearing' },
      { label: '$20,000 – $75,000', icon: '💎', desc: 'Large-scale demolition' },
      { label: '$75,000+', icon: '🏦', desc: 'Major commercial or industrial' },
      { label: 'Not Sure Yet', icon: '🤷', desc: 'Need a quote first' },
    ],
  },
  {
    id: 'contact', question: 'How should we reach you?',
    subtitle: 'We respond within 1 hour — your choice of email or callback.',
    type: 'contact',
  },
]

const BLANK = {
  services: [], scope: '', size: '', timeline: '', budget: '',
  name: '', email: '', contactMethod: '', callbackNumber: '', city: '', notes: '',
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function ConstructionPage() {
  const { lang, setLang, t } = useLang()
  const c = t?.construction || {}
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')
  const [navScrolled, setNavScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const cur = STEPS[step]
  const pct = Math.round(((step + 1) / STEPS.length) * 100)

  function toggleMulti(val) {
    setForm(f => ({
      ...f,
      services: f.services.includes(val) ? f.services.filter(x => x !== val) : [...f.services, val],
    }))
  }

  function pickSingle(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    setTimeout(() => setStep(s => s + 1), 180)
  }

  function canNext() {
    if (cur.type === 'multi') return form.services.length > 0
    if (cur.type === 'single') return !!form[cur.id]
    if (cur.type === 'contact') {
      if (!form.name || !form.email || !form.contactMethod) return false
      if (form.contactMethod === 'callback' && !form.callbackNumber) return false
      return true
    }
    return true
  }

  function openForm() { setOpen(true); setStep(0); setForm(BLANK); setDone(false); setErr('') }

  async function submit(e) {
    e.preventDefault()
    if (!canNext()) return
    setSaving(true); setErr('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Submission failed')
      setDone(true)
    } catch (ex) { setErr(ex.message) }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ── NAV */}
      {/* seo: business name anchor for crawlers */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity" aria-label="PAPY Constructions &amp; Demolitions — Home">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-black text-xs">P</span>
            </div>
            <div>
              <p className={`font-black text-[11px] leading-none transition-colors ${navScrolled ? 'text-gray-900' : 'text-white'}`}>PAPY Constructions &amp; Demolitions</p>
              <p className="text-[10px] text-gray-400 tracking-widest uppercase">Austin, TX</p>
            </div>
          </a>
          <div className="hidden sm:flex items-center gap-5">
            <button onClick={e => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }) }} className={`text-sm font-medium transition-colors hover:text-orange-500 ${navScrolled ? 'text-gray-600' : 'text-gray-200'}`}>{c.nav?.services || 'Services'}</button>
            <button onClick={e => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) }} className={`text-sm font-medium transition-colors hover:text-orange-500 ${navScrolled ? 'text-gray-600' : 'text-gray-200'}`}>{c.nav?.about || 'About'}</button>
            <button onClick={e => { e.preventDefault(); document.getElementById('areas')?.scrollIntoView({ behavior: 'smooth' }) }} className={`text-sm font-medium transition-colors hover:text-orange-500 ${navScrolled ? 'text-gray-600' : 'text-gray-200'}`}>{c.nav?.areas || 'Areas'}</button>
            <div className="relative">
              <button
                onClick={() => setLangOpen(o => !o)}
                aria-label="Select language"
                className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm font-bold border border-white/15 rounded-lg px-3 py-1.5 bg-gray-900/80 transition-colors">
                {lang.toUpperCase()} <span className="text-[10px] opacity-60">▼</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 min-w-[80px]">
                  {['en', 'fr', 'es', 'ru', 'sw'].map(l => (
                    <button key={l} onClick={() => { setLang(l); setLangOpen(false) }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-bold transition-colors hover:bg-white/5 ${
                        lang === l ? 'text-orange-400 bg-white/[0.03]' : 'text-gray-300'
                      }`}>
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button onClick={openForm}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all hover:scale-105 shadow-lg shadow-orange-500/25">
            {c.nav?.estimate || 'Free Estimate'}
          </button>
        </div>
      </nav>

      {/* ── HERO */}
      <section aria-label="Papy Constructions &amp; Demolitions — Austin TX Licensed Contractor" className="relative bg-gray-950 text-white overflow-hidden min-h-[100svh] flex flex-col justify-center">
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'repeating-linear-gradient(-45deg,#f97316 0,#f97316 1px,transparent 0,transparent 50%)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-1/3 right-0 w-[480px] h-[480px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-52 sm:pb-60">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/25 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            <span className="text-orange-300 text-xs font-bold tracking-widest uppercase">
              {c.hero?.badge || 'Licensed & Insured · Austin, TX'}
            </span>
          </div>
          <h1 className="text-[clamp(3rem,11vw,7.5rem)] font-black leading-[0.88] tracking-tighter mb-8">
            <span className="block">DEMOLITION.</span>
            <span className="block">CONSTRUCTION.</span>
            <span className="block text-orange-500">DONE RIGHT.</span>
          </h1>
          {/* seo: hidden but crawlable subtitle with primary keyword */}
          <p className="sr-only">Papy Constructions &amp; Demolitions — Licensed demolition contractor in Austin TX. Residential &amp; commercial demolition, site clearing, concrete breaking, debris removal. Serving Texas and surrounding states within 1,000 miles. Free estimates.</p>
          <p className="text-gray-400 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
            {c.hero?.sub || <span>Austin&#39;s trusted contractor — residential &amp; commercial demo, site clearing, concrete work, and hauling. <strong className="text-white">Serving Texas and cities up to 1,000 miles away.</strong></span>}
          </p>
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 items-start xs:items-center mb-14">
            <button onClick={openForm}
              className="w-full xs:w-auto bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-xl shadow-orange-500/30">
              {c.hero?.cta || 'GET FREE ESTIMATE'} →
            </button>
            <div className="flex items-center gap-2 text-orange-300 text-sm font-semibold">
              <span>⏱</span>
              <span>{c.hero?.response || 'We respond within 1 hour'}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-2xl sm:text-3xl font-black text-orange-400">{s.value}</p>
                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES */}
      <section id="services" aria-label="Demolition and Construction Services" className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-orange-500 text-xs font-black tracking-widest uppercase mb-2">{c.services?.label || 'What We Do'}</p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
              {c.services?.heading || <span>FULL-SERVICE CONTRACTOR</span>}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(sv => (
              <button key={sv.num} onClick={openForm}
                className="group w-full h-full flex flex-col text-left bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-400 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 active:scale-[0.99]">
                <p className="text-orange-500 font-black text-sm tracking-widest mb-3">{sv.num}</p>
                <h3 className="text-gray-900 font-black text-lg mb-2 group-hover:text-orange-600 transition-colors">{sv.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{sv.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {sv.tags.map(tag => (
                    <span key={tag} className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US */}
      <section id="about" aria-label="Why Choose Papy Constructions &amp; Demolitions" className="py-20 px-4 sm:px-6 bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-orange-500 text-xs font-black tracking-widest uppercase mb-3">{c.about?.label || 'Why Choose Us'}</p>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
                {c.about?.heading || <span>WE SHOW UP.<br />WE WORK HARD.<br />WE CLEAN UP.</span>}
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                {c.about?.p1 || 'Papy Constructions & Demolitions has served Greater Austin for 15+ years. Fully licensed and insured. No surprise invoices. No mess left behind.'}
              </p>
              <ul className="space-y-3 mb-10">
                {(c.about?.checklist || [
                  'Fully licensed & insured in Texas',
                  'Free same-day estimates on most projects',
                  'Transparent pricing — no hidden fees',
                  'Equipment for jobs of any size',
                  'Eco-conscious debris disposal & recycling',
                  'Bilingual crew — English & Spanish',
                  'We beat any written competitor quote',
                ]).map(l => (
                  <li key={l} className="flex items-center gap-3 text-gray-300 text-sm">
                    <span className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-black">✓</span>
                    {l}
                  </li>
                ))}
              </ul>
              <button onClick={openForm}
                className="bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105">
                {c.about?.cta || 'Request a Free Quote'} →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(c.about?.badges || [
                { e: '🏅', l: 'Licensed & Insured', s: 'Texas certified' },
                { e: '⚡', l: 'Fast Turnaround', s: 'Most jobs done in days' },
                { e: '⏱', l: '1hr Response', s: 'Submit — hear back fast' },
                { e: '♻️', l: 'Green Disposal', s: 'We recycle & divert waste' },
                { e: '🔒', l: 'OSHA Compliant', s: 'Safe practices, always' },
                { e: '💰', l: 'Best Price', s: 'We beat any written quote' },
              ]).map((item, i) => (
                <div key={i} className="bg-gray-900 border border-white/5 rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">{item.e || ['🏅','⚡','⏱','♻️','🔒','💰'][i]}</div>
                  <p className="text-white font-bold text-sm">{item.l || item}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{item.s || ''}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROMISE STRIP */}
      <section className="bg-orange-500 py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white/70 text-xs font-black tracking-widest uppercase mb-3">{c.cta?.label || 'Our Promise'}</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{c.cta?.heading || 'We respond within 1 hour.'}</h2>
          <p className="text-orange-100 text-lg mb-8">
            {c.cta?.sub || 'Submit the form — we\'ll email or call you back, your choice. No pressure, no spam.'}
          </p>
          <button onClick={openForm}
            className="bg-white text-orange-600 font-black px-8 py-4 rounded-2xl text-lg hover:bg-orange-50 transition-colors">
            {c.cta?.btn || 'GET FREE ESTIMATE'} →
          </button>
        </div>
      </section>

      {/* ── AREAS */}
      <section id="areas" aria-label="Service Areas — Texas and Surrounding States Within 1,000 Miles" className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-orange-500 text-xs font-black tracking-widest uppercase mb-2">{c.areas?.label || 'Coverage'}</p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">{c.areas?.heading || 'SERVICE AREAS'}</h2>
            <p className="text-gray-500">{c.areas?.sub || 'Based in Austin, TX — serving all of Texas and major cities within 1,000 miles.'}</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-5">
            {STATES.map(s => (
              <span key={s} className="bg-orange-500 text-white font-black text-xs px-3 py-1.5 rounded-full">{s}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {CITIES.map(city => (
              <span key={city}
                className="bg-gray-100 hover:bg-orange-100 hover:text-orange-700 text-gray-600 text-sm px-4 py-1.5 rounded-full transition-colors cursor-default">
                {city}
              </span>
            ))}
            <span className="bg-orange-100 text-orange-600 font-semibold text-sm px-4 py-1.5 rounded-full">
              {c.areas?.more || '+200 more — just ask!'}
            </span>
          </div>
        </div>
      </section>

      {/* ── FOOTER */}
      <footer className="bg-gray-950 text-gray-600 py-10 px-4 sm:px-6 pb-28 sm:pb-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center shrink-0">
              <span className="text-white font-black text-[10px]">P</span>
            </div>
            <span className="font-bold text-gray-400">Papy Constructions &amp; Demolitions</span>
          </div>
          <address className="not-italic text-center sm:text-right">
            <p>Licensed &amp; Insured · Austin, TX · 1,000-Mile Radius</p>
            <p>&copy; {new Date().getFullYear()} Papy Constructions &amp; Demolitions. All rights reserved.</p>
          </address>
        </div>
      </footer>

      {/* ── STICKY MOBILE BAR */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 p-4 safe-bottom">
        <button onClick={openForm}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl text-base transition-colors shadow-lg shadow-orange-500/30">
          {c.hero?.cta || 'Get Free Estimate'} — 1 Hr Response ⏱
        </button>
      </div>

      {/* ── LEAD FORM MODAL */}
      {open && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed z-[70] inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-4 pointer-events-none">
            <div className="pointer-events-auto w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[94svh] sm:max-h-[90vh] overflow-y-auto flex flex-col">
              {/* drag handle mobile */}
              <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>
              {/* header */}
              <div className="px-6 pt-3 pb-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div>
                  <p className="text-orange-500 text-[10px] font-black tracking-widest uppercase mb-0.5">{c.modal?.label || 'Free Estimate'}</p>
                  <p className="text-gray-900 font-black text-base leading-tight">{c.modal?.title || 'PAPY Constructions & Demolitions'}</p>
                </div>
                <button onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors text-base font-bold shrink-0 ml-4">
                  ✕
                </button>
              </div>

              {done ? (
                <div className="px-6 py-14 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-3xl mb-5">🎉</div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{c.modal?.done || "YOU'RE ALL SET!"}</h3>
                  <p className="text-gray-600 mb-1">
                    {c.modal?.thanks || 'Thanks'}, <strong>{form.name}</strong>!
                  </p>
                  <p className="text-gray-500 text-sm mb-8 max-w-xs">
                    {form.contactMethod === 'callback'
                      ? <span>{c.modal?.successCallback ? c.modal.successCallback.replace('{phone}', form.callbackNumber) : <>We&apos;ll call <strong className="text-orange-500">{form.callbackNumber}</strong> within 1 hour.</>}</span>
                      : <span>{c.modal?.successEmail ? c.modal.successEmail.replace('{email}', form.email) : <>We&apos;ll email <strong className="text-orange-500">{form.email}</strong> within 1 hour.</>}</span>
                    }
                  </p>
                  <button onClick={() => setOpen(false)}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-10 py-3 rounded-2xl transition-colors">
                    {c.modal?.close || 'Close'}
                  </button>
                </div>
              ) : (
                <div className="px-6 py-5 overflow-y-auto">
                  {/* progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center text-xs font-semibold mb-2">
                      <span className="text-gray-400">{c.modal?.step || 'Step'} {step + 1} {c.modal?.of || 'of'} {STEPS.length}</span>
                      <span className="text-orange-500">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 mb-1">{cur.question}</h3>
                  <p className="text-gray-400 text-sm mb-5">{cur.subtitle}</p>

                  {/* multi select */}
                  {cur.type === 'multi' && (
                    <div className="space-y-2.5">
                      {cur.options.map(opt => {
                        const sel = form.services.includes(opt.label)
                        return (
                          <button key={opt.label} type="button" onClick={() => toggleMulti(opt.label)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-150 active:scale-[0.98] ${
                              sel ? 'border-orange-400 bg-orange-50' : 'border-gray-100 bg-gray-50 hover:border-orange-200 hover:bg-white'
                            }`}>
                            <span className="text-2xl w-8 text-center shrink-0">{opt.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`font-bold text-sm ${sel ? 'text-gray-900' : 'text-gray-700'}`}>{opt.label}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              sel ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                            }`}>
                              {sel && <span className="text-white text-[10px] font-black">✓</span>}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* single select — auto advance */}
                  {cur.type === 'single' && (
                    <div className="space-y-2.5">
                      {cur.options.map(opt => {
                        const sel = form[cur.id] === opt.label
                        return (
                          <button key={opt.label} type="button" onClick={() => pickSingle(cur.id, opt.label)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-150 active:scale-[0.98] ${
                              sel ? 'border-orange-400 bg-orange-50' : 'border-gray-100 bg-gray-50 hover:border-orange-200 hover:bg-white'
                            }`}>
                            <span className="text-2xl w-8 text-center shrink-0">{opt.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`font-bold text-sm ${sel ? 'text-gray-900' : 'text-gray-700'}`}>{opt.label}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              sel ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                            }`}>
                              {sel && <span className="text-white text-[10px] font-black">✓</span>}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* contact step */}
                  {cur.type === 'contact' && (
                    <form onSubmit={submit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{c.modal?.fullname || 'Full Name'} <span className="text-orange-400">*</span></label>
                          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="John Smith" required autoComplete="name"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 placeholder-gray-300 transition-all" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{c.modal?.emailaddr || 'Email Address'} <span className="text-orange-400">*</span></label>
                          <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            type="email" placeholder="you@email.com" required autoComplete="email"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 placeholder-gray-300 transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">{c.modal?.howrespond || 'How should we respond?'} <span className="text-orange-400">*</span></label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { val: 'email', icon: '📧', label: c.modal?.emailme || 'Email Me' },
                            { val: 'callback', icon: '📞', label: c.modal?.callmeback || 'Call Me Back' },
                          ].map(m => (
                            <button key={m.val} type="button"
                              onClick={() => setForm(f => ({ ...f, contactMethod: m.val, callbackNumber: m.val === 'email' ? '' : f.callbackNumber }))}
                              className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 font-bold text-sm transition-all ${
                                form.contactMethod === m.val
                                  ? 'border-orange-400 bg-orange-50 text-orange-600'
                                  : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-orange-200'
                              }`}>
                              <span className="text-base">{m.icon}</span> {m.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {form.contactMethod === 'callback' && (
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{c.modal?.phone || 'Best Phone Number'} <span className="text-orange-400">*</span></label>
                          <input value={form.callbackNumber} onChange={e => setForm(f => ({ ...f, callbackNumber: e.target.value }))}
                            type="tel" placeholder="(512) 000-0000" required autoComplete="tel"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 placeholder-gray-300 transition-all" />
                        </div>
                      )}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{c.modal?.location || 'Project Location'}</label>
                        <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                          placeholder="Austin TX or 123 Main St, Cedar Park"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 placeholder-gray-300 transition-all" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{c.modal?.details || 'Additional Details'}</label>
                        <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                          rows={3} placeholder="Describe the project, access issues, timeline, etc."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 placeholder-gray-300 resize-none transition-all" />
                      </div>
                      {err && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                          <span className="shrink-0">⚠️</span> {err}
                        </div>
                      )}
                      <button type="submit" disabled={saving || !canNext()}
                        className="relative w-full overflow-hidden group/btn bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-base tracking-widest uppercase transition-all duration-200 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:shadow-none disabled:translate-y-0">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {saving ? (
                            <>
                              <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                              </svg>
                              {c.modal?.sending || 'Sending…'}
                            </>
                          ) : (
                            <>{c.modal?.send || 'Send My Free Estimate'} <span className="group-hover/btn:translate-x-1 transition-transform duration-150 inline-block">→</span></>
                          )}
                        </span>
                        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 rounded-2xl" />
                      </button>
                      <p className="text-center text-gray-400 text-xs pb-1">{c.modal?.nospam || 'No spam ever. We only contact you about your project.'}</p>
                    </form>
                  )}

                  {/* nav buttons (multi only — single auto-advances) */}
                  {cur.type === 'multi' && (
                    <div className="flex gap-3 mt-6">
                      {step > 0 && (
                        <button type="button" onClick={() => setStep(s => s - 1)}
                          className="flex-none px-5 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 font-bold py-4 rounded-2xl text-sm transition-colors">
                          ← {c.modal?.back || 'Back'}
                        </button>
                      )}
                      <button type="button" onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                        className="relative flex-1 overflow-hidden group/btn bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-base tracking-widest uppercase transition-all duration-200 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:shadow-none disabled:translate-y-0">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {c.modal?.next || 'NEXT'} <span className="group-hover/btn:translate-x-1 transition-transform duration-150 inline-block">→</span>
                        </span>
                        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 rounded-2xl" />
                      </button>
                    </div>
                  )}
                  {cur.type === 'contact' && step > 0 && (
                    <button type="button" onClick={() => setStep(s => s - 1)}
                      className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 font-bold py-3 rounded-2xl text-sm transition-colors">
                      ← {c.modal?.back || 'Back'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
