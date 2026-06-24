export type Product = { id: string; name: string; price: string }

const PRODUCTS: Product[] = [
  { id: 'sku-1', name: 'Trail Runners', price: '£82.00' },
  { id: 'sku-2', name: 'Wool Socks', price: '£12.00' },
  { id: 'sku-3', name: 'Rain Shell', price: '£140.00' },
]

/**
 * GOOD — repeated rows disambiguated by accessible name and structure.
 *
 * Every row is a <li>. Each "Add to basket" button gets a per-product
 * accessible name, so a role selector can target exactly one:
 *   getByRole('button', { name: 'Add Wool Socks to basket' })
 * No test ids, and the test reads like the user's intent.
 */
export function ProductListGood({ onAdd }: { onAdd?: (id: string) => void }) {
  return (
    <ul aria-label="Products" className="grid gap-2 max-w-sm">
      {PRODUCTS.map((product) => (
        <li key={product.id} className="flex items-center justify-between rounded border p-2">
          <span>
            {product.name} — {product.price}
          </span>
          <button
            type="button"
            aria-label={`Add ${product.name} to basket`}
            onClick={() => onAdd?.(product.id)}
            className="rounded border px-2 py-1 text-sm"
          >
            Add to basket
          </button>
        </li>
      ))}
    </ul>
  )
}

/**
 * BAD — repeated rows separated only by index-based test ids.
 *
 * Every button shows the same text, so the only handle is data-testid="add-1",
 * "add-2"... The numbers carry no meaning, break the moment the list reorders,
 * and the buttons still have no per-row accessible name for real users.
 */
export function ProductListBad({ onAdd }: { onAdd?: (id: string) => void }) {
  return (
    <div data-testid="product-list" className="grid gap-2 max-w-sm">
      {PRODUCTS.map((product, index) => (
        <div
          key={product.id}
          data-testid={`product-row-${index}`}
          className="flex items-center justify-between rounded border p-2"
        >
          <span>
            {product.name} — {product.price}
          </span>
          <div
            data-testid={`add-${index + 1}`}
            onClick={() => onAdd?.(product.id)}
            className="rounded border px-2 py-1 text-sm cursor-pointer select-none"
          >
            Add to basket
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * LEGITIMATE FALLBACK — repeated rows keyed by a stable business identifier.
 *
 * Sometimes the visible text is identical across rows or varies by locale. In
 * that case a test id can carry the stable contract, as long as you key it on
 * a domain identifier instead of position:
 *   getByTestId('product-card-sku-2')
 *
 * This still is not the first choice. It is the fallback when role, label, and
 * text cannot distinguish one row from another.
 */
export function ProductListBySku({ onAdd }: { onAdd?: (id: string) => void }) {
  return (
    <div data-testid="product-list" className="grid gap-2 max-w-sm">
      {PRODUCTS.map((product) => (
        <div
          key={product.id}
          data-testid={`product-card-${product.id}`}
          className="flex items-center justify-between rounded border p-2"
        >
          <span>
            {product.name} — {product.price}
          </span>
          <button
            type="button"
            data-testid={`add-to-basket-${product.id}`}
            onClick={() => onAdd?.(product.id)}
            className="rounded border px-2 py-1 text-sm"
          >
            Add to basket
          </button>
        </div>
      ))}
    </div>
  )
}
