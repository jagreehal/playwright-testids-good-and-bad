import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { story } from 'executable-stories-vitest'
import { describe, expect, it, vi } from 'vitest'
import { ProductListBad, ProductListBySku, ProductListGood } from '@/examples/ProductList'

describe('Product list — disambiguating repeated rows', () => {
  it('GOOD: each row is targeted by a per-product accessible name', async ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a product list where every "Add to basket" button has a unique name')
    const onAdd = vi.fn()
    render(<ProductListGood onAdd={onAdd} />)
    const user = userEvent.setup()

    story.when('the user adds exactly the Wool Socks')
    await user.click(screen.getByRole('button', { name: 'Add Wool Socks to basket' }))

    story.then('the right product is added — no index guessing')
    expect(onAdd).toHaveBeenCalledWith('sku-2')
  })

  it('GOOD: scoping with within() also disambiguates identical text', async ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('the same list, queried by structure')
    const onAdd = vi.fn()
    render(<ProductListGood onAdd={onAdd} />)
    const user = userEvent.setup()

    story.when('the test scopes to the Rain Shell row, then clicks its button')
    const row = screen
      .getAllByRole('listitem')
      .find((item) => within(item).queryByText(/Rain Shell/i))
    await user.click(within(row!).getByRole('button'))

    story.then('the Rain Shell is added')
    expect(onAdd).toHaveBeenCalledWith('sku-3')
  })

  it('BAD: index-based test ids carry no meaning and break on reorder', async ({ task }) => {
    story.init(task)
    story.tag('bad')
    story.given('a list where rows are separated only by add-1, add-2, add-3')
    const onAdd = vi.fn()
    render(<ProductListBad onAdd={onAdd} />)
    const user = userEvent.setup()

    story.when('the test clicks "add-2", trusting the order')
    await user.click(screen.getByTestId('add-2'))

    story.then('it adds the second row today — but the id says nothing about which product')
    expect(onAdd).toHaveBeenCalledWith('sku-2')

    story.and('no button has a per-product accessible name')
    expect(screen.queryByRole('button', { name: 'Add Wool Socks to basket' })).toBeNull()
  })

  it('FALLBACK: a stable business id beats an index when text cannot disambiguate', async ({
    task,
  }) => {
    story.init(task)
    story.tag('good')
    story.given('a list keyed by stable SKU-based test ids instead of row order')
    const onAdd = vi.fn()
    render(<ProductListBySku onAdd={onAdd} />)
    const user = userEvent.setup()

    story.when('the test targets the Wool Socks card by its business identifier')
    await user.click(screen.getByTestId('add-to-basket-sku-2'))

    story.then('the selector still names the product contract, not the second row today')
    expect(onAdd).toHaveBeenCalledWith('sku-2')

    story.and('the row itself is scoped by the same stable identifier')
    expect(screen.getByTestId('product-card-sku-2')).toHaveTextContent('Wool Socks')
  })
})
