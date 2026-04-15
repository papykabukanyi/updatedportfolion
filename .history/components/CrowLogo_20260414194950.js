export default function CrowLogo({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Body */}
      <ellipse cx="50" cy="58" rx="22" ry="16" fill="currentColor" />
      {/* Head */}
      <ellipse cx="72" cy="42" rx="12" ry="10" fill="currentColor" />
      {/* Beak */}
      <polygon points="84,40 96,43 84,46" fill="#d4a200" />
      {/* Eye */}
      <circle cx="76" cy="40" r="2.5" fill="white" />
      <circle cx="76.8" cy="40" r="1.2" fill="#111" />
      {/* Wing left */}
      <path d="M28 58 Q18 40 30 28 Q38 44 50 52Z" fill="currentColor" />
      {/* Wing right */}
      <path d="M72 58 Q82 40 70 28 Q62 44 50 52Z" fill="currentColor" />
      {/* Tail */}
      <path d="M36 68 Q30 82 24 88 Q32 78 42 74Z" fill="currentColor" />
      <path d="M42 70 Q38 86 34 93 Q40 82 50 76Z" fill="currentColor" />
      {/* Feet */}
      <line x1="44" y1="74" x2="36" y2="86" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="86" x2="30" y2="90" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="86" x2="34" y2="93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="86" x2="40" y2="92" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="54" y1="74" x2="62" y2="86" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="62" y1="86" x2="56" y2="92" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="62" y1="86" x2="62" y2="94" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="62" y1="86" x2="68" y2="91" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
