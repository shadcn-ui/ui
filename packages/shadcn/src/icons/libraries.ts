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
  fontawesome: {
    name: "fontawesome",
    title: "Font Awesome",
    packages: [
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-brands-svg-icons",
      "@fortawesome/react-fontawesome",
    ],
    import:
      "import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'\nimport { ICON } from '@fortawesome/free-solid-svg-icons'",
    usage: "<FontAwesomeIcon icon={ICON} />",
    export: "@fortawesome/free-solid-svg-icons",
  },
} as const

export type IconLibraries = typeof iconLibraries

export type IconLibrary = IconLibraries[keyof IconLibraries]

export type IconLibraryName = keyof IconLibraries
