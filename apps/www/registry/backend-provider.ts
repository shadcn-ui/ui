export const backendProviders = [
  {
    name: "next-auth",
    label: "Next Auth",
  },
  {
    name: "supabase",
    label: "Supabase",
  },
  {
    name: "auth0",
    label: "auth0",
  },
] as const

export type BackendProvider = (typeof backendProviders)[number]
