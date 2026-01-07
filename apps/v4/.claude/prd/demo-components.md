# PRD: Demo Components for Radix and Base Registries

## Overview

Create demo components for both `radix-nova` and `base-nova` registries by reimplementing the examples from `new-york-v4/examples/`. These demos will be used in the component documentation.

## Current State

- **Source**: `registry/new-york-v4/examples/` contains **230 example components**
- **Target**: `registry/radix-nova/demo/` and `registry/base-nova/demo/`
- **Completed**: 3 demos (accordion-demo, accordion-disabled, accordion-multiple)
- **Remaining**: ~227 demos

## Goals

1. Create identical demo components for both radix-nova and base-nova registries
2. Ensure demos work with respective primitive libraries (Radix UI vs Base UI)
3. Update registry files to include all demos
4. Maintain consistency with existing patterns

## Technical Requirements

### Import Paths

| Registry | Import Path |
|----------|-------------|
| radix-nova | `@/registry/radix-nova/ui/{component}` |
| base-nova | `@/registry/base-nova/ui/{component}` |

### API Differences

Some components have API differences between Radix UI and Base UI:

| Feature | Radix UI | Base UI |
|---------|----------|---------|
| Accordion multiple | `type="multiple"` | `multiple` prop |
| Accordion default value | `defaultValue="item-1"` | `defaultValue={["item-1"]}` |

### File Structure

```
registry/
├── radix-nova/
│   └── demo/
│       ├── _registry.ts
│       ├── {component}-demo.tsx
│       └── {component}-{variant}.tsx
├── base-nova/
│   └── demo/
│       ├── _registry.ts
│       ├── {component}-demo.tsx
│       └── {component}-{variant}.tsx
└── new-york-v4/
    └── examples/
        └── {component}-{variant}.tsx  (source)
```

### Registry Entry Format

```typescript
{
  name: "{component}-{variant}",
  title: "{Component} {Variant}",
  type: "registry:example",
  registryDependencies: ["{component}"],
  files: [
    {
      path: "demo/{component}-{variant}.tsx",
      type: "registry:example",
    },
  ],
}
```

## Components to Migrate

### By Category

#### Accordion (3) - DONE
- [x] accordion-demo
- [x] accordion-disabled
- [x] accordion-multiple

#### Alert (2)
- [ ] alert-demo
- [ ] alert-destructive

#### Alert Dialog (1)
- [ ] alert-dialog-demo

#### Aspect Ratio (1)
- [ ] aspect-ratio-demo

#### Avatar (1)
- [ ] avatar-demo

#### Badge (4)
- [ ] badge-demo
- [ ] badge-destructive
- [ ] badge-outline
- [ ] badge-secondary

#### Breadcrumb (6)
- [ ] breadcrumb-demo
- [ ] breadcrumb-dropdown
- [ ] breadcrumb-ellipsis
- [ ] breadcrumb-link
- [ ] breadcrumb-responsive
- [ ] breadcrumb-separator

#### Button (14)
- [ ] button-as-child
- [ ] button-default
- [ ] button-demo
- [ ] button-destructive
- [ ] button-ghost
- [ ] button-icon
- [ ] button-link
- [ ] button-loading
- [ ] button-outline
- [ ] button-rounded
- [ ] button-secondary
- [ ] button-size
- [ ] button-with-icon

#### Button Group (12)
- [ ] button-group-demo
- [ ] button-group-dropdown
- [ ] button-group-input
- [ ] button-group-input-group
- [ ] button-group-nested
- [ ] button-group-orientation
- [ ] button-group-popover
- [ ] button-group-select
- [ ] button-group-separator
- [ ] button-group-size
- [ ] button-group-split

#### Calendar (9)
- [ ] calendar-demo
- [ ] calendar-05
- [ ] calendar-13
- [ ] calendar-18
- [ ] calendar-22
- [ ] calendar-24
- [ ] calendar-28
- [ ] calendar-29
- [ ] calendar-hijri

#### Card (2)
- [ ] card-demo
- [ ] card-with-form

#### Carousel (6)
- [ ] carousel-api
- [ ] carousel-demo
- [ ] carousel-orientation
- [ ] carousel-plugin
- [ ] carousel-size
- [ ] carousel-spacing

#### Chart (6)
- [ ] chart-bar-demo
- [ ] chart-bar-demo-axis
- [ ] chart-bar-demo-grid
- [ ] chart-bar-demo-legend
- [ ] chart-bar-demo-tooltip
- [ ] chart-tooltip-demo

#### Checkbox (3)
- [ ] checkbox-demo
- [ ] checkbox-disabled
- [ ] checkbox-with-text

#### Collapsible (1)
- [ ] collapsible-demo

#### Combobox (4)
- [ ] combobox-demo
- [ ] combobox-dropdown-menu
- [ ] combobox-popover
- [ ] combobox-responsive

#### Command (2)
- [ ] command-demo
- [ ] command-dialog

#### Context Menu (1)
- [ ] context-menu-demo

#### Data Table (1)
- [ ] data-table-demo

#### Date Picker (3)
- [ ] date-picker-demo
- [ ] date-picker-with-presets
- [ ] date-picker-with-range

#### Dialog (2)
- [ ] dialog-close-button
- [ ] dialog-demo

#### Drawer (2)
- [ ] drawer-demo
- [ ] drawer-dialog

#### Dropdown Menu (4)
- [ ] dropdown-menu-checkboxes
- [ ] dropdown-menu-demo
- [ ] dropdown-menu-dialog
- [ ] dropdown-menu-radio-group

#### Empty (6)
- [ ] empty-avatar
- [ ] empty-avatar-group
- [ ] empty-background
- [ ] empty-demo
- [ ] empty-icon
- [ ] empty-input-group
- [ ] empty-outline

#### Field (12)
- [ ] field-checkbox
- [ ] field-choice-card
- [ ] field-demo
- [ ] field-fieldset
- [ ] field-group
- [ ] field-input
- [ ] field-radio
- [ ] field-responsive
- [ ] field-select
- [ ] field-slider
- [ ] field-switch
- [ ] field-textarea

#### Hover Card (1)
- [ ] hover-card-demo

#### Input (6)
- [ ] input-demo
- [ ] input-disabled
- [ ] input-file
- [ ] input-with-button
- [ ] input-with-label
- [ ] input-with-text

#### Input Group (11)
- [ ] input-group-button
- [ ] input-group-button-group
- [ ] input-group-custom
- [ ] input-group-demo
- [ ] input-group-dropdown
- [ ] input-group-icon
- [ ] input-group-label
- [ ] input-group-spinner
- [ ] input-group-text
- [ ] input-group-textarea
- [ ] input-group-tooltip

#### Input OTP (4)
- [ ] input-otp-controlled
- [ ] input-otp-demo
- [ ] input-otp-pattern
- [ ] input-otp-separator

#### Item (10)
- [ ] item-avatar
- [ ] item-demo
- [ ] item-dropdown
- [ ] item-group
- [ ] item-header
- [ ] item-icon
- [ ] item-image
- [ ] item-link
- [ ] item-size
- [ ] item-variant

#### Kbd (5)
- [ ] kbd-button
- [ ] kbd-demo
- [ ] kbd-group
- [ ] kbd-input-group
- [ ] kbd-tooltip

#### Label (1)
- [ ] label-demo

#### Menubar (1)
- [ ] menubar-demo

#### Native Select (4)
- [ ] native-select-demo
- [ ] native-select-disabled
- [ ] native-select-groups
- [ ] native-select-invalid

#### Navigation Menu (1)
- [ ] navigation-menu-demo

#### Pagination (1)
- [ ] pagination-demo

#### Popover (1)
- [ ] popover-demo

#### Progress (1)
- [ ] progress-demo

#### Radio Group (1)
- [ ] radio-group-demo

#### Resizable (4)
- [ ] resizable-demo
- [ ] resizable-demo-with-handle
- [ ] resizable-handle
- [ ] resizable-vertical

#### Scroll Area (2)
- [ ] scroll-area-demo
- [ ] scroll-area-horizontal-demo

#### Select (2)
- [ ] select-demo
- [ ] select-scrollable

#### Separator (1)
- [ ] separator-demo

#### Sheet (2)
- [ ] sheet-demo
- [ ] sheet-side

#### Skeleton (2)
- [ ] skeleton-card
- [ ] skeleton-demo

#### Slider (1)
- [ ] slider-demo

#### Sonner (2)
- [ ] sonner-demo
- [ ] sonner-types

#### Spinner (10)
- [ ] spinner-badge
- [ ] spinner-basic
- [ ] spinner-button
- [ ] spinner-color
- [ ] spinner-custom
- [ ] spinner-demo
- [ ] spinner-empty
- [ ] spinner-input-group
- [ ] spinner-item
- [ ] spinner-size

#### Switch (1)
- [ ] switch-demo

#### Table (1)
- [ ] table-demo

#### Tabs (1)
- [ ] tabs-demo

#### Textarea (5)
- [ ] textarea-demo
- [ ] textarea-disabled
- [ ] textarea-with-button
- [ ] textarea-with-label
- [ ] textarea-with-text

#### Toggle (6)
- [ ] toggle-demo
- [ ] toggle-disabled
- [ ] toggle-lg
- [ ] toggle-outline
- [ ] toggle-sm
- [ ] toggle-with-text

#### Toggle Group (7)
- [ ] toggle-group-demo
- [ ] toggle-group-disabled
- [ ] toggle-group-lg
- [ ] toggle-group-outline
- [ ] toggle-group-single
- [ ] toggle-group-sm
- [ ] toggle-group-spacing

#### Tooltip (1)
- [ ] tooltip-demo

#### Typography (14)
- [ ] typography-blockquote
- [ ] typography-demo
- [ ] typography-h1
- [ ] typography-h2
- [ ] typography-h3
- [ ] typography-h4
- [ ] typography-inline-code
- [ ] typography-large
- [ ] typography-lead
- [ ] typography-list
- [ ] typography-muted
- [ ] typography-p
- [ ] typography-small
- [ ] typography-table

## Exclusions

The following examples from new-york-v4 should NOT be migrated (form-specific):

- form-next-*
- form-rhf-*
- form-tanstack-*
- mode-toggle
- native-select-form (uses form)
- input-otp-form (uses form)

## Workflow

Use the `shadcn-ui-demo-creator` agent with the following command pattern:

```
Create demos for {component}: {demo-name-1}, {demo-name-2}, ...
```

The agent will:
1. Read the source from `registry/new-york-v4/examples/{demo-name}.tsx`
2. Create `registry/radix-nova/demo/{demo-name}.tsx` with radix-nova imports
3. Create `registry/base-nova/demo/{demo-name}.tsx` with base-nova imports
4. Update `_registry.ts` in both demo folders
5. Verify the component compiles

## Success Criteria

- [ ] All 227 remaining demos created in both registries
- [ ] All demos compile without errors
- [ ] All demos render correctly in documentation
- [ ] Registry files updated with all entries
