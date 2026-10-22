// Quiet placeholder for products without a photo: a refined monochrome
// line illustration on a soft botanical wash — never cartoonish. Admins
// can add a real photo via the admin panel (stored in products.image).
const LineJar = () => (
  <svg viewBox="0 0 96 116" fill="none" stroke="#795443" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M30 40v-6a10 10 0 0 1 10-10h16a10 10 0 0 1 10 10v6" />
    <rect x="24" y="40" width="48" height="66" rx="14" />
    <path d="M34 66h28M36 76h24" opacity="0.5" />
    <path d="M68 22c0 6-3.6 9.4-9 9.6C60 26 62.6 22.6 68 22z" opacity="0.65" />
  </svg>
)

export default function ProductArt({ art = 'jar', accent = '#C5A46D', className = '', title = '' }) {
  return (
    <div className={`art-wrap ${className}`} role="img" aria-label={title || 'تصویر محصول'}>
      <div className="product-art-placeholder">
        <LineJar />
      </div>
    </div>
  )
}
