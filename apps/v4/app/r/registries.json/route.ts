import { NextResponse } from "next/server"

import { loadRegistryHealthSnapshot } from "@/lib/registry-health/blob"
import { createObservingRegistryHealth } from "@/lib/registry-health/score"
import directory from "@/registry/directory.json"

export const dynamic = "force-static"
export const revalidate = 300

const SNAPSHOT_STALE_AFTER_MS = 6 * 60 * 60 * 1000
const SNAPSHOT_TIMEOUT_MS = 2500

function getDirectoryPayload() {
  return directory.map(({ name, homepage, url, description }) => ({
    name,
    homepage,
    url,
    description,
  }))
}

async function getHealthSnapshot() {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), SNAPSHOT_TIMEOUT_MS)

  try {
    const snapshot = await loadRegistryHealthSnapshot({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      abortSignal: controller.signal,
    })
    if (!snapshot) throw new Error("missing_snapshot")

    const age = Date.now() - new Date(snapshot.generatedAt).getTime()
    if (age < 0 || age > SNAPSHOT_STALE_AFTER_MS) {
      throw new Error("stale_snapshot")
    }

    return snapshot
  } catch (error) {
    console.warn(
      "Registry health snapshot unavailable:",
      error instanceof Error ? error.message : "unknown_error"
    )
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export async function GET() {
  const registries = getDirectoryPayload()

  if (process.env.REGISTRY_HEALTH_ENABLED !== "1") {
    return NextResponse.json(registries)
  }

  const snapshot = await getHealthSnapshot()
  if (!snapshot) {
    return NextResponse.json(registries)
  }

  return NextResponse.json(
    registries.map((registry) => ({
      ...registry,
      health:
        snapshot.registries[registry.name] ??
        createObservingRegistryHealth({
          registryUrl: registry.url,
          checkedAt: snapshot.generatedAt,
          globalMeans: snapshot.globalMeans,
        }),
    }))
  )
}
