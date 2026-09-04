let counter = 0;
export function useIdIncrementGenerator(prefix = "shadcn"): string {
  return `${prefix}-${++counter}`;
}