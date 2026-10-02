import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;

let mqlCache: MediaQueryList | null = null;

function getMql() {
    if (typeof window === "undefined") return null;
    if (!mqlCache) {
        mqlCache = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    }
    return mqlCache;
}

function subscribe(callback: () => void) {
    if (typeof window === "undefined") return () => {};
    const mql = getMql();
    if (!mql) return () => {};
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
    if (typeof window === "undefined") return false;
    const mql = getMql();
    return mql ? mql.matches : false;
}

function getServerSnapshot() {
    return false;
}

export function useIsMobile() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
