import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import styles from './Input.module.scss'

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  leadingIcon?: ReactNode
  trailingElement?: ReactNode
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className = '',
    error,
    fullWidth = false,
    helperText,
    id,
    label,
    leadingIcon,
    trailingElement,
    ...inputProps
  },
  ref,
) {
  const messageId = error || helperText ? `${id}-message` : undefined
  const wrapperClasses = [styles.field, fullWidth ? styles.fullWidth : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClasses}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className={`${styles.control} ${error ? styles.invalid : ''}`}>
        {leadingIcon && <span className={styles.leadingIcon} aria-hidden="true">{leadingIcon}</span>}
        <input
          {...inputProps}
          aria-describedby={messageId}
          aria-invalid={Boolean(error)}
          className={styles.input}
          id={id}
          ref={ref}
        />
        {trailingElement && <span className={styles.trailingElement}>{trailingElement}</span>}
      </div>
      {(error || helperText) && (
        <p className={error ? styles.error : styles.helper} id={messageId} role={error ? 'alert' : undefined}>
          {error ?? helperText}
        </p>
      )}
    </div>
  )
})
