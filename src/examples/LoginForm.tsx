import { useState, type FormEvent } from 'react'

export type Credentials = { email: string; password: string }

/**
 * GOOD — semantic form.
 *
 * - A real <form> with an accessible name.
 * - Every input is tied to a <label> via htmlFor/id, so it is reachable by
 *   getByLabelText and announced by screen readers.
 * - The submit control is a real <button type="submit">.
 *
 * A role/label test passing against this markup *also* proves the form is
 * usable. That is the whole point.
 */
export function LoginFormGood({ onSubmit }: { onSubmit?: (c: Credentials) => void }) {
  const [error, setError] = useState('')

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
    <form aria-label="Sign in" onSubmit={handleSubmit} className="grid gap-3 max-w-sm">
      <div className="grid gap-1">
        <label htmlFor="login-email">Email address</label>
        <input id="login-email" name="email" type="email" className="border rounded px-2 py-1" />
      </div>
      <div className="grid gap-1">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          className="border rounded px-2 py-1"
        />
      </div>
      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
      <button type="submit" className="rounded bg-primary text-primary-foreground px-3 py-1.5">
        Sign in
      </button>
    </form>
  )
}

/**
 * BAD — the same form rebuilt out of divs and test ids.
 *
 * - The "form" is a <div data-testid="login-form">.
 * - Inputs have placeholders instead of associated labels.
 * - The "button" is a clickable <div data-testid="login-submit-btn">: no role,
 *   not keyboard focusable, invisible to assistive tech.
 *
 * A test id selector makes all of this pass. A role/label selector cannot find
 * a thing here — which is exactly the user's experience.
 */
export function LoginFormBad({ onSubmit }: { onSubmit?: (c: Credentials) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div data-testid="login-form" className="grid gap-3 max-w-sm">
      <input
        data-testid="email-input"
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <input
        data-testid="password-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded px-2 py-1"
      />
      {/* eslint-disable-next-line — intentionally bad: a div pretending to be a button */}
      <div
        data-testid="login-submit-btn"
        onClick={() => onSubmit?.({ email, password })}
        className="rounded bg-primary text-primary-foreground px-3 py-1.5 text-center cursor-pointer select-none"
      >
        Sign in
      </div>
    </div>
  )
}
