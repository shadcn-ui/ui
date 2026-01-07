# shadcn/ui Demo Creator Agent

This agent creates demo components for the radix-nova and base-nova registries.

## Overview

Demo components are simple, self-contained examples that showcase a specific feature or use case of a UI component. They are used in the component documentation pages.

## Source Files

**Always use the existing examples from new-york-v4 as the source:**

```
registry/new-york-v4/examples/{demo-name}.tsx
```

Read this file first, then adapt it for both radix-nova and base-nova.

## Directory Structure

```
registry/
├── new-york-v4/
│   └── examples/           # SOURCE - read from here
│       └── {demo-name}.tsx
├── radix-nova/
│   └── demo/               # TARGET - write here
│       ├── _registry.ts
│       └── {demo-name}.tsx
└── base-nova/
    └── demo/               # TARGET - write here
        ├── _registry.ts
        └── {demo-name}.tsx
```

## Steps to Create a New Demo

### 1. Read the Source

Read the example from `registry/new-york-v4/examples/{demo-name}.tsx`

### 2. Create the Demo Component Files

Adapt and create the demo component in both registries:

**For Radix (`registry/radix-nova/demo/{name}.tsx`):**
```tsx
import {
  ComponentName,
  // ... other imports
} from "@/registry/radix-nova/ui/component-name"

export default function ComponentDemo() {
  return (
    // Component usage example
  )
}
```

**For Base (`registry/base-nova/demo/{name}.tsx`):**
```tsx
import {
  ComponentName,
  // ... other imports
} from "@/registry/base-nova/ui/component-name"

export default function ComponentDemo() {
  return (
    // Component usage example - may differ slightly due to API differences
  )
}
```

### 3. Update the Registry Files

Add the new demo to both `_registry.ts` files:

**File: `registry/radix-nova/demo/_registry.ts`**
**File: `registry/base-nova/demo/_registry.ts`**

```ts
{
  name: "component-demo-name",
  title: "Component Demo Title",
  type: "registry:example",
  registryDependencies: ["component-name"],
  files: [
    {
      path: "demo/component-demo-name.tsx",
      type: "registry:example",
    },
  ],
},
```

### 4. Add to Documentation (Optional)

If the demo is new and not already in docs, update the component's MDX documentation files:

**File: `content/docs/components/radix/{component}.mdx`**
**File: `content/docs/components/base/{component}.mdx`**

Add a ComponentPreview with the appropriate styleName:

```mdx
### Example Title

Description of what this example demonstrates.

<ComponentPreview
  styleName="radix-nova"  <!-- or "base-nova" for base docs -->
  name="component-demo-name"
  description="Brief description of the demo"
/>
```

## Key Differences Between Radix and Base

### Import Paths

| Registry | Import Path |
|----------|-------------|
| radix-nova | `@/registry/radix-nova/ui/{component}` |
| base-nova | `@/registry/base-nova/ui/{component}` |

### Common API Differences

| Feature | Radix | Base |
|---------|-------|------|
| Accordion type | `type="single"` or `type="multiple"` | `multiple` prop (boolean) |
| Accordion collapsible | `collapsible` prop | Default behavior |
| Default value | `defaultValue="item-1"` (string for single) | `defaultValue={["item-1"]}` (always array) |

When in doubt, check the existing UI component in:
- `registry/radix-nova/ui/{component}.tsx`
- `registry/base-nova/ui/{component}.tsx`

## Naming Conventions

- Demo files: `{component}-{variant}.tsx` (e.g., `accordion-multiple.tsx`)
- Registry name: `{component}-{variant}` (e.g., `accordion-multiple`)
- Use kebab-case for file names and registry names
- Use PascalCase for component function names (e.g., `AccordionMultiple`)

## Exclusions

Do NOT create demos for:
- `form-next-*` (form library specific)
- `form-rhf-*` (form library specific)
- `form-tanstack-*` (form library specific)
- `mode-toggle` (theme specific)
- Any demo ending in `-form` that uses form library integration

## Checklist

When creating a new demo, ensure you:

- [ ] Read source from `registry/new-york-v4/examples/{demo-name}.tsx`
- [ ] Create demo file in `registry/radix-nova/demo/`
- [ ] Create demo file in `registry/base-nova/demo/`
- [ ] Add entry to `registry/radix-nova/demo/_registry.ts`
- [ ] Add entry to `registry/base-nova/demo/_registry.ts`
- [ ] Use correct import paths (`radix-nova` vs `base-nova`)
- [ ] Account for API differences between Radix and Base UI

## Batch Creation

When asked to create multiple demos for a component, process them in order:

```
Create demos for button: button-demo, button-default, button-destructive, button-ghost
```

This will create all 4 demos in both registries.

## PRD Reference

See `.claude/prd/demo-components.md` for the full list of demos to create and progress tracking.
