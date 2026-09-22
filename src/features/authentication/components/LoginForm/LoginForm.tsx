import { useState, type FormEvent, type MouseEvent } from 'react'
import { ApiError } from '@/shared/api/apiClient'
import { Button } from '@/shared/components/actions/Button/Button'
import { Input } from '@/shared/components/forms/Input/Input'
import { useAuth } from '../../providers/useAuth'
import { validateLogin } from '../../schemas/login.schema'
import type { LoginFormErrors, LoginFormValues } from '../../types/authentication.types'
import { ArrowRightIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from '../icons'
import styles from '../AuthForm.module.scss'

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth()
  const [values, setValues] = useState<LoginFormValues>(() => ({
    email: new URLSearchParams(window.location.search).get('email') ?? '',
    password: '',
  }))
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const searchParams = new URLSearchParams(window.location.search)
  const hasRegistered = searchParams.get('registered') === '1'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    const nextErrors = validateLogin(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)

    try {
      await login(values)
      setValues({ email: '', password: '' })
      onSuccess()
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors((currentErrors) => ({ ...currentErrors, ...mapLoginFieldErrors(error.fieldErrors) }))
        setSubmitError(error.status === 401 ? 'Email or password is incorrect.' : error.message)
      } else {
        setSubmitError('Unable to sign in right now. Please try again.')
      }

      setValues((currentValues) => ({ ...currentValues, password: '' }))
    } finally {
      setIsSubmitting(false)
    }
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
        {hasRegistered && (
          <p className={styles.successMessage} role="status">
            Account created. Sign in to continue.
          </p>
        )}

        {submitError && (
          <p className={styles.errorMessage} role="alert">
            {submitError}
          </p>
        )}

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

        <Button
          fullWidth
          isLoading={isSubmitting}
          trailingIcon={<ArrowRightIcon />}
          type="submit"
        >
          Sign in
        </Button>

        <div className={styles.divider} aria-hidden="true"><span>OR</span></div>

        <p className={styles.contact}>
          Don't have an account?{' '}
          <a href="/register">Create an account</a>
        </p>
      </form>
    </div>
  )
}

function mapLoginFieldErrors(fieldErrors: Record<string, string> | undefined): LoginFormErrors {
  return {
    email: fieldErrors?.email,
    password: fieldErrors?.password,
  }
}
