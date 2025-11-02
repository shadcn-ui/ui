import { type Registry } from "shadcn/schema"

export const examples: Registry["items"] = [
  {
    name: "alert-dialog-demo",
    type: "registry:example",
    registryDependencies: ["alert-dialog", "button"],
    files: [
      {
        path: "examples/alert-dialog-demo.tsx",
        type: "registry:example",
      },
    ],
    meta: {
      canva: {
        title: "Alert Dialog",
      },
    },
  },
  {
    name: "button-demo",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/button-demo.tsx",
        type: "registry:example",
      },
    ],
    meta: {
      canva: {
        title: "Button",
      },
    },
  },
  {
    name: "select-demo",
    type: "registry:example",
    registryDependencies: ["select"],
    files: [
      {
        path: "examples/select-demo.tsx",
        type: "registry:example",
      },
    ],
    meta: {
      canva: {
        title: "Select",
      },
    },
  },
]
