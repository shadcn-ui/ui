"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/registry/default/ui/input"

interface OTPInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | "ref"
    | "value"
    | "onFocus"
    | "onBlur"
    | "onKeyDown"
    | "onPaste"
    | "autoComplete"
    | "maxLength"
  > {
  /** Value of the OTP input */
  value?: string
  /** Callback to be called when the OTP value changes */
  onOtpChange?: (otp: string) => void
  /** Number of OTP inputs to be rendered */
  numInputs?: number
}

export const OTPInput = ({
  value = "",
  numInputs = 6,
  onOtpChange,
  type = "text",
  placeholder = "_",
  pattern = "[0-9]",
  autoFocus = true,
  className,
  id,
  name,
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
    onOtpChange?.(otpValue)
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
    <div className="flex gap-2">
      {Array.from({ length: numInputs }, (_, index) => index).map((i) => (
        <Input
          key={i}
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
      ))}
      <input type="hidden" id={id} name={name} value={otpValue} />
    </div>
  )
}
