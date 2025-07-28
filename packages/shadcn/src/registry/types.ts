// Registry configuration type
export type RegistryConfig =
  | string
  | {
      url: string
      params?: Record<string, string>
      headers?: Record<string, string>
    }

// Parsed registry component
export interface ParsedRegistryComponent {
  registry: string | null
  component: string
}

// Resolved registry component with URL and headers
export interface ResolvedRegistryComponent {
  url: string
  headers: Record<string, string>
}
