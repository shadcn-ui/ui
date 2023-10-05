import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { Icon, IconType } from "./icon"
import { colors } from "./helper/types"
import { useState } from "react"

const inputVariants = cva(
  "block border-0  shadow-sm ring-inset focus:outline-none ",

  {
    variants: {
      variant: {
        destructive: " border border-destructive  text-destructive placeholder:text-destructive/50 ",
        default: "border bg-background",
      },
      inputSize: {
        default: "w-full py-1.5 px-3 text-sm leading-6 "
      },
      round: {
        default: "rounded-md ",
        roundedPill: "rounded-full px-4",
        button: "rounded-none rounded-l-md ",
        roundForButton: "rounded-l-lg"

      },
      labelAndBorderStyle: {
        innerBorder: "min-w-0 flex-1 rounded-none rounded-r-md border-l-0 ",
        iconWithLabel: "pl-10 ",
        leadingDropdown: "pl-[5rem] ",
        labelInside: "pt-10",
      }
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      round: "default"
    },

  }
)

const inputGroupLabelVariant = cva(
  "block font-medium leading-6 ",
  {
    variants: {
      size: {
        xs: "text-xs",
        default: "text-sm ",
        m: "text-base",
        lg: "text-lg",
        xl: "text-xl"

      },
    },
    defaultVariants: {
      size: "default"
    }
  }
)

const keyboardVariant = cva(
  "inline-flex items-center border  px-1 font-sans ",
  {
    variants: {
      keyboardvariant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground",
      },
      size: {
        default: "text-xs",
        sm: "text-sm ",
        m: "text-base",
        lg: "text-lg",
        xl: "text-xl"
      },
      round: {
        default: "rounded"
      }
    },
    defaultVariants: {
      keyboardvariant: "outline",
      round: "default",
      size: "default"
    }
  }
)
const InputGroupButtonVariant = cva(
  "relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md p-2 font-semibold",
  {
    variants: {
      buttonvariant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground",

      },
      fontSize: {
        default: "text-sm"
      }
    },
    defaultVariants: {
      buttonvariant: "outline",
      fontSize: "default"
    }
  }
)

type InputProps = {
  asChild?: boolean | undefined;
  note?: string | undefined;
  hint?: string | undefined;
  bottomBorder?: boolean | undefined;
  label?: string | undefined;
  trailingAddOn?: boolean | undefined;
  options?: string[] | undefined;
  borderInside?: string | undefined;
  addOnLabel?: string | undefined;
  buttonLabel?: string | undefined;
  icon?: IconType | undefined;
  iconStyle?: string | undefined;
  keyboardName?: string | undefined;
  alignDropdown?: "prefix" | "suffix";
  labelAlign?: "left" | "over" | "inside";
  alignIcon?: "left" | "right";
  textColor?: colors;
  error?: string | undefined;
}

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> &
  InputProps>(({ className, name,error, keyboardName, alignIcon, iconStyle, icon, borderInside, textColor, labelAlign, buttonLabel, trailingAddOn, options, variant, placeholder, label, labelAndBorderStyle, alignDropdown, addOnLabel, hint, bottomBorder, disabled, round, note, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "input"
    const fontColor = (textColor?: colors) => {
      return `text-${textColor}-500`
    }
    const [inputValue, setInputValue] = useState('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };
    return (
      <div className="relative">
        {
          (labelAlign === "over" || labelAlign === "left") && (<label className={cn("flex items-end justify-between", (inputGroupLabelVariant({}), className))}>{label}
            {hint && (<span className={cn(fontColor(textColor), className)}>{hint}</span>)}
          </label>
          )
        }
        <div className={cn("relative mt-2 flex items-center rounded-md shadow-sm", className)}>

          {(borderInside === "withBorder") ?
            <div className={cn("flex max-w-md rounded-l-md shadow-sm", className)}>
              <span className={cn("flex select-none items-center rounded-l-md border py-2 pl-3 pr-1 text-sm ", (fontColor(textColor)), className)}{...props}>{addOnLabel}</span> </div>
            : (borderInside === "withoutBorder") ?
              <span className={cn("inline-flex  items-center rounded-l-md border  border-r-0 px-3 py-2 text-sm", className)}{...props}>
                {addOnLabel}</span> : null
          }
          {icon ? <Icon name={icon} className={cn(`${alignIcon === "left" ? "absolute left-0 flex items-center pl-3" : ` absolute right-0 flex items-center pl-3 pr-2 ${error ? "text-destructive":fontColor(textColor)}`} ${iconStyle}`, className)} {...props} /> : null}
          {
            alignDropdown && (
              <div className={cn(`absolute text-sm ${alignDropdown === 'prefix' ? 'left-0' : 'right-0 '} flex items-center`, className)} {...props}>
                <select className={cn(`${alignDropdown === 'prefix' ? 'pl-2 ' : 'pr-1'} bg-inherit`, fontColor(textColor), className)}>
                  {options && options.map((option: string, index: number) => (
                    <option key={index}>{option}</option>
                  ))}
                </select>
              </div>
            )
          }
          {labelAlign === "inside" ? (
            <label className={cn("pointer-events-none absolute left-2 top-2 pl-1.5 text-sm", fontColor(textColor), className)} >
              {label}
            </label>
          ) : null}
          <Comp
            className={cn( `${error ? "border-destructive text-destructive placeholder:text-destructive/50 ":null}`,inputVariants({ round, labelAndBorderStyle, variant, }), className)}
            placeholder={placeholder}
            disabled={disabled}
            name={name}
            value={inputValue}  
            onChange={handleChange}
            ref={ref}
            {...props}
          />
          {
            buttonLabel && (
              <button type="button" className={cn(InputGroupButtonVariant({}))}>
                {icon && <Icon name="arrow-up-wide-short-regular" className={cn(`${iconStyle}`, fontColor(textColor), className)} {...props} />}
                {buttonLabel}
              </button>
            )
          }
          {trailingAddOn && (
            <div className={cn("pointer-events-none flex items-center", className)}>
              <div className={cn("-ml-8 flex items-center justify-center", className)}>
                <span className={cn("text-sm", fontColor(textColor), className)}>{addOnLabel}</span>
              </div>
            </div>
          )}
          {keyboardName && (
            <div className={cn("absolute inset-y-0 right-0 flex items-center py-1.5 pr-1.5 ", className)}>
              <kbd className={cn("inline-flex items-center py-0.5", keyboardVariant({}), className)} {...props}>{keyboardName}</kbd>
            </div>
          )}
        </div>
        {error && <span className={cn(`${error ? "text-destructive":null} text-sm`, className)} {...props}>{error}</span>}

        {bottomBorder ? <div className={cn("absolute inset-x-0 bottom-0 border peer-focus:border peer-focus:border-t-2", className)} {...props} /> : ""}

        {note && <span className={cn("text-sm", fontColor(textColor), className)} {...props}>{note}</span>}

      </div>
    )
  })
Input.displayName = "Input"

export { Input, inputVariants }
