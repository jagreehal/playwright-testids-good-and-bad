import { useId, useState, type FormEvent } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { Credentials } from '@/examples/LoginForm'

/**
 * GOOD — shadcn form with application-level labels wired correctly.
 *
 * shadcn gives you real Input and Button primitives. Your team still provides
 * FieldLabel associations so getByLabel and screen readers get stable names.
 */
export function ShadcnLoginFormGood({ onSubmit }: { onSubmit?: (c: Credentials) => void }) {
  const [error, setError] = useState('')
  const emailId = useId()
  const passwordId = useId()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') ?? '')
    const password = String(data.get('password') ?? '')
    if (!email || !password) {
      setError('Enter your email and password.')
      return
    }
    setError('')
    onSubmit?.({ email, password })
  }

  return (
    <form aria-label="Sign in" onSubmit={handleSubmit} className="grid max-w-sm gap-3">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={emailId}>Email address</FieldLabel>
          <Input id={emailId} name="email" type="email" />
        </Field>
        <Field>
          <FieldLabel htmlFor={passwordId}>Password</FieldLabel>
          <Input id={passwordId} name="password" type="password" />
        </Field>
      </FieldGroup>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit">Sign in</Button>
    </form>
  )
}

/**
 * BAD — shadcn primitives without application labels.
 *
 * Input and Button are real elements — Tab and Enter still work. But there is
 * no FieldLabel, so getByLabel fails. Placeholders are hints, not names.
 */
export function ShadcnLoginFormBad({ onSubmit }: { onSubmit?: (c: Credentials) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email || !password) {
      setError('Enter your email and password.')
      return
    }
    setError('')
    onSubmit?.({ email, password })
  }

  return (
    <form
      data-testid="shadcn-login-form"
      aria-label="Sign in"
      onSubmit={handleSubmit}
      className="grid max-w-sm gap-3"
    >
      <FieldGroup>
        <Field>
          <Input
            data-testid="shadcn-email-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <Input
            data-testid="shadcn-password-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
      </FieldGroup>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button data-testid="shadcn-login-submit" type="submit">
        Sign in
      </Button>
    </form>
  )
}
