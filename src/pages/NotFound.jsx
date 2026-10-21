import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container">
      <div className="state-box" style={{ paddingBlock: '80px 60px' }}>
        <div className="big" aria-hidden="true">🍃</div>
        <h1 style={{ fontSize: '1.5rem' }}>صفحه‌ای که دنبالش بودید پیدا نشد</h1>
        <p>شاید نشانی را اشتباه وارد کرده‌اید یا این صفحه جابه‌جا شده است.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">صفحه اصلی</Link>
          <Link to="/shop" className="btn btn-outline">فروشگاه</Link>
        </div>
      </div>
    </div>
  )
}
