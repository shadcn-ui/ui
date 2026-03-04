# Component Composition

## Contents

- Items always inside their Group component
- Callouts use Alert
- Empty states use Empty component
- Toast notifications use sonner
- Choosing between overlay components

---

## Items always inside their Group component

Never render items directly inside the content container.

**Incorrect:**

```tsx
<SelectContent>
  <SelectItem value="apple">Apple</SelectItem>
  <SelectItem value="banana">Banana</SelectItem>
</SelectContent>
```

**Correct:**

```tsx
<SelectContent>
  <SelectGroup>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectGroup>
</SelectContent>
```

This applies to all group-based components:

| Item | Group |
|------|-------|
| `SelectItem`, `SelectLabel` | `SelectGroup` |
| `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSub` | `DropdownMenuGroup` |
| `MenubarItem` | `MenubarGroup` |
| `ContextMenuItem` | `ContextMenuGroup` |
| `CommandItem` | `CommandGroup` |

---

## Callouts use Alert

Don't build custom styled `div` containers for info/warning messages.

**Incorrect:**

```tsx
<div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
  <p className="text-sm font-medium text-yellow-800">Warning</p>
  <p className="text-sm text-yellow-700">Something needs attention.</p>
</div>
```

**Correct:**

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

<Alert>
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Something needs attention.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

---

## Empty states use Empty component

Don't build custom empty state markup.

**Incorrect:**

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <FolderIcon className="size-10 text-muted-foreground" />
  <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
  <p className="mt-2 text-sm text-muted-foreground">Get started by creating a new project.</p>
  <Button className="mt-4">Create Project</Button>
</div>
```

**Correct:**

```tsx
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon"><FolderIcon /></EmptyMedia>
    <EmptyTitle>No projects yet</EmptyTitle>
    <EmptyDescription>Get started by creating a new project.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Create Project</Button>
  </EmptyContent>
</Empty>
```

---

## Toast notifications use sonner

Don't build custom toast/notification markup.

**Incorrect:**

```tsx
const [showToast, setShowToast] = useState(false)

{showToast && (
  <div className="fixed bottom-4 right-4 rounded-md bg-primary p-4 text-primary-foreground">
    Changes saved.
  </div>
)}
```

**Correct:**

```tsx
import { toast } from "sonner"

toast.success("Changes saved.")
toast.error("Something went wrong.")
toast("File deleted.", {
  action: { label: "Undo", onClick: () => undoDelete() },
})
```

---

## Choosing between overlay components

Don't default to `Dialog` for everything. **When recommending an overlay, always show the full component structure with all required subcomponents.**

**Incorrect:**

```tsx
<Dialog>
  <DialogTrigger>Delete</DialogTrigger>
  <DialogContent>
    <p>Are you sure?</p>
    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
  </DialogContent>
</Dialog>
```

**Correct:**

```tsx
<AlertDialog>
  <AlertDialogTrigger>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Quick reference:**

| Use case | Component |
|----------|-----------|
| Focused task that requires input | `Dialog` |
| Destructive action confirmation | `AlertDialog` |
| Side panel with details or filters | `Sheet` |
| Mobile-first bottom panel | `Drawer` |
| Quick info on hover | `HoverCard` |
| Small contextual content on click | `Popover` |
