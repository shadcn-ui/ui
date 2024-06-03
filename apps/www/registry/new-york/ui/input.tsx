import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import * as icons from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showIconPwd?: boolean
  icon?: string
  iconPosition?: "start" | "end"
  iconMaxShowWidth?: string
}

function getIconComponent(iconName: string) {
  if (iconName in icons) {
    return (icons as any)[iconName]
  }
  return null
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      showIconPwd = false,
      icon,
      iconPosition = "end",
      iconMaxShowWidth,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    const inputType = type === "password" && showPassword ? "text" : type
    const IconComponent = icon ? getIconComponent(icon) : null

    const [showIcon, setShowIcon] = React.useState(true);

    React.useEffect(() => {
      const updateIconVisibility = () => {
        const screenWidth = window.innerWidth;
        setShowIcon(!iconMaxShowWidth || screenWidth >= parseInt(iconMaxShowWidth));
      };
    
      window.addEventListener('resize', updateIconVisibility);
      updateIconVisibility();
      return () => {
        window.removeEventListener('resize', updateIconVisibility);
      };
    }, [iconMaxShowWidth]);

    let additionalPaddingClass = ""
    if (showIcon && icon) {
      additionalPaddingClass = iconPosition === "start" ? "pl-10" : "pr-10"
    }
    if (showIcon && type === "password" && showIconPwd) {
      if (iconPosition === "start") {
        additionalPaddingClass = "pl-10"
      } else {
        additionalPaddingClass = "pr-10"
      }
    }

    const passwordIconPositionClass =
      iconPosition === "end" ? "right-3" : "left-3"

    return (
      <div className="relative">
        {type !== "password" && showIcon && (
          <>
            {iconPosition === "start" && IconComponent && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <IconComponent />
              </div>
            )}

            {iconPosition === "end" && IconComponent && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                <IconComponent />
              </div>
            )}
          </>
        )}

        <input
          type={inputType}
          className={cn(
            "flex h-9 w-full !max-w-none rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
            additionalPaddingClass
          )}
          ref={ref}
          {...props}
        />

        {type === "password" && showIconPwd && showIcon && (
          <button
            type="button"
            className={`absolute ${passwordIconPositionClass} top-1/2 -translate-y-1/2`}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <Eye className="h-4 w-4 text-gray-500" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-500" />
            )}
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
