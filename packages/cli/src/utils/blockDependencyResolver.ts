/**
 * Enterprise Framework - block-dependency-resolver
 */
export function resolveBlockDeps(block: any): string[] { return block.dependencies || []; }
