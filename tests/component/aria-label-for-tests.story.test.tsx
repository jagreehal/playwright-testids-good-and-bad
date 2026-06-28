import { render, screen } from '@testing-library/react'
import { story } from 'executable-stories-vitest'
import { describe, expect, it } from 'vitest'
import {
  ReviewsFilterAcceptable,
  ReviewsSectionGood,
  ReviewsSectionLabelledForTest,
} from '@/examples/ReviewsSection'

// The move the thread's accessibility specialist flagged as worse than a test
// id: adding an aria-label only so a test can find the element. On something
// already named, the label clobbers the human name with a test slug — and
// unlike a test id, that slug is announced. These stories make the divergence
// fail in the terminal.
describe('aria-label for tests — a test id wearing a costume', () => {
  it('GOOD: the visible heading is the accessible name, shared by user and test', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a reviews section labelled by its own visible heading')
    render(<ReviewsSectionGood count={3} />)

    story.when('the test navigates the way a screen-reader user does')
    const region = screen.getByRole('region', { name: 'Customer reviews' })

    story.then('the name the test queries is exactly the name on screen — no divergence')
    expect(region).toHaveTextContent('3 reviews')
    expect(screen.getByRole('heading', { name: 'Customer reviews' })).toBeInTheDocument()
  })

  it('BAD: the aria-label slug replaces the heading in the accessibility tree', ({ task }) => {
    story.init(task)
    story.tag('bad')
    story.given('the same section, but with aria-label="reviews-section" for test convenience')
    render(<ReviewsSectionLabelledForTest count={3} />)

    story.when('a sighted user still reads the heading "Customer reviews"')
    expect(screen.getByRole('heading', { name: 'Customer reviews' })).toBeInTheDocument()

    story.then('but the region a screen reader announces is named by the test slug, not the heading')
    expect(screen.queryByRole('region', { name: 'Customer reviews' })).toBeNull()
    expect(screen.getByRole('region', { name: 'reviews-section' })).toBeInTheDocument()

    story.and('visible name and announced name have diverged — and only the test benefits')
  })

  it('ACCEPTABLE: aria-label is correct when nothing else names the region', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a filter toolbar with no heading to inherit a name from')
    render(<ReviewsFilterAcceptable />)

    story.then('the aria-label reads as a name you would ship to a user, and the test reuses it')
    const region = screen.getByRole('region', { name: 'Filter reviews' })
    expect(region).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Most recent' })).toBeInTheDocument()
  })
})
