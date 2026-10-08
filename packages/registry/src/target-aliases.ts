export const TARGET_ALIAS_KEYS = ["components", "ui", "lib", "hooks"] as const

export type TargetAliasKey = (typeof TARGET_ALIAS_KEYS)[number]

export function isTargetAliasKey(key: string): key is TargetAliasKey {
  return TARGET_ALIAS_KEYS.includes(key as TargetAliasKey)
}

export function getTargetAliasKey(target?: string): TargetAliasKey | null {
  const match = target?.match(/^@([^/]+)\//)

  return match && isTargetAliasKey(match[1]) ? match[1] : null
}
