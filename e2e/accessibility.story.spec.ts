import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { story } from 'executable-stories-playwright'

// The deeper argument of the guide: a role-based test is partial a11y testing.
// axe makes that explicit — the good region is clean, the bad one is not, even
// though a test-id-only suite would report both as green.
test.describe('Accessibility — what the test id hid', () => {
  test('GOOD: the semantic login form has no serious axe violations', async ({
    page,
  }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'a11y', 'good'] })
    story.given('the demo page, scoped to the good login form')
    await page.goto('/')

    story.then('axe reports no serious or critical violations in that region')
    const results = await new AxeBuilder({ page })
      .include('section[aria-label="Login form (good)"]')
      .disableRules(['color-contrast'])
      .analyze()
    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    )
    expect(serious.map((v) => v.id)).toEqual([])
  })

  test('SUBTLE: axe is satisfied by a placeholder, but getByLabel is not', async ({
    page,
  }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'a11y', 'bad'] })
    story.given('the bad login form, whose inputs have a placeholder but no real label')
    await page.goto('/')
    const region = page.getByRole('region', { name: 'Login form (bad)' })

    story.when('axe analyses just that region')
    const results = await new AxeBuilder({ page })
      .include('section[aria-label="Login form (bad)"]')
      .disableRules(['color-contrast'])
      .analyze()
    await testInfo.attach('axe-bad-login', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    })

    story.then(
      'axe reports no serious violations — a placeholder counts as an accessible name in the name algorithm',
    )
    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    )
    expect(serious.map((v) => v.id)).toEqual([])

    story.and(
      'yet getByLabel finds nothing, and there is no submit button — so the label selector is the safety net axe is not',
    )
    await expect(region.getByLabel('Email address')).toHaveCount(0)
    await expect(region.getByRole('button', { name: 'Sign in' })).toHaveCount(0)
  })

  test('SUBTLE: shadcn bad login — axe may pass on placeholders, labels still missing', async ({
    page,
  }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'a11y', 'shadcn', 'bad'] })
    story.given('the shadcn bad login form with placeholders instead of FieldLabel')
    await page.goto('/')
    const region = page.getByRole('region', { name: 'shadcn login (bad)' })

    story.when('axe analyses just that region')
    const results = await new AxeBuilder({ page })
      .include('section[aria-label="shadcn login (bad)"]')
      .disableRules(['color-contrast'])
      .analyze()
    await testInfo.attach('axe-shadcn-bad-login', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    })

    story.then('axe may report no serious violations — placeholders count as names')
    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    )
    expect(serious.map((v) => v.id)).toEqual([])

    story.and('yet getByLabel finds nothing — and the real Button is still keyboard-reachable')
    await expect(region.getByLabel('Email address')).toHaveCount(0)
    await expect(region.getByRole('button', { name: 'Sign in' })).toBeVisible()
  })

  test('BAD: shadcn dialog without DialogTitle has no accessible name', async ({
    page,
  }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'a11y', 'shadcn', 'bad', 'dialog'] })
    story.given('the shadcn bad widget dialog, opened')
    await page.goto('/')
    const region = page.getByRole('region', { name: 'shadcn widget dialog (bad)', exact: true })
    await region.getByRole('button', { name: 'Open widget' }).click()

    story.when('axe analyses the page with the portaled dialog open')
    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze()
    await testInfo.attach('axe-shadcn-bad-dialog', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    })

    story.then('axe flags the missing name — aria-dialog-name is a serious violation')
    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    )
    expect(serious.map((v) => v.id)).toContain('aria-dialog-name')

    story.and('the named-role query catches the same gap without axe')
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('dialog', { name: 'Widget' })).toHaveCount(0)
  })
})
