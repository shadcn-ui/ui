import { useLocalStorageState } from './useLocalStorageState'; import assert from 'node:assert/strict';
const [v] = useLocalStorageState("theme", "dark"); assert.equal(v, "dark");