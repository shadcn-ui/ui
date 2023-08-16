import React from "react"

type StarType = {
  duration: string
  delay: string
  top: string
  left: string
  translateX: string
  translateY: string
}

function buildStars(numberOfStars: number) {
  const stars: StarType[] = []
  for (let i = 0; i < numberOfStars; i++) {
    stars.push({
      duration: `${Math.random() * 10}s`,
      delay: `${Math.random() * 5}s`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      translateX: `${Math.random() * 300}px`,
      translateY: `${Math.random() * 300}px`,
    })
  }
  return stars
}

export default function BlackHole({
  children,
  numberOfStars = 100,
}: {
  children?: React.ReactNode
  numberOfStars?: number
}) {
  const bgColor = "bg-indigo-800"
  const stars = React.useMemo(() => buildStars(numberOfStars), [numberOfStars])

  return (
    <div className="relative h-full w-full">
      <div className="flex h-[600px] w-full animate-rotate-clockwise items-center justify-center">
        {children ? (
          <div
            className={
              "relative z-20 flex h-auto w-[100px] items-center justify-center"
            }
          >
            {children}
          </div>
        ) : null}

        <div
          className={`pointer-events-none absolute h-[500px] w-[500px] ${bgColor}  pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
          style={{
            // @ts-ignore
            "-webkit-mask-image": `radial-gradient(
                50% 50% at 50% 50%,
                rgba(217, 217, 217, 0) 27.08%,
                #d9d9d9 47.92%,
                rgba(217, 217, 217, 0.8) 75%,
                rgba(217, 217, 217, 0) 100%
              )`,
            "mask-image": `radial-gradient(
                50% 50% at 50% 50%,
                rgba(217, 217, 217, 0) 27.08%,
                #d9d9d9 47.92%,
                rgba(217, 217, 217, 0.8) 75%,
                rgba(217, 217, 217, 0) 100%
              )`,
            "webkit-mask-position": "0 0",
            "mask-position": "0 0",
            "webkit-mask-size": "cover",
            "mask-size": "cover",
          }}
        >
          {stars.map((star, index) => {
            return <Star key={index} star={star} index={index} />
          })}
        </div>
      </div>
    </div>
  )
}

function Star({ star, index }: { star: StarType; index: number }) {
  return (
    <div
      key={index}
      className="absolute h-[2px] w-[2px] animate-twinkling rounded-full bg-white"
      style={{
        animationDuration: star.duration,
        animationDelay: star.delay,
        top: star.top,
        left: star.left,
        transform: `translate(${star.translateX}, ${star.translateY})`,
      }}
    ></div>
  )
}
