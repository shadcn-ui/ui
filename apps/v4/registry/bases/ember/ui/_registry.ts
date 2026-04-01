import type { Registry } from "shadcn/schema"

export const ui: Registry["items"] = [
  {
    "name": "accordion",
    "type": "registry:ui",
    "dependencies": [
      "ember-modifier",
      "ember-provide-consume-context"
    ],
    "files": [
      {
        "path": "ui/accordion.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "alert-dialog",
    "type": "registry:ui",
    "dependencies": [
      "ember-modifier",
      "ember-provide-consume-context"
    ],
    "files": [
      {
        "path": "ui/alert-dialog.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "alert",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/alert/index.ts",
        "type": "registry:ui"
      },
      {
        "path": "ui/alert/alert.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "aspect-ratio",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/aspect-ratio.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "avatar",
    "type": "registry:ui",
    "dependencies": [
      "ember-truth-helpers"
    ],
    "files": [
      {
        "path": "ui/avatar/index.ts",
        "type": "registry:ui"
      },
      {
        "path": "ui/avatar/avatar.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "badge",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/badge/index.ts",
        "type": "registry:ui"
      },
      {
        "path": "ui/badge/badge.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "breadcrumb",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/breadcrumb.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "button-group",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/button-group/index.ts",
        "type": "registry:ui"
      },
      {
        "path": "ui/button-group/button-group.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "button",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/button/index.ts",
        "type": "registry:ui"
      },
      {
        "path": "ui/button/button.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "card",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/card.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "checkbox",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/checkbox.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "collapsible",
    "type": "registry:ui",
    "dependencies": [
      "ember-provide-consume-context"
    ],
    "files": [
      {
        "path": "ui/collapsible.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "command",
    "type": "registry:ui",
    "dependencies": [
      "ember-modifier",
      "ember-provide-consume-context",
      "tracked-built-ins"
    ],
    "files": [
      {
        "path": "ui/command.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "context-menu",
    "type": "registry:ui",
    "dependencies": [
      "@floating-ui/dom",
      "ember-click-outside",
      "ember-modifier",
      "ember-provide-consume-context"
    ],
    "files": [
      {
        "path": "ui/context-menu.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "dialog",
    "type": "registry:ui",
    "dependencies": [
      "ember-modifier",
      "ember-provide-consume-context"
    ],
    "files": [
      {
        "path": "ui/dialog.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "dropdown-menu",
    "type": "registry:ui",
    "dependencies": [
      "@floating-ui/dom",
      "ember-click-outside",
      "ember-modifier",
      "ember-provide-consume-context"
    ],
    "files": [
      {
        "path": "ui/dropdown-menu.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "empty",
    "type": "registry:ui",
    "dependencies": [
      "class-variance-authority"
    ],
    "files": [
      {
        "path": "ui/empty/index.ts",
        "type": "registry:ui"
      },
      {
        "path": "ui/empty/empty.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "field",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/field/index.ts",
        "type": "registry:ui"
      },
      {
        "path": "ui/field/field.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "hover-card",
    "type": "registry:ui",
    "dependencies": [
      "@floating-ui/dom",
      "ember-modifier",
      "ember-provide-consume-context"
    ],
    "files": [
      {
        "path": "ui/hover-card.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "input-group",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/input-group/index.ts",
        "type": "registry:ui"
      },
      {
        "path": "ui/input-group/input-group.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "input-otp",
    "type": "registry:ui",
    "dependencies": [
      "ember-modifier",
      "ember-provide-consume-context"
    ],
    "files": [
      {
        "path": "ui/input-otp.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "input",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/input.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "item",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/item/index.ts",
        "type": "registry:ui"
      },
      {
        "path": "ui/item/item.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "kbd",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/kbd.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "label",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/label.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "native-select",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/native-select.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "pagination",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/pagination.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "popover",
    "type": "registry:ui",
    "dependencies": [
      "@floating-ui/dom",
      "ember-click-outside",
      "ember-modifier",
      "ember-provide-consume-context"
    ],
    "files": [
      {
        "path": "ui/popover.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "progress",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/progress.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "radio-group",
    "type": "registry:ui",
    "dependencies": [
      "ember-provide-consume-context"
    ],
    "files": [
      {
        "path": "ui/radio-group.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "scroll-area",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/scroll-area.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "select",
    "type": "registry:ui",
    "dependencies": [
      "@floating-ui/dom",
      "ember-click-outside",
      "ember-modifier",
      "ember-provide-consume-context"
    ],
    "files": [
      {
        "path": "ui/select.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "separator",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/separator.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "sheet",
    "type": "registry:ui",
    "dependencies": [
      "ember-modifier",
      "ember-provide-consume-context"
    ],
    "files": [
      {
        "path": "ui/sheet.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "sidebar",
    "type": "registry:ui",
    "dependencies": [
      "ember-modifier",
      "ember-provide-consume-context",
      "ember-truth-helpers"
    ],
    "files": [
      {
        "path": "ui/sidebar/index.ts",
        "type": "registry:ui"
      },
      {
        "path": "ui/sidebar/sidebar.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "skeleton",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/skeleton.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "slider",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/slider.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "sonner",
    "type": "registry:ui",
    "dependencies": [
      "ember-click-outside",
      "ember-modifier",
      "ember-truth-helpers"
    ],
    "files": [
      {
        "path": "ui/sonner.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "spinner",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/spinner.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "switch",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/switch.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "table",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/table.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "tabs",
    "type": "registry:ui",
    "dependencies": [
      "ember-provide-consume-context"
    ],
    "files": [
      {
        "path": "ui/tabs.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "textarea",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/textarea.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "toggle-group",
    "type": "registry:ui",
    "dependencies": [
      "ember-provide-consume-context"
    ],
    "files": [
      {
        "path": "ui/toggle-group/index.ts",
        "type": "registry:ui"
      },
      {
        "path": "ui/toggle-group/toggle-group.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "toggle",
    "type": "registry:ui",
    "dependencies": [],
    "files": [
      {
        "path": "ui/toggle/index.ts",
        "type": "registry:ui"
      },
      {
        "path": "ui/toggle/toggle.gts",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "tooltip",
    "type": "registry:ui",
    "dependencies": [
      "@floating-ui/dom",
      "ember-modifier",
      "ember-provide-consume-context"
    ],
    "files": [
      {
        "path": "ui/tooltip.gts",
        "type": "registry:ui"
      }
    ]
  }
]
