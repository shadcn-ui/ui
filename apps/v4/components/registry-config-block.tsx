import { getAppUrl } from "@/lib/utils"

export function RegistryConfigBlock() {
  const appUrl = getAppUrl()

  const config = JSON.stringify(
    {
      style: "radix-force-ui",
      registries: {
        "@force-ui": `${appUrl}/r/styles/{style}/{name}.json`,
        "@force-ui-vue": `${appUrl}/r/styles/vue-{style}/{name}.json`,
        "@force-ui-svelte": `${appUrl}/r/styles/svelte-{style}/{name}.json`,
        "@force-ui-ember": `${appUrl}/r/styles/ember-{style}/{name}.json`,
      },
    },
    null,
    2
  )

  return (
    <div className="relative mt-6 rounded-xl border bg-code text-code-foreground">
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <span className="text-sm text-code-foreground opacity-70">
          components.json
        </span>
      </div>
      <pre className="no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5">
        <code>{config}</code>
      </pre>
    </div>
  )
}
