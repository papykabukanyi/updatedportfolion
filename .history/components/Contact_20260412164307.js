'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiGithub,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiMessageSquare,
} from 'react-icons/fi'
import { useLang } from '@/lib/LangContext'

const contactIcons = [FiMail, FiPhone, FiMapPin, FiGithub]
const contactValues = [
  { value: 'Papykabukanyi@gmail.com', href: 'mailto:Papykabukanyi@gmail.com' },
  { value: '737.710.6090', href: 'tel:7377106090' },
  { value: 'Austin, TX', href: null },
  { value: 'github.com/papykabukanyi', href: 'https://github.com/papykabukanyi' },
]
const contactLabelKeys = ['email', 'phone', 'location', 'github']

const INITIAL = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const { t } = useLang()
  const contactItems = contactIcons.map((Icon, i) => ({
    Icon,
    label: t.contact.contactLabels[contactLabelKeys[i]],
    ...contactValues[i],
  }))

  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.')
        setStatus('error')
      } else {
        setStatus('success')
        setForm(INITIAL)
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-24 px-4 bg-[#080810]">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-mono text-sm tracking-[0.2em] uppercase">
            {t.contact.label}
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 text-white">
            {t.contact.heading[0]} <span className="gradient-text">{t.contact.heading[1]}</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-lg mx-auto text-lg">
            {t.contact.description}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left — Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {contactItems.map((item, i) => {
              const content = (
                <>
                  <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors duration-200 flex-shrink-0">
                    <item.Icon className="text-cyan-400" size={18} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-0.5">{item.label}</p>
                    <p className="text-slate-200 font-semibold text-sm">{item.value}</p>
                  </div>
                </>
              )
              return item.href ? (
                <a
                  key={i}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="glass-card p-4 flex items-center gap-4 hover:border-cyan-500/25 transition-all duration-300 group"
                >
                  {content}
                </a>
              ) : (
                <div key={i} className="glass-card p-4 flex items-center gap-4">
                  {content}
                </div>
              )
            })}

            {/* Availability badge */}
            <div className="glass-card p-5 mt-2 border-cyan-500/15">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-cyan-400 text-sm font-semibold">{t.contact.availableTitle}</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                {t.contact.availableBody}
              </p>
            </div>
          </motion.div>

          {/* Right — Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="glass-card p-8">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <FiCheckCircle className="text-cyan-400" size={34} />
                    </div>
                    <h3 className="text-white font-bold text-xl">{t.contact.successTitle}</h3>
                    <p className="text-slate-400 text-sm max-w-xs">
                      {t.contact.successBody}
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-2 text-cyan-400 text-sm hover:underline font-medium"
                    >
                      {t.contact.sendAnother}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    {/* Row: Name + Email */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-slate-400 text-xs font-medium mb-2 tracking-wide uppercase">
                          {t.contact.labels.name}
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder={t.contact.placeholders.name}
                            required
                            maxLength={100}
                            className="w-full bg-white/[0.04] border border-white/8 rounded-xl pl-9 pr-4 py-3 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all duration-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-medium mb-2 tracking-wide uppercase">
                          {t.contact.labels.email}
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder={t.contact.placeholders.email}
                            required
                            maxLength={200}
                            className="w-full bg-white/[0.04] border border-white/8 rounded-xl pl-9 pr-4 py-3 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-2 tracking-wide uppercase">
                        {t.contact.labels.subject}
                      </label>
                      <div className="relative">
                        <FiMessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                        <input
                          type="text"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          placeholder={t.contact.placeholders.subject}
                          required
                          maxLength={200}
                          className="w-full bg-white/[0.04] border border-white/8 rounded-xl pl-9 pr-4 py-3 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-2 tracking-wide uppercase">
                        {t.contact.labels.message}
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder={t.contact.placeholders.message}
                        required
                        rows={5}
                        maxLength={2000}
                        className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all duration-200 resize-none"
                      />
                      <p className="text-right text-slate-600 text-xs mt-1">
                        {form.message.length}/2000
                      </p>
                    </div>

                    {/* Error banner */}
                    <AnimatePresence>
                      {status === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                        >
                          <FiAlertCircle size={15} className="flex-shrink-0" />
                          {errorMsg}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/20 glow-btn"
                    >
                      {status === 'loading' ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          {t.contact.sending}
                        </>
                      ) : (
                        <>
                          <FiSend size={16} />
                          {t.contact.send}
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
