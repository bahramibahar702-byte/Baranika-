import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import ProductCard, { ProductGridSkeleton } from '../components/ProductCard.jsx'
import { EmptyState, ErrorState, Spinner } from '../components/Ui.jsx'
import { GLYPHS, IconSearch } from '../components/Icons.jsx'
import { faNum } from '../lib/format.js'

const SORTS = [
  { v: '', label: 'مرتب‌سازی پیش‌فرض' },
  { v: 'newest', label: 'جدیدترین' },
  { v: 'price_asc', label: 'ارزان‌ترین' },
  { v: 'price_desc', label: 'گران‌ترین' },
]

export default function Shop({ presetCategory = '' }) {
  const [params, setParams] = useSearchParams()
  const [cats, setCats] = useState([])
  const [products, setProducts] = useState(null)
  const [error, setError] = useState(false)

  const q = params.get('q') || ''
  const flag = params.get('flag') || ''
  const sort = params.get('sort') || ''
  const category = presetCategory || params.get('category') || ''
  const inStockOnly = params.get('stock') === '1'

  useEffect(() => {
    api.get('/api/categories').then(setCats).catch(() => {})
  }, [])

  useEffect(() => {
    let live = true
    setProducts(null)
    setError(false)
    const usp = new URLSearchParams()
    if (q) usp.set('q', q)
    if (category) usp.set('category', category)
    if (flag) usp.set('flag', flag)
    if (sort) usp.set('sort', sort)
    api.get(`/api/products?${usp}`)
      .then((list) => live && setProducts(list))
      .catch(() => live && setError(true))
    return () => { live = false }
  }, [q, category, flag, sort])

  const shown = useMemo(
    () => (products && inStockOnly ? products.filter((p) => p.stock > 0) : products),
    [products, inStockOnly],
  )

  const update = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const activeCat = cats.find((c) => c.slug === category)

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>{activeCat ? activeCat.name : flag === 'bestseller' ? 'پرفروش‌ها' : 'فروشگاه بارانیکا'}</h1>
          <p>
            {q
              ? `نتایج جستجو برای «${q}»`
              : activeCat?.description || 'همه‌ی محصولات طبیعی و سنتی بارانیکا در یک نگاه'}
          </p>
        </div>
      </div>

      <div className="container">
        <div className="shop-layout">
          <aside className="filters" aria-label="فیلترها">
            <div className="filter-group">
              <h3>دسته‌بندی‌ها</h3>
              <label className={!category ? 'active' : ''}>
                <input
                  type="radio"
                  name="category"
                  checked={!category}
                  onChange={() => update('category', '')}
                />
                همه محصولات
              </label>
              {cats.map((c) => {
                const Glyph = GLYPHS[c.icon] || GLYPHS.leaf
                return (
                  <label key={c.id} className={category === c.slug ? 'active' : ''}>
                    <input
                      type="radio"
                      name="category"
                      checked={category === c.slug}
                      onChange={() => update('category', c.slug)}
                    />
                    {c.image ? <img className="filter-thumb" src={c.image} alt="" loading="lazy" /> : <Glyph />} {c.name}
                  </label>
                )
              })}
            </div>
            <div className="filter-group">
              <h3>موجودی</h3>
              <label className={inStockOnly ? 'active' : ''}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => update('stock', e.target.checked ? '1' : '')}
                />
                فقط کالاهای موجود
              </label>
            </div>
            {(q || flag) && (
              <div className="filter-group">
                <h3>فیلترهای فعال</h3>
                {q && <span className="chip">جستجو: {q}</span>}
                {flag === 'bestseller' && <span className="chip">پرفروش‌ها</span>}
                {flag === 'new' && <span className="chip">جدیدترین</span>}
                {flag === 'featured' && <span className="chip">پیشنهاد ویژه</span>}
              </div>
            )}
          </aside>

          <div>
            <div className="shop-topbar">
              <span className="result-count">
                {shown ? `${faNum(shown.length)} محصول` : 'در حال بارگذاری…'}
              </span>
              <select
                className="sort-select"
                value={sort}
                onChange={(e) => update('sort', e.target.value)}
                aria-label="مرتب‌سازی"
              >
                {SORTS.map((s) => (
                  <option key={s.v} value={s.v}>{s.label}</option>
                ))}
              </select>
            </div>

            {error ? (
              <ErrorState onRetry={() => update('sort', sort)} />
            ) : !shown ? (
              <div className="product-grid">
                {Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton skeleton-card" />)}
              </div>
            ) : shown.length === 0 ? (
              <EmptyState
                icon={<IconSearch size={46} />}
                title="محصولی پیدا نشد"
                text="فیلترها را تغییر دهید یا عبارت دیگری را جستجو کنید."
              >
                <Link to="/shop" className="btn btn-outline btn-sm" style={{ marginTop: 14 }}>حذف فیلترها</Link>
              </EmptyState>
            ) : (
              <div className="product-grid">
                {shown.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
