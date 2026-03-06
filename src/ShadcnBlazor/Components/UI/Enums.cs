namespace ShadcnBlazor.Components.UI;

// === Button ===

/// <summary>Visual variant of the button.</summary>
public enum ButtonVariant
{
    Default,
    Outline,
    Secondary,
    Ghost,
    Destructive,
    Link
}

/// <summary>Size of the button.</summary>
public enum ButtonSize
{
    Default,
    Xs,
    Sm,
    Lg,
    Icon,
    IconXs,
    IconSm,
    IconLg
}

// === Badge ===

/// <summary>Visual variant of the badge.</summary>
public enum BadgeVariant
{
    Default,
    Secondary,
    Destructive,
    Outline,
    Ghost,
    Link
}

// === Alert ===

/// <summary>Visual variant of the alert.</summary>
public enum AlertVariant
{
    Default,
    Destructive
}

// === Toggle ===

/// <summary>Visual variant of the toggle.</summary>
public enum ToggleVariant
{
    Default,
    Outline
}

/// <summary>Size of the toggle.</summary>
public enum ToggleSize
{
    Default,
    Sm,
    Lg
}

// === Shared / Common ===

/// <summary>Side positioning for overlays, tooltips, popovers, etc.</summary>
public enum Side
{
    Top,
    Bottom,
    Left,
    Right
}

/// <summary>Alignment for positioned elements.</summary>
public enum Alignment
{
    Start,
    Center,
    End
}

/// <summary>Orientation for separators, tabs, radio groups, etc.</summary>
public enum Orientation
{
    Horizontal,
    Vertical
}

/// <summary>Common size used across multiple components.</summary>
public enum ComponentSize
{
    Default,
    Sm,
    Lg
}

// === Tabs ===

/// <summary>Visual variant of the tabs list.</summary>
public enum TabsListVariant
{
    Default,
    Line
}
