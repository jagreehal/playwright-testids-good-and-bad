import { render, screen } from '@testing-library/react'
import { story } from 'executable-stories-vitest'
import { describe, expect, it } from 'vitest'
import {
  SearchInputAriaLabel,
  SearchInputBad,
  SearchInputGood,
} from '@/examples/SearchInput'

// "Is a placeholder OK for a search box?" comes up in every selector thread.
// The answer is the same as the login form: a placeholder is a hint, not a
// name. These stories show the persistent name the good versions keep and the
// missing label the bad one leans on.
describe('Search input — placeholder is a hint, not a label', () => {
  it('GOOD: an sr-only label keeps a stable name for role and label queries', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a search box whose visible label is hidden but still associated')
    render(<SearchInputGood />)

    story.then('the searchbox role carries the name, and getByLabelText finds it too')
    expect(screen.getByRole('searchbox', { name: 'Search products' })).toBeInTheDocument()
    expect(screen.getByLabelText('Search products')).toBeInTheDocument()
  })

  it('GOOD: two instances do not collide — useId wires each label to its own box', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('the same search component rendered twice on one page')
    render(
      <div>
        <SearchInputGood />
        <SearchInputGood />
      </div>,
    )

    story.then('both boxes keep their name — a fixed id would point both labels at the first input')
    expect(screen.getAllByRole('searchbox', { name: 'Search products' })).toHaveLength(2)
  })

  it('ACCEPTABLE: aria-label names a box that ships with no visible label', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a search box with no visible label by design')
    render(<SearchInputAriaLabel />)

    story.then('aria-label gives a user-meaningful name the role query reuses')
    expect(screen.getByRole('searchbox', { name: 'Search products' })).toBeInTheDocument()
  })

  it('BAD: only a placeholder, so there is no label to find', ({ task }) => {
    story.init(task)
    story.tag('bad')
    story.given('a search box with a placeholder and nothing else')
    render(<SearchInputBad />)

    story.then('getByLabelText finds nothing — there is no label here')
    expect(screen.queryByLabelText('Search products')).toBeNull()

    story.and('the placeholder is the only handle left, the query Testing Library ranks last')
    expect(screen.getByPlaceholderText('Search products')).toBeInTheDocument()
  })
})
