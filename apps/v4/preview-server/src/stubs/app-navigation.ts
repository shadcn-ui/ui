// Stub for $app/navigation (SvelteKit module) in non-SvelteKit environments
export function goto(url: string) {
  window.location.href = url
  return Promise.resolve()
}

export function invalidateAll() {
  return Promise.resolve()
}

export function beforeNavigate() {}
export function afterNavigate() {}
export function onNavigate() {}
