// src/shared/dates.js
// Date semantics for sourceExceptions resolvedBy field [D36].
//
// Quarter shorthand resolves to the final calendar day of that quarter in
// America/New_York at 23:59:59. ISO dates treated same way (end-of-day).
// This module intentionally doesn't pull in a heavy date library — the logic
// is small enough that correctness is easier to audit inline.

const TZ = 'America/New_York';

const QUARTER_END_MONTH_DAY = {
  1: [2, 31], // Mar 31 (month is 0-indexed in Date)
  2: [5, 30], // Jun 30
  3: [8, 30], // Sep 30
  4: [11, 31], // Dec 31
};

/**
 * Resolve a resolvedBy string to an absolute UTC Date representing
 * end-of-day in America/New_York.
 *
 * Accepts:
 *   - "YYYY-MM-DD"   → that day at 23:59:59 ET
 *   - "YYYY-QN"      → last day of quarter at 23:59:59 ET
 *
 * @param {string} s
 * @returns {Date}
 */
export function resolveDeadline(s) {
  if (typeof s !== 'string') {
    throw new Error(`resolvedBy must be a string, got ${typeof s}`);
  }

  const quarterMatch = /^(\d{4})-Q([1-4])$/.exec(s);
  if (quarterMatch) {
    const year = Number(quarterMatch[1]);
    const q = Number(quarterMatch[2]);
    const [month, day] = QUARTER_END_MONTH_DAY[q];
    return endOfDayET(year, month, day);
  }

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]) - 1;
    const day = Number(isoMatch[3]);
    return endOfDayET(year, month, day);
  }

  throw new Error(`Invalid resolvedBy format: "${s}". Expected YYYY-MM-DD or YYYY-QN.`);
}

/**
 * Construct a Date representing end-of-day (23:59:59.999) on the given
 * calendar day in America/New_York, expressed as a UTC Date.
 *
 * Uses Intl.DateTimeFormat to figure out the UTC offset for that specific
 * day (handles DST correctly).
 */
function endOfDayET(year, month, day) {
  // Start with a UTC guess at 23:59:59.999 on the target day.
  const guess = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

  // Ask: what is this UTC instant, rendered in America/New_York?
  const etParts = getDatePartsInTZ(guess, TZ);

  // Compute offset by comparing the intended wall-clock time to what the
  // guess renders as in ET. If they don't match, adjust.
  const intendedAsUTC = Date.UTC(year, month, day, 23, 59, 59, 999);
  const renderedAsUTC = Date.UTC(
    etParts.year,
    etParts.month - 1,
    etParts.day,
    etParts.hour,
    etParts.minute,
    etParts.second,
    999
  );
  const offsetMs = intendedAsUTC - renderedAsUTC;
  return new Date(guess.getTime() + offsetMs);
}

function getDatePartsInTZ(date, timeZone) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).filter((p) => p.type !== 'literal').map((p) => [p.type, p.value])
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour === '24' ? '0' : parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

/**
 * @param {Date} deadline
 * @param {Date} now
 * @returns {boolean}
 */
export function isOverdue(deadline, now) {
  return deadline.getTime() < now.getTime();
}
