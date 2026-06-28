import '@testing-library/jest-dom/vitest'

// With vitest `globals: true`, @testing-library/react registers its own afterEach
// cleanup on import, so a manual cleanup here is redundant. The testing-library
// lint rule (no-manual-cleanup) flags it, and the repo follows its own advice.
