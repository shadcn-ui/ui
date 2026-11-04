import { readFileSync } from "node:fs"
import { setImmediate } from "node:timers/promises"
import { runInNewContext } from "node:vm"
import ts from "typescript"
import { describe, expect, it, vi } from "vitest"

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

function createStream() {
  const tracks = [{ stop: vi.fn() }, { stop: vi.fn() }]
  return { getTracks: () => tracks }
}

type Stream = ReturnType<typeof createStream>

// Exercise the authored effect without importing the card's unrelated UI tree.
function readMicrophoneEffect(base: string) {
  const file = new URL(
    `./bases/${base}/blocks/preview/cards/live-waveform.tsx`,
    import.meta.url
  )
  const source = ts.createSourceFile(
    file.pathname,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  const effects: ts.Node[] = []
  function visit(node: ts.Node) {
    if (
      ts.isCallExpression(node) &&
      node.expression.getText(source) === "useEffect" &&
      node.arguments[0]?.getText(source).includes("getUserMedia")
    ) {
      effects.push(node.arguments[0])
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  expect(effects).toHaveLength(1)
  return ts.transpileModule(`(${effects[0].getText(source)})`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText
}

function createHarness(effectSource: string) {
  const requests: ReturnType<typeof deferred<Stream>>[] = []
  const contexts: { close: ReturnType<typeof vi.fn> }[] = []
  const AudioContext = vi.fn(function () {
    const context = {
      state: "running",
      close: vi.fn().mockResolvedValue(undefined),
      createAnalyser: () => ({}),
      createMediaStreamSource: vi.fn(() => ({ connect: vi.fn() })),
    }
    contexts.push(context)
    return context
  })
  const scope = {
    active: true,
    deviceId: undefined,
    fftSize: 256,
    smoothingTimeConstant: 0.8,
    streamRef: { current: null as Stream | null },
    audioContextRef: { current: null },
    analyserRef: { current: null },
    historyRef: { current: [] },
    animationRef: { current: 0 },
    cancelAnimationFrame: vi.fn(),
    onStreamReady: vi.fn(),
    onStreamEnd: vi.fn(),
    onError: vi.fn(),
    window: { AudioContext },
    navigator: {
      mediaDevices: {
        getUserMedia: vi.fn(() => {
          const request = deferred<Stream>()
          requests.push(request)
          return request.promise
        }),
      },
    },
  }
  const setup: () => (() => void) | undefined = runInNewContext(
    effectSource,
    scope
  )
  return { setup, scope, requests, contexts, AudioContext }
}

describe.each(["base", "radix", "aria"])(
  "%s LiveWaveform microphone",
  (base) => {
    const effectSource = readMicrophoneEffect(base)

    it("releases all tracks and the audio context after a normal stop", async () => {
      const { setup, scope, requests, contexts } = createHarness(effectSource)
      const cleanup = setup()
      const stream = createStream()
      requests[0].resolve(stream)
      await requests[0].promise
      await setImmediate()

      expect(scope.onStreamReady).toHaveBeenCalledWith(stream)
      expect(contexts).toHaveLength(1)
      cleanup?.()
      scope.active = false
      setup()

      for (const track of stream.getTracks()) {
        expect(track.stop).toHaveBeenCalledTimes(1)
      }
      expect(contexts[0].close).toHaveBeenCalledTimes(1)
      expect(scope.onStreamEnd).toHaveBeenCalledTimes(1)
      expect(scope.streamRef.current).toBeNull()
      expect(scope.audioContextRef.current).toBeNull()
    })

    it("discards a stream granted after unmount", async () => {
      const { setup, scope, requests, AudioContext } =
        createHarness(effectSource)
      const cleanup = setup()
      cleanup?.()
      const stream = createStream()
      requests[0].resolve(stream)
      await requests[0].promise
      await setImmediate()

      for (const track of stream.getTracks()) {
        expect(track.stop).toHaveBeenCalledTimes(1)
      }
      expect(AudioContext).not.toHaveBeenCalled()
      expect(scope.onStreamReady).not.toHaveBeenCalled()
      expect(scope.streamRef.current).toBeNull()
    })

    it("keeps a newer stream when an earlier request resolves last", async () => {
      const { setup, scope, requests, contexts } = createHarness(effectSource)
      const cleanupOld = setup()
      cleanupOld?.()
      scope.active = false
      setup()
      scope.active = true
      const cleanupNew = setup()
      const newStream = createStream()
      requests[1].resolve(newStream)
      await requests[1].promise
      await setImmediate()
      const oldStream = createStream()
      requests[0].resolve(oldStream)
      await requests[0].promise
      await setImmediate()

      for (const track of oldStream.getTracks()) {
        expect(track.stop).toHaveBeenCalledTimes(1)
      }
      for (const track of newStream.getTracks()) {
        expect(track.stop).not.toHaveBeenCalled()
      }
      expect(scope.streamRef.current).toBe(newStream)
      expect(contexts).toHaveLength(1)
      expect(scope.audioContextRef.current).toBe(contexts[0])
      expect(contexts[0].close).not.toHaveBeenCalled()
      expect(scope.onStreamReady).toHaveBeenCalledExactlyOnceWith(newStream)

      cleanupNew?.()
      for (const track of newStream.getTracks()) {
        expect(track.stop).toHaveBeenCalledTimes(1)
      }
      expect(contexts[0].close).toHaveBeenCalledTimes(1)
    })

    it.each([false, true])(
      "reports errors only while valid (cancelled: %s)",
      async (cancelled) => {
        const { setup, scope, requests } = createHarness(effectSource)
        const cleanup = setup()
        if (cancelled) cleanup?.()
        const error = new Error("Permission denied")
        requests[0].reject(error)
        await expect(requests[0].promise).rejects.toBe(error)
        await setImmediate()

        if (cancelled) {
          expect(scope.onError).not.toHaveBeenCalled()
        } else {
          expect(scope.onError).toHaveBeenCalledExactlyOnceWith(error)
          cleanup?.()
        }
      }
    )

    it("releases resources across StrictMode's setup-cleanup-setup sequence", async () => {
      const { setup, scope, requests, contexts } = createHarness(effectSource)
      // Simulate React's effect replay, retaining the same refs between setups.
      const cleanupFirst = setup()
      cleanupFirst?.()
      const cleanupSecond = setup()
      const firstStream = createStream()
      const secondStream = createStream()
      requests[0].resolve(firstStream)
      requests[1].resolve(secondStream)
      await Promise.all(requests.map((request) => request.promise))
      await setImmediate()

      expect(scope.onStreamReady).toHaveBeenCalledExactlyOnceWith(secondStream)
      expect(contexts).toHaveLength(1)
      cleanupSecond?.()
      for (const stream of [firstStream, secondStream]) {
        for (const track of stream.getTracks()) {
          expect(track.stop).toHaveBeenCalledTimes(1)
        }
      }
      expect(contexts[0].close).toHaveBeenCalledTimes(1)
      expect(scope.streamRef.current).toBeNull()
      expect(scope.audioContextRef.current).toBeNull()
    })
  }
)
