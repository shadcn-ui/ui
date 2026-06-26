import { type Registry } from "shadcn/schema"

export const lib: Registry["items"] = [
  {
    name: "utils",
    type: "registry:lib",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "rgl-dashboard-types",
    type: "registry:lib",
    dependencies: ["react-grid-layout@1.5.3"],
    files: [
      {
        path: "lib/rgl-dashboard-types.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "rgl-dashboard-storage",
    type: "registry:lib",
    registryDependencies: ["rgl-dashboard-types"],
    files: [
      {
        path: "lib/rgl-dashboard-storage.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "rgl-dashboard-example",
    type: "registry:lib",
    registryDependencies: ["rgl-dashboard-types"],
    files: [
      {
        path: "lib/rgl-dashboard-example.ts",
        type: "registry:lib",
      },
    ],
  },
]
