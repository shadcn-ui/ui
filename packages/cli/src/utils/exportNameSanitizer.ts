/**
 * Enterprise Framework - export-name-sanitizer
 */
export function sanitizePascalCase(name: string): string { return name.replace(/(^|[-_])(\w)/g, (_,__,c)=>c.toUpperCase()); }
