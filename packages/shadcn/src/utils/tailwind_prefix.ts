export function applyTailwindPrefix(classNames: string, prefix: string): string {
  if (!prefix) return classNames;
  return classNames
    .split(/\s+/)
    .map((cls) => (cls.startsWith(prefix) ? cls : `${prefix}${cls}`))
    .join(' ');
}
