import { useState } from 'react'

/**
 * GOOD — a real button opens a real dialog.
 *
 * The trigger is a <button>. The dialog has role="dialog", an accessible name,
 * and a close button. Tests read like the user's steps:
 *   getByRole('button', { name: 'Open widget' }).click()
 *   getByRole('dialog', { name: 'Widget' })
 */
export function WidgetDialogGood() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded bg-primary text-primary-foreground px-3 py-1.5"
      >
        Open widget
      </button>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Widget"
          className="mt-3 rounded border p-4"
        >
          <h2 className="font-medium">Widget</h2>
          <p>The widget is open.</p>
          <button type="button" onClick={() => setOpen(false)} className="mt-2 rounded border px-2 py-1">
            Close
          </button>
        </div>
      ) : null}
    </div>
  )
}

/**
 * BAD — a clickable div opens a plain div.
 *
 * The "trigger" has no role and no keyboard access. The "dialog" is not exposed
 * as a dialog, has no focus management, and is not announced. Test ids make the
 * test green while the experience is broken.
 */
export function WidgetDialogBad() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div
        data-testid="open-widget"
        onClick={() => setOpen(true)}
        className="inline-block rounded bg-primary text-primary-foreground px-3 py-1.5 cursor-pointer select-none"
      >
        Open widget
      </div>
      {open ? (
        <div data-testid="widget-dialog" className="mt-3 rounded border p-4">
          <div data-testid="widget-title" className="font-medium">
            Widget
          </div>
          <div>The widget is open.</div>
          <div
            data-testid="widget-close"
            onClick={() => setOpen(false)}
            className="mt-2 inline-block rounded border px-2 py-1 cursor-pointer"
          >
            Close
          </div>
        </div>
      ) : null}
    </div>
  )
}
