'use client'
import { motion } from 'framer-motion'
import { FiBriefcase, FiCode, FiAward, FiTrendingUp } from 'react-icons/fi'
import { useLang } from '@/lib/LangContext'

const statIcons = [FiBriefcase, FiCode, FiAward, FiTrendingUp]
const statValues = ['5+', '20+', '3', '50+']

export default function About() {
  const { t } = useLang()
  const stats = statIcons.map((Icon, i) => ({ Icon, value: statValues[i], label: t.about.stats[i] }))
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-mono text-sm tracking-[0.2em] uppercase">
            {t.about.label}
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 text-white">
            {t.about.heading[0]}{' '}
            <span className="gradient-text">{t.about.heading[1]}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <p className="text-slate-400 text-lg leading-relaxed">{t.about.p1}</p>
            <p className="text-slate-400 text-lg leading-relaxed">{t.about.p2}</p>
            <p className="text-slate-400 text-lg leading-relaxed">
              {t.about.p3[0]}
              <span className="text-cyan-400 font-semibold">{t.about.p3[1]}</span>
              {t.about.p3[2]}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {['React', 'Node.js', 'Python', 'AWS', 'AI/LLM', 'Figma'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-300 text-xs font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map(({ Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-7 text-center hover:border-cyan-500/25 hover:-translate-y-1 group"
              >
                <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-3xl font-black gradient-text mb-1">{value}</div>
                <div className="text-slate-500 text-sm">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
