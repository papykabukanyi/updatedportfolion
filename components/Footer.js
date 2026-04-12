import { FiGithub, FiMail, FiDownload } from 'react-icons/fi'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div>
          <span className="text-xl font-black font-mono gradient-text">PK.</span>
          <p className="text-slate-500 text-sm mt-0.5">
            Web Developer &amp; AI Prompt Engineer
          </p>
        </div>

        {/* Social + Download */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/papykabukanyi"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 glass-card text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-200"
            aria-label="GitHub"
          >
            <FiGithub size={17} />
          </a>
          <a
            href="mailto:Papykabukanyi@gmail.com"
            className="p-2.5 glass-card text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-200"
            aria-label="Email"
          >
            <FiMail size={17} />
          </a>
          <a
            href="/resume.pdf"
            download="Papy_Kabukanyi_Resume.pdf"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20"
          >
            <FiDownload size={14} />
            Download CV
          </a>
        </div>

        {/* Copyright */}
        <p className="text-slate-600 text-xs">
          &copy; {year} Papy Kabukanyi. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
