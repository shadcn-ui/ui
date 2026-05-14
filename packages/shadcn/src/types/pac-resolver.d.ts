// pac-resolver@9 ships its types only via the package.json `exports` map at
// `./dist/index.d.ts`. The repo's `moduleResolution: node` (classic) ignores
// `exports`, so tsc can't find them. This local stub mirrors the v9 surface
// we actually use.
declare module "pac-resolver" {
  import type { QuickJS } from "quickjs-wasi"

  export type FindProxyForURL = (
    url: string | URL,
    host?: string
  ) => Promise<string>

  export interface PacResolverOptions {
    filename?: string
    sandbox?: Record<string, unknown>
  }

  export function createPacResolver(
    qjs: QuickJS,
    script: string | Buffer,
    options?: PacResolverOptions
  ): FindProxyForURL
}
