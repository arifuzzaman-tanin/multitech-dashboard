export interface LoginFormValues {
  email: string
  password: string
}

export type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>>

export interface RegistrationFormValues {
  name: string
  email: string
  company: string
  password: string
  confirmPassword: string
}

export type RegistrationFormErrors = Partial<Record<keyof RegistrationFormValues, string>>
