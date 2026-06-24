import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { story } from 'executable-stories-vitest'
import { describe, expect, it, vi } from 'vitest'
import { IconButtonBad, IconButtonGood } from '@/examples/IconButton'

describe('Icon button — accessible name vs test id', () => {
  it('GOOD: the icon button is found by its aria-label', async ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('an icon-only button with aria-label="Delete payment"')
    const onDelete = vi.fn()
    render(<IconButtonGood onDelete={onDelete} />)
    const user = userEvent.setup()

    story.when('the user activates the button found by role and name')
    await user.click(screen.getByRole('button', { name: 'Delete payment' }))

    story.then('it fires, and a screen reader user could have triggered it too')
    expect(onDelete).toHaveBeenCalledOnce()
    expect(screen.getByRole('status')).toHaveTextContent('Payment deleted')
  })

  it('BAD: the clickable div is only reachable by test id', async ({ task }) => {
    story.init(task)
    story.tag('bad')
    story.given('an icon "button" that is really a <div> with a test id')
    const onDelete = vi.fn()
    render(<IconButtonBad onDelete={onDelete} />)
    const user = userEvent.setup()

    story.when('the test clicks it by data-testid')
    await user.click(screen.getByTestId('delete-payment'))

    story.then('it fires — but there is no button role to find')
    expect(onDelete).toHaveBeenCalledOnce()
    expect(screen.queryByRole('button', { name: 'Delete payment' })).toBeNull()
  })
})
