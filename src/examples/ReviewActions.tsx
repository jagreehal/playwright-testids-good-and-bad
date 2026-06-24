/**
 * GOOD — stable copy, semantic button, and a selector abstraction can still
 * hide the locator details from the test.
 */
export function ReviewActionsGood({
  onSendBack,
}: {
  onSendBack?: () => void
}) {
  return (
    <div className="grid gap-3 max-w-sm">
      <p>Ready for editorial review</p>
      <button
        type="button"
        onClick={() => onSendBack?.()}
        className="rounded border px-3 py-1.5"
      >
        Send back to reviewer
      </button>
    </div>
  )
}

/**
 * FALLBACK — the action is stable, but the visible copy is an experiment, so
 * the test contract moves behind a test id while the test API stays the same.
 *
 * The abstraction changes the locator without sacrificing the accessible
 * button underneath.
 */
export function ReviewActionsById({
  label,
  onSendBack,
}: {
  label: string
  onSendBack?: () => void
}) {
  return (
    <div className="grid gap-3 max-w-sm">
      <p>Ready for editorial review</p>
      <button
        type="button"
        data-testid="send-back-to-reviewer-button"
        onClick={() => onSendBack?.()}
        className="rounded border px-3 py-1.5"
      >
        {label}
      </button>
    </div>
  )
}
