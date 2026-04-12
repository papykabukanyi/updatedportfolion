'use client'
import { motion } from 'framer-motion'

const skillCategories = [
  {
    name: 'Frontend',
    color: 'cyan',
    skills: ['React', 'Angular', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'WordPress'],
  },
  {
    name: 'Backend',
    color: 'purple',
    skills: ['Node.js', 'Python', 'PHP', 'Django', 'Flask', 'REST APIs', 'GraphQL'],
  },
  {
    name: 'Database',
    color: 'blue',
    skills: ['SQL', 'PostgreSQL', 'MongoDB', 'Salesforce CRM', 'ORM'],
  },
  {
    name: 'Cloud & DevOps',
    color: 'green',
    skills: ['AWS', 'AWS Solutions Architect', 'Git', 'GitHub', 'CI/CD', 'DevOps Tools'],
  },
  {
    name: 'AI & Data Science',
    color: 'yellow',
    skills: ['AI Prompt Engineering', 'LLM Integration', 'Pandas', 'NumPy', 'Data Analysis', 'Automation'],
  },
  {
    name: 'Design & Marketing',
    color: 'pink',
    skills: ['Adobe Creative Suite', 'Figma', 'Canva', 'Photoshop', 'Illustrator', 'InDesign', 'UI/UX Design', 'SEO', 'Branding', 'Typography'],
  },
]

const styles = {
  cyan: {
    header: 'text-cyan-400',
    dot: 'bg-cyan-400',
    pill: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-300 hover:border-cyan-500/50 hover:bg-cyan-500/10',
  },
  purple: {
    header: 'text-purple-400',
    dot: 'bg-purple-400',
    pill: 'border-purple-500/20 bg-purple-500/5 text-purple-300 hover:border-purple-500/50 hover:bg-purple-500/10',
  },
  blue: {
    header: 'text-blue-400',
    dot: 'bg-blue-400',
    pill: 'border-blue-500/20 bg-blue-500/5 text-blue-300 hover:border-blue-500/50 hover:bg-blue-500/10',
  },
  green: {
    header: 'text-emerald-400',
    dot: 'bg-emerald-400',
    pill: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300 hover:border-emerald-500/50 hover:bg-emerald-500/10',
  },
  yellow: {
    header: 'text-yellow-400',
    dot: 'bg-yellow-400',
    pill: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-300 hover:border-yellow-500/50 hover:bg-yellow-500/10',
  },
  pink: {
    header: 'text-pink-400',
    dot: 'bg-pink-400',
    pill: 'border-pink-500/20 bg-pink-500/5 text-pink-300 hover:border-pink-500/50 hover:bg-pink-500/10',
  },
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-4">
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
            Technical Toolkit
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 text-white">
            Skills &amp; <span className="gradient-text">Expertise</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {skillCategories.map((cat, i) => {
            const s = styles[cat.color]
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card p-6 hover:border-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Category header */}
                <div className="flex items-center gap-2 mb-5">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <h3 className={`text-xs font-bold tracking-[0.15em] uppercase ${s.header}`}>
                    {cat.name}
                  </h3>
                </div>

                {/* Skill pills */}
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 cursor-default ${s.pill}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
