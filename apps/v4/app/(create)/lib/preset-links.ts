export function buildPresetArgs(
  presetCode: string,
  options: { base?: string | null } = {}
) {
  const flags = [`--preset ${presetCode}`]

  if (options.base && options.base !== "radix") {
    flags.push(`--base ${options.base}`)
  }

  return flags.join(" ")
}

export function buildCreateShareUrl({
  origin,
  presetCode,
  item,
  base,
}: {
  origin: string
  presetCode: string
  item?: string | null
  base?: string | null
}) {
  const url = new URL("/create", origin)

  url.searchParams.set("preset", presetCode)

  if (item) {
    url.searchParams.set("item", item)
  }

  if (base && base !== "radix") {
    url.searchParams.set("base", base)
  }

  return url.toString()
}
