"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/registry/default/ui/input";

type AllowedInputTypes = 'password' | 'text' | 'number' | 'tel';

interface OTPInputProps
  extends Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    | "onPaste"
    | "pattern"
    | "autoFocus"
    | "className"
    | "id"
    | "name"
  > {
  /** Value of the OTP input */
  value?: string
  /** Callback to be called when the OTP value changes */
  onChange?: (otp: string) => void
  /** Callback to be called when pasting content into the component */
  onPaste?: (event: React.ClipboardEvent<HTMLDivElement>) => void;
  /** Number of OTP inputs to be rendered */
  numInputs?: number
  /** Placeholder for the inputs */
  placeholder?: string;
    /** Type of the input */
  type?: AllowedInputTypes
  /** Function to render the separator */
  renderSeparator?: ((index: number) => React.ReactNode) | React.ReactNode;
}

export const OTPInput = ({
  value = "",
  numInputs = 6,
  onChange,
  type = "text",
  placeholder = "_",
  pattern = "[0-9]",
  autoFocus = false,
  className,
  id,
  name,
  onPaste,
  renderSeparator,
  ...rest
}: OTPInputProps) => {
  const [otpValue, setOTPValue] = React.useState(value)
  const [activeInput, setActiveInput] = React.useState(0)
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([])

  const getOTPValue = () => (otpValue ? otpValue.toString().split("") : [])

  const isInputNum = type === "number" || type === "tel"

  React.useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, numInputs)
  }, [numInputs])

  React.useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus()
    }
  }, [autoFocus])

  const isInputValueValid = (value: string) => {
    const isTypeValid = isInputNum
      ? !isNaN(Number(value))
      : typeof value === "string"
    return isTypeValid && value.trim().length === 1
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    if (isInputValueValid(value)) {
      changeCodeAtFocus(value)
      focusInput(activeInput + 1)
    }
  }

  const handleFocus =
    (event: React.FocusEvent<HTMLInputElement>) => (index: number) => {
      setActiveInput(index)
      event.target.select()
    }

  const handleBlur = () => {
    setActiveInput(activeInput - 1)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const otp = getOTPValue()
    if ([event.code, event.key].includes("Backspace")) {
      event.preventDefault()
      changeCodeAtFocus("")
      focusInput(activeInput - 1)
    } else if (event.code === "Delete") {
      event.preventDefault()
      changeCodeAtFocus("")
    } else if (event.code === "ArrowLeft") {
      event.preventDefault()
      focusInput(activeInput - 1)
    } else if (event.code === "ArrowRight") {
      event.preventDefault()
      focusInput(activeInput + 1)
    }
    // React does not trigger onChange when the same value is entered
    // again. So we need to focus the next input manually in this case.
    else if (event.key === otp[activeInput]) {
      event.preventDefault()
      focusInput(activeInput + 1)
    } else if (
      event.code === "Spacebar" ||
      event.code === "Space" ||
      event.code === "ArrowUp" ||
      event.code === "ArrowDown"
    ) {
      event.preventDefault()
    } else if (isInputNum && !isInputValueValid(event.key)) {
      event.preventDefault()
    }
  }

  const focusInput = (index: number) => {
    const activeInput = Math.max(Math.min(numInputs - 1, index), 0)

    if (inputRefs.current[activeInput]) {
      inputRefs.current[activeInput]?.focus()
      inputRefs.current[activeInput]?.select()
      setActiveInput(activeInput)
    }
  }

  const changeCodeAtFocus = (value: string) => {
    const otp = getOTPValue()
    otp[activeInput] = value[0]
    handleOTPChange(otp)
  }

  const handleOTPChange = (otp: Array<string>) => {
    const otpValue = otp.join("")
    setOTPValue(otpValue)
    onChange?.(otpValue)
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()

    const otp = getOTPValue()
    let nextActiveInput = activeInput

    // Get pastedData in an array of max size (num of inputs - current position)
    const pastedData = event.clipboardData
      .getData("text/plain")
      .slice(0, numInputs - activeInput)
      .split("")

    // Prevent pasting if the clipboard data contains non-numeric values for number inputs
    if (isInputNum && pastedData.some((value) => isNaN(Number(value)))) {
      return
    }

    // Paste data from focused input onwards
    for (let pos = 0; pos < numInputs; ++pos) {
      if (pos >= activeInput && pastedData.length > 0) {
        otp[pos] = pastedData.shift() ?? ""
        nextActiveInput++
      }
    }

    focusInput(nextActiveInput)
    handleOTPChange(otp)
  }

  return (
    <div className="flex gap-2 items-center" onPaste={onPaste}>
      {Array.from({ length: numInputs }, (_, index) => index).map((i) => (
        <React.Fragment key={i}>
          <Input
            id={`${id}-${i}`}
            name={`${name}-${i}`}
            value={getOTPValue()[i] ?? ""}
            placeholder={placeholder}
            ref={(element) => (inputRefs.current[i] = element)}
            onChange={handleChange}
            onFocus={(event) => handleFocus(event)(i)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            autoComplete="off"
            maxLength={1}
            size={1}
            className={cn("text-center font-bold", className)}
            pattern={pattern}
            {...rest}
          />
          {i < numInputs - 1 && (typeof renderSeparator === 'function' ? renderSeparator(i) : renderSeparator)}
        </React.Fragment>
      ))}
      <input type="hidden" id={id} name={name} value={otpValue} />
    </div>
  )
}
