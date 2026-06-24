import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Unmount everything between tests so queries never see a stale render.
afterEach(() => {
  cleanup()
})
