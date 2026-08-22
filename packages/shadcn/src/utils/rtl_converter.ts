export const RTL_MAP: Record<string, string> = {
  'left-': 'start-',
  'right-': 'end-',
  'pl-': 'ps-',
  'pr-': 'pe-',
  'ml-': 'ms-',
  'mr-': 'me-'
};

export function convertToRtlLogicalClasses(classNames: string): string {
  let res = classNames;
  for (const [ltr, logical] of Object.entries(RTL_MAP)) {
    res = res.replaceAll(ltr, logical);
  }
  return res;
}
