import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { story } from 'executable-stories-vitest'
import { describe, expect, it, vi } from 'vitest'
import { ShadcnLoginFormBad, ShadcnLoginFormGood } from '@/examples/shadcn/ShadcnLoginForm'

describe('shadcn login form — labels are application code', () => {
  it('GOOD: FieldLabel associations make getByLabel work', async ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a shadcn form with FieldLabel wired to each Input')
    const onSubmit = vi.fn()
    render(<ShadcnLoginFormGood onSubmit={onSubmit} />)
    const user = userEvent.setup()

    story.when('the user fills fields by label and submits')
    await user.type(screen.getByLabelText('Email address'), 'jag@example.com')
    await user.type(screen.getByLabelText('Password'), 'hunter2')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    story.then('the form submits — label selectors prove the wiring is correct')
    expect(onSubmit).toHaveBeenCalledWith({ email: 'jag@example.com', password: 'hunter2' })
  })

  it('BAD: test ids pass but getByLabel finds nothing', async ({ task }) => {
    story.init(task)
    story.tag('bad')
    story.given('shadcn Input and Button with placeholders instead of FieldLabel')
    const onSubmit = vi.fn()
    render(<ShadcnLoginFormBad onSubmit={onSubmit} />)
    const user = userEvent.setup()

    story.when('the test reaches everything by data-testid')
    await user.type(screen.getByTestId('shadcn-email-input'), 'jag@example.com')
    await user.type(screen.getByTestId('shadcn-password-input'), 'hunter2')
    await user.click(screen.getByTestId('shadcn-login-submit'))

    story.then('it passes — green, and blind to the missing labels')
    expect(onSubmit).toHaveBeenCalledWith({ email: 'jag@example.com', password: 'hunter2' })
  })

  it('WHY IT MATTERS: labels are missing but the Button primitive still works', ({ task }) => {
    story.init(task)
    story.tag('contrast')
    story.given('the shadcn bad login form')
    render(<ShadcnLoginFormBad />)

    story.then('getByLabel finds nothing — placeholders are not labels')
    expect(screen.queryByLabelText('Email address')).toBeNull()
    expect(screen.queryByLabelText('Password')).toBeNull()

    story.and('yet getByRole still finds a real submit button — unlike the plain-HTML bad form')
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })
})
