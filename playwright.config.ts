import { defineConfig, devices } from '@playwright/test'

const CI = !!process.env.CI

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    [
      'executable-stories-playwright/reporter',
      {
        formats: ['html', 'markdown'],
        outputDir: 'docs',
        outputName: 'e2e-stories',
        output: { mode: 'aggregated' },
        html: { title: 'data-testid — Good vs Bad (E2E Tier)', darkMode: true, searchable: true },
      },
    ],
  ],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // One vite process serves the demo app. No backend, no mocks — the pages are
  // static React, so the only thing under test is the markup and the selectors.
  webServer: {
    command: 'pnpm dev --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !CI,
    timeout: 120_000,
  },
})
