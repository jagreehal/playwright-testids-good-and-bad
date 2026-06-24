export const CHECKOUT_LABELS = {
  en: 'Continue to payment',
  fr: 'Passer au paiement',
  ar: 'المتابعة إلى الدفع',
} as const

export type CheckoutLocale = keyof typeof CHECKOUT_LABELS

/**
 * GOOD — localized copy still works with semantic selectors when the test uses
 * the same translation source as the app.
 */
export function LocalizedCheckoutGood({
  locale = 'en',
  onContinue,
}: {
  locale?: CheckoutLocale
  onContinue?: (locale: CheckoutLocale) => void
}) {
  const label = CHECKOUT_LABELS[locale]

  return (
    <button
      type="button"
      onClick={() => onContinue?.(locale)}
      className="rounded border px-3 py-1.5"
    >
      {label}
    </button>
  )
}

/**
 * FALLBACK — the action stays the same, but the copy comes from a CMS or an
 * experiment and is not stable enough to be the test contract.
 *
 * The id stabilizes selection. It does not replace accessible button markup.
 */
export function LocalizedCheckoutById({
  label,
  onContinue,
}: {
  label: string
  onContinue?: () => void
}) {
  return (
    <button
      type="button"
      data-testid="checkout-primary-action"
      onClick={() => onContinue?.()}
      className="rounded border px-3 py-1.5"
    >
      {label}
    </button>
  )
}
