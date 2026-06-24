import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { story } from 'executable-stories-vitest'
import { describe, expect, it } from 'vitest'
import { CheckoutButton } from '@/examples/CheckoutButton'
import { LoadingPanel, LoadingPanelDecorative } from '@/examples/LoadingSpinner'
import { PaymentStatus, PaymentStatusById, PaymentStatusLive } from '@/examples/PaymentStatus'
import { SalesChart, SalesChartById } from '@/examples/SalesChart'

// The green list, re-ordered the way the post argues: try the role first, fall
// to a test id only when no accessible handle exists.
describe('Legitimate test ids — accessible route first, test id as fallback', () => {
  it('status container: a named region is found by role, no test id needed', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a payment status section labelled by its heading')
    render(<PaymentStatus status="Payment complete" />)

    story.when('the test navigates to it the way a screen-reader user would')
    const region = screen.getByRole('region', { name: 'Payment status' })

    story.then('the role locates, the text content verifies — the id is unused')
    expect(region).toHaveTextContent('Payment complete')
  })

  it('async result: role="status" announces the change and the test reads it', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a status that lands after an API call, in a live region')
    render(<PaymentStatusLive status="Payment complete" />)

    story.then('the live region a screen reader announces is the one the test finds')
    expect(screen.getByRole('status')).toHaveTextContent('Payment complete')
  })

  it('status container: the test id is the fallback when there is no name to give', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('an unnameable wrapper marked with data-testid="payment-status"')
    render(<PaymentStatusById status="Payment complete" />)

    story.when('no role or name exists, so the id is the only stable anchor')
    const region = screen.getByTestId('payment-status')

    story.then('the id locates, the text content still verifies')
    expect(region).toHaveTextContent('Payment complete')
  })

  it('dynamic copy: locate by id, but still assert the wording when it matters', async ({
    task,
  }) => {
    story.init(task)
    story.tag('good')
    story.given('a checkout button whose label is A/B tested')
    render(<CheckoutButton label="Continue securely" />)
    const user = userEvent.setup()

    story.when('the test drives the flow by its stable test id')
    const button = screen.getByTestId('checkout-primary-action')
    await user.click(button)

    story.then('the flow completes regardless of wording')
    expect(screen.getByTestId('checkout-result')).toHaveTextContent('Order placed')

    story.and('and the current copy is still asserted on the same element')
    expect(button).toHaveTextContent('Continue securely')
  })

  it('loading state: role="status" announces it, so the test queries the role', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a spinner inside a labelled live region')
    const { rerender } = render(<LoadingPanel loading />)

    story.then('while loading, the status region is announced and present')
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()

    story.when('loading finishes')
    rerender(<LoadingPanel loading={false} />)

    story.then('the status is gone and the content is shown')
    expect(screen.queryByRole('status')).toBeNull()
    expect(screen.getByText('Dashboard ready')).toBeInTheDocument()
  })

  it('loading state: a decorative spinner has no role, so the test id is correct', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('an aria-hidden spinner whose loading state is announced elsewhere')
    const { rerender } = render(<LoadingPanelDecorative loading />)

    story.then('the decoration is reachable only by test id')
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()

    story.when('loading finishes')
    rerender(<LoadingPanelDecorative loading={false} />)

    story.then('the spinner is gone and the content is shown')
    expect(screen.queryByTestId('loading-spinner')).toBeNull()
    expect(screen.getByText('Dashboard ready')).toBeInTheDocument()
  })

  it('third-party widget: a role="img" wrapper gives a summary and a role handle', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a third-party chart inside a wrapper you label')
    render(<SalesChart />)

    story.then('the wrapper you own carries a text alternative, found by role')
    expect(screen.getByRole('img', { name: 'Monthly sales chart' })).toBeInTheDocument()
  })

  it('third-party widget: the test id is the fallback when a label would be noise', ({ task }) => {
    story.init(task)
    story.tag('good')
    story.given('a decorative chart that duplicates a nearby data table')
    render(<SalesChartById />)

    story.then('assert your wrapper rendered — do not reach into the chart internals')
    expect(screen.getByTestId('monthly-sales-chart')).toBeInTheDocument()
  })
})
