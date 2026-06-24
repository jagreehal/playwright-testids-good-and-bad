/**
 * GOOD — a loading state announced to assistive tech.
 *
 * "Loading" is information a screen-reader user needs, not decoration. The
 * spinner lives in a role="status" region with an accessible name, so a real
 * user is told the page is working and the test reaches the same node:
 *   getByRole('status', { name: 'Loading' })
 * The spinning shape itself stays aria-hidden — the name carries the meaning.
 */
export function LoadingPanel({ loading }: { loading: boolean }) {
  return (
    <div className="rounded border p-4">
      {loading ? (
        <div role="status" aria-label="Loading">
          <span
            aria-hidden="true"
            className="block size-5 animate-spin rounded-full border-2 border-muted border-t-foreground"
          />
        </div>
      ) : (
        <p>Dashboard ready</p>
      )}
    </div>
  )
}

/**
 * FALLBACK — a purely decorative spinner.
 *
 * When the loading state is already announced elsewhere — an aria-busy region,
 * a separate status message — the spinner itself is decoration: aria-hidden,
 * no role to query. A test id is the only handle, and that is honest here
 * because it marks something a user is not meant to perceive on its own.
 *
 *   expect(getByTestId('loading-spinner')).toBeVisible()  // while loading
 *   expect(queryByTestId('loading-spinner')).toBeNull()   // once loaded
 */
export function LoadingPanelDecorative({ loading }: { loading: boolean }) {
  return (
    <div className="rounded border p-4" aria-busy={loading}>
      {loading ? (
        <div
          data-testid="loading-spinner"
          aria-hidden="true"
          className="size-5 animate-spin rounded-full border-2 border-muted border-t-foreground"
        />
      ) : (
        <p>Dashboard ready</p>
      )}
    </div>
  )
}
