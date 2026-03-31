// Stub for $app/state (SvelteKit module) in non-SvelteKit environments
export const page = {
  url: new URL(window.location.href),
  params: {},
  status: 200,
  error: null,
  data: {},
}
