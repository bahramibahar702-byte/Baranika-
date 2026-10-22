const jsonOrThrow = async (res) => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'خطا در ارتباط با سرور')
  }
  return res.json()
}

export const api = {
  get: (url) => fetch(url).then(jsonOrThrow),
  post: (url, body) =>
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(jsonOrThrow),
  put: (url, body, token) =>
    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    }).then(jsonOrThrow),
  patch: (url, body, token) =>
    fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    }).then(jsonOrThrow),
  del: (url, token) =>
    fetch(url, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} }).then(jsonOrThrow),
}
