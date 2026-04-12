'use client'
import { motion } from 'framer-motion'
import { FiBriefcase, FiCode, FiAward, FiTrendingUp } from 'react-icons/fi'

const stats = [
  { Icon: FiBriefcase, value: '5+', label: 'Years Experience' },
  { Icon: FiCode, value: '20+', label: 'Technologies' },
  { Icon: FiAward, value: '3', label: 'Certifications' },
  { Icon: FiTrendingUp, value: '50+', label: 'Projects Delivered' },
]

export default function About() {
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
            About Me
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 text-white">
            Turning Ideas into{' '}
            <span className="gradient-text">Reality</span>
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
            <p className="text-slate-400 text-lg leading-relaxed">
              Dynamic and detail-oriented Web Developer with a diverse background in software
              development, web design, and digital marketing. I craft visually compelling,
              user-friendly websites and scalable solutions that boost user engagement.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              Adept at both front-end and back-end development, I bring a unique blend of
              technical expertise and creative vision — from React applications to AWS cloud
              infrastructure — to drive innovation and measurable business growth.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              As an{' '}
              <span className="text-cyan-400 font-semibold">AI Prompt Engineer</span>, I
              specialize in crafting optimized prompts for large language models, automating
              workflows, and integrating AI solutions to maximize productivity and output
              quality for clients and teams.
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
