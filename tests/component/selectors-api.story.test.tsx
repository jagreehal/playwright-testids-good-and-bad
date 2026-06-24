import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { story } from 'executable-stories-vitest'
import { describe, expect, it, vi } from 'vitest'
import { ReviewActionsById, ReviewActionsGood } from '@/examples/ReviewActions'

class ReviewPageByRole {
  constructor(private readonly user: ReturnType<typeof userEvent.setup>) {}

  async sendBackToReviewer() {
    await this.user.click(screen.getByRole('button', { name: 'Send back to reviewer' }))
  }
}

class ReviewPageById {
  constructor(private readonly user: ReturnType<typeof userEvent.setup>) {}

  async sendBackToReviewer() {
    await this.user.click(screen.getByTestId('send-back-to-reviewer-button'))
  }
}

describe('Selectors API — maintenance without defaulting to test ids', () => {
  it('GOOD: a page object can wrap a semantic locator', async ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a selectors API for a review action with stable copy')
    const onSendBack = vi.fn()
    render(<ReviewActionsGood onSendBack={onSendBack} />)
    const page = new ReviewPageByRole(userEvent.setup())

    story.when('the test calls the business action instead of inlining a selector')
    await page.sendBackToReviewer()

    story.then('the abstraction is maintainable and the underlying locator stays semantic')
    expect(onSendBack).toHaveBeenCalled()
  })

  it('FALLBACK: the same test API can swap to a test id when the copy becomes unstable', async ({
    task,
  }) => {
    story.init(task)
    story.tag('good')
    story.given('the same review action, but the wording is now under experiment')
    const onSendBack = vi.fn()
    render(<ReviewActionsById label="Return this draft for changes" onSendBack={onSendBack} />)
    const page = new ReviewPageById(userEvent.setup())

    story.when('the test calls the same business action through the page object')
    await page.sendBackToReviewer()

    story.then('the test body stays the same even though the locator contract changed')
    expect(onSendBack).toHaveBeenCalled()
  })
})
