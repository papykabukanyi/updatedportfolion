import Image from 'next/image'
import { FiGithub, FiStar, FiGitBranch, FiExternalLink, FiUsers, FiBook } from 'react-icons/fi'

const langColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Jupyter: '#DA5B0B',
}

async function getGitHubData() {
  try {
    const headers = { Accept: 'application/vnd.github+json' }
    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/papykabukanyi', {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(
        'https://api.github.com/users/papykabukanyi/repos?sort=updated&per_page=6&type=owner',
        { headers, next: { revalidate: 3600 } }
      ),
    ])

    if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error')

    const user = await userRes.json()
    const repos = await reposRes.json()
    return { user, repos }
  } catch {
    return { user: null, repos: [] }
  }
}

export default async function GitHubShowcase() {
  const { user, repos } = await getGitHubData()

  return (
    <section id="github" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="text-cyan-400 font-mono text-sm tracking-[0.2em] uppercase">
            Open Source
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 text-white">
            GitHub <span className="gradient-text">Showcase</span>
          </h2>
        </div>

        {/* Profile card */}
        {user && (
          <div className="glass-card p-5 sm:p-7 mb-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
            <Image
              src={user.avatar_url}
              alt={user.login}
              width={80}
              height={80}
              className="rounded-full border-2 border-cyan-500/30"
            />
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl font-bold text-white">{user.name || user.login}</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-sm">
                {user.bio || 'Web Developer & AI Prompt Engineer'}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-5 mt-3">
                <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <FiBook className="text-cyan-400" size={13} />
                  {user.public_repos} repositories
                </span>
                <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <FiUsers className="text-cyan-400" size={13} />
                  {user.followers} followers
                </span>
              </div>
            </div>
            <a
              href="https://github.com/papykabukanyi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20 flex-shrink-0"
            >
              <FiGithub size={16} />
              View Profile
              <FiExternalLink size={13} />
            </a>
          </div>
        )}

        {/* Repository grid */}
        {repos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-5 hover:border-cyan-500/25 hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FiBook className="text-cyan-400 flex-shrink-0" size={13} />
                    <span className="text-cyan-400 font-semibold text-sm truncate group-hover:text-cyan-300 transition-colors">
                      {repo.name}
                    </span>
                  </div>
                  <FiExternalLink
                    className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0 ml-2"
                    size={12}
                  />
                </div>

                <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1 line-clamp-2">
                  {repo.description || 'No description available.'}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: langColors[repo.language] || '#8b949e',
                        }}
                      />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <FiStar size={11} />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiGitBranch size={11} />
                    {repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Fallback when API is unavailable */}
        {!user && (
          <div className="glass-card p-12 text-center">
            <FiGithub className="w-14 h-14 text-cyan-400 mx-auto mb-5" />
            <p className="text-slate-400 text-lg mb-6">
              Explore my open-source projects on GitHub
            </p>
            <a
              href="https://github.com/papykabukanyi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all"
            >
              <FiGithub size={17} />
              github.com/papykabukanyi
              <FiExternalLink size={13} />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
