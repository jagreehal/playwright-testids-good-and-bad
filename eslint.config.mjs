import js from '@eslint/js'
import testingLibrary from 'eslint-plugin-testing-library'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// A teaching repo should lint the way it preaches. The testing-library plugin
// nudges every selector toward the screen/role queries this repo argues for, so
// a future contributor who reaches for a brittle pattern hears it from the
// linter, not just the prose.
export default tseslint.config(
  {
    ignores: [
      'dist',
      'docs',
      'node_modules',
      'patches',
      'playwright-report',
      'test-results',
    ],
  },

  // TypeScript and React source across the repo.
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  // The component suite, held to Testing Library's good-practice rules.
  {
    files: ['tests/**/*.{ts,tsx}'],
    ...testingLibrary.configs['flat/react'],
  },

  // The e2e suite is Playwright, not Testing Library; its queries follow a
  // different API, so the React-DOM rules do not apply here.
  {
    files: ['e2e/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
)
