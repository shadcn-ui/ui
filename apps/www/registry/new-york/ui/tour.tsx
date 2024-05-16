import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

type Context<T extends string> = {
  nodes: Map<
    string,
    {
      ref: HTMLElement
      render: (currentIdx: number) => React.ReactNode
      name: T
    }
  >
  show: boolean
  current: number
  next: () => void
  previous: () => void
  close: () => void
  open: () => void
}

export type TourProps = {
  children?: React.ReactNode
}

type TourFocusProps<T extends string> = {
  children: React.ReactNode
  tourRender: (currentIdx: number) => React.ReactNode
  name: T
}

export const TourFactory = <T extends string>(order: T[]) => {
  const tourContext = createContext<Context<T>>({
    nodes: new Map(),
    show: false,
    current: 0,
    next: () => {
      console.log("empty")
    },
    previous: () => {
      console.log("empty")
    },
    close: () => {
      console.log("empty")
    },
    open: () => {
      console.log("empty")
    },
  })

  function TourPortal() {
    const ctx = useContext(tourContext)

    const ref = useRef<HTMLDivElement>(null)
    const [, updateState] = React.useState({})

    const currentElement = useMemo(
      () => ctx.nodes.get(order[ctx.current] ?? ""),
      [ctx]
    )

    useEffect(() => {
      const handleResize = () => {
        updateState({})
      }

      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }, [])

    if (!currentElement) {
      return <></>
    }

    const currentElementRect = currentElement.ref.getBoundingClientRect()
    return createPortal(
      <div
        id="tour"
        className={cn(
          "pointer-events-auto fixed left-0 top-0 h-screen w-screen",
          !ctx.show ? "invisible" : "visible"
        )}
      >
        <div
          ref={ref}
          className="absolute -top-8 z-50 transition-all duration-500 ease-in-out"
          style={{
            left: currentElementRect.x,
            top:
              currentElementRect.y -
              (ref.current?.getBoundingClientRect()?.height ?? 0),
          }}
        >
          {currentElement.render(ctx.current)}
        </div>
        <div
          className={`absolute z-40 h-screen w-screen overflow-hidden opacity-80 shadow-[0_0_0_100vw_rgba(0,0,0,.99)] transition-all duration-500 ease-in-out`}
          style={{
            height: currentElementRect.height,
            width: currentElementRect.width,
            left: currentElementRect.x,
            top: currentElementRect.y,
          }}
        />
      </div>,
      document.body
    )
  }

  return {
    TourProvider: function TourProvider(props: TourProps) {
      const nodes = useRef<Context<T>["nodes"]>(new Map())

      const [show, setShow] = useState(false)
      const [current, setCurrent] = useState(0)

      return (
        <tourContext.Provider
          value={{
            nodes: nodes.current,
            current,
            show,
            next: () => {
              setCurrent((state) => Math.min(state + 1, nodes.current.size - 1))
            },
            previous: () => {
              setCurrent((state) => Math.max(state - 1, 0))
            },
            close: () => {
              setShow(false)
            },
            open: () => {
              setShow(true)
            },
          }}
        >
          {props.children}
          <TourPortal />
        </tourContext.Provider>
      )
    },
    context: tourContext,
    useContext: () => useContext(tourContext),
    TourFocus: function TourFocus(props: TourFocusProps<T>) {
      const ctx = useContext(tourContext)
      return (
        <div
          ref={(divRef) => {
            if (divRef && !ctx.nodes.has(props.name)) {
              ctx.nodes.set(props.name, {
                ref: divRef,
                render: props.tourRender,
                name: props.name,
              })
            }
          }}
        >
          {props.children}
        </div>
      )
    },
  }
}
