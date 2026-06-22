"use client"

import { use, type SVGProps } from "react"

// [FORCE-UI] Renders inlined Material Symbols (rounded) from the generated
// string-keyed record (svg-400 basenames include reserved words like "delete").
const iconsPromise = import("./__materialSymbols__")

export function IconMaterialSymbols({
  name,
  ...props
}: { name: string } & SVGProps<SVGSVGElement>) {
  const { icons } = use(iconsPromise)
  const Icon = icons[name]
  return Icon ? <Icon {...props} /> : null
}
