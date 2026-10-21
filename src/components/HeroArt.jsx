// Hero composition: a warm still-life of jars, bottles and nuts with leaves.
const Leaf = ({ x, y, r = 0, fill = '#B7C7A0', s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    <path d="M0 0C14 -22 34 -26 44 -14 40 4 20 14 0 0z" fill={fill} />
    <path d="M2 -1C16 -18 32 -23 43 -15" stroke="#214D35" strokeWidth="1.2" fill="none" opacity="0.3" />
  </g>
)

export default function HeroArt() {
  return (
    <svg viewBox="0 0 520 420" role="img" aria-label="سبد محصولات طبیعی بارانیکا" style={{ width: '100%', height: 'auto' }}>
      <rect width="520" height="420" rx="0" fill="#FDFBF4" />
      {/* organic backdrop blob */}
      <path d="M60 90c40-60 130-72 210-52 74 18 128 64 128 138 0 82-64 140-158 148-102 8-196-40-206-124-6-44 6-80 26-110z" fill="#E4EBD6" opacity="0.7" />
      <Leaf x={70} y={330} r={-24} fill="#71875A" s={1.6} o={0.55} />
      <Leaf x={440} y={70} r={150} fill="#B7C7A0" s={1.5} o={0.7} />
      <Leaf x={462} y={300} r={200} fill="#B7C7A0" s={1.2} o={0.5} />
      <ellipse cx="260" cy="382" rx="180" ry="18" fill="#214D35" opacity="0.07" />

      {/* honey jar */}
      <g transform="translate(120 250)">
        <path d="M0 0h96v96a22 22 0 0 1-22 22H22A22 22 0 0 1 0 96z" fill="#C5A46D" />
        <path d="M0 0h96v96a22 22 0 0 1-22 22H22A22 22 0 0 1 0 96z" fill="#fff" opacity="0.12" />
        <rect x="-8" y="-24" width="112" height="28" rx="10" fill="#795443" />
        <rect x="16" y="28" width="64" height="48" rx="8" fill="#F8F4EA" />
        <path d="M30 46h36M32 58h30" stroke="#71875A" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* olive oil bottle */}
      <g transform="translate(258 214)">
        <path d="M28 0h30v16c12 8 18 22 18 38v76a16 16 0 0 1-16 16H26a16 16 0 0 1-16-16V54c0-16 6-30 18-38z" fill="#B7C7A0" opacity="0.8" />
        <rect x="24" y="-18" width="38" height="20" rx="6" fill="#795443" />
        <rect x="16" y="66" width="58" height="42" rx="7" fill="#F8F4EA" />
        <path d="M28 82h34M30 92h26" stroke="#71875A" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* bowl of nuts */}
      <g transform="translate(352 300)">
        <path d="M0 0h124c-6 40-32 62-62 62S6 40 0 0z" fill="#795443" />
        <path d="M0 0h124c-2 12-6 22-12 30H12c-6-8-10-18-12-30z" fill="#5f4235" />
        <ellipse cx="40" cy="6" rx="16" ry="10" transform="rotate(-16 40 6)" fill="#B7C7A0" />
        <ellipse cx="76" cy="2" rx="15" ry="10" transform="rotate(12 76 2)" fill="#C5A46D" />
        <ellipse cx="58" cy="-8" rx="14" ry="9" fill="#EDE7D8" />
      </g>

      {/* small date cubes */}
      <g transform="translate(66 328)">
        <rect x="0" y="0" width="34" height="26" rx="6" fill="#795443" transform="rotate(-8 17 13)" />
        <rect x="26" y="-8" width="34" height="26" rx="6" fill="#C5A46D" transform="rotate(6 43 5)" />
      </g>

      {/* floating leaves */}
      <Leaf x={190} y={92} r={-10} fill="#71875A" s={0.9} o={0.8} />
      <Leaf x={300} y={120} r={186} fill="#B7C7A0" s={0.8} o={0.7} />
      <circle cx="240" cy="80" r="6" fill="#C5A46D" opacity="0.8" />
      <circle cx="420" cy="180" r="5" fill="#71875A" opacity="0.6" />
      <circle cx="80" cy="160" r="5" fill="#C5A46D" opacity="0.5" />
    </svg>
  )
}
