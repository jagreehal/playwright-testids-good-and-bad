import { useId } from 'react'

/**
 * GOOD — a real label, hidden from view but not from the name.
 *
 * Design wants no visible "Search" caption above the box, so the label is
 * visually hidden with sr-only. It still associates via htmlFor/id, so the
 * input keeps a stable accessible name a screen reader announces and a test
 * queries the same way:
 *   getByRole('searchbox', { name: 'Search products' })
 *   getByLabelText('Search products')
 * type="search" gives the input the searchbox role for free. (sr-only is a
 * Tailwind utility; in a non-Tailwind codebase, use any visually-hidden class.)
 * The id comes from useId() so the wiring still holds when the component renders
 * more than once on a page — a fixed string would collide.
 */
export function SearchInputGood() {
  const id = useId()
  return (
    <form role="search" className="max-w-sm">
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        type="search"
        placeholder="Try 'wireless headphones'"
        className="border rounded px-2 py-1 w-full"
      />
    </form>
  )
}

/**
 * ACCEPTABLE — aria-label when the box ships with no visible label by design.
 *
 * Same rule as the reviews filter: nothing visible names this control, so
 * aria-label is the right tool, and the name reads like something you would
 * announce to a user ("Search products"), not a test slug. The placeholder
 * stays as a hint, never as the name.
 *   getByRole('searchbox', { name: 'Search products' })
 */
export function SearchInputAriaLabel() {
  return (
    <form role="search" className="max-w-sm">
      <input
        type="search"
        aria-label="Search products"
        placeholder="Try 'wireless headphones'"
        className="border rounded px-2 py-1 w-full"
      />
    </form>
  )
}

/**
 * BAD — a placeholder doing a label's job.
 *
 * There is no <label> and no aria-label, so the only handle is the placeholder:
 *   getByPlaceholderText('Search products')
 * Testing Library ranks that query near the bottom for a reason. The hint
 * disappears the moment the user types, screen-reader support for placeholder
 * names is inconsistent, and getByLabelText finds nothing here — there is no
 * label to find. A persistent name beats a hint that evaporates on first
 * keystroke.
 */
export function SearchInputBad() {
  return (
    <div className="max-w-sm">
      <input
        type="search"
        placeholder="Search products"
        className="border rounded px-2 py-1 w-full"
      />
    </div>
  )
}
