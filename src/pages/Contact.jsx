import { useState } from 'react'
import { api } from '../lib/api.js'
import { useSettings } from '../lib/store.jsx'
import { IconPhone, IconMail, IconPin, IconClock } from '../components/Icons.jsx'

export default function Contact() {
  const settings = useSettings()
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [error, setError] = useState('')
  const [done, setDone] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setDone('')
    setBusy(true)
    try {
      const r = await api.post('/api/contact', form)
      setDone(r.message)
      setForm({ name: '', phone: '', email: '', message: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>تماس با ما</h1>
          <p>پرسش، پیشنهاد یا بازخورد خود را برای ما بنویسید؛ پاسخ‌گویی و احترام به مشتری از اولویت‌های بارانیکاست.</p>
        </div>
      </div>
      <div className="container" style={{ paddingBlock: '0 56px' }}>
        <div className="contact-layout">
          <div className="panel panel-pad">
            <h2 style={{ fontSize: '1.05rem', marginBottom: 10 }}>اطلاعات تماس</h2>
            <ul className="contact-info">
              <li><IconPhone size={18} /><span dir="ltr">{settings?.phone || '—'}</span></li>
              <li><IconMail size={18} /><span dir="ltr">{settings?.email || '—'}</span></li>
              <li><IconPin size={18} /><span>{settings?.address || '—'}</span></li>
              <li><IconClock size={18} /><span>{settings?.work_hours || '—'}</span></li>
            </ul>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 12 }}>
              * اطلاعات تماس فعلی نمونه است و تا اعلام اطلاعات واقعی کسب‌وکار، قابل ویرایش در پنل مدیریت می‌ماند.
            </p>
          </div>
          <form className="panel panel-pad" onSubmit={submit} noValidate>
            <h2 style={{ fontSize: '1.05rem', marginBottom: 14 }}>ارسال پیام</h2>
            {error && <div className="form-error">{error}</div>}
            {done && <div className="form-success">{done}</div>}
            <div className="form-grid">
              <div className="field">
                <label htmlFor="ct-name">نام *</label>
                <input id="ct-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="ct-phone">شماره تماس</label>
                <input id="ct-phone" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="ct-email">ایمیل</label>
              <input id="ct-email" dir="ltr" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="ct-msg">پیام *</label>
              <textarea id="ct-msg" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <button className="btn btn-primary" disabled={busy}>{busy ? 'در حال ارسال…' : 'ارسال پیام'}</button>
          </form>
        </div>
      </div>
    </>
  )
}
