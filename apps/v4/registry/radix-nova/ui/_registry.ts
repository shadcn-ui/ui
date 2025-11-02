import { Registry } from "shadcn/schema"

export const ui: Registry["items"] = [
  {
    name: "alert-dialog",
    type: "registry:ui",
    dependencies: ["radix-ui"],
    files: [
      {
        path: "ui/alert-dialog.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "button",
    type: "registry:ui",
    dependencies: ["radix-ui"],
    files: [
      {
        path: "ui/button.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "select",
    type: "registry:ui",
    dependencies: ["radix-ui"],
    files: [
      {
        path: "ui/select.tsx",
        type: "registry:ui",
      },
    ],
  },
]
