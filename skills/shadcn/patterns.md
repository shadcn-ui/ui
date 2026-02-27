# Component Patterns

Rules and examples for composing shadcn/ui components.

> **Note:** Examples below use `@/` as the import prefix. Always use the actual `aliasPrefix` from `shadcn info` for the target project. Similarly, icon imports depend on the project's `iconLibrary` — use `lucide-react` for `lucide`, `@tabler/icons-react` for `tabler`, `@phosphor-icons/react` for `phosphor`, etc. Never assume `lucide-react`.

## Contents

- Component selection table
- Forms (FieldGroup, Field, form controls)
- Toggle groups
- Alerts
- Overlays
- Empty states
- Toast notifications

**Base-conditional API differences**: See [base-patterns.md](./base-patterns.md) for `asChild` vs `render`, Select `items` prop, ToggleGroup `type` vs `multiple`, Slider value types, and Accordion differences.

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

Use `ToggleGroup` + `ToggleGroupItem` when the user picks from a small set of options (2–7). Don't manually loop `Button` components with active state. See [base-patterns.md](./base-patterns.md#togglegroup) for `type` vs `multiple` prop differences.

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

<ToggleGroup spacing={2}>
  <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
  <ToggleGroupItem value="interval">Interval</ToggleGroupItem>
</ToggleGroup>
```

Combine with `Field` for labelled toggle groups:

```tsx
<Field orientation="horizontal">
  <FieldTitle id="theme-label">Theme</FieldTitle>
  <ToggleGroup aria-labelledby="theme-label" spacing={2}>
    <ToggleGroupItem value="light">Light</ToggleGroupItem>
    <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
    <ToggleGroupItem value="system">System</ToggleGroupItem>
  </ToggleGroup>
</Field>
```

> **Note:** `defaultValue` and `type`/`multiple` props differ between base and radix. See [base-patterns.md](./base-patterns.md#togglegroup).

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

For className usage, Groups, data-icon, InputGroup, and other composition rules, see the **Critical Rules** section in [SKILL.md](./SKILL.md#critical-rules). For asChild/render and other base-conditional APIs, see [base-patterns.md](./base-patterns.md).
