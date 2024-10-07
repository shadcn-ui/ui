"use client"

import * as React from "react"
import { type ValidationResult } from "@react-types/shared"
import clsx from "clsx"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import {
  AriaNumberFieldProps,
  useButton,
  useLocale,
  useNumberField,
  type NumberFieldAria,
} from "react-aria"
import {
  NumberFieldState,
  NumberFieldStateOptions,
  useNumberFieldState,
} from "react-stately"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"

interface NumberFieldContextValue {
  numberFieldProps: NumberFieldAria
  inputRef?: React.RefObject<HTMLInputElement>
  btnPosition?: "inside" | "outside"
  labelPosition?: "left" | "top"
  errorMessage?: React.ReactNode | ((v: ValidationResult) => React.ReactNode)
}
const NumberFieldContext = React.createContext<NumberFieldContextValue>(
  {} as NumberFieldContextValue
)

const useNumberFieldContext = () => {
  const numberFieldContext = React.useContext(NumberFieldContext)
  if (!numberFieldContext) {
    throw new Error("useNumberFieldContext should be used within <NumberField>")
  }
  return numberFieldContext
}

type NumberFieldRef = Partial<HTMLDivElement> & {
  state: NumberFieldState
  numberFieldProps: NumberFieldAria
}
type NumberFieldProps = React.PropsWithChildren<
  Partial<AriaNumberFieldProps> & {
    name?: string
    className?: string
    btnPosition?: "inside" | "outside"
    labelPosition?: "left" | "top"
  } & Partial<Pick<NumberFieldStateOptions, "locale">>
>
const NumberField = React.forwardRef<NumberFieldRef, NumberFieldProps>(
  (
    {
      children,
      className,
      btnPosition = "inside",
      labelPosition = "top",
      locale: customLocale,
      errorMessage,
      validationBehavior = "native",
      ...props
    },
    ref
  ) => {
    const hookLocale = useLocale().locale
    const locale = customLocale || hookLocale
    props.label = props.label || props.name || "label"

    const state = useNumberFieldState({
      ...props,
      locale,
      errorMessage,
      validationBehavior,
    })

    const inputRef = React.useRef<HTMLInputElement>(null)
    const numberFieldProps = useNumberField(
      { ...props, errorMessage, validationBehavior },
      state,
      inputRef
    )

    numberFieldProps.inputProps.name = props.name

    return (
      <NumberFieldContext.Provider
        value={{
          numberFieldProps,
          inputRef,
          btnPosition,
          labelPosition,
          errorMessage,
        }}
      >
        <div
          ref={ref as React.ForwardedRef<HTMLDivElement>}
          {...numberFieldProps.groupProps}
          className={cn(
            "grid",
            labelPosition === "left"
              ? "grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-x-1"
              : " grid-cols-1 grid-rows-[auto_1fr_auto]",
            className
          )}
        >
          {children}
        </div>
      </NumberFieldContext.Provider>
    )
  }
)
NumberField.displayName = "NumberField"

type NumberFieldGroupProps = {
  className?: string
  children: React.ReactNode
}
const NumberFieldGroup = React.forwardRef<
  HTMLDivElement,
  NumberFieldGroupProps
>(({ className, children }, ref) => {
  const {
    numberFieldProps: { groupProps },
  } = useNumberFieldContext()
  return (
    <div
      ref={ref}
      className={cn("relative flex gap-1", className)}
      {...groupProps}
    >
      {children}
    </div>
  )
})
NumberFieldGroup.displayName = "NumberFieldGroup"

type NumberFieldIncrementProps = {
  className?: string
  children?: React.ReactNode
}
const NumberFieldIncrement = React.forwardRef<
  HTMLButtonElement,
  NumberFieldIncrementProps
>(({ className, children }, ref) => {
  const {
    numberFieldProps: { incrementButtonProps },
    btnPosition,
  } = useNumberFieldContext()

  const { buttonProps } = useButton(
    incrementButtonProps,
    ref as React.RefObject<HTMLButtonElement | null>
  )

  return (
    <Button
      className={clsx(
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        btnPosition === "outside"
          ? "px-3 py-2"
          : "absolute right-0 top-0 z-10 flex h-1/2 w-6 items-center justify-center rounded-b-none p-0 focus-visible:outline-none",
        className
      )}
      variant="outline"
      {...buttonProps}
      ref={ref}
    >
      {children || <ChevronUpIcon className="h-4 w-4" />}
    </Button>
  )
})
NumberFieldIncrement.displayName = "NumberFieldIncrement"

type NumberFieldDecrementProps = {
  children?: React.ReactNode
  className?: string
}
const NumberFieldDecrement = React.forwardRef<
  HTMLButtonElement,
  NumberFieldDecrementProps
>(({ className, children }, ref) => {
  const {
    numberFieldProps: { decrementButtonProps },
    btnPosition,
  } = useNumberFieldContext()

  const { buttonProps } = useButton(
    decrementButtonProps,
    ref as React.RefObject<HTMLButtonElement | null>
  )

  return (
    <Button
      className={clsx(
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        btnPosition === "outside"
          ? "px-3 py-2"
          : "absolute bottom-0 right-0 z-10 flex h-1/2 w-6 items-center justify-center rounded-t-none p-0 focus-visible:outline-none",
        className
      )}
      variant="outline"
      {...buttonProps}
      ref={ref}
    >
      {children || <ChevronDownIcon className="h-4 w-4" />}
    </Button>
  )
})
NumberFieldDecrement.displayName = "NumberFieldDecrement"

type NumberFieldInputProps = { className?: string }
const NumberFieldInput = React.forwardRef<
  HTMLInputElement,
  NumberFieldInputProps
>(({ className }, ref) => {
  const {
    numberFieldProps: { inputProps, isInvalid },
    inputRef,
  } = useNumberFieldContext()

  React.useEffect(() => {
    if (ref && "current" in ref && inputRef?.current) {
      ref.current = inputRef?.current
    }
  }, [inputRef, ref])

  return (
    <Input
      ref={inputRef}
      type="number"
      className={clsx(
        { "focus-visible:ring-destructive": isInvalid },
        className
      )}
      {...inputProps}
    />
  )
})
NumberFieldInput.displayName = "NumberFieldInput"

type NumberFieldLabelProps = {
  className?: string
  children: React.ReactNode
}
const NumberFieldLabel = React.forwardRef<
  HTMLLabelElement,
  NumberFieldLabelProps
>(({ className, children }, ref) => {
  const {
    numberFieldProps: { labelProps },
    labelPosition,
  } = useNumberFieldContext()

  return (
    <label
      ref={ref}
      {...labelProps}
      className={cn(
        labelPosition === "left" && "flex items-center justify-center",
        className
      )}
    >
      {children}
    </label>
  )
})
NumberFieldLabel.displayName = "NumberFieldLabel"

type NumberFieldErrorProps = {
  className?: string
  // children?: React.ReactNode;
}
const NumberFieldError = React.forwardRef<
  HTMLDivElement,
  NumberFieldErrorProps
>(({ className }, ref) => {
  const {
    numberFieldProps: {
      errorMessageProps,
      isInvalid,
      validationErrors,
      validationDetails,
    },
    errorMessage,
    labelPosition,
  } = useNumberFieldContext()

  let errorMessageString: React.ReactNode = null
  if (typeof errorMessage === "function") {
    errorMessageString =
      isInvalid && validationErrors != null && validationDetails != null
        ? errorMessage({
            isInvalid,
            validationErrors,
            validationDetails,
          })
        : null
  } else if (errorMessage) {
    errorMessageString = errorMessage
  } else {
    errorMessageString = validationErrors
  }

  return (
    <div
      ref={ref}
      {...errorMessageProps}
      className={cn(
        "text-destructive",
        labelPosition === "left" && "col-start-2",
        className
      )}
    >
      {isInvalid && errorMessageString}
    </div>
  )
})
NumberFieldError.displayName = "NumberFieldError"

export {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldLabel,
  NumberFieldError,
}

export type {
  NumberFieldRef,
  NumberFieldProps,
  NumberFieldDecrementProps,
  NumberFieldGroupProps,
  NumberFieldIncrementProps,
  NumberFieldInputProps,
  NumberFieldLabelProps,
  NumberFieldErrorProps,
}
