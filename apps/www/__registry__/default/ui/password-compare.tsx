import * as React from "react"
import { CheckCircle, Eye, EyeOff, XCircle } from "lucide-react"

import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"

export interface PasswordCompareProps {
  onChange: (password: string) => void
  onValidChange: (isValid: boolean) => void
  validationflags?: PasswordFlag[]
  className?: string
}

export interface PasswordFlag {
  name: string
  value: boolean
  message: string
  regex: RegExp
}

export const defaultFlags: PasswordFlag[] = [
  {
    name: "hasUpper",
    value: false,
    message: "At least one uppercase letter",
    regex: /[A-Z]/,
  },
  {
    name: "hasLower",
    value: false,
    message: "At least one lowercase letter",
    regex: /[a-z]/,
  },
  {
    name: "hasNumber",
    value: false,
    message: "At least one number",
    regex: /[0-9]/,
  },
  {
    name: "hasSpecial",
    value: false,
    message: "At least one special character",
    regex: /[!@#$%^&*]/,
  },
  {
    name: "hasLength",
    value: false,
    message: "At least 8 characters",
    regex: /.{8,}/,
  },
]

const PasswordCompare = React.forwardRef<HTMLDivElement, PasswordCompareProps>(
  ({ onChange, onValidChange, validationflags, className, ...props }, ref) => {
    const [password, setPassword] = React.useState<string>("")
    const [confirmPassword, setConfirmPassword] = React.useState<string>("")
    const arePaswordEqual: boolean = password === confirmPassword

    const flagFactory = React.useCallback((inputFlags: PasswordFlag[]) => {
      const flagsObject: Record<string, PasswordFlag> = {}
      inputFlags.forEach((flag) => {
        flagsObject[flag.message] = flag
      })
      return flagsObject
    }, [])

    const [flags, setFlags] = React.useState(
      flagFactory(validationflags || defaultFlags)
    )

    const isValid = Object.keys(flags).every(
      (key) =>
        flags[key as keyof typeof flags].value === true && arePaswordEqual
    )

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      const flagsCopy = { ...flags }
      for (const key in flagsCopy) {
        if (Object.prototype.hasOwnProperty.call(flagsCopy, key)) {
          flagsCopy[key as keyof typeof flagsCopy].value = flagsCopy[
            key as keyof typeof flagsCopy
          ].regex.test(e.target.value)
        }
      }
      setFlags(flagsCopy)
    }

    React.useEffect(() => {
      onValidChange(isValid)
      if (isValid) onChange(password)
    }, [isValid])

    return (
      <div ref={ref} className={className} {...props}>
        <PasswordField
          value={password}
          onChange={handlePasswordChange}
          id="password"
        />
        <PasswordField
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setConfirmPassword(e.target.value)
          }
          id="confirmPassword"
          label="Confirm password"
        />
        <div className="flex w-full flex-col items-start justify-center">
          <div className="mx-auto flex flex-col items-start justify-start gap-2">
            {Object.keys(flags).map((key) => (
              <PasswordValidityChip
                key={key}
                value={flags[key as keyof typeof flags].value}
                message={flags[key as keyof typeof flags].message}
              />
            ))}
            <PasswordValidityChip
              value={arePaswordEqual}
              message="Passwords match"
            />
          </div>
        </div>
      </div>
    )
  }
)

PasswordCompare.displayName = "PasswordCompare"
PasswordCompare.defaultProps = {
  className: "flex flex-col items-start justify-start gap-4",
}

export interface PasswordFieldProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  id: string
  placeholder?: string
  label?: string
}

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ value, onChange, id, placeholder, label }, ref) => {
    const [visible, setVisible] = React.useState<boolean>(false)
    return (
      <div
        ref={ref}
        className="flex w-full flex-col items-start justify-start gap-2"
      >
        <Label htmlFor="password">{label}</Label>
        <div className="inline-flex w-full items-center justify-start gap-2">
          <Input
            value={value}
            onChange={onChange}
            type={visible ? "text" : "password"}
            id={id}
            name={id}
            placeholder={placeholder}
          />
          <Button
            className="min-w-10"
            variant={"outline"}
            size={"icon"}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </Button>
        </div>
      </div>
    )
  }
)

PasswordField.displayName = "PasswordField"
PasswordField.defaultProps = {
  placeholder: "********",
  label: "Password",
  id: "password",
}

interface PasswordValidityChipProps {
  value: boolean
  message: string
}

const PasswordValidityChip = React.forwardRef<
  HTMLDivElement,
  PasswordValidityChipProps
>(({ value, message }, ref) => {
  return (
    <div ref={ref} className="inline-flex gap-2 text-xs">
      {value ? (
        <CheckCircle className="text-green-500" size={16} />
      ) : (
        <XCircle className="text-red-500" size={16} />
      )}
      <p className={value ? "text-green-500" : "text-red-500"}>{message}</p>
    </div>
  )
})

PasswordValidityChip.displayName = "PasswordValidityChip"

export { PasswordCompare, PasswordField, PasswordValidityChip }
