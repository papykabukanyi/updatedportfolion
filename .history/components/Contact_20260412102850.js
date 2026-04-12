'use client'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiGithub } from 'react-icons/fi'

const contactItems = [
  {
    Icon: FiMail,
    label: 'Email',
    value: 'Papykabukanyi@gmail.com',
    href: 'mailto:Papykabukanyi@gmail.com',
  },
  {
    Icon: FiPhone,
    label: 'Phone',
    value: '737.710.6090',
    href: 'tel:7377106090',
  },
  {
    Icon: FiMapPin,
    label: 'Location',
    value: 'Austin, TX',
    href: null,
  },
  {
    Icon: FiGithub,
    label: 'GitHub',
    value: 'github.com/papykabukanyi',
    href: 'https://github.com/papykabukanyi',
  },
]

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-4 bg-[#080810]">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-mono text-sm tracking-[0.2em] uppercase">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 text-white">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-lg mx-auto text-lg">
            I&apos;m currently open to web development and AI prompt engineering
            opportunities. Let&apos;s build something great together.
          </p>
        </motion.div>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {contactItems.map((item, i) => {
            const content = (
              <>
                <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors duration-200">
                  <item.Icon className="text-cyan-400" size={20} />
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">{item.label}</p>
                  <p className="text-slate-200 font-semibold text-sm">{item.value}</p>
                </div>
              </>
            )

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="glass-card p-5 flex items-center gap-4 hover:border-cyan-500/25 transition-all duration-300 group block"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="glass-card p-5 flex items-center gap-4">{content}</div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <a
            href="mailto:Papykabukanyi@gmail.com"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-cyan-500/20 glow-btn"
          >
            <FiMail size={20} />
            Send Me an Email
          </a>
        </motion.div>
      </div>
    </section>
  )
}
