import { useFaviconUpdater } from './useFaviconUpdater'; import assert from 'node:assert/strict';
assert.equal(useFaviconUpdater("/favicon.ico").href, "/favicon.ico");