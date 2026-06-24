import type { ReactNode } from 'react'
import { CheckoutButton } from './examples/CheckoutButton'
import { IconButtonBad, IconButtonGood } from './examples/IconButton'
import { LocalizedCheckoutById, LocalizedCheckoutGood } from './examples/LocalizedActions'
import { LoadingPanel, LoadingPanelDecorative } from './examples/LoadingSpinner'
import { LoginFormBad, LoginFormGood } from './examples/LoginForm'
import { OrdersTableById, OrdersTableGood } from './examples/OrderTable'
import {
  PaymentStatus,
  PaymentStatusById,
  PaymentStatusLive,
  WrapperSoup,
} from './examples/PaymentStatus'
import { ProductListBad, ProductListBySku, ProductListGood } from './examples/ProductList'
import { ReviewActionsById, ReviewActionsGood } from './examples/ReviewActions'
import { SalesChart, SalesChartById } from './examples/SalesChart'
import {
  SaveButtonsGenericIds,
  SaveButtonsMeaningfulIds,
  SaveButtonsRole,
} from './examples/SaveButtons'
import { WidgetDialogBad, WidgetDialogGood } from './examples/WidgetDialog'

/** A labelled landmark so Playwright can scope queries with getByRole('region', { name }). */
function Demo({ name, children }: { name: string; children: ReactNode }) {
  return (
    <section aria-label={name} className="rounded-lg border p-4">
      <h3 className="font-medium mb-3">{name}</h3>
      <div>{children}</div>
    </section>
  )
}

function Pair({ children }: { children: ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>
}

export function App() {
  return (
    <main className="mx-auto max-w-3xl p-6 grid gap-6">
      <header className="grid gap-1">
        <h1 className="text-2xl font-semibold">data-testid — good vs bad</h1>
        <p className="text-muted-foreground">
          Each surface is rendered twice. The good version is reachable by role, label, or text.
          The bad version can only be reached by a test id — which is exactly what hides the
          problem. The Vitest and Playwright suites prove both halves.
        </p>
      </header>

      <Demo name="Login form (good)">
        <LoginFormGood />
      </Demo>
      <Demo name="Login form (bad)">
        <LoginFormBad />
      </Demo>

      <Pair>
        <Demo name="Icon button (good)">
          <IconButtonGood />
        </Demo>
        <Demo name="Icon button (bad)">
          <IconButtonBad />
        </Demo>
      </Pair>

      <Pair>
        <Demo name="Widget dialog (good)">
          <WidgetDialogGood />
        </Demo>
        <Demo name="Widget dialog (bad)">
          <WidgetDialogBad />
        </Demo>
      </Pair>

      <Pair>
        <Demo name="Product list (good)">
          <ProductListGood />
        </Demo>
        <Demo name="Product list (stable SKU fallback)">
          <ProductListBySku />
        </Demo>
      </Pair>

      <Pair>
        <Demo name="Product list (bad)">
          <ProductListBad />
        </Demo>
      </Pair>

      <Pair>
        <Demo name="Orders table (scope by row)">
          <OrdersTableGood />
        </Demo>
        <Demo name="Orders table (stable row id fallback)">
          <OrdersTableById />
        </Demo>
      </Pair>

      <Demo name="Payment status (named region)">
        <PaymentStatus />
      </Demo>
      <Demo name="Payment status (live region)">
        <PaymentStatusLive />
      </Demo>
      <Demo name="Payment status (test id fallback)">
        <PaymentStatusById />
      </Demo>
      <Demo name="Checkout (acceptable test id)">
        <CheckoutButton />
      </Demo>
      <Pair>
        <Demo name="Localized checkout (semantic)">
          <LocalizedCheckoutGood locale="fr" />
        </Demo>
        <Demo name="Localized checkout (test id fallback)">
          <LocalizedCheckoutById label="Terminer l’achat en sécurité" />
        </Demo>
      </Pair>
      <Demo name="Loading state (live region)">
        <LoadingPanel loading />
      </Demo>
      <Demo name="Loading state (decorative test id)">
        <LoadingPanelDecorative loading />
      </Demo>
      <Demo name="Sales chart (image role)">
        <SalesChart />
      </Demo>
      <Demo name="Sales chart (test id fallback)">
        <SalesChartById />
      </Demo>

      <Demo name="Wrapper soup (bad test ids)">
        <WrapperSoup />
      </Demo>
      <Pair>
        <Demo name="Review action (page object + role)">
          <ReviewActionsGood />
        </Demo>
        <Demo name="Review action (page object + test id)">
          <ReviewActionsById label="Return this draft for changes" />
        </Demo>
      </Pair>
      <Pair>
        <Demo name="Save buttons (by role)">
          <SaveButtonsRole />
        </Demo>
        <Demo name="Save buttons (generic ids)">
          <SaveButtonsGenericIds />
        </Demo>
      </Pair>
      <Demo name="Save buttons (meaningful ids)">
        <SaveButtonsMeaningfulIds />
      </Demo>
    </main>
  )
}
