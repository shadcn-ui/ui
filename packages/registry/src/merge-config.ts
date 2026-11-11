type ConfigRecord = Record<string, unknown>

function isConfigRecord(value: unknown): value is ConfigRecord {
  if (value === null || typeof value !== "object") {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

// Merge configuration data without mutating either input. Later values win,
// and arrays concatenate unless the caller requests replacement.
export function mergeConfig<Base extends object, Override extends object>(
  base: Base,
  override: Override,
  { replaceArrays = false } = {}
): Base & Override {
  return mergeValue(base, override, replaceArrays) as Base & Override
}

function mergeValue(
  base: unknown,
  override: unknown,
  replaceArrays: boolean
): unknown {
  if (Array.isArray(override)) {
    if (replaceArrays) {
      return override
    }

    const values = Array.isArray(base) ? base.concat(override) : override
    return values.map((value) => mergeValue(undefined, value, replaceArrays))
  }

  if (!isConfigRecord(override)) {
    return override
  }

  const target = isConfigRecord(base) ? base : {}
  const entries = new Map<string, unknown>()

  for (const [key, value] of Object.entries(target)) {
    entries.set(key, mergeValue(undefined, value, replaceArrays))
  }

  for (const [key, value] of Object.entries(override)) {
    const hasOwnEntry = Object.prototype.propertyIsEnumerable.call(target, key)
    if (!hasOwnEntry && key in target) {
      continue
    }

    entries.set(
      key,
      mergeValue(hasOwnEntry ? target[key] : undefined, value, replaceArrays)
    )
  }

  return Object.fromEntries(entries)
}
