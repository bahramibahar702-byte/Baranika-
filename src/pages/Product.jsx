import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import ProductCard from '../components/ProductCard.jsx'
import ProductArt from '../components/ProductArt.jsx'
import { SectionHead, ErrorState, QtyStepper } from '../components/Ui.jsx'
import { faPrice, faNum, discountPercent } from '../lib/format.js'
import { useCart, useFavorites, useToast } from '../lib/store.jsx'
import { IconCart, IconHeart, IconLeaf } from '../components/Icons.jsx'

export default function Product() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const [view, setView] = useState(0)
  const { addToCart } = useCart()
  const { favorites, toggleFavorite } = useFavorites()
  const toast = useToast()

  const load = () => {
    setProduct(null)
    setError(null)
    setQty(1)
    setView(0)
    api.get(`/api/products/${slug}`)
      .then((p) => {
        setProduct(p)
        setQty(1)
      })
      .catch((e) => setError(e.message))
  }
  useEffect(() => { load() }, [slug])

  if (error) {
    return (
      <div className="container">
        <ErrorState text={error} />
        <div style={{ textAlign: 'center', paddingBottom: 40 }}>
          <Link to="/shop" className="btn btn-outline">بازگشت به فروشگاه</Link>
        </div>
      </div>
    )
  }
  if (!product) return <div className="spinner" role="status" aria-label="در حال بارگذاری" />

  const off = discountPercent(product.price, product.old_price)
  const inStock = product.stock > 0
  const fav = favorites.includes(product.id)
  const views = product.image
    ? [product.image]
    : [
        <ProductArt key="a" art={product.art} accent={product.accent_hint} title={product.name} />,
        <ProductArt key="b" art={product.art === 'jar' ? 'tin' : 'jar'} accent={product.accent_hint} title={product.name} />,
      ]

  return (
    <div className="container" style={{ paddingBlock: '34px 56px' }}>
      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 18 }} aria-label="مسیر صفحه">
        <Link to="/">خانه</Link> / <Link to="/shop">فروشگاه</Link>
        {product.category_slug && <> / <Link to={`/category/${product.category_slug}`}>{product.category_name}</Link></>}
        {` / ${product.name}`}
      </nav>

      <div className="product-page">
        <div>
          <div className="gallery-main">
            {typeof views[view] === 'string' ? <img src={views[view]} alt={product.name} /> : views[view]}
            {off ? <span className="tag tag-off" style={{ position: 'absolute', top: 14, insetInlineStart: 14 }}>{faNum(off)}٪ تخفیف</span> : null}
          </div>
          {views.length > 1 && (
            <div className="gallery-thumbs">
              {views.map((v, i) => (
                <button key={i} className={`thumb ${i === view ? 'active' : ''}`} onClick={() => setView(i)} aria-label={`تصویر ${faNum(i + 1)}`}>
                  {typeof v === 'string' ? <img src={v} alt="" /> : v}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category_name && <span className="pd-cat">{product.category_name}</span>}
          <h1 className="pd-title">{product.name}</h1>
          <div className="pd-meta">
            {product.weight && <span className="meta-pill">وزن/بسته‌بندی: {product.weight}</span>}
            <span className={`stock-pill ${inStock ? 'stock-in' : 'stock-out'}`}>
              {inStock ? `موجود (${faNum(product.stock)} عدد)` : 'ناموجود'}
            </span>
          </div>
          <div className="pd-price-row">
            <div>
              {product.old_price ? <div className="old-price" style={{ marginBottom: 4 }}>{faPrice(product.old_price)}</div> : null}
              <div className="pd-price">{faPrice(product.price)}</div>
            </div>
          </div>
          <div className="pd-desc">{product.description || product.short_desc || 'توضیحات این محصول به‌زودی تکمیل می‌شود.'}</div>

          <div className="pd-actions">
            <QtyStepper value={qty} max={Math.max(1, product.stock)} onChange={(v) => setQty(Math.min(Math.max(1, v), Math.max(1, product.stock)))} />
            <button
              className="btn btn-primary"
              disabled={!inStock}
              onClick={() => {
                addToCart(product.id, qty)
                toast('به سبد خرید اضافه شد')
              }}
            >
              <IconCart size={18} /> افزودن به سبد خرید
            </button>
            <button
              className={`btn ${fav ? 'btn-gold' : 'btn-outline'}`}
              onClick={() => {
                toggleFavorite(product.id)
                toast(fav ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد')
              }}
            >
              <IconHeart size={17} /> {fav ? 'علاقه‌مندی شما' : 'افزودن به علاقه‌مندی‌ها'}
            </button>
          </div>

          {product.short_desc && (
            <p style={{ marginTop: 18, fontSize: '0.88rem', color: 'var(--muted)', display: 'flex', gap: 8, alignItems: 'center' }}>
              <IconLeaf size={16} style={{ color: 'var(--olive)' }} /> {product.short_desc}
            </p>
          )}
        </div>
      </div>

      {product.related?.length > 0 && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <SectionHead title="محصولات مشابه" sub={`از دسته‌ی «${product.category_name}»`} />
          <div className="product-grid">
            {product.related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
