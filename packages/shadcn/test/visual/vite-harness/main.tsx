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

  if (id.startsWith("ui/")) {
    if (id === "ui/resizable" && typeof moduleValue.ResizablePanelGroup === "function") {
      return moduleValue.ResizablePanelGroup as React.ComponentType
    }

    const moduleName = toPascalCase(id.replace(/^ui\//, ""))
    const exactMatch = moduleValue[moduleName]
    if (typeof exactMatch === "function") {
      return exactMatch as React.ComponentType
    }

    const startsWithMatch = Object.keys(moduleValue).find(
      (key) => key.startsWith(moduleName) && typeof moduleValue[key] === "function"
    )
    if (startsWithMatch) {
      return moduleValue[startsWithMatch] as React.ComponentType
    }
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

function resolveModuleComponent(moduleValue: AnyModule | null, key: string) {
  if (!moduleValue) {
    return null
  }

  const value = moduleValue[key]
  if (typeof value === "function") {
    return value as React.ComponentType
  }

  if (value && typeof value === "object" && typeof (value as AnyModule).make === "function") {
    return (value as AnyModule).make as React.ComponentType
  }

  return null
}

type ScenarioResult = {
  node: React.ReactNode | null
  error: string | null
}

function renderSpecialScenario(
  component: string,
  impl: Impl,
  state: LoadedState
): ScenarioResult | null {
  if (component !== "ui/chart" && component !== "ui/sidebar") {
    return null
  }

  if (component === "ui/chart") {
    const chartConfig = {
      series: {
        label: "Series",
        color: "hsl(var(--primary))",
      },
    }

    if (impl === "tsx") {
      const ChartContainer = resolveModuleComponent(state.tsxModule, "ChartContainer")
      if (!ChartContainer) {
        return { node: null, error: "Unable to resolve TSX chart scenario components" }
      }
      return {
        node: React.createElement(
          ChartContainer,
          { config: chartConfig, className: "h-[220px] w-[320px]" } as Record<string, unknown>,
          React.createElement("div", { className: "h-full w-full" })
        ),
        error: null,
      }
    }

    const Chart = state.rescriptModule && typeof state.rescriptModule.make === "function"
      ? (state.rescriptModule.make as React.ComponentType)
      : null
    if (!Chart) {
      return { node: null, error: "Unable to resolve ReScript chart scenario components" }
    }

    return {
      node: React.createElement(
        Chart,
        {
          config: chartConfig,
          className: "h-[220px] w-[320px]",
        },
        React.createElement("div", { className: "h-full w-full" })
      ),
      error: null,
    }
  }

  if (impl === "tsx") {
    const SidebarProvider = resolveModuleComponent(state.tsxModule, "SidebarProvider")
    const Sidebar = resolveModuleComponent(state.tsxModule, "Sidebar")
    const SidebarContent = resolveModuleComponent(state.tsxModule, "SidebarContent")
    if (!SidebarProvider || !Sidebar || !SidebarContent) {
      return { node: null, error: "Unable to resolve TSX sidebar scenario components" }
    }

    return {
      node: React.createElement(
        SidebarProvider,
        null,
        React.createElement(
          Sidebar,
          null,
          React.createElement(
            SidebarContent,
            null,
            React.createElement("div", { className: "h-24 w-24" })
          )
        )
      ),
      error: null,
    }
  }

  const SidebarProvider = resolveModuleComponent(state.rescriptModule, "Provider")
  const Sidebar =
    state.rescriptModule && typeof state.rescriptModule.make === "function"
      ? (state.rescriptModule.make as React.ComponentType)
      : null
  const SidebarContent = resolveModuleComponent(state.rescriptModule, "Content")

  if (!SidebarProvider || !Sidebar || !SidebarContent) {
    return { node: null, error: "Unable to resolve ReScript sidebar scenario components" }
  }

  return {
    node: React.createElement(
      SidebarProvider,
      null,
      React.createElement(
        Sidebar,
        { dataVariant: "sidebar" },
        React.createElement(
          SidebarContent,
          null,
          React.createElement("div", { className: "h-24 w-24" })
        )
      )
    ),
    error: null,
  }
}

type LoadedState = {
  status: "loading" | "ready"
  errorMessage: string | null
  expectedRescriptPath: string | null
  tsxComponent: React.ComponentType | null
  rescriptComponent: React.ComponentType | null
  tsxModule: AnyModule | null
  rescriptModule: AnyModule | null
}

function loadingState(): LoadedState {
  return {
    status: "loading",
    errorMessage: null,
    expectedRescriptPath: null,
    tsxComponent: null,
    rescriptComponent: null,
    tsxModule: null,
    rescriptModule: null,
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
        tsxModule: null,
        rescriptModule: null,
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
      let rescriptModule: AnyModule | null = null

      if (impl === "rescript") {
        const rescriptLoader = getRescriptModuleLoader(component)

        if (!rescriptLoader) {
          fail(`Missing ReScript equivalent for: ${component}`, expectedRescriptPath)
          setReady("1")
          return
        }

        try {
          rescriptModule = await rescriptLoader()
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
          tsxModule,
          rescriptModule,
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
  const specialScenario = renderSpecialScenario(component, impl, state)

  if (specialScenario?.error) {
    return (
      <main className="min-h-screen bg-background p-8 text-foreground">
        <div id="pixel-error" className="rounded-lg border bg-card p-4 text-sm">
          {specialScenario.error}
        </div>
      </main>
    )
  }

  if (!ResolvedComponent && !specialScenario) {
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
        {specialScenario ? specialScenario.node : React.createElement(ResolvedComponent)}
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
