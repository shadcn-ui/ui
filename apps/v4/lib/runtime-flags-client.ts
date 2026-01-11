// Client-safe access to the production mode flag. Mirrors server logic and fails closed.
const rawFlag = (() => {
  try {
    const value = process.env.NEXT_PUBLIC_OCEAN_PRODUCTION_MODE ?? process.env.OCEAN_PRODUCTION_MODE
    if (value === undefined || value === null) return 'true'
    return value.toString().trim().toLowerCase()
  } catch (_err) {
    return 'true'
  }
})()

export const OCEAN_PRODUCTION_MODE = rawFlag === 'true' || rawFlag === '1' || rawFlag === 'yes'
export const OCEAN_PRODUCTION_BANNER = 'OCEAN ERP RUNNING IN PRODUCTION MODE'

export function isProductionMode() {
  return OCEAN_PRODUCTION_MODE
}
