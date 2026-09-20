import { useState, type FormEvent, type MouseEvent } from 'react'
import { Button } from '@/shared/components/actions/Button/Button'
import { Input } from '@/shared/components/forms/Input/Input'
import { validateLogin } from '../../schemas/login.schema'
import type { LoginFormErrors, LoginFormValues } from '../../types/authentication.types'
import { ArrowRightIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from '../icons'
import styles from './LoginForm.module.scss'

const INITIAL_VALUES: LoginFormValues = { email: '', password: '' }

export function LoginForm() {
  const [values, setValues] = useState<LoginFormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateLogin(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    // Valid credentials remain in local form state until the REST contract is available.
  }

  const handlePlaceholderLink = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
  }

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <h1 id="login-title">Welcome back</h1>
        <p>Sign in to your MultiTech mCloud account</p>
      </header>

      <form aria-labelledby="login-title" className={styles.form} noValidate onSubmit={handleSubmit}>
        <Input
          autoCapitalize="none"
          autoComplete="username"
          error={errors.email}
          fullWidth
          id="email"
          inputMode="email"
          label="Email address"
          leadingIcon={<MailIcon />}
          name="email"
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          placeholder="you@company.com"
          required
          spellCheck={false}
          type="email"
          value={values.email}
        />

        <div className={styles.passwordGroup}>
          <Input
            autoComplete="current-password"
            error={errors.password}
            fullWidth
            id="password"
            label="Password"
            leadingIcon={<LockIcon />}
            name="password"
            onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
            placeholder="Enter your password"
            required
            trailingElement={
              <button
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                className={styles.visibilityButton}
                onClick={() => setIsPasswordVisible((current) => !current)}
                type="button"
              >
                {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
            type={isPasswordVisible ? 'text' : 'password'}
            value={values.password}
          />
          <a className={styles.forgotLink} href="#" onClick={handlePlaceholderLink}>Forgot your password?</a>
        </div>

        <Button fullWidth trailingIcon={<ArrowRightIcon />} type="submit">Sign in</Button>

        <div className={styles.divider} aria-hidden="true"><span>OR</span></div>

        <p className={styles.contact}>
          Don't have an account?{' '}
          <a href="#" onClick={handlePlaceholderLink}>Contact your administrator</a>
        </p>
      </form>
    </div>
  )
}
