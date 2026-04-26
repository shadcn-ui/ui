# 05. Accessibility

Approved foreground/background pairs live in `/tokens/authored/approvedPairs.json`, not in the paper source file. This keeps token values separate from usage permissions.

## Default Approved Pairs

| fg | bg | textSize | targetLevel | Usage |
|---|---|---|---|---|
| `semantic.foundation.content.default` | `semantic.foundation.surface.0` | normal | AA | Body text on default surface. |
| `semantic.foundation.content.default` | `semantic.foundation.surface.1` | normal | AA | Body text on elevated surface. |
| `semantic.foundation.content.emphasis` | `semantic.foundation.surface.0` | normal | AAA | Emphasized headings and body. |
| `semantic.interactive.primary` | `semantic.foundation.surface.1` | normal | AA | Links and primary CTAs. |
| `semantic.feedback.alert` | `semantic.foundation.surface.1` | non-text | AA | Alert icons, pills, borders. |
| `semantic.feedback.success` | `semantic.foundation.surface.1` | non-text | AA | Success icons, pills, borders. |

Feedback colors are not approved for normal text on light surfaces.
