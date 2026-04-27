import figma from "@figma/code-connect"

import { Button } from "./Button"

/**
 * Code Connect mapping: Lead Design System Button → @leadbank/ui Button.
 *
 * Figma source (Lead Design System – CLI-Ready Staging file, COMPONENT_SET
 * "Button" at node 29:67711):
 * https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-67711
 *
 * Figma property surface (verified via dry-run + GET /v1/files):
 *   - Variant (VARIANT): Default, Secondary, Destructive, Outline, Ghost, Link
 *   - Size (VARIANT): default, icon, sm, lg
 *   - State (VARIANT): Default, Hover, Focus, Loading, Disabled, Pressed
 *   - Button Text (TEXT): label content
 *   - Show Left Icon / Left Icon / Show Right Icon / Right Icon: not mapped
 *     in this pilot — icons are a follow-up.
 *
 * React API mapping notes:
 *   - Figma "Default" variant → React "primary" (Figma's default style is
 *     the Lead primary action).
 *   - Figma "Destructive" → React "danger".
 *   - Figma "Link" has no React equivalent in @leadbank/ui today; instances
 *     using Link won't resolve a variant value. Add a "link" variant to the
 *     React Button later if needed.
 *   - Figma "icon" size has no React equivalent; instances using icon size
 *     won't resolve a size value.
 *   - disabled and loading are both derived from the Figma "State" enum —
 *     the React API exposes them as separate booleans, the Figma component
 *     treats them as mutually-exclusive states. Code Connect handles this
 *     fine: each figma.enum() call returns `true` only when State matches.
 */
figma.connect(
  Button,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-67711",
  {
    props: {
      variant: figma.enum("Variant", {
        Default: "primary",
        Secondary: "secondary",
        Destructive: "danger",
        Outline: "outline",
        Ghost: "ghost",
      }),
      size: figma.enum("Size", {
        default: "md",
        sm: "sm",
        lg: "lg",
      }),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
      loading: figma.enum("State", {
        Loading: true,
      }),
      label: figma.string("Button Text"),
    },
    example: ({ variant, size, disabled, loading, label }) => (
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        loading={loading}
      >
        {label}
      </Button>
    ),
  }
)
