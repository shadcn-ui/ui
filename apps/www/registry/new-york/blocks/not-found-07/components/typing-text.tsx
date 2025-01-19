"use client"

// many thanks to animata.design
import { ReactNode, useEffect, useState } from "react"

const ALWAYS_VIBISBLE_COUNT = 1 as const

interface TypingTextProps {
  /**
   * Text to type
   */
  text: string

  /**
   * Delay between typing each character in milliseconds
   * @default 48
   */
  delay?: number
}

function Blinker() {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const interval = setInterval(() => {
      setShow((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])
  return <span className={show ? "" : "opacity-0"}>|</span>
}

function NormalEffect({ text, index }: { text: string; index: number }) {
  return (
    <>
      {text.slice(
        0,
        Math.max(index, Math.min(text.length, ALWAYS_VIBISBLE_COUNT))
      )}
    </>
  )
}

enum TypingDirection {
  Forward = 1,
  Backward = -1,
}

function CursorWrapper({
  visible,
  children,
  waiting,
}: {
  visible?: boolean
  waiting?: boolean
  children: ReactNode
}) {
  const [on, setOn] = useState(true)
  useEffect(() => {
    const interval = setInterval(() => {
      setOn((prev) => !prev)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  if (!visible || (!on && !waiting)) {
    return null
  }

  return children
}

function Type({ text, delay }: TypingTextProps) {
  const [index, setIndex] = useState(0)
  const [direction] = useState<TypingDirection>(TypingDirection.Forward)
  const [isComplete, setIsComplete] = useState(false)

  const total = text.length

  useEffect(() => {
    let interval: NodeJS.Timeout

    const startTyping = () => {
      setIndex((prevDir) => {
        if (
          direction === TypingDirection.Backward &&
          prevDir === TypingDirection.Forward
        ) {
          clearInterval(interval)
        } else if (
          direction === TypingDirection.Forward &&
          prevDir === total - 1
        ) {
          clearInterval(interval)
        }
        return prevDir + direction
      })
    }

    interval = setInterval(startTyping, delay)
    return () => clearInterval(interval)
  }, [total, direction, delay])

  useEffect(() => {
    if (index === total) {
      setIsComplete(true)
    }
  }, [index, total])

  const waitingNextCycle = index === total || index === 0

  return (
    <span className="relative whitespace-pre-wrap">
      <span>
        <NormalEffect text={text} index={index} />
        <CursorWrapper waiting={waitingNextCycle} visible={!isComplete}>
          <Blinker />
        </CursorWrapper>
      </span>
    </span>
  )
}

export function TypingText({ text, delay = 48 }: TypingTextProps) {
  return <Type key={text} delay={delay} text={text} />
}
