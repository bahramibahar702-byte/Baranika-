import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { faNum } from '../lib/format.js'
import { useSettings, useToast } from '../lib/store.jsx'
import { IconLeaf, IconPhone, IconMail, IconPin, IconClock, IconInstagram, IconTelegram, IconWhatsapp, GLYPHS } from './Icons.jsx'

export default function Footer() {
  const settings = useSettings()
  const toast = useToast()
  const [cats, setCats] = useState([])
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api.get('/api/categories').then(setCats).catch(() => {})
  }, [])

  const subscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setBusy(true)
    try {
      const r = await api.post('/api/newsletter', { email })
      toast(r.message)
      setEmail('')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const socials = [
    settings?.instagram && { href: settings.instagram, label: 'اینستاگرام', Icon: IconInstagram },
    settings?.telegram && { href: settings.telegram, label: 'تلگرام', Icon: IconTelegram },
    settings?.whatsapp && { href: settings.whatsapp, label: 'واتس‌اپ', Icon: IconWhatsapp },
  ].filter(Boolean)

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand">
              <span className="brand-mark" style={{ background: 'rgba(248,244,234,0.12)' }}>
                <IconLeaf size={22} style={{ color: '#C5A46D' }} />
              </span>
              <span>
                <span className="brand-name">بارانیکا</span>
                <span className="brand-sub" style={{ display: 'block' }}>BARANIKA</span>
              </span>
            </div>
            <p className="footer-desc">
              بارانیکا فروشگاه محصولات طبیعی و سنتی است؛ طبیعی انتخاب کن، با خیال آسوده زندگی کن.
            </p>
            {socials.length > 0 && (
              <div className="socials">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                    <s.Icon size={17} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4>دسترسی سریع</h4>
            <ul>
              <li><Link to="/shop">فروشگاه</Link></li>
              <li><Link to="/about">درباره ما</Link></li>
              <li><Link to="/contact">تماس با ما</Link></li>
              <li><Link to="/faq">پرسش‌های متداول</Link></li>
              <li><Link to="/cart">سبد خرید</Link></li>
            </ul>
          </div>

          <div>
            <h4>دسته‌بندی‌ها</h4>
            <ul>
              {cats.slice(0, 6).map((c) => (
                <li key={c.id}><Link to={`/category/${c.slug}`}>{c.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>تماس با ما</h4>
            <ul className="footer-contact">
              <li><IconPhone size={16} /><span dir="ltr">{settings?.phone || '—'}</span></li>
              <li><IconMail size={16} /><span dir="ltr">{settings?.email || '—'}</span></li>
              <li><IconPin size={16} /><span>{settings?.address || '—'}</span></li>
              <li><IconClock size={16} /><span>{settings?.work_hours || '—'}</span></li>
            </ul>
            <h4 style={{ marginTop: 18 }}>خبرنامه بارانیکا</h4>
            <form className="newsletter-form" onSubmit={subscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ایمیل شما"
                aria-label="ایمیل برای خبرنامه"
                dir="ltr"
              />
              <button className="btn btn-gold btn-sm" disabled={busy}>عضویت</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date())} بارانیکا — تمامی حقوق محفوظ است.</span>
          <span>
            <Link to="/terms">قوانین و شرایط خرید</Link> · <Link to="/privacy">حریم خصوصی</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
