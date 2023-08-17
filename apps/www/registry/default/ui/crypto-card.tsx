import React from "react"
import {
  MotionValue,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion"

type PatternProps = {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  randomString: string
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

const generateRandomString = (length: number) => {
  let result = ""

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

function Pattern({ mouseX, mouseY, randomString }: PatternProps) {
  let maskImage = useMotionTemplate`radial-gradient(1000px at ${mouseX}px ${mouseY}px, white, #e66465, transparent)`
  let style = { maskImage, WebkitMaskImage: maskImage }

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50"></div>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-600 to-indigo-600 opacity-0 backdrop-blur-xl transition duration-500 group-hover:opacity-100 dark:opacity-100"
        style={style}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay group-hover:opacity-100"
        style={style}
      >
        <p className="absolute inset-x-0 h-full whitespace-pre-wrap break-words font-mono text-xs font-bold text-white transition duration-500">
          {randomString}
        </p>
      </motion.div>
    </div>
  )
}

export default function CryptoCard({
  children,
}: {
  children?: React.ReactNode
}) {
  let mouseX = useMotionValue(0)
  let mouseY = useMotionValue(0)
  const [randomString, setRandomString] = React.useState("")
  const [isHovering, setIsHovering] = React.useState(false)

  const onMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const str = generateRandomString(1500)
      setRandomString(str)
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
    },
    [mouseX, mouseY]
  )

  return (
    <div
      className="group relative flex h-96 w-96 items-center justify-center overflow-hidden rounded-2xl bg-white dark:bg-slate-950"
      onMouseMove={onMouseMove}
      onMouseEnter={() => {
        setIsHovering(true)
      }}
      onMouseLeave={() => {
        setIsHovering(false)
      }}
    >
      {isHovering ? (
        <Pattern mouseX={mouseX} mouseY={mouseY} randomString={randomString} />
      ) : null}
      <div className="relative z-10 flex items-center justify-center">
        <div className="relative flex h-48 w-48 items-center justify-center  px-2">
          <div className="absolute h-full w-full rounded-full bg-white opacity-0 blur-xl group-hover:opacity-50 dark:bg-slate-950" />

          {children}
        </div>
      </div>
    </div>
  )
}
