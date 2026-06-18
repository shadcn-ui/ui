import "./styles.css"
import { syncTheme, getComponentName, reportOverlays } from "./preview-shell"
import { createApp } from "vue"

async function renderPreview() {
  syncTheme()
  reportOverlays()

  const app = document.getElementById("app")
  if (!app) return

  const componentName = getComponentName()
  if (!componentName) {
    app.innerHTML = "<p>Usage: /preview/vue/{component-name}</p>"
    return
  }

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
}

renderPreview()
