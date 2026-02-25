import "../../../../../apps/v4/styles/globals.css"

import * as React from "react"
import { createRoot } from "react-dom/client"

type Impl = "tsx" | "rescript"
type AnyModule = Record<string, unknown>

type ModuleLoader = () => Promise<AnyModule>

const tsxModules: Record<string, ModuleLoader> = {
  ...(import.meta.glob("../../../../../apps/v4/examples/base/*.tsx") as Record<
    string,
    ModuleLoader
  >),
  ...(import.meta.glob("../../../../../apps/v4/examples/base/ui/*.tsx") as Record<
    string,
    ModuleLoader
  >),
}

const rescriptModules: Record<string, ModuleLoader> = {
  ...(import.meta.glob(
    "../../../../../packages/shadcn/rescript/examples/*.res.mjs"
  ) as Record<string, ModuleLoader>),
  ...(import.meta.glob("../../../../../packages/shadcn/rescript/ui/*.res.mjs") as Record<
    string,
    ModuleLoader
  >),
}

function toPascalCase(value: string) {
  return value
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join("")
}

function getImpl(value: string | null): Impl {
  return value === "rescript" ? "rescript" : "tsx"
}

function findModuleLoader(modules: Record<string, ModuleLoader>, fileName: string) {
  for (const [key, loader] of Object.entries(modules)) {
    if (key.endsWith(`/${fileName}`)) {
      return loader
    }
  }

  return null
}

function getTsxModuleLoader(component: string) {
  const fileName = component.startsWith("ui/")
    ? `${component.replace(/^ui\//, "")}.tsx`
    : `${component}.tsx`
  return findModuleLoader(tsxModules, fileName)
}

function getRescriptModuleLoader(component: string) {
  const moduleName = component.startsWith("ui/")
    ? toPascalCase(component.replace(/^ui\//, ""))
    : toPascalCase(component)
  return findModuleLoader(rescriptModules, `${moduleName}.res.mjs`)
}

function getExpectedRescriptPath(component: string) {
  if (component.startsWith("ui/")) {
    return `packages/shadcn/rescript/ui/${toPascalCase(component.replace(/^ui\//, ""))}.res`
  }

  return `packages/shadcn/rescript/examples/${toPascalCase(component)}.res`
}

function resolveTsxModule(moduleValue: AnyModule, id: string): React.ComponentType | null {
  if (typeof moduleValue.default === "function") {
    return moduleValue.default as React.ComponentType
  }

  const demoExportKey = Object.keys(moduleValue).find(
    (key) => key.endsWith("Demo") && typeof moduleValue[key] === "function"
  )

  if (demoExportKey) {
    return moduleValue[demoExportKey] as React.ComponentType
  }

  const firstFunctionExport = Object.keys(moduleValue).find(
    (key) => typeof moduleValue[key] === "function"
  )

  if (firstFunctionExport) {
    return moduleValue[firstFunctionExport] as React.ComponentType
  }

  console.error("TSX component resolution failed for", id)
  return null
}

function resolveRescriptModule(moduleValue: AnyModule | undefined): React.ComponentType | null {
  if (moduleValue && typeof moduleValue.make === "function") {
    return moduleValue.make as React.ComponentType
  }

  return null
}

type LoadedState = {
  status: "loading" | "ready"
  errorMessage: string | null
  expectedRescriptPath: string | null
  tsxComponent: React.ComponentType | null
  rescriptComponent: React.ComponentType | null
}

function loadingState(): LoadedState {
  return {
    status: "loading",
    errorMessage: null,
    expectedRescriptPath: null,
    tsxComponent: null,
    rescriptComponent: null,
  }
}

function App() {
  const searchParams = React.useMemo(() => new URLSearchParams(window.location.search), [])
  const component = searchParams.get("component") ?? "button-demo"
  const impl = getImpl(searchParams.get("impl"))

  const [state, setState] = React.useState<LoadedState>(() => loadingState())

  React.useEffect(() => {
    let cancelled = false

    const setReady = (value: "0" | "1") => {
      document.documentElement.setAttribute("data-parity-ready", value)
    }

    const fail = (message: string, expectedRescriptPath: string | null) => {
      if (cancelled) {
        return
      }

      setState({
        status: "ready",
        errorMessage: message,
        expectedRescriptPath,
        tsxComponent: null,
        rescriptComponent: null,
      })
    }

    const load = async () => {
      setReady("0")
      setState(loadingState())

      const tsxLoader = getTsxModuleLoader(component)

      if (!tsxLoader) {
        fail(`Unknown component: ${component}`, null)
        setReady("1")
        return
      }

      let tsxModule: AnyModule
      try {
        tsxModule = await tsxLoader()
      } catch (error) {
        fail(
          `Failed to load TSX component module: ${error instanceof Error ? error.message : String(error)}`,
          null
        )
        setReady("1")
        return
      }

      const tsxComponent = resolveTsxModule(tsxModule, component)
      if (!tsxComponent) {
        fail(`Failed to resolve TSX component: ${component}`, null)
        setReady("1")
        return
      }

      const expectedRescriptPath = getExpectedRescriptPath(component)
      let rescriptComponent: React.ComponentType | null = null

      if (impl === "rescript") {
        const rescriptLoader = getRescriptModuleLoader(component)

        if (!rescriptLoader) {
          fail(`Missing ReScript equivalent for: ${component}`, expectedRescriptPath)
          setReady("1")
          return
        }

        try {
          const rescriptModule = await rescriptLoader()
          rescriptComponent = resolveRescriptModule(rescriptModule)
        } catch (error) {
          fail(
            `Failed to load ReScript component module: ${error instanceof Error ? error.message : String(error)}`,
            expectedRescriptPath
          )
          setReady("1")
          return
        }

        if (!rescriptComponent) {
          fail(`Failed to resolve ReScript component: ${component}`, expectedRescriptPath)
          setReady("1")
          return
        }
      }

      if (!cancelled) {
        setState({
          status: "ready",
          errorMessage: null,
          expectedRescriptPath,
          tsxComponent,
          rescriptComponent,
        })
      }

      setReady("1")
    }

    void load()

    return () => {
      cancelled = true
      setReady("0")
    }
  }, [component, impl])

  React.useEffect(() => {
    try {
      localStorage.setItem("theme", "light")
      document.documentElement.classList.remove("dark")
    } catch {
      // noop
    }
  }, [])

  if (state.status === "loading") {
    return (
      <main className="min-h-screen bg-background p-8 text-foreground">
        <div className="rounded-lg border bg-card p-4 text-sm">Loading parity component...</div>
      </main>
    )
  }

  if (state.errorMessage) {
    return (
      <main className="min-h-screen bg-background p-8 text-foreground">
        <div id="pixel-error" className="rounded-lg border bg-card p-4 text-sm">
          <div>{state.errorMessage}</div>
          {state.expectedRescriptPath ? (
            <div className="mt-3">
              Expected module: <code>{state.expectedRescriptPath}</code>
            </div>
          ) : null}
        </div>
      </main>
    )
  }

  const ResolvedComponent =
    impl === "tsx" ? state.tsxComponent : (state.rescriptComponent as React.ComponentType)

  if (!ResolvedComponent) {
    return (
      <main className="min-h-screen bg-background p-8 text-foreground">
        <div id="pixel-error" className="rounded-lg border bg-card p-4 text-sm">
          Unable to resolve component implementation for <code>{component}</code>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div id="pixel-metadata" data-component={component} data-impl={impl} />
      <div
        id="pixel-capture-root"
        className="mx-auto flex min-h-[740px] max-w-6xl items-start justify-center rounded-xl border bg-card p-10"
      >
        {React.createElement(ResolvedComponent)}
      </div>
    </main>
  )
}

document.documentElement.setAttribute("data-parity-ready", "0")

const rootElement = document.querySelector("#root")

if (!rootElement) {
  throw new Error("Missing #root")
}

createRoot(rootElement).render(<App />)
