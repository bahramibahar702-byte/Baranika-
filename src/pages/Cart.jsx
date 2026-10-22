import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useCart, useSettings } from '../lib/store.jsx'
import { EmptyState, QtyStepper } from '../components/Ui.jsx'
import ProductArt from '../components/ProductArt.jsx'
import { faPrice, faNum } from '../lib/format.js'
import { IconTrash, IconCart, IconAlert } from '../components/Icons.jsx'

export default function Cart() {
  const { cart, setQty, removeFromCart } = useCart()
  const settings = useSettings()
  const navigate = useNavigate()
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let live = true
    if (!cart.length) {
      setRows([])
      return
    }
    api.get(`/api/products?ids=${cart.map((i) => i.id).join(',')}`)
      .then((products) => {
        if (!live) return
        const byId = new Map(products.map((p) => [p.id, p]))
        setRows(cart.map((i) => ({ ...i, product: byId.get(i.id) })).filter((r) => r.product))
      })
      .catch(() => live && setError(true))
    return () => { live = false }
  }, [cart])

  if (error) return <div className="container"><EmptyState icon={<IconAlert size={46} />} title="خطا در بارگذاری سبد" text="دوباره تلاش کنید." /></div>
  if (!rows) return <div className="spinner" role="status" />

  if (!rows.length) {
    return (
      <div className="container">
        <EmptyState icon={<IconCart size={46} />} title="سبد خرید شما خالی است" text="از فروشگاه محصولات طبیعی بارانیکا دیدن کنید.">
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>مشاهده محصولات</Link>
        </EmptyState>
      </div>
    )
  }

  const subtotal = rows.reduce((s, r) => s + r.product.price * r.qty, 0)
  const threshold = Number(settings?.free_shipping_threshold) || 0
  const shippingCost = Number(settings?.shipping_cost) || 0
  const shipping = threshold > 0 && subtotal >= threshold ? 0 : shippingCost
  const total = subtotal + shipping

  return (
    <div className="container" style={{ paddingBlock: '34px 56px' }}>
      <h1 style={{ fontSize: '1.4rem', marginBottom: 20 }}>سبد خرید</h1>
      <div className="cart-layout">
        <div className="panel">
          {rows.map((r) => (
            <div className="cart-row" key={r.id}>
              <div className="cart-thumb">
                {r.product.image
                  ? <img src={r.product.image} alt={r.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <ProductArt art={r.product.art} accent={r.product.accent_hint} title={r.product.name} />}
              </div>
              <div>
                <div className="cart-name"><Link to={`/product/${r.product.slug}`}>{r.product.name}</Link></div>
                <div className="cart-weight">{r.product.weight}</div>
                {r.qty > r.product.stock && <span className="tag tag-out">موجودی کافی نیست ({faNum(r.product.stock)})</span>}
              </div>
              <QtyStepper
                small
                value={r.qty}
                min={0}
                max={Math.max(1, r.product.stock)}
                onChange={(v) => setQty(r.id, v)}
              />
              <div className="price" style={{ minWidth: 110 }}>{faPrice(r.product.price * r.qty)}</div>
              <button className="remove-btn" onClick={() => removeFromCart(r.id)}>
                <IconTrash size={15} /> حذف
              </button>
            </div>
          ))}
        </div>

        <div className="panel panel-pad">
          <h2 style={{ fontSize: '1.05rem', marginBottom: 12 }}>خلاصه سفارش</h2>
          <div className="summary-row"><span>جمع کالاها</span><span>{faPrice(subtotal)}</span></div>
          <div className="summary-row"><span>هزینه ارسال</span><span>{shipping === 0 ? 'رایگان' : faPrice(shipping)}</span></div>
          {threshold > 0 && subtotal < threshold && (
            <div className="free-ship-hint">
              با {faPrice(threshold - subtotal)} خرید بیشتر، ارسال رایگان می‌شود.
            </div>
          )}
          <div className="summary-row total"><span>مبلغ نهایی</span><span>{faPrice(total)}</span></div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => navigate('/checkout')}>
            ادامه و ثبت سفارش
          </button>
          <Link to="/shop" className="btn btn-soft" style={{ width: '100%', marginTop: 10 }}>ادامه خرید</Link>
        </div>
      </div>
    </div>
  )
}
