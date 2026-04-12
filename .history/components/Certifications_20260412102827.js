'use client'
import { motion } from 'framer-motion'
import { FiAward, FiCloud, FiUsers, FiCode } from 'react-icons/fi'

const certs = [
  {
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    badge: 'Associate',
    Icon: FiCloud,
    gradient: 'from-yellow-500/15 to-orange-500/15',
    border: 'border-yellow-500/20 hover:border-yellow-500/40',
    iconBg: 'bg-yellow-500/10',
    iconColor: 'text-yellow-400',
    badgeStyle: 'bg-yellow-500/10 text-yellow-400',
  },
  {
    name: 'Certified Salesforce Administrator',
    issuer: 'Salesforce',
    badge: 'Administrator',
    Icon: FiUsers,
    gradient: 'from-blue-500/15 to-cyan-500/15',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    badgeStyle: 'bg-blue-500/10 text-blue-400',
  },
  {
    name: 'Full-Stack Web Development',
    issuer: 'Bootcamp Certification',
    badge: 'Full-Stack',
    Icon: FiCode,
    gradient: 'from-purple-500/15 to-pink-500/15',
    border: 'border-purple-500/20 hover:border-purple-500/40',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    badgeStyle: 'bg-purple-500/10 text-purple-400',
  },
]

export default function Certifications() {
  return (
    <section id="certifications" className="py-24 px-4 bg-[#080810]">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-mono text-sm tracking-[0.2em] uppercase">
            Credentials
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 text-white">
            Certifications &amp; <span className="gradient-text">Achievements</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {certs.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className={`relative overflow-hidden rounded-2xl border p-7 bg-gradient-to-br transition-all duration-300 hover:-translate-y-2 ${cert.gradient} ${cert.border}`}
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-5">
                <div className={`p-3 rounded-xl ${cert.iconBg}`}>
                  <cert.Icon className={cert.iconColor} size={26} />
                </div>
                <span className={`text-xs font-mono px-3 py-1 rounded-full ${cert.badgeStyle}`}>
                  {cert.badge}
                </span>
              </div>

              <h3 className="text-white font-bold text-base leading-snug mb-1.5">
                {cert.name}
              </h3>
              <p className="text-slate-400 text-sm">{cert.issuer}</p>

              {/* Decorative award icon */}
              <FiAward
                className="absolute -bottom-3 -right-3 text-white/[0.04]"
                size={80}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
