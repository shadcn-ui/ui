# Shadrazor

A .NET Blazor port of [shadcn/ui](https://ui.shadcn.com) — beautifully designed, accessible UI components built with **Tailwind CSS only** (no Bootstrap). Targeting **.NET 10**.

Available as a **NuGet package** (`Daeha.Shadrazor`) for easy integration into any Blazor project.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- Node.js (for Tailwind CSS build, demo only)

## Installation

### NuGet Package

```bash
dotnet add package Daeha.Shadrazor
```

### Setup

1. Add the CSS reference in your `App.razor` or `_Host.cshtml`:

```html
<link rel="stylesheet" href="_content/Daeha.Shadrazor/css/shadcn.css" />
```

2. Add the using directive in your `_Imports.razor`:

```razor
@using Daeha.Shadrazor.Components.UI
```

3. Start using components:

```razor
<Button Variant="ButtonVariant.Outline">Click me</Button>
```

## Project Structure

```
Shadrazor/
├── src/
│   ├── Daeha.Shadrazor/                # Razor Class Library (NuGet package)
│   │   ├── Daeha.Shadrazor.csproj      # Microsoft.NET.Sdk.Razor + NuGet metadata
│   │   ├── _Imports.razor              # Library-level imports
│   │   ├── Components/
│   │   │   └── UI/                     # All UI components
│   │   │       ├── Enums.cs            # Consolidated enums (variants, sizes, etc.)
│   │   │       ├── CssUtils.cs         # cn() utility (class merging)
│   │   │       ├── PositionUtils.cs    # Shared positioning logic
│   │   │       ├── Button.razor
│   │   │       ├── ...                 # 50+ components
│   │   │       └── Spinner.razor
│   │   └── wwwroot/
│   │       └── css/
│   │           └── shadcn.css          # Tailwind CSS + design tokens
│   └── Daeha.Shadrazor.Demo/          # Demo web application
│       ├── Daeha.Shadrazor.Demo.csproj # .NET 10 Blazor Web App
│       ├── Program.cs                  # App entry point
│       └── Components/
│           ├── App.razor               # Root HTML document
│           ├── Routes.razor            # Router configuration
│           ├── Layout/
│           │   ├── MainLayout.razor    # Main layout with NavBar
│           │   └── NavBar.razor        # Responsive navigation bar
│           └── Pages/
│               ├── Home.razor          # Demo showcase page
│               ├── Components.razor    # Component catalog
│               └── Examples.razor      # Interactive examples
├── README.md
├── LICENSE.md
└── CONTRIBUTING.md
```

## Running the Demo

```bash
cd src/Daeha.Shadrazor.Demo
dotnet restore
dotnet run
```

## Building the NuGet Package

```bash
cd src/Daeha.Shadrazor
dotnet pack -c Release
```

The `.nupkg` file will be in `bin/Release/`.

## Available Components (50+)

### Form Controls
| Component | Description |
|-----------|-------------|
| `<Button>` | Button with variants (`ButtonVariant`) and sizes (`ButtonSize`) |
| `<Input>` | Text input with two-way binding |
| `<Textarea>` | Multi-line text input |
| `<Label>` | Accessible form label |
| `<Checkbox>` | Checkbox with `@bind-Checked` |
| `<Switch>` | Toggle switch with `@bind-Checked` and `ComponentSize` |
| `<RadioGroup>` | Radio button group with `@bind-Value` |
| `<Select>` | Dropdown select with `<SelectItem>` and `ComponentSize` |
| `<Slider>` | Range slider with `@bind-Value` |
| `<Toggle>` | Toggle button with `@bind-Pressed`, `ToggleVariant`, `ToggleSize` |

### Data Display
| Component | Description |
|-----------|-------------|
| `<Card>` | Card container with Header, Title, Description, Content, Footer, Action. Supports `ComponentSize` |
| `<Badge>` | Status badge with `BadgeVariant` |
| `<Alert>` | Alert message with `AlertVariant`, Title and Description |
| `<Avatar>` | User avatar with image/fallback and `ComponentSize` |
| `<AvatarGroup>` | Grouped avatars |
| `<Table>` | Data table with Header, Body, Row, Head, Cell |
| `<Skeleton>` | Loading placeholder |
| `<Spinner>` | Animated loading indicator with `ComponentSize` |
| `<Progress>` | Progress bar |
| `<Kbd>` | Keyboard shortcut display |
| `<Empty>` | Empty state placeholder |
| `<AspectRatio>` | Content with fixed aspect ratio |

### Overlay & Dialog
| Component | Description |
|-----------|-------------|
| `<Dialog>` | Modal dialog with `@bind-Open` |
| `<AlertDialog>` | Confirmation dialog |
| `<Sheet>` | Slide-out panel with `Side` enum (Top/Right/Bottom/Left) |
| `<Popover>` | Floating content panel with `Side` and `Alignment` |
| `<Tooltip>` | Hover tooltip with `Side` positioning |
| `<DropdownMenu>` | Dropdown menu with `Side` and `Alignment` |
| `<ContextMenu>` | Right-click context menu |
| `<HoverCard>` | Hover-triggered preview card with `Side` and `Alignment` |

### Navigation & Layout
| Component | Description |
|-----------|-------------|
| `<Tabs>` | Tab navigation with `@bind-ActiveTab` and `Orientation` |
| `<Accordion>` | Collapsible content sections (single/multiple mode) |
| `<Breadcrumb>` | Path navigation |
| `<Pagination>` | Page navigation |
| `<Separator>` | Visual divider with `Orientation` (Horizontal/Vertical) |
| `<Collapsible>` | Expandable/collapsible section |
| `<ScrollArea>` | Custom scrollable container |
| `<Sidebar>` | Side navigation with groups and menus |

## Enum Types

All variants and sizes use strongly-typed C# enums instead of magic strings:

```csharp
// Button
ButtonVariant: Default, Outline, Secondary, Ghost, Destructive, Link
ButtonSize: Default, Xs, Sm, Lg, Icon, IconXs, IconSm, IconLg

// Badge
BadgeVariant: Default, Secondary, Destructive, Outline, Ghost, Link

// Alert
AlertVariant: Default, Destructive

// Toggle
ToggleVariant: Default, Outline
ToggleSize: Default, Sm, Lg

// Shared
Side: Top, Bottom, Left, Right
Alignment: Start, Center, End
Orientation: Horizontal, Vertical
ComponentSize: Default, Sm, Lg
TabsListVariant: Default, Line
```

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

### Sheet

```razor
<Button OnClick="() => sheetOpen = true">Open Menu</Button>

<Sheet @bind-Open="sheetOpen" Side="Side.Left">
    <SheetHeader>
        <SheetTitle>Navigation</SheetTitle>
    </SheetHeader>
    <nav class="space-y-2">
        <a href="/" class="block p-2 hover:bg-accent rounded-md">Home</a>
        <a href="/about" class="block p-2 hover:bg-accent rounded-md">About</a>
    </nav>
</Sheet>
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

## Utilities

### CssUtils

```csharp
// Merge CSS classes (equivalent to cn() in shadcn/ui)
CssUtils.Cn("base-class", condition ? "active" : null, customClass)

// Conditional class
CssUtils.CnIf(isActive, "bg-primary", "bg-muted")

// Disabled state
CssUtils.CnDisabled(isDisabled)
```

### PositionUtils

```csharp
// Calculate CSS position style for floating elements
PositionUtils.GetPositionStyle(Side.Bottom, Alignment.Center)
```

## Design Tokens & Theming

All design tokens are defined in `wwwroot/css/shadcn.css` using CSS custom properties and Tailwind's `@theme` directive. Supports light and dark modes.

Toggle dark mode:

```csharp
await JS.InvokeVoidAsync("document.documentElement.classList.toggle", "dark");
```

Key color tokens: `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`.

## Key Differences from React shadcn/ui

| Feature | React (Original) | Blazor (Shadrazor) |
|---------|-------------------|---------------------|
| Framework | React + Next.js | .NET 10 Blazor |
| Package | npm | NuGet (`Daeha.Shadrazor`) |
| Styling | Tailwind CSS | Tailwind CSS (same) |
| State | React hooks | `@bind-*`, `EventCallback` |
| Headless UI | @base-ui/react | Native Blazor logic |
| Class Merge | `cn()` (clsx + tailwind-merge) | `CssUtils.Cn()` |
| Icons | Lucide React | Inline SVG |
| Variants | class-variance-authority | C# enums + pattern matching |

## Contributing

Please read the [contributing guide](/CONTRIBUTING.md).

## License

Licensed under the [MIT license](./LICENSE.md).
