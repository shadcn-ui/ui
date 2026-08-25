---
title: Registry Health
description: How public registries are monitored and scored.
---

Registries can change or go offline after they are added to the directory.
Registry Health keeps checking them so users can see whether they are working
and maintainers can catch problems early.

We check that a registry is online, follows the registry format, and works with
the `shadcn` CLI. These checks are combined into a status and a score.

<Callout title="Registry Health is experimental and not live yet.">
  Scores are collected but do not yet affect registry visibility or ordering.
  The scoring model and its thresholds may change before launch.
</Callout>

**Registry Health only applies to registries listed in the shadcn/ui Registry
Directory.** It does not monitor or affect private registries, registries
configured directly in your project, or GitHub registries used through
`owner/repo/item` addresses.

Monitoring starts after a registry is published. It does not decide whether a
registry can be added, and failed checks do not unpublish it. A future version
of the Registry Directory may hide an unavailable registry from normal
browsing without removing it from the API.

## What we check

| Cadence | Check          | What we look for                                            |
| ------- | -------------- | ----------------------------------------------------------- |
| Hourly  | Registry index | The index is online, valid, and correctly configured.       |
| Daily   | Registry items | A rotating sample of items can be downloaded and validated. |
| Weekly  | CLI            | A rotating item works with `shadcn add --dry-run`.          |

Item checks rotate through the catalog over approximately 30 days. Scheduled
runs are best-effort, so we use the time of each real observation instead of
assuming that every scheduled check ran.

## Status

The status tells you how a registry is doing right now:

| Status          | What it means                                                             |
| --------------- | ------------------------------------------------------------------------- |
| **Observing**   | We are collecting the first 24 index checks over at least 24 hours.       |
| **Healthy**     | The initial observation period is complete and recent checks are passing. |
| **Degraded**    | The registry is online, but one or more recent checks are failing.        |
| **Unavailable** | The registry index has not passed a check for at least 24 hours.          |

A registry can become **Unavailable** before the initial observation period is
complete. We mark a registry as **Degraded** when:

- The index fails three checks in a row.
- The latest index does not match the registry schema.
- Fewer than 90% of sampled items pass after at least 10 checks.
- The two most recent CLI checks fail.

The status can react to a recent problem before the overall score changes much.
This means a registry can have a high score and still be **Degraded**.

Each status includes a short, human-readable reason. API consumers can use the
stable `statusReason.code` or display `statusReason.message`. Raw errors from
the monitor are not published.

After an availability failure, a registry needs two successful index and schema
checks in a row to recover. Other degradations clear when their failing checks
return to healthy levels.

## Score

Every registry receives one score out of **100 points**. It is the sum of four
components. The component values are not separate scores out of 100.

| Component      | Points | What it measures                                                        |
| -------------- | -----: | ----------------------------------------------------------------------- |
| Reliability    |     45 | How often the registry index was available over the last 7 and 30 days. |
| Correctness    |     25 | Whether the index and sampled items match the registry schema.          |
| Installability |     20 | Whether sampled items work with the `shadcn` CLI.                       |
| Registry setup |     10 | HTTPS, JSON responses, unique item names, and a matching registry name. |

The score is about reliability and compatibility. It is not a measure of
popularity, code quality, design quality, or how many items a registry contains.

### How the points are calculated

Recent availability matters more than older availability:

```text
Reliability = 45 * (0.65 * availability7d + 0.35 * availability30d)
```

Correctness gives up to 10 points for the index and 15 points for sampled items:

```text
Correctness = 10 * indexSchemaPassRate30d
            + 15 * sampledItemPassRate30d
```

Installability is based on CLI checks:

```text
Installability = 20 * dryRunPassRate30d
```

Registry setup has four checks worth 2.5 points each. If we have not observed a
setup signal yet, it receives 1.25 points until it can be checked.

Each component is rounded to three decimal places. The published score is the
sum of those rounded values.

## Scores for new registries

A new registry does not have enough history for a reliable score. We blend its
early results with the average across monitored registries. As more checks are
collected, the registry's own results have more influence.

This prevents one successful check from producing a perfect score and one
failed check from producing a zero. It also explains why an **Observing**
registry can already have a score close to the overall average.

For API consumers, the smoothing formula is:

```text
(successes + globalMean * priorWeight) / (observations + priorWeight)
```

The prior weight follows the cadence of each check:

| Signal                | Prior weight |
| --------------------- | -----------: |
| Availability          |           24 |
| Index schema validity |           12 |
| Sampled item validity |           10 |
| CLI checks            |            3 |

When there is not enough registry-wide data to calculate an average, we start
with an 85% availability prior and a 90% prior for the other measured rates. A
change to the formula, weights, or thresholds requires a new `scoreVersion`.

## Health data in the API

`/r/registries.json` adds an optional `health` object to each registry. It
includes:

- The current `status` and `statusReason`.
- The overall `score` and its component `breakdown`.
- Smoothed `availability7d` and `availability30d` rates from 0 to 1.
- `firstObservedAt`, `checkedAt`, and `lastSuccessfulCheck` timestamps.
- `schemaVersion` and `scoreVersion` for integrations.

The object also includes two flags:

- `monitoringLimited` means the latest registry index request was blocked by a
  CDN or WAF challenge. Challenge responses do not count as availability or
  sampled item validation failures.
- `hidden` becomes `true` after seven continuous days of unavailability.

The Registry Directory does not currently use the `hidden` flag.

## Monitoring limitations

All checks come from one hosted runner. Latency is therefore kept as a private
diagnostic and does not affect the score because some regions would have an
unfair advantage.

CDN and WAF challenges are also handled separately. A challenge tells us that
our runner could not complete the check, not that the registry is unavailable
to everyone.

## What happens next

We will collect and review baseline data before using Registry Health in the
Directory. Ranking, filtering, and health UI will ship separately once the
monitoring data is reliable.
