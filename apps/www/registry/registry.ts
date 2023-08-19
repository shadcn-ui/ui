import { Registry } from "@/registry/schema"

const ui: Registry = [
  {
    name: "accordion",
    type: "components:ui",
    dependencies: ["@radix-ui/react-accordion"],
    files: ["ui/accordion.tsx"],
  },

  {
    name: "alert-dialog",
    type: "components:ui",
    dependencies: ["@radix-ui/react-alert-dialog"],
    registryDependencies: ["button"],
    files: ["ui/alert-dialog.tsx"],
  },
  {
    name: "black-hole",
    type: "components:ui",
    files: ["ui/black-hole.tsx"],
  },
  {
    name: "button",
    type: "components:ui",
    dependencies: ["@radix-ui/react-slot"],
    files: ["ui/button.tsx"],
  },
  {
    name: "crypto-card",
    type: "components:ui",
    files: ["ui/crypto-card.tsx"],
  },
  {
    name: "ring",
    type: "components:ui",
    files: ["ui/ring.tsx"],
  },
  {
    name: "toast",
    type: "components:ui",
    dependencies: ["@radix-ui/react-toast"],
    files: ["ui/toast.tsx", "ui/use-toast.ts", "ui/toaster.tsx"],
  },
]

const example: Registry = [
  {
    name: "accordion-demo",
    type: "components:example",
    registryDependencies: ["accordion"],
    files: ["example/accordion-demo.tsx"],
  },

  {
    name: "alert-dialog-demo",
    type: "components:example",
    registryDependencies: ["alert-dialog", "button"],
    files: ["example/alert-dialog-demo.tsx"],
  },

  {
    name: "black-hole-demo",
    type: "components:example",
    registryDependencies: ["black-hole"],
    files: ["example/black-hole-demo.tsx"],
  },
  {
    name: "button-demo",
    type: "components:example",
    registryDependencies: ["button"],
    files: ["example/button-demo.tsx"],
  },
  {
    name: "button-secondary",
    type: "components:example",
    registryDependencies: ["button"],
    files: ["example/button-secondary.tsx"],
  },
  {
    name: "button-destructive",
    type: "components:example",
    registryDependencies: ["button"],
    files: ["example/button-destructive.tsx"],
  },
  {
    name: "button-outline",
    type: "components:example",
    registryDependencies: ["button"],
    files: ["example/button-outline.tsx"],
  },
  {
    name: "button-ghost",
    type: "components:example",
    registryDependencies: ["button"],
    files: ["example/button-ghost.tsx"],
  },
  {
    name: "button-link",
    type: "components:example",
    registryDependencies: ["button"],
    files: ["example/button-link.tsx"],
  },
  {
    name: "button-with-icon",
    type: "components:example",
    registryDependencies: ["button"],
    files: ["example/button-with-icon.tsx"],
  },
  {
    name: "button-loading",
    type: "components:example",
    registryDependencies: ["button"],
    files: ["example/button-loading.tsx"],
  },
  {
    name: "button-icon",
    type: "components:example",
    registryDependencies: ["button"],
    files: ["example/button-icon.tsx"],
  },
  {
    name: "button-as-child",
    type: "components:example",
    registryDependencies: ["button"],
    files: ["example/button-as-child.tsx"],
  },
  {
    name: "stars-moving",
    type: "components:example",
    registryDependencies: ["stars-moving"],
    files: ["example/stars-moving-demo.tsx"],
  },
  {
    name: "crypto-card-demo",
    type: "components:example",
    registryDependencies: ["crypto-card"],
    files: ["example/crypto-card.tsx"],
  },
  {
    name: "crypto-card-icon-demo",
    type: "components:example",
    registryDependencies: ["crypto-card"],
    files: ["example/crypto-card-icon-demo.tsx"],
  },
  {
    name: "ring-demo",
    type: "components:example",
    registryDependencies: ["ring"],
    files: ["example/ring-demo.tsx"],
  },
  {
    name: "toast-demo",
    type: "components:example",
    registryDependencies: ["toast"],
    files: ["example/toast-demo.tsx"],
  },
  {
    name: "toast-destructive",
    type: "components:example",
    registryDependencies: ["toast"],
    files: ["example/toast-destructive.tsx"],
  },
  {
    name: "toast-simple",
    type: "components:example",
    registryDependencies: ["toast"],
    files: ["example/toast-simple.tsx"],
  },
  {
    name: "toast-with-action",
    type: "components:example",
    registryDependencies: ["toast"],
    files: ["example/toast-with-action.tsx"],
  },
  {
    name: "toast-with-title",
    type: "components:example",
    registryDependencies: ["toast"],
    files: ["example/toast-with-title.tsx"],
  },
]

export const registry: Registry = [...ui, ...example]
