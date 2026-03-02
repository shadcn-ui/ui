"use client"

import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"

type AgentState =
  | "connecting"
  | "initializing"
  | "listening"
  | "speaking"
  | "thinking"

type AnimationState = AgentState | undefined

interface AudioAnalyserOptions {
  fftSize?: number
  smoothingTimeConstant?: number
  minDecibels?: number
  maxDecibels?: number
}

interface MultiBandVolumeOptions {
  bands?: number
  loPass?: number
  hiPass?: number
  updateInterval?: number
  analyserOptions?: AudioAnalyserOptions
}

const multibandDefaults: MultiBandVolumeOptions = {
  bands: 5,
  loPass: 100,
  hiPass: 600,
  updateInterval: 32,
  analyserOptions: { fftSize: 2048 },
}

const normalizeDb = (value: number) => {
  if (value === -Infinity) return 0
  const minDb = -100
  const maxDb = -10
  const db = 1 - (Math.max(minDb, Math.min(maxDb, value)) * -1) / 100
  return Math.sqrt(db)
}

function createAudioAnalyser(
  mediaStream: MediaStream,
  options: AudioAnalyserOptions = {}
) {
  const audioContext = new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext)()
  const source = audioContext.createMediaStreamSource(mediaStream)
  const analyser = audioContext.createAnalyser()

  if (options.fftSize) analyser.fftSize = options.fftSize
  if (options.smoothingTimeConstant !== undefined) {
    analyser.smoothingTimeConstant = options.smoothingTimeConstant
  }
  if (options.minDecibels !== undefined)
    analyser.minDecibels = options.minDecibels
  if (options.maxDecibels !== undefined)
    analyser.maxDecibels = options.maxDecibels

  source.connect(analyser)

  const cleanup = () => {
    source.disconnect()
    audioContext.close()
  }

  return { analyser, audioContext, cleanup }
}

function useMultibandVolume(
  mediaStream?: MediaStream | null,
  options: MultiBandVolumeOptions = {}
) {
  const opts = useMemo(() => ({ ...multibandDefaults, ...options }), [options])

  const [frequencyBands, setFrequencyBands] = useState<number[]>(() =>
    new Array(opts.bands).fill(0)
  )
  const bandsRef = useRef<number[]>(new Array(opts.bands).fill(0))
  const frameId = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!mediaStream) {
      const emptyBands = new Array(opts.bands).fill(0)
      setTimeout(() => {
        setFrequencyBands(emptyBands)
      }, 0)
      bandsRef.current = emptyBands
      return
    }

    const { analyser, cleanup } = createAudioAnalyser(
      mediaStream,
      opts.analyserOptions
    )

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Float32Array(bufferLength)
    const sliceStart = opts.loPass!
    const sliceEnd = opts.hiPass!
    const sliceLength = sliceEnd - sliceStart
    const chunkSize = Math.ceil(sliceLength / opts.bands!)

    let lastUpdate = 0
    const updateInterval = opts.updateInterval!

    const updateVolume = (timestamp: number) => {
      if (timestamp - lastUpdate >= updateInterval) {
        analyser.getFloatFrequencyData(dataArray)

        const chunks = new Array(opts.bands!)

        for (let i = 0; i < opts.bands!; i++) {
          let sum = 0
          let count = 0
          const startIdx = sliceStart + i * chunkSize
          const endIdx = Math.min(sliceStart + (i + 1) * chunkSize, sliceEnd)

          for (let j = startIdx; j < endIdx; j++) {
            sum += normalizeDb(dataArray[j])
            count++
          }

          chunks[i] = count > 0 ? sum / count : 0
        }

        let hasChanged = false
        for (let i = 0; i < chunks.length; i++) {
          if (Math.abs(chunks[i] - bandsRef.current[i]) > 0.01) {
            hasChanged = true
            break
          }
        }

        if (hasChanged) {
          bandsRef.current = chunks
          setFrequencyBands(chunks)
        }

        lastUpdate = timestamp
      }

      frameId.current = requestAnimationFrame(updateVolume)
    }

    frameId.current = requestAnimationFrame(updateVolume)

    return () => {
      cleanup()
      if (frameId.current) {
        cancelAnimationFrame(frameId.current)
      }
    }
  }, [mediaStream, opts])

  return frequencyBands
}

const generateConnectingSequenceBar = (columns: number): number[][] => {
  const seq = []
  for (let x = 0; x < columns; x++) {
    seq.push([x, columns - 1 - x])
  }
  return seq
}

const generateListeningSequenceBar = (columns: number): number[][] => {
  const center = Math.floor(columns / 2)
  const noIndex = -1
  return [[center], [noIndex]]
}

const useBarAnimator = (
  state: AnimationState,
  columns: number,
  interval: number
): number[] => {
  const indexRef = useRef(0)
  const [currentFrame, setCurrentFrame] = useState<number[]>([])
  const animationFrameId = useRef<number | null>(null)

  const sequence = useMemo(() => {
    if (state === "thinking" || state === "listening") {
      return generateListeningSequenceBar(columns)
    } else if (state === "connecting" || state === "initializing") {
      return generateConnectingSequenceBar(columns)
    } else if (state === undefined || state === "speaking") {
      return [new Array(columns).fill(0).map((_, idx) => idx)]
    } else {
      return [[]]
    }
  }, [state, columns])

  useEffect(() => {
    indexRef.current = 0
    setTimeout(() => {
      setCurrentFrame(sequence[0] || [])
    }, 0)
  }, [sequence])

  useEffect(() => {
    let startTime = performance.now()

    const animate = (time: DOMHighResTimeStamp) => {
      const timeElapsed = time - startTime

      if (timeElapsed >= interval) {
        indexRef.current = (indexRef.current + 1) % sequence.length
        setCurrentFrame(sequence[indexRef.current] || [])
        startTime = time
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [interval, sequence])

  return currentFrame
}

// Memoized Bar component to prevent unnecessary re-renders.
const Bar = React.memo<{
  heightPct: number
  isHighlighted: boolean
  state?: AgentState
}>(({ heightPct, isHighlighted, state }) => (
  <div
    data-highlighted={isHighlighted}
    className={cn(
      "max-w-[12px] min-w-[8px] flex-1 transition-all duration-150",
      "rounded-full",
      "bg-border data-[highlighted=true]:bg-chart-3",
      state === "speaking" && "bg-chart-3",
      state === "thinking" && isHighlighted && "animate-pulse"
    )}
    style={{
      height: `${heightPct}%`,
      animationDuration: state === "thinking" ? "300ms" : undefined,
    }}
  />
))

Bar.displayName = "Bar"

const BarVisualizerComponent = React.forwardRef<
  HTMLDivElement,
  {
    state?: AgentState
    barCount?: number
    mediaStream?: MediaStream | null
    minHeight?: number
    maxHeight?: number
    demo?: boolean
    centerAlign?: boolean
  } & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      state,
      barCount = 15,
      mediaStream,
      minHeight = 20,
      maxHeight = 100,
      demo = false,
      centerAlign = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const realVolumeBands = useMultibandVolume(mediaStream, {
      bands: barCount,
      loPass: 100,
      hiPass: 200,
    })

    const fakeVolumeBandsRef = useRef<number[]>(new Array(barCount).fill(0.2))
    const [fakeVolumeBands, setFakeVolumeBands] = useState<number[]>(() =>
      new Array(barCount).fill(0.2)
    )
    const fakeAnimationRef = useRef<number | undefined>(undefined)

    useEffect(() => {
      if (!demo) return

      if (state !== "speaking" && state !== "listening") {
        const bands = new Array(barCount).fill(0.2)
        fakeVolumeBandsRef.current = bands
        setTimeout(() => {
          setFakeVolumeBands(bands)
        }, 0)
        return
      }

      let lastUpdate = 0
      const updateInterval = 50
      const startTime = Date.now() / 1000

      const updateFakeVolume = (timestamp: number) => {
        if (timestamp - lastUpdate >= updateInterval) {
          const time = Date.now() / 1000 - startTime
          const newBands = new Array(barCount)

          for (let i = 0; i < barCount; i++) {
            const waveOffset = i * 0.5
            const baseVolume = Math.sin(time * 2 + waveOffset) * 0.3 + 0.5
            const randomNoise = Math.random() * 0.2
            newBands[i] = Math.max(0.1, Math.min(1, baseVolume + randomNoise))
          }

          let hasChanged = false
          for (let i = 0; i < barCount; i++) {
            if (Math.abs(newBands[i] - fakeVolumeBandsRef.current[i]) > 0.05) {
              hasChanged = true
              break
            }
          }

          if (hasChanged) {
            fakeVolumeBandsRef.current = newBands
            setFakeVolumeBands(newBands)
          }

          lastUpdate = timestamp
        }

        fakeAnimationRef.current = requestAnimationFrame(updateFakeVolume)
      }

      fakeAnimationRef.current = requestAnimationFrame(updateFakeVolume)

      return () => {
        if (fakeAnimationRef.current) {
          cancelAnimationFrame(fakeAnimationRef.current)
        }
      }
    }, [demo, state, barCount])

    const volumeBands = useMemo(
      () => (demo ? fakeVolumeBands : realVolumeBands),
      [demo, fakeVolumeBands, realVolumeBands]
    )

    const highlightedIndices = useBarAnimator(
      state,
      barCount,
      state === "connecting"
        ? 2000 / barCount
        : state === "thinking"
          ? 150
          : state === "listening"
            ? 500
            : 1000
    )

    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(
          "relative flex justify-center gap-1.5",
          centerAlign ? "items-center" : "items-end",
          "h-32 w-full overflow-hidden rounded-lg bg-muted p-4",
          className
        )}
        style={{
          ...style,
        }}
        {...props}
      >
        {volumeBands.map((volume, index) => {
          const heightPct = Math.min(
            maxHeight,
            Math.max(minHeight, volume * 100 + 5)
          )
          const isHighlighted = highlightedIndices?.includes(index) ?? false

          return (
            <Bar
              key={index}
              heightPct={heightPct}
              isHighlighted={isHighlighted}
              state={state}
            />
          )
        })}
      </div>
    )
  }
)

BarVisualizerComponent.displayName = "BarVisualizerComponent"

const BarVisualizer = React.memo(
  BarVisualizerComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.state === nextProps.state &&
      prevProps.barCount === nextProps.barCount &&
      prevProps.mediaStream === nextProps.mediaStream &&
      prevProps.minHeight === nextProps.minHeight &&
      prevProps.maxHeight === nextProps.maxHeight &&
      prevProps.demo === nextProps.demo &&
      prevProps.centerAlign === nextProps.centerAlign &&
      prevProps.className === nextProps.className &&
      JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style)
    )
  }
)

BarVisualizer.displayName = "BarVisualizer"

export function BarVisualizerCard() {
  const [state, setState] = useState<AgentState>("speaking")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Frequency Visualizer</CardTitle>
        <CardDescription>
          Real-time frequency band visualization with animated state transitions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BarVisualizer
          state={state}
          demo={true}
          barCount={20}
          minHeight={15}
          maxHeight={90}
          className="h-40 max-w-full"
        />
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          size="sm"
          variant={state === "connecting" ? "default" : "outline"}
          onClick={() => setState("connecting")}
        >
          Connecting
        </Button>
        <Button
          size="sm"
          variant={state === "listening" ? "default" : "outline"}
          onClick={() => setState("listening")}
        >
          Listening
        </Button>
        <Button
          size="sm"
          variant={state === "speaking" ? "default" : "outline"}
          onClick={() => setState("speaking")}
        >
          Speaking
        </Button>
      </CardFooter>
    </Card>
  )
}
