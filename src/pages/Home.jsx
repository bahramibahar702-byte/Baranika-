import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import ProductCard, { ProductGridSkeleton } from '../components/ProductCard.jsx'
import HeroArt from '../components/HeroArt.jsx'
import { SectionHead, ErrorState } from '../components/Ui.jsx'
import { IconLeaf, IconSearch, IconChat, IconTag, IconHandshake } from '../components/Icons.jsx'

function TrustSection() {
  const cards = [
    {
      title: 'انتخاب با دقت',
      text: 'محصولات با توجه به کیفیت و اطلاعات تأمین‌کننده انتخاب می‌شوند.',
      Icon: IconSearch,
    },
    {
      title: 'صداقت در معرفی',
      text: 'اطلاعات محصولات شفاف و بدون ادعاهای اغراق‌آمیز ارائه می‌شود.',
      Icon: IconChat,
    },
    {
      title: 'قیمت منصفانه',
      text: 'تلاش می‌کنیم کیفیت مناسب را با قیمت منصفانه عرضه کنیم.',
      Icon: IconTag,
    },
    {
      title: 'ارتباط با مشتری',
      text: 'پاسخ‌گویی و احترام به مشتری از اولویت‌های ماست.',
      Icon: IconHandshake,
    },
  ]
  return (
    <section className="section">
      <div className="container">
        <div className="trust">
          <div style={{ padding: '48px 28px 32px' }}>
            <SectionHead
              title="چرا بارانیکا؟"
              sub="چهار تعهد ما به شما، مشتریان بارانیکا"
            />
            <div className="trust-grid">
              {cards.map((c) => (
                <div className="trust-card" key={c.title}>
                  <div className="trust-icon" aria-hidden="true"><c.Icon size={24} /></div>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>
            <p className="trust-note">
              این موارد تعهدات برند بارانیکا هستند و به‌جای گواهی یا تأییدیه رسمی ارائه نمی‌شوند.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [data, setData] = useState({ cats: null, best: null, fresh: null, featured: null, banners: null, error: false })

  const load = () => {
    setData({ cats: null, best: null, fresh: null, featured: null, banners: null, error: false })
    Promise.all([
      api.get('/api/categories'),
      api.get('/api/products?flag=bestseller').catch(() => []),
      api.get('/api/products?flag=new').catch(() => []),
      api.get('/api/products?flag=featured').catch(() => []),
      api.get('/api/banners').catch(() => []),
    ])
      .then(([cats, best, fresh, featured, banners]) => setData({ cats, best, fresh, featured, banners, error: false }))
      .catch(() => setData((d) => ({ ...d, error: true })))
  }
  useEffect(() => { load() }, [])

  if (data.error) {
    return (
      <div className="container">
        <ErrorState onRetry={load} />
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="hero-kicker"><IconLeaf size={15} /> فروشگاه محصولات طبیعی و سنتی</span>
            <h1>
              <em>طبیعی</em> انتخاب کن،
              <br />
              با خیال آسوده زندگی کن
            </h1>
            <p className="hero-lead">
              در بارانیکا، محصولات طبیعی و باکیفیت را با دقت انتخاب می‌کنیم تا خریدی مطمئن‌تر و دلنشین‌تر داشته باشید.
            </p>
            <div className="hero-cta">
              <Link to="/shop" className="btn btn-primary">مشاهده محصولات</Link>
              <Link to="/about" className="btn btn-outline">آشنایی با بارانیکا</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><b>۸+</b><span>دسته‌بندی محصولات</span></div>
              <div className="hero-stat"><b>۱۰۰٪</b><span>طبیعی و بدون افزودنی مصنوعی*</span></div>
              <div className="hero-stat"><b>ارسال</b><span>به سراسر ایران</span></div>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-frame">
              <HeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <SectionHead
            title="دسته‌بندی محصولات"
            sub="از عسل طبیعی تا چاشنی‌های سنتی — همه در یک نگاه"
            more="همه دسته‌ها"
            moreTo="/shop"
          />
          {data.cats ? (
            <div className="cat-grid">
              {data.cats.map((c) => {
                return (
                  <Link to={`/category/${c.slug}`} className="cat-card" key={c.id}>
                    {c.image
                      ? <img className="cat-photo" src={c.image} alt="" loading="lazy" />
                      : <span className="cat-icon">🌿</span>}
                    <h3>{c.name}</h3>
                    {c.description && <p>{c.description}</p>}
                    <div className="cat-count">{new Intl.NumberFormat('fa-IR').format(c.product_count)} محصول</div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <ProductGridSkeleton count={4} />
          )}
        </div>
      </section>

      {/* Bestsellers */}
      {data.best?.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionHead title="پرفروش‌ترین محصولات" sub="محبوب‌ترین انتخاب‌های مشتریان بارانیکا" more="دیدن همه" moreTo="/shop?flag=bestseller" />
            <div className="product-grid">
              {data.best.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Seasonal banner */}
      {data.banners?.filter((b) => b.kind === 'seasonal').map((b) => (
        <section className="section" style={{ paddingTop: 0 }} key={b.id}>
          <div className="container">
            <div className="banner-grid">
              <Link to={b.cta_link || '/shop'} className="promo-banner seasonal">
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3>{b.title}</h3>
                  <p>{b.subtitle}</p>
                  <span className="btn">{b.cta_text || 'مشاهده'}</span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* New products */}
      {data.fresh?.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionHead title="محصولات جدید" sub="تازه‌ترین محصولات اضافه‌شده به قفسه‌های بارانیکا" more="دیدن همه" moreTo="/shop?flag=new" />
            <div className="product-grid">
              {data.fresh.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Collection banner */}
      {data.banners?.filter((b) => b.kind === 'collection').map((b) => (
        <section className="section" style={{ paddingTop: 0 }} key={b.id}>
          <div className="container">
            <div className="banner-grid">
              <Link to={b.cta_link || '/shop'} className="promo-banner collection">
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3>{b.title}</h3>
                  <p>{b.subtitle}</p>
                  <span className="btn">{b.cta_text || 'مشاهده'}</span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* Featured */}
      {data.featured?.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionHead title="پیشنهادهای ویژه" sub="انتخاب دقت‌شده تیم بارانیکا برای شما" more="دیدن همه" moreTo="/shop?flag=featured" />
            <div className="product-grid">
              {data.featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Brand teaser */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="panel panel-pad brand-teaser">
            <div>
              <h2 style={{ fontSize: '1.3rem' }}>داستان بارانیکا</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginTop: 10 }}>
                بارانیکا با یک هدف ساده شروع شد: رسیدن خوراکی‌های طبیعی و اصیل به سفره‌ی خانواده‌ها. هر محصول را با توجه
                به کیفیت و اطلاعات تأمین‌کننده انتخاب می‌کنیم و اطلاعات آن را شفاف و بدون اغراق در اختیار شما می‌گذاریم.
              </p>
              <Link to="/about" className="btn btn-soft" style={{ marginTop: 16 }}>بیشتر بخوانید</Link>
            </div>
            <div className="brand-teaser-photo">
              <img src="/photos/shelf.jpg" alt="قفسه‌ای از خوراکی‌های طبیعی در شیشه‌های شفاف" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--muted)', paddingBottom: 12 }}>
        * اطلاعات هر محصول دقیقاً مطابق توضیحات همان محصول در صفحه‌ی جزئیات ارائه می‌شود.
      </p>
    </>
  )
}
