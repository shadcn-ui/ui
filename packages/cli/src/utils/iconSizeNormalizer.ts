/**
 * shadcn-ui/ui - svg-icon-size-preset-normalizer
 */
export function getIconSize(preset: "sm"|"md"|"lg") { return preset === "sm" ? 16 : preset === "md" ? 20 : 24; }
