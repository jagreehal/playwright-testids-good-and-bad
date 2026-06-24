import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// A plain client-only SPA. No server seam — the whole point of this repo is the
// markup and the selectors, not a backend. Playwright drives this build.
export default defineConfig({
  // GitHub Pages serves a project site under /<repo>/, so the CI build sets
  // BASE=/<repo>/ for correct asset URLs. Local dev/preview leave it as '/'.
  base: process.env.BASE ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173 },
  preview: { port: 5173 },
})
