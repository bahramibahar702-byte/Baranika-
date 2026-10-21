// Botanical SVG illustrations used as default product imagery.
// Every product gets a consistent, brand-palette scene; admins can override
// with a real photo via the admin panel (stored in products.image).

const Leaf = ({ x, y, r = 0, fill = '#B7C7A0', s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    <path d="M0 0C14 -22 34 -26 44 -14 40 4 20 14 0 0z" fill={fill} />
    <path d="M2 -1C16 -18 32 -23 43 -15" stroke="#214D35" strokeWidth="1.2" fill="none" opacity="0.35" />
  </g>
)

const Scene = ({ art, accent, title }) => (
  <svg className="product-art" viewBox="0 0 300 300" role="img" aria-label={title} preserveAspectRatio="xMidYMid slice">
    <rect width="300" height="300" fill="#FDFBF4" />
    <circle cx="150" cy="168" r="102" fill="#E4EBD6" opacity="0.8" />
    <Leaf x={26} y={92} r={-18} fill="#B7C7A0" s={1.15} o={0.85} />
    <Leaf x={250} y={78} r={168} fill="#71875A" s={1} o={0.5} />
    <Leaf x={244} y={236} r={210} fill="#B7C7A0" s={0.9} o={0.65} />
    <ellipse cx="150" cy="248" rx="92" ry="14" fill="#214D35" opacity="0.08" />
    {art === 'jar' && <Jar accent={accent} />}
    {art === 'tin' && <Tin accent={accent} />}
    {art === 'pouch' && <Pouch accent={accent} />}
    {art === 'bag' && <Bag accent={accent} />}
    {art === 'box' && <Box accent={accent} />}
    {art === 'cubes' && <Cubes accent={accent} />}
    {art === 'cookies' && <Cookies accent={accent} />}
    {art === 'bottle' && <Bottle accent={accent} />}
    {art === 'oilbottle' && <OilBottle accent={accent} />}
    {!(['jar', 'tin', 'pouch', 'bag', 'box', 'cubes', 'cookies', 'bottle', 'oilbottle'].includes(art)) && <Jar accent={accent} />}
  </svg>
)

const Jar = ({ accent }) => (
  <g>
    <path d="M108 128h84v88a20 20 0 0 1-20 20h-44a20 20 0 0 1-20-20z" fill={accent} opacity="0.92" />
    <path d="M108 128h84v88a20 20 0 0 1-20 20h-44a20 20 0 0 1-20-20z" fill="url(#jarShine)" opacity="0.25" />
    <rect x="100" y="106" width="100" height="26" rx="9" fill="#795443" />
    <rect x="100" y="106" width="100" height="8" rx="4" fill="#5f4235" />
    <rect x="118" y="156" width="64" height="48" rx="8" fill="#F8F4EA" />
    <path d="M132 172h36M132 182h36" stroke="#C5A46D" strokeWidth="3" strokeLinecap="round" />
    <path d="M120 128c0-6 12-10 30-10s30 4 30 10" stroke="#795443" strokeWidth="2.5" fill="none" />
    <path d="M158 78c6 10 10 14 10 20a10 10 0 0 1-20 0c0-6 4-10 10-20z" fill={accent} opacity="0.85" />
    <defs><linearGradient id="jarShine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient></defs>
  </g>
)

const Tin = ({ accent }) => (
  <g>
    <ellipse cx="150" cy="212" rx="58" ry="16" fill={accent} opacity="0.9" />
    <rect x="92" y="128" width="116" height="84" fill={accent} />
    <ellipse cx="150" cy="128" rx="58" ry="16" fill={accent} />
    <ellipse cx="150" cy="124" rx="50" ry="12" fill="#F8F4EA" opacity="0.7" />
    <rect x="116" y="152" width="68" height="40" rx="7" fill="#F8F4EA" />
    <path d="M132 166h36M138 176h24" stroke="#71875A" strokeWidth="3" strokeLinecap="round" />
    <path d="M96 140h108" stroke="#fff" strokeWidth="2" opacity="0.35" />
  </g>
)

const Pouch = ({ accent }) => (
  <g>
    <path d="M104 96h92l10 130a14 14 0 0 1-14 15h-84a14 14 0 0 1-14-15z" fill={accent} opacity="0.92" />
    <path d="M104 96h92l2 26h-96z" fill="#fff" opacity="0.25" />
    <path d="M110 90c12-8 68-8 80 0" stroke="#5f4235" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="118" y="150" width="64" height="44" rx="8" fill="#F8F4EA" />
    <path d="M132 166h36M134 176h32" stroke={accent} strokeWidth="3" strokeLinecap="round" />
    <circle cx="150" cy="122" r="7" fill="#fff" opacity="0.5" />
  </g>
)

const Bag = ({ accent }) => (
  <g>
    <path d="M102 104h96v128a12 12 0 0 1-12 12h-72a12 12 0 0 1-12-12z" fill="#EDE7D8" />
    <path d="M102 104h96v20h-96z" fill={accent} opacity="0.85" />
    <path d="M118 104V88a32 16 0 0 1 64 0v16" stroke="#795443" strokeWidth="3" fill="none" />
    <rect x="118" y="158" width="64" height="42" rx="8" fill={accent} opacity="0.2" />
    <path d="M130 176h40M132 186h36" stroke={accent} strokeWidth="3" strokeLinecap="round" />
    <circle cx="150" cy="134" r="8" fill={accent} opacity="0.6" />
  </g>
)

const Box = ({ accent }) => (
  <g>
    <rect x="88" y="140" width="124" height="92" rx="14" fill={accent} opacity="0.92" />
    <rect x="88" y="140" width="124" height="26" rx="13" fill="#fff" opacity="0.25" />
    <rect x="108" y="180" width="84" height="34" rx="8" fill="#F8F4EA" />
    <path d="M124 194h52" stroke="#795443" strokeWidth="3" strokeLinecap="round" />
    <g fill="#795443">
      <rect x="126" y="112" width="22" height="16" rx="4" transform="rotate(-8 137 120)" />
      <rect x="152" y="108" width="22" height="16" rx="4" transform="rotate(6 163 116)" />
    </g>
    <circle cx="150" cy="104" r="6" fill="#C5A46D" />
  </g>
)

const Cubes = ({ accent }) => (
  <g>
    <ellipse cx="150" cy="220" rx="86" ry="20" fill="#EDE7D8" />
    <ellipse cx="150" cy="212" rx="86" ry="20" fill="#fff" />
    <g fill={accent}>
      <rect x="112" y="176" width="30" height="26" rx="7" transform="rotate(-6 127 189)" />
      <rect x="146" y="170" width="30" height="26" rx="7" transform="rotate(5 161 183)" />
      <rect x="132" y="196" width="30" height="24" rx="7" transform="rotate(3 147 208)" />
    </g>
    <g fill="#fff" opacity="0.3">
      <rect x="120" y="182" width="8" height="6" rx="3" />
      <rect x="156" y="178" width="8" height="6" rx="3" />
    </g>
    <Leaf x={228} y={168} r={160} fill="#71875A" s={0.8} o={0.7} />
  </g>
)

const Cookies = ({ accent }) => (
  <g>
    <ellipse cx="150" cy="222" rx="88" ry="18" fill="#EDE7D8" />
    <ellipse cx="150" cy="214" rx="88" ry="18" fill="#fff" />
    <g>
      <circle cx="122" cy="188" r="26" fill={accent} />
      <circle cx="178" cy="192" r="26" fill="#C5A46D" />
      <circle cx="150" cy="164" r="24" fill="#EDE7D8" stroke="#B7C7A0" strokeWidth="3" />
    </g>
    <g fill="#795443" opacity="0.8">
      <circle cx="116" cy="184" r="2.4" /><circle cx="128" cy="192" r="2.4" /><circle cx="124" cy="198" r="2" />
      <circle cx="172" cy="188" r="2.4" /><circle cx="184" cy="196" r="2.4" /><circle cx="146" cy="160" r="2.2" />
      <circle cx="156" cy="168" r="2.2" />
    </g>
  </g>
)

const Bottle = ({ accent }) => (
  <g>
    <path d="M132 96h36v18c8 8 14 16 14 28v84a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16v-84c0-12 6-20 14-28z" fill={accent} opacity="0.9" />
    <rect x="128" y="80" width="44" height="18" rx="5" fill="#795443" />
    <rect x="128" y="168" width="44" height="42" rx="6" fill="#F8F4EA" />
    <path d="M138 184h24M140 194h20" stroke="#71875A" strokeWidth="3" strokeLinecap="round" />
    <path d="M140 108c4 6 8 10 8 18" stroke="#fff" strokeWidth="4" opacity="0.4" strokeLinecap="round" />
  </g>
)

const OilBottle = ({ accent }) => (
  <g>
    <path d="M136 100h28v14c10 6 16 18 16 32v70a16 16 0 0 1-16 16h-28a16 16 0 0 1-16-16v-70c0-14 6-26 16-32z" fill="#B7C7A0" opacity="0.65" />
    <path d="M144 132h12v74a6 6 0 0 1-12 0z" fill={accent} opacity="0.85" />
    <rect x="134" y="84" width="32" height="18" rx="5" fill="#795443" />
    <rect x="128" y="176" width="44" height="40" rx="6" fill="#F8F4EA" />
    <path d="M140 192h20M142 202h16" stroke="#71875A" strokeWidth="3" strokeLinecap="round" />
  </g>
)

export default function ProductArt({ art = 'jar', accent = '#C5A46D', className = '', title = '' }) {
  return (
    <div className={`art-wrap ${className}`}>
      <Scene art={art} accent={accent || '#C5A46D'} title={title} />
    </div>
  )
}
