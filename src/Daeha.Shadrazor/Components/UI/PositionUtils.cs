namespace Daeha.Shadrazor.Components.UI;

/// <summary>
/// Utility for calculating CSS position styles for floating elements (tooltips, popovers, dropdowns).
/// </summary>
public static class PositionUtils
{
    /// <summary>
    /// Computes an absolute-position CSS style for a floating element relative to its trigger.
    /// </summary>
    public static string GetPositionStyle(Side side, Alignment align = Alignment.Center, int offsetPx = 4)
    {
        var vertical = side switch
        {
            Side.Top => $"bottom: 100%; margin-bottom: {offsetPx}px;",
            Side.Bottom => $"top: 100%; margin-top: {offsetPx}px;",
            Side.Left => $"right: 100%; top: 50%; transform: translateY(-50%); margin-right: {offsetPx}px;",
            Side.Right => $"left: 100%; top: 50%; transform: translateY(-50%); margin-left: {offsetPx}px;",
            _ => $"top: 100%; margin-top: {offsetPx}px;"
        };

        if (side is Side.Left or Side.Right)
            return vertical;

        var horizontal = align switch
        {
            Alignment.Start => "left: 0;",
            Alignment.End => "right: 0;",
            Alignment.Center => "left: 50%; transform: translateX(-50%);",
            _ => "left: 50%; transform: translateX(-50%);"
        };

        return $"{vertical} {horizontal}";
    }
}
