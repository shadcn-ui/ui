---
title: Sidebar
description: A composable, themeable and customizable sidebar component.
base: radix
component: true
---

import { ExternalLinkIcon } from "lucide-react"

<figure className="flex flex-col gap-4">
  <ComponentPreview
    styleName="radix-nova"
    name="sidebar-demo"
    type="block"
    className="w-full"
  />
  <figcaption className="text-center text-sm text-gray-500">
    A sidebar that collapses to icons.
  </figcaption>
</figure>

Sidebars are one of the most complex components to build. They are central
to any application and often contain a lot of moving parts.

We now have a solid foundation to build on top of. Composable. Themeable.
Customizable.

[Browse the Blocks Library](/blocks).

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add sidebar
```

</TabsContent>

<TabsContent value="manual">

<ComponentSource
  name="sidebar"
  title="components/ui/sidebar.tsx"
  styleName="radix-nova"
/>

</TabsContent>

</CodeTabs>

## Structure

A `Sidebar` component is composed of the following parts:

- `SidebarProvider` - Handles collapsible state.
- `Sidebar` - The sidebar container.
- `SidebarHeader` and `SidebarFooter` - Sticky at the top and bottom of the sidebar.
- `SidebarContent` - Scrollable content.
- `SidebarGroup` - Section within the `SidebarContent`.
- `SidebarTrigger` - Trigger for the `Sidebar`.

<Image
  src="/images/sidebar-structure.png"
  width="716"
  height="420"
  alt="Sidebar Structure"
  className="mt-6 w-full overflow-hidden rounded-lg border dark:hidden"
/>
<Image
  src="/images/sidebar-structure-dark.png"
  width="716"
  height="420"
  alt="Sidebar Structure"
  className="mt-6 hidden w-full overflow-hidden rounded-lg border dark:block"
/>

## Usage

```tsx showLineNumbers title="app/layout.tsx"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
```

```tsx showLineNumbers title="components/app-sidebar.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
```

## SidebarProvider

The `SidebarProvider` component is used to provide the sidebar context to the `Sidebar` component. You should always wrap your application in a `SidebarProvider` component.

### Props

| Name           | Type                      | Description                                  |
| -------------- | ------------------------- | -------------------------------------------- |
| `defaultOpen`  | `boolean`                 | Default open state of the sidebar.           |
| `open`         | `boolean`                 | Open state of the sidebar (controlled).      |
| `onOpenChange` | `(open: boolean) => void` | Sets open state of the sidebar (controlled). |

### Width

If you have a single sidebar in your application, you can use the `SIDEBAR_WIDTH` and `SIDEBAR_WIDTH_MOBILE` variables in `sidebar.tsx` to set the width of the sidebar.

```tsx showLineNumbers title="components/ui/sidebar.tsx"
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
```

For multiple sidebars in your application, you can use the `--sidebar-width` and `--sidebar-width-mobile` CSS variables in the `style` prop.

```tsx showLineNumbers
<SidebarProvider
  style={{
    "--sidebar-width": "20rem",
    "--sidebar-width-mobile": "20rem",
  }}
>
  <Sidebar />
</SidebarProvider>
```

### Keyboard Shortcut

To trigger the sidebar, you use the `cmd+b` keyboard shortcut on Mac and `ctrl+b` on Windows.

```tsx showLineNumbers title="components/ui/sidebar.tsx"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
```

## Sidebar

The main `Sidebar` component used to render a collapsible sidebar.

### Props

| Property      | Type                              | Description                       |
| ------------- | --------------------------------- | --------------------------------- |
| `side`        | `left` or `right`                 | The side of the sidebar.          |
| `variant`     | `sidebar`, `floating`, or `inset` | The variant of the sidebar.       |
| `collapsible` | `offcanvas`, `icon`, or `none`    | Collapsible state of the sidebar. |

| Prop        | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `offcanvas` | A collapsible sidebar that slides in from the left or right. |
| `icon`      | A sidebar that collapses to icons.                           |
| `none`      | A non-collapsible sidebar.                                   |

<Callout>
  **Note:** If you use the `inset` variant, remember to wrap your main content
  in a `SidebarInset` component.
</Callout>

```tsx showLineNumbers
<SidebarProvider>
  <Sidebar variant="inset" />
  <SidebarInset>
    <main>{children}</main>
  </SidebarInset>
</SidebarProvider>
```

## useSidebar

The `useSidebar` hook is used to control the sidebar.

```tsx showLineNumbers
import { useSidebar } from "@/components/ui/sidebar"

export function AppSidebar() {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar()
}
```

| Property        | Type                      | Description                                   |
| --------------- | ------------------------- | --------------------------------------------- |
| `state`         | `expanded` or `collapsed` | The current state of the sidebar.             |
| `open`          | `boolean`                 | Whether the sidebar is open.                  |
| `setOpen`       | `(open: boolean) => void` | Sets the open state of the sidebar.           |
| `openMobile`    | `boolean`                 | Whether the sidebar is open on mobile.        |
| `setOpenMobile` | `(open: boolean) => void` | Sets the open state of the sidebar on mobile. |
| `isMobile`      | `boolean`                 | Whether the sidebar is on mobile.             |
| `toggleSidebar` | `() => void`              | Toggles the sidebar. Desktop and mobile.      |

## SidebarHeader

Use the `SidebarHeader` component to add a sticky header to the sidebar.

```tsx showLineNumbers title="components/app-sidebar.tsx"
<Sidebar>
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              Select Workspace
              <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
            <DropdownMenuItem>
              <span>Acme Inc</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
</Sidebar>
```

## SidebarFooter

Use the `SidebarFooter` component to add a sticky footer to the sidebar.

```tsx showLineNumbers
<Sidebar>
  <SidebarFooter>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <User2 /> Username
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarFooter>
</Sidebar>
```

## SidebarContent

The `SidebarContent` component is used to wrap the content of the sidebar. This is where you add your `SidebarGroup` components. It is scrollable.

```tsx showLineNumbers
<Sidebar>
  <SidebarContent>
    <SidebarGroup />
    <SidebarGroup />
  </SidebarContent>
</Sidebar>
```

## SidebarGroup

Use the `SidebarGroup` component to create a section within the sidebar.

A `SidebarGroup` has a `SidebarGroupLabel`, a `SidebarGroupContent` and an optional `SidebarGroupAction`.

```tsx showLineNumbers
<SidebarGroup>
  <SidebarGroupLabel>Application</SidebarGroupLabel>
  <SidebarGroupAction>
    <Plus /> <span className="sr-only">Add Project</span>
  </SidebarGroupAction>
  <SidebarGroupContent></SidebarGroupContent>
</SidebarGroup>
```

To make a `SidebarGroup` collapsible, wrap it in a `Collapsible`.

```tsx showLineNumbers
<Collapsible defaultOpen className="group/collapsible">
  <SidebarGroup>
    <SidebarGroupLabel asChild>
      <CollapsibleTrigger>
        Help
        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
      </CollapsibleTrigger>
    </SidebarGroupLabel>
    <CollapsibleContent>
      <SidebarGroupContent />
    </CollapsibleContent>
  </SidebarGroup>
</Collapsible>
```

## SidebarMenu

The `SidebarMenu` component is used for building a menu within a `SidebarGroup`.

<Image
  src="/images/sidebar-menu.png"
  width="716"
  height="420"
  alt="Sidebar Menu"
  className="mt-6 w-full overflow-hidden rounded-lg border dark:hidden"
/>
<Image
  src="/images/sidebar-menu-dark.png"
  width="716"
  height="420"
  alt="Sidebar Menu"
  className="mt-6 hidden w-full overflow-hidden rounded-lg border dark:block"
/>

```tsx showLineNumbers
<SidebarMenu>
  {projects.map((project) => (
    <SidebarMenuItem key={project.name}>
      <SidebarMenuButton asChild>
        <a href={project.url}>
          <project.icon />
          <span>{project.name}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))}
</SidebarMenu>
```

## SidebarMenuButton

The `SidebarMenuButton` component is used to render a menu button within a `SidebarMenuItem`.

By default, the `SidebarMenuButton` renders a button but you can use the `asChild` prop to render a different component such as a `Link` or an `a` tag.

Use the `isActive` prop to mark a menu item as active.

```tsx showLineNumbers
<SidebarMenuButton asChild isActive>
  <a href="#">Home</a>
</SidebarMenuButton>
```

## SidebarMenuAction

The `SidebarMenuAction` component is used to render a menu action within a `SidebarMenuItem`.

```tsx showLineNumbers
<SidebarMenuItem>
  <SidebarMenuButton asChild>
    <a href="#">
      <Home />
      <span>Home</span>
    </a>
  </SidebarMenuButton>
  <SidebarMenuAction>
    <Plus /> <span className="sr-only">Add Project</span>
  </SidebarMenuAction>
</SidebarMenuItem>
```

## SidebarMenuSub

The `SidebarMenuSub` component is used to render a submenu within a `SidebarMenu`.

```tsx showLineNumbers
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuSub>
    <SidebarMenuSubItem>
      <SidebarMenuSubButton />
    </SidebarMenuSubItem>
  </SidebarMenuSub>
</SidebarMenuItem>
```

## SidebarMenuBadge

The `SidebarMenuBadge` component is used to render a badge within a `SidebarMenuItem`.

```tsx showLineNumbers
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuBadge>24</SidebarMenuBadge>
</SidebarMenuItem>
```

## SidebarMenuSkeleton

The `SidebarMenuSkeleton` component is used to render a skeleton for a `SidebarMenu`.

```tsx showLineNumbers
<SidebarMenu>
  {Array.from({ length: 5 }).map((_, index) => (
    <SidebarMenuItem key={index}>
      <SidebarMenuSkeleton />
    </SidebarMenuItem>
  ))}
</SidebarMenu>
```

## SidebarTrigger

Use the `SidebarTrigger` component to render a button that toggles the sidebar.

```tsx showLineNumbers
import { useSidebar } from "@/components/ui/sidebar"

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar()

  return <button onClick={toggleSidebar}>Toggle Sidebar</button>
}
```

## SidebarRail

The `SidebarRail` component is used to render a rail within a `Sidebar`. This rail can be used to toggle the sidebar.

```tsx showLineNumbers
<Sidebar>
  <SidebarHeader />
  <SidebarContent>
    <SidebarGroup />
  </SidebarContent>
  <SidebarFooter />
  <SidebarRail />
</Sidebar>
```

## Controlled Sidebar

Use the `open` and `onOpenChange` props to control the sidebar.

```tsx showLineNumbers
export function AppSidebar() {
  const [open, setOpen] = React.useState(false)

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar />
    </SidebarProvider>
  )
}
```

## Theming

We use the following CSS variables to theme the sidebar.

```css
@layer base {
  :root {
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 0 0% 98%;
    --sidebar-primary-foreground: 240 5.9% 10%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}
```

## Styling

Here are some tips for styling the sidebar based on different states.

```tsx
<Sidebar collapsible="icon">
  <SidebarContent>
    <SidebarGroup className="group-data-[collapsible=icon]:hidden" />
  </SidebarContent>
</Sidebar>
```

```tsx
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuAction className="peer-data-[active=true]/menu-button:opacity-100" />
</SidebarMenuItem>
```

## RTL

To enable RTL support in shadcn/ui, see the [RTL configuration guide](/docs/rtl).

{/* prettier-ignore */}
<Button asChild size="sm" className="mt-6">
  <a href="/view/radix-nova/sidebar-rtl" target="_blank">View RTL Sidebar <ExternalLinkIcon /></a>
</Button>

## Changelog

### RTL Support

If you're upgrading from a previous version of the `Sidebar` component, you'll need to apply the following updates to add RTL support:

<Steps>

<Step>Add `dir` prop to Sidebar component.</Step>

Add `dir` to the destructured props and pass it to `SheetContent` for mobile:

```diff
  function Sidebar({
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
+   dir,
    ...props
  }: React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }) {
```

Then pass it to `SheetContent` in the mobile view:

```diff
  <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
    <SheetContent
+     dir={dir}
      data-sidebar="sidebar"
      data-slot="sidebar"
      data-mobile="true"
```

<Step>Add `data-side` attribute to sidebar container.</Step>

Add `data-side={side}` to the sidebar container element:

```diff
  <div
    data-slot="sidebar-container"
+   data-side={side}
    className={cn(
```

<Step>Update sidebar container positioning classes.</Step>

Replace JavaScript ternary conditional classes with CSS data attribute selectors:

```diff
  className={cn(
-   "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
-   side === "left"
-     ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
-     : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
+   "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex data-[side=left]:left-0 data-[side=right]:right-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
```

<Step>Update SidebarRail positioning classes.</Step>

Update the `SidebarRail` component to use physical positioning for the rail:

```diff
  className={cn(
-   "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-end-4 group-data-[side=right]:start-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex",
+   "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 ltr:-translate-x-1/2 rtl:-translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex",
```

<Step>Add RTL flip to SidebarTrigger icon.</Step>

Add `className="rtl:rotate-180"` to the icon in `SidebarTrigger` to flip it in RTL mode:

```diff
  <Button ...>
-   <PanelLeftIcon />
+   <PanelLeftIcon className="rtl:rotate-180" />
    <span className="sr-only">Toggle Sidebar</span>
  </Button>
```

</Steps>

After applying these changes, you can use the `dir` prop to set the direction:

```tsx
<Sidebar dir="rtl" side="right">
  {/* ... */}
</Sidebar>
```

The sidebar will correctly position itself and handle interactions in both LTR and RTL layouts.
