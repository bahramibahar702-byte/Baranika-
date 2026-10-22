// Hero photograph — a warm pantry still-life (served from public/photos).
// Replaces the old illustrated SVG scene with real product photography.
export default function HeroArt() {
  return (
    <img
      src="/photos/hero.jpg"
      alt="چیدمان خوراکی‌های طبیعی بارانیکا در شیشه‌های شفاف روی قفسه چوبی"
      loading="eager"
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  )
}
