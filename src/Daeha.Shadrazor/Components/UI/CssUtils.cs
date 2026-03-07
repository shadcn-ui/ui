namespace Daeha.Shadrazor.Components.UI;

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

    /// <summary>
    /// Returns <paramref name="trueClass"/> when <paramref name="condition"/> is true,
    /// otherwise returns <paramref name="falseClass"/> (or empty string).
    /// </summary>
    public static string CnIf(bool condition, string trueClass, string? falseClass = null)
        => condition ? trueClass : falseClass ?? string.Empty;

    /// <summary>
    /// Returns a standard disabled class string when <paramref name="disabled"/> is true.
    /// </summary>
    public static string CnDisabled(bool disabled)
        => disabled ? "pointer-events-none opacity-50 cursor-not-allowed" : string.Empty;
}
