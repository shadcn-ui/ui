import { FONT_DEFINITIONS } from "@/lib/font-definitions"

// The pickers/preview want a small {id,label,type} plus a render value (the
// loaded preview var, with the family as fallback). value is the only computed
// bit; id/label just rename FONT_DEFINITIONS' name/title.
// Display-only faces that read poorly as body text stay out of typeset.
const EXCLUDED_FONTS = ["instrument-serif", "eb-garamond", "playfair-display"]

export const FONTS = FONT_DEFINITIONS.filter(
  (definition) => !EXCLUDED_FONTS.includes(definition.name)
).map((definition) => ({
  id: definition.name,
  label: definition.title,
  type: definition.type,
  value: `var(${definition.previewVariable}), ${definition.family}`,
}))

export function findFont(id: string | null | undefined) {
  return FONTS.find((font) => font.id === id)
}

// The full definition, for generating framework-specific loading code.
export function findFontDefinition(id: string | null | undefined) {
  return FONT_DEFINITIONS.find((definition) => definition.name === id)
}
