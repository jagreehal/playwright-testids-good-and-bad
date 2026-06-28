/**
 * The hardest pro-test-id case: a conditional wrapper with only optional text.
 *
 * A wrapper renders only when an optional prop is set, and its only content is
 * that same optional text. One camp says "write the positive test by text, then
 * invert it." The counter-argument is that the inversion proves nothing: with
 * the text gone, a text query cannot tell an absent wrapper from a present-but-
 * empty one. These three variants make both positions concrete and show where
 * each holds.
 */

/**
 * GOOD — the announcement has a role, so presence and absence are both provable.
 *
 * A promo banner is something a screen reader should announce, so role="status"
 * is the honest markup, not a test convenience. The role gives the element an
 * identity independent of its text:
 *   getByRole('status')             when it should be there
 *   queryByRole('status')  -> null  when it should not
 * Give the thing a role and the whole ambiguity disappears.
 */
export function PromoBanner({ message }: { message?: string }) {
  if (!message) return null
  return (
    <div role="status" className="rounded border p-2">
      {message}
    </div>
  )
}

/**
 * FALLBACK — a purely visual ribbon with no role that fits.
 *
 * Sometimes the wrapper is decoration: a coloured ribbon that adds nothing a
 * screen reader should announce, so role="status" would be noise. Its only
 * content is the optional text. When a test must assert this wrapper is present
 * or absent, the test id is the only honest handle. This is the case where a
 * test id is not just allowed, it is the only solution.
 *   getByTestId('promo-ribbon')             when set
 *   queryByTestId('promo-ribbon')  -> null  when unset
 */
export function PromoRibbonById({ message }: { message?: string }) {
  if (!message) return null
  return (
    <div data-testid="promo-ribbon" className="rounded bg-good/10 p-2">
      {message}
    </div>
  )
}

/**
 * BAD — the same ribbon with a rendering bug, kept to prove the point.
 *
 * This version always mounts the wrapper, even with no message, leaving a stray
 * empty box on screen. A text-only inversion (queryByText) passes against it and
 * reports green, because the string really is gone. Only a query on the element
 * itself (test id here, or a role) catches the empty wrapper the user can see.
 */
export function PromoRibbonBuggy({ message }: { message?: string }) {
  return (
    <div data-testid="promo-ribbon" className="rounded bg-good/10 p-2">
      {message}
    </div>
  )
}
