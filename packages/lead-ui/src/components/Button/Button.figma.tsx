import figma from "@figma/code-connect"

import { Button } from "./Button"

/**
 * Code Connect mapping: Lead Design System Button → @leadbank/ui Button.
 *
 * Figma source (Lead Design System – CLI-Ready Staging file, node 29:67711):
 * https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-67711
 *
 * Property names below assume the Figma component set uses Title-case
 * properties (Variant, Size, Disabled, Loading) with the variant values
 * matching the Lead React API. If Figma's actual property names differ,
 * the first `figma connect publish --dry-run` will surface the mismatch
 * and we adjust this file in a follow-up.
 */
figma.connect(
  Button,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-67711",
  {
    props: {
      variant: figma.enum("Variant", {
        Primary: "primary",
        Secondary: "secondary",
        Outline: "outline",
        Ghost: "ghost",
        Danger: "danger",
      }),
      size: figma.enum("Size", {
        Small: "sm",
        Medium: "md",
        Large: "lg",
      }),
      disabled: figma.boolean("Disabled"),
      loading: figma.boolean("Loading"),
      label: figma.string("Label"),
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
