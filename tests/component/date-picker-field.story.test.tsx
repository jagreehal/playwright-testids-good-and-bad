import { render, screen } from '@testing-library/react'
import { story } from 'executable-stories-vitest'
import { describe, expect, it } from 'vitest'
import { DatePickerFieldById, DatePickerFieldGood } from '@/examples/DatePickerField'

// The escape-hatch chapter, completed. The sales chart showed a getByRole('img')
// wrapper; this shows the other common case — a third-party combobox the library
// forgot to name. You own the wrapper, so you supply the name there.
describe('Third-party date picker — name the widget from the wrapper you own', () => {
  it('GOOD: a label you control gives the unnamed combobox an accessible name', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a third-party combobox with no name, wrapped in a label you own')
    render(<DatePickerFieldGood />)

    story.then('the role query finds it by the name your label supplied')
    expect(screen.getByRole('combobox', { name: 'Choose date' })).toBeInTheDocument()
    expect(screen.getByLabelText('Choose date')).toBeInTheDocument()
  })

  it('FALLBACK: a wrapper test id, when the widget exposes nothing to name', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a canvas-painted widget that exposes no role and no control to label')
    render(<DatePickerFieldById />)

    story.then('there is no combobox to reach at all — not just a missing name')
    expect(screen.queryByRole('combobox')).toBeNull()

    story.and('the visible "Choose date" text is a <span>, so it associates with nothing')
    expect(screen.queryByLabelText('Choose date')).toBeNull()

    story.and('the wrapper test id is the only honest handle left')
    expect(screen.getByTestId('booking-date-field')).toBeInTheDocument()
  })
})
