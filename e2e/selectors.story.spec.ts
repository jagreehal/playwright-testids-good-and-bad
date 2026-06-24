import { expect, test } from '@playwright/test'
import { story } from 'executable-stories-playwright'

// E2E TIER — the same good/bad contrast, now in a real browser.
// In Playwright the recommended order is the same as Testing Library: role and
// label first, test id as the deliberate escape hatch.
test.describe('Selectors in the browser — good vs bad', () => {
  test('GOOD: the login form is driven by role and label', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'good', 'login'] })
    story.given('the demo page')
    await page.goto('/')

    story.when('the user fills the good login form by label and submits by role')
    const region = page.getByRole('region', { name: 'Login form (good)' })
    await region.getByLabel('Email address').fill('jag@example.com')
    await region.getByLabel('Password').fill('hunter2')
    await region.getByRole('button', { name: 'Sign in' }).click()

    story.then('the selectors resolve — proving the form is reachable like a user would')
    await expect(region.getByRole('button', { name: 'Sign in' })).toBeVisible()
  })

  test('BAD: the broken form is only reachable by test id', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'bad', 'login'] })
    story.given('the demo page')
    await page.goto('/')
    const region = page.getByRole('region', { name: 'Login form (bad)' })

    story.when('the test reaches the controls by data-testid')
    await region.getByTestId('email-input').fill('jag@example.com')
    await region.getByTestId('login-submit-btn').click()

    story.then('the test id path works')
    await expect(region.getByTestId('login-submit-btn')).toBeVisible()

    story.and('but there is no button or labelled email field for a real user')
    await expect(region.getByRole('button', { name: 'Sign in' })).toHaveCount(0)
    await expect(region.getByLabel('Email address')).toHaveCount(0)
  })

  test('GOOD vs BAD: icon button has an accessible name only in the good version', async ({
    page,
  }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'icon-button'] })
    story.given('the demo page')
    await page.goto('/')

    story.when('the good icon button is clicked by its accessible name')
    const good = page.getByRole('region', { name: 'Icon button (good)' })
    await good.getByRole('button', { name: 'Delete payment' }).click()

    story.then('it confirms the action via a status message')
    await expect(good.getByRole('status')).toHaveText('Payment deleted')

    story.and('the bad version exposes no button at all — only a test id')
    const bad = page.getByRole('region', { name: 'Icon button (bad)' })
    await expect(bad.getByRole('button')).toHaveCount(0)
    await bad.getByTestId('delete-payment').click()
    await expect(bad.getByTestId('delete-result')).toBeVisible()
  })

  test('GOOD: dialog open/close reads like the journey; BAD exposes no dialog', async ({
    page,
  }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'dialog'] })
    story.given('the demo page')
    await page.goto('/')

    story.when('the user opens the good widget dialog')
    const good = page.getByRole('region', { name: 'Widget dialog (good)' })
    await good.getByRole('button', { name: 'Open widget' }).click()

    story.then('a real dialog with an accessible name appears')
    await expect(good.getByRole('dialog', { name: 'Widget' })).toBeVisible()

    story.and('the bad version opens content that is never exposed as a dialog')
    const bad = page.getByRole('region', { name: 'Widget dialog (bad)' })
    await bad.getByTestId('open-widget').click()
    await expect(bad.getByTestId('widget-dialog')).toBeVisible()
    await expect(bad.getByRole('dialog')).toHaveCount(0)
  })

  test('GOOD: repeated rows are picked by accessible name', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'product-list'] })
    story.given('the demo page')
    await page.goto('/')

    story.when('the user adds exactly the Wool Socks by name')
    const good = page.getByRole('region', { name: 'Product list (good)' })
    await good.getByRole('button', { name: 'Add Wool Socks to basket' }).click()

    story.then('the bad list offers no per-product name — only add-1, add-2…')
    const bad = page.getByRole('region', { name: 'Product list (bad)' })
    await expect(bad.getByRole('button', { name: /Wool Socks/i })).toHaveCount(0)
    await expect(bad.getByTestId('add-2')).toBeVisible()
  })

  test('LEGIT: try the role first, fall to a test id only when no name exists', async ({
    page,
  }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'good', 'test-id'] })
    story.given('the demo page')
    await page.goto('/')

    story.when('the payment status is a named region')
    const status = page.getByRole('region', { name: 'Payment status', exact: true })

    story.then('a role query finds it the way a screen-reader user navigates to it')
    await expect(status).toContainText('Payment complete')

    story.and('the loading state is a live region, announced and queryable by role')
    const loading = page.getByRole('region', { name: 'Loading state (live region)' })
    await expect(loading.getByRole('status')).toBeVisible()

    story.and('the chart wrapper you own carries a text alternative')
    await expect(page.getByRole('img', { name: 'Monthly sales chart' })).toBeVisible()

    story.and('only the genuinely unnameable cases fall back to a test id')
    await expect(page.getByTestId('payment-status')).toContainText('Payment complete')
    await expect(page.getByTestId('monthly-sales-chart')).toBeVisible()
    await expect(page.getByTestId('loading-spinner')).toBeVisible()
  })
})
