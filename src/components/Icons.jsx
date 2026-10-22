// Minimal stroke icon set (lucide-style) + category glyphs for Baranika
const S = ({ children, size = 22, viewBox = '0 0 24 24', ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
)

export const IconSearch = (p) => (
  <S {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></S>
)
export const IconCart = (p) => (
  <S {...p}><path d="M6.5 8h11l1.2 11a1.8 1.8 0 0 1-1.8 2H7.1a1.8 1.8 0 0 1-1.8-2z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></S>
)
export const IconHeart = (p) => (
  <S {...p}><path d="M12 20.5S4 15.5 4 9.9A4.4 4.4 0 0 1 8.4 5.5c1.6 0 3 .8 3.6 2 .6-1.2 2-2 3.6-2A4.4 4.4 0 0 1 20 9.9c0 5.6-8 10.6-8 10.6z" /></S>
)
export const IconMenu = (p) => <S {...p}><path d="M4 7h16M4 12h16M4 17h16" /></S>
export const IconX = (p) => <S {...p}><path d="m6 6 12 12M18 6 6 18" /></S>
export const IconLeaf = (p) => (
  <S {...p}><path d="M20 4c0 9-5.5 14-13.5 14.5C6 12 9 6.5 20 4z" /><path d="M4.5 20C8 15 11 12 16 9.5" /></S>
)
export const IconPhone = (p) => (
  <S {...p}><path d="M5 4h4l1.5 4.5L8 10a12 12 0 0 0 6 6l1.5-2.5L20 15v4a1.6 1.6 0 0 1-1.8 1.6C10.4 19.8 4.2 13.6 3.4 5.8A1.6 1.6 0 0 1 5 4z" /></S>
)
export const IconMail = (p) => <S {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="m4.5 7.5 7.5 5.5 7.5-5.5" /></S>
export const IconPin = (p) => <S {...p}><path d="M12 21s-6.5-5.4-6.5-10.2A6.5 6.5 0 0 1 12 4.2a6.5 6.5 0 0 1 6.5 6.6C18.5 15.6 12 21 12 21z" /><circle cx="12" cy="10.6" r="2.3" /></S>
export const IconClock = (p) => <S {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></S>
export const IconTrash = (p) => <S {...p}><path d="M4.5 6.5h15M9 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1.5M6.5 6.5 7.4 19a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5l.9-12.5" /></S>
export const IconChevron = (p) => <S {...p}><path d="m6 9 6 6 6-6" /></S>
export const IconArrow = (p) => <S {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></S>
export const IconUser = (p) => <S {...p}><circle cx="12" cy="8" r="4" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></S>
export const IconPlus = (p) => <S {...p}><path d="M12 5v14M5 12h14" /></S>
export const IconMinus = (p) => <S {...p}><path d="M5 12h14" /></S>
export const IconCheck = (p) => <S {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></S>
export const IconTag = (p) => <S {...p}><path d="M3.5 12.5 12 21l8.5-8.5V4H12z" /><circle cx="16" cy="8" r="1.6" /></S>
export const IconChart = (p) => <S {...p}><path d="M5 20V10M12 20V4M19 20v-7" /></S>
export const IconChat = (p) => <S {...p}><path d="M20 12a8 8 0 0 1-11.6 7.2L4 20l1-4.2A8 8 0 1 1 20 12z" /></S>
export const IconHandshake = (p) => <S {...p}><path d="M8 12.5 11 10l4 1.5a1.6 1.6 0 0 1-1 3L9 14M4 10l4 1M20 10l-4 1" /><path d="M2 13l3-4M22 13l-3-4" /></S>
export const IconStar = (p) => <S {...p}><path d="m12 3.5 2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L12 16l-5.1 2.9 1.1-5.6L3.8 9.4l5.7-.7z" /></S>
export const IconBox = (p) => <S {...p}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></S>
export const IconImage = (p) => <S {...p}><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><circle cx="9" cy="10" r="1.7" /><path d="m5 18 5-5 3.5 3 2.5-2.5L20 17" /></S>
export const IconSettings = (p) => <S {...p}><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12" /><path d="M5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2L10 21h4l.5-2.6" /></S>
export const IconTruck = (p) => <S {...p}><path d="M3 7h10v9H3zM13 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.6" /><circle cx="17" cy="17.5" r="1.6" /></S>
export const IconInstagram = (p) => <S {...p}><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" stroke="none" /></S>
export const IconTelegram = (p) => <S {...p}><path d="m20.5 4.5-17 6.8 5.2 2 2 6 2.7-4 4.6 3.4z" /><path d="M8.7 13.3 20.5 4.5l-8 10" /></S>
export const IconWhatsapp = (p) => <S {...p}><path d="M4 20l1-4a8 8 0 1 1 3 3z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-2-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z" /></S>
export const IconAlert = (p) => <S {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7.5V13M12 16.4v.2" /></S>

// Category glyphs (small filled illustrations, drawn in brand colors)
export const GlyphHoney = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
    <path d="M10 13h14v2c2 2 3 4.5 3 7.5A9.5 9.5 0 0 1 17.5 32 9.5 9.5 0 0 1 8 22.5c0-3 1-5.5 3-7.5v-2z" fill="#C5A46D" opacity=".9" />
    <rect x="13" y="8" width="8" height="5" rx="1.5" fill="#795443" />
    <path d="M17 2l2 4h-4z" fill="#C5A46D" />
  </svg>
)
export const GlyphOil = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
    <path d="M14 6h6l1 5c2.5 2.5 4 5.5 4 9a8 8 0 0 1-16 0c0-3.5 1.5-6.5 4-9z" fill="#71875A" opacity=".9" />
    <rect x="13" y="3" width="8" height="3.5" rx="1" fill="#795443" />
    <circle cx="17" cy="21" r="3.4" fill="#F8F4EA" opacity=".55" />
  </svg>
)
export const GlyphGrain = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
    <path d="M17 30C17 30 6 26 6 14 6 6 13 2 17 2s11 4 11 12c0 12-11 16-11 16z" fill="#B7C7A0" opacity=".9" />
    <path d="M17 28V8M17 12l-5-3M17 12l5-3M17 18l-6-4M17 18l6-4" stroke="#214D35" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)
export const GlyphNut = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
    <ellipse cx="13" cy="15" rx="5.5" ry="7.5" transform="rotate(-20 13 15)" fill="#795443" />
    <ellipse cx="21.5" cy="18" rx="5.5" ry="7.5" transform="rotate(18 21.5 18)" fill="#C5A46D" />
    <ellipse cx="17" cy="9" rx="4.5" ry="6" fill="#71875A" />
  </svg>
)
export const GlyphCookie = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
    <circle cx="17" cy="18" r="11" fill="#C5A46D" />
    <circle cx="13.5" cy="15" r="1.4" fill="#795443" />
    <circle cx="20" cy="17" r="1.4" fill="#795443" />
    <circle cx="16" cy="22" r="1.4" fill="#795443" />
    <circle cx="21.5" cy="22.5" r="1" fill="#795443" />
  </svg>
)
export const GlyphHerb = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
    <path d="M9 30h16M12 30V16m10 14V16" stroke="#795443" strokeWidth="2" strokeLinecap="round" />
    <path d="M22 16C22 8 17 4 12 4c0 8 5 12 10 12z" fill="#71875A" />
    <path d="M12 16c0-6 4-10 10-10" stroke="#214D35" strokeWidth="1.3" />
  </svg>
)
export const GlyphBottle = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
    <path d="M13 8h8v4l2.5 3.5c1 1.4 1.5 3 1.5 4.7V29a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2v-8.8c0-1.7.5-3.3 1.5-4.7L13 12z" fill="#B7C7A0" />
    <rect x="12.5" y="3" width="9" height="5" rx="1.4" fill="#795443" />
    <rect x="13" y="20" width="8" height="6" rx="1" fill="#F8F4EA" opacity=".6" />
  </svg>
)
export const GlyphSalt = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
    <path d="M11 14h12l2 14a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2z" fill="#EDE7D8" />
    <rect x="13" y="10" width="8" height="4" rx="1.2" fill="#795443" />
    <circle cx="17" cy="6" r="1.6" fill="#C5A46D" />
    <circle cx="15" cy="22" r="1.3" fill="#B7C7A0" />
    <circle cx="19.5" cy="25" r="1.3" fill="#B7C7A0" />
  </svg>
)
export const GLYPHS = {
  honey: GlyphHoney, oil: GlyphOil, grain: GlyphGrain, nut: GlyphNut,
  cookie: GlyphCookie, herb: GlyphHerb, bottle: GlyphBottle, salt: GlyphSalt, leaf: GlyphHerb,
}
