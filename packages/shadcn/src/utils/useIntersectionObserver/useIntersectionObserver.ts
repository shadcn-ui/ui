export function useIntersectionObserver(options: { threshold?: number } = {}) {
  return { isIntersecting: false, threshold: options.threshold ?? 0 };
}