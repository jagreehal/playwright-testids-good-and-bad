import { expect, test } from '@playwright/test'
import { story } from 'executable-stories-playwright'

// The component suite clicks the bad "button" with userEvent.click and it
// passes, because a click handler fires on anything. A real keyboard does not
// work that way. These stories Tab and press Enter in a real browser, where the
// div-button the role query already rejected also turns out to be unreachable.
test.describe('Keyboard — the test the click hides', () => {
  test('GOOD: the real button is in the tab order and Enter submits', async ({
    page,
  }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'keyboard', 'good'] })
    story.given('the good login form, whose submit control is a real <button>')
    await page.goto('/')
    const region = page.getByRole('region', { name: 'Login form (good)' })

    story.when('a keyboard user tabs from the email field toward the submit')
    await region.getByLabel('Email address').focus()
    await page.keyboard.press('Tab') // password
    await page.keyboard.press('Tab') // Sign in

    story.then('focus lands on the button — it is part of the tab order')
    await expect(region.getByRole('button', { name: 'Sign in' })).toBeFocused()

    story.and('pressing Enter activates it, and the form responds')
    await page.keyboard.press('Enter')
    await expect(region.getByRole('alert')).toHaveText('Enter your email and password.')
  })

  test('BAD: the div-button is skipped by Tab and never receives focus', async ({
    page,
  }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'keyboard', 'bad'] })
    story.given('the bad login form, whose submit is a <div> with an onClick')
    await page.goto('/')
    const region = page.getByRole('region', { name: 'Login form (bad)' })
    const fakeButton = region.getByText('Sign in', { exact: true })

    story.when('a keyboard user tabs forward from the password field')
    await region.getByPlaceholder('Password').focus()
    await page.keyboard.press('Tab')

    story.then('there is no button to find, and the div never takes focus')
    await expect(region.getByRole('button', { name: 'Sign in' })).toHaveCount(0)
    await expect(fakeButton).not.toBeFocused()

    story.and('focus skips past the div and leaves the form — nothing inside it is focused now')
    await expect(region.locator(':focus')).toHaveCount(0)

    story.and('a mouse click fires the handler, so the component test stays green and hides this')
  })
})
