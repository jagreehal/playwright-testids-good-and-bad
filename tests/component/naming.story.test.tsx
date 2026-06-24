import { render, screen } from '@testing-library/react'
import { story } from 'executable-stories-vitest'
import { describe, expect, it } from 'vitest'
import { WrapperSoup } from '@/examples/PaymentStatus'
import {
  SaveButtonsGenericIds,
  SaveButtonsMeaningfulIds,
  SaveButtonsRole,
} from '@/examples/SaveButtons'

describe('Naming — meaning beats invention', () => {
  it('GOOD: real buttons need no test id at all', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('two plain buttons, Save and Cancel')
    render(<SaveButtonsRole />)

    story.then('both are found by role and name — zero test ids')
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('BAD: button-1 / button-2 communicate nothing', ({ task }) => {
    story.init(task)
    story.tag('bad')
    story.given('the same buttons tagged button-1 and button-2')
    render(<SaveButtonsGenericIds />)

    story.then('the ids exist but tell a future reader nothing about intent')
    expect(screen.getByTestId('button-1')).toHaveTextContent('Save')
    expect(screen.getByTestId('button-2')).toHaveTextContent('Cancel')

    story.and('the role selector is still available and clearer')
    expect(screen.getByRole('button', { name: 'Save' })).toBe(screen.getByTestId('button-1'))
  })

  it('ACCEPTABLE: when you need an id, name it domain-purpose-element', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('buttons named profile-save-button / profile-cancel-button')
    render(<SaveButtonsMeaningfulIds />)

    story.then('the id reads like the product concept, in kebab-case')
    expect(screen.getByTestId('profile-save-button')).toHaveTextContent('Save')
    expect(screen.getByTestId('profile-cancel-button')).toHaveTextContent('Cancel')
  })

  it('BAD: wrapper soup puts a test id on every nesting level', ({ task }) => {
    story.init(task)
    story.tag('bad')
    story.given('page-wrapper > content-wrapper > form-wrapper > button-1')
    render(<WrapperSoup />)

    story.then('the ids are just a second set of class names — none identify intent')
    expect(screen.getByTestId('page-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('content-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('form-wrapper')).toBeInTheDocument()

    story.and('the only thing worth finding — the Save button — is reachable by role')
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })
})
