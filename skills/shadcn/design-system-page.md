# The Design System Page

What goes on a design system page, and how to show it. Distilled from Primer, Carbon, Atlassian, GitLab Pajamas, Cloudscape, Twilio Paste, Salesforce Lightning, Material 3, Evergreen and Orbit, and from EightShapes' component documentation guidance.

## Contents

- Principles
- Page outline
- Foundations
- Components: tiers and block anatomy
- States without interaction
- Edge cases
- Do and Don't
- Recipes and example screens
- Helpers
- Checklist

---

## Principles

1. **Foundations, then components, then compositions.** Every mature system follows this order (Primer, Carbon, Paste, Cloudscape, M3).
2. **Roles, not palettes.** Show each color as a surface paired with its foreground and the measured contrast. The raw palette comes second.
3. **Lead with the typical case.** Each component opens with its most common use in real content. Then come variants in priority order, then shared axes (size, icon), then states.
4. **Pin states so reviewers can see them.** Hover, focus and pressed render side by side without interaction. Use one consistent label, and never put the state name inside the component.
5. **Don't render every combination.** Primitives get a variant × state matrix. Composed components get a typical example plus additions. Exhaustive combinations belong in tests (Material 3 cut its list kit from 700+ variants to about 45).
6. **Real content in the brand's voice.** No lorem ipsum. Include the awkward cases: long text, empty, error, loading.
7. **Composition proves the system.** End with the DESIGN.md's own recipes and one realistic screen built only from the tokens and components.
8. **Make the DESIGN.md's rules visible.** Turn its Do's and Don'ts into rendered do/don't pairs.

---

## Page Outline

| #   | Section                    | Contents                                                                                                                             |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Header                     | System name, "Themed from DESIGN.md", section anchors, light/dark toggle, primary CTA.                                               |
| 2   | Overview                   | The DESIGN.md hero recipe: display type, one-line personality, its signature artifact.                                               |
| 3   | Foundations                | Color roles, palette, typography, spacing, radius, elevation, motion (if specified), icons.                                          |
| 4   | Actions                    | Button, ButtonGroup, Toggle, ToggleGroup, Badge, Kbd.                                                                                |
| 5   | Inputs                     | Field, Input, InputGroup, Textarea, Select, NativeSelect, Combobox, Checkbox, RadioGroup, Switch, Slider, InputOTP, Calendar, Label. |
| 6   | Navigation                 | Tabs, Breadcrumb, Pagination, NavigationMenu, Menubar, Sidebar.                                                                      |
| 7   | Data display               | Card, Table, Chart, Item, Avatar, Accordion, Collapsible, Carousel, ScrollArea, Resizable, AspectRatio, Separator.                   |
| 8   | Feedback                   | Alert, toast (and Sonner in Base UI projects), Progress, Spinner, Skeleton, Empty.                                                   |
| 9   | Overlays                   | Dialog, AlertDialog, Sheet, Drawer, Popover, HoverCard, Tooltip, DropdownMenu, ContextMenu, Command.                                 |
| 10  | Conversation               | MessageScroller, Message, Bubble, Attachment, Marker, Questionnaire. See [rules/chat.md](./rules/chat.md).                           |
| 11  | Do and Don't               | Rendered pairs for the DESIGN.md's rules.                                                                                            |
| 12  | Recipes and example screen | The DESIGN.md's named components, then one realistic screen.                                                                         |
| 13  | Footer                     | The DESIGN.md footer recipe.                                                                                                         |

DirectionProvider goes wherever RTL matters (an RTL row in Inputs or Navigation).

Alternate section surfaces the way the DESIGN.md paces its bands. Use `className="dark"` on a section to render a dark band with the same components.

---

## Foundations

### Color roles

A grid of pairs, each rendered as the surface with "Aa" in its foreground color, plus the token names, resolved value and measured contrast (Paste, Material 3, Pajamas):

| Pair                                  | Required     |
| ------------------------------------- | ------------ |
| `background` / `foreground`           | Yes          |
| `card` / `card-foreground`            | Yes          |
| `popover` / `popover-foreground`      | Yes          |
| `primary` / `primary-foreground`      | Yes          |
| `secondary` / `secondary-foreground`  | Yes          |
| `muted` / `muted-foreground`          | Yes          |
| `accent` / `accent-foreground`        | Yes          |
| `destructive` on `background`         | Yes          |
| Each extra text token on `background` | When defined |

Use `ColorPair` from the helpers. It measures contrast live and re-measures when the theme changes. Report any pair below 4.5:1 for body-size text, even when the DESIGN.md specifies it. A brand primary at 3:1 behind 14px labels is a real finding.

### Palette

Swatches grouped the way the DESIGN.md groups them (brand, surfaces, text, status, accents). Label each with its DESIGN.md name and token, for example "Warm Stone · `surface-warm`". Show `border`, `input`, `ring`, `chart-1…5` and `sidebar-*` here too.

### Typography

A specimen table, one row per type token (Cloudscape, Carbon, Atlassian):

| Column   | Content                                           |
| -------- | ------------------------------------------------- |
| Token    | `type-display-lg`                                 |
| Spec     | size / line height / weight / tracking            |
| Use      | "Section heads", taken from the DESIGN.md         |
| Specimen | Real copy set in the token, truncated to one line |

Group the rows display → title → body → label/caption → code. Below the table, show one paragraph of running text at body size, with a link and inline code, so line length and rhythm are visible.

### Spacing

The base unit and the scale as labeled horizontal bars (Carbon, Atlassian), then a semantic ladder: inside a component, between related items, between groups, between sections (Pajamas). Skip it if the DESIGN.md defines no spacing.

### Radius

The same box at every step, labeled with the token, the value and what uses it (Material 3). Example: `md · 8px · buttons, inputs`.

### Elevation

Each level as a raised surface with the components that rest there (Pajamas, Material 3): flat for canvas and bands, hairline for cards, soft for popovers and menus, deep for dialogs.

### Motion and icons

Show motion only if the DESIGN.md defines durations or easings: a table of token, milliseconds and use. For icons, show one row with the icon library at each size used by components, in `foreground` and `muted-foreground`.

---

## Components: Tiers and Block Anatomy

### Tiers

| Tier         | Components                                                                                                                                                                                                            | How to show                                                         |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Primitives   | Button, Badge, Toggle, ToggleGroup, Input, Textarea, Select, NativeSelect, Checkbox, RadioGroup, Switch, Slider, Tabs                                                                                                 | Variant × state matrix, size ladder, icon row.                      |
| Fields       | Field, InputGroup, Combobox, InputOTP, Calendar, Label                                                                                                                                                                | Typical field, then description, error, disabled, required.         |
| Composed     | Card, Table, Item, Avatar, Alert, Empty, toast, Sonner, Accordion, Collapsible, Breadcrumb, Pagination, Progress, Skeleton, Spinner, Carousel, Chart, ScrollArea, Resizable, AspectRatio, Separator, Kbd, ButtonGroup | Typical example, then one element added at a time, then edge cases. |
| Overlays     | Dialog, AlertDialog, Sheet, Drawer, Popover, HoverCard, Tooltip, DropdownMenu, ContextMenu, Menubar, NavigationMenu, Command                                                                                          | A real trigger per overlay, labeled with what it opens.             |
| Shell        | Sidebar, DirectionProvider                                                                                                                                                                                            | Inline in a framed preview (`collapsible="none"`).                  |
| Conversation | MessageScroller, Message, Bubble, Attachment, Marker, Questionnaire                                                                                                                                                   | One realistic thread, then variant rows.                            |

### Block anatomy

Each component block, in this order. Skip the parts that don't apply:

1. **Name and one line on when to use it.** Take the wording from the DESIGN.md recipe when there is one.
2. **Typical example** in real content.
3. **Variants** in priority order (primary before secondary before ghost), each with a one-line "when".
4. **Sizes** as a ladder, smallest to largest.
5. **With icon**: leading, trailing, icon-only.
6. **States**: the matrix for primitives, single examples for the rest.
7. **Edge cases** (see below).

Wide components (Table, NavigationMenu, Menubar, Sidebar, Chart, MessageScroller) span the full row.

---

## States Without Interaction

Pin interaction states with a `data-preview` attribute. Override the hover, focus-visible and active variants so each also matches the attribute. Copy [assets/showcase/preview-states.css](./assets/showcase/preview-states.css) into `tailwindCssFile`:

```css
@custom-variant hover {
  @media (hover: hover) {
    &:hover {
      @slot;
    }
  }
  &[data-preview~="hover"] {
    @slot;
  }
}
@custom-variant focus-visible (&:focus-visible, &[data-preview~="focus"]);
@custom-variant active (&:active, &[data-preview~="active"]);
```

If the theme adds an unlayered focus rule (for an outline-style focus), add `[data-preview~="focus"]` to its selector too.

Render the matrix with `StateMatrix` and `previewState` from the helpers:

```tsx
const variants = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const

<StateMatrix
  rows={variants}
  render={(variant, state) => (
    <Button variant={variant} {...previewState(state)}>
      Save draft
    </Button>
  )}
/>
```

The columns are default, hover, focus, active and disabled. Add `loading` with Spinner + `disabled` for Button, and `invalid` (`aria-invalid`) for fields:

```tsx
<StateMatrix
  rows={["input"] as const}
  states={["default", "hover", "focus", "disabled", "invalid"]}
  render={(_, state) => (
    <Input
      placeholder="you@company.com"
      aria-invalid={state === "invalid" || undefined}
      {...previewState(state)}
    />
  )}
/>
```

If the DESIGN.md says a state doesn't change ("primary darkens on press only"), leave that column identical. The matrix shows the spec is followed.

---

## Edge Cases

Show these next to the component they stress:

| Case          | Where                                                                     |
| ------------- | ------------------------------------------------------------------------- |
| Long text     | Button label, Badge, Item title, Table cell, Breadcrumb (truncation).     |
| Empty         | Table with no rows → Empty, Combobox with no matches, empty Command.      |
| Error         | Field with FieldError, Alert destructive, Attachment `state="error"`.     |
| Loading       | Button with Spinner, Skeleton for Card and Item, Progress, toast loading. |
| Many items    | AvatarGroup with count, Pagination with ellipsis, ScrollArea list.        |
| Missing image | Avatar falling back to AvatarFallback.                                    |
| Disabled      | Every field and its Field `data-disabled`.                                |
| RTL           | One row inside `DirectionProvider` with `dir="rtl"`.                      |

---

## Do and Don't

Pick the two to four DESIGN.md rules that are easiest to break and render each as a pair (Primer, Orbit, Carbon):

```tsx
<div className="grid gap-4 md:grid-cols-2">
  <Example title="Do">
    <Button>Get started</Button>
    <Button variant="outline">Contact sales</Button>
  </Example>
  <Example title="Don't">
    <Button>Get started</Button>
    <Button>Contact sales</Button>
  </Example>
</div>
```

Caption each with the rule in one line, for example "One primary action per group." Mark Don't with `destructive` text, not a new color.

---

## Recipes and Example Screens

**Recipes.** Build each named component in the DESIGN.md (`hero-band`, `feature-card`, `pricing-tier-card`, `callout-card-coral`, `footer`) from shadcn components and tokens. These are the spec's acceptance tests. If a recipe can't be built without raw values, the token mapping is incomplete.

**Example screen.** One realistic screen in the brand's domain (Cloudscape demos, Paste page templates): a settings page (FieldGroup, Switch, Select, Button) or a list view (Table, Badge, Pagination, Empty). Use only tokens and components.

---

## Helpers

Copy from `assets/showcase/` into the showcase folder:

| File                 | Purpose                                                                    |
| -------------------- | -------------------------------------------------------------------------- |
| `preview-states.css` | Variant overrides that pin hover, focus and active through `data-preview`. |
| `state-matrix.tsx`   | `StateMatrix` (labeled variant × state table) and `previewState(state)`.   |
| `color-pair.tsx`     | `ColorPair`: surface + foreground with live contrast ratio and WCAG level. |

They import `cn` from `@/lib/utils`. Rewrite that path to the project's `utils` alias.

---

## Checklist

- [ ] Every installed component renders (run the coverage script).
- [ ] Color roles shown as pairs with contrast; any pair under 4.5:1 is noted in the report.
- [ ] Type specimen covers every DESIGN.md type token, in real copy.
- [ ] Radius and elevation ladders name the components that use each step.
- [ ] Primitives have a state matrix; Button and fields include loading and invalid.
- [ ] Edge cases: long text, empty, error, loading, missing image.
- [ ] Do/Don't pairs for the DESIGN.md's key rules.
- [ ] DESIGN.md recipes rebuilt, plus one example screen.
- [ ] Page-level theme toggle works, and at least one scoped dark band if the DESIGN.md has dark surfaces.
- [ ] No lorem ipsum, and no state names inside components.
