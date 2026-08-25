/**
 * shadcn-ui/ui - Component Diff Checker
 */
export function inspectComponentDiff(localCode: string, remoteCode: string): { modified: boolean; additions: number; deletions: number } {
  const localLines = new Set(localCode.split('
'));
  const remoteLines = new Set(remoteCode.split('
'));

  let additions = 0;
  for (const line of localLines) {
    if (!remoteLines.has(line)) additions++;
  }

  let deletions = 0;
  for (const line of remoteLines) {
    if (!localLines.has(line)) deletions++;
  }

  return {
    modified: additions > 0 || deletions > 0,
    additions,
    deletions
  };
}
