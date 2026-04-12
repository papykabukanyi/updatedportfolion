'use client'
import { motion } from 'framer-motion'
import { FiCalendar, FiBriefcase } from 'react-icons/fi'

const experiences = [
  {
    role: 'Software Developer, Graphic & Web Designer',
    company: 'Hempire Enterprise',
    period: '08/2023 – Present',
    color: 'cyan',
    bullets: [
      'Designed and developed user-centric web applications using React, Angular, and JavaScript, enhancing engagement and system responsiveness.',
      'Built and maintained secure back-end systems with Node.js and Python, ensuring reliability and seamless performance.',
      'Deployed AWS cloud infrastructure to improve platform availability and data security.',
      'Created visually compelling graphic designs and branding materials for digital campaigns.',
      'Developed and maintained responsive company websites to optimize user experience across all devices.',
      'Managed SEO strategies and social media campaigns to drive brand awareness and traffic.',
      'Collaborated with cross-functional teams to align design, development, and marketing efforts.',
    ],
  },
  {
    role: 'SBA Loan Underwriter / Web Designer',
    company: 'Lendio',
    period: '03/2020 – 08/2023',
    color: 'purple',
    bullets: [
      'Performed in-depth financial analyses and cash flow evaluations to assess loan eligibility.',
      'Reviewed and analyzed business plans to ensure compliance with SBA lending guidelines.',
      'Collaborated with sales teams to streamline document collection and resolve discrepancies.',
      'Managed loan applications and maintained accurate records using Salesforce CRM.',
      'Optimized loan processing workflows to reduce delays and enhance client satisfaction.',
      'Gained proficiency in web design and began assisting web developers with various tasks.',
      'Took on responsibilities for maintaining and updating the company web application.',
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-4 bg-[#080810]">
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
            Work History
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 text-white">
            Professional <span className="gradient-text">Experience</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/40 via-purple-500/40 to-transparent" />

          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative pl-12 sm:pl-16 mb-10 last:mb-0"
            >
              {/* Icon bubble on line */}
              <div
                className={`absolute left-0 top-5 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  exp.color === 'cyan'
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-purple-500 bg-purple-500/10'
                }`}
              >
                <FiBriefcase
                  size={15}
                  className={exp.color === 'cyan' ? 'text-cyan-400' : 'text-purple-400'}
                />
              </div>

              {/* Card */}
              <div className="glass-card p-7 hover:border-white/10 transition-all duration-300">
                {/* Period badge */}
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono mb-3 ${
                    exp.color === 'cyan'
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'bg-purple-500/10 text-purple-400'
                  }`}
                >
                  <FiCalendar size={10} />
                  {exp.period}
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{exp.role}</h3>
                <p
                  className={`text-sm font-semibold mb-5 ${
                    exp.color === 'cyan' ? 'text-cyan-400' : 'text-purple-400'
                  }`}
                >
                  {exp.company}
                </p>

                <ul className="space-y-2.5">
                  {exp.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-slate-400 text-sm leading-relaxed">
                      <span
                        className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          exp.color === 'cyan' ? 'bg-cyan-400' : 'bg-purple-400'
                        }`}
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
