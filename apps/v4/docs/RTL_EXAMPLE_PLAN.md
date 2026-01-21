# Plan: Adding a New RTL Example for Both Radix and Base

This document outlines the step-by-step process for adding a new RTL (Right-to-Left) example component for both the Radix UI and Base UI implementations.

## Overview

When adding a new RTL example, you need to:
1. Create the example component files (Base and Radix)
2. Register the examples in the examples index
3. Add documentation sections to the MDX files
4. Ensure RTL UI components exist (if needed)

## Prerequisites

- The component must have RTL UI components available in:
  - `apps/v4/examples/base/ui-rtl/` (for Base UI)
  - `apps/v4/examples/radix/ui-rtl/` (for Radix UI)
- If RTL UI components don't exist, they need to be created first (outside this plan's scope)

## Important: Follow Demo Structure

**The RTL example should follow the same structure as the demo version.**

For example:
- `dropdown-menu-rtl.tsx` should be similar to `dropdown-menu-demo.tsx`
- `avatar-rtl.tsx` should be similar to `avatar-demo.tsx`
- `alert-rtl.tsx` should be similar to `alert-demo.tsx`

**Key Points:**
- Use the same component structure and layout as the demo
- Keep the same visual elements (icons, badges, groups, etc.)
- Only add translations for text content that needs to be translated
- If the demo has no text (like `avatar-demo`), the RTL example should also have minimal/no text
- The main difference is using RTL UI components (`@/examples/{base|radix}/ui-rtl/`) and passing the `dir` prop

## Step-by-Step Process

### Step 1: Create Base UI RTL Example Component

**Location:** `apps/v4/examples/base/{component-name}-rtl.tsx`

**Important:** Before creating the RTL example, check the corresponding demo file (`{component-name}-demo.tsx`) and use it as a reference. The RTL example should follow the same structure, layout, and visual elements as the demo, but use RTL UI components and add translations for text content.

**Template Structure:**
```tsx
"use client"

import * as React from "react"
import {
  // Import component parts from RTL UI
  Component,
  ComponentPart1,
  ComponentPart2,
} from "@/examples/base/ui-rtl/{component-name}"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      // English translation keys
      key1: "English text",
      key2: "More English text",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      // Arabic translations
      key1: "نص عربي",
      key2: "المزيد من النص العربي",
    },
  },
  he: {
    dir: "rtl",
    values: {
      // Hebrew translations
      key1: "טקסט עברי",
      key2: "עוד טקסט עברי",
    },
  },
}

// Data structure (if needed)
const items = [
  {
    value: "item-1",
    labelKey: "key1" as const,
  },
] as const

export function {ComponentName}Rtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Component className="..." dir={dir}>
      {/* Component implementation using t[key] for translations */}
    </Component>
  )
}
```

**Key Points:**
- Use `"use client"` directive at the top
- Import from `@/examples/base/ui-rtl/{component-name}`
- Use `useTranslation` hook (not `useLanguage`)
- Export function name should be `{ComponentName}Rtl` (PascalCase)
- Default language is `"ar"` (Arabic)
- Use `dir` from `useTranslation` and pass it to the component
- Use `t[key]` to access translated values

### Step 2: Create Radix UI RTL Example Component

**Location:** `apps/v4/examples/radix/{component-name}-rtl.tsx`

**Template Structure:**
```tsx
"use client"

import * as React from "react"
import {
  // Import component parts from RTL UI
  Component,
  ComponentPart1,
  ComponentPart2,
} from "@/examples/radix/ui-rtl/{component-name}"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

// Same translations structure as Base UI
const translations: Translations = {
  // ... same as Base UI
}

export function {ComponentName}Rtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Component
      // Radix-specific props (e.g., type="single", collapsible)
      className="..."
      dir={dir}
    >
      {/* Component implementation */}
    </Component>
  )
}
```

**Key Differences from Base UI:**
- Import from `@/examples/radix/ui-rtl/{component-name}`
- May need Radix-specific props (e.g., `type="single" collapsible` for Accordion)
- Otherwise follows the same pattern as Base UI

### Step 3: Register Examples in Examples Index

**Location:** `apps/v4/examples/__index__.tsx`

**For Radix UI:**
Find the Radix section (around line 86) and add:

```tsx
"{component-name}-rtl": {
  name: "{component-name}-rtl",
  filePath: "examples/radix/{component-name}-rtl.tsx",
  component: React.lazy(async () => {
    const mod = await import("./radix/{component-name}-rtl")
    const exportName =
      Object.keys(mod).find(
        (key) =>
          typeof mod[key] === "function" || typeof mod[key] === "object"
      ) || "{component-name}-rtl"
    return { default: mod.default || mod[exportName] }
  }),
},
```

**For Base UI:**
Find the Base section (around line 5015) and add the same structure, but with:
- `filePath: "examples/base/{component-name}-rtl.tsx"`
- `import("./base/{component-name}-rtl")`

**Important:**
- Place entries alphabetically within their respective sections
- Ensure the export name matches the function name in your component file
- The `name` field should match the file name (without extension)

### Step 4: Add Documentation to Base UI MDX

**Location:** `apps/v4/content/docs/components/base/{component-name}.mdx`

Add a new RTL section before the "API Reference" section:

```markdown
## RTL

To enable RTL support in shadcn/ui, see the [RTL configuration guide](/docs/rtl).

<ComponentPreview
  styleName="base-nova"
  name="{component-name}-rtl"
  direction="rtl"
  previewClassName="h-96"
/>
```

**Key Points:**
- Use `styleName="base-nova"` for Base UI
- Use `name="{component-name}-rtl"` (matches the registered example name)
- Use `direction="rtl"` to enable RTL mode
- Adjust `previewClassName` as needed (e.g., `h-96` for accordion)

### Step 5: Add Documentation to Radix UI MDX

**Location:** `apps/v4/content/docs/components/radix/{component-name}.mdx`

Add the same RTL section, but with:
- `styleName="radix-nova"` instead of `base-nova`
- Same `name` and `direction` props

### Step 6: Verify the Implementation

**Checklist:**
- [ ] Both example files exist and export the correct function name
- [ ] Examples are registered in `__index__.tsx` for both Radix and Base
- [ ] Documentation sections added to both MDX files
- [ ] Component uses `useTranslation` hook correctly
- [ ] Translations include `en`, `ar`, and `he` languages
- [ ] Component passes `dir` prop to the root component
- [ ] RTL UI components exist in both `ui-rtl` directories
- [ ] Language selector appears automatically (handled by `ComponentPreviewTabs`)

### Step 7: Build Examples Index

**Important:** After adding new RTL examples, you must run the build command to regenerate the examples index:

```bash
pnpm examples:build
```

This command will:
- Scan all example files
- Regenerate `apps/v4/examples/__index__.tsx`
- Ensure all examples are properly registered

**Note:** The examples index is auto-generated, so manual edits to `__index__.tsx` will be overwritten. Always run the build command after adding new examples.

## Example: Accordion RTL

As a reference, here's what was done for the `accordion` component:

1. **Base UI Example:** `apps/v4/examples/base/accordion-rtl.tsx`
   - Uses `@/examples/base/ui-rtl/accordion`
   - Exports `AccordionRtl`
   - Uses `defaultValue={["item-1"]}` (Base UI pattern)
   - Follows the same structure as `accordion-demo.tsx` but with translations

2. **Radix UI Example:** `apps/v4/examples/radix/accordion-rtl.tsx`
   - Uses `@/examples/radix/ui-rtl/accordion`
   - Exports `AccordionRtl`
   - Uses `type="single" collapsible defaultValue="item-1"` (Radix UI pattern)
   - Follows the same structure as `accordion-demo.tsx` but with translations

3. **Registered in:** `apps/v4/examples/__index__.tsx`
   - Radix: line ~86
   - Base: line ~5015

4. **Documentation added to:**
   - `apps/v4/content/docs/components/base/accordion.mdx`
   - `apps/v4/content/docs/components/radix/accordion.mdx`

**Other Examples:**
- `dropdown-menu-rtl.tsx` follows `dropdown-menu-demo.tsx` structure
- `avatar-rtl.tsx` follows `avatar-demo.tsx` structure (no text labels)
- `alert-rtl.tsx` follows `alert-demo.tsx` structure

## Common Patterns

### Translation Keys
- Use descriptive, semantic keys (e.g., `question1`, `answer1`, `selectFruit`)
- Avoid generic keys like `text1`, `text2`
- Group related translations logically

### Component Props
- Always pass `dir={dir}` to the root component
- Use `className` for styling (e.g., `max-w-md`, `w-28`)
- Follow Base UI vs Radix UI prop differences

### Data Structures
- Use `as const` for type safety
- Reference translation keys in data structures
- Example: `{ value: "item-1", questionKey: "question1" as const }`

## Troubleshooting

**Language selector not appearing:**
- Ensure `direction="rtl"` is set in `ComponentPreview`
- Check that `ComponentPreviewTabs` wraps with `LanguageProvider` when `direction === "rtl"`

**Component not found:**
- Verify the example is registered in `__index__.tsx`
- Check that the export name matches the function name
- Ensure the file path is correct

**Translations not working:**
- Verify `useTranslation` hook is used correctly
- Check that translation keys match between `translations` object and usage
- Ensure `dir` is passed to components that need it

**RTL UI components missing:**
- Check if components exist in `ui-rtl` directories
- May need to create RTL versions of UI components first (separate task)

## Notes

- The language selector is automatically injected by `ComponentPreviewTabs` when `direction="rtl"`
- No need to manually add `<LanguageSelector>` to example components
- The `useTranslation` hook automatically handles language context from `LanguageProvider`
- Default language is Arabic (`"ar"`), but users can switch via the language selector
