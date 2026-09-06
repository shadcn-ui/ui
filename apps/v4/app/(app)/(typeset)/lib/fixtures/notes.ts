export const NOTES_HTML = `
<h1>Platform sync: week 27</h1>
<p><em>July 3, 2026 · 25 min · recording available</em></p>
<h2>Decisions</h2>
<ul>
  <li>Ship the streaming endpoint behind a flag on Tuesday; full rollout gated on the p95 latency holding under 800ms for 48 hours.</li>
  <li>Adopt cursor pagination for the activity feed. Offset stays on the admin tables only, capped at page 500.</li>
  <li>Postpone the queue migration to Q3. Nobody could name a current failure it fixes.</li>
</ul>
<h2>Action items</h2>
<ul class="contains-task-list">
  <li class="task-list-item"><input type="checkbox" checked disabled> <strong>Mia:</strong> flag config + kill switch for the streaming endpoint</li>
  <li class="task-list-item"><input type="checkbox" disabled> <strong>Devon:</strong> latency dashboard with the 800ms line drawn on it</li>
  <li class="task-list-item"><input type="checkbox" disabled> <strong>Sam:</strong> write the cursor encoding RFC, one page max</li>
  <li class="task-list-item"><input type="checkbox" disabled> <strong>Priya:</strong> close out the three stale runbook pages before Friday</li>
</ul>
<h2>Discussion</h2>
<ul>
  <li>Streaming rollout
    <ul>
      <li>Retry behavior on disconnect is still client-defined; server sends <code>retry-after</code> but nobody reads it.</li>
      <li>Agreement: the SDK should honor it, apps that hand-roll fetch are on their own.
        <ul>
          <li>Devon volunteered to add it to the SDK changelog as a “behavior change” callout.</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>On-call load
    <ul>
      <li>Pages are down 40% since the alert dedup work. Two of the remaining alerts are known-noisy and owned by nobody.</li>
      <li>Priya takes both; if they can’t be fixed in an hour each, they get deleted.</li>
    </ul>
  </li>
</ul>
<blockquote>
  <p>“If an alert has fired twelve times and been actioned zero times, it isn’t an alert, it’s a screensaver.”</p>
</blockquote>
`
