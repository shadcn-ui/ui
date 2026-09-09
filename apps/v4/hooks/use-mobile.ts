import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const { getServerSnapshot, getSnapshot, subscribe } = React.useMemo(() => {
    const mql = window.matchMedia(`not (min-width: ${MOBILE_BREAKPOINT}px)`);

    const subscribe = (callback: () => void): (() => void) => {
      mql.addEventListener('change', callback);

      return () => mql.removeEventListener('change', callback);
    };

    const getSnapshot = () => mql.matches;

    const getServerSnapshot = () => false;

    return {
      getServerSnapshot,
      getSnapshot,
      subscribe,
    };
  }, []);

  const isMobile = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return isMobile;
}
