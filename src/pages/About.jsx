import { Link } from 'react-router-dom'
import HeroArt from '../components/HeroArt.jsx'

export default function About() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>درباره بارانیکا</h1>
          <p>داستان یک فروشگاه کوچک با یک هدف بزرگ: رسیدن خوراکی‌های طبیعی و اصیل به سفره‌ی خانواده‌ها.</p>
        </div>
      </div>
      <div className="container" style={{ paddingBlock: '0 56px' }}>
        <div className="cart-layout" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
          <div className="prose">
            <h2>چرا بارانیکا؟</h2>
            <p>
              بارانیکا فروشگاه محصولات طبیعی و سنتی است. ما باور داریم خوراکی خوب همان چیزی است که مادربزرگ‌های ما
              می‌شناختند: ساده، خالص و بدون افزودنی. به همین دلیل، هر محصول را با توجه به کیفیت و اطلاعات تأمین‌کننده
              انتخاب می‌کنیم.
            </p>
            <h2>تعهد ما به شما</h2>
            <ul>
              <li>انتخاب دقیق محصولات بر اساس کیفیت و اطلاعات تأمین‌کننده</li>
              <li>ارائه‌ی شفاف اطلاعات محصولات، بدون ادعاهای اغراق‌آمیز</li>
              <li>تلاش برای عرضه‌ی کیفیت مناسب با قیمت منصفانه</li>
              <li>پاسخ‌گویی و احترام به مشتری در همه‌ی مراحل خرید</li>
            </ul>
            <p style={{ fontSize: '0.8rem', marginTop: 18 }}>
              توجه: موارد بالا تعهدات برند ما هستند و به‌جای گواهی یا تأییدیه رسمی ارائه نمی‌شوند. اطلاعات دقیق هر محصول
              در صفحه‌ی همان محصول آمده است.
            </p>
            <h2>با ما همراه باشید</h2>
            <p>
              اگر پرسش یا پیشنهادی دارید، از <Link to="/contact" style={{ color: 'var(--forest)', fontWeight: 700 }}>صفحه‌ی تماس با ما</Link> برای
              ما بنویسید؛ خوشحال می‌شویم پاسخ‌گوی شما باشیم.
            </p>
          </div>
          <div className="hero-frame" style={{ alignSelf: 'start' }}>
            <HeroArt />
          </div>
        </div>
      </div>
    </>
  )
}
