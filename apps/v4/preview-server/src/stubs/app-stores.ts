// Stub for $app/stores (SvelteKit module) in non-SvelteKit environments
import { writable, readable } from "svelte/store"

export const page = readable({
  url: new URL(window.location.href),
  params: {},
  status: 200,
  error: null,
  data: {},
})

export const navigating = readable(null)
export const updated = { check: async () => false, subscribe: writable(false).subscribe }
