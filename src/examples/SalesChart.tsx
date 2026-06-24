/**
 * Stand-in for a third-party chart library. You do not control this markup: it
 * renders an <svg> soup with no roles or labels, and its internals can change
 * between versions. Pretend this came from node_modules.
 */
function ThirdPartyChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  return (
    <svg viewBox="0 0 120 40" width="120" height="40">
      {data.map((value, index) => (
        <rect
          key={index}
          x={index * 20 + 2}
          y={40 - (value / max) * 36}
          width="16"
          height={(value / max) * 36}
          fill="currentColor"
        />
      ))}
    </svg>
  )
}

/**
 * GOOD — give the wrapper you own an image role and a text alternative.
 *
 * You cannot fix the <svg> soup inside, but the container is yours. role="img"
 * plus an aria-label summarising the chart gives a screen-reader user the gist
 * and gives the test a role-based handle:
 *   getByRole('img', { name: 'Monthly sales chart' })
 * The heading stays outside the image role so it keeps its own semantics.
 */
export function SalesChart({ data = [3, 7, 4, 9] }: { data?: number[] }) {
  return (
    <figure className="rounded border p-4 inline-block">
      <figcaption className="font-medium mb-2">Monthly sales</figcaption>
      <div role="img" aria-label="Monthly sales chart">
        <ThirdPartyChart data={data} />
      </div>
    </figure>
  )
}

/**
 * FALLBACK — a test id on the wrapper, when even a summary label is wrong.
 *
 * If the chart is decorative or duplicates a data table next to it, an
 * aria-label would just be noise. Then the wrapper test id is the stable
 * anchor: assert your area rendered, and do not reach into the library DOM
 * (that tests the library, not your app).
 */
export function SalesChartById({ data = [3, 7, 4, 9] }: { data?: number[] }) {
  return (
    <div data-testid="monthly-sales-chart" className="rounded border p-4 inline-block">
      <h2 className="font-medium mb-2">Monthly sales</h2>
      <ThirdPartyChart data={data} />
    </div>
  )
}
