import { headers } from "next/headers"
import type { NextRequest } from "next/server"
import { UAParser, type IResult } from "ua-parser-js"

import {
  Topic,
  TopicRecordPayloads,
  schemaIdByTopic,
} from "@/lib/analytics/types"

interface RequestBody<T extends Topic = Topic> {
  topic: T
  record: TopicRecordPayloads[T]
}

const kafkaHttpGatewayHost = "data.streaming.vercel.sh"

const productEndpoint = `https://${kafkaHttpGatewayHost}/v1/produce`

export async function POST(request: NextRequest): Promise<Response> {
  const body = (await request.json()) as RequestBody

  const kafkaMessage = {
    topic: body.topic,
    schema_id: schemaIdByTopic[body.topic],
    record: {
      ...(await getRecord(body.topic, body.record, request)),
      id: crypto.randomUUID(),
      event_time: Date.now(),
    },
  }

  const stamHeaders = new Headers()
  stamHeaders.append("Content-Type", "application/json")
  stamHeaders.append("Host", "data.streaming.vercel.sh")
  stamHeaders.append("Client-Id", "ui-shadcn-site")

  console.log(`POST KAFKA`, kafkaMessage)

  const response = await fetch(productEndpoint, {
    method: "POST",
    headers: stamHeaders,
    body: JSON.stringify(kafkaMessage),
  })

  const text = (await response.text()) as string

  return new Response(text, {
    status: response.status,
    headers: response.headers,
  })
}

async function getAnonUserId(userAgent: string) {
  // Get forwarded IP, fallback to Vercel-provided IP if no forward
  const reqHeaders = await headers()
  const ipNumber =
    reqHeaders.get("x-fwd-ip") ?? reqHeaders.get("x-forwarded-for")
  const encodedText = new TextEncoder().encode(`${ipNumber}${userAgent}`)
  const digest = await crypto.subtle.digest("SHA-1", encodedText)
  // @ts-expect-error - Allow Uint8Array
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\//g, "_")
    .replace(/\+/g, "-")
    .replace(/=/g, "")
}

function getBrowserInfo(baseRecord: {
  user_agent?: string | null | undefined
}): IResult | undefined {
  return baseRecord.user_agent ? UAParser(baseRecord.user_agent) : undefined
}

async function getStableId(browserInfo?: {
  ua?: string | null | undefined
}): Promise<string | undefined> {
  if (!browserInfo) return undefined
  if (!browserInfo.ua) return undefined
  const stableId: string | undefined = await getAnonUserId(browserInfo.ua)
  return stableId
}

async function getRecord<T extends Topic>(
  topic: T,
  record: TopicRecordPayloads[T],
  request: NextRequest
): Promise<TopicRecordPayloads[T]> {
  switch (topic) {
    case Topic.UiShadcnSiteActivity: {
      const baseRecord =
        record as TopicRecordPayloads[Topic.UiShadcnSiteActivity]

      const browserInfo = getBrowserInfo(baseRecord)

      const stableId: string | undefined = await getStableId(browserInfo)

      const utmString =
        baseRecord.utm && typeof baseRecord.utm === "object"
          ? JSON.stringify(baseRecord.utm)
          : typeof baseRecord.utm === "string"
          ? baseRecord.utm
          : undefined

      const finalRecord: TopicRecordPayloads[Topic.UiShadcnSiteActivity] = {
        ...baseRecord,
        stable_id: stableId,
        ip_inferred_country: request.headers.get("x-vercel-ip-country") ?? "",
        device_type: browserInfo?.device.type,
        utm: utmString,
        is_logged_in: false,
      }

      return finalRecord as TopicRecordPayloads[T]
    }
    default:
      return record
  }
}

// async function getAnonUserId(userAgent: string): Promise<string> {
//   const resolvedHeaders = await headers()
//   const ipNumber: string =
//     resolvedHeaders.get("x-fwd-ip") ??
//     resolvedHeaders.get("x-forwarded-for") ??
//     ""
//   const encodedText: Uint8Array = new TextEncoder().encode(
//     `${ipNumber}${userAgent}`
//   )
//   const digest: ArrayBuffer = await crypto.subtle.digest("SHA-1", encodedText)
//   return btoa(String.fromCharCode(...new Uint8Array(digest)))
//     .replace(/\//g, "_")
//     .replace(/\+/g, "-")
//     .replace(/=/g, "")
// }

// {
//   "name": "activity",
//   "namespace": "ui_shadcn_site.v0",
//   "doc": "Pageview analytics events for https://ui.shadcn.com",
//   "owner": "vercel/design-engineering",
//   "type": "record",

//   "fields": [
//     {
//       "name": "query_string",
//       "doc": "Query string of the page, including '?'",
//       "type": ["null", "string"],
//       "default": null
//     },
//     {
//       "name": "referrer",
//       "doc": "Referrer of the current page",
//       "type": ["null", "string"],
//       "default": null
//     },
//     {
//       "name": "utm",
//       "doc": "Any UTM parameters that are present from the session or current page, as a JSON string",
//       "type": ["null", "string"],
//       "default": null
//     },
//     {
//       "name": "utm_object",
//       "doc": "Any UTM parameters that are present from the session or current page, as an object",
//       "type": [
//         "null",
//         {
//           "type": "record",
//           "name": "team_created_utm_params",
//           "fields": [
//             {
//               "doc": "UTM source",
//               "name": "utm_source",
//               "type": ["null", "string"],
//               "default": null
//             },
//             {
//               "doc": "UTM medium",
//               "name": "utm_medium",
//               "type": ["null", "string"],
//               "default": null
//             },
//             {
//               "doc": "UTM campaign",
//               "name": "utm_campaign",
//               "type": ["null", "string"],
//               "default": null
//             },
//             {
//               "doc": "UTM term",
//               "name": "utm_term",
//               "type": ["null", "string"],
//               "default": null
//             },
//             {
//               "doc": "UTM content",
//               "name": "utm_content",
//               "type": ["null", "string"],
//               "default": null
//             }
//           ]
//         }
//       ],
//       "default": null
//     },
//     {
//       "name": "page_title",
//       "doc": "HTML document title of the viewed page at time of event",
//       "type": ["null", "string"],
//       "default": null
//     },
//     {
//       "name": "page_path",
//       "doc": "Fully qualified URL including protocol, domain, path, and query parameters",
//       "type": ["null", "string"],
//       "default": null
//     },
//     {
//       "doc": "Device Type ('Desktop', 'Mobile', 'Tablet', etc.)",
//       "name": "device_type",
//       "type": ["null", "string"],
//       "default": null
//     },
//     {
//       "name": "ip_inferred_country",
//       "doc": "Two-letter ISO 3166-1 alpha-2 country code derived from IP geolocation",
//       "type": ["null", "string"],
//       "default": null
//     },
//     {
//       "name": "user_agent",
//       "doc": "Complete HTTP User-Agent header string from the client request",
//       "type": ["null", "string"],
//       "default": null
//     },
//     {
//       "name": "vercel_user_id",
//       "doc": "Unique identifier for authenticated Vercel platform users",
//       "type": ["null", "string"],
//       "default": null
//     },
//     {
//       "name": "is_logged_in",
//       "doc": "Boolean flag indicating whether the user was authenticated at time of event",
//       "type": "boolean"
//     }
//   ]
// }
