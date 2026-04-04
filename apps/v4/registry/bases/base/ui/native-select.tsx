"use client"

import * as React from "react"

import { cn } from "@/registry/bases/base/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// CSS variables and modern color functions (oklch, color-mix, etc.) are not
// resolved by the browser for native <option> / <optgroup> elements because
// they are rendered by the OS widget layer, outside the CSS cascade.
// This context carries the *computed* (already-resolved) background and text
// color from the parent <select> element – where CSS variables do work – and
// passes them as plain inline styles to every <option> and <optgroup> child.
const NativeSelectContext = React.createContext<React.CSSProperties>({})

function useResolvedOptionStyle(
  selectRef: React.RefObject<HTMLSelectElement | null>
): React.CSSProperties {
  const [style, setStyle] = React.useState<React.CSSProperties>({})

  React.useEffect(() => {
    const el = selectRef.current
    if (!el) return

    const update = () => {
      const computed = getComputedStyle(el)
      const bg = computed.backgroundColor
      const color = computed.color
      // Only forward the color when the browser resolved it to a real (non-transparent) value.
      // In light mode with bg-transparent the <select> computes to rgba(0,0,0,0) which means
      // the OS default (white) is already correct – no override needed.
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
        setStyle({ backgroundColor: bg, color })
      } else {
        setStyle({})
      }
    }

    update()

    // Re-evaluate whenever the page theme changes (dark class, data-theme, etc.)
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    })

    return () => observer.disconnect()
  }, [selectRef])

  return style
}

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  children,
  size = "default",
  ...props
}: NativeSelectProps) {
  const selectRef = React.useRef<HTMLSelectElement>(null)
  const optionStyle = useResolvedOptionStyle(selectRef)

  return (
    <NativeSelectContext.Provider value={optionStyle}>
      <div
        className={cn(
          "cn-native-select-wrapper group/native-select relative w-fit has-[select:disabled]:opacity-50",
          className
        )}
        data-slot="native-select-wrapper"
        data-size={size}
      >
        <select
          ref={selectRef}
          data-slot="native-select"
          data-size={size}
          className="cn-native-select outline-none disabled:pointer-events-none disabled:cursor-not-allowed"
          {...props}
        >
          {children}
        </select>
        <IconPlaceholder
          lucide="ChevronDownIcon"
          tabler="IconSelector"
          hugeicons="UnfoldMoreIcon"
          phosphor="CaretDownIcon"
          remixicon="RiArrowDownSLine"
          className="cn-native-select-icon pointer-events-none absolute select-none"
          aria-hidden="true"
          data-slot="native-select-icon"
        />
      </div>
    </NativeSelectContext.Provider>
  )
}

function NativeSelectOption({
  style,
  ...props
}: React.ComponentProps<"option">) {
  const optionStyle = React.useContext(NativeSelectContext)
  return (
    <option
      data-slot="native-select-option"
      style={{ ...optionStyle, ...style }}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  style,
  ...props
}: React.ComponentProps<"optgroup">) {
  const optionStyle = React.useContext(NativeSelectContext)
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn(className)}
      style={{ ...optionStyle, ...style }}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
