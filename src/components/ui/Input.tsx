import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    const generatedId = React.useId()
    const id = props.id ?? generatedId
    const descriptionId = `${id}-description`
    return (
      <div className="w-full">
        {label && (
          <label className="label" htmlFor={id}>
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
              {leftIcon}
            </div>
          )}
          <input
            className={cn(
              'input',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'input-error',
              className
            )}
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || helperText ? descriptionId : undefined}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={descriptionId} className="error-text">{error}</p>
        )}
        {helperText && !error && (
          <p id={descriptionId} className="text-sm text-neutral-500 mt-1">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }

