import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// COMPONENT TIER — React Testing Library in jsdom.
// Every test renders a real component and queries it the way the guide
// recommends (role / label / text) or the way it warns against (test id), so
// the contrast between a good and a bad selector is executable, not theoretical.
//
//   pnpm test
//
// The executable-stories reporter turns each `it` into living docs under docs/.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.story.test.{ts,tsx}'],
    reporters: [
      'default',
      [
        'executable-stories-vitest/reporter',
        {
          formats: ['html', 'markdown'],
          outputDir: 'docs',
          outputName: 'component-stories',
          output: { mode: 'aggregated' },
          html: {
            title: 'data-testid — Good vs Bad (Component Tier)',
            darkMode: true,
            searchable: true,
          },
        },
      ],
    ],
  },
})
