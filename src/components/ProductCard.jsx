import { Link } from 'react-router-dom'
import ProductArt from './ProductArt.jsx'
import { faNum, faPrice, discountPercent } from '../lib/format.js'
import { useCart, useFavorites, useToast } from '../lib/store.jsx'
import { IconCart, IconHeart } from './Icons.jsx'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { favorites, toggleFavorite } = useFavorites()
  const toast = useToast()
  const off = discountPercent(product.price, product.old_price)
  const fav = favorites.includes(product.id)
  const inStock = product.stock > 0

  return (
    <article className="product-card">
      <div className="product-media">
        <Link to={`/product/${product.slug}`} className="cover" aria-label={product.name} />
        <div className="product-badges">
          {product.is_new ? <span className="tag tag-new">جدید</span> : null}
          {off ? <span className="tag tag-off">{faNum(off)}٪ تخفیف</span> : null}
          {!inStock ? <span className="tag tag-out">ناموجود</span> : null}
        </div>
        <button
          className={`fav-btn ${fav ? 'active' : ''}`}
          onClick={() => {
            toggleFavorite(product.id)
            toast(fav ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد')
          }}
          aria-label={fav ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        >
          <IconHeart size={17} />
        </button>
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <ProductArt art={product.art} accent={product.accent_hint} title={product.name} />
        )}
      </div>
      <div className="product-body">
        {product.category_name && <span className="product-cat">{product.category_name}</span>}
        <h3 className="product-name"><Link to={`/product/${product.slug}`}>{product.name}</Link></h3>
        {product.weight && <span className="weight-hint">{product.weight}</span>}
        <div className="product-foot">
          <div className="price-box">
            {product.old_price ? <div className="old-price">{faPrice(product.old_price)}</div> : null}
            <div className="price">{faPrice(product.price)}</div>
          </div>
          <button
            className="add-btn"
            disabled={!inStock}
            onClick={() => {
              addToCart(product.id)
              toast('به سبد خرید اضافه شد')
            }}
            aria-label={`افزودن ${product.name} به سبد خرید`}
          >
            <IconCart size={18} />
          </button>
        </div>
      </div>
    </article>
  )
}

export function ProductGridSkeleton({ count = 4 }) {
  return (
    <div className="product-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton skeleton-card" />
      ))}
    </div>
  )
}
