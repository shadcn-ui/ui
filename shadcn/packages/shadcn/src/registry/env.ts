export function expandEnvVars(value: string) {
  return value.replace(/\${(\w+)}/g, (_match, key) => process.env[key] || "")
}

export function extractEnvVars(value: string) {
  const vars: string[] = []
  const regex = /\${(\w+)}/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(value)) !== null) {
    vars.push(match[1])
  }

  return vars
}
