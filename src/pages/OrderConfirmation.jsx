import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { faPrice, faNum, faDate } from '../lib/format.js'
import { useSettings } from '../lib/store.jsx'
import { Spinner, EmptyState } from '../components/Ui.jsx'
import { IconSearch, IconLeaf } from '../components/Icons.jsx'

export default function OrderConfirmation() {
  const { orderNumber } = useParams()
  const settings = useSettings()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.get(`/api/orders/${orderNumber}`).then(setOrder).catch(() => setError(true))
  }, [orderNumber])

  if (error) {
    return (
      <div className="container">
        <EmptyState icon={<IconSearch size={46} />} title="سفارش یافت نشد" text="شماره سفارش را بررسی کنید.">
          <Link to="/shop" className="btn btn-outline" style={{ marginTop: 14 }}>بازگشت به فروشگاه</Link>
        </EmptyState>
      </div>
    )
  }
  if (!order) return <div className="spinner" role="status" />

  return (
    <div className="container" style={{ paddingBlock: '34px 56px', maxWidth: 760 }}>
      <div className="panel panel-pad" style={{ textAlign: 'center' }}>
        <div className="confirm-mark" aria-hidden="true"><IconLeaf size={30} /></div>
        <h1 style={{ fontSize: '1.5rem', margin: '8px 0' }}>سفارش شما ثبت شد</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
          شماره سفارش: <b dir="ltr">{order.order_number}</b> · وضعیت فعلی: <b>{order.status_label}</b>
        </p>
        <div className="form-success" style={{ marginTop: 16, textAlign: 'start' }}>
          {settings?.payment_note || 'پرداخت آنلاین هنوز فعال نشده است؛ پس از بررسی سفارش، برای هماهنگی پرداخت و ارسال با شما تماس می‌گیریم.'}
        </div>
        <div style={{ textAlign: 'start', marginTop: 20 }}>
          <h2 style={{ fontSize: '1rem', marginBottom: 10 }}>اقلام سفارش</h2>
          {order.items.map((i) => (
            <div key={i.id} className="summary-row">
              <span>{i.name} × {faNum(i.qty)}</span>
              <span>{faPrice(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="summary-row"><span>هزینه ارسال</span><span>{order.shipping === 0 ? 'رایگان' : faPrice(order.shipping)}</span></div>
          <div className="summary-row total"><span>مبلغ نهایی</span><span>{faPrice(order.total)}</span></div>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 14 }}>
            تاریخ ثبت: {faDate(order.created_at)} · گیرنده: {order.customer_name}
          </p>
        </div>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: 22 }}>ادامه خرید</Link>
      </div>
    </div>
  )
}
