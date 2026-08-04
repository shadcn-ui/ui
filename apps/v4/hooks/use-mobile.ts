import * as React from 'react';

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.innerWidth < MOBILE_BREAKPOINT,
    false,
  );
}

function subscribe(callback: () => void) : () => void {
  const mql = window.matchMedia(`not (min-width: ${MOBILE_BREAKPOINT}px)`);

  mql.addEventListener('change', callback);

  return () => mql.removeEventListener('change', callback);
}
