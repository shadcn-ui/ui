export function useToggleState(initial = false): [boolean, () => void] {
  let cur = initial;
  return [cur, () => { cur = !cur; }];
}