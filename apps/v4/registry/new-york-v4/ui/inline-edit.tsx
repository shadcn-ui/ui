"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, Edit3, Loader2, X } from "lucide-react"

import { cn } from "@/lib/utils"

const inlineEditVariants = cva(
  "relative inline-flex items-center gap-2 transition-colors focus-within:outline-none",
  {
    variants: {
      variant: {
        default: "hover:bg-muted/50 rounded-md",
        ghost: "hover:bg-transparent",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground rounded-md",
      },
      size: {
        default: "min-h-9 px-3 py-1 text-sm",
        sm: "min-h-8 px-2 py-1 text-xs",
        lg: "min-h-10 px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InlineEditProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onSave">,
    VariantProps<typeof inlineEditVariants> {
  /** Current value of the input */
  value?: string
  /** Default value for uncontrolled mode */
  defaultValue?: string
  /** Placeholder text when no value is present */
  placeholder?: string
  /** Input type for the edit field */
  inputType?: "text" | "email" | "password" | "number" | "url" | "tel"
  /** Whether the component is in edit mode */
  isEditing?: boolean
  /** Whether the component is disabled */
  disabled?: boolean
  /** Whether the component is required */
  required?: boolean
  /** Whether to show edit icon on hover */
  showEditIcon?: boolean
  /** Whether to show action buttons (save/cancel) */
  showActionButtons?: boolean
  /** Whether to save on Enter key press */
  saveOnEnter?: boolean
  /** Whether to cancel on Escape key press */
  cancelOnEscape?: boolean
  /** Whether to save on blur */
  saveOnBlur?: boolean
  /** Loading state */
  isLoading?: boolean
  /** Error message */
  error?: string
  /** Maximum length of input */
  maxLength?: number
  /** Minimum length of input */
  minLength?: number
  /** Validation function */
  validate?: (value: string) => string | null
  /** Format function for display value */
  formatValue?: (value: string) => string
  /** Parse function for input value */
  parseValue?: (value: string) => string
  /** Custom input component */
  inputComponent?: React.ComponentType<
    React.InputHTMLAttributes<HTMLInputElement>
  >
  /** Custom display component */
  displayComponent?: React.ComponentType<{ children: React.ReactNode }>
  /** Callback fired when value changes */
  onChange?: (value: string) => void
  /** Callback fired when edit mode starts */
  onEditStart?: () => void
  /** Callback fired when edit mode ends */
  onEditEnd?: () => void
  /** Callback fired when value is saved */
  onSave?: (value: string) => Promise<void> | void
  /** Callback fired when edit is cancelled */
  onCancel?: () => void
  /** Callback fired on validation error */
  onValidationError?: (error: string) => void
}

const InlineEdit = React.forwardRef<HTMLDivElement, InlineEditProps>(
  (
    {
      className,
      variant,
      size,
      value: controlledValue,
      defaultValue = "",
      placeholder,
      inputType = "text",
      isEditing: controlledIsEditing,
      disabled = false,
      required = false,
      showEditIcon = true,
      showActionButtons = false,
      saveOnEnter = true,
      cancelOnEscape = true,
      saveOnBlur = true,
      isLoading = false,
      error,
      maxLength,
      minLength,
      validate,
      formatValue,
      parseValue,
      inputComponent: InputComponent,
      displayComponent: DisplayComponent,
      onChange,
      onEditStart,
      onEditEnd,
      onSave,
      onCancel,
      onValidationError,
      ...props
    },
    ref
  ) => {
    // Internal state management
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const [internalIsEditing, setInternalIsEditing] = React.useState(false)
    const [internalError, setInternalError] = React.useState<string | null>(
      null
    )
    const [isSaving, setIsSaving] = React.useState(false)

    // Determine controlled vs uncontrolled mode
    const isValueControlled = controlledValue !== undefined
    const isEditingControlled = controlledIsEditing !== undefined

    const value = isValueControlled ? controlledValue : internalValue
    const isEditing = isEditingControlled
      ? controlledIsEditing
      : internalIsEditing
    const currentError = error || internalError

    // Refs
    const inputRef = React.useRef<HTMLInputElement>(null)
    const originalValueRef = React.useRef<string>(value)

    // Update internal value when controlled value changes
    React.useEffect(() => {
      if (isValueControlled) {
        setInternalValue(controlledValue)
      }
    }, [controlledValue, isValueControlled])

    // Focus input when entering edit mode
    React.useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }, [isEditing])

    // Validation
    const validateValue = React.useCallback(
      (val: string): string | null => {
        if (required && !val.trim()) {
          return "This field is required"
        }
        if (minLength && val.length < minLength) {
          return `Minimum length is ${minLength}`
        }
        if (maxLength && val.length > maxLength) {
          return `Maximum length is ${maxLength}`
        }
        if (validate) {
          return validate(val)
        }
        return null
      },
      [required, minLength, maxLength, validate]
    )

    // Handle value change
    const handleValueChange = React.useCallback(
      (newValue: string) => {
        const parsedValue = parseValue ? parseValue(newValue) : newValue

        if (!isValueControlled) {
          setInternalValue(parsedValue)
        }

        onChange?.(parsedValue)

        // Clear error when value changes
        if (currentError) {
          setInternalError(null)
        }
      },
      [isValueControlled, onChange, parseValue, currentError]
    )

    // Start editing
    const startEditing = React.useCallback(() => {
      if (disabled || isEditing) return

      originalValueRef.current = value

      if (!isEditingControlled) {
        setInternalIsEditing(true)
      }

      onEditStart?.()
    }, [disabled, isEditing, isEditingControlled, value, onEditStart])

    // End editing
    const endEditing = React.useCallback(() => {
      if (!isEditingControlled) {
        setInternalIsEditing(false)
      }

      setInternalError(null)
      onEditEnd?.()
    }, [isEditingControlled, onEditEnd])

    // Save changes
    const saveChanges = React.useCallback(
      async (newValue: string = value) => {
        const validationError = validateValue(newValue)

        if (validationError) {
          setInternalError(validationError)
          onValidationError?.(validationError)
          return false
        }

        try {
          setIsSaving(true)
          await onSave?.(newValue)
          endEditing()
          return true
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Save failed"
          setInternalError(errorMessage)
          onValidationError?.(errorMessage)
          return false
        } finally {
          setIsSaving(false)
        }
      },
      [value, validateValue, onSave, onValidationError, endEditing]
    )

    // Cancel editing
    const cancelEditing = React.useCallback(() => {
      if (!isValueControlled) {
        setInternalValue(originalValueRef.current)
      }

      handleValueChange(originalValueRef.current)
      onCancel?.()
      endEditing()
    }, [isValueControlled, handleValueChange, onCancel, endEditing])

    // Keyboard handlers
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && saveOnEnter) {
          event.preventDefault()
          saveChanges()
        } else if (event.key === "Escape" && cancelOnEscape) {
          event.preventDefault()
          cancelEditing()
        }
      },
      [saveOnEnter, cancelOnEscape, saveChanges, cancelEditing]
    )

    // Input handlers
    const handleInputChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        handleValueChange(event.target.value)
      },
      [handleValueChange]
    )

    const handleInputBlur = React.useCallback(() => {
      if (saveOnBlur && !showActionButtons) {
        saveChanges()
      } else if (!showActionButtons) {
        endEditing()
      }
    }, [saveOnBlur, showActionButtons, saveChanges, endEditing])

    // Display value
    const displayValue = React.useMemo(() => {
      if (!value) return placeholder
      return formatValue ? formatValue(value) : value
    }, [value, placeholder, formatValue])

    // Render input
    const renderInput = () => {
      const inputProps = {
        ref: inputRef,
        type: inputType,
        value: value,
        onChange: handleInputChange,
        onBlur: handleInputBlur,
        onKeyDown: handleKeyDown,
        className: cn(
          "flex h-full w-full bg-transparent px-0 py-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          currentError && "text-destructive"
        ),
        disabled: disabled || isSaving,
        maxLength,
        minLength,
        required,
        "aria-invalid": !!currentError,
        "aria-describedby": currentError ? "inline-edit-error" : undefined,
      }

      if (InputComponent) {
        return <InputComponent {...inputProps} />
      }

      return <input {...inputProps} />
    }

    // Render display
    const renderDisplay = () => {
      const content = (
        <>
          <span
            className={cn("flex-1 truncate", !value && "text-muted-foreground")}
          >
            {displayValue}
          </span>
          {showEditIcon && (
            <Edit3
              className={cn(
                "h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100",
                disabled && "hidden"
              )}
            />
          )}
        </>
      )

      if (DisplayComponent) {
        return <DisplayComponent>{content}</DisplayComponent>
      }

      return content
    }

    // Render action buttons
    const renderActionButtons = () => {
      if (!showActionButtons || !isEditing) return null

      return (
        <div className="ml-2 flex items-center gap-1">
          <button
            type="button"
            onClick={() => saveChanges()}
            disabled={isSaving || !!currentError}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-6 w-6 items-center justify-center rounded-sm disabled:opacity-50"
            aria-label="Save changes"
          >
            {isSaving ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Check className="h-3 w-3" />
            )}
          </button>
          <button
            type="button"
            onClick={cancelEditing}
            disabled={isSaving}
            className="bg-muted text-muted-foreground hover:bg-muted/80 inline-flex h-6 w-6 items-center justify-center rounded-sm disabled:opacity-50"
            aria-label="Cancel editing"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )
    }

    if (isEditing) {
      return (
        <div
          ref={ref}
          className={cn(inlineEditVariants({ variant, size }), className)}
          {...props}
        >
          <div className="min-w-0 flex-1">
            {renderInput()}
            {currentError && (
              <div
                id="inline-edit-error"
                className="text-destructive mt-1 text-xs"
                role="alert"
              >
                {currentError}
              </div>
            )}
          </div>
          {renderActionButtons()}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          inlineEditVariants({ variant, size }),
          "group cursor-pointer",
          disabled && "cursor-default opacity-50",
          className
        )}
        onClick={disabled ? undefined : startEditing}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            startEditing()
          }
        }}
        aria-label={`Edit ${displayValue}. Press Enter or Space to start editing.`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-muted-foreground">Loading...</span>
          </>
        ) : (
          renderDisplay()
        )}
      </div>
    )
  }
)

InlineEdit.displayName = "InlineEdit"

export { InlineEdit, inlineEditVariants }
