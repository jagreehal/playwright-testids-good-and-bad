import { render, screen } from '@testing-library/react'
import { story } from 'executable-stories-vitest'
import { describe, expect, it } from 'vitest'
import { ShadcnSearchFieldBad, ShadcnSearchFieldGood } from '@/examples/shadcn/ShadcnSearchField'

describe('shadcn search field — label strategy is application code', () => {
  it('GOOD: sr-only FieldLabel makes getByLabel work', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a shadcn search Input with an sr-only FieldLabel')
    render(<ShadcnSearchFieldGood />)

    story.then('getByLabel and getByRole both find the searchbox by name')
    expect(screen.getByLabelText('Search products')).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Search products' })).toBeInTheDocument()
  })

  it('BAD: placeholder only — getByLabel finds nothing', ({ task }) => {
    story.init(task)
    story.tag('bad')
    story.given('a shadcn Input with placeholder but no label')
    render(<ShadcnSearchFieldBad />)

    story.then('the placeholder is visible but getByLabel cannot find a label')
    expect(screen.getByPlaceholderText('Search products')).toBeInTheDocument()
    expect(screen.queryByLabelText('Search products')).toBeNull()
    expect(screen.queryByRole('searchbox', { name: 'Search products' })).toBeNull()
  })
})
