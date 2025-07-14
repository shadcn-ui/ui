# shadcn/ui Library API Reference

## Overview

shadcn/ui is a comprehensive UI component library and CLI tool for React applications. It provides:
- **CLI Tool**: Component installation and project management
- **Component Registry**: 50+ pre-built UI components
- **Multiple Styles**: Default, New York, and New York V4 variants
- **Framework Support**: Next.js, Vite, Astro, Remix, Laravel, Gatsby, Expo, TanStack Start
- **Package Manager Support**: npm, yarn, pnpm, bun, deno

## Installation

```bash
npx shadcn@latest init
npx shadcn@latest add [component]
```

## CLI Commands

### Core Commands

#### `shadcn init`
Initialize project and install dependencies
```bash
shadcn init [components...]
```
**Options:**
- `-t, --template <template>` - Template (next, next-monorepo)
- `-b, --base-color <color>` - Base color (neutral, gray, zinc, stone, slate)
- `-y, --yes` - Skip confirmation
- `-d, --defaults` - Use defaults
- `-f, --force` - Force overwrite
- `--src-dir` - Use src directory
- `--css-variables` - Use CSS variables

#### `shadcn add`
Add components to project
```bash
shadcn add [components...]
```
**Options:**
- `-y, --yes` - Skip confirmation
- `-o, --overwrite` - Overwrite existing files
- `-a, --all` - Add all components
- `-p, --path <path>` - Custom path
- `--src-dir` - Use src directory

#### `shadcn diff`
Check for component updates
```bash
shadcn diff [component]
```

#### `shadcn info`
Get project information
```bash
shadcn info
```

### Registry Commands

#### `shadcn build`
Build components for registry
```bash
shadcn build [registry]
```
**Options:**
- `-o, --output <path>` - Output directory (default: ./public/r)

#### `shadcn migrate`
Run migrations
```bash
shadcn migrate [migration]
```
**Available migrations:** `icons`, `radix`

## Registry API

### Import Path
```typescript
import { 
  fetchRegistry,
  getRegistryIndex,
  getRegistryItem,
  registryResolveItemsTree
} from "shadcn/registry"
```

### Core Functions

#### `fetchRegistry(paths, options?)`
Fetch multiple registry items
```typescript
const items = await fetchRegistry([
  "styles/default/button.json",
  "styles/default/input.json"
], { useCache: true })
```

#### `getRegistryIndex()`
Get complete registry index
```typescript
const index = await getRegistryIndex()
```

#### `getRegistryItem(name, style)`
Get specific component
```typescript
const button = await getRegistryItem("button", "default")
```

#### `registryResolveItemsTree(names, config)`
Resolve component dependencies
```typescript
const tree = await registryResolveItemsTree(["button", "input"], config)
```

#### `getRegistryStyles()`
Get available styles
```typescript
const styles = await getRegistryStyles()
// Returns: ["default", "new-york", "new-york-v4"]
```

#### `getRegistryBaseColors()`
Get available base colors
```typescript
const colors = await getRegistryBaseColors()
```

### Utility Functions

#### `clearRegistryCache()`
Clear registry cache
```typescript
clearRegistryCache()
```

#### `isUrl(path)`
Check if path is URL
```typescript
const isRemote = isUrl("https://example.com/component.json")
```

## Configuration API

### Import Path
```typescript
import { getConfig, getProjectInfo } from "shadcn/src/utils/get-config"
import { getProjectInfo } from "shadcn/src/utils/get-project-info"
```

### Configuration Functions

#### `getConfig(cwd)`
Get project configuration
```typescript
const config = await getConfig(process.cwd())
```

#### `getProjectInfo(cwd)`
Get project information and framework detection
```typescript
const info = await getProjectInfo(process.cwd())
// Returns: { framework, tailwindVersion, tsConfigAliasPrefix, ... }
```

#### `createConfig(partial?)`
Create configuration object
```typescript
const config = createConfig({
  style: "new-york",
  baseColor: "slate",
  cssVariables: true
})
```

## Component Management

### Import Path
```typescript
import { addComponents } from "shadcn/src/utils/add-components"
import { createProject } from "shadcn/src/utils/create-project"
```

### Functions

#### `addComponents(components, config, options)`
Add components to project
```typescript
await addComponents(["button", "input"], config, {
  overwrite: false,
  silent: false
})
```

#### `createProject(options)`
Create new project
```typescript
await createProject({
  template: "next",
  name: "my-app",
  srcDir: true
})
```

## Transformers

### Import Path
```typescript
import { transform } from "shadcn/src/utils/transformers"
```

### Transform Function
```typescript
const result = await transform({
  filename: "button.tsx",
  raw: componentCode,
  config,
  baseColor
})
```

**Transformation Pipeline:**
1. Import path resolution
2. React Server Components transformation
3. CSS variables transformation
4. Tailwind prefix transformation
5. Icon library transformation
6. JSX transformation

## Available Components

### Form Controls
- `button` - Button component with variants
- `input` - Input field
- `textarea` - Multi-line text input
- `checkbox` - Checkbox input
- `radio-group` - Radio button group
- `select` - Select dropdown
- `slider` - Range slider
- `switch` - Toggle switch
- `form` - Form wrapper with validation

### Navigation
- `breadcrumb` - Breadcrumb navigation
- `navigation-menu` - Navigation menu
- `pagination` - Pagination controls
- `menubar` - Menu bar

### Layout
- `card` - Card container
- `separator` - Visual separator
- `sheet` - Slide-out panel
- `dialog` - Modal dialog
- `drawer` - Drawer component
- `resizable` - Resizable panels
- `scroll-area` - Custom scrollbar
- `sidebar` - Sidebar navigation

### Feedback
- `alert` - Alert messages
- `toast` - Toast notifications
- `sonner` - Sonner toast integration
- `progress` - Progress indicator
- `skeleton` - Loading skeleton

### Data Display
- `table` - Data table
- `badge` - Status badge
- `avatar` - User avatar
- `calendar` - Date picker calendar
- `chart` - Chart components

### Overlays
- `popover` - Popover overlay
- `tooltip` - Tooltip
- `hover-card` - Hover card
- `context-menu` - Context menu
- `dropdown-menu` - Dropdown menu

### Advanced
- `accordion` - Collapsible sections
- `carousel` - Image/content carousel
- `collapsible` - Collapsible content
- `command` - Command palette

## Component Styles

### Default Style
- Traditional shadcn/ui styling
- `ring-offset-2` focus rings
- Standard spacing and sizing

### New York Style
- Modern, refined styling
- Shadow effects
- Optimized spacing
- `ring-1` focus rings

### New York V4 Style
- Latest iteration
- Enhanced component structure
- Improved accessibility

## Configuration Schema

### components.json
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

## Registry Types

- `registry:ui` - UI components
- `registry:block` - Complex blocks/layouts
- `registry:component` - Examples and demos
- `registry:hook` - React hooks
- `registry:theme` - Themes and colors
- `registry:lib` - Utility libraries

## Error Handling

### Import Path
```typescript
import { handleError } from "shadcn/src/utils/handle-error"
```

### Usage
```typescript
try {
  await addComponents(["button"], config)
} catch (error) {
  handleError(error)
}
```

## Utilities

### Logger
```typescript
import { logger } from "shadcn/src/utils/logger"

logger.info("Installing components...")
logger.success("Components installed!")
logger.error("Installation failed")
logger.warn("Warning message")
```

### Spinner
```typescript
import { spinner } from "shadcn/src/utils/spinner"

const spin = spinner("Installing...", { silent: false })
// ... async operation
spin.stop()
```

### Package Manager Detection
```typescript
import { getPackageManager } from "shadcn/src/utils/get-package-manager"

const pm = await getPackageManager(process.cwd())
// Returns: "npm" | "yarn" | "pnpm" | "bun" | "deno"
```

## Framework Support

- **Next.js** - Full support with App Router and Pages Router
- **Vite** - React + Vite projects
- **Astro** - Astro with React integration
- **Remix** - Remix applications
- **Laravel** - Laravel with Inertia.js
- **Gatsby** - Gatsby projects
- **Expo** - React Native with Expo
- **TanStack Start** - TanStack Start applications

## Best Practices

1. **Always run `shadcn init`** before adding components
2. **Use `--src-dir`** flag for projects with src directory
3. **Enable CSS variables** for better theming support
4. **Check component dependencies** before installation
5. **Use `shadcn diff`** to check for updates
6. **Customize components** after installation as needed

## Registry URL

Default registry: `https://ui.shadcn.com/r`
Configurable via `REGISTRY_URL` environment variable

