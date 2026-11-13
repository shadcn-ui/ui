# Design Systems from DESIGN.md

Build a new app from a preset, install every component, restyle it from a `DESIGN.md`, then render a design system page.

Trigger phrases: "build me a design system using <preset>", "apply this DESIGN.md", "create a showcase / design system page", "make shadcn look like <brand>".

## Contents

- Inputs to confirm
- Step 1: Scaffold
- Step 2: Install everything
- Step 3: Read the DESIGN.md
- Step 4: Map tokens to the theme
- Step 5: Map component recipes to variants
- Step 6: Build the design system page ([design-system-page.md](./design-system-page.md))
- Step 7: Verify
- Report back

---

## Inputs to Confirm

| Input     | Default                             | Notes                                                                                                                                    |
| --------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Preset    | Optional                            | Code (`b0`), style name (`luma`) or URL. Pass it through. Never decode it by hand. Without one, pick a style (see Step 1).               |
| DESIGN.md | Required                            | A path, URL or pasted content. Copy it into the new app root as `DESIGN.md`.                                                             |
| Template  | `vite`                              | Use `next` when the user says Next.js, App Router or SSR.                                                                                |
| App name  | Derived from the brand in DESIGN.md | Kebab-case.                                                                                                                              |
| Base      | `base`                              | Pass `--base` when no preset code is given. Use `radix` only when the user asks. `info --json` after init decides `render` vs `asChild`. |

If the DESIGN.md path can't be read (macOS privacy blocks `~/Downloads` and `~/Desktop` for some hosts), ask the user to copy it into the working directory. Don't guess its contents.

---

## Step 1: Scaffold

With a preset code from the user:

```bash
npx shadcn@latest init --preset <code> --template vite --name <app> --no-monorepo -y
```

Without one, pick the style whose geometry is closest to the DESIGN.md and pass it with `--base`:

```bash
npx shadcn@latest init --base base --preset <style> --template vite --name <app> --no-monorepo -y
```

Then:

```bash
cd <app>
npx shadcn@latest info --json
```

`init` with neither `--preset` nor `--base` stops at an interactive library prompt, even with `-y`. Always pass one of them, plus `--no-monorepo`.

### Picking a style

The theme gets replaced by the DESIGN.md anyway. The style decides geometry the CSS variables can't reach: control padding, density, how rounded and how raised the components are. Read the DESIGN.md's radius scale, control heights, shadows and layout density, then pick:

| Style  | Character                                             | Pick when the DESIGN.md has                                            |
| ------ | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| `vega` | The classic shadcn/ui look.                           | Neutral, conventional SaaS geometry; nothing extreme.                  |
| `nova` | Reduced padding and margins for compact layouts.      | 32–36px controls, 6–8px radius, hairlines over shadows.                |
| `maia` | Soft and rounded, with generous spacing.              | 40px+ controls, 12px+ card radius, generous padding, editorial pacing. |
| `lyra` | Boxy and sharp.                                       | 0–4px radius, hard edges, mono or technical type.                      |
| `mira` | Compact.                                              | Dense data UIs, 28–32px controls, tight tables.                        |
| `luma` | Rounded geometry, soft elevation, breathable layouts. | Pill buttons, soft layered shadows, glassy or macOS-like surfaces.     |
| `rhea` | Luma, but more compact.                               | Luma's softness with product-UI density.                               |
| `sera` | Editorial and typographic.                            | Serif display type, editorial pacing, magazine-like hierarchy.         |

State the choice and the reason in one line ("Picked maia: 40px controls, 12–16px cards, generous padding"). If the user names a style, use it. Read `base`, `style`, `iconLibrary`, `tailwindCssFile` and `aliases` from `info` before writing any code.

## Step 2: Install Everything

```bash
npx shadcn@latest add --all -y
ls <resolvedPaths.ui>/*.tsx | wc -l
```

Count the component files on disk. Never quote a component count from memory.

Then wire up the providers in the app root:

- Wrap the app in `TooltipProvider`.
- Base UI: wrap the app in `Toaster` from the `toast` component and call `toast.add({ title, description, type })`. Radix: render `<Toaster />` from `sonner`.

Then typecheck the app sources. In Vite apps, the root `tsc --noEmit` checks nothing because the root tsconfig only has project references:

```bash
npx tsc -p tsconfig.app.json --noEmit   # Vite.
npx tsc --noEmit                        # Next.js.
```

Fix generated files that fail strict checks (for example, an unused `React` import) before moving on, or `vite build` will fail.

---

## Step 3: Read the DESIGN.md

DESIGN.md files usually carry YAML frontmatter (`colors`, `typography`, `rounded`, `spacing`, `components`) and prose sections (Overview, Colors, Typography, Layout, Elevation, Shapes, Components, Do's and Don'ts, Responsive, Known Gaps). Some only have prose with `{colors.x}` references. Handle both.

Long files exceed one read. Grep the headings first, then read frontmatter, **Do's and Don'ts**, **Iteration Guide** and **Known Gaps** in full. Those sections hold the rules that override defaults.

Extract into a working table before editing anything:

| Extract               | Look for                                                              |
| --------------------- | --------------------------------------------------------------------- |
| Canvas and ink        | `canvas`, `surface`, `ink`, "page floor", "body text"                 |
| Action color + states | `primary`, `-hover`, `-active`, `-pressed`, `-disabled`, `on-primary` |
| Secondary actions     | `button-secondary` fill, text and border                              |
| Surfaces              | card fills, soft bands, dark product surfaces                         |
| Lines                 | `hairline`, border alpha, "1px solid"                                 |
| Focus                 | outline vs ring, color, width, offset, alpha                          |
| Type families         | display, body, mono, and the documented **substitutes**               |
| Type scale            | size, weight, line height, tracking per token                         |
| Radius scale          | every value and what it applies to                                    |
| Elevation             | each shadow tier, verbatim                                            |
| Control heights       | button, input, ghost, icon-button heights and padding                 |
| Hard rules            | every "Don't" and "never"                                             |

---

## Step 4: Map Tokens to the Theme

Edit only `tailwindCssFile`. Keep hex values when the DESIGN.md gives hex. Don't convert them to OKLCH.

### Role mapping

| DESIGN.md role                               | shadcn variable                                             |
| -------------------------------------------- | ----------------------------------------------------------- |
| canvas / surface / page floor                | `--background`                                              |
| ink / headline text                          | `--foreground`, `--card-foreground`, `--popover-foreground` |
| primary CTA fill / on-primary                | `--primary` / `--primary-foreground`                        |
| primary hover, pressed or active fill        | new `--primary-active` (or `--primary-pressed`)             |
| secondary button fill / text                 | `--secondary` / `--secondary-foreground`                    |
| soft band, alternating section               | `--muted`                                                   |
| secondary or descriptive text                | `--muted-foreground`                                        |
| ghost hover wash, active tab, menu highlight | `--accent` / `--accent-foreground`                          |
| card / feature card fill                     | `--card`                                                    |
| floating layer (menus, dialogs)              | `--popover` (usually the canvas)                            |
| hairline / structural border                 | `--border`, `--input`                                       |
| focus color                                  | `--ring`                                                    |
| error / validation                           | `--destructive`                                             |
| illustration accents                         | `--chart-1` … `--chart-5`, plus named tokens                |
| sidebar or nav rail surface                  | `--sidebar-*`                                               |

Every token without a shadcn slot gets a variable in `:root` (and `.dark` when it changes) and a registration in `@theme inline`:

```css
:root {
  --primary-active: #a9583e;
  --surface-card: #efe9de;
}

@theme inline {
  --color-primary-active: var(--primary-active);
  --color-surface-card: var(--surface-card);
}
```

### Radius

A DESIGN.md radius scale rarely fits the `--radius` multipliers. Pin each step in `@theme inline` instead. These are the classes base-nova components use:

| Class         | Used by                                         |
| ------------- | ----------------------------------------------- |
| `rounded-sm`  | Small accents                                   |
| `rounded-md`  | Menu, select and command items                  |
| `rounded-lg`  | Buttons, inputs, selects, tabs, popovers, menus |
| `rounded-xl`  | Cards, dialogs, command                         |
| `rounded-2xl` | Toasts, large containers                        |
| `rounded-4xl` | Badges (pill)                                   |

```css
@theme inline {
  /* DESIGN.md step → Tailwind class used by that component. */
  --radius-sm: 4px; /* xs: accents. */
  --radius-md: 6px; /* sm: menu items. */
  --radius-lg: 8px; /* md: buttons, inputs. */
  --radius-xl: 12px; /* lg: cards, dialogs. */
  --radius-2xl: 16px; /* xl: toasts, hero containers. */
  --radius-3xl: 16px;
  --radius-4xl: 9999px; /* pill: badges. */
}
```

Replace the existing `--radius-*` lines in `@theme inline` rather than adding a second block. Confirm the classes for the installed style:

```bash
grep -ohE "rounded-(\[[^ \"]+\]|[a-z0-9]+)" <ui>/*.tsx | sort | uniq -c
```

`rounded-[min(var(--radius-md),Npx)]` caps small buttons and select triggers. Edit the cap when the DESIGN.md wants rounder small controls.

### Elevation

Override Tailwind's shadow scale in `@theme`, not `@theme inline`. Copy multi-layer shadows verbatim. Set `--shadow-xs` to `0 0 #0000` when the system is hairline-only, because inputs and outline buttons use it.

```css
@theme {
  --shadow-xs: 0 0 #0000;
  --shadow-sm: 0 1px 3px rgb(20 20 19 / 0.08);
  --shadow-lg: 0 1px 3px rgb(20 20 19 / 0.08), 0 8px 24px rgb(20 20 19 / 0.06);
}
```

### Fonts

Brand fonts are usually licensed. Use the substitutes the DESIGN.md names, installed from Fontsource with the project's package manager, and import every face you reference at the top of the CSS file:

```bash
npm install @fontsource-variable/inter @fontsource-variable/cormorant-garamond @fontsource-variable/jetbrains-mono
```

```css
@import "@fontsource-variable/inter";
@import "@fontsource-variable/cormorant-garamond";
@import "@fontsource-variable/jetbrains-mono";

@theme inline {
  --font-sans: "Inter Variable", -apple-system, system-ui, sans-serif;
  --font-serif: "Cormorant Garamond Variable", Garamond, serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, monospace;
  --font-heading: var(--font-sans);
}
```

`--font-heading` styles small component titles (`CardTitle`, `DialogTitle`, `SheetTitle`). Point it at the display face only when that face reads well at 16px. Otherwise keep it on the sans and use display tokens for page headings.

### Type scale

Turn every typography token into a `type-*` utility. Don't use `--text-*` theme keys for this, because `cn()` treats unknown `text-*` classes as colors and drops whichever comes first when one sits next to `text-muted-foreground`.

```css
@utility type-display-lg {
  font-family: var(--font-serif);
  font-size: clamp(34px, 3vw + 16px, 48px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.021em;
}

@utility type-caption-upper {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
```

- Clamp display sizes so mobile works. Convert pixel tracking to `em` (`-1px / 48px = -0.021em`) so the ratio holds as the size shrinks.
- Respect the rules on tracking (none below a size) and weight (display never bold).

### Dark mode

- **DESIGN.md defines dark surfaces** (product mockups, footers): put them in `.dark`. Because shadcn's `@custom-variant dark (&:is(.dark *))` scopes to descendants, `className="dark"` on any section renders every component inside it with dark tokens. Use it for dark bands, featured pricing cards and footers.
- **DESIGN.md is light-only**: derive `.dark` from the brand's known dark surfaces and tell the user it's derived.

### Focus

Match the documented focus treatment:

- **Ring with alpha** (for example "3px coral at 15%"): replace `ring-ring/50` with the documented alpha on field components (`input`, `textarea`, `input-group`, `select`, `native-select`, `combobox`, `input-otp`).
- **Solid outline with offset**: add an unlayered rule so it beats `outline-none`, and cancel the ring shadow:

```css
:is(
  button,
  a[href],
  [role="button"],
  [role="tab"],
  [role="checkbox"],
  [role="radio"],
  [role="switch"],
  [role="slider"]
):focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  --tw-ring-shadow: 0 0 #0000;
}
```

This covers actions only. Field controls keep their ring. When the DESIGN.md applies the outline to fields too, add `input, textarea, select, [role="combobox"]` to the selector.

---

## Step 5: Map Component Recipes to Variants

Restyle by editing the `cva` variants in the installed component source. Keep existing variant names so usage stays standard. Add a variant only when the DESIGN.md defines a distinct recipe.

| DESIGN.md recipe                     | shadcn target                                |
| ------------------------------------ | -------------------------------------------- |
| `button-primary`                     | `Button` `default`                           |
| `button-secondary` (tinted fill)     | `Button` `secondary`                         |
| `button-secondary` (canvas + border) | `Button` `outline`                           |
| `button-ghost`, nav links            | `Button` `ghost`                             |
| text link                            | `Button` `link`                              |
| circular icon button                 | `Button` `icon*` sizes + `rounded-full`      |
| `badge-pill`, `badge-<accent>`       | `Badge` `secondary`, `default`, new variants |
| `card`, `feature-card`               | `Card` (fill, ring, `--card-spacing`)        |
| `text-input`, `-focused`             | `Input`, `InputGroup`, `Select`, `Textarea`  |
| `category-tab`, filter row           | `Tabs` `default` list + trigger              |

**Control heights move together.** When the button height changes, change the field controls to match, or forms misalign. In base-nova the 32px default lives in:

| File                | Class                            |
| ------------------- | -------------------------------- |
| `button.tsx`        | `h-8`, `size-8` (icon)           |
| `input.tsx`         | `h-8`                            |
| `input-group.tsx`   | `h-8`                            |
| `select.tsx`        | `data-[size=default]:h-8`        |
| `native-select.tsx` | `h-8`                            |
| `combobox.tsx`      | `min-h-8` (chips)                |
| `toggle.tsx`        | `h-8 min-w-8`                    |
| `input-otp.tsx`     | `size-8` (slot)                  |
| `tabs.tsx`          | `group-data-horizontal/tabs:h-8` |
| `menubar.tsx`       | `h-8`                            |
| `command.tsx`       | `h-8!` (input group)             |

Re-grep before editing (`grep -n "\bh-8\b\|size-8\b" <ui>/*.tsx`); other styles use different values.

**States.** Follow the documented states exactly. If the DESIGN.md says "darken on press only", use `active:` instead of `hover:`. Keep hover on ghost buttons and menu items even when the spec omits it, and tell the user you did.

**Hard rules.** Turn each "Don't" into a check before you finish, for example: no radius outside the scale, no accent color on buttons, no bold display type.

---

## Step 6: Build the Design System Page

Follow [design-system-page.md](./design-system-page.md). It sets the section outline, how to present each foundation, the component tiers and block anatomy, pinned state matrices, edge cases, do/don't pairs, and recipes.

In short:

1. Foundations first: color roles as contrast-checked pairs, palette, type specimen table, spacing, radius and elevation ladders.
2. Components by tier: primitives get a variant × state matrix, size ladder and icon row. Composed components get a typical example, additions and edge cases. Overlays get real triggers.
3. Then rendered do/don't pairs for the DESIGN.md's rules, the DESIGN.md's named recipes rebuilt from components, and one example screen.

Copy the helpers from `assets/showcase/` (`preview-states.css`, `state-matrix.tsx`, `color-pair.tsx`). Put sections in `src/showcase/<section>.tsx` (Vite) or `app/design-system/` (Next.js). Write copy in the brand's voice.

### Known traps

| Component           | Trap                                                                        | Fix                                                                         |
| ------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `Command` inline    | cmdk scrolls its first item into view on mount, which jumps the page to it. | Control it: `value={value} onValueChange={setValue}` with initial `"none"`. |
| `Sidebar`           | Default sidebar is `fixed` and escapes the preview frame.                   | `<SidebarProvider className="min-h-0">` + `<Sidebar collapsible="none">`.   |
| `MessageFooter`     | Placed beside `MessageContent`, it becomes a squeezed flex column.          | Put it inside `MessageContent`.                                             |
| `Select` (base)     | `SelectValue` shows the raw value.                                          | Pass `items` to `Select`.                                                   |
| `Resizable`         | react-resizable-panels v4 dropped `direction` and numeric sizes.            | `orientation="horizontal"`, `defaultSize="40%"`.                            |
| `DirectionProvider` | Provider alone doesn't flip layout.                                         | Also set `dir="rtl"` on the wrapper.                                        |
| `NavigationMenu`    | The content is clipped by the example frame.                                | Leave bottom padding in that frame.                                         |
| Header nav links    | `Button` renders a `<button>`.                                              | Base: `nativeButton={false} render={<a href="#…" />}`. Radix: `asChild`.    |

### Coverage check

```bash
node <skill-dir>/scripts/showcase-coverage.mjs src/components/ui src   # Vite.
node <skill-dir>/scripts/showcase-coverage.mjs components/ui app      # Next.js.
```

It lists every component file that no showcase file imports. Fix the list until it's empty. `add --all` installs both `toast` and `sonner` in Base UI projects; show `sonner` in Feedback next to `toast` so the list can reach zero.

---

## Step 7: Verify

Start the dev server and check it in a browser:

1. App typecheck passes (see Step 2).
2. No console errors.
3. Loads at `scrollY === 0`. Anything else means a component is stealing scroll on mount.
4. No horizontal overflow at 375px and 1280px: `document.documentElement.scrollWidth <= innerWidth`.
5. Screenshot the hero, Foundations, one form section and one dark band. Compare against the DESIGN.md: canvas color, CTA color, display font, radius, focus ring.
6. Toggle dark mode once.

---

## Report Back

- App path, dev URL, component count from disk.
- The style picked (when no preset was given) and why.
- What maps where: colors, fonts (and substitutes), radius, shadows, focus.
- Contrast pairs under 4.5:1, including ones the DESIGN.md itself specifies.
- Every component file you edited and why.
- Every deliberate deviation from the DESIGN.md (derived dark mode, kept hover, substituted fonts).
