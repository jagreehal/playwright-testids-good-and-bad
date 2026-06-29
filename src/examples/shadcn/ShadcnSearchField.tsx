import { useId } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

/**
 * GOOD — shadcn search with an application label strategy.
 *
 * Design wants no visible caption, so FieldLabel is sr-only. The label still
 * associates via htmlFor/id — getByLabel and getByRole('searchbox') both work.
 */
export function ShadcnSearchFieldGood() {
  const id = useId()
  return (
    <form role="search" className="max-w-sm">
      <Field>
        <FieldLabel htmlFor={id} className="sr-only">
          Search products
        </FieldLabel>
        <Input
          id={id}
          type="search"
          placeholder="Try 'wireless headphones'"
        />
      </Field>
    </form>
  )
}

/**
 * BAD — shadcn Input with placeholder only, no label association.
 *
 * The Input primitive is fine. Without FieldLabel or aria-label, getByLabel
 * finds nothing and the placeholder evaporates on first keystroke.
 */
export function ShadcnSearchFieldBad() {
  return (
    <div className="max-w-sm">
      <Input type="search" placeholder="Search products" />
    </div>
  )
}
