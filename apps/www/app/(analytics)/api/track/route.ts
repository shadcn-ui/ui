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

  console.log(`Post to Kafka:`, {
    url: productEndpoint,
    headers: Object.fromEntries(stamHeaders.entries()),
    body: kafkaMessage,
  })

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
    case Topic.UiShadcnSiteV0Activity: {
      const baseRecord =
        record as TopicRecordPayloads[Topic.UiShadcnSiteV0Activity]

      const browserInfo = getBrowserInfo(baseRecord)

      const stableId: string | undefined = await getStableId(browserInfo)

      const finalRecord: TopicRecordPayloads[Topic.UiShadcnSiteV0Activity] = {
        ...baseRecord,
        stable_id: stableId,
        ip_inferred_country: request.headers.get("x-vercel-ip-country") ?? "",
        device_type: browserInfo?.device.type,
        utm_source: baseRecord.utm_source || undefined, // UTM source from query_params
        utm_medium: baseRecord.utm_medium || undefined, // UTM medium from query_params
        utm_campaign: baseRecord.utm_campaign || undefined, // UTM campaign from query_params
        utm_term: baseRecord.utm_term || undefined, // UTM term from query_params
        utm_content: baseRecord.utm_content || undefined, // UTM content from query_params
        is_logged_in: false,
      }

      return finalRecord as TopicRecordPayloads[T]
    }
    default:
      return record
  }
}
