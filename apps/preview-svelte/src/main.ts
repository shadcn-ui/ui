import "./styles.css"
import { syncTheme, getComponentName, reportOverlays } from "./preview-shell"
import { mount } from "svelte"

async function renderPreview() {
  syncTheme()
  reportOverlays()

  const app = document.getElementById("app")
  if (!app) return

  const componentName = getComponentName()
  if (!componentName) {
    app.innerHTML = "<p>Usage: /preview/svelte/{component-name}</p>"
    return
  }

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
}

renderPreview()
