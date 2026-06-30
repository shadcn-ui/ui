// Stub for $app/stores (SvelteKit module) in non-SvelteKit environments
// Uses plain JS equivalents instead of svelte/store

type Subscriber<T> = (value: T) => void
type Unsubscriber = () => void

function readable<T>(value: T): { subscribe: (fn: Subscriber<T>) => Unsubscriber } {
  return {
    subscribe(fn) {
      fn(value)
      return () => {}
    },
  }
}

function writable<T>(value: T): {
  subscribe: (fn: Subscriber<T>) => Unsubscriber
  set: (v: T) => void
} {
  let current = value
  const subscribers = new Set<Subscriber<T>>()
  return {
    subscribe(fn) {
      subscribers.add(fn)
      fn(current)
      return () => subscribers.delete(fn)
    },
    set(v) {
      current = v
      subscribers.forEach((fn) => fn(current))
    },
  }
}

export const page = readable({
  url: new URL(window.location.href),
  params: {},
  status: 200,
  error: null,
  data: {},
})

export const navigating = readable(null)
export const updated = { check: async () => false, subscribe: writable(false).subscribe }
