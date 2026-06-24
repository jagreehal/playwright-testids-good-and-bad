/**
 * Naming conventions — same two buttons, three ways.
 *
 * The lesson is not "test ids are bad", it is "name things by meaning".
 */

/** GOOD — real buttons, no test id needed. Found by role + name. */
export function SaveButtonsRole() {
  return (
    <div className="flex gap-2">
      <button type="button" className="rounded bg-primary text-primary-foreground px-3 py-1.5">
        Save
      </button>
      <button type="button" className="rounded border px-3 py-1.5">
        Cancel
      </button>
    </div>
  )
}

/** BAD — generic, meaningless test ids. Barely better than a CSS selector. */
export function SaveButtonsGenericIds() {
  return (
    <div className="flex gap-2">
      <button type="button" data-testid="button-1" className="rounded bg-primary text-primary-foreground px-3 py-1.5">
        Save
      </button>
      <button type="button" data-testid="button-2" className="rounded border px-3 py-1.5">
        Cancel
      </button>
    </div>
  )
}

/**
 * ACCEPTABLE — if you genuinely need a test id, name it by domain + purpose +
 * element type in kebab-case: `profile-save-button`, not `button-1`.
 */
export function SaveButtonsMeaningfulIds() {
  return (
    <div className="flex gap-2">
      <button type="button" data-testid="profile-save-button" className="rounded bg-primary text-primary-foreground px-3 py-1.5">
        Save
      </button>
      <button type="button" data-testid="profile-cancel-button" className="rounded border px-3 py-1.5">
        Cancel
      </button>
    </div>
  )
}
