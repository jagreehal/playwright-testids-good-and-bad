import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { story } from 'executable-stories-vitest'
import { describe, expect, it, vi } from 'vitest'
import { LoginFormBad, LoginFormGood } from '@/examples/LoginForm'

describe('Login form — role & label selectors vs test ids', () => {
  it('GOOD: the form is driven entirely by label and role selectors', async ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a semantic login form with associated labels and a real submit button')
    const onSubmit = vi.fn()
    render(<LoginFormGood onSubmit={onSubmit} />)
    const user = userEvent.setup()

    story.when('the user fills the fields by their visible labels and submits')
    await user.type(screen.getByLabelText('Email address'), 'jag@example.com')
    await user.type(screen.getByLabelText('Password'), 'hunter2')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    story.then('the form submits — the selectors that found it also prove it is usable')
    expect(onSubmit).toHaveBeenCalledWith({ email: 'jag@example.com', password: 'hunter2' })
  })

  it('BAD: a test id makes the broken form pass anyway', async ({ task }) => {
    story.init(task)
    story.tag('bad')
    story.given('the same form rebuilt from divs and inputs with only test ids')
    const onSubmit = vi.fn()
    render(<LoginFormBad onSubmit={onSubmit} />)
    const user = userEvent.setup()

    story.when('the test reaches every element by data-testid')
    await user.type(screen.getByTestId('email-input'), 'jag@example.com')
    await user.type(screen.getByTestId('password-input'), 'hunter2')
    await user.click(screen.getByTestId('login-submit-btn'))

    story.then('it passes — green, and completely blind to the broken markup')
    expect(onSubmit).toHaveBeenCalledWith({ email: 'jag@example.com', password: 'hunter2' })
  })

  it('WHY IT MATTERS: the good selectors fail against the bad markup', ({ task }) => {
    story.init(task)
    story.tag('contrast')
    story.given('the bad, test-id-only login form')
    render(<LoginFormBad />)

    story.then('there is no button with the name "Sign in" — it is a clickable div')
    expect(screen.queryByRole('button', { name: 'Sign in' })).toBeNull()

    story.and('the inputs cannot be found by label — they only have placeholders')
    expect(screen.queryByLabelText('Email address')).toBeNull()
    expect(screen.queryByLabelText('Password')).toBeNull()

    story.and('a role/label test would have caught the accessibility bug a test id hid')
  })
})
