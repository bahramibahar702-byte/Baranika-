import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useCart, useSettings, useToast } from '../lib/store.jsx'
import ProductArt from '../components/ProductArt.jsx'
import { faPrice, faNum } from '../lib/format.js'

export default function Checkout() {
  const { cart, clearCart } = useCart()
  const settings = useSettings()
  const toast = useToast()
  const navigate = useNavigate()
  const [rows, setRows] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!cart.length) {
      setRows([])
      return
    }
    api.get(`/api/products?ids=${cart.map((i) => i.id).join(',')}`)
      .then((products) => {
        const byId = new Map(products.map((p) => [p.id, p]))
        setRows(cart.map((i) => ({ ...i, product: byId.get(i.id) })).filter((r) => r.product))
      })
      .catch(() => setRows([]))
  }, [cart])

  if (!rows) return <div className="spinner" role="status" />
  if (!rows.length) {
    return (
      <div className="container">
        <div className="state-box">
          <h3>سبد خرید خالی است</h3>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: 14 }}>مشاهده محصولات</Link>
        </div>
      </div>
    )
  }

  const subtotal = rows.reduce((s, r) => s + r.product.price * r.qty, 0)
  const threshold = Number(settings?.free_shipping_threshold) || 0
  const shippingCost = Number(settings?.shipping_cost) || 0
  const shipping = threshold > 0 && subtotal >= threshold ? 0 : shippingCost
  const total = subtotal + shipping

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'نام و نام خانوادگی را وارد کنید'
    if (!/^09\d{9}$/.test(form.phone.trim())) e.phone = 'شماره موبایل به شکل 09xxxxxxxxx'
    if (form.address.trim().length < 10) e.address = 'نشانی را کامل‌تر وارد کنید (شهر، خیابان، پلاک…)'
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return
    setBusy(true)
    try {
      const order = await api.post('/api/orders', {
        ...form,
        items: rows.map((r) => ({ id: r.id, qty: r.qty })),
      })
      clearCart()
      toast('سفارش شما با موفقیت ثبت شد')
      navigate(`/order/${order.order_number}`)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container" style={{ paddingBlock: '34px 56px' }}>
      <h1 style={{ fontSize: '1.4rem', marginBottom: 20 }}>ثبت سفارش</h1>
      <div className="cart-layout">
        <form className="panel panel-pad" onSubmit={submit} noValidate>
          <h2 style={{ fontSize: '1.05rem', marginBottom: 14 }}>اطلاعات گیرنده</h2>
          {serverError && <div className="form-error">{serverError}</div>}
          <div className="form-grid">
            <div className="field">
              <label htmlFor="co-name">نام و نام خانوادگی *</label>
              <input id="co-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <div className="form-error" style={{ marginTop: 6 }}>{errors.name}</div>}
            </div>
            <div className="field">
              <label htmlFor="co-phone">شماره موبایل *</label>
              <input id="co-phone" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09xxxxxxxxx" />
              {errors.phone && <div className="form-error" style={{ marginTop: 6 }}>{errors.phone}</div>}
            </div>
          </div>
          <div className="field">
            <label htmlFor="co-address">نشانی تحویل *</label>
            <textarea id="co-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="استان، شهر، خیابان، پلاک و کد پستی" />
            {errors.address && <div className="form-error" style={{ marginTop: 6 }}>{errors.address}</div>}
          </div>
          <div className="field">
            <label htmlFor="co-notes">یادداشت سفارش (اختیاری)</label>
            <textarea id="co-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ minHeight: 80 }} />
          </div>
          <div className="form-success">
            {settings?.payment_note || 'پرداخت آنلاین هنوز فعال نشده است؛ سفارش شما ثبت می‌شود و برای هماهنگی پرداخت با شما تماس می‌گیریم.'}
          </div>
          <button className="btn btn-primary" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'در حال ثبت…' : 'ثبت سفارش'}
          </button>
        </form>

        <div className="panel panel-pad">
          <h2 style={{ fontSize: '1.05rem', marginBottom: 12 }}>سفارش شما</h2>
          {rows.map((r) => (
            <div key={r.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed var(--line)' }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                {r.product.image
                  ? <img src={r.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <ProductArt art={r.product.art} accent={r.product.accent_hint} />}
              </div>
              <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 700 }}>
                {r.product.name}
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{faNum(r.qty)} عدد</div>
              </div>
              <div className="price" style={{ fontSize: '0.85rem' }}>{faPrice(r.product.price * r.qty)}</div>
            </div>
          ))}
          <div style={{ marginTop: 12 }}>
            <div className="summary-row"><span>جمع کالاها</span><span>{faPrice(subtotal)}</span></div>
            <div className="summary-row"><span>هزینه ارسال</span><span>{shipping === 0 ? 'رایگان' : faPrice(shipping)}</span></div>
            <div className="summary-row total"><span>مبلغ نهایی</span><span>{faPrice(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
