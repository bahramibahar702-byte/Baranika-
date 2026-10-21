import { useEffect, useState } from 'react'
import { adminFetch } from '../../lib/admin-auth.js'
import { faPrice, faNum, faDate } from '../../lib/format.js'
import { useToast } from '../../lib/store.jsx'
import { GLYPHS } from '../../components/Icons.jsx'

const STATUS_OPTIONS = [
  { v: 'pending', l: 'در انتظار بررسی' },
  { v: 'confirmed', l: 'تأیید شده' },
  { v: 'shipped', l: 'ارسال شده' },
  { v: 'delivered', l: 'تحویل شده' },
  { v: 'cancelled', l: 'لغو شده' },
]

// ----------------------------- Categories -----------------------------
export function CategoriesTab() {
  const [rows, setRows] = useState(null)
  const [editing, setEditing] = useState(null)
  const toast = useToast()

  const load = () => adminFetch('/api/admin/categories').then(setRows).catch(() => {})
  useEffect(() => { load() }, [])

  const save = async (form) => {
    try {
      if (form.id) await adminFetch(`/api/admin/categories/${form.id}`, { method: 'PUT', body: form })
      else await adminFetch('/api/admin/categories', { method: 'POST', body: form })
      toast('دسته ذخیره شد')
      setEditing(null)
      load()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const remove = async (c) => {
    if (!window.confirm(`«${c.name}» حذف شود؟ محصولات آن بدون دسته می‌شوند.`)) return
    try {
      await adminFetch(`/api/admin/categories/${c.id}`, { method: 'DELETE' })
      toast('دسته حذف شد')
      load()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <h2>دسته‌بندی‌ها</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setEditing({ name: '', slug: '', description: '', icon: 'leaf', sort_order: 0 })}>
          افزودن دسته
        </button>
      </div>
      {!rows ? <div className="spinner" role="status" /> : (
        <table className="data-table" style={{ marginTop: 16 }}>
          <thead><tr><th>آیکون</th><th>نام</th><th>اسلاگ</th><th>ترتیب</th><th></th></tr></thead>
          <tbody>
            {rows.map((c) => {
              const Glyph = GLYPHS[c.icon] || GLYPHS.leaf
              return (
                <tr key={c.id}>
                  <td><Glyph /></td>
                  <td style={{ fontWeight: 700 }}>{c.name}</td>
                  <td dir="ltr">{c.slug}</td>
                  <td>{faNum(c.sort_order)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-soft btn-sm" onClick={() => setEditing({ ...c })}>ویرایش</button>
                      <button className="remove-btn" onClick={() => remove(c)}>حذف</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      {editing && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <CategoryForm initial={editing} onClose={() => setEditing(null)} onSave={save} />
        </div>
      )}
    </>
  )
}

function CategoryForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial)
  const ICONS = ['honey', 'oil', 'grain', 'nut', 'cookie', 'herb', 'bottle', 'salt', 'leaf']
  return (
    <form className="modal" onSubmit={(e) => { e.preventDefault(); onSave(form) }}>
      <h3>{form.id ? 'ویرایش دسته' : 'دسته جدید'}</h3>
      <div className="field">
        <label>نام دسته *</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div className="form-grid">
        <div className="field">
          <label>اسلاگ (اختیاری)</label>
          <input dir="ltr" value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} disabled={!!form.id} />
        </div>
        <div className="field">
          <label>ترتیب نمایش</label>
          <input type="number" dir="ltr" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
        </div>
      </div>
      <div className="field">
        <label>آیکون</label>
        <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
          {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      <div className="field">
        <label>توضیح کوتاه</label>
        <input value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-primary">ذخیره</button>
        <button type="button" className="btn btn-soft" onClick={onClose}>انصراف</button>
      </div>
    </form>
  )
}

// ----------------------------- Orders -----------------------------
export function OrdersTab() {
  const [rows, setRows] = useState(null)
  const [open, setOpen] = useState(null)
  const toast = useToast()

  const load = () => adminFetch('/api/admin/orders').then(setRows).catch(() => {})
  useEffect(() => { load() }, [])

  const setStatus = async (o, status) => {
    try {
      await adminFetch(`/api/admin/orders/${o.id}`, { method: 'PATCH', body: { status } })
      toast('وضعیت سفارش به‌روزرسانی شد')
      load()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  return (
    <>
      <h2>سفارش‌ها</h2>
      {!rows ? <div className="spinner" role="status" /> : rows.length === 0 ? (
        <p style={{ color: 'var(--muted)', marginTop: 12 }}>هنوز سفارشی ثبت نشده است.</p>
      ) : (
        <table className="data-table" style={{ marginTop: 16 }}>
          <thead><tr><th>شماره</th><th>مشتری</th><th>موبایل</th><th>تاریخ</th><th>مبلغ</th><th>وضعیت</th><th></th></tr></thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id}>
                <td dir="ltr">{o.order_number}</td>
                <td style={{ fontWeight: 700 }}>{o.customer_name}</td>
                <td dir="ltr">{o.phone}</td>
                <td>{faDate(o.created_at)}</td>
                <td>{faPrice(o.total)}</td>
                <td>
                  <select className="status-select" value={o.status} onChange={(e) => setStatus(o, e.target.value)}>
                    {STATUS_OPTIONS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
                  </select>
                </td>
                <td><button className="btn btn-soft btn-sm" onClick={() => setOpen(open?.id === o.id ? null : o)}>جزئیات</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {open && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
          <div className="modal">
            <h3>سفارش <span dir="ltr">{open.order_number}</span></h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
              ثبت: {faDate(open.created_at)} · گیرنده: {open.customer_name} · <span dir="ltr">{open.phone}</span>
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 12 }}>نشانی: {open.address}</p>
            {open.notes && <p style={{ fontSize: '0.85rem', marginBottom: 12 }}>یادداشت: {open.notes}</p>}
            <table className="data-table">
              <thead><tr><th>محصول</th><th>تعداد</th><th>قیمت واحد</th><th>جمع</th></tr></thead>
              <tbody>
                {open.items.map((i) => (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td>{faNum(i.qty)}</td>
                    <td>{faPrice(i.price)}</td>
                    <td>{faPrice(i.price * i.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12 }}>
              <div className="summary-row"><span>جمع کالاها</span><span>{faPrice(open.subtotal)}</span></div>
              <div className="summary-row"><span>ارسال</span><span>{open.shipping === 0 ? 'رایگان' : faPrice(open.shipping)}</span></div>
              <div className="summary-row total"><span>مبلغ نهایی</span><span>{faPrice(open.total)}</span></div>
            </div>
            <button className="btn btn-soft" style={{ marginTop: 14 }} onClick={() => setOpen(null)}>بستن</button>
          </div>
        </div>
      )}
    </>
  )
}

// ----------------------------- Banners -----------------------------
const BANNER_FIELDS = [
  { kind: 'seasonal', title: 'بنر پیشنهاد فصلی' },
  { kind: 'collection', title: 'بنر مجموعه ویژه' },
]

export function BannersTab() {
  const [rows, setRows] = useState(null)
  const toast = useToast()

  const load = () => adminFetch('/api/admin/banners').then(setRows).catch(() => {})
  useEffect(() => { load() }, [])

  const save = async (kind, form) => {
    try {
      await adminFetch(`/api/admin/banners/${kind}`, { method: 'PUT', body: form })
      toast('بنر ذخیره شد')
      load()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  return (
    <>
      <h2>بنرهای صفحه اصلی</h2>
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 18 }}>
        بنرها فقط وقتی «فعال» باشند و بازه نمایش آن‌ها به امروز برخورد کند در صفحه اصلی دیده می‌شوند.
      </p>
      {!rows ? <div className="spinner" role="status" /> : (
        <div style={{ display: 'grid', gap: 18, maxWidth: 640 }}>
          {BANNER_FIELDS.map(({ kind, title }) => {
            const b = rows.find((r) => r.kind === kind)
            if (!b) return null
            return <BannerForm key={kind} title={title} initial={b} onSave={(form) => save(kind, form)} />
          })}
        </div>
      )}
    </>
  )
}

function BannerForm({ title, initial, onSave }) {
  const [form, setForm] = useState({ ...initial })
  return (
    <form className="panel panel-pad" onSubmit={(e) => { e.preventDefault(); onSave(form) }}>
      <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>{title}</h3>
      <div className="field">
        <label>عنوان</label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div className="field">
        <label>زیرعنوان</label>
        <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
      </div>
      <div className="form-grid">
        <div className="field">
          <label>متن دکمه</label>
          <input value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} />
        </div>
        <div className="field">
          <label>لینک دکمه</label>
          <input dir="ltr" value={form.cta_link} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} placeholder="/shop" />
        </div>
        <div className="field">
          <label>نمایش از تاریخ (میلادی، اختیاری)</label>
          <input type="date" dir="ltr" value={form.active_from || ''} onChange={(e) => setForm({ ...form, active_from: e.target.value })} />
        </div>
        <div className="field">
          <label>نمایش تا تاریخ (میلادی، اختیاری)</label>
          <input type="date" dir="ltr" value={form.active_to || ''} onChange={(e) => setForm({ ...form, active_to: e.target.value })} />
        </div>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', fontWeight: 700 }}>
        <input type="checkbox" checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
        فعال
      </label>
      <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>ذخیره بنر</button>
    </form>
  )
}

// ----------------------------- Settings -----------------------------
export function SettingsTab() {
  const [form, setForm] = useState(null)
  const toast = useToast()

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then(setForm).catch(() => {})
  }, [])

  if (!form) return <div className="spinner" role="status" />
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const save = async (e) => {
    e.preventDefault()
    try {
      await adminFetch('/api/admin/settings', { method: 'PUT', body: form })
      toast('تنظیمات ذخیره شد')
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  return (
    <>
      <h2>تنظیمات فروشگاه</h2>
      <form onSubmit={save} style={{ maxWidth: 640 }}>
        <div className="panel panel-pad">
          <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>اطلاع‌رسانی و ارسال</h3>
          <div className="field">
            <label>متن نوار اطلاع‌رسانی بالای سایت</label>
            <input value={form.announcement} onChange={(e) => set('announcement', e.target.value)} />
          </div>
          <div className="form-grid">
            <div className="field">
              <label>هزینه ارسال (تومان)</label>
              <input type="number" dir="ltr" min="0" value={form.shipping_cost} onChange={(e) => set('shipping_cost', e.target.value)} />
            </div>
            <div className="field">
              <label>سقف ارسال رایگان (تومان)</label>
              <input type="number" dir="ltr" min="0" value={form.free_shipping_threshold} onChange={(e) => set('free_shipping_threshold', e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>متن توضیح پرداخت (در صفحه ثبت سفارش نمایش داده می‌شود)</label>
            <textarea value={form.payment_note} onChange={(e) => set('payment_note', e.target.value)} style={{ minHeight: 70 }} />
          </div>
        </div>
        <div className="panel panel-pad" style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>اطلاعات تماس</h3>
          <div className="form-grid">
            <div className="field">
              <label>تلفن</label>
              <input dir="ltr" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
            <div className="field">
              <label>ایمیل</label>
              <input dir="ltr" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </div>
            <div className="field">
              <label>اینستاگرام (لینک، اختیاری)</label>
              <input dir="ltr" value={form.instagram} onChange={(e) => set('instagram', e.target.value)} />
            </div>
            <div className="field">
              <label>تلگرام (لینک، اختیاری)</label>
              <input dir="ltr" value={form.telegram} onChange={(e) => set('telegram', e.target.value)} />
            </div>
            <div className="field">
              <label>واتس‌اپ (لینک، اختیاری)</label>
              <input dir="ltr" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
            </div>
            <div className="field">
              <label>ساعات کاری</label>
              <input value={form.work_hours} onChange={(e) => set('work_hours', e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>نشانی</label>
            <textarea value={form.address} onChange={(e) => set('address', e.target.value)} style={{ minHeight: 70 }} />
          </div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 16 }}>ذخیره تنظیمات</button>
      </form>
    </>
  )
}
