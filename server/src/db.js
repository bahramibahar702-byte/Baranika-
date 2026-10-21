import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'baranika.db')
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

export const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'leaf',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  short_desc TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL,
  old_price INTEGER,
  weight TEXT NOT NULL DEFAULT '',
  stock INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0,
  is_new INTEGER NOT NULL DEFAULT 0,
  bestseller INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  art TEXT NOT NULL DEFAULT 'jar',
  accent_hint TEXT NOT NULL DEFAULT '',
  image TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  cta_text TEXT NOT NULL DEFAULT '',
  cta_link TEXT NOT NULL DEFAULT '',
  image TEXT,
  active INTEGER NOT NULL DEFAULT 0,
  active_from TEXT,
  active_to TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  items TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  shipping INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS newsletter (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`)

// Migration guard for databases created before the accent_hint column existed
try {
  const cols = db.prepare(`PRAGMA table_info(products)`).all().map((c) => c.name)
  if (cols.length && !cols.includes('accent_hint')) {
    db.exec(`ALTER TABLE products ADD COLUMN accent_hint TEXT NOT NULL DEFAULT ''`)
  }
} catch (e) {
  console.error('migration check failed:', e.message)
}

const count = (t) => db.prepare(`SELECT COUNT(*) AS c FROM ${t}`).get().c

// ---------------------------------------------------------------------------
// Seed (idempotent — runs only when tables are empty)
// ---------------------------------------------------------------------------
export const DEFAULT_SETTINGS = {
  announcement: 'ارسال به سراسر ایران · ارسال رایگان سفارش‌های بالای ۱٫۰۰۰٫۰۰۰ تومان',
  shipping_cost: '49000',
  free_shipping_threshold: '1000000',
  phone: '021-00000000',
  email: 'info@baranika.example',
  address: 'تهران، ایران — نشانی فروشگاه به‌زودی تکمیل می‌شود',
  work_hours: 'شنبه تا پنجشنبه، ۹ تا ۱۸',
  instagram: '',
  telegram: '',
  whatsapp: '',
  payment_note: 'پرداخت آنلاین هنوز روی این فروشگاه فعال نشده است. سفارش شما ثبت می‌شود و پس از بررسی، برای هماهنگی پرداخت و ارسال با شما تماس می‌گیریم.',
}

if (!count('settings')) {
  const ins = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)')
  const tx = db.transaction(() => {
    for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) ins.run(k, v)
  })
  tx()
}

if (!count('categories')) {
  const cats = [
    ['honey', 'عسل و شیرین‌کننده‌های طبیعی', 'انواع عسل طبیعی و شیرین‌کننده‌های سالم', 'honey'],
    ['oils', 'روغن‌های طبیعی و حیوانی', 'روغن زیتون، روغن زرد حیوانی و ارده', 'oil'],
    ['soyek', 'سویق و محصولات مقوی', 'سویق و خوراکی‌های سنتی مقوی', 'grain'],
    ['nuts', 'آجیل، مغزها و دانه‌ها', 'آجیل تازه، مغزها و دانه‌های طبیعی', 'nut'],
    ['snacks', 'تنقلات و خوراکی‌های طبیعی', 'لوکوم، کلوچه و تنقلات بدون افزودنی', 'cookie'],
    ['herbal', 'دمنوش‌ها و گیاهان', 'دمنوش‌ها و گیاهان دارویی طبیعی', 'herb'],
    ['vinegar', 'سرکه، آبغوره و چاشنی‌های طبیعی', 'سرکه‌های خانگی و چاشنی‌های اصیل', 'bottle'],
    ['salt', 'نمک‌های طبیعی و محصولات سنتی', 'نمک‌های طبیعی و محصولات سنتی', 'salt'],
  ]
  const ins = db.prepare('INSERT INTO categories (slug, name, description, icon, sort_order) VALUES (?,?,?,?,?)')
  const tx = db.transaction(() => cats.forEach((c, i) => ins.run(c[0], c[1], c[2], c[3], i)))
  tx()
}

if (!count('products')) {
  const catId = (slug) => db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug)?.id ?? null
  const products = [
    {
      slug: 'natural-multifloral-honey', name: 'عسل طبیعی چندگیاه', cat: 'honey',
      price: 1180000, weight: '۹۵۰ گرم', art: 'jar', accent: '#C5A46D',
      featured: 1, bestseller: 1, stock: 14,
      short_desc: 'عسل چندگیاه طبیعی با عطر و طعم اصیل',
      description: 'عسل چندگیاه از کندوهای مناطق بومی؛ برداشت فصل و بدون افزودنی. مناسب مصرف روزانه همراه صبحانه، شیر یا نوشیدنی گرم. اطلاعات بیشتر درباره منبع عسل را از پشتیبانی بخواهید.',
    },
    {
      slug: 'kermanshah-animal-ghee', name: 'روغن زرد حیوانی کرمانشاهی', cat: 'oils',
      price: 890000, weight: '۴۵۰ گرم', art: 'tin', accent: '#C5A46D',
      featured: 1, stock: 9,
      short_desc: 'روغن زرد حیوانی سنتی کرمانشاه',
      description: 'روغن زرد حیوانی سنتی با بافت و عطر مطلوب؛ آماده‌شده به روش محلی و بسته‌بندی بهداشتی. برای مصرف پخت و پز و صبحانه.',
    },
    {
      slug: 'barberry-soyek', name: 'سویق سنجد', cat: 'soyek',
      price: 165000, weight: '۴۰۰ گرم', art: 'pouch', accent: '#795443',
      stock: 25,
      short_desc: 'سویق سنجد آسیاب‌شده، خالص و بدون افزودنی',
      description: 'سویق سنجد خالص و آسیاب‌شده از سنجد تازه؛ خوراکی سنتی و مقوی مناسب صبحانه، با شیر، عسل یا کره مصرف می‌شود.',
    },
    {
      slug: 'rolled-oats', name: 'جو دوسر پرک', cat: 'nuts',
      price: 145000, weight: '۵۰۰ گرم', art: 'bag', accent: '#71875A',
      is_new: 1, stock: 30,
      short_desc: 'جو دوسر پرک‌شده باکیفیت',
      description: 'پرک‌های جو دوسر با کیفیت مناسب برای صبحانه، پخت انواع شیرینی و غذاهای خانگی.',
    },
    {
      slug: 'date-cubes', name: 'حبه خرما', cat: 'snacks',
      price: 195000, weight: '۵۰۰ گرم', art: 'cubes', accent: '#795443',
      bestseller: 1, stock: 18,
      short_desc: 'حبه خرما تازه و شیرین',
      description: 'حبه خرما با بافت نرم و طعم طبیعی؛ جایگزین شیرینی برای پذیرایی و مصرف روزانه.',
    },
    {
      slug: 'fig-walnut-lokum', name: 'لوکوم انجیر و گردو', cat: 'snacks',
      price: 210000, weight: '۴۰۰ گرم', art: 'box', accent: '#71875A',
      featured: 1, stock: 12,
      short_desc: 'لوکوم سنتی انجیر و گردو',
      description: 'لوکوم سنتی تهیه‌شده از انجیر خشک و مغز گردو، بدون شکر افزوده؛ خوراکی اصیل و انرژی‌بخش.',
    },
    {
      slug: 'apricot-walnut-lokum', name: 'لوکوم زردآلو و گردو', cat: 'snacks',
      price: 210000, weight: '۴۰۰ گرم', art: 'box', accent: '#C5A46D',
      is_new: 1, stock: 12,
      short_desc: 'لوکوم سنتی زردآلو و گردو',
      description: 'لوکوم سنتی تهیه‌شده از زردآلو خشک و مغز گردو؛ طعمی مطبوع و طبیعی برای پذیرایی مهمانان.',
    },
    {
      slug: 'natural-cookies', name: 'کلوچه طبیعی', cat: 'snacks',
      price: 135000, weight: 'بسته ۶ عددی', art: 'cookies', accent: '#B7C7A0',
      is_new: 1, stock: 20,
      short_desc: 'کلوچه خانگی با مواد طبیعی',
      description: 'کلوچه تازه پخته‌شده با آرد کامل و مواد طبیعی؛ بدون رنگ و نگهدارنده مصنوعی. مناسب چای عصرانه.',
    },
    {
      slug: 'natural-verjuice', name: 'آبغوره طبیعی', cat: 'vinegar',
      price: 220000, weight: '۱ لیتر', art: 'bottle', accent: '#71875A',
      is_new: 1, stock: 16,
      short_desc: 'آبغوره خالص از انگور نارس',
      description: 'آبغوره خالص و طبیعی از انگور نارس، بدون افزودنی و رنگ مصنوعی؛ برای طعم‌دهی به سالاد و غذاها.',
    },
    {
      slug: 'sesame-ardeh', name: 'ارده کنجد', cat: 'oils',
      price: 240000, weight: '۴۵۰ گرم', art: 'jar', accent: '#795443',
      featured: 1, stock: 11,
      short_desc: 'ارده کنجد صددرصد طبیعی',
      description: 'ارده کنجد طبیعی و خمیری‌شکل از کنجد بوداده؛ همراه با عسل، در شیرینی‌پزی و صبحانه مصرف می‌شود.',
    },
    {
      slug: 'apple-cider-vinegar', name: 'سرکه سیب', cat: 'vinegar',
      price: 185000, weight: '۱ لیتر', art: 'bottle', accent: '#795443',
      bestseller: 1, stock: 22,
      short_desc: 'سرکه سیب خانگی، تصفیه‌نشده',
      description: 'سرکه سیب خانگی و تصفیه‌نشده با عطر طبیعی سیب؛ برای سالاد، ترشیجات و طعم‌دهی غذاها.',
    },
    {
      slug: 'extra-virgin-olive-oil', name: 'روغن زیتون', cat: 'oils',
      price: 720000, weight: '۵۰۰ میلی‌لیتر', art: 'oilbottle', accent: '#71875A',
      bestseller: 1, stock: 10,
      short_desc: 'روغن زیتون فرابکر',
      description: 'روغن زیتون فرابکر با عطر و طعم مطلوب؛ مناسب سالاد و مصرف مستقیم. در جای خنک و دور از نور نگهداری شود.',
    },
  ]
  const ins = db.prepare(`INSERT INTO products
    (slug, name, category_id, short_desc, description, price, weight, stock, featured, is_new, bestseller, art, accent_hint)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`)
  const tx = db.transaction(() => {
    for (const p of products) {
      ins.run(p.slug, p.name, catId(p.cat), p.short_desc, p.description, p.price, p.weight,
        p.stock, p.featured || 0, p.is_new || 0, p.bestseller || 0, p.art, p.accent || '')
    }
  })
  tx()
}

if (!count('banners')) {
  const ins = db.prepare(`INSERT INTO banners (kind, title, subtitle, cta_text, cta_link, active)
    VALUES (?,?,?,?,?,0)`)
  const tx = db.transaction(() => {
    ins.run('seasonal', 'پیشنهاد فصل', 'به‌زودی: پیشنهاد ویژه محصولات منتخب بارانیکا', 'مشاهده محصولات', '/shop')
    ins.run('collection', 'مجموعه‌ی عسل و شیرین‌کننده‌ها', 'انواع عسل طبیعی و شیرین‌کننده‌های سالم را ببینید', 'دیدن مجموعه', '/category/honey')
  })
  tx()
}
