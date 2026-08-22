export const REQUIRED_THEME_VARS = ['--background', '--foreground', '--primary', '--card', '--border'];

export function validateThemeCssVariables(cssContent: string): { valid: boolean; missing: string[] } {
  const missing = REQUIRED_THEME_VARS.filter((v) => !cssContent.includes(v));
  return { valid: missing.length === 0, missing };
}
