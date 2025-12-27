"use client"

import * as React from "react"
import { Check, Pencil, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"

interface InlineEditProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onSave?: (value: string) => void
  onCancel?: () => void
  showControls?: boolean
  disabled?: boolean
  renderInput?: (props: any) => React.ReactNode
  submitOnEnter?: boolean
}

const InlineEdit = React.forwardRef<HTMLDivElement, InlineEditProps>(
  (
    {
      className,
      defaultValue = "",
      value: controlledValue,
      onSave,
      onCancel,
      showControls = true,
      submitOnEnter = true,
      disabled = false,
      children,
      renderInput,
      ...props
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = React.useState(false)
    const [value, setValue] = React.useState(defaultValue)
    const [tempValue, setTempValue] = React.useState(defaultValue)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const isControlled = controlledValue !== undefined
    const currentValue = isControlled ? controlledValue : value

    React.useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus()
      }
    }, [isEditing])

    const handleEdit = () => {
      if (disabled) return
      setTempValue(currentValue)
      setIsEditing(true)
    }

    const handleSave = () => {
      if (!isControlled) {
        setValue(tempValue)
      }
      onSave?.(tempValue)
      setIsEditing(false)
    }

    const handleCancel = () => {
      setTempValue(currentValue)
      setIsEditing(false)
      onCancel?.()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        handleSave()
        return
      }
      if (e.key === "Enter" && submitOnEnter) {
        e.preventDefault()
        handleSave()
      } else if (e.key === "Escape") {
        handleCancel()
      }
    }

    if (isEditing) {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          {renderInput ? (
            renderInput({
              value: tempValue,
              onChange: (e: any) => setTempValue(e.target.value),
              onKeyDown: handleKeyDown,
              autoFocus: true,
            })
          ) : (
            <Input
              ref={inputRef}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
            />
          )}
          {showControls && (
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSave}
                className="h-8 w-8"
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Save</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancel}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cancel</span>
              </Button>
            </div>
          )}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "group hover:bg-muted/50 flex cursor-pointer items-center gap-2 rounded-md border border-transparent px-3 py-1",
          className
        )}
        onClick={handleEdit}
        {...props}
      >
        <span className="flex-1 truncate">
          {currentValue || (
            <span className="text-muted-foreground italic">
              Click to edit...
            </span>
          )}
        </span>
        {!disabled && (
          <Pencil className="text-muted-foreground h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>
    )
  }
)
InlineEdit.displayName = "InlineEdit"

export { InlineEdit }
