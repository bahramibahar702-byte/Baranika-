export const faNum = (n) => new Intl.NumberFormat('fa-IR').format(Number(n) || 0)

export const faPrice = (n) => `${faNum(n)} تومان`

export const faDate = (d) => {
  try {
    return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(d))
  } catch {
    return ''
  }
}

export const discountPercent = (price, oldPrice) =>
  oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : null
