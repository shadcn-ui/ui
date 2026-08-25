import {
  del as deleteBlob,
  get as getBlob,
  list as listBlobs,
  put as putBlob,
} from "@vercel/blob"

import {
  registryHealthSnapshotSchema,
  registryMonitorStateSchema,
  type RegistryHealthSnapshot,
  type RegistryMonitorRun,
  type RegistryMonitorState,
} from "./schema"

const BLOB_PREFIX = "registry-health/v1"
const STATE_PATH = `${BLOB_PREFIX}/state.json`
const LATEST_PATH = `${BLOB_PREFIX}/latest.json`

type BlobListItem = {
  pathname: string
  uploadedAt: Date
}

type BlobOperations = {
  get: (
    pathname: string,
    options: {
      access: "private"
      token?: string
      useCache: false
      abortSignal?: AbortSignal
    }
  ) => Promise<{ stream: ReadableStream<Uint8Array> | null } | null>
  put: (
    pathname: string,
    body: string,
    options: {
      access: "private"
      token?: string
      addRandomSuffix: false
      allowOverwrite?: boolean
      cacheControlMaxAge: number
      contentType: "application/json"
    }
  ) => Promise<{ url: string }>
  list: (options: {
    prefix: string
    cursor?: string
    limit: number
    token?: string
  }) => Promise<{
    blobs: BlobListItem[]
    cursor?: string
    hasMore: boolean
  }>
  del: (pathnames: string[], options: { token?: string }) => Promise<void>
}

const defaultOperations: BlobOperations = {
  get: getBlob,
  put: putBlob,
  list: listBlobs,
  del: deleteBlob,
}

async function readJsonStream(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let size = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    size += value.byteLength
  }

  const body = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }

  return JSON.parse(new TextDecoder().decode(body)) as unknown
}

export async function loadRegistryMonitorState({
  token,
  operations = defaultOperations,
}: {
  token?: string
  operations?: BlobOperations
}) {
  const result = await operations.get(STATE_PATH, {
    access: "private",
    token,
    useCache: false,
  })

  if (!result?.stream) return null

  return registryMonitorStateSchema.parse(await readJsonStream(result.stream))
}

export async function loadRegistryHealthSnapshot({
  token,
  abortSignal,
  operations = defaultOperations,
}: {
  token?: string
  abortSignal?: AbortSignal
  operations?: BlobOperations
}) {
  const result = await operations.get(LATEST_PATH, {
    access: "private",
    token,
    useCache: false,
    abortSignal,
  })

  if (!result?.stream) return null

  return registryHealthSnapshotSchema.parse(await readJsonStream(result.stream))
}

function getRunPath(run: RegistryMonitorRun) {
  const timestamp = run.startedAt.replaceAll(":", "-").replaceAll(".", "-")
  return `${BLOB_PREFIX}/runs/${timestamp}.json`
}

function getDailyPath(snapshot: RegistryHealthSnapshot) {
  return `${BLOB_PREFIX}/daily/${snapshot.generatedAt.slice(0, 10)}.json`
}

function getDailyDocument(
  state: RegistryMonitorState,
  snapshot: RegistryHealthSnapshot
) {
  const date = snapshot.generatedAt.slice(0, 10)
  return {
    schemaVersion: snapshot.schemaVersion,
    scoreVersion: snapshot.scoreVersion,
    date,
    generatedAt: snapshot.generatedAt,
    globalMeans: snapshot.globalMeans,
    registries: Object.fromEntries(
      Object.entries(state.registries).map(([name, entry]) => [
        name,
        {
          aggregate: entry.daily.find((bucket) => bucket.date === date) ?? null,
          health: snapshot.registries[name],
        },
      ])
    ),
  }
}

async function putJson({
  pathname,
  value,
  token,
  allowOverwrite = false,
  operations,
}: {
  pathname: string
  value: unknown
  token?: string
  allowOverwrite?: boolean
  operations: BlobOperations
}) {
  return operations.put(pathname, JSON.stringify(value), {
    access: "private",
    token,
    addRandomSuffix: false,
    allowOverwrite,
    cacheControlMaxAge: 60,
    contentType: "application/json",
  })
}

export async function publishRegistryHealth({
  state,
  snapshot,
  run,
  token,
  operations = defaultOperations,
}: {
  state: RegistryMonitorState
  snapshot: RegistryHealthSnapshot
  run: RegistryMonitorRun
  token?: string
  operations?: BlobOperations
}) {
  await putJson({
    pathname: getRunPath(run),
    value: run,
    token,
    operations,
  })
  await putJson({
    pathname: getDailyPath(snapshot),
    value: getDailyDocument(state, snapshot),
    token,
    allowOverwrite: true,
    operations,
  })
  await putJson({
    pathname: STATE_PATH,
    value: state,
    token,
    allowOverwrite: true,
    operations,
  })
  await putJson({
    pathname: LATEST_PATH,
    value: snapshot,
    token,
    allowOverwrite: true,
    operations,
  })

  return { latestPath: LATEST_PATH }
}

async function listAll({
  prefix,
  token,
  operations,
}: {
  prefix: string
  token?: string
  operations: BlobOperations
}) {
  const blobs: BlobListItem[] = []
  let cursor: string | undefined

  do {
    const page = await operations.list({
      prefix,
      cursor,
      limit: 1000,
      token,
    })
    blobs.push(...page.blobs)
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)

  return blobs
}

export async function cleanRegistryHealthHistory({
  token,
  now = new Date(),
  operations = defaultOperations,
}: {
  token?: string
  now?: Date
  operations?: BlobOperations
}) {
  const policies = [
    { prefix: `${BLOB_PREFIX}/runs/`, retentionDays: 14 },
    { prefix: `${BLOB_PREFIX}/daily/`, retentionDays: 90 },
  ]
  const stale: string[] = []

  for (const policy of policies) {
    const blobs = await listAll({
      prefix: policy.prefix,
      token,
      operations,
    })
    const cutoff = now.getTime() - policy.retentionDays * 24 * 60 * 60 * 1000
    stale.push(
      ...blobs
        .filter((blob) => blob.uploadedAt.getTime() < cutoff)
        .map((blob) => blob.pathname)
    )
  }

  for (let index = 0; index < stale.length; index += 100) {
    await operations.del(stale.slice(index, index + 100), { token })
  }

  return { deleted: stale.length }
}

export { BLOB_PREFIX, LATEST_PATH, STATE_PATH }
export type { BlobOperations }
