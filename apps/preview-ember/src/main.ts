import "./styles.css"
import { syncTheme, getComponentName, reportOverlays } from "./preview-shell"

async function renderPreview() {
  syncTheme()
  reportOverlays()

  const app = document.getElementById("app")
  if (!app) return

  const componentName = getComponentName()
  if (!componentName) {
    app.innerHTML = "<p>Usage: /preview/ember/{component-name}</p>"
    return
  }

  const { renderComponent, renderSettled } = await import("@ember/renderer")
  const modules = import.meta.glob("./ember/*.gts")
  const modulePath = `./ember/${componentName}.gts`

  if (modules[modulePath]) {
    const mod = (await modules[modulePath]()) as Record<string, unknown>
    const Component = mod.default as Parameters<typeof renderComponent>[0]
    renderComponent(Component, { into: app, owner: {} })
    await renderSettled()
  } else {
    app.innerHTML = `<p>Ember component "${componentName}" not found.</p>`
  }
}

renderPreview()
