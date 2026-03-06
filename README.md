# ShadcnBlazor

A .NET Blazor port of [shadcn/ui](https://ui.shadcn.com) — beautifully designed, accessible UI components built with **Tailwind CSS only** (no Bootstrap). Targeting **.NET 10**.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- Node.js (for Tailwind CSS build)

## Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd shadcn-ui

# Navigate to the Blazor project
cd src/ShadcnBlazor

# Restore and run
dotnet restore
dotnet run
```

The app will be available at `https://localhost:7100`.

## Project Structure

```
shadcn-ui/
├── shadcn/                          # Original React shadcn/ui source (reference)
├── src/
│   └── ShadcnBlazor/
│       ├── ShadcnBlazor.csproj      # .NET 10 Blazor project
│       ├── Program.cs               # App entry point
│       ├── _Imports.razor            # Global using directives
│       ├── Properties/
│       │   └── launchSettings.json
│       ├── Components/
│       │   ├── App.razor             # Root HTML document
│       │   ├── Routes.razor          # Router configuration
│       │   ├── Layout/
│       │   │   ├── MainLayout.razor  # Main layout with NavBar
│       │   │   └── NavBar.razor      # Responsive navigation bar
│       │   ├── Pages/
│       │   │   ├── Home.razor        # Demo showcase page
│       │   │   ├── Components.razor  # Component catalog
│       │   │   └── Examples.razor    # Interactive examples
│       │   └── UI/                   # All UI components
│       │       ├── CssUtils.cs       # cn() utility (class merging)
│       │       ├── Button.razor
│       │       ├── Input.razor
│       │       ├── Card.razor
│       │       ├── ...               # 50+ components
│       │       └── Spinner.razor
│       └── wwwroot/
│           └── css/
│               └── app.css           # Tailwind CSS + design tokens
├── README.md
├── LICENSE.md
└── CONTRIBUTING.md
```

## Available Components (50+)

### Form Controls
| Component | File | Description |
|-----------|------|-------------|
| `<Button>` | `Button.razor` | Button with variants (default, outline, secondary, ghost, destructive, link) and sizes |
| `<Input>` | `Input.razor` | Text input with two-way binding |
| `<Textarea>` | `Textarea.razor` | Multi-line text input |
| `<Label>` | `Label.razor` | Accessible form label |
| `<Checkbox>` | `Checkbox.razor` | Checkbox with `@bind-Checked` |
| `<Switch>` | `Switch.razor` | Toggle switch with `@bind-Checked` |
| `<RadioGroup>` | `RadioGroup.razor` | Radio button group with `@bind-Value` |
| `<Select>` | `Select.razor` | Dropdown select with `<SelectItem>` |
| `<Slider>` | `Slider.razor` | Range slider with `@bind-Value` |
| `<Toggle>` | `Toggle.razor` | Toggle button with `@bind-Pressed` |

### Data Display
| Component | File | Description |
|-----------|------|-------------|
| `<Card>` | `Card.razor` | Card container with Header, Title, Description, Content, Footer, Action |
| `<Badge>` | `Badge.razor` | Status badge with variants |
| `<Alert>` | `Alert.razor` | Alert message with Title and Description |
| `<Avatar>` | `Avatar.razor` | User avatar with image/fallback |
| `<AvatarGroup>` | `AvatarGroup.razor` | Grouped avatars |
| `<Table>` | `Table.razor` | Data table with Header, Body, Row, Head, Cell |
| `<Skeleton>` | `Skeleton.razor` | Loading placeholder |
| `<Spinner>` | `Spinner.razor` | Animated loading indicator |
| `<Progress>` | `Progress.razor` | Progress bar |
| `<Kbd>` | `Kbd.razor` | Keyboard shortcut display |
| `<Empty>` | `Empty.razor` | Empty state placeholder |
| `<AspectRatio>` | `AspectRatio.razor` | Content with fixed aspect ratio |

### Overlay & Dialog
| Component | File | Description |
|-----------|------|-------------|
| `<Dialog>` | `Dialog.razor` | Modal dialog with `@bind-Open` |
| `<AlertDialog>` | `AlertDialog.razor` | Confirmation dialog |
| `<Sheet>` | `Sheet.razor` | Slide-out panel (top/right/bottom/left) |
| `<Popover>` | `Popover.razor` | Floating content panel |
| `<Tooltip>` | `Tooltip.razor` | Hover information tooltip |
| `<DropdownMenu>` | `DropdownMenu.razor` | Dropdown menu with items |
| `<ContextMenu>` | `ContextMenu.razor` | Right-click context menu |
| `<HoverCard>` | `HoverCard.razor` | Hover-triggered preview card |

### Navigation & Layout
| Component | File | Description |
|-----------|------|-------------|
| `<NavBar>` | `NavBar.razor` | Responsive navigation bar |
| `<Tabs>` | `Tabs.razor` | Tab navigation with `@bind-ActiveTab` |
| `<Accordion>` | `Accordion.razor` | Collapsible content sections |
| `<Breadcrumb>` | `Breadcrumb.razor` | Path navigation |
| `<Pagination>` | `Pagination.razor` | Page navigation |
| `<Separator>` | `Separator.razor` | Visual divider (horizontal/vertical) |
| `<Collapsible>` | `Collapsible.razor` | Expandable/collapsible section |
| `<ScrollArea>` | `ScrollArea.razor` | Custom scrollable container |
| `<Sidebar>` | `Sidebar.razor` | Side navigation with groups and menus |

## Usage Examples

### Button

```razor
<Button>Click me</Button>
<Button Variant="ButtonVariant.Outline" Size="ButtonSize.Sm">Small Outline</Button>
<Button Variant="ButtonVariant.Destructive" OnClick="HandleDelete">Delete</Button>
```

### Card

```razor
<Card>
    <CardHeader>
        <CardTitle>My Card</CardTitle>
        <CardDescription>A description of the card.</CardDescription>
    </CardHeader>
    <CardContent>
        <p>Content goes here.</p>
    </CardContent>
    <CardFooter>
        <Button>Save</Button>
    </CardFooter>
</Card>
```

### Dialog

```razor
<Button OnClick="() => dialogOpen = true">Open Dialog</Button>

<Dialog @bind-Open="dialogOpen">
    <DialogHeader>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
        <Button Variant="ButtonVariant.Outline" OnClick="() => dialogOpen = false">Cancel</Button>
        <Button OnClick="Confirm">Confirm</Button>
    </DialogFooter>
</Dialog>

@code {
    private bool dialogOpen;
    private void Confirm() { /* ... */ dialogOpen = false; }
}
```

### Tabs

```razor
<Tabs @bind-ActiveTab="activeTab">
    <TabsList>
        <TabsTrigger Value="overview">Overview</TabsTrigger>
        <TabsTrigger Value="analytics">Analytics</TabsTrigger>
    </TabsList>
    <TabsContent Value="overview">
        <p>Overview content here.</p>
    </TabsContent>
    <TabsContent Value="analytics">
        <p>Analytics content here.</p>
    </TabsContent>
</Tabs>
```

### Form Controls

```razor
<div class="space-y-4">
    <div class="space-y-2">
        <Label For="email">Email</Label>
        <Input Type="email" @bind-Value="email" Placeholder="you@example.com" />
    </div>
    <div class="flex items-center space-x-2">
        <Checkbox @bind-Checked="agreed" />
        <Label>I agree to the terms</Label>
    </div>
    <div class="flex items-center space-x-2">
        <Switch @bind-Checked="notifications" />
        <Label>Enable notifications</Label>
    </div>
</div>
```

### Sheet

```razor
<Button OnClick="() => sheetOpen = true">Open Menu</Button>

<Sheet @bind-Open="sheetOpen" Side="left">
    <SheetHeader>
        <SheetTitle>Navigation</SheetTitle>
    </SheetHeader>
    <nav class="space-y-2">
        <a href="/" class="block p-2 hover:bg-accent rounded-md">Home</a>
        <a href="/about" class="block p-2 hover:bg-accent rounded-md">About</a>
    </nav>
</Sheet>
```

## Design Tokens & Theming

All design tokens are defined in `wwwroot/css/app.css` using CSS custom properties and Tailwind's `@theme` directive. The project supports both light and dark modes.

To switch themes, toggle the `dark` class on the `<html>` element:

```csharp
// In a Blazor component
await JS.InvokeVoidAsync("document.documentElement.classList.toggle", "dark");
```

Key color tokens: `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`.

## CSS Utility

The `CssUtils.Cn()` method merges CSS class strings, equivalent to the `cn()` utility in the original shadcn/ui:

```csharp
@using static ShadcnBlazor.Components.UI.CssUtils

<div class="@Cn("base-class", condition ? "active" : null, customClass)">
```

## Key Differences from React shadcn/ui

| Feature | React (Original) | Blazor (This Port) |
|---------|-------------------|---------------------|
| Framework | React + Next.js | .NET 10 Blazor Server |
| Styling | Tailwind CSS | Tailwind CSS (same) |
| State | React hooks | `@bind-*`, `EventCallback` |
| Headless UI | @base-ui/react | Native Blazor logic |
| Class Merge | `cn()` (clsx + tailwind-merge) | `CssUtils.Cn()` |
| Icons | Lucide React | Inline SVG |
| Variants | class-variance-authority | C# enums + pattern matching |

## Tailwind CSS Setup

This project uses Tailwind CSS v4 with the `@import "tailwindcss"` directive. No Bootstrap is included.

To build CSS for production:

```bash
npx @tailwindcss/cli -i wwwroot/css/app.css -o wwwroot/css/app.min.css --minify
```

## Original React Source

The original React shadcn/ui source code is preserved in the `shadcn/` directory for reference.

## Contributing

Please read the [contributing guide](/CONTRIBUTING.md).

## License

Licensed under the [MIT license](./LICENSE.md).
