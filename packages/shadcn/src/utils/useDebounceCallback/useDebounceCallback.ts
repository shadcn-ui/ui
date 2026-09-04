export function useDebounceCallback<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  let timer: any = null;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}