import directory from "@/registry/directory.json"

type ForceUiRootId = "legacy" | "react" | "vue" | "svelte" | "ember"

type RegistriesPayloadEntry = {
  name: string
  homepage: string
  url: string
  description: string
}

const FORCE_UI_REGISTRY_ROOTS: Record<ForceUiRootId, { path: string; namespaces: string[] }> = {
  legacy: {
    path: "/r",
    namespaces: ["@force-ui", "@force-ui-vue", "@force-ui-svelte", "@force-ui-ember"],
  },
  react: {
    path: "/r-react",
    namespaces: ["@force-ui"],
  },
  vue: {
    path: "/r-vue",
    namespaces: ["@force-ui-vue"],
  },
  svelte: {
    path: "/r-svelte",
    namespaces: ["@force-ui-svelte"],
  },
  ember: {
    path: "/r-ember",
    namespaces: ["@force-ui-ember"],
  },
}

function buildDirectoryRegistries(): RegistriesPayloadEntry[] {
  return directory.map(({ name, homepage, url, description }) => ({
    name,
    homepage,
    url,
    description,
  }))
}

function buildForceUiRegistries(
  origin: string,
  rootId: ForceUiRootId
): RegistriesPayloadEntry[] {
  const root = FORCE_UI_REGISTRY_ROOTS[rootId]

  return root.namespaces.map((namespace) => ({
    name: namespace,
    homepage: origin,
    url: `${origin}${root.path}/styles/{style}/{name}.json`,
    description: "Official Force UI registry.",
  }))
}

export function buildRegistriesPayload(
  origin: string,
  rootId: ForceUiRootId
): RegistriesPayloadEntry[] {
  return [...buildForceUiRegistries(origin, rootId), ...buildDirectoryRegistries()]
}
