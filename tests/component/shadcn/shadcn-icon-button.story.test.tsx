import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { story } from 'executable-stories-vitest'
import { describe, expect, it, vi } from 'vitest'
import { ShadcnIconButtonBad, ShadcnIconButtonGood } from '@/examples/shadcn/ShadcnIconButton'

describe('shadcn icon button — primitive vs accessible name', () => {
  it('GOOD: aria-label makes the named role query work', async ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a shadcn icon Button with aria-label="Delete item"')
    const onDelete = vi.fn()
    render(<ShadcnIconButtonGood onDelete={onDelete} />)
    const user = userEvent.setup()

    story.when('the user activates the button by role and name')
    await user.click(screen.getByRole('button', { name: 'Delete item' }))

    story.then('it fires — the name your team provided is what tests and AT share')
    expect(onDelete).toHaveBeenCalledOnce()
    expect(screen.getByRole('status')).toHaveTextContent('Item deleted')
  })

  it('BAD: test id passes while the named role query fails', async ({ task }) => {
    story.init(task)
    story.tag('bad')
    story.given('a shadcn icon Button with no accessible name')
    const onDelete = vi.fn()
    render(<ShadcnIconButtonBad onDelete={onDelete} />)
    const user = userEvent.setup()

    story.when('the test clicks by data-testid')
    await user.click(screen.getByTestId('shadcn-delete-btn'))

    story.then('it fires — but there is no name for assistive tech or strict selectors')
    expect(onDelete).toHaveBeenCalledOnce()
    expect(screen.queryByRole('button', { name: 'Delete item' })).toBeNull()
  })

  it('WHY IT MATTERS: the unnamed button is still a real button', ({ task }) => {
    story.init(task)
    story.tag('contrast')
    story.given('the shadcn bad icon button')
    render(<ShadcnIconButtonBad />)

    story.then('getByRole("button") finds it — the primitive is correct')
    expect(screen.getByRole('button')).toBeInTheDocument()

    story.and('getByRole("button", { name }) does not — the application never named it')
    expect(screen.queryByRole('button', { name: 'Delete item' })).toBeNull()
  })
})
