export const KITCHEN_SINK_HTML = `
<h1>Streaming markdown to a million sessions</h1>
<p>Six months ago we rewrote how assistant messages render, and this is the retrospective we wish we could have read first. The short version: the parser was never the problem, the <em>typography</em> was, and the fixes that mattered were <strong>boring, measurable, and CSS-shaped</strong>. We <del>estimated two weeks</del> spent six, and the difference was all edge cases.</p>
<p>Everything below comes from production traffic against our completions endpoint (<a href="#">https://api.example.com/v1/organizations/org_2f8a91c/deployments/dep_09xkq/streaming-completions?include_usage=true&amp;format=sse</a>), rendered by the same stylesheet you’re reading now.<sup><a href="#fn1" id="ref1">1</a></sup></p>
<h2>The setup</h2>
<p>Messages arrive as <abbr title="Server-Sent Events">SSE</abbr> and render token by token. The renderer repairs unterminated markdown; the stylesheet’s only job is to keep already-painted content perfectly still while new content arrives below it. The whole contract fits in one handler:</p>
<pre><code>export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = streamText({ model, messages })
  return result.toDataStreamResponse()
}</code></pre>
<p>Every block above the insertion point must keep its computed styles byte-for-byte identical across appends. We test exactly that, and press <kbd>⌘</kbd> <kbd>K</kbd> in the playground to replay any captured stream against the assertion.</p>
<h2>What the data said</h2>
<p>We captured 40,000 assistant replies and counted what models actually emit. The distribution surprised us; <mark>deep headings and tables are not rare events</mark>, they’re Tuesday.</p>
<table>
  <thead>
    <tr>
      <th>Element</th>
      <th align="right">Percentage</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Lists</th>
      <td align="right">78.4</td>
      <td>Nesting to three levels is common</td>
    </tr>
    <tr>
      <th scope="row">Code blocks</th>
      <td align="right">41.2</td>
      <td>Half specify no language tag at all</td>
    </tr>
    <tr>
      <th scope="row">Tables</th>
      <td align="right">17.9</td>
      <td>Comparison questions produce 40-column monsters</td>
    </tr>
    <tr>
      <th scope="row">Headings</th>
      <td align="right">12.6</td>
      <td>Models outline far deeper than humans do</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Any block element</th>
      <td align="right">94.1</td>
      <td>Plain-paragraph-only replies are the rare case</td>
    </tr>
  </tfoot>
</table>
<p>That last row is why the bottom of the heading scale exists at all.<sup><a href="#fn2" id="ref2">2</a></sup> Nobody designs h6 for people; you design it for machines that never learned restraint.</p>
<figure>
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'%3E%3Crect width='1200' height='630' fill='%23EAEAEA' rx='6'/%3E%3Cpath d='M80 470 L280 380 L480 420 L680 260 L880 300 L1120 160' stroke='%23BDBDBD' stroke-width='8' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E" alt="Latency dashboard the morning after rollout" width="1200" height="630">
  <figcaption>Figure 1. The morning after rollout: style recalculation cost per token, before and after the append-stable rules landed.</figcaption>
</figure>
<h2>Three mistakes we made</h2>
<h3>We trusted margin collapsing</h3>
<p>Our first spacing model used symmetric margins and let the browser deduplicate them. Then a designer wrapped messages in a flex column and every paragraph gap silently doubled. Single-direction margins fixed it everywhere at once:</p>
<ol>
  <li>Space belongs above blocks, and only above.</li>
  <li>Headings own the gap beneath them, so following content never negotiates.</li>
  <li>Nothing, anywhere, sets a bottom margin.</li>
</ol>
<h3>We styled the last row</h3>
<p>Tables drew their border under the final row, which meant every streamed row restyled the previous one on arrival. Users reported it as “the table flickers while it types.” The fix was embarrassingly small:</p>
<ul>
  <li>Borders go <em>between</em> rows (<code>tr + tr</code>), never after the last one
    <ul>
      <li>The same rule saved us again on blockquote citations and list dividers</li>
    </ul>
  </li>
  <li>Selectors may look backward at earlier siblings, never forward</li>
</ul>
<h3>We ignored the quiet feedback</h3>
<blockquote>
  <p>The new answers feel calmer, and I can’t tell you why. I just stopped noticing the formatting.</p>
  <p>That was the entire review. It’s still the best QA signal we’ve ever received, because typography you notice is typography that failed.</p>
</blockquote>
<h2>The checklist we run now</h2>
<p>Before any typography change ships, a release candidate has to clear the same four gates, in order:</p>
<ul class="contains-task-list">
  <li class="task-list-item"><input type="checkbox" checked disabled> Append-stability suite passes on all captured streams</li>
  <li class="task-list-item"><input type="checkbox" checked disabled> Reads correctly at <code>text-sm</code> inside a bubble and at 16px full width</li>
  <li class="task-list-item"><input type="checkbox" checked disabled> Squint test shows even gray, no hotspots</li>
  <li class="task-list-item"><input type="checkbox" disabled> Sixty seconds of sustained reading by someone who didn’t write it</li>
</ul>
<details>
  <summary>How we capture the streams for the suite</summary>
  <p>Every failed render in production writes its raw token sequence to a bucket. The suite replays each capture twice, once all at once and once token by token, and diffs the computed styles of everything that was on screen before the last token arrived.</p>
  <pre><code>replay: captures
	bun run suite --replay captures/ --diff computed

captures:
	bun run capture --since yesterday --failures-only</code></pre>
</details>
<hr>
<h2>Appendix</h2>
<h4>Glossary</h4>
<dl>
  <dt>flow</dt>
  <dd>The rhythm unit: one em-based value that spaces every block from the one before it.</dd>
  <dt>measure</dt>
  <dd>Line length in average characters. Not the CSS <code>ch</code> unit, which overcounts by roughly a third.</dd>
</dl>
<h4>Reference notes</h4>
<h5>On the numbers in this post</h5>
<p>Percentages are per-reply presence, not token share. A reply containing one table and one list counts once in each row.</p>
<h6>Revision history</h6>
<p>Corrected the p95 code-block count<sup><a href="#fn3" id="ref3">3</a></sup> and added the flex-column incident after two readers asked whether “boring, measurable, and CSS-shaped” was a typo. It wasn’t.</p>
<section data-footnotes class="footnotes">
  <ol>
    <li id="fn1"><p>Endpoint anonymized. The path structure is real; the org is not. <a href="#ref1">↩</a></p></li>
    <li id="fn2"><p>Specifically the reply that contained fourteen h6 elements and zero h1–h3. <a href="#ref2">↩</a></p></li>
    <li id="fn3"><p>The original draft said nine; the correct p95 is seven. <a href="#ref3">↩</a></p></li>
  </ol>
</section>
`
