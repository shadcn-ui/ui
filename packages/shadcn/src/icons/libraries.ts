export const iconLibraries = {
  lucide: {
    name: "lucide",
    title: "Lucide",
    packages: ["lucide-react"],
    import: "import { ICON } from 'lucide-react'",
    usage: "<ICON />",
    export: "lucide-react",
  },
  tabler: {
    name: "tabler",
    title: "Tabler Icons",
    packages: ["@tabler/icons-react"],
    import: "import { ICON } from '@tabler/icons-react'",
    usage: "<ICON />",
    export: "@tabler/icons-react",
  },
  hugeicons: {
    name: "hugeicons",
    title: "HugeIcons",
    packages: ["@hugeicons/react", "@hugeicons/core-free-icons"],
    import:
      "import { HugeiconsIcon } from '@hugeicons/react'\nimport { ICON } from '@hugeicons/core-free-icons';",
    usage: "<HugeiconsIcon icon={ICON} strokeWidth={2} />",
    export: "@hugeicons/core-free-icons",
  },
  phosphor: {
    name: "phosphor",
    title: "Phosphor Icons",
    packages: ["@phosphor-icons/react"],
    import: "import { ICON } from '@phosphor-icons/react'",
    usage: "<ICON strokeWidth={2} />",
    export: "@phosphor-icons/react",
  },
  remixicon: {
    name: "remixicon",
    title: "Remix Icon",
    packages: ["@remixicon/react"],
    import: "import { ICON } from '@remixicon/react'",
    usage: "<ICON />",
    export: "@remixicon/react",
  },
  // [FORCE-UI-START] Material Symbols: raw SVGs imported per-icon via SVGR.
  // NAME = svg-400 rounded basename (e.g. "keyboard_arrow_down"); ICON = generated identifier.
  // The ?react query is the SVGR (vite-plugin-svgr) convention that yields a React
  // component from the raw SVG; consumers must have SVGR configured for it.
  // The default, path-based import shape is handled specially in build-icons.ts
  // and transform-icons.ts (it is not a named export from a single module).
  materialSymbols: {
    name: "materialSymbols",
    title: "Material Symbols",
    packages: ["@material-symbols/svg-400"],
    import:
      "import ICON from '@material-symbols/svg-400/rounded/NAME.svg?react'",
    usage: "<ICON />",
    export: "@material-symbols/svg-400/rounded",
  },
  // [FORCE-UI-END]
} as const

export type IconLibraries = typeof iconLibraries

export type IconLibrary = IconLibraries[keyof IconLibraries]

export type IconLibraryName = keyof IconLibraries
