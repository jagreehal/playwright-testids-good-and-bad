import { Trash2 } from 'lucide-react'
import { useState } from 'react'

/**
 * GOOD — an icon-only button with an accessible name.
 *
 * There is no visible text, so the name comes from aria-label. The icon is
 * aria-hidden because it is decorative. getByRole('button', { name: 'Delete
 * payment' }) finds it, and so does a screen reader user.
 */
export function IconButtonGood({ onDelete }: { onDelete?: () => void }) {
  const [deleted, setDeleted] = useState(false)
  return (
    <div>
      <button
        type="button"
        aria-label="Delete payment"
        onClick={() => {
          setDeleted(true)
          onDelete?.()
        }}
        className="rounded border p-2"
      >
        <Trash2 aria-hidden="true" className="size-4" />
      </button>
      {deleted ? <p role="status">Payment deleted</p> : null}
    </div>
  )
}

/**
 * BAD — an icon "button" that is really a clickable div with a test id.
 *
 * No role, no name, no keyboard access. A test id is the *only* way to reach it
 * from a test, which conveniently hides the fact that nobody using a keyboard
 * or screen reader can reach it at all.
 */
export function IconButtonBad({ onDelete }: { onDelete?: () => void }) {
  const [deleted, setDeleted] = useState(false)
  return (
    <div>
      <div
        data-testid="delete-payment"
        onClick={() => {
          setDeleted(true)
          onDelete?.()
        }}
        className="inline-flex rounded border p-2 cursor-pointer"
      >
        <Trash2 className="size-4" />
      </div>
      {deleted ? <div data-testid="delete-result">Payment deleted</div> : null}
    </div>
  )
}
