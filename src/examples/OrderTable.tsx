type Order = {
  id: string
  customer: string
  total: string
}

const ORDERS: Order[] = [
  { id: 'INV-001', customer: 'Ada Lovelace', total: '£18.00' },
  { id: 'INV-002', customer: 'Mina Chen', total: '£42.00' },
  { id: 'INV-003', customer: 'Luis Gomez', total: '£63.00' },
]

/**
 * GOOD — tables give you structure. Scope to the row header, then find the
 * action inside that row.
 */
export function OrdersTableGood({ onRefund }: { onRefund?: (id: string) => void }) {
  return (
    <table aria-label="Orders" className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2 text-left">Order</th>
          <th className="border p-2 text-left">Customer</th>
          <th className="border p-2 text-left">Total</th>
          <th className="border p-2 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {ORDERS.map((order) => (
          <tr key={order.id}>
            <th scope="row" className="border p-2 text-left">
              {order.id}
            </th>
            <td className="border p-2">{order.customer}</td>
            <td className="border p-2">{order.total}</td>
            <td className="border p-2">
              <button
                type="button"
                onClick={() => onRefund?.(order.id)}
                className="rounded border px-2 py-1 text-sm"
              >
                Refund
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/**
 * FALLBACK — if the row text comes from multiple unstable sources, a stable
 * business identifier on the row can be the better contract than position.
 *
 * The id supports maintenance. It does not excuse throwing away table
 * semantics when you can keep them.
 *
 * This row is still reachable by rowheader. The id is convenience, not
 * necessity, in this version.
 */
export function OrdersTableById({ onRefund }: { onRefund?: (id: string) => void }) {
  return (
    <table data-testid="orders-table" aria-label="Orders" className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2 text-left">Order</th>
          <th className="border p-2 text-left">Customer</th>
          <th className="border p-2 text-left">Total</th>
          <th className="border p-2 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {ORDERS.map((order) => (
          <tr key={order.id} data-testid={`order-row-${order.id}`}>
            <th scope="row" className="border p-2 text-left">
              {order.id}
            </th>
            <td className="border p-2">{order.customer}</td>
            <td className="border p-2">{order.total}</td>
            <td className="border p-2">
              <button
                type="button"
                data-testid={`refund-order-${order.id}`}
                onClick={() => onRefund?.(order.id)}
                className="rounded border px-2 py-1 text-sm"
              >
                Refund
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
