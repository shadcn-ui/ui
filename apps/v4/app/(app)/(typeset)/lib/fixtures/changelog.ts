export const CHANGELOG_HTML = `
<h1>Changelog</h1>
<h2>v2.4.0</h2>
<p><em>June 18, 2026</em></p>
<ul>
  <li><strong>Added:</strong> <code>store.batch(fn)</code> groups multiple writes into a single notification. Listeners observe only the final state.</li>
  <li><strong>Added:</strong> a <code>name</code> option for devtools traces; anonymous stores now display as <code>store#3</code> instead of <code>undefined</code>.</li>
  <li><strong>Changed:</strong> selectors are memoized per subscriber, cutting re-render counts roughly in half on wide stores.</li>
  <li><strong>Fixed:</strong> subscribing during a notification no longer skips the next update.</li>
  <li><strong>Fixed:</strong> <code>equals</code> is respected for the initial <code>useStore</code> read, matching the documented behavior.</li>
</ul>
<h3>Breaking changes</h3>
<p>The deprecated <code>store.update()</code> alias is removed. Replace it with <code>store.set()</code>; the signature is identical:</p>
<pre><code>- store.update((s) =&gt; ({ count: s.count + 1 }))
+ store.set((s) =&gt; ({ count: s.count + 1 }))</code></pre>
<h2>v2.3.1</h2>
<p><em>May 30, 2026</em></p>
<ul>
  <li><strong>Fixed:</strong> a race where two synchronous writes in the same tick could notify in reverse order under React’s concurrent rendering.</li>
  <li><strong>Docs:</strong> clarified that stores must be hoisted out of components, with a lint rule to catch it.</li>
</ul>
<h2>v2.3.0</h2>
<p><em>May 12, 2026</em></p>
<ul>
  <li><strong>Added:</strong> React Native support; <code>useStore</code> no longer touches <code>window</code>.</li>
  <li><strong>Deprecated:</strong> <code>store.update()</code>, removed in v2.4.0. A console warning links to the migration note.</li>
  <li><strong>Performance:</strong> subscription bookkeeping moved from an array to a Set; unsubscribe is now O(1).</li>
</ul>
`
