import type { Variants } from "motion/react"

const ANIMATIONS = [
  {
    id: "fade",
    name: "Fade",
    variants: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { duration: 0.22, ease: "easeOut" },
      },
      exit: { opacity: 0, transition: { duration: 0.15 } },
    },
  },
  {
    id: "slide-up",
    name: "Slide Up",
    variants: {
      initial: { opacity: 0, y: 10 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] },
      },
      exit: { opacity: 0, y: 4, transition: { duration: 0.15 } },
    },
  },
  {
    id: "slide-side",
    name: "Slide Side",
    variants: {
      initial: { opacity: 0, x: 18 },
      animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
      },
      exit: {
        opacity: 0,
        x: 8,
        transition: { duration: 0.15 },
      },
    },
  },
  {
    id: "pop",
    name: "Pop",
    variants: {
      initial: {
        opacity: 0,
        scale: 0.94,
        y: 6,
        originX: 1,
        originY: 1,
      },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 500, damping: 34, mass: 0.7 },
      },
      exit: { opacity: 0, scale: 0.98, transition: { duration: 0.12 } },
    },
  },
  {
    id: "spring-bounce",
    name: "Spring Bounce",
    variants: {
      initial: { opacity: 0, y: 12, scale: 0.96 },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 520,
          damping: 30,
          mass: 0.7,
        },
      },
      exit: { opacity: 0, scale: 0.98, transition: { duration: 0.12 } },
    },
  },
  {
    id: "blur-fade",
    name: "Blur Fade",
    variants: {
      initial: { opacity: 0, filter: "blur(4px)", y: 6 },
      animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.28, ease: "easeOut" },
      },
      exit: {
        opacity: 0,
        filter: "blur(2px)",
        transition: { duration: 0.15 },
      },
    },
  },
  {
    id: "scale-fade",
    name: "Scale Fade",
    variants: {
      initial: { opacity: 0, scale: 0.98 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.24, ease: "easeOut" },
      },
      exit: { opacity: 0, scale: 0.99, transition: { duration: 0.12 } },
    },
  },
] as const satisfies {
  id: string
  name: string
  variants: Variants
}[]

type MessageAnimationPreset = (typeof ANIMATIONS)[number]
type MessageAnimationId = MessageAnimationPreset["id"]

const MESSAGE_ANIMATIONS = ANIMATIONS.reduce(
  (acc, preset) => {
    acc[preset.id] = preset
    return acc
  },
  {} as Record<MessageAnimationId, MessageAnimationPreset>
)

export {
  MESSAGE_ANIMATIONS,
  type MessageAnimationId,
  type MessageAnimationPreset,
}
