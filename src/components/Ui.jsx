import { Link } from 'react-router-dom'

// Shared small UI pieces: section head, empty/error states, quantity stepper
export function SectionHead({ title, sub, more, moreTo }) {
  return (
    <div className="section-head">
      <div>
        <h2 className="section-title">
          <span className="leaf-dot" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4c0 9-5.5 14-13.5 14.5C6 12 9 6.5 20 4z" /></svg>
          </span>
          {title}
        </h2>
        {sub && <p className="section-sub">{sub}</p>}
      </div>
      {more && moreTo && (
        <Link className="link-more" to={moreTo}>
          {more} ←
        </Link>
      )}
    </div>
  )
}

export function EmptyState({ icon = '🧺', title, text, children }) {
  return (
    <div className="state-box">
      <div className="big" aria-hidden="true">{icon}</div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  )
}

export function ErrorState({ text = 'در بارگذاری اطلاعات مشکلی پیش آمد. دوباره تلاش کنید.', onRetry }) {
  return (
    <div className="state-box">
      <div className="big" aria-hidden="true">⚠️</div>
      <h3>مشکلی پیش آمد</h3>
      <p>{text}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry} style={{ marginTop: 12 }}>
          تلاش دوباره
        </button>
      )}
    </div>
  )
}

export function Spinner() {
  return <div className="spinner" role="status" aria-label="در حال بارگذاری" />
}

export function QtyStepper({ value, min = 1, max = 99, onChange, small }) {
  return (
    <div className="qty-box" style={small ? { transform: 'scale(0.85)' } : undefined}>
      <button onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="افزایش تعداد">+</button>
      <span>{new Intl.NumberFormat('fa-IR').format(value)}</span>
      <button onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="کاهش تعداد">−</button>
    </div>
  )
}
