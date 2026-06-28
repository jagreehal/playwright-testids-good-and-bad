import { useId } from 'react'

/**
 * Stand-in for a third-party date picker that DOES expose a control. It renders
 * an input with role="combobox" and its own popup behaviour, but it ships no
 * label and no accessible name. Pretend this came from node_modules.
 */
function ThirdPartyDatePicker({ id }: { id?: string }) {
  return (
    <input
      id={id}
      role="combobox"
      aria-expanded="false"
      aria-haspopup="dialog"
      readOnly
      placeholder="YYYY-MM-DD"
      className="border rounded px-2 py-1"
    />
  )
}

/**
 * Stand-in for the harder kind of widget: one that paints itself and exposes
 * nothing to the accessibility tree. The real control lives in a <canvas> (or a
 * closed shadow root, or a portal) you cannot pierce, so there is no role, no
 * name, and nothing for a label to point at. This is the case where a wrapper
 * test id is genuinely the only handle.
 */
function ThirdPartyCanvasPicker() {
  return (
    <div className="border rounded px-2 py-1 text-sm text-muted-foreground select-none">
      {/* the widget renders its UI into a canvas; nothing here has a role */}
      <canvas width={160} height={20} aria-hidden="true" />
    </div>
  )
}

/**
 * GOOD — the widget is theirs, the wrapper is yours, so name it there.
 *
 * You cannot edit the third-party input, but you control the markup around it.
 * A <label htmlFor> pointed at the widget's id gives the combobox the
 * accessible name it was missing, so a screen-reader user and the test reach it
 * the same way:
 *   getByRole('combobox', { name: 'Choose date' })
 *   getByLabelText('Choose date')
 * No test id needed — you closed the gap the library left. The id comes from
 * useId() so two of these on a page do not share an id and cross-wire labels.
 */
export function DatePickerFieldGood() {
  const id = useId()
  return (
    <div className="grid gap-1 max-w-sm">
      <label htmlFor={id}>Choose date</label>
      <ThirdPartyDatePicker id={id} />
    </div>
  )
}

/**
 * FALLBACK — the test id, when the widget exposes nothing to name.
 *
 * This widget paints into a canvas, so there is no role to query and no control
 * to label. The visible "Choose date" text is a plain <span>, not a label, and
 * it associates with nothing. With no accessible handle anywhere, a wrapper
 * test id you own is the only honest way to assert your field rendered. Do not
 * reach into the library's internal DOM — that tests the library, not your app.
 */
export function DatePickerFieldById() {
  return (
    <div data-testid="booking-date-field" className="grid gap-1 max-w-sm">
      <span className="text-sm">Choose date</span>
      <ThirdPartyCanvasPicker />
    </div>
  )
}
