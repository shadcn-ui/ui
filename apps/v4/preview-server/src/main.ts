import "./styles.css"

function syncTheme() {
  // Try to read theme from parent document (same-origin) or URL param
  const params = new URLSearchParams(window.location.search)
  const themeParam = params.get("theme")

  if (themeParam === "dark") {
    document.documentElement.classList.add("dark")
    return
  }
  if (themeParam === "light") {
    document.documentElement.classList.remove("dark")
    return
  }

  // Default: match system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark")
  }

  // Listen for system changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      document.documentElement.classList.toggle("dark", e.matches)
    })

  // Listen for theme messages from parent
  window.addEventListener("message", (e) => {
    if (e.data?.type === "theme-change") {
      document.documentElement.classList.toggle("dark", e.data.theme === "dark")
    }
  })
}

const base = import.meta.env.BASE_URL ?? "/"
const path = window.location.pathname.replace(
  new RegExp(`^${base.replace(/\/$/, "")}`),
  ""
)

async function renderPreview() {
  syncTheme()

  const app = document.getElementById("app")
  if (!app) return

  const segments = path.split("/").filter(Boolean)
  const framework = segments[0]
  const componentName = segments[1]

  if (!framework || !componentName) {
    app.innerHTML = "<p>Usage: /{framework}/{component-name}</p>"
    return
  }

  if (framework === "vue") {
    const { createApp } = await import("vue")
    const flatModules = import.meta.glob("./vue/*.vue")
    const dirModules = import.meta.glob("./vue/**/*.vue")
    const modules = { ...flatModules, ...dirModules }
    const modulePath = `./vue/${componentName}.vue`

    if (modules[modulePath]) {
      const mod = (await modules[modulePath]()) as { default: unknown }
      createApp(mod.default as Parameters<typeof createApp>[0]).mount(app)
    } else {
      app.innerHTML = `<p>Vue component "${componentName}" not found.</p>`
    }
  } else if (framework === "svelte") {
    const { mount } = await import("svelte")
    const modules = import.meta.glob("./svelte/*.svelte")
    const modulePath = `./svelte/${componentName}.svelte`

    if (modules[modulePath]) {
      const mod = (await modules[modulePath]()) as {
        default: Parameters<typeof mount>[0]
      }
      mount(mod.default, { target: app })
    } else {
      app.innerHTML = `<p>Svelte component "${componentName}" not found.</p>`
    }
  } else if (framework === "ember") {
    const { renderComponent, renderSettled } = await import("@ember/renderer")
    const modules = import.meta.glob("./ember/*.gts")
    const modulePath = `./ember/${componentName}.gts`

    if (modules[modulePath]) {
      const mod = (await modules[modulePath]()) as Record<string, unknown>
      // The default export is the component class
      const Component = mod.default as Parameters<typeof renderComponent>[0]
      renderComponent(Component, { into: app, owner: {} })
      await renderSettled()
    } else {
      app.innerHTML = `<p>Ember component "${componentName}" not found.</p>`
    }
  } else {
    app.innerHTML = `<p>Unknown framework "${framework}". Supported: vue, svelte, ember</p>`
  }
}

renderPreview()
