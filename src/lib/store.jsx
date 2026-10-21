import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from './api.js'

// ---------------------------------------------------------------------------
// Settings (site-wide, fetched once)
// ---------------------------------------------------------------------------
const SettingsContext = createContext(null)
export const useSettings = () => useContext(SettingsContext)

// ---------------------------------------------------------------------------
// Cart (persisted in localStorage, product data refreshed from the API)
// ---------------------------------------------------------------------------
const CART_KEY = 'baranika-cart-v1'
const readCart = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    return Array.isArray(raw) ? raw.filter((i) => Number.isInteger(i?.id) && Number.isInteger(i?.qty)) : []
  } catch {
    return []
  }
}

const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

// ---------------------------------------------------------------------------
// Favorites (persisted locally)
// ---------------------------------------------------------------------------
const FAV_KEY = 'baranika-favorites-v1'
const readFavs = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(FAV_KEY) || '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}
const FavContext = createContext(null)
export const useFavorites = () => useContext(FavContext)

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
const ToastContext = createContext(null)
export const useToast = () => useContext(ToastContext)

export function StoreProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [cart, setCart] = useState(readCart)
  const [favorites, setFavorites] = useState(readFavs)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    api.get('/api/settings').then(setSettings).catch(() => setSettings({ error: true }))
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = useCallback((message, kind = 'success') => setToast({ message, kind }), [])

  const addToCart = useCallback((id, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === id)
      if (found) return prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, i.qty + qty) } : i))
      return [...prev, { id, qty: Math.min(99, Math.max(1, qty)) }]
    })
  }, [])

  const setQty = useCallback((id, qty) => {
    setCart((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, qty) } : i))))
  }, [])

  const removeFromCart = useCallback((id) => setCart((prev) => prev.filter((i) => i.id !== id)), [])
  const clearCart = useCallback(() => setCart([]), [])
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart])
  const cartIds = useMemo(() => cart.map((i) => i.id), [cart])

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }, [])

  return (
    <SettingsContext.Provider value={settings}>
      <ToastContext.Provider value={showToast}>
        <CartContext.Provider value={{ cart, cartIds, cartCount, addToCart, setQty, removeFromCart, clearCart }}>
          <FavContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
            {toast && (
              <div className={`toast toast-${toast.kind}`} role="status">
                {toast.message}
              </div>
            )}
          </FavContext.Provider>
        </CartContext.Provider>
      </ToastContext.Provider>
    </SettingsContext.Provider>
  )
}
