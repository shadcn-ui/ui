---
title: Dynamic Search
description: Implement server-side search for large registries.
---

By default, `shadcn search` fetches your entire `registry.json` and filters
items locally. This works well for most registries and requires nothing more
than a static file.

For large registries with thousands of items, you can implement search on your
registry server instead. The CLI forwards the search parameters to your
registry and your server returns only the matching items.

Dynamic search is opt-in and fully backwards compatible. Static registries
keep working without any changes.

## How It Works

When you run `shadcn search`, the CLI appends the search parameters to the
catalog request:

```bash
npx shadcn@latest search @acme --query button --limit 50
```

```txt
GET https://acme.com/r/registry.json?q=button&limit=50&offset=0
```

What happens next depends on your registry:

- **Static registries** ignore the query parameters and return the full
  `registry.json`. The CLI filters the items locally. This is the default
  behavior and requires no changes.
- **Dynamic registries** filter the items server-side and return the matching
  items along with a `pagination` object. When the CLI sees `pagination` in
  the response, it trusts the results as pre-filtered and skips local
  filtering.

The presence of `pagination` in the response is what tells the CLI your
registry handles search server-side. There is no configuration or capability
negotiation required.

## Query Parameters

The CLI sends the following query parameters with every search request:

| Parameter | Description                                                    |
| --------- | -------------------------------------------------------------- |
| `q`       | The search query string.                                       |
| `type`    | Comma-separated item types, e.g. `registry:ui,registry:block`. |
| `limit`   | Maximum number of items to return.                             |
| `offset`  | Number of items to skip.                                       |

All parameters are optional. A request without `q` or `type` should return
all items, paginated.

## Response Format

Return your regular `registry.json` shape with an additional `pagination`
object:

```json title="registry.json?q=button&limit=2"
{
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "description": "A button component."
    },
    {
      "name": "icon-button",
      "type": "registry:ui",
      "description": "A button component with an icon."
    }
  ],
  "pagination": {
    "total": 12,
    "offset": 0,
    "limit": 2,
    "hasMore": true
  }
}
```

Search results only need `name`, `type` and `description` for each item. You
do not need to include `files`, `dependencies` or other item properties. The
CLI fetches the full item definition when the user runs `shadcn add`.

### pagination

| Property  | Type      | Description                                        |
| --------- | --------- | -------------------------------------------------- |
| `total`   | `number`  | Total number of items matching the query.          |
| `offset`  | `number`  | Number of items skipped.                           |
| `limit`   | `number`  | Maximum number of items in this response.          |
| `hasMore` | `boolean` | Whether more items are available beyond this page. |

## Server Implementation

Here's an example using a Next.js route handler:

```typescript title="app/r/registry.json/route.ts"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const query = searchParams.get("q")
  const types = searchParams.get("type")?.split(",")
  const limit = Number(searchParams.get("limit") ?? 100)
  const offset = Number(searchParams.get("offset") ?? 0)

  // Filter items using your database or search index.
  const { items, total } = await searchItems({ query, types, limit, offset })

  return NextResponse.json({
    name: "acme",
    homepage: "https://acme.com",
    items,
    pagination: {
      total,
      offset,
      limit,
      hasMore: offset + limit < total,
    },
  })
}
```

You can back `searchItems` with anything: a database query, a full-text
search index or an external search service.

## Multiple Registries

When searching a single registry, the CLI forwards all parameters and uses
your `pagination` response as-is.

When searching multiple registries at once, e.g. `shadcn search @acme @lib`,
a global `offset` cannot be split across registries. The CLI forwards `q` and
`type` to each registry along with a `limit` large enough to fill the
requested page (`offset + limit`), then merges and paginates the combined
results locally. Server-side filtering still applies, so each registry only
returns matching items.

If your registry caps the number of items per response below the requested
`limit`, the CLI treats it as exhausted for deeper pages. Honor the requested
`limit` where possible so all your matches stay reachable through paging.

## Authentication

Dynamic search works with all [authentication](/docs/registry/authentication)
patterns. The CLI sends the configured headers and params with the search
request, so you can scope search results to the authenticated user:

```typescript title="app/r/registry.json/route.ts"
export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  const team = await getTeamFromToken(token)

  // Only search items this team can access.
  const { items, total } = await searchItems({
    query: request.nextUrl.searchParams.get("q"),
    team,
  })

  // ...
}
```

## Backwards Compatibility

- **Static registries** require no changes. Query parameters on a static file
  are ignored by the file server and the CLI falls back to local filtering.
- **Older CLI versions** fetch the catalog without query parameters and
  ignore the `pagination` field. Your registry should return a sensible
  default response for requests without parameters, e.g. the first page of
  items.
- **Ranking** is up to your server. When your registry returns pre-filtered
  results, the CLI preserves your order instead of re-ranking locally.

## Testing

Test your dynamic registry with `curl`:

```bash
curl "https://acme.com/r/registry.json?q=button&limit=10"
```

Then verify with the CLI:

```bash
npx shadcn@latest search @acme --query button
```

To confirm server-side search is active, check that the response includes the
`pagination` object and only the matching items.
