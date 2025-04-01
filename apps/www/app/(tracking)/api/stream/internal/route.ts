// import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { UAParser } from "ua-parser-js"
import { v4 as uuidv4 } from "uuid"

export enum Topic {
  UiShadcnSiteActivity = "ui_shadcn_site.v0.activity",
}

type AllowNullForUndefined<T extends Record<string, unknown>> = {
  [K in keyof T]: T extends Record<K, T[K]> ? T[K] : T[K] | null
}

export interface TopicRecordPayloads {
  [Topic.UiShadcnSiteActivity]: AllowNullForUndefined<{
    country?: string
    device_type?: string
    event_time?: number
    id: string
    is_logged_in?: boolean
    stable_id?: string
    user_agent?: string
  }>
}

const schemaIdByTopic: Record<Topic, number> = {
  [Topic.UiShadcnSiteActivity]: 100600,
}

interface RequestBody<T extends Topic = Topic> {
  topic: T
  record: TopicRecordPayloads[T]
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

      const browserInfo = baseRecord.user_agent
        ? UAParser(baseRecord.user_agent)
        : undefined

      // const stableId: string | undefined = browserInfo
      //   ? await getAnonUserId(browserInfo.ua)
      //   : undefined

      const finalRecord: TopicRecordPayloads[Topic.UiShadcnSiteActivity] = {
        ...baseRecord,
        country: request.headers.get("x-vercel-ip-country") ?? "",
        device_type: browserInfo?.device.type,
        // stable_id: stableId,
        // is_logged_in: (await cookies()).get("isLoggedIn")?.value === "1",
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

const kafkaHttpGatewayHost = "data.streaming.vercel.sh"

const productEndpoint = `https://${kafkaHttpGatewayHost}/v1/produce`

export async function POST(request: NextRequest): Promise<Response> {
  const body = (await request.json()) as RequestBody

  const kafkaMessage = {
    topic: body.topic,
    schema_id: schemaIdByTopic[body.topic],
    record: {
      ...(await getRecord(body.topic, body.record, request)),
      id: uuidv4(),
      event_time: Date.now(),
    },
  }

  const stamHeaders = new Headers()
  stamHeaders.append("Content-Type", "application/json")
  stamHeaders.append("Host", "data.streaming.vercel.sh")
  stamHeaders.append("Client-Id", "next-site")

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
