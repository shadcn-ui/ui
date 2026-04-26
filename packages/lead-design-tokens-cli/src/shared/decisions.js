// src/shared/decisions.js
// Parses the decisions log and [D##] references per the grammar in
// cli-spec.md §6.1 [D35]:
//
//   reference   := '[' WS? id-or-range (WS? ',' WS? id-or-range)* WS? ']'
//   id-or-range := 'D' digit+ (WS? ('–' | '-') WS? 'D'? digit+)?
//   WS          := (' ' | '\t')+

/**
 * Parse the decisions log table in DESIGN-DECISIONS.md.
 * The log uses markdown rows matching:  | D## | ... |
 *
 * @param {string} docText
 * @returns {Set<number>}
 */
export function parseDecisionsLog(docText) {
  const ids = new Set();
  const rowRe = /^\|\s*D(\d+)\s*\|/gm;
  for (const m of docText.matchAll(rowRe)) {
    ids.add(Number(m[1]));
  }
  return ids;
}

/**
 * Parse all decision references from a piece of markdown text.
 * Returns the set of integers referenced (ranges expanded).
 *
 * @param {string} text
 * @returns {Set<number>}
 */
export function parseDecisionReferences(text) {
  const ids = new Set();
  // Whole bracketed reference expression. The inner grammar permits
  // single IDs, hyphen/en-dash ranges, comma-separated lists, and whitespace.
  const refRe = /\[\s*D\d+(?:\s*[–-]\s*D?\d+)?(?:\s*,\s*D\d+(?:\s*[–-]\s*D?\d+)?)*\s*\]/g;

  for (const match of text.matchAll(refRe)) {
    const expr = match[0].slice(1, -1).trim();
    for (const part of expr.split(/\s*,\s*/)) {
      const rangeMatch = /^D(\d+)\s*[–-]\s*D?(\d+)$/.exec(part);
      if (rangeMatch) {
        const start = Number(rangeMatch[1]);
        const end = Number(rangeMatch[2]);
        if (start > end) {
          // Malformed range — skip silently; decision-check reports unresolved
          continue;
        }
        for (let i = start; i <= end; i++) ids.add(i);
      } else {
        const single = /^D(\d+)$/.exec(part);
        if (single) ids.add(Number(single[1]));
      }
    }
  }
  return ids;
}
