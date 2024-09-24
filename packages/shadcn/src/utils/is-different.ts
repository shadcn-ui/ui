export function isDifferent(newValue: any, defaultValue: any): boolean {
  if (typeof newValue === "object" && newValue !== null) {
    if (typeof defaultValue !== "object" || defaultValue === null) {
      return true
    }
    for (const key in newValue) {
      if (isDifferent(newValue[key], defaultValue[key])) {
        return true
      }
    }
    for (const key in defaultValue) {
      if (!(key in newValue)) {
        return true
      }
    }
    return false
  }
  return newValue !== defaultValue
}

export function getDifferences(newConfig: any, defaultConfig: any): any {
  const differences: any = {}

  for (const key in newConfig) {
    if (isDifferent(newConfig[key], defaultConfig[key])) {
      if (typeof newConfig[key] === "object" && newConfig[key] !== null) {
        differences[key] = getDifferences(
          newConfig[key],
          defaultConfig[key] || {}
        )
        if (Object.keys(differences[key]).length === 0) {
          delete differences[key]
        }
      } else {
        differences[key] = newConfig[key]
      }
    }
  }

  return differences
}
