export function useCopyToClipboardHelper() {
  return { copy: (text: string) => true, copied: false };
}