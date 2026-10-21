import { useEffect, useState } from 'react'
import { adminFetch } from '../../lib/admin-auth.js'
import ProductArt from '../../components/ProductArt.jsx'
import { faPrice, faNum } from '../../lib/format.js'
import { useToast } from '../../lib/store.jsx'
import { IconPlus, IconTrash } from '../../components/Icons.jsx'

export const ART_OPTIONS = ['jar', 'tin', 'pouch', 'bag', 'box', 'cubes', 'cookies', 'bottle', 'oilbottle']
export const ART_LABELS = {
  jar: 'شیشه/عسلی', tin: 'قوطی', pouch: 'پاکت', bag: 'کیسه', box: 'جعبه',
  cubes: 'حبه/مکعب', cookies: 'کلوچه', bottle: 'بطری', oilbottle: 'بطری روغن',
}
export const DEFAULT_ART_OPTIONS = ART_OPTIONS

const EMPTY = {
  name: '', slug: '', category_id: '', short_desc: '', description: '', price: '',
  old_price: '', weight: '', stock: '', featured: false, is_new: false, bestseller: false,
  active: true, art: 'jar', accent_hint: '#C5A46D', image: '',
}

function ProductForm({ initial, cats, onSaved, onClose }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const pickImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 1.5 * 1024 * 1024) {
      setError('حجم تصویر باید کمتر از ۱٫۵ مگابایت باشد')
      return
    }
    const reader = new FileReader()
    reader.onload = () => set('image', reader.result)
    reader.readAsDataURL(file)
  }

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const body = {
        ...form,
        category_id: form.category_id || null,
        price: Number(form.price),
        old_price: form.old_price ? Number(form.old_price) : null,
        stock: Number(form.stock) || 0,
        image: form.image || null,
      }
      if (form.id) await adminFetch(`/api/admin/products/${form.id}`, { method: 'PUT', body })
      else await adminFetch('/api/admin/products', { method: 'POST', body })
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={save}>
        <h3>{form.id ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h3>
        {error && <div className="form-error">{error}</div>}
        <div className="form-grid">
          <div className="field">
            <label>نام محصول *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </div>
          <div className="field">
            <label>اسلاگ (انگلیسی، اختیاری)</label>
            <input dir="ltr" value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="auto" />
          </div>
          <div className="field">
            <label>دسته‌بندی</label>
            <select value={form.category_id || ''} onChange={(e) => set('category_id', e.target.value)}>
              <option value="">— بدون دسته —</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>وزن / بسته‌بندی</label>
            <input value={form.weight} onChange={(e) => set('weight', e.target.value)} placeholder="مثلاً ۵۰۰ گرم" />
          </div>
          <div className="field">
            <label>قیمت (تومان) *</label>
            <input type="number" dir="ltr" min="1" value={form.price} onChange={(e) => set('price', e.target.value)} required />
          </div>
          <div className="field">
            <label>قیمت پیش از تخفیف (اختیاری)</label>
            <input type="number" dir="ltr" min="0" value={form.old_price} onChange={(e) => set('old_price', e.target.value)} />
          </div>
          <div className="field">
            <label>موجودی</label>
            <input type="number" dir="ltr" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} />
          </div>
          <div className="field">
            <label>نوع تصویرسازی پیش‌فرض</label>
            <select value={form.art} onChange={(e) => set('art', e.target.value)}>
              {ART_OPTIONS.map((a) => <option key={a} value={a}>{ART_LABELS[a]}</option>)}
            </select>
          </div>
          <div className="field">
            <label>رنگ تصویرسازی</label>
            <input type="color" value={form.accent_hint || '#C5A46D'} onChange={(e) => set('accent_hint', e.target.value)} style={{ height: 42, padding: 4 }} />
          </div>
          <div className="field">
            <label>تصویر محصول (اختیاری، حداکثر ۱٫۵MB)</label>
            <input type="file" accept="image/*" onChange={pickImage} />
            {form.image && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={form.image} alt="پیش‌نمایش" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
                <button type="button" className="remove-btn" onClick={() => set('image', '')}>حذف تصویر</button>
              </div>
            )}
          </div>
        </div>
        <div className="field">
          <label>توضیح کوتاه</label>
          <input value={form.short_desc} onChange={(e) => set('short_desc', e.target.value)} />
        </div>
        <div className="field">
          <label>توضیحات کامل</label>
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div className="check-row">
          <label><input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} /> فعال</label>
          <label><input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /> پیشنهاد ویژه</label>
          <label><input type="checkbox" checked={form.is_new} onChange={(e) => set('is_new', e.target.checked)} /> جدید</label>
          <label><input type="checkbox" checked={form.bestseller} onChange={(e) => set('bestseller', e.target.checked)} /> پرفروش</label>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button className="btn btn-primary" disabled={busy}>{busy ? 'در حال ذخیره…' : 'ذخیره'}</button>
          <button type="button" className="btn btn-soft" onClick={onClose}>انصراف</button>
        </div>
      </form>
    </div>
  )
}

export default function AdminProducts() {
  const [rows, setRows] = useState(null)
  const [cats, setCats] = useState([])
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null)
  const toast = useToast()

  const load = () => {
    adminFetch('/api/admin/categories').then(setCats).catch(() => {})
    adminFetch(`/api/admin/products${q ? `?q=${encodeURIComponent(q)}` : ''}`).then(setRows).catch(() => {})
  }
  useEffect(() => { load() }, [])
  useEffect(() => {
    const t = setTimeout(() => {
      adminFetch(`/api/admin/products${q ? `?q=${encodeURIComponent(q)}` : ''}`).then(setRows).catch(() => {})
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  const remove = async (p) => {
    if (!window.confirm(`«${p.name}» حذف شود؟`)) return
    try {
      await adminFetch(`/api/admin/products/${p.id}`, { method: 'DELETE' })
      toast('محصول حذف شد')
      load()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <h2>محصولات</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            placeholder="جستجوی نام محصول…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ border: '1px solid var(--line)', borderRadius: 999, padding: '8px 16px', outline: 'none' }}
          />
          <button className="btn btn-primary btn-sm" onClick={() => setEditing({ ...EMPTY })}>
            <IconPlus size={15} /> افزودن
          </button>
        </div>
      </div>
      {!rows ? <div className="spinner" role="status" /> : (
        <table className="data-table" style={{ marginTop: 16 }}>
          <thead>
            <tr><th>تصویر</th><th>نام</th><th>دسته</th><th>قیمت</th><th>موجودی</th><th>ویژگی‌ها</th><th>وضعیت</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image
                    ? <img className="thumb-img" src={p.image} alt="" />
                    : <div className="thumb-img" style={{ background: 'var(--cream-soft)', border: '1px solid var(--line)' }}><ProductArt art={p.art} accent={p.accent_hint} /></div>}
                </td>
                <td style={{ fontWeight: 700 }}>{p.name}</td>
                <td>{p.category_name || '—'}</td>
                <td>{faPrice(p.price)}</td>
                <td>{faNum(p.stock)}</td>
                <td style={{ fontSize: '0.75rem' }}>
                  {p.featured && 'ویژه '}
                  {p.is_new && 'جدید '}
                  {p.bestseller && 'پرفروش'}
                </td>
                <td><span className={`chip`} style={{ background: p.active ? 'var(--sage-soft)' : '#f3e0dc', color: p.active ? 'var(--forest)' : 'var(--danger)' }}>{p.active ? 'فعال' : 'غیرفعال'}</span></td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-soft btn-sm" onClick={() => setEditing({ ...EMPTY, ...p, category_id: p.category_id || '', old_price: p.old_price || '', stock: p.stock ?? 0 })}>ویرایش</button>
                    <button className="remove-btn" onClick={() => remove(p)}><IconTrash size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editing && (
        <ProductForm
          initial={editing}
          cats={cats}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); toast('محصول ذخیره شد'); load() }}
        />
      )}
    </>
  )
}
