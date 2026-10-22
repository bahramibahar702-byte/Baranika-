import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Preview-only override: the sandbox proxy reaches the dev server through a
// rotating external hostname, so when BASE44_PREVIEW_MODE=1 we accept it.
// Without the flag the default (strict) host checking is preserved.
const isPreview = process.env.BASE44_PREVIEW_MODE === '1'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    ...(isPreview ? { allowedHosts: true } : {}),
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
