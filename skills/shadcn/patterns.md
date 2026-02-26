# Component Patterns

Rules and examples for composing shadcn/ui components.

> **Note:** Examples below use `@/` as the import prefix. Always use the actual `aliasPrefix` from `shadcn info` for the target project. Similarly, icon imports depend on the project's `iconLibrary` — use `lucide-react` for `lucide`, `@tabler/icons-react` for `tabler`, `@phosphor-icons/react` for `phosphor`, etc. Never assume `lucide-react`.

---

## Component Selection

| Need | Use |
|------|-----|
| Button/action | `Button` with appropriate variant |
| Form inputs | `Input`, `Select`, `Combobox`, `Switch`, `Checkbox`, `RadioGroup`, `Textarea`, `InputOTP`, `Slider` |
| Toggle between 2–5 options | `ToggleGroup` + `ToggleGroupItem` |
| Data display | `Table`, `Card`, `Badge`, `Avatar` |
| Navigation | `Sidebar`, `NavigationMenu`, `Breadcrumb`, `Tabs`, `Pagination` |
| Overlays | `Dialog` (modal), `Sheet` (side panel), `Drawer` (bottom sheet), `AlertDialog` (confirmation) |
| Feedback | `sonner` (toast), `Alert`, `Progress`, `Skeleton`, `Spinner` |
| Command palette | `Command` inside `Dialog` |
| Charts | `Chart` (wraps Recharts) |
| Layout | `Card`, `Separator`, `Resizable`, `ScrollArea`, `Accordion`, `Collapsible` |
| Empty states | `Empty` |
| Menus | `DropdownMenu`, `ContextMenu`, `Menubar` |
| Tooltips/info | `Tooltip`, `HoverCard`, `Popover` |

---

## Forms

Always use `FieldGroup` and `Field` to structure forms. Never use raw `div` with `grid`/`gap` or `space-y-*` for form layout. Use `FieldLabel` for labelled inputs, `FieldTitle` for section headings, and `FieldDescription` for helper text.

```tsx
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

<form>
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" type="email" placeholder="you@example.com" />
    </Field>
    <Field>
      <FieldLabel htmlFor="password">Password</FieldLabel>
      <Input id="password" type="password" />
    </Field>
    <Field>
      <FieldTitle>Role</FieldTitle>
      <FieldDescription>Select the user's role in the organization.</FieldDescription>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
    <Field>
      <FieldLabel htmlFor="bio">Bio</FieldLabel>
      <Textarea id="bio" placeholder="Tell us about yourself" />
    </Field>
    <Button type="submit" className="w-full">Sign In</Button>
  </FieldGroup>
</form>
```

Use `Field orientation="horizontal"` for inline label + control layouts (e.g. settings pages). Use `FieldLabel className="sr-only"` for inputs that don't need a visible label but still need one for accessibility.

**Choosing form controls:**

- Simple text input → `Input`
- Dropdown with predefined options → `Select`
- Searchable dropdown → `Combobox`
- Native HTML select (no JS) → `native-select`
- Boolean toggle → `Switch` (for settings) or `Checkbox` (for forms)
- Single choice from few options → `RadioGroup`
- Toggle between 2–5 options → `ToggleGroup` + `ToggleGroupItem`
- OTP/verification code → `InputOTP`
- Multi-line text → `Textarea`

---

## Toggle Groups

Use `ToggleGroup` + `ToggleGroupItem` when the user picks from a small set of options (2–7). Don't manually loop `Button` components with active state.

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Single selection (e.g. schedule type).
<ToggleGroup defaultValue={["daily"]} spacing={2}>
  <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
  <ToggleGroupItem value="interval">Interval</ToggleGroupItem>
</ToggleGroup>

// Multi-selection (e.g. weekday picker).
<ToggleGroup value={activeDays} onValueChange={setActiveDays} spacing={2}>
  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
    <ToggleGroupItem key={day} value={day} className="size-7 rounded-full text-xs">
      {day}
    </ToggleGroupItem>
  ))}
</ToggleGroup>
```

Combine with `Field` for labelled toggle groups:

```tsx
<Field orientation="horizontal">
  <FieldTitle id="theme-label">Theme</FieldTitle>
  <ToggleGroup aria-labelledby="theme-label" defaultValue={["system"]} spacing={2}>
    <ToggleGroupItem value="light">Light</ToggleGroupItem>
    <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
    <ToggleGroupItem value="system">System</ToggleGroupItem>
  </ToggleGroup>
</Field>
```

---

## Alerts

Use `Alert` for informational callouts. Don't build custom styled `div` containers for info/warning messages.

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

<Alert>
  <AlertDescription>
    Automations run with your default sandbox settings.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

---

## Overlays

- Focused task that requires input → `Dialog`
- Destructive action confirmation → `AlertDialog`
- Side panel with details or filters → `Sheet`
- Mobile-first bottom panel → `Drawer`
- Quick info on hover → `HoverCard`
- Small contextual content on click → `Popover`

---

## Empty States

Use the `Empty` component when there's no data to display.

```tsx
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions } from "@/components/ui/empty"

<Empty>
  <EmptyIcon>{/* icon */}</EmptyIcon>
  <EmptyTitle>No projects yet</EmptyTitle>
  <EmptyDescription>Get started by creating a new project.</EmptyDescription>
  <EmptyActions>
    <Button>Create Project</Button>
  </EmptyActions>
</Empty>
```

---

## Toast Notifications

Use `sonner`. Call `toast()` from anywhere.

```tsx
import { toast } from "sonner"

toast.success("Changes saved.")
toast.error("Something went wrong.")
toast("File deleted.", {
  action: { label: "Undo", onClick: () => undoDelete() },
})
```

---

## Composition Rules

1. **Use `asChild` (radix) or `render` (base) for custom triggers.** Don't wrap triggers in extra elements. Check the `base` field from `shadcn info` to determine which prop to use.

2. **Use `Field` components for forms, not raw divs.** Never use `div` with `space-y-*` or `grid gap-*` for form layout. Use `FieldGroup` for the form container and `Field` for each control. Use `FieldLabel` for labelled inputs, `FieldTitle` for headings, `FieldDescription` for helper text.

3. **Use existing UI components before custom markup.** Before writing a styled `div`, check if a component already exists: `Alert` for callouts, `ToggleGroup` for option sets, `Empty` for empty states, etc.

4. **Use `className` for layout, not styling.** Add layout utilities (`w-full`, `grid`, `flex`, `gap-*`) but avoid overriding component colors or typography.

5. **Prefer built-in variants.** Use `variant="outline"`, `variant="ghost"`, `size="sm"` etc. before adding custom classes.

6. **Compose, don't customize.** Build complex UIs by composing multiple simple components rather than heavily customizing a single one.

7. **Add `"use client"` at RSC boundaries.** When `isRSC` is `true` (from `shadcn info`), components that use `useState`, `useEffect`, event handlers (`onClick`, `onChange`, etc.), or browser APIs must start with `"use client"`. Keep client boundaries as low in the tree as possible.

8. **Keep components small and focused.** A component should render itself and its own interactions (e.g. a card + its dialog). Page-level layout, data arrays, and loops belong in the page, not the component.

9. **Pass data directly, not keys.** When passing icons or other references through props, pass the actual objects (e.g. `icon={ComputerTerminal01Icon}`), not string keys to a lookup map.

10. **Always wrap items and labels in a Group.** For menu-like components, items, labels, and subs must be direct children of their group component. Never place them directly inside the content container.
   - `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSub` → inside `DropdownMenuGroup`
   - `MenubarItem`, `MenubarLabel`, `MenubarSub` → inside `MenubarGroup`
   - `ContextMenuItem`, `ContextMenuLabel`, `ContextMenuSub` → inside `ContextMenuGroup`
   - `SelectItem`, `SelectLabel` → inside `SelectGroup`
   - `CommandItem` → inside `CommandGroup`

11. **Always use `data-icon` on icons inside buttons.** When placing an icon inside a `Button`, add `data-icon="inline-start"` for prefix icons or `data-icon="inline-end"` for suffix icons. This ensures correct spacing. Never add sizing classes to the icon — the button handles sizing automatically.

12. **Always use `InputGroupInput` and `InputGroupTextarea` inside an `InputGroup`.** Never use the base `Input` or `Textarea` components directly inside an `InputGroup`. The input-group variants reset borders, backgrounds, and focus rings to compose correctly within the group.

13. **Buttons inside inputs use `InputGroup` + `InputGroupAddon`.** Never place a `Button` directly inside or adjacent to an `Input` with custom positioning. Wrap in `InputGroup` and use `InputGroupAddon` for the button.

14. **`InputGroupAddon` must use `InputGroupButton`.** Never place a raw `Button` inside `InputGroupAddon`. Always use `InputGroupButton` instead.

15. **`InputGroupButton` sizing depends on addon alignment.** When `InputGroupAddon` is `align="inline-start"` or `align="inline-end"`, prefer `size="icon-sm"` or `size="icon-xs"` (icon-only buttons). When `align="block-start"` or `align="block-end"`, prefer `size="xs"` or `size="sm"` (buttons with text).
