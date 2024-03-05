"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/registry/new-york/ui/input"

type AllowedInputTypes = "password" | "text" | "number" | "tel"

interface OTPInputProps
  extends Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    "pattern" | "autoFocus" | "id" | "name" | "disabled"
  > {
  /** Value of the OTP input */
  value?: string
  /** Callback to be called when the OTP value changes */
  onChange?: (otp: string) => void
  /** Callback to be called when pasting content into the component */
  onPaste?: (event: React.ClipboardEvent<HTMLDivElement>) => void
  /** Callback to be called when the input is focused */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Callback to be called when the input is blurred */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Callback to be called when a key is pressed */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  /** Callback to be called when the input value changes */
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void
  /** Number of OTP inputs to be rendered */
  numInputs?: number
  /** Placeholder for the inputs */
  placeholder?: string
  /** Type of the input */
  type?: AllowedInputTypes
  /** Function to render the separator */
  renderSeparator?: ((index: number) => React.ReactNode) | React.ReactNode
  /** Additional styles for the component */
  styles?: {
    container?: string
    input?: string | ((index: number) => React.ReactNode)
  }
  /** Focus the last input */
  lastInputFocused?: boolean
}

export const OTPInput = ({
  value = "",
  numInputs = 6,
  onChange,
  onPaste,
  onFocus,
  onBlur,
  onKeyDown,
  onInput,
  type = "text",
  placeholder = "_",
  pattern = "[0-9]",
  autoFocus = false,
  lastInputFocused = false,
  styles,
  id,
  name = "otp-input",
  renderSeparator,
  ...rest
}: OTPInputProps) => {
  const [otpValue, setOTPValue] = React.useState(
    new Array(numInputs).fill("").map((_, index) => value[index] ?? "")
  )
  const [activeInput, setActiveInput] = React.useState(0)
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([])

  const getOTPValue = () => otpValue

  const isInputNum = type === "number" || type === "tel"

  React.useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, numInputs)
  }, [numInputs])

  React.useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus()
    } else if (lastInputFocused) {
      focusInput(numInputs - 1)
    }
  }, [autoFocus, lastInputFocused])

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
      const otp = getOTPValue()
      if (otp[index] === "") {
        const lastFilledIndex = otp.findIndex((value) => value === "")
        setActiveInput(lastFilledIndex)
        inputRefs.current[lastFilledIndex]?.select()
        return
      } else {
        setActiveInput(index)
        event.target.select()
      }
      onFocus?.(event)
    }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setActiveInput(activeInput - 1)
    onBlur?.(event)
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
      if (otp[activeInput]) {
        focusInput(activeInput + 1)
      }
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
    onKeyDown?.(event)
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
    let otp = getOTPValue()
    if (value === "") {
      // If the value is empty, then move the values to the left (e.g Backspace is pressed)
      let newOtp = otp.slice(0, activeInput).concat(otp.slice(activeInput + 1))
      newOtp = newOtp.concat(new Array(numInputs - newOtp.length).fill(""))
      handleOTPChange(newOtp)
    } else {
      otp[activeInput] = value
      handleOTPChange(otp)
    }
  }

  const handleOTPChange = (otp: Array<string>) => {
    setOTPValue([...otp, ...new Array(numInputs - otp.length).fill("")])
    onChange?.(otp.join(""))
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
    onPaste?.(event)
  }

  return (
    <div
      className={cn("flex gap-2 items-center", styles?.container)}
      onPaste={onPaste}
    >
      {Array.from({ length: numInputs }, (_, index) => index).map((i) => (
        <React.Fragment key={i}>
          <Input
            tabIndex={i + 1}
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
            onInput={onInput}
            autoComplete="one-time-code"
            maxLength={1}
            size={1}
            className={cn(
              "text-center font-bold",
              activeInput === i && "z-10",
              typeof styles?.input === "function"
                ? styles.input(i)
                : styles?.input
            )}
            pattern={pattern}
            {...rest}
          />
          {typeof renderSeparator === "function"
            ? renderSeparator(i)
            : i < numInputs - 1 && renderSeparator}
        </React.Fragment>
      ))}
      <input type="hidden" id={id} name={name} value={otpValue} />
    </div>
  )
}
