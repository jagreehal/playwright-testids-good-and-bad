import { expect, test } from '@playwright/test'
import { story } from 'executable-stories-playwright'

// Unlike the plain-HTML bad login, shadcn bad still ships a real Button.
// Tab and Enter work — the gap is labels, not keyboard reachability.
test.describe('shadcn keyboard — primitives work, labels do not', () => {
  test('GOOD: shadcn login tabs to submit and Enter activates it', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'shadcn', 'keyboard', 'good'] })
    story.given('the good shadcn login form with FieldLabel associations')
    await page.goto('/')
    const region = page.getByRole('region', { name: 'shadcn login (good)' })

    story.when('a keyboard user tabs from email toward submit')
    await region.getByLabel('Email address').focus()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    story.then('focus lands on the real shadcn Button')
    await expect(region.getByRole('button', { name: 'Sign in' })).toBeFocused()

    story.and('Enter activates it and the form responds')
    await page.keyboard.press('Enter')
    await expect(region.getByRole('alert')).toHaveText('Enter your email and password.')
  })

  test('SUBTLE: shadcn bad login still tabs to submit — unlike the plain-HTML bad form', async ({
    page,
  }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'shadcn', 'keyboard', 'bad'] })
    story.given('the shadcn bad login — placeholders, no FieldLabel, but a real Button')
    await page.goto('/')
    const region = page.getByRole('region', { name: 'shadcn login (bad)' })

    story.when('a keyboard user tabs forward from the password placeholder field')
    await region.getByPlaceholder('Password').focus()
    await page.keyboard.press('Tab')

    story.then('focus lands on the shadcn Button — keyboard access is not the problem here')
    await expect(region.getByRole('button', { name: 'Sign in' })).toBeFocused()

    story.and('getByLabel still finds nothing — that is the gap shadcn does not close for you')
    await expect(region.getByLabel('Email address')).toHaveCount(0)
    await expect(region.getByLabel('Password')).toHaveCount(0)
  })
})
