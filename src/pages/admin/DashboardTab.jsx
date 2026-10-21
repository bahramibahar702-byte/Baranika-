import { useEffect, useState } from 'react'
import { adminFetch } from '../../lib/admin-auth.js'
import { faPrice, faNum, faDate } from '../../lib/format.js'
import { Link } from 'react-router-dom'

export default function DashboardTab({ onGoTo }) {
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    adminFetch('/api/admin/stats').then(setStats).catch(() => {})
    adminFetch('/api/admin/orders').then(setOrders).catch(() => {})
  }, [])

  if (!stats) return <div className="spinner" role="status" />

  return (
    <>
      <h2>داشبورد</h2>
      <div className="stat-grid">
        <div className="stat-card"><b>{faNum(stats.active_products)}</b><span>محصول فعال</span></div>
        <div className="stat-card"><b>{faNum(stats.orders)}</b><span>کل سفارش‌ها</span></div>
        <div className="stat-card"><b>{faNum(stats.pending_orders)}</b><span>سفارش در انتظار بررسی</span></div>
        <div className="stat-card"><b>{faPrice(stats.total_sales)}</b><span>مجموع سفارش‌ها (بدون لغوشده)</span></div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-sm" onClick={() => onGoTo('products')}>مدیریت محصولات</button>
        <button className="btn btn-outline btn-sm" onClick={() => onGoTo('orders')}>مدیریت سفارش‌ها</button>
      </div>
      <h2 style={{ fontSize: '1rem' }}>آخرین سفارش‌ها</h2>
      {orders.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>هنوز سفارشی ثبت نشده است.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>شماره</th><th>مشتری</th><th>تاریخ</th><th>مبلغ</th><th>وضعیت</th></tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((o) => (
              <tr key={o.id}>
                <td dir="ltr"><Link to="/">{o.order_number}</Link></td>
                <td>{o.customer_name}</td>
                <td>{faDate(o.created_at)}</td>
                <td>{faPrice(o.total)}</td>
                <td><span className="chip">{o.status_label}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
