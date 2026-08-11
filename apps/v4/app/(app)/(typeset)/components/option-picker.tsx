"use client"

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { LockButton } from "@/app/(app)/(typeset)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerRadioGroup,
  PickerRadioItem,
  PickerTrigger,
} from "@/app/(app)/(typeset)/components/picker"
import { usePreviewOverride } from "@/app/(app)/(typeset)/components/preview-override"
import { type LockableParam } from "@/app/(app)/(typeset)/hooks/use-locks"
import { coerceTypesetValue } from "@/app/(app)/(typeset)/lib/search-params"

export function OptionPicker<T extends string>({
  label,
  param,
  icon,
  options,
  value,
  onChange,
  isMobile,
  anchorRef,
  className,
}: {
  label: string
  param?: LockableParam
  icon?: IconSvgElement
  options: readonly { label: string; value: T }[]
  value: T
  onChange: (value: T) => void
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
  className?: string
}) {
  const { setOverride, clearOverride } = usePreviewOverride()
  const current = options.find((option) => option.value === value)

  return (
    <div className={cn("group/picker relative", className)}>
      <Picker
        onOpenChange={(open) => {
          if (!open) {
            clearOverride()
          }
        }}
      >
        <PickerTrigger>
          <div className="flex min-w-0 flex-col justify-start pr-8 text-left">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="line-clamp-1 text-sm font-medium text-foreground">
              {current?.label}
            </div>
          </div>
          {icon ? (
            <div className="pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center text-foreground select-none md:right-2.5">
              <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4.5" />
            </div>
          ) : null}
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
          onMouseLeave={clearOverride}
        >
          <PickerRadioGroup
            value={value}
            onValueChange={(next) => onChange(next as T)}
            onItemPreview={
              isMobile || !param
                ? undefined
                : (next) => {
                    const coerced = coerceTypesetValue(param, next)
                    if (coerced !== null) {
                      setOverride({ [param]: coerced })
                    }
                  }
            }
          >
            {options.map((option) => (
              <PickerRadioItem key={option.value} value={option.value}>
                {option.label}
              </PickerRadioItem>
            ))}
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      {param ? (
        <LockButton
          param={param}
          className="absolute top-1/2 right-8 -translate-y-1/2"
        />
      ) : null}
    </div>
  )
}
