import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

/**
 * GOOD — shadcn icon button with an application-provided accessible name.
 *
 * The Button primitive is keyboard-focusable. aria-label is what your team
 * must add so getByRole('button', { name }) and screen readers agree.
 */
export function ShadcnIconButtonGood({ onDelete }: { onDelete?: () => void }) {
  const [deleted, setDeleted] = useState(false)
  return (
    <div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Delete item"
        onClick={() => {
          setDeleted(true)
          onDelete?.()
        }}
      >
        <Trash2 data-icon="inline-start" aria-hidden="true" />
      </Button>
      {deleted ? <p role="status">Item deleted</p> : null}
    </div>
  )
}

/**
 * BAD — shadcn icon button with no accessible name.
 *
 * getByRole('button') finds a button. getByRole('button', { name: 'Delete item' })
 * does not. A test id passes while the unnamed control is useless to assistive tech.
 */
export function ShadcnIconButtonBad({ onDelete }: { onDelete?: () => void }) {
  const [deleted, setDeleted] = useState(false)
  return (
    <div>
      <Button
        data-testid="shadcn-delete-btn"
        type="button"
        variant="outline"
        size="icon"
        onClick={() => {
          setDeleted(true)
          onDelete?.()
        }}
      >
        <Trash2 data-icon="inline-start" aria-hidden="true" />
      </Button>
      {deleted ? <div data-testid="shadcn-delete-result">Item deleted</div> : null}
    </div>
  )
}
