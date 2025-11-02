import { type Registry } from "shadcn/schema"

export const examples: Registry["items"] = [
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
]
