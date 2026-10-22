const TOKEN_KEY = 'baranika-admin-token'

export const getToken = () => localStorage.getItem(TOKEN_KEY) || ''
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const adminFetch = async (url, { method = 'GET', body } = {}) => {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) {
    clearToken()
    throw new Error('نشست شما پایان یافته است؛ دوباره وارد شوید')
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'خطا در ارتباط با سرور')
  }
  return res.json()
}
