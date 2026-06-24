import { useState } from 'react'

/**
 * ACCEPTABLE use of a test id — copy that changes often.
 *
 * This button is A/B tested: the label flips between "Continue securely" and
 * "Secure checkout". The *flow* matters, not the exact wording, so the test id
 * is a stable handle for "the primary checkout action".
 *
 * Note two things that keep this honest:
 *  1. It is still a real <button>, so a role selector would also work.
 *  2. When the wording is part of the requirement, assert it separately — see
 *     the test, which checks toHaveTextContent on the same element.
 */
export function CheckoutButton({
  label = 'Continue securely',
  onCheckout,
}: {
  label?: string
  onCheckout?: () => void
}) {
  const [done, setDone] = useState(false)
  return (
    <div>
      <button
        type="button"
        data-testid="checkout-primary-action"
        onClick={() => {
          setDone(true)
          onCheckout?.()
        }}
        className="rounded bg-primary text-primary-foreground px-3 py-1.5"
      >
        {label}
      </button>
      {done ? (
        <section data-testid="checkout-result" className="mt-2">
          <p>Order placed</p>
        </section>
      ) : null}
    </div>
  )
}
