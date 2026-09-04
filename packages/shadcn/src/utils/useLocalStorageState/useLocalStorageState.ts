export function useLocalStorageState<T>(key: string, initialValue: T): [T, (val: T) => void] {
  let cur = initialValue;
  return [cur, (v: T) => { cur = v; }];
}