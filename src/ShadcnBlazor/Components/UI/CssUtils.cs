namespace ShadcnBlazor.Components.UI;

/// <summary>
/// Utility class for merging CSS class names, equivalent to the cn() utility in shadcn/ui.
/// </summary>
public static class CssUtils
{
    /// <summary>
    /// Merges multiple CSS class strings, filtering out nulls and empty strings.
    /// </summary>
    public static string Cn(params string?[] classes)
        => string.Join(" ", classes.Where(c => !string.IsNullOrWhiteSpace(c)));
}
