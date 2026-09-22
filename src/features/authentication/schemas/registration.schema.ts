import type { RegistrationFormErrors, RegistrationFormValues } from '../types/authentication.types'

const EMAIL_MAX_LENGTH = 254
const TEXT_MAX_LENGTH = 120
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 128
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateRegistration(values: RegistrationFormValues): RegistrationFormErrors {
  const errors: RegistrationFormErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const company = values.company.trim()

  if (!name) {
    errors.name = 'Name is required.'
  } else if (name.length > TEXT_MAX_LENGTH) {
    errors.name = 'Name is too long.'
  }

  if (!email) {
    errors.email = 'Email address is required.'
  } else if (email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!company) {
    errors.company = 'Company is required.'
  } else if (company.length > TEXT_MAX_LENGTH) {
    errors.company = 'Company is too long.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  } else if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
  } else if (values.password.length > PASSWORD_MAX_LENGTH) {
    errors.password = 'Password is too long.'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}
