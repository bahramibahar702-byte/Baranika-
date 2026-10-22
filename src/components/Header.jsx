import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart, useSettings } from '../lib/store.jsx'
import { IconSearch, IconCart, IconMenu, IconX, IconLeaf } from './Icons.jsx'

const NAV = [
  { to: '/', label: 'خانه' },
  { to: '/shop', label: 'فروشگاه' },
  { to: '/categories', label: 'دسته‌بندی محصولات' },
  { to: '/shop?flag=bestseller', label: 'پرفروش‌ها' },
  { to: '/about', label: 'درباره ما' },
  { to: '/contact', label: 'تماس با ما' },
]

function BrandMark() {
  return (
    <Link to="/" className="brand" aria-label="بارانیکا — صفحه اصلی">
      <span className="brand-mark">
        <IconLeaf size={22} style={{ color: '#F8F4EA' }} />
      </span>
      <span>
        <span className="brand-name">بارانیکا</span>
        <span className="brand-sub" style={{ display: 'block' }}>BARANIKA</span>
      </span>
    </Link>
  )
}

export default function Header() {
  const settings = useSettings()
  const { cartCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const submitSearch = (e) => {
    e.preventDefault()
    const term = q.trim()
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop')
    setQ('')
    setMenuOpen(false)
  }

  return (
    <header>
      <div className="announce">{settings?.announcement || ''}</div>
      <div className="header">
        <div className="container header-row">
          <BrandMark />
          <nav className="main-nav" aria-label="ناوبری اصلی">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <form className="search-form desktop" onSubmit={submitSearch} role="search">
              <IconSearch size={17} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی محصول…" aria-label="جستجوی محصول" />
            </form>
            <button className="icon-btn menu-toggle" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} aria-label="منو">
              {menuOpen ? <IconX size={20} /> : <IconMenu size={20} />}
            </button>
            <Link to="/cart" className="icon-btn" aria-label={`سبد خرید، ${cartCount} مورد`}>
              <IconCart size={20} />
              {cartCount > 0 && <span className="badge-count">{new Intl.NumberFormat('fa-IR').format(cartCount)}</span>}
            </Link>
          </div>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="ناوبری موبایل">
            <form className="search-form mobile-search" onSubmit={submitSearch} role="search">
              <IconSearch size={17} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی محصول…" aria-label="جستجوی محصول" />
            </form>
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
