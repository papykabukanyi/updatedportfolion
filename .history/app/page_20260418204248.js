'use client'
import { useState, useRef } from 'react'
import { useLang } from '@/lib/LangContext'

// ── Data ───────────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: '🏚️', title: 'Residential Demolition', desc: 'Full house teardowns, partial demolition, and structure removal for homes across Greater Austin.', tags: ['House Teardown', 'Partial Demo', 'Foundation Removal'] },
  { icon: '🏢', title: 'Commercial Demolition', desc: 'Safe, fast, code-compliant demolition for retail, offices, warehouses, and industrial facilities.', tags: ['Retail', 'Office', 'Warehouse', 'Industrial'] },
  { icon: '🔨', title: 'Interior Demolition', desc: 'Selective interior demo — walls, ceilings, flooring, and fixtures removed without damaging the structure.', tags: ['Walls', 'Ceilings', 'Flooring', 'Tenant Improvement'] },
  { icon: '🌿', title: 'Site Clearing & Grading', desc: 'Full land clearing, grubbing, grading, and site prep before new construction begins.', tags: ['Land Clearing', 'Grading', 'Vegetation Removal'] },
  { icon: '⛏️', title: 'Concrete Breaking', desc: 'Driveways, slabs, sidewalks, patios, and foundations broken up and hauled away. Any size.', tags: ['Driveway', 'Slab', 'Foundation', 'Patio'] },
  { icon: '🚛', title: 'Debris Removal & Hauling', desc: 'Full-service debris cleanup and hauling. We leave your site clean and ready for the next phase.', tags: ['Junk Removal', 'Haul Away', 'Site Cleanup'] },
]

const AREAS = [
  // Texas — Austin Metro
  'Austin', 'Cedar Park', 'Round Rock', 'Georgetown', 'Pflugerville',
  'Leander', 'Kyle', 'Buda', 'San Marcos', 'Dripping Springs',
  'Bastrop', 'Elgin', 'Taylor', 'Hutto', 'Liberty Hill',
  'Bee Cave', 'Lakeway', 'Wimberley', 'Lockhart', 'Manor',
  // Texas — San Antonio
  'San Antonio', 'New Braunfels', 'Seguin', 'Boerne', 'Schertz',
  'Converse', 'Universal City', 'Helotes',
  // Texas — Waco / Temple / Killeen
  'Waco', 'Temple', 'Killeen', 'Belton', 'College Station', 'Bryan',
  // Texas — Houston
  'Houston', 'Sugar Land', 'Katy', 'The Woodlands', 'Conroe',
  'Pearland', 'League City', 'Baytown', 'Pasadena', 'Galveston',
  'Spring', 'Cypress',
  // Texas — Dallas / Fort Worth
  'Dallas', 'Fort Worth', 'Arlington', 'Plano', 'Irving',
  'Garland', 'Frisco', 'McKinney', 'Denton', 'Carrollton',
  'Richardson', 'Mesquite', 'Grand Prairie', 'Mansfield',
  // Texas — South & East
  'Corpus Christi', 'Victoria', 'Laredo', 'McAllen', 'Harlingen',
  'Brownsville', 'Beaumont', 'Port Arthur', 'Tyler', 'Longview',
  'Texarkana', 'Wichita Falls',
  // Texas — West & Panhandle
  'Abilene', 'Lubbock', 'Amarillo', 'Midland', 'Odessa',
  'San Angelo', 'El Paso',
  // Oklahoma
  'Oklahoma City', 'Tulsa', 'Norman', 'Lawton', 'Edmond',
  'Broken Arrow', 'Stillwater',
  // Louisiana
  'Shreveport', 'Bossier City', 'New Orleans', 'Baton Rouge',
  'Lafayette', 'Lake Charles', 'Monroe',
  // Arkansas
  'Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro',
  // Mississippi
  'Jackson', 'Biloxi', 'Gulfport', 'Hattiesburg',
  // Alabama
  'Mobile', 'Montgomery', 'Birmingham', 'Huntsville', 'Tuscaloosa',
  // Tennessee
  'Memphis', 'Nashville', 'Chattanooga',
  // Georgia
  'Atlanta',
  // Florida
  'Pensacola', 'Panama City', 'Tallahassee', 'Jacksonville',
  // New Mexico
  'Albuquerque', 'Santa Fe', 'Las Cruces', 'Roswell', 'Carlsbad', 'Hobbs',
  // Arizona
  'Phoenix', 'Tucson', 'Mesa', 'Scottsdale', 'Tempe',
  'Chandler', 'Flagstaff', 'Glendale',
  // Colorado
  'Denver', 'Colorado Springs', 'Pueblo', 'Fort Collins',
  // Kansas
  'Wichita', 'Kansas City',
  // Missouri
  'Kansas City', 'Springfield', 'Joplin',
  // Nebraska
  'Omaha', 'Lincoln',
]

const STATS = [
  { value: '500+', label: 'Projects Completed' },
  { value: '15+', label: 'Years Experience' },
  { value: '1,000mi', label: 'Service Radius' },
  { value: '100%', label: 'Licensed & Insured' },
]

// ── Lead form steps ─────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 'services', question: 'What type of work do you need?',
    subtitle: 'Select everything that applies — pick as many as you need.',
    type: 'multi',
    options: [
      { label: 'Demolition', icon: '💥', desc: 'Tear down or remove structures' },
      { label: 'Construction / Renovation', icon: '🏗️', desc: 'Build new or renovate existing' },
      { label: 'Site Clearing', icon: '🌿', desc: 'Clear land for development' },
      { label: 'Concrete Work', icon: '⛏️', desc: 'Break up slabs, driveways, etc.' },
      { label: 'Debris Removal', icon: '🚛', desc: 'Haul away waste and materials' },
    ],
  },
  {
    id: 'scope', question: 'Is this residential or commercial?',
    subtitle: 'This helps us send the right crew and equipment.',
    type: 'single',
    options: [
      { label: 'Residential', icon: '🏠', desc: 'Home, house, or private property' },
      { label: 'Commercial', icon: '🏢', desc: 'Business, office, retail, or industrial' },
      { label: 'Mixed-Use', icon: '🏙️', desc: 'Both residential and commercial' },
    ],
  },
  {
    id: 'size', question: 'How large is the project?',
    subtitle: 'A rough idea helps us prepare an accurate quote.',
    type: 'single',
    options: [
      { label: 'Small', icon: '📦', desc: 'Single room, small area, or minor job' },
      { label: 'Medium', icon: '🏡', desc: 'Full floor, garage, or partial structure' },
      { label: 'Large', icon: '🏗️', desc: 'Full building or multi-unit structure' },
      { label: 'Very Large / Industrial', icon: '🏭', desc: 'Commercial complex or large acreage' },
    ],
  },
  {
    id: 'timeline', question: 'When do you need this done?',
    subtitle: "We work fast — let us know your urgency level.",
    type: 'single',
    options: [
      { label: 'ASAP — This Week', icon: '🚨', desc: 'Urgent, need it started right away' },
      { label: 'Within a Month', icon: '📅', desc: 'Planning for the near future' },
      { label: '1–3 Months', icon: '🗓️', desc: 'Still in planning phase' },
      { label: 'Just Exploring', icon: '💭', desc: 'Getting prices and options first' },
    ],
  },
  {
    id: 'budget', question: "What's your estimated budget?",
    subtitle: "No wrong answer — this helps us tailor the right solution.",
    type: 'single',
    options: [
      { label: 'Under $5,000', icon: '💵', desc: 'Small or targeted projects' },
      { label: '$5,000 – $20,000', icon: '💰', desc: 'Mid-size demolition or clearing' },
      { label: '$20,000 – $75,000', icon: '💎', desc: 'Large-scale demo or construction' },
      { label: '$75,000+', icon: '🏦', desc: 'Major commercial or industrial project' },
      { label: "Not Sure Yet", icon: '🤷', desc: 'Need a quote to establish budget' },
    ],
  },
  {
    id: 'contact', question: 'Where should we send your free estimate?',
    subtitle: 'We respond within 2 hours during business hours (Mon–Sat 7am–6pm).',
    type: 'contact',
  },
]

const BLANK = { services: [], scope: '', size: '', timeline: '', budget: '', name: '', phone: '', email: '', city: '', notes: '' }

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
  const modalRef = useRef(null)

  const cur = STEPS[step]
  const pct = Math.round(((step + 1) / STEPS.length) * 100)

  function toggle(field, val, multi) {
    if (multi) {
      setForm(f => ({ ...f, [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val] }))
    } else {
      setForm(f => ({ ...f, [field]: val }))
    }
  }

  function canNext() {
    if (cur.type === 'multi') return form[cur.id].length > 0
    if (cur.type === 'single') return !!form[cur.id]
    if (cur.type === 'contact') return !!(form.name && form.phone && form.email)
    return true
  }

  function openForm() { setOpen(true); setStep(0); setForm(BLANK); setDone(false); setErr('') }

  async function submit(e) {
    e.preventDefault()
    if (!canNext()) return
    setSaving(true); setErr('')
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error((await res.json()).error || 'Submission failed')
      setDone(true)
    } catch (e) { setErr(e.message) }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white">

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0c10]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center font-black text-sm text-white">P</div>
            <div>
              <p className="font-black text-sm leading-none tracking-wide">PAPY C&amp;D</p>
              <p className="text-gray-500 text-[10px] tracking-widest uppercase">Austin, TX</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <a href="#services" className="text-gray-400 hover:text-white text-sm transition-colors">{c.nav?.services || 'Services'}</a>
            <a href="#about" className="text-gray-400 hover:text-white text-sm transition-colors">{c.nav?.about || 'About'}</a>
            <a href="#areas" className="text-gray-400 hover:text-white text-sm transition-colors">{c.nav?.areas || 'Areas'}</a>
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              className="bg-transparent text-gray-400 hover:text-white text-sm border border-white/10 rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:border-orange-500/50 transition-colors"
              aria-label="Language"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="es">ES</option>
              <option value="ru">RU</option>
              <option value="sw">SW</option>
            </select>
          </div>
          <button onClick={openForm} className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all hover:scale-105">
            {c.nav?.estimate || 'Free Estimate'}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-orange-400 text-xs font-bold tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            {c.hero?.badge || 'Licensed & Insured · Austin, TX'}
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-none tracking-tight mb-6">
            <span className="block text-white">DEMOLITION.</span>
            <span className="block text-white">CONSTRUCTION.</span>
            <span className="block text-orange-500">DONE RIGHT.</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Austin&apos;s trusted licensed contractor for residential &amp; commercial demolition, site clearing,
            interior demo, and concrete work. <strong className="text-white">Serving Austin, all of Texas, and cities up to 1,000 miles away.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button onClick={openForm} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/20">
              {c.hero?.cta || 'GET A FREE ESTIMATE'} →
            </button>
            <a href="tel:+15128675309" className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/8 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all">
              📞 (512) 867-5309
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/[0.04] border border-white/[0.06] rounded-2xl py-4 px-3 text-center">
                <p className="text-2xl font-black text-orange-400">{s.value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">{c.services?.label || 'What We Do'}</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white">{c.services?.heading || 'FULL-SERVICE CONTRACTOR'}</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">{c.services?.sub || 'From a single room to a full city block — we handle every phase.'}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(sv => (
              <div key={sv.title} onClick={openForm} className="group bg-[#0e1016] border border-white/5 hover:border-orange-500/30 rounded-2xl p-6 transition-all hover:-translate-y-1 cursor-pointer">
                <div className="text-4xl mb-4">{sv.icon}</div>
                <h3 className="text-white font-black text-lg mb-2 group-hover:text-orange-400 transition-colors">{sv.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{sv.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {sv.tags.map(t => (
                    <span key={t} className="text-[10px] bg-orange-500/8 border border-orange-500/15 text-orange-400/80 px-2 py-0.5 rounded-full font-semibold">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0d0f14]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">{c.about?.label || 'Why Choose Us'}</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
                WE SHOW UP.<br/>WE WORK HARD.<br/>WE CLEAN UP.
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Papy Construction &amp; Demolition has served the Greater Austin area for over 15 years.
                Fully licensed and insured, we treat every job — big or small — with the same professionalism.
                No surprise invoices. No mess left behind.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  '✅ Fully licensed & insured in Texas',
                  '✅ Free same-day estimates on most projects',
                  '✅ Transparent pricing — no hidden fees',
                  '✅ Equipment for jobs of any size',
                  '✅ Eco-conscious debris disposal & recycling',
                  '✅ Bilingual crew — English & Spanish',
                  '✅ We beat any written competitor quote',
                ].map(l => <li key={l} className="text-gray-300 text-sm">{l}</li>)}
              </ul>
              <button onClick={openForm} className="bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105">
                {c.about?.cta || 'Request a Free Quote'} →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { e: '🏅', l: 'Licensed & Insured', s: 'Texas certified contractor' },
                { e: '⚡', l: 'Fast Turnaround', s: 'Most jobs done in days' },
                { e: '💬', l: '2hr Response', s: 'Mon–Sat, 7am to 6pm' },
                { e: '♻️', l: 'Green Disposal', s: 'We recycle & divert waste' },
                { e: '🔒', l: 'OSHA Compliant', s: 'Safe practices, always' },
                { e: '💰', l: 'Best Price', s: 'We beat any written quote' },
              ].map(c => (
                <div key={c.l} className="bg-[#111218] border border-white/5 rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">{c.e}</div>
                  <p className="text-white font-bold text-sm">{c.l}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{c.s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AREAS */}
      <section id="areas" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">{c.areas?.label || 'Coverage'}</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-3">{c.areas?.heading || 'SERVICE AREAS'}</h2>
            <p className="text-gray-500">{c.areas?.sub || 'Based in Austin, TX — serving all of Texas and major cities across 10 states within 1,000 miles.'}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {AREAS.map(a => (
              <span key={a} className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] hover:border-orange-500/30 hover:text-orange-400 rounded-full px-4 py-2 text-sm text-gray-300 transition-colors cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />{a}
              </span>
            ))}
            <span className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-sm text-orange-400 font-semibold">{c.areas?.more || '+ More — just ask!'}</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'repeating-linear-gradient(45deg,#000 0,#000 1px,transparent 0,transparent 50%)', backgroundSize: '10px 10px' }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">{c.cta?.heading || 'READY TO START?'}</h2>
          <p className="text-orange-100 mb-8 text-lg">{c.cta?.sub || 'Get your free estimate today. We respond within 2 hours.'}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={openForm} className="bg-white text-orange-600 font-black px-8 py-4 rounded-2xl text-lg hover:bg-orange-50 transition-colors">
              {c.cta?.btn || 'GET FREE ESTIMATE'} →
            </button>
            <a href="tel:+15128675309" className="border-2 border-white/40 hover:border-white text-white font-bold px-8 py-4 rounded-2xl text-lg transition-colors flex items-center justify-center gap-2">
              📞 (512) 867-5309
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center font-black text-xs text-white">P</div>
            <span className="font-bold text-gray-400">Papy Construction &amp; Demolition</span>
            <span>· Austin, TX</span>
          </div>
          <p>Licensed &amp; Insured · Based in Austin TX · Serving 1,000-Mile Radius</p>
          <p>© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </footer>

      {/* LEAD FORM MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div ref={modalRef} className="bg-[#111218] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="px-6 pt-6 pb-4 border-b border-white/5 flex items-center justify-between shrink-0">
              <div>
                <p className="text-orange-400 text-xs font-bold tracking-widest uppercase">{c.modal?.label || 'Free Estimate'}</p>
                <p className="text-white font-black text-lg">{c.modal?.title || 'PAPY C&D · AUSTIN TX'}</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-xl transition-all">✕</button>
            </div>

            {done ? (
              <div className="px-6 py-12 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-black text-white mb-2">YOU&apos;RE ALL SET!</h3>
                <p className="text-gray-400 mb-2">Thanks, <strong className="text-white">{form.name}</strong>! We got your request.</p>
                <p className="text-gray-500 text-sm mb-8">
                  We&apos;ll reach out to <strong className="text-orange-400">{form.phone}</strong> within 2 hours (Mon–Sat 7am–6pm).
                </p>
                <button onClick={() => setOpen(false)} className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-xl transition-colors">Close</button>
              </div>
            ) : (
              <div className="px-6 py-6">
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Step {step + 1} of {STEPS.length}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <h3 className="text-xl font-black text-white mb-1">{cur.question}</h3>
                <p className="text-gray-500 text-sm mb-6">{cur.subtitle}</p>

                {/* Multi-select */}
                {cur.type === 'multi' && (
                  <div className="space-y-2">
                    {cur.options.map(opt => {
                      const sel = form[cur.id].includes(opt.label)
                      return (
                        <button key={opt.label} type="button" onClick={() => toggle(cur.id, opt.label, true)}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${sel ? 'border-orange-500/60 bg-orange-500/10 text-white' : 'border-white/8 bg-white/3 text-gray-300 hover:border-white/20'}`}>
                          <span className="text-2xl">{opt.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm">{opt.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${sel ? 'border-orange-500 bg-orange-500' : 'border-white/20'}`}>
                            {sel && <span className="text-white text-xs">✓</span>}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Single select */}
                {cur.type === 'single' && (
                  <div className="space-y-2">
                    {cur.options.map(opt => {
                      const sel = form[cur.id] === opt.label
                      return (
                        <button key={opt.label} type="button" onClick={() => toggle(cur.id, opt.label, false)}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${sel ? 'border-orange-500/60 bg-orange-500/10 text-white' : 'border-white/8 bg-white/3 text-gray-300 hover:border-white/20'}`}>
                          <span className="text-2xl">{opt.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm">{opt.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${sel ? 'border-orange-500 bg-orange-500' : 'border-white/20'}`}>
                            {sel && <span className="text-white text-xs font-bold">✓</span>}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Contact step */}
                {cur.type === 'contact' && (
                  <form onSubmit={submit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name *</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Smith" required
                        className="w-full bg-[#0d0f14] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 placeholder-gray-600 transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone *</label>
                        <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} type="tel" placeholder="(512) 000-0000" required
                          className="w-full bg-[#0d0f14] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 placeholder-gray-600 transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email *</label>
                        <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" placeholder="you@email.com" required
                          className="w-full bg-[#0d0f14] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 placeholder-gray-600 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Project Location</label>
                      <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="e.g. Austin TX or 123 Main St, Cedar Park"
                        className="w-full bg-[#0d0f14] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 placeholder-gray-600 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Additional Details</label>
                      <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
                        placeholder="Describe the project, any access issues, materials, permits, etc."
                        className="w-full bg-[#0d0f14] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 placeholder-gray-600 resize-none transition-all" />
                    </div>
                    {err && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{err}</p>}
                    <button type="submit" disabled={saving || !canNext()}
                      className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-black py-4 rounded-2xl text-lg transition-colors">
                      {saving ? 'Sending…' : 'SEND MY FREE ESTIMATE →'}
                    </button>
                    <p className="text-center text-gray-600 text-xs">No spam ever. We only contact you about your project.</p>
                  </form>
                )}

                {/* Navigation buttons */}
                {cur.type !== 'contact' && (
                  <div className="flex gap-3 mt-6">
                    {step > 0 && (
                      <button type="button" onClick={() => setStep(s => s - 1)} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold py-3.5 rounded-2xl text-sm transition-colors">
                        ← Back
                      </button>
                    )}
                    <button type="button" onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                      className="flex-1 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-2xl text-sm transition-all">
                      NEXT →
                    </button>
                  </div>
                )}
                {cur.type === 'contact' && step > 0 && (
                  <button type="button" onClick={() => setStep(s => s - 1)} className="w-full mt-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold py-3 rounded-2xl text-sm transition-colors">
                    ← Back
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
