import { useId } from 'react'

/**
 * GOOD — the visible heading is the accessible name, and the test uses it too.
 *
 * aria-labelledby points the <section> at its own heading, so the region's
 * accessible name is the words a sighted user reads: "Customer reviews". A
 * screen-reader user hears the same on landmark navigation, and the test finds
 * it by that name:
 *   getByRole('region', { name: 'Customer reviews' })
 * One name, shared by every audience. Nothing here exists only for the test.
 * useId() makes the heading id unique, so two of these on one page do not point
 * both sections at the first heading.
 */
export function ReviewsSectionGood({ count = 3 }: { count?: number }) {
  const headingId = useId()
  return (
    <section aria-labelledby={headingId} className="rounded border p-4">
      <h2 id={headingId} className="font-medium">
        Customer reviews
      </h2>
      <p>{count} reviews</p>
    </section>
  )
}

/**
 * BAD — an aria-label added only so a test can grab the section.
 *
 * The heading already says "Customer reviews", but someone wanted a stable
 * handle for the test and reached for aria-label instead of a test id, thinking
 * it is the more "accessible" choice. It is the opposite. aria-label outranks
 * the visible heading in the accessible-name algorithm, so the region's name in
 * the accessibility tree is now "reviews-section" — a slug no user should hear.
 *
 * This is worse than a data-testid, not better. A test id is invisible and
 * inaudible; this string is announced to a screen-reader user on landmark
 * navigation, and the visible name and the spoken name have silently diverged.
 * If you need a handle the user does not have, a test id is the honest place to
 * put it — it never touches the accessibility tree.
 */
export function ReviewsSectionLabelledForTest({ count = 3 }: { count?: number }) {
  return (
    <section aria-label="reviews-section" className="rounded border p-4">
      <h2 className="font-medium">Customer reviews</h2>
      <p>{count} reviews</p>
    </section>
  )
}

/**
 * ACCEPTABLE — aria-label when there is genuinely no name to inherit.
 *
 * This is the line the BAD case crosses. A filter toolbar has no heading and
 * groups controls a user would still want to navigate to. There is no visible
 * text to label it, so aria-label is the correct and only tool — and the name
 * is written for the user first ("Filter reviews"), not as a test slug. The
 * test reaching it by that same human name is a side effect, not the reason:
 *   getByRole('region', { name: 'Filter reviews' })
 *
 * The test: would you ship this name to a screen reader if no test existed? For
 * "Filter reviews", yes. For "reviews-section", no. That question separates a
 * real label from a test id wearing an aria-label costume.
 */
export function ReviewsFilterAcceptable() {
  return (
    <section aria-label="Filter reviews" className="rounded border p-4">
      <button type="button" className="rounded border px-2 py-1">
        Most recent
      </button>
      <button type="button" className="rounded border px-2 py-1">
        Highest rated
      </button>
    </section>
  )
}
