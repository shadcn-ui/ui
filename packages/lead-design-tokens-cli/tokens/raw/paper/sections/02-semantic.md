# 02. Semantic Tokens

Semantic tokens carry meaning. They reference primitives and are split into three peer families.

## Foundation

Foundation tokens describe layout chrome: surfaces, content, strokes, and shift accents.

| Token | References | Usage |
|---|---|---|
| `semantic.foundation.surface.0` | `primitives.colors.grey.50` | Default app background. |
| `semantic.foundation.surface.1` | `primitives.colors.grey.0` | Elevated panels and cards. |
| `semantic.foundation.content.emphasis` | `primitives.colors.grey.100` | Highest-priority readable text. |
| `semantic.foundation.content.default` | `primitives.colors.grey.500` | Default readable text. |
| `semantic.foundation.content.muted` | `primitives.colors.grey.700` | Non-body decorative or secondary treatment only until contrast is resolved. |
| `semantic.foundation.content.contrast` | `primitives.colors.grey.0` | Text on dark surfaces. |
| `semantic.foundation.shift.default` | `primitives.colors.shift.400` | Shift accent. |

## Feedback

Feedback tokens describe status communication. They are not approved for normal text on light surfaces.

| Token | References | Usage |
|---|---|---|
| `semantic.feedback.alert` | `primitives.colors.red.700` | Alert icons, fills, pills, borders, large text. |
| `semantic.feedback.success` | `primitives.colors.green.700` | Success icons, fills, pills, borders, large text. |
| `semantic.feedback.warning` | `primitives.colors.yellow.700` | Warning icons, fills, pills, borders, large text. |
| `semantic.feedback.info` | `primitives.colors.muted-blue.600` | Info icons, fills, pills, borders, large text. |

## Interactive

Interactive tokens describe action surfaces and link treatment.

| Token | References | Usage |
|---|---|---|
| `semantic.interactive.primary` | `primitives.colors.blue.600` | Primary actions and links. |
