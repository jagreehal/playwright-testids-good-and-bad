import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { story } from 'executable-stories-vitest'
import { describe, expect, it } from 'vitest'
import { WidgetDialogBad, WidgetDialogGood } from '@/examples/WidgetDialog'

describe('Widget dialog — role selectors vs test ids', () => {
  it('GOOD: open and close read like the user journey', async ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a real button that opens a real dialog')
    render(<WidgetDialogGood />)
    const user = userEvent.setup()

    story.when('the user opens the widget')
    await user.click(screen.getByRole('button', { name: 'Open widget' }))

    story.then('a dialog with an accessible name is exposed')
    const dialog = screen.getByRole('dialog', { name: 'Widget' })
    expect(dialog).toBeInTheDocument()

    story.and('closing it from inside the dialog works')
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog', { name: 'Widget' })).toBeNull()
  })

  it('BAD: the dialog opens but is never exposed as a dialog', async ({ task }) => {
    story.init(task)
    story.tag('bad')
    story.given('a clickable div trigger and a plain div "dialog"')
    render(<WidgetDialogBad />)
    const user = userEvent.setup()

    story.when('the test opens it by test id')
    await user.click(screen.getByTestId('open-widget'))

    story.then('the content is present by test id')
    expect(screen.getByTestId('widget-dialog')).toBeInTheDocument()

    story.and('but assistive tech sees no dialog at all')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Open widget' })).toBeNull()
  })
})
