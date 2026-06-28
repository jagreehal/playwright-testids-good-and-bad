import { render, screen } from '@testing-library/react'
import { story } from 'executable-stories-vitest'
import { describe, expect, it } from 'vitest'
import {
  PromoBanner,
  PromoRibbonBuggy,
  PromoRibbonById,
} from '@/examples/PromoBanner'

// The hardest pro-test-id case: a wrapper that renders only when an optional
// string is set, with that string as its only content. "Invert the text query"
// does not prove the wrapper is gone. These stories show the role fix, the gap
// in the text inversion, and the case where a test id is the only honest handle.
describe('Optional element — proving a conditional wrapper is gone', () => {
  it('GOOD: a role gives the banner identity, so absence is provable', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a promo banner with role="status" that renders only when set')
    const { rerender } = render(<PromoBanner message="50% off today" />)

    story.then('present: the role finds it the way a screen reader announces it')
    expect(screen.getByRole('status')).toHaveTextContent('50% off today')

    story.when('the message is cleared')
    rerender(<PromoBanner />)

    story.then('absent: queryByRole is null — this asserts the element, not just the text')
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('BAD: a text inversion reports green while an empty wrapper is still on screen', ({
    task,
  }) => {
    story.init(task)
    story.tag('bad')
    story.given('a buggy ribbon that always mounts the wrapper, even with no message')
    render(<PromoRibbonBuggy />)

    story.then('the text inversion passes — the string really is gone')
    expect(screen.queryByText('50% off today')).toBeNull()

    story.and('yet the wrapper is still there, empty, which only an element query catches')
    expect(screen.getByTestId('promo-ribbon')).toBeEmptyDOMElement()
  })

  it('FALLBACK: a decorative ribbon with no fitting role — the test id is the only handle', ({
    task,
  }) => {
    story.init(task)
    story.tag('good')
    story.given('a visual ribbon whose only content is the optional text')
    const { rerender } = render(<PromoRibbonById message="50% off today" />)

    story.then('present: the test id locates it, the text verifies')
    expect(screen.getByTestId('promo-ribbon')).toHaveTextContent('50% off today')

    story.when('the message is cleared')
    rerender(<PromoRibbonById />)

    story.then('absent: queryByTestId is null — with no role to query, this is the only way to prove it')
    expect(screen.queryByTestId('promo-ribbon')).toBeNull()
  })
})
