import type { LoginFormErrors, LoginFormValues } from '../types/authentication.types'

const EMAIL_MAX_LENGTH = 254
const PASSWORD_MAX_LENGTH = 128
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {}
  const email = values.email.trim()

  if (!email) {
    errors.email = 'Email address is required.'
  } else if (email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  } else if (values.password.length > PASSWORD_MAX_LENGTH) {
    errors.password = 'Password is too long.'
  }

  return errors
}
