import { type Registry } from "shadcn/schema"

export const examples: Registry["items"] = [
  {
    name: "alert-dialog-example",
    title: "Alert Dialog",
    type: "registry:example",
    registryDependencies: ["alert-dialog", "button"],
    files: [
      {
        path: "examples/alert-dialog-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-example",
    title: "Button",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/button-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "select-example",
    title: "Select",
    type: "registry:example",
    registryDependencies: ["select"],
    files: [
      {
        path: "examples/select-example.tsx",
        type: "registry:example",
      },
    ],
  },
]
