import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

/**
 * GOOD — shadcn Dialog with the application-provided title your team must wire.
 *
 * Base-ui gives you dialog role, focus trap, and escape-to-close. DialogTitle
 * supplies the accessible name tests and screen readers need.
 */
export function ShadcnWidgetDialogGood() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Open widget</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Widget</DialogTitle>
          <DialogDescription>The widget is open.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

/**
 * BAD — shadcn Dialog missing DialogTitle.
 *
 * Focus management and dialog role work. Named dialog queries and axe fail
 * because the application never provided a title.
 */
export function ShadcnWidgetDialogBad() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Open widget</DialogTrigger>
      <DialogContent>
        <p>The widget is open.</p>
      </DialogContent>
    </Dialog>
  )
}

/**
 * SUBTLE — title present but visually hidden with sr-only.
 *
 * Proves you can satisfy axe and getByRole('dialog', { name }) without showing
 * a visible heading when design does not want one.
 */
export function ShadcnWidgetDialogSubtle() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Open widget</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sr-only">Widget</DialogTitle>
          <DialogDescription>The widget is open.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
