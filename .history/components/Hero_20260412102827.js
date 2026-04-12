'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiMail, FiPhone, FiDownload, FiArrowDown, FiMapPin } from 'react-icons/fi'

const roles = [
  'Web Developer',
  'AI Prompt Engineer',
  'Full-Stack Developer',
  'Cloud Solutions Architect',
]

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const currentRole = roles[roleIndex]
    const speed = isDeleting ? 45 : 80

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentRole.length) {
        setDisplayText(currentRole.slice(0, charIndex + 1))
        setCharIndex((c) => c + 1)
      } else if (!isDeleting && charIndex === currentRole.length) {
        setTimeout(() => setIsDeleting(true), 2200)
      } else if (isDeleting && charIndex > 0) {
        setDisplayText(currentRole.slice(0, charIndex - 1))
        setCharIndex((c) => c - 1)
      } else {
        setIsDeleting(false)
        setRoleIndex((i) => (i + 1) % roles.length)
      }
    }, speed)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, roleIndex])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg"
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/3 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-sm font-mono mb-8"
        >
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          Open to new opportunities
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-[88px] font-black tracking-tight mb-4 leading-none"
        >
          <span className="text-white">Papy </span>
          <span className="gradient-text">Kabukanyi</span>
        </motion.h1>

        {/* Typewriter role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-14 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold mb-6"
        >
          <span className="text-slate-300">{displayText}</span>
          <span className="text-cyan-400 ml-0.5 animate-pulse">|</span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-slate-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Building visually compelling, scalable web apps and leveraging AI to
          supercharge productivity. Based in Austin, TX.
        </motion.p>

        {/* Contact info row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-5 mb-10 text-sm text-slate-500"
        >
          <span className="flex items-center gap-1.5">
            <FiMapPin className="text-cyan-400" size={13} />
            Austin, TX
          </span>
          <a
            href="mailto:Papykabukanyi@gmail.com"
            className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
          >
            <FiMail className="text-cyan-400" size={13} />
            Papykabukanyi@gmail.com
          </a>
          <a
            href="tel:7377106090"
            className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
          >
            <FiPhone className="text-cyan-400" size={13} />
            737.710.6090
          </a>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#experience"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all duration-200 glow-btn shadow-lg shadow-cyan-500/20"
          >
            View My Work
          </a>
          <a
            href="/resume.pdf"
            download="Papy_Kabukanyi_Resume.pdf"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 font-semibold hover:bg-cyan-500/15 hover:border-cyan-500/60 transition-all duration-200"
          >
            <FiDownload size={16} />
            Download Resume
          </a>
          <a
            href="https://github.com/papykabukanyi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-purple-500/30 bg-purple-500/5 text-purple-400 font-semibold hover:bg-purple-500/15 transition-all duration-200"
          >
            <FiGithub size={16} />
            GitHub
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 hover:text-cyan-400 transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <FiArrowDown size={22} />
      </motion.a>
    </section>
  )
}
