import figma from "@figma/code-connect"

import { Alert, AlertDescription, AlertTitle } from "./Alert"

/**
 * Code Connect mapping: Lead Design System Alert → @leadbank/ui Alert.
 *
 * Figma source: Lead Design System – CLI-Ready Staging, node 29:66418
 * https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66418
 *
 * Figma property surface (per supplied manifest):
 *   - Variant (VARIANT): Default, Destructive
 *   - Title Text, Description Text (TEXT)
 *   - Icon (BOOLEAN, exists in Figma)
 *
 * Mapped props:
 *   - variant ← figma.enum("Variant", { Default: "neutral", Destructive: "danger" })
 *   - title (string) → rendered as AlertTitle children
 *   - description (string) → rendered as AlertDescription children
 *
 * Not mapped (no clean correspondence):
 *   - Figma "Icon" is a boolean toggle for "show built-in icon," but
 *     Lead's Alert API takes `icon?: ReactNode` (caller-supplied). Per the
 *     §8.5 API decision, Lead does not ship default icons. Mapping a
 *     Figma boolean to a React ReactNode would require inventing an icon
 *     element here, which the working agreement forbids. Leaving Icon
 *     unmapped is the truthful choice.
 *   - React variants `info`, `success`, `warning` have no Figma
 *     counterpart in this manifest; instances using those React variants
 *     simply won't be reverse-derived from Figma.
 */
figma.connect(
  Alert,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66418",
  {
    props: {
      variant: figma.enum("Variant", {
        Default: "neutral",
        Destructive: "danger",
      }),
      title: figma.string("Title Text"),
      description: figma.string("Description Text"),
    },
    example: ({ variant, title, description }) => (
      <Alert variant={variant}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    ),
  }
)
