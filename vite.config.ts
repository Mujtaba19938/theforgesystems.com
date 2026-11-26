import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Inline (empty) PostCSS config so Vite doesn't pick up a stray
  // postcss.config from a parent folder. Tailwind runs via the plugin above.
  css: { postcss: {} },
  server: {
    port: Number(process.env.PORT) || 5173,
  },
})
