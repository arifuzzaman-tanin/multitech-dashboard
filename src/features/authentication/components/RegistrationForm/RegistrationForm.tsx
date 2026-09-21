import { useState, type FormEvent } from 'react'
import { Button } from '@/shared/components/actions/Button/Button'
import { Input } from '@/shared/components/forms/Input/Input'
import { validateRegistration } from '../../schemas/registration.schema'
import type { RegistrationFormErrors, RegistrationFormValues } from '../../types/authentication.types'
import { ArrowRightIcon, BuildingIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from '../icons'
import styles from '../AuthForm.module.scss'

const INITIAL_VALUES: RegistrationFormValues = {
  name: '',
  email: '',
  company: '',
  password: '',
  confirmPassword: '',
}

export function RegistrationForm() {
  const [values, setValues] = useState<RegistrationFormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<RegistrationFormErrors>({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateRegistration(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    // Valid registration details remain local until the registration API contract is available.
  }

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <h1 id="registration-title">Create an account</h1>
        <p>Register your MultiTech mCloud account</p>
      </header>

      <form aria-labelledby="registration-title" className={styles.form} noValidate onSubmit={handleSubmit}>
        <Input
          autoComplete="name"
          error={errors.name}
          fullWidth
          id="name"
          label="Name"
          leadingIcon={<UserIcon />}
          name="name"
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          placeholder="Your name"
          required
          type="text"
          value={values.name}
        />

        <Input
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
          fullWidth
          id="registration-email"
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

        <Input
          autoComplete="organization"
          error={errors.company}
          fullWidth
          id="company"
          label="Company"
          leadingIcon={<BuildingIcon />}
          name="company"
          onChange={(event) => setValues((current) => ({ ...current, company: event.target.value }))}
          placeholder="Company name"
          required
          type="text"
          value={values.company}
        />

        <Input
          autoComplete="new-password"
          error={errors.password}
          fullWidth
          id="registration-password"
          label="Password"
          leadingIcon={<LockIcon />}
          name="password"
          onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
          placeholder="Create a password"
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

        <Input
          autoComplete="new-password"
          error={errors.confirmPassword}
          fullWidth
          id="confirm-password"
          label="Confirm password"
          leadingIcon={<LockIcon />}
          name="confirmPassword"
          onChange={(event) => setValues((current) => ({ ...current, confirmPassword: event.target.value }))}
          placeholder="Confirm your password"
          required
          trailingElement={
            <button
              aria-label={isConfirmPasswordVisible ? 'Hide confirm password' : 'Show confirm password'}
              className={styles.visibilityButton}
              onClick={() => setIsConfirmPasswordVisible((current) => !current)}
              type="button"
            >
              {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
          type={isConfirmPasswordVisible ? 'text' : 'password'}
          value={values.confirmPassword}
        />

        <Button fullWidth trailingIcon={<ArrowRightIcon />} type="submit">Create account</Button>

        <p className={styles.contact}>
          Already have an account? <a href="/">Sign in</a>
        </p>
      </form>
    </div>
  )
}
