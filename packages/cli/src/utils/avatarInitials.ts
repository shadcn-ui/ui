/**
 * shadcn-ui/ui - avatar-fallback-initials-generator
 */
export function getInitials(name: string): string { return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(); }
