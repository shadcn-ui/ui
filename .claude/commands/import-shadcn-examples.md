---
name: import-shadcn-examples
description: Import component examples and docs from a shadcn implementation repo into force-ui. Handles full framework onboarding including demos, import transforms, registry generation, cn-* theming, documentation, preview server setup, and config/navigation updates.
---

# Import shadcn Examples & Docs

Import component demo/example files and documentation from an external shadcn implementation repo into force-ui's registry, preview server, and docs.

## Usage

```
/import-shadcn-examples <source-repo-path> <framework>
```

- `<source-repo-path>`: Path to the shadcn implementation repo (e.g., `/tmp/shadcn-vue`, `/tmp/shadcn-svelte`)
- `<framework>`: Target framework in force-ui (`vue`, `svelte`, or any new framework)

If arguments are not provided, ask the user for both values before proceeding.

---

## Part A: Example Files Migration

### Phase 1: Discover Source Structure

1. **Find the demo files** in the source repo. Common locations:
   - `apps/v4/components/demo/` (shadcn-vue -- flat, PascalCase `.vue`)
   - `docs/src/lib/registry/examples/` (shadcn-svelte -- flat, kebab-case `.svelte`)
   - `apps/www/registry/*/example/` (shadcn/ui React)
   - Search broadly if not found in these locations.

2. **Catalog all demo files**: List every file, count them, note the naming convention (PascalCase vs kebab-case).

3. **Analyze import patterns** in 5-6 demo files:

   | What to find | Example |
   |---|---|
   | UI component import path | `$lib/registry/ui/button/index.js`, `@/registry/new-york-v4/ui/button` |
   | Icon library | `lucide-vue-next`, `@lucide/svelte/icons/*` |
   | Utility imports | `$lib/utils.js`, `@/lib/utils` |
   | Framework-specific imports | `#components` (Nuxt), `$app/*` (SvelteKit) |
   | Cross-demo imports | `./NavigationMenuItem.vue` |
   | NPM dependencies | `@internationalized/date`, `vue-sonner`, `@tanstack/*` |

4. **Check for special helper files** (data-table sub-components, navigation menu items, etc.).

### Phase 2: Discover Target Structure

5. **Read the target framework's current state** in force-ui:
   - `apps/v4/registry/bases/{framework}/examples/` -- existing example files & structure
   - `apps/v4/registry/bases/{framework}/examples/_registry.ts` -- registry format (grouped vs flat)
   - `apps/v4/registry/bases/{framework}/ui/` -- list of UI components (valid component groups)
   - `apps/v4/preview-server/src/{framework}/` -- preview server file naming

6. **Read the preview server** (`apps/v4/preview-server/src/main.ts`):
   - Vue: loads `./vue/*.vue` and `./vue/**/*.vue` (kebab-case filenames)
   - Svelte: loads `./svelte/*.svelte` (kebab-case filenames)
   - URL pattern: `/preview/{framework}/{component-name}`

7. **Read MDX docs** to catalog all referenced preview names:
   ```bash
   grep -r 'ComponentPreview.*framework="{framework}"' apps/v4/content/docs/components/{framework}/
   ```
   Every referenced name MUST have a matching file in the preview server after migration.

### Phase 3: Define Transform Rules

8. **Map import paths** -- check how EXISTING target examples handle imports and match exactly:

   **Vue transforms:**
   | Source (shadcn-vue) | Registry target | Preview server target |
   |---|---|---|
   | `@/registry/new-york-v4/ui/{comp}` | `@/ui/{comp}` | `@/ui/{comp}` |
   | `@/registry/new-york-v4/lib/{mod}` | `@/lib/{mod}` | `@/lib/{mod}` |
   | `@/lib/utils` | `@/lib/utils` | `@/lib/utils` |
   | `import { NuxtLink } from '#components'` | Remove import; `<NuxtLink>` -> `<a>`, `:to=` -> `:href=` | Same |

   **Svelte transforms:**
   | Source (shadcn-svelte) | Registry target | Preview server target |
   |---|---|---|
   | `$lib/registry/ui/{comp}/index.js` | `$lib/registry/ui/{comp}/index.js` (keep!) | `@/svelte-ui/{comp}/index.js` |
   | `$lib/utils.js` | `$lib/utils.js` (keep!) | `@/svelte-lib/utils.js` |
   | `$lib/registry/hooks/*` | `$lib/registry/hooks/*` (keep!) | `@/svelte-hooks/*` |

9. **Define filename handling**:
   - Vue registry: subdirectories per component, PascalCase filenames preserved
   - Vue preview: flat directory, kebab-case filenames
   - Svelte registry: flat directory, kebab-case filenames
   - Svelte preview: flat directory, kebab-case filenames

10. **Define component grouping** (for Vue subdirectories):
    - Build list of valid components from `registry/bases/{framework}/ui/`
    - Convert each to PascalCase for prefix matching
    - Sort by length descending (longest match first)
    - Add explicit overrides for acronyms: `InputOTP` -> `input-otp` (not `input`)

### Phase 3.5: Theming Pipeline (cn-* tokens)

**CRITICAL**: force-ui uses abstract `cn-*` class tokens for multi-theme support (nova, lyra, mira, maia, vega). All source repos have **hardcoded Tailwind classes** — these MUST be rewritten to use cn-* tokens.

**How the theming pipeline works:**
1. Base components use `cn-*` tokens in templates: `cn('cn-dialog-content fixed left-1/2 ...', props.class)`
2. Style CSS files (`registry/styles/style-{theme}.css`) map tokens to Tailwind: `.cn-dialog-content { @apply bg-popover rounded-xl p-4 ring-1 ... }`
3. Build pipeline (`transformStyle` via ts-morph) processes `.ts` files with `cva()` calls — replaces cn-* tokens with real Tailwind classes for registry distribution
4. Template cn-* classes in `.vue`/`.svelte`/other framework files are NOT transformed by ts-morph — they remain as CSS class names, resolved by theme CSS at runtime

**For each UI component being imported:**

1. Read the **Vue version** at `registry/bases/vue/ui/{component}/` to identify which `cn-*` tokens each sub-component uses and what structural classes accompany them
2. **Replace** the source repo's hardcoded Tailwind with the same cn-* tokens + structural layout classes (flex, w-full, relative, z-50, etc.) — matching exactly what Vue does
3. For **variant components** (button, badge, alert, toggle, avatar, etc.), create an `index.ts` with `cva()` using cn-* tokens — copy the cva definition from Vue's `index.ts`
4. **Non-variant components** stay as single files with cn-* tokens directly in templates

**Variant component directory structure:**
```
ui/{component}/
├── index.ts           # cva() with cn-* tokens (gets transformed by build pipeline)
└── {component}.{ext}  # imports buttonVariants from ./index
```

**Example cn-* token usage in a template:**
```
class="cn-accordion-item"
class="cn-dialog-content fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2"
```

The cn-* token provides themed styling (colors, borders, shadows, animations). The structural classes alongside it provide layout that doesn't change between themes.

### Phase 4: Execute Migration

11. **Write a Node.js migration script** (`/tmp/migrate-{framework}-examples.mjs`). Use Node.js, NOT Python (pyenv issues on this system).

    The script must:
    a. Read all source demo `.vue`/`.svelte` files
    b. Group files by component (prefix matching for Vue; parse kebab-case prefix for Svelte)
    c. Warn about ungrouped files (components in source that don't exist in target)
    d. Delete existing example files (preserve `_registry.ts` temporarily)
    e. Delete existing preview-server framework files
    f. Copy + transform files to registry examples
    g. Copy + transform files to preview server (kebab-case conversion for Vue)
    h. Handle subdirectory examples (not just flat files) — copy entire directory trees
    i. For frameworks needing compilation plugins, install build dependencies in preview-server
    j. Generate new `_registry.ts`

    **Registry entry format varies by framework:**

    Vue (grouped -- one entry per component, multiple files):
    ```ts
    {
      name: "button-example",
      title: "Button",
      type: "registry:example",
      files: [
        { path: "examples/button/ButtonDemo.vue", type: "registry:example" },
        { path: "examples/button/ButtonDestructive.vue", type: "registry:example" },
      ],
      registryDependencies: ["button"],
      dependencies: ["lucide-vue-next"],
    }
    ```

    Svelte (flat -- one entry per file):
    ```ts
    {
      name: "button-demo",
      title: "Button Demo",
      type: "registry:example",
      registryDependencies: ["button"],
      files: [
        { path: "examples/button-demo.svelte", type: "registry:example" },
      ],
    }
    ```

    **Critical formatting rules:**
    - Empty arrays must be `[]`, never `[\n,\n]`
    - Auto-detect `registryDependencies` from `@/ui/` or `$lib/registry/ui/` imports
    - Auto-detect `dependencies` from npm imports (exclude `vue`, `svelte`, framework core)

12. **Apply manual fixes** for known source-repo bugs:
    - `DataTableDemo`: `valueUpdater` imported from `@/lib/utils` but lives in `@/ui/table/utils`
    - Check for any other import resolution failures during build

### Phase 5: Install Dependencies & Verify

13. **Find missing npm dependencies**:
    ```bash
    # Scan for npm imports in preview-server examples
    grep -rh "from '[^@./]" preview-server/src/{framework}/ | sort -u
    ```
    Cross-reference with `apps/v4/preview-server/package.json`. Install missing ones:
    ```bash
    cd apps/v4/preview-server && pnpm add <package1> <package2>
    ```

14. **Build preview-server**: `pnpm build --filter=preview-server`

15. **Build v4 app**: `pnpm --filter=v4 build`
    - Common errors: Zod validation failures in registry (empty arrays, missing fields)
    - Module not found: missing npm dependencies

16. **Verify MDX references resolve**: All `ComponentPreview name="X"` in MDX must have a matching file in the preview server.

### Phase 5.5: Config & Navigation Updates (new frameworks only)

When adding a framework that doesn't already exist in force-ui, update these files:

**Registry & Build:**
1. `registry/frameworks.ts` — Add framework entry to `FRAMEWORKS` array, update `getDefaultBaseForFramework`
2. `registry/bases.ts` — Add base entry to `BASES` array
3. `scripts/build-registry.mts` — Add new file extension to: `stripFileExtension` regex, `isNonReactBase` checks (2 locations), `shouldTransform`, `DEMO_EXTENSIONS`, demo name extraction regex. If prettier can't parse the extension, skip formatting in `formatGeneratedSource`.

**Preview & Routing:**
4. `next.config.mjs` — Add `/preview/{framework}/*` rewrite rule
5. `preview-server/src/main.ts` — Add framework rendering branch (dynamic import via `import.meta.glob`)
6. `preview-server/vite.config.ts` — Add compilation plugins if the framework's file format needs a preprocessor/compiler

**UI & Navigation:**
7. `components/component-preview.tsx` — Add to `framework` type union + file extension mapping
8. `hooks/use-framework.ts` — Add to `Framework` type union + `isValidFramework` function
9. `components/framework-switcher.tsx` — Add to `FRAMEWORK_OPTIONS` array, update all regex patterns (3 locations), update type signatures
10. `lib/framework-components.ts` — Add component manifest `Set` listing all available component slugs
11. `lib/page-tree.ts` — Add to URL regex patterns + `getPagesFromFolder` folder detection
12. `components/docs-sidebar.tsx` — Add to regex pattern
13. `components/mobile-nav.tsx` — Add to regex pattern

---

## Part B: Documentation Adaptation

### Phase 6: Discover Source Docs

17. **Find docs in the source repo**. Common locations:
    - shadcn-vue: `apps/v4/content/docs/components/*.md` (Nuxt Content format with `::` directives)
    - shadcn-svelte: `docs/src/content/*.md` or `docs/src/routes/` (Svelte markdown with `{#snippet}`)
    - Look for markdown/mdx files with component names

18. **Read 3-4 rich source docs** (pick components with many examples like button, dialog, form) and catalog:
    - What sections exist? (Installation, Usage, Examples/variants, API Reference, Accessibility, RTL)
    - What preview/example names are referenced?
    - What code snippets are shown?
    - What links/resources are included?

19. **Read the corresponding force-ui target docs** at `apps/v4/content/docs/components/{framework}/`:
    - Identify which are full docs vs stubs (stubs are ~40 lines with just one preview + installation)
    - Read the Radix (React) version of the same component as the "gold standard" for content depth

### Phase 7: Adapt Documentation

20. **Understand the force-ui MDX format**. All frameworks use the same JSX component API:

    ```mdx
    ---
    title: Button
    description: Displays a button or a component that looks like a button.
    featured: true
    base: {framework}        # "vue", "svelte", or "radix"
    component: true
    links:                   # optional, framework-specific
      doc: https://...
      api: https://...
    ---

    <ComponentPreview framework="{framework}" name="button-demo" />

    ## Installation

    <CodeTabs>
    <TabsList>
      <TabsTrigger value="cli">Command</TabsTrigger>
      <TabsTrigger value="manual">Manual</TabsTrigger>
    </TabsList>
    <TabsContent value="cli">
    ```bash
    npx shadcn@latest add @force-ui-{framework-suffix}/{component}
    ```
    </TabsContent>
    <TabsContent value="manual">
    <Steps className="mb-0 pt-2">
    <Step>Install the following dependencies:</Step>
    ```bash
    npm install {dependency}
    ```
    <Step>Copy and paste the following code into your project.</Step>
    <ComponentSource framework="{framework}" name="{component}" />
    </Steps>
    </TabsContent>
    </CodeTabs>

    ## Usage

    ```{lang} showLineNumbers
    // import statement
    ```

    ```{lang} showLineNumbers
    // usage template
    ```

    ## Examples

    ### Variant Name

    <ComponentPreview framework="{framework}" name="{component}-{variant}" />
    ```

21. **Framework-specific MDX conventions:**

    | Aspect | `radix` (React) | `vue` | `svelte` |
    |---|---|---|---|
    | Frontmatter `base:` | `radix` | `vue` | `svelte` |
    | ComponentPreview attr | `styleName="radix-nova"` | `framework="vue"` | `framework="svelte"` |
    | ComponentSource attr | `styleName="radix-nova" name="{comp}" title="components/ui/{comp}.tsx"` | `framework="vue" name="{comp}"` | `framework="svelte" name="{comp}"` |
    | CLI prefix | `@force-ui/` | `@force-ui-vue/` | `@force-ui-svelte/` |
    | Code block lang | `tsx` | `vue` | `svelte` |
    | Usage imports | `import { Button } from "@/components/ui/button"` | `import { Button } from '@/ui/button'` | `import * as Accordion from "$lib/components/ui/accordion/index.js"` |
    | Manual deps | `npm install radix-ui` | `npm install reka-ui` | `npm install bits-ui` |

22. **Adapt each source doc** using these transforms:

    **From shadcn-vue (Nuxt `::` directives -> MDX JSX):**
    - `::component-preview{name="ButtonDemo"}` -> `<ComponentPreview framework="vue" name="button-demo" />`
    - `::code-tabs` / `::tabs-*` -> `<CodeTabs>` / `<TabsList>` / `<TabsTrigger>` / `<TabsContent>`
    - `::steps` / `::step` -> `<Steps>` / `<Step>`
    - `::component-source{name="button"}` -> `<ComponentSource framework="vue" name="button" />`
    - PascalCase preview names -> kebab-case
    - `npx shadcn-vue@latest add button` -> `npx shadcn@latest add @force-ui-vue/button`
    - Remove `::vue-school-link` embeds
    - Convert Vue code blocks: keep `vue` lang tag

    **From shadcn-svelte (Svelte markdown -> MDX JSX):**
    - Remove `<script>` import blocks at top of doc
    - `<ComponentPreview name="button-demo">` -> `<ComponentPreview framework="svelte" name="button-demo" />`
    - `{#snippet cli()}` / `{#snippet manual()}` -> `<TabsContent value="cli">` / `<TabsContent value="manual">`
    - `<PMAddComp name="button" />` -> `` ```bash\nnpx shadcn@latest add @force-ui-svelte/button\n``` ``
    - `<PMInstall command="bits-ui -D" />` -> `` ```bash\nnpm install bits-ui\n``` ``
    - `<ComponentSource item={viewerData} />` -> `<ComponentSource framework="svelte" name="{component}" />`
    - `<InstallTabs>` -> `<CodeTabs>`

23. **Port missing content sections** from source docs. Most force-ui Vue/Svelte docs are stubs (~40 lines with just a preview + installation). The source repos have much richer content. For each component, port:
    - **Usage section**: Show import + template/JSX usage (adapt import paths to force-ui convention)
    - **Examples section**: Add `<ComponentPreview>` for each variant that exists in the examples. Every demo file that was copied in Part A should ideally have a corresponding preview in the docs.
    - **API Reference**: Port prop tables if the source has them
    - Use the Radix (React) doc for the same component as a reference for section ordering and depth

24. **Verify all preview names** referenced in new/updated MDX files exist in the preview server.

### Phase 8: Final Verification

25. **Build everything**:
    ```bash
    pnpm build --filter=preview-server
    pnpm --filter=v4 build
    ```

26. **Cross-check completeness**:
    - Every UI component dir in `registry/bases/{framework}/ui/` should have a corresponding MDX doc
    - Every MDX doc should have at least: one ComponentPreview, Installation section
    - Rich components (button, dialog, form, input, select) should have Usage + Examples + API Reference

---

## Common Pitfalls

1. **Acronyms in PascalCase**: `InputOTP` must map to `input-otp`, not `input`. Add explicit overrides.
2. **Empty array formatting**: `registryDependencies: []` not `registryDependencies: [\n,\n]`.
3. **Cross-demo imports**: Navigation menu demos import a helper component. Adjust relative paths for flat preview-server.
4. **Framework-specific stubs**: NuxtLink (Vue), `$app/*` (SvelteKit) -- replace or remove.
5. **Source repo bugs**: `valueUpdater` from wrong path in DataTable. Always verify builds.
6. **Missing npm deps**: `@tanstack/vue-form`, `chrono-node`, `paneforge` etc. Scan and install.
7. **Use Node.js, NOT Python**: pyenv has issues on this system. Always use `node` for scripts.
8. **Doc format mismatch**: Source uses `::` directives (Nuxt) or `{#snippet}` (Svelte), target uses JSX MDX. Don't copy verbatim -- translate the format.
9. **Preview name case**: force-ui always uses kebab-case in MDX (`button-demo`), even if source uses PascalCase (`ButtonDemo`).
10. **Prettier parser support**: If the framework uses a file extension prettier can't parse, skip formatting in `formatGeneratedSource` by checking the extension.
11. **cn-* token rewrite**: Source repos have hardcoded Tailwind. They MUST be rewritten to use cn-* abstract tokens for force-ui's multi-theme system. See Phase 3.5.
12. **Subdirectory examples**: Some examples have helper sub-components in subdirectories (e.g., sidebar demos with multiple files). The migration script must copy entire directory trees, not just flat files.
13. **Preview server compilation**: New frameworks may need custom Vite plugins for their file format. Check if the framework needs a preprocessor/compiler and add it to `vite.config.ts`.
14. **Module resolution**: Some frameworks resolve imports through their own meta-package. May need a custom Vite resolver plugin to map bare specifiers to actual file paths.
15. **Build-time macros/stubs**: Framework ecosystems may have build-time-only packages that need runtime stubs in the preview server.
