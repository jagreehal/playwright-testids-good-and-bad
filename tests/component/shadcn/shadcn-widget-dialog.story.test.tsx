import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { story } from 'executable-stories-vitest'
import { describe, expect, it } from 'vitest'
import {
  ShadcnWidgetDialogBad,
  ShadcnWidgetDialogGood,
  ShadcnWidgetDialogSubtle,
} from '@/examples/shadcn/ShadcnWidgetDialog'

describe('shadcn widget dialog — DialogTitle is application code', () => {
  it('GOOD: DialogTitle gives the dialog an accessible name', async ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a shadcn Dialog with DialogTitle and DialogDescription')
    render(<ShadcnWidgetDialogGood />)
    const user = userEvent.setup()

    story.when('the user opens the widget')
    await user.click(screen.getByRole('button', { name: 'Open widget' }))

    story.then('a named dialog is exposed')
    expect(screen.getByRole('dialog', { name: 'Widget' })).toBeInTheDocument()

    story.and('closing via the built-in close button works')
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog', { name: 'Widget' })).toBeNull()
  })

  it('BAD: dialog opens but has no accessible name', async ({ task }) => {
    story.init(task)
    story.tag('bad')
    story.given('a shadcn Dialog missing DialogTitle')
    render(<ShadcnWidgetDialogBad />)
    const user = userEvent.setup()

    story.when('the user opens the widget')
    await user.click(screen.getByRole('button', { name: 'Open widget' }))

    story.then('a dialog role exists — focus trap and keyboard work')
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    story.and('but the named dialog query fails — no title was wired')
    expect(screen.queryByRole('dialog', { name: 'Widget' })).toBeNull()
  })

  it('SUBTLE: sr-only DialogTitle satisfies the named query', async ({ task }) => {
    story.init(task)
    story.tag('subtle')
    story.given('a shadcn Dialog whose title is visually hidden')
    render(<ShadcnWidgetDialogSubtle />)
    const user = userEvent.setup()

    story.when('the user opens the widget')
    await user.click(screen.getByRole('button', { name: 'Open widget' }))

    story.then('getByRole finds the dialog by name even though the title is sr-only')
    expect(screen.getByRole('dialog', { name: 'Widget' })).toBeInTheDocument()
  })
})
