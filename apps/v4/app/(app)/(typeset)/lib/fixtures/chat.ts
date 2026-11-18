// Assistant chat answer: the core genre. Short paragraphs, scannable lists,
// a small table, code, and a closing question. The user bubble that precedes
// it is page chrome, rendered outside the typeset container.
export const CHAT_QUESTION =
  "My Next.js dev server takes forever to start. How do I figure out what's actually slow?"

export const CHAT_HTML = `
<p>Slow dev startup in Next.js almost always comes down to one of three things: module count, heavy config work at boot, or something outside the compiler entirely. Here's how to narrow it down fast.</p>
<h3>1. Get a baseline</h3>
<p>Start the server with profiling on and note the two numbers it prints:</p>
<pre><code>NEXT_TURBOPACK_TRACING=1 next dev</code></pre>
<ul>
<li><strong>Startup time</strong>: everything before "Ready". Config loading, env files, plugins.</li>
<li><strong>First compile</strong>: the time after you hit a route. Module graph size lives here.</li>
</ul>
<h3>2. Check the usual suspects</h3>
<table>
<thead>
<tr><th>Symptom</th><th>Likely cause</th></tr>
</thead>
<tbody>
<tr><td>Slow before "Ready"</td><td>Heavy <code>next.config</code>, sync I/O in config, large <code>.env</code> cascade</td></tr>
<tr><td>Slow first page</td><td>Barrel files pulling in whole icon or UI libraries</td></tr>
<tr><td>Slow every save</td><td>Type checking or lint running in the dev loop</td></tr>
</tbody>
</table>
<p>The barrel-file one is the classic. A single <code>import { Check } from "lucide-react"</code> through a barrel can pull thousands of modules into the graph. Fix it with:</p>
<pre><code>// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "@acme/ui"],
  },
}</code></pre>
<h3>3. Measure, don't guess</h3>
<p>If neither jumps out, generate a trace and look at the actual spans:</p>
<pre><code>next dev
# reproduce the slow start, then:
next internal trace .next/trace</code></pre>
<blockquote><p>Compare against a bare <code>create-next-app</code> on the same machine first. If that's also slow, the problem is your machine or antivirus scanning <code>node_modules</code>, not your app.</p></blockquote>
<p>Want to paste the first few lines of your trace output? I can point at the exact span that's eating the time.</p>
`
