# Storybook ↔ Figma Visual Parity Standard

**Status:** working standard. Tracks Linear `JES-90`. Read this before opening a parity PR for any Lead component.

---

## The rule

**Figma is the visual source of truth for Storybook.** A Storybook story for a Lead component must render the production React component (not a static screenshot), and the rendered visual must match the corresponding Figma component unless every difference is explicitly documented as an accessibility, product, or API exception.

This is not aspirational. It's the contract this lane operates under:

- **Match by default.** New parity stories must visually mirror the Figma source on every dimension the React component can express (spacing, radius, typography, alignment, colors via tokens, layout direction, button order, overlay treatment).
- **Document by exception.** Any deliberate divergence — accessibility-driven, product-priority, API-shape, or design-decision — must be called out *inline in the story description*, with a link to the source decision doc or Linear issue that authorized it.
- **Storybook renders Lead components.** No `<img>` mockups, no inline-style fakes pretending to be the component. Approximations live in story-local code only when the component family doesn't yet exist (the `Experimental / Figma Export /` namespace is for that case).

---

## Required story shape

Every parity-aligned production story must include the following.

### 1. Sidebar location

- **Production parity stories** live under `Components / <ComponentName> / Figma parity (<size or variant>)`. The naming convention `Figma parity (md)` / `Figma parity (sm)` / `Figma parity (default)` makes the story's purpose self-documenting.
- **Experimental exports** (used to surface gaps before production exists) live under `Experimental / Figma Export / <ComponentName>` and follow the same docstring requirements but additionally describe deferred items.

### 2. Story file header comment

```ts
/**
 * <ComponentName> — Storybook stories.
 *
 * Includes Figma-parity stories matching the source design at:
 *   https://www.figma.com/design/<file-key>/<file-name>?node-id=<node>
 *   Component symbol: <node-id>
 *   Page: <node-id>
 *
 * Parity reference: docs/storybook-figma-parity-standard.md.
 * <Component decision doc, if any>: docs/<component-name>-decision.md.
 */
```

### 3. Per-story `parameters.docs.description.story`

For each Figma-parity story, the description must include:

- **What this story mirrors.** The Figma node URL and which variant/breakpoint it represents.
- **Mapped surfaces.** Which Figma properties (text, variant, size, state) translate to which React props.
- **Approximated surfaces** (if any). Where Storybook-local code stands in because the component family doesn't yet expose a prop or because the asset isn't retrievable from Figma MCP.
- **Documented non-parity exceptions** (if any). With a link to the authorizing decision.

### 4. Required content

The story render function must:

- Render the production Lead component (`@leadbank/ui` import), not a wrapper, mockup, or static asset.
- Use Lead tokens via CSS variables (`var(--lead-color-*)`, `var(--lead-radius-*)`, etc.) for any necessary inline styles. No raw hex literals.
- Mirror the Figma layout structure (header / body / footer composition; button order; alignment).
- Default `defaultOpen` for overlay components (Dialog, AlertDialog, Popover, Tooltip) so reviewers see the rendered preview without an extra click — but provide a separate "trigger interaction" story where the open transition is part of what's being demonstrated.

---

## Exception format

When a documented divergence from Figma is necessary, the story description must include this block:

> **Documented non-parity exception:**
>
> - **Difference:** <what Storybook does that Figma does not, or vice versa>
> - **Reason:** <accessibility / product / API / decision-doc>
> - **Authority:** <link to decision doc, Linear issue, or API-CONSISTENCY.md anchor>
> - **Resolution path:** <if Figma should be updated to match, OR if Lead deliberately diverges forever>

### Acceptable exception categories

| Category | When it applies | Example |
|---|---|---|
| **Accessibility** | The Figma design implies behavior or visual choice that violates WCAG / WAI-ARIA. Lead deviates to comply. | AlertDialog forbids outside-click dismissal even if Figma shows a close icon. |
| **Product** | The Figma design includes content that's a one-off or incompatible with Lead's customer flows. | A Card example showing an account number; Lead omits PII placeholders. |
| **API shape** | Lead's React component family doesn't expose a prop matching the Figma surface. The decision is to not expand the API. | Skeleton's `Card` variant in Figma; Lead's `<Skeleton>` has only `text`/`rect`/`circle`. |
| **Decision doc** | A formal `docs/<component>-decision.md` resolved a question that creates intentional divergence. | AlertDialog button-order standardization (decision §4) reverses Figma's sm order. |

### Unacceptable "exceptions"

- "Lead's primary token doesn't quite match Figma's button color" — fix the token via Lane 2 (token publishing), don't divergence-document.
- "Storybook's rendering is slightly different because of the addon" — check Storybook config; not a real exception.
- "It's just easier this way" — that's drift, not a decision. File a follow-up issue.

---

## Where parity stories live

| Audience | Lives under | Status |
|---|---|---|
| **Designers comparing live Storybook ↔ Figma** | `Components / <X> / Figma parity (<...>)` | Required for every shipped component once Lane 3 has converged on parity. |
| **Engineers consuming the canonical use cases** | `Components / <X> / *` (other stories) | Required for shipped components; pre-dates this standard. |
| **Lane 3 prototypes / gap-finders** | `Experimental / Figma Export / <X>` | Optional; appropriate when the production component doesn't exist yet *or* when the Figma surface materially differs from production and the gap is the artifact being reviewed. |

A single component may have stories in *both* namespaces — see AlertDialog: experimental export (JES-83) demonstrating the original Figma surface and approximations, plus production parity stories (JES-86 + JES-89). The two together make the prototype-to-production journey legible.

---

## Verification requirements

A parity PR must pass before review:

- `npm run lead:ui:typecheck` — clean.
- `npm run lead:ui:test` — full lead-ui suite green.
- `npm run lead:storybook:build` — clean build.
- `npm test` (root) — token CLI + schemas + decisions all green.
- `git diff --check` — clean.
- `gh api .../variables/FIGMA_CODE_CONNECT_ENABLED` — `"false"` (verifies the Code Connect publish gate hasn't been touched).
- **Bundle delta reported in the PR body.** Even docs/story-only PRs report `npm run lead:ui:build` output to keep the running budget visible.

The PR body must include:

- The Figma node URL the parity story mirrors.
- A list of mapped, approximated, and exception surfaces.
- Confirmation that no Code Connect / workflow / secret / variable changes occurred.

---

## Reference implementation

**AlertDialog** (JES-86 + JES-89) is the canonical pattern. Its production stories at `Components / Alert Dialog` include:

- `Destructive confirmation (md)` and `Save or discard changes (md)` — in-context usage stories.
- `sm breakpoint (auto-stacked footer)` — variant demonstration.
- `With item preview (composition pattern)` — caller composition documentation.
- **`Figma parity (md)`** and **`Figma parity (sm)`** — direct visual comparison stories with inline Figma URLs in their docstrings, the documented non-parity exception block (button order, sm width), and a link to the decision doc.

Future parity work follows this shape. Don't reinvent the structure.

---

## What this standard does NOT cover

- **Token correctness.** That's Lane 2 (token publishing). If a parity gap is "this token's value is wrong," file a token PR, not a parity PR.
- **Component API expansion.** If parity requires a new prop, that's a decision doc + implementation issue, not a story-only fix. See AlertDialog (JES-85 → JES-86).
- **Code Connect mapping accuracy.** That's Lane 1, currently parked. Storybook parity is independent.
- **Visual regression testing.** Out of scope for v1; visual comparison is human-led against the deployed Storybook + Figma URL. Future automation (Chromatic, Percy) is a separate workstream.

---

## How to start a parity PR

1. Pick a component from the inventory (`docs/storybook-figma-parity-inventory.md`).
2. Confirm its Figma node URL via the Code Connect mapping (`packages/lead-ui/src/components/<X>/<X>.figma.tsx`) or the inventory doc.
3. Use Figma MCP to fetch design context + screenshot for the node.
4. Compare against the deployed Storybook story.
5. If parity needs only story changes → open a Storybook-only PR (this standard's path).
6. If parity needs CSS or component changes → first determine if a decision doc is required (see AlertDialog precedent). If yes, open the decision PR first; if no, the changes must still pass typecheck/test/build/`git diff --check`.
7. Add `Figma parity (<...>)` stories per the required shape above.
8. Document any exceptions inline.
9. Run verification, open draft PR, link the Linear issue and the Figma node URL.
