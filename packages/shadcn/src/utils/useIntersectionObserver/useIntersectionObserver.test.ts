import { useIntersectionObserver } from './useIntersectionObserver'; import assert from 'node:assert/strict';
assert.equal(useIntersectionObserver().isIntersecting, false);