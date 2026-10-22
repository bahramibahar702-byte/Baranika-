import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../lib/api.js'
import { getToken, setToken, clearToken } from '../../lib/admin-auth.js'
import { useToast } from '../../lib/store.jsx'
import { IconLeaf, IconBox, IconTag, IconTruck, IconImage, IconSettings, IconChart } from '../../components/Icons.jsx'
import DashboardTab from './DashboardTab.jsx'
import AdminProducts from './AdminProducts.jsx'
import { CategoriesTab, OrdersTab, BannersTab, SettingsTab } from './AdminRest.jsx'

const TABS = [
  { key: 'dashboard', label: 'داشبورد', Icon: IconChart },
  { key: 'products', label: 'محصولات', Icon: IconBox },
  { key: 'categories', label: 'دسته‌بندی‌ها', Icon: IconTag },
  { key: 'orders', label: 'سفارش‌ها', Icon: IconTruck },
  { key: 'banners', label: 'بنرها', Icon: IconImage },
  { key: 'settings', label: 'تنظیمات', Icon: IconSettings },
]

function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const toast = useToast()

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const r = await api.post('/api/admin/login', { password })
      setToken(r.token)
      window.location.reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <span className="brand-mark"><IconLeaf size={22} style={{ color: '#F8F4EA' }} /></span>
        <h2 style={{ fontSize: '1.2rem' }}>پنل مدیریت بارانیکا</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '8px 0 18px' }}>
          برای ورود، رمز مدیریت را وارد کنید.
        </p>
        {error && <div className="form-error">{error}</div>}
        <div className="field" style={{ textAlign: 'start' }}>
          <label htmlFor="admin-pass">رمز عبور</label>
          <input id="admin-pass" type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy || !password}>
          {busy ? 'در حال ورود…' : 'ورود'}
        </button>
        <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginTop: 14 }}>
          بازگشت به فروشگاه
        </Link>
      </form>
    </div>
  )
}

export default function AdminApp() {
  const navigate = useNavigate()
  const toast = useToast()
  const [tab, setTab] = useState('dashboard')

  if (!getToken()) return <Login />

  const logout = () => {
    clearToken()
    toast('از پنل مدیریت خارج شدید')
    navigate('/')
  }

  return (
    <div className="admin">
      <div className="admin-topbar">
        <span className="brand-mark" style={{ background: 'rgba(248,244,234,0.12)', width: 34, height: 34 }}>
          <IconLeaf size={17} style={{ color: '#C5A46D' }} />
        </span>
        <span className="brand-name">پنل مدیریت بارانیکا</span>
        <Link to="/" style={{ fontSize: '0.82rem', color: 'rgba(248,244,234,0.8)' }}>مشاهده فروشگاه</Link>
        <button className="btn btn-gold btn-sm" onClick={logout}>خروج</button>
      </div>
      <div className="admin-layout">
        <nav className="admin-nav" aria-label="بخش‌های مدیریت">
          {TABS.map((t) => (
            <button key={t.key} className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>
              <t.Icon size={18} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-content">
          {tab === 'dashboard' && <DashboardTab onGoTo={setTab} />}
          {tab === 'products' && <AdminProducts />}
          {tab === 'categories' && <CategoriesTab />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'banners' && <BannersTab />}
          {tab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  )
}
