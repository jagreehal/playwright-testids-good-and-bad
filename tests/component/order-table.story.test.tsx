import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { story } from 'executable-stories-vitest'
import { describe, expect, it, vi } from 'vitest'
import { OrdersTableById, OrdersTableGood } from '@/examples/OrderTable'

describe('Order table — scope by structure before adding ids', () => {
  it('GOOD: scope to the row header, then click the action inside that row', async ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a semantic orders table with row headers')
    const onRefund = vi.fn()
    render(<OrdersTableGood onRefund={onRefund} />)
    const user = userEvent.setup()

    story.when('the test finds the INV-002 row and scopes the Refund button inside it')
    const rowHeader = screen.getByRole('rowheader', { name: 'INV-002' })
    const row = rowHeader.closest('tr')
    await user.click(within(row!).getByRole('button', { name: 'Refund' }))

    story.then('the correct order is refunded without inventing a test id')
    expect(onRefund).toHaveBeenCalledWith('INV-002')
  })

  it('FALLBACK: a stable row id beats row position when the content is noisy', async ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('an orders view keyed by stable invoice numbers')
    const onRefund = vi.fn()
    render(<OrdersTableById onRefund={onRefund} />)
    const user = userEvent.setup()

    story.when('the test targets the refund action by invoice number instead of by index')
    await user.click(screen.getByTestId('refund-order-INV-002'))

    story.then('the test contract still names the business record, not the second row today')
    expect(onRefund).toHaveBeenCalledWith('INV-002')

    story.and('the row itself is reachable by the same stable identifier')
    expect(screen.getByTestId('order-row-INV-002')).toHaveTextContent('Mina Chen')
  })
})
