import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { story } from 'executable-stories-vitest'
import { describe, expect, it, vi } from 'vitest'
import {
  CHECKOUT_LABELS,
  type CheckoutLocale,
  LocalizedCheckoutById,
  LocalizedCheckoutGood,
} from '@/examples/LocalizedActions'

function checkoutLabel(locale: CheckoutLocale) {
  return CHECKOUT_LABELS[locale]
}

describe('Localized actions — i18n without selector churn', () => {
  it('GOOD: a semantic locator still works across locales when the test uses the same messages', async ({
    task,
  }) => {
    story.init(task)
    story.tag('good')
    story.given('a localized checkout button rendered in French')
    const onContinue = vi.fn()
    render(<LocalizedCheckoutGood locale="fr" onContinue={onContinue} />)
    const user = userEvent.setup()

    story.when('the test asks for the translated accessible name instead of hard-coding English')
    await user.click(screen.getByRole('button', { name: checkoutLabel('fr') }))

    story.then('the semantic locator stays accurate and the right locale flows through')
    expect(onContinue).toHaveBeenCalledWith('fr')
  })

  it('FALLBACK: a test id is fine when locale text comes from an unstable content source', async ({
    task,
  }) => {
    story.init(task)
    story.tag('good')
    story.given('a localized checkout action whose copy comes from a CMS experiment')
    const onContinue = vi.fn()
    render(<LocalizedCheckoutById label="Terminer l’achat en sécurité" onContinue={onContinue} />)
    const user = userEvent.setup()

    story.when('the test drives the action by its stable contract instead of unstable wording')
    const button = screen.getByTestId('checkout-primary-action')
    await user.click(button)

    story.then('the flow still works')
    expect(onContinue).toHaveBeenCalled()

    story.and('the current locale copy can still be asserted when it matters')
    expect(button).toHaveTextContent('Terminer l’achat en sécurité')
  })
})
