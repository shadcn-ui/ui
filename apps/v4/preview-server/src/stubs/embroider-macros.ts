// Stub for @embroider/macros — build-time macros that resolve to no-ops at runtime
export function macroCondition(value: boolean): boolean {
  return value
}
export function isDevelopingApp(): boolean {
  return false
}
export function isTesting(): boolean {
  return false
}
export function importSync(path: string): unknown {
  return {}
}
export function getOwnConfig(): Record<string, unknown> {
  return {}
}
export function dependencySatisfies(packageName: string, semverRange: string): boolean {
  return true
}
export function getGlobalConfig(): Record<string, unknown> {
  return {}
}
export function appEmberSatisfies(semverRange: string): boolean {
  return true
}
