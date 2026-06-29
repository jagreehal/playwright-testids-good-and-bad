import { expect, test } from '@playwright/test'
import { story } from 'executable-stories-playwright'

test.describe('shadcn selectors — primitives vs application semantics', () => {
  test('GOOD: shadcn login form is driven by label and role', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'shadcn', 'good', 'login'] })
    story.given('the demo page, scoped to the good shadcn login form')
    await page.goto('/')
    const region = page.getByRole('region', { name: 'shadcn login (good)' })

    story.when('the user fills fields by label and submits by role')
    await region.getByLabel('Email address').fill('jag@example.com')
    await region.getByLabel('Password').fill('hunter2')
    await region.getByRole('button', { name: 'Sign in' }).click()

    story.then('label and role selectors resolve — the wiring is correct')
    await expect(region.getByRole('button', { name: 'Sign in' })).toBeVisible()
  })

  test('BAD: shadcn login passes by test id but labels are missing', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'shadcn', 'bad', 'login'] })
    story.given('the shadcn bad login form with placeholders instead of FieldLabel')
    await page.goto('/')
    const region = page.getByRole('region', { name: 'shadcn login (bad)' })

    story.when('the test reaches controls by data-testid')
    await region.getByTestId('shadcn-email-input').fill('jag@example.com')
    await region.getByTestId('shadcn-login-submit').click()

    story.then('test ids work')
    await expect(region.getByTestId('shadcn-login-submit')).toBeVisible()

    story.and('but getByLabel finds nothing — shadcn does not add labels for you')
    await expect(region.getByLabel('Email address')).toHaveCount(0)

    story.and('the submit button still exists by role — the Button primitive is real')
    await expect(region.getByRole('button', { name: 'Sign in' })).toBeVisible()
  })

  test('GOOD vs BAD: shadcn icon button needs an application-provided name', async ({
    page,
  }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'shadcn', 'icon-button'] })
    story.given('the demo page')
    await page.goto('/')

    story.when('the good icon button is clicked by accessible name')
    const good = page.getByRole('region', { name: 'shadcn icon button (good)' })
    await good.getByRole('button', { name: 'Delete item' }).click()
    await expect(good.getByRole('status')).toHaveText('Item deleted')

    story.and('the bad version is a real button but has no name')
    const bad = page.getByRole('region', { name: 'shadcn icon button (bad)' })
    await expect(bad.getByRole('button', { name: 'Delete item' })).toHaveCount(0)
    await expect(bad.getByRole('button')).toHaveCount(1)
    await bad.getByTestId('shadcn-delete-btn').click()
    await expect(bad.getByTestId('shadcn-delete-result')).toBeVisible()
  })

  test('GOOD: shadcn dialog exposes a named dialog; BAD has no title', async ({
    page,
  }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'shadcn', 'dialog'] })
    story.given('the demo page')
    await page.goto('/')

    story.when('the user opens the good shadcn dialog')
    const good = page.getByRole('region', { name: 'shadcn widget dialog (good)', exact: true })
    await good.getByRole('button', { name: 'Open widget' }).click()
    // Dialog portals to document body — query at page scope, not inside the region.
    const namedDialog = page.getByRole('dialog', { name: 'Widget' })
    await expect(namedDialog).toBeVisible()
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(namedDialog).toHaveCount(0)

    story.and('the bad dialog opens with a role but no accessible name')
    const bad = page.getByRole('region', { name: 'shadcn widget dialog (bad)', exact: true })
    await bad.getByRole('button', { name: 'Open widget' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('dialog', { name: 'Widget' })).toHaveCount(0)
    await page.getByRole('button', { name: 'Close' }).click()
  })

  test('GOOD vs BAD: shadcn search field label strategy', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'shadcn', 'search'] })
    story.given('the demo page')
    await page.goto('/')

    story.then('the good search field is reachable by label')
    const good = page.getByRole('region', { name: 'shadcn search (good)' })
    await expect(good.getByLabel('Search products')).toBeVisible()

    story.and('the bad search field has only a placeholder')
    const bad = page.getByRole('region', { name: 'shadcn search (bad)' })
    await expect(bad.getByLabel('Search products')).toHaveCount(0)
    await expect(bad.getByPlaceholder('Search products')).toBeVisible()
  })
})
