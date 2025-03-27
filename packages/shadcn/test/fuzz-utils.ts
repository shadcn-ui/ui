export const generateRandomString = (length: number): string => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("")
}

export const generateRandomPath = (): string => {
  const segments = Array.from(
    { length: Math.floor(Math.random() * 5) + 1 },
    () => generateRandomString(Math.floor(Math.random() * 10) + 1)
  )
  return segments.join("/")
}
