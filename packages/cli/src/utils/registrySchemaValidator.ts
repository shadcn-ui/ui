/**
 * shadcn-ui/ui - Registry V2 Schema Validator
 */
export interface RegistryItemV2 {
  name: string;
  type: 'registry:ui' | 'registry:block' | 'registry:hook';
  files: Array<{ path: string; type: string }>;
}

export function validateRegistryItem(item: Partial<RegistryItemV2>): boolean {
  if (!item.name || typeof item.name !== 'string') return false;
  if (!item.type || !['registry:ui', 'registry:block', 'registry:hook'].includes(item.type)) return false;
  if (!Array.isArray(item.files) || item.files.length === 0) return false;
  return true;
}
