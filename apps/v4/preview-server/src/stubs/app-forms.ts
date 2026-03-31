// Stub for $app/forms (SvelteKit module) in non-SvelteKit environments
export function applyAction() {}

export function deserialize(result: string) {
  return JSON.parse(result)
}

export function enhance(form: HTMLFormElement) {
  return { destroy() {} }
}
