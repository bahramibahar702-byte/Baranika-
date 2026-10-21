import express from 'express'
import crypto from 'node:crypto'
import { db, DEFAULT_SETTINGS } from './db.js'

const app = express()
app.use(express.json({ limit: '8mb' }))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const now = () => new Date().toISOString()
const str = (v, fallback = '') => (typeof v === 'string' ? v.trim() : fallback)

function getSetting(key) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key)
  return row ? row.value : DEFAULT_SETTINGS[key] ?? ''
}
const getSettings = () => {
  const rows = db.prepare('SELECT key, value FROM settings').all()
  const s = { ...DEFAULT_SETTINGS }
  for (const r of rows) s[r.key] = r.value
  return s
}

const productCols = `p.id, p.slug, p.name, p.category_id, p.short_desc, p.description, p.price,
  p.old_price, p.weight, p.stock, p.featured, p.is_new, p.bestseller, p.active, p.art, p.accent_hint, p.image,
  c.name AS category_name, c.slug AS category_slug`

const mapProduct = (p) => p && {
  ...p,
  image: p.image || null,
  featured: !!p.featured,
  is_new: !!p.is_new,
  bestseller: !!p.bestseller,
  active: !!p.active,
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
const adminToken = () =>
  crypto.createHmac('sha256', process.env.ADMIN_TOKEN_SECRET || 'dev-secret').update('baranika-admin-session').digest('hex')

const checkPassword = (supplied) => {
  const expected = crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD || '').digest()
  const got = crypto.createHash('sha256').update(String(supplied || '')).digest()
  return crypto.timingSafeEqual(expected, got)
}

const requireAdmin = (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (token && crypto.timingSafeEqual(Buffer.from(token), Buffer.from(adminToken()))) return next()
  res.status(401).json({ error: 'دسترسی غیرمجاز' })
}

// ---------------------------------------------------------------------------
// Public routes
// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => res.json({ ok: true, time: now() }))

app.get('/api/settings', (req, res) => {
  const s = getSettings()
  res.json({
    announcement: s.announcement,
    shipping_cost: Number(s.shipping_cost) || 0,
    free_shipping_threshold: Number(s.free_shipping_threshold) || 0,
    phone: s.phone, email: s.email, address: s.address, work_hours: s.work_hours,
    instagram: s.instagram, telegram: s.telegram, whatsapp: s.whatsapp,
    payment_note: s.payment_note,
  })
})

app.get('/api/categories', (req, res) => {
  const rows = db.prepare(`
    SELECT c.*, COUNT(p.id) AS product_count
    FROM categories c LEFT JOIN products p ON p.category_id = c.id AND p.active = 1
    GROUP BY c.id ORDER BY c.sort_order, c.id`).all()
  res.json(rows)
})

app.get('/api/products', (req, res) => {
  const { category, flag, q, sort, ids } = req.query
  let sql = `SELECT ${productCols} FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.active = 1`
  const params = []
  if (ids) {
    const list = String(ids).split(',').map(Number).filter(Number.isFinite)
    if (!list.length) return res.json([])
    sql += ` AND p.id IN (${list.map(() => '?').join(',')})`
    params.push(...list)
  }
  if (category) { sql += ' AND c.slug = ?'; params.push(category) }
  if (flag === 'featured') sql += ' AND p.featured = 1'
  if (flag === 'new') sql += ' AND p.is_new = 1'
  if (flag === 'bestseller') sql += ' AND p.bestseller = 1'
  if (q) { sql += ' AND (p.name LIKE ? OR p.short_desc LIKE ?)'; params.push(`%${q}%`, `%${q}%`) }
  if (sort === 'price_asc') sql += ' ORDER BY p.price ASC'
  else if (sort === 'price_desc') sql += ' ORDER BY p.price DESC'
  else if (sort === 'newest') sql += ' ORDER BY p.is_new DESC, p.id DESC'
  else sql += ' ORDER BY p.id ASC'
  res.json(db.prepare(sql).all(...params).map(mapProduct))
})

app.get('/api/products/:slug', (req, res) => {
  const p = db.prepare(`SELECT ${productCols} FROM products p LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.slug = ? AND p.active = 1`).get(req.params.slug)
  if (!p) return res.status(404).json({ error: 'محصول یافت نشد' })
  const related = db.prepare(`SELECT ${productCols} FROM products p LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.category_id = ? AND p.id != ? AND p.active = 1 ORDER BY p.id LIMIT 4`)
    .all(p.category_id ?? -1, p.id).map(mapProduct)
  res.json({ ...mapProduct(p), related })
})

app.get('/api/banners', (req, res) => {
  const today = now().slice(0, 10)
  const rows = db.prepare(`SELECT * FROM banners WHERE active = 1
    AND (active_from IS NULL OR active_from = '' OR active_from <= ?)
    AND (active_to IS NULL OR active_to = '' OR active_to >= ?)`).all(today, today)
  res.json(rows)
})

const ORDER_STATUSES = {
  pending: 'در انتظار بررسی',
  confirmed: 'تأیید شده',
  shipped: 'ارسال شده',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده',
}

const calcOrder = (itemsRaw) => {
  if (!Array.isArray(itemsRaw) || !itemsRaw.length) throw new Error('سبد خرید خالی است')
  const items = []
  const updStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?')
  const sel = db.prepare('SELECT id, name, price, weight, stock, active FROM products WHERE id = ?')
  const tx = db.transaction(() => {
    for (const it of itemsRaw) {
      const qty = Number(it?.qty)
      if (!Number.isInteger(qty) || qty < 1 || qty > 99) throw new Error('تعداد نامعتبر است')
      const p = sel.get(Number(it?.id))
      if (!p || !p.active) throw new Error('یکی از محصولات در دسترس نیست')
      if (p.stock < qty) throw new Error(`موجودی «${p.name}» کافی نیست`)
      if (!updStock.run(qty, p.id, qty).changes) throw new Error(`موجودی «${p.name}» کافی نیست`)
      items.push({ id: p.id, name: p.name, price: p.price, weight: p.weight, qty })
    }
  })
  tx()
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const settings = getSettings()
  const threshold = Number(settings.free_shipping_threshold) || 0
  const shipping = threshold > 0 && subtotal >= threshold ? 0 : Number(settings.shipping_cost) || 0
  return { items, subtotal, shipping, total: subtotal + shipping }
}

app.post('/api/orders', (req, res) => {
  const { name, phone, address, notes, items: itemsRaw } = req.body || {}
  const n = str(name)
  const ph = str(phone)
  const a = str(address)
  if (n.length < 2) return res.status(400).json({ error: 'نام و نام خانوادگی را وارد کنید' })
  if (!/^09\d{9}$/.test(ph)) return res.status(400).json({ error: 'شماره موبایل باید به شکل ۰۹xxxxxxxxx باشد' })
  if (a.length < 10) return res.status(400).json({ error: 'نشانی تحویل را کامل‌تر وارد کنید' })
  try {
    const { items, subtotal, shipping, total } = calcOrder(itemsRaw)
    const order_number = 'BR-' + Date.now().toString(36).toUpperCase() + crypto.randomBytes(2).toString('hex').toUpperCase()
    db.prepare(`INSERT INTO orders (order_number, customer_name, phone, address, notes, items, subtotal, shipping, total, status, created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
      .run(order_number, n, ph, a, str(notes), JSON.stringify(items), subtotal, shipping, total, 'pending', now())
    res.json({ ok: true, order_number, status: 'pending', status_label: ORDER_STATUSES.pending, items, subtotal, shipping, total })
  } catch (e) {
    res.status(400).json({ error: e.message || 'خطا در ثبت سفارش' })
  }
})

app.get('/api/orders/:orderNumber', (req, res) => {
  const o = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(req.params.orderNumber)
  if (!o) return res.status(404).json({ error: 'سفارش یافت نشد' })
  res.json({ ...o, items: JSON.parse(o.items), status_label: ORDER_STATUSES[o.status] || o.status })
})

app.post('/api/contact', (req, res) => {
  const { name, phone, email, message } = req.body || {}
  if (str(name).length < 2) return res.status(400).json({ error: 'نام خود را وارد کنید' })
  if (!str(phone) && !str(email)) return res.status(400).json({ error: 'شماره تماس یا ایمیل خود را وارد کنید' })
  if (str(message).length < 5) return res.status(400).json({ error: 'متن پیام را وارد کنید' })
  db.prepare('INSERT INTO messages (name, phone, email, message, created_at) VALUES (?,?,?,?,?)')
    .run(str(name), str(phone), str(email), str(message), now())
  res.json({ ok: true, message: 'پیام شما ثبت شد. به‌زودی پاسخ می‌دهیم.' })
})

app.post('/api/newsletter', (req, res) => {
  const email = str(req.body?.email).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'ایمیل معتبر نیست' })
  try {
    db.prepare('INSERT INTO newsletter (email, created_at) VALUES (?,?)').run(email, now())
    res.json({ ok: true, message: 'عضویت شما در خبرنامه ثبت شد.' })
  } catch {
    res.status(400).json({ error: 'این ایمیل قبلاً ثبت شده است' })
  }
})

// ---------------------------------------------------------------------------
// Admin routes
// ---------------------------------------------------------------------------
app.post('/api/admin/login', (req, res) => {
  if (!checkPassword(req.body?.password)) return res.status(401).json({ error: 'رمز عبور نادرست است' })
  res.json({ token: adminToken() })
})

app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const n = (sql) => db.prepare(sql).get().c
  res.json({
    products: n('SELECT COUNT(*) c FROM products'),
    active_products: n('SELECT COUNT(*) c FROM products WHERE active = 1'),
    categories: n('SELECT COUNT(*) c FROM categories'),
    orders: n('SELECT COUNT(*) c FROM orders'),
    pending_orders: n("SELECT COUNT(*) c FROM orders WHERE status = 'pending'"),
    messages: n('SELECT COUNT(*) c FROM messages'),
    total_sales: db.prepare("SELECT COALESCE(SUM(total),0) c FROM orders WHERE status != 'cancelled'").get().c,
  })
})

app.get('/api/admin/products', requireAdmin, (req, res) => {
  const q = str(req.query.q)
  let sql = `SELECT ${productCols} FROM products p LEFT JOIN categories c ON c.id = p.category_id`
  const params = []
  if (q) { sql += ' WHERE p.name LIKE ?'; params.push(`%${q}%`) }
  sql += ' ORDER BY p.id DESC'
  res.json(db.prepare(sql).all(...params).map(mapProduct))
})

const productValidation = (body) => {
  const name = str(body?.name)
  const slug = str(body?.slug) || `product-${Date.now().toString(36)}`
  const price = Number(body?.price)
  const old_price = body?.old_price ? Number(body.old_price) : null
  const stock = Number.isInteger(Number(body?.stock)) ? Number(body.stock) : 0
  if (name.length < 2) throw new Error('نام محصول را وارد کنید')
  if (!Number.isFinite(price) || price <= 0) throw new Error('قیمت را به تومان وارد کنید')
  if (old_price !== null && (!Number.isFinite(old_price) || old_price <= price)) throw new Error('قیمت پیش از تخفیف باید بزرگ‌تر از قیمت فعلی باشد')
  return { name, slug, price: Math.round(price), old_price: old_price === null ? null : Math.round(old_price), stock: Math.max(0, stock) }
}

app.post('/api/admin/products', requireAdmin, (req, res) => {
  try {
    const v = productValidation(req.body)
    const r = db.prepare(`INSERT INTO products
      (slug, name, category_id, short_desc, description, price, old_price, weight, stock, featured, is_new, bestseller, active, art, accent_hint, image)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1,?,?,?)`).run(
      v.slug, v.name, req.body.category_id ? Number(req.body.category_id) : null,
      str(req.body.short_desc), str(req.body.description), v.price, v.old_price,
      str(req.body.weight), v.stock, req.body.featured ? 1 : 0, req.body.is_new ? 1 : 0,
      req.body.bestseller ? 1 : 0, str(req.body.art, 'jar'), str(req.body.accent_hint), req.body.image || null)
    res.json({ ok: true, id: r.lastInsertRowid })
  } catch (e) {
    const msg = String(e.message || '')
    res.status(400).json({ error: msg.includes('UNIQUE') ? 'اسلاگ یا نام تکراری است' : msg })
  }
})

app.put('/api/admin/products/:id', requireAdmin, (req, res) => {
  try {
    const v = productValidation(req.body)
    const r = db.prepare(`UPDATE products SET slug=?, name=?, category_id=?, short_desc=?, description=?,
      price=?, old_price=?, weight=?, stock=?, featured=?, is_new=?, bestseller=?, active=?, art=?, accent_hint=?, image=?
      WHERE id=?`).run(
      v.slug, v.name, req.body.category_id ? Number(req.body.category_id) : null,
      str(req.body.short_desc), str(req.body.description), v.price, v.old_price,
      str(req.body.weight), v.stock, req.body.featured ? 1 : 0, req.body.is_new ? 1 : 0,
      req.body.bestseller ? 1 : 0, req.body.active === false ? 0 : 1, str(req.body.art, 'jar'),
      str(req.body.accent_hint), req.body.image || null, Number(req.params.id))
    if (!r.changes) return res.status(404).json({ error: 'محصول یافت نشد' })
    res.json({ ok: true })
  } catch (e) {
    const msg = String(e.message || '')
    res.status(400).json({ error: msg.includes('UNIQUE') ? 'اسلاگ یا نام تکراری است' : msg })
  }
})

app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const r = db.prepare('DELETE FROM products WHERE id = ?').run(Number(req.params.id))
  if (!r.changes) return res.status(404).json({ error: 'محصول یافت نشد' })
  res.json({ ok: true })
})

app.get('/api/admin/categories', requireAdmin, (req, res) => {
  res.json(db.prepare('SELECT * FROM categories ORDER BY sort_order, id').all())
})

app.post('/api/admin/categories', requireAdmin, (req, res) => {
  try {
    const name = str(req.body?.name)
    if (name.length < 2) return res.status(400).json({ error: 'نام دسته را وارد کنید' })
    const slug = str(req.body?.slug) || `cat-${Date.now().toString(36)}`
    const r = db.prepare('INSERT INTO categories (slug, name, description, icon, sort_order) VALUES (?,?,?,?,?)')
      .run(slug, name, str(req.body.description), str(req.body.icon, 'leaf'), Number(req.body.sort_order) || 0)
    res.json({ ok: true, id: r.lastInsertRowid })
  } catch (e) {
    res.status(400).json({ error: String(e.message).includes('UNIQUE') ? 'اسلاگ تکراری است' : 'خطا در ذخیره' })
  }
})

app.put('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const name = str(req.body?.name)
  if (name.length < 2) return res.status(400).json({ error: 'نام دسته را وارد کنید' })
  const r = db.prepare('UPDATE categories SET name=?, description=?, icon=?, sort_order=? WHERE id=?')
    .run(name, str(req.body.description), str(req.body.icon, 'leaf'), Number(req.body.sort_order) || 0, Number(req.params.id))
  if (!r.changes) return res.status(404).json({ error: 'دسته یافت نشد' })
  res.json({ ok: true })
})

app.delete('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const r = db.prepare('DELETE FROM categories WHERE id = ?').run(Number(req.params.id))
  if (!r.changes) return res.status(404).json({ error: 'دسته یافت نشد' })
  res.json({ ok: true })
})

app.get('/api/admin/orders', requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM orders ORDER BY id DESC').all()
  res.json(rows.map((o) => ({ ...o, items: JSON.parse(o.items), status_label: ORDER_STATUSES[o.status] || o.status })))
})

app.patch('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const status = str(req.body?.status)
  if (!ORDER_STATUSES[status]) return res.status(400).json({ error: 'وضعیت نامعتبر است' })
  const r = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, Number(req.params.id))
  if (!r.changes) return res.status(404).json({ error: 'سفارش یافت نشد' })
  res.json({ ok: true, status_label: ORDER_STATUSES[status] })
})

app.get('/api/admin/banners', requireAdmin, (req, res) => {
  res.json(db.prepare('SELECT * FROM banners ORDER BY id').all())
})

app.put('/api/admin/banners/:kind', requireAdmin, (req, res) => {
  const kind = req.params.kind === 'collection' ? 'collection' : 'seasonal'
  const r = db.prepare(`UPDATE banners SET title=?, subtitle=?, cta_text=?, cta_link=?, image=?,
    active=?, active_from=?, active_to=? WHERE kind=?`).run(
    str(req.body?.title), str(req.body?.subtitle), str(req.body?.cta_text), str(req.body?.cta_link),
    req.body?.image || null, req.body?.active ? 1 : 0, str(req.body?.active_from) || null,
    str(req.body?.active_to) || null, kind)
  if (!r.changes) return res.status(404).json({ error: 'بنر یافت نشد' })
  res.json({ ok: true })
})

const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS)
app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const body = req.body || {}
  const tx = db.transaction(() => {
    for (const k of SETTING_KEYS) {
      if (k in body) db.prepare('INSERT INTO settings (key, value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value')
        .run(k, String(body[k] ?? ''))
    }
  })
  tx()
  res.json({ ok: true })
})

app.get('/api/admin/messages', requireAdmin, (req, res) => {
  res.json(db.prepare('SELECT * FROM messages ORDER BY id DESC LIMIT 100').all())
})

// ---------------------------------------------------------------------------
const PORT = Number(process.env.PORT) || 8000
app.listen(PORT, '0.0.0.0', () => console.log(`Baranika API listening on :${PORT}`))
