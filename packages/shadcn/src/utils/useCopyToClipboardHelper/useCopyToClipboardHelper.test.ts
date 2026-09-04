import { useCopyToClipboardHelper } from './useCopyToClipboardHelper'; import assert from 'node:assert/strict';
assert.equal(useCopyToClipboardHelper().copy("hello"), true);