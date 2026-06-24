/**
 * GOOD — a named landmark, no test id needed.
 *
 * Point aria-labelledby at the heading and the <section> becomes a region with
 * an accessible name. A screen-reader user navigates to it by that name, and a
 * role query finds it the same way:
 *   getByRole('region', { name: 'Payment status' })
 * The id locates nothing here because the role already does.
 */
export function PaymentStatus({ status = 'Payment complete' }: { status?: string }) {
  return (
    <section aria-labelledby="payment-status-heading" className="rounded border p-4">
      <h2 id="payment-status-heading" className="font-medium">
        Payment status
      </h2>
      <p>{status}</p>
    </section>
  )
}

/**
 * GOOD — an async result announced to assistive tech.
 *
 * When the status lands after an API call, role="status" makes it a live region
 * (implicit aria-live="polite"), so a screen reader announces the change. The
 * test reaches it the same way the user is told about it:
 *   getByRole('status')
 */
export function PaymentStatusLive({ status = 'Payment complete' }: { status?: string }) {
  return (
    <p role="status" className="rounded border p-4">
      {status}
    </p>
  )
}

/**
 * FALLBACK — the test id, for a wrapper with genuinely no name to give.
 *
 * Some structural container carries no heading and groups nothing a user would
 * name. Only then does data-testid earn the scope, and the assertion still
 * checks the user-visible text inside it. Reach for this after the named region
 * and the live region, not before.
 */
export function PaymentStatusById({ status = 'Payment complete' }: { status?: string }) {
  return (
    <div data-testid="payment-status" className="rounded border p-4">
      <p>{status}</p>
    </div>
  )
}

/**
 * BAD counter-example — "wrapper soup".
 *
 * A test id on every nesting level. None of them identify anything meaningful;
 * they are a second set of class names. A test id should mark something that
 * matters, not every <div> on the way down.
 */
export function WrapperSoup() {
  return (
    <div data-testid="page-wrapper">
      <div data-testid="content-wrapper">
        <div data-testid="form-wrapper">
          <button data-testid="button-1" className="rounded border px-2 py-1">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
