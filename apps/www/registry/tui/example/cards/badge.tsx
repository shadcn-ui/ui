"use client"
import { Card, CardContent } from "@/registry/tui/ui/card"
import { Badge } from "../../ui/badge"


export function CardsBadge() {
  return (
    <Card className="">
      <CardContent className="space-y-1 p-2">
        <div className="truncate text-sm font-medium leading-7 text-slate-900">With border</div>
        <div className="flex space-x-2">
          <Badge color="gray">Badge</Badge>
          <Badge color="red">Badge</Badge>
          <Badge color="yellow">Badge</Badge>
          <Badge color="green">Badge</Badge>
          <Badge color="blue">Badge</Badge>
          <Badge color="indigo">Badge</Badge>
          <Badge color="purple">Badge</Badge>
          <Badge color="pink">Badge</Badge>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Outline</div>
        <div className="flex space-x-2">
          <Badge variant={"outline"} >Badge</Badge>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">With border and dot</div>
        <div className="flex space-x-2">
          <Badge variant={"dot"} size={"sm"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-gray-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge variant={"dot"} size={"sm"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-red-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge variant={"dot"} size={"sm"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge variant={"dot"} size={"sm"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge variant={"dot"} size={"sm"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-blue-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>

          <Badge variant={"dot"} size={"sm"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-indigo-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge variant={"dot"} size={"sm"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-purple-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge variant={"dot"} size={"sm"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-pink-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Pill with border</div>
        <div className="flex space-x-2">
          <Badge color="gray" variant={"borderPill"}>Badge</Badge>
          <Badge color="red" variant={"borderPill"}>Badge</Badge>
          <Badge color="yellow" variant={"borderPill"}>Badge</Badge>
          <Badge color="green" variant={"borderPill"}>Badge</Badge>
          <Badge color="blue" variant={"borderPill"}>Badge</Badge>
          <Badge color="indigo" variant={"borderPill"}>Badge</Badge>
          <Badge color="purple" variant={"borderPill"}>Badge</Badge>
          <Badge color="pink" variant={"borderPill"}>Badge</Badge>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Pill with border and dot</div>
        <div className="flex space-x-2">
          <Badge color="gray" variant={"dot"} rounded="full" prefixIcon={() => <svg className="h-1.5 w-1.5 fill-gray-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge color="red" variant={"dot"} rounded="full" prefixIcon={() => <svg className="h-1.5 w-1.5 fill-red-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge color="yellow" variant={"dot"} rounded="full" prefixIcon={() => <svg className="h-1.5 w-1.5 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge color="green" variant={"dot"} rounded="full" prefixIcon={() => <svg className="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge color="blue" variant={"dot"} rounded="full" prefixIcon={() => <svg className="h-1.5 w-1.5 fill-blue-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge color="indigo" variant={"dot"} rounded="full" prefixIcon={() => <svg className="h-1.5 w-1.5 fill-indigo-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge color="purple" variant={"dot"} rounded="full" prefixIcon={() => <svg className="h-1.5 w-1.5 fill-purple-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge color="pink" variant={"dot"} rounded="full" prefixIcon={() => <svg className="h-1.5 w-1.5 fill-pink-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Flat</div>
        <div className="flex space-x-2">
          <Badge color="gray" variant={"flat"}>Badge</Badge>
          <Badge color="red" variant={"flat"}>Badge</Badge>
          <Badge color="yellow" variant={"flat"}>Badge</Badge>
          <Badge color="green" variant={"flat"}>Badge</Badge>
          <Badge color="blue" variant={"flat"}>Badge</Badge>
          <Badge color="indigo" variant={"flat"}>Badge</Badge>
          <Badge color="purple" variant={"flat"}>Badge</Badge>
          <Badge color="pink" variant={"flat"}>Badge</Badge>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Flat pill</div>
        <div className="flex space-x-2">
          <Badge color="gray" variant={"flatPill"}>Badge</Badge>
          <Badge color="red" variant={"flatPill"}>Badge</Badge>
          <Badge color="yellow" variant={"flatPill"}>Badge</Badge>
          <Badge color="green" variant={"flatPill"}>Badge</Badge>
          <Badge color="blue" variant={"flatPill"}>Badge</Badge>
          <Badge color="indigo" variant={"flatPill"}>Badge</Badge>
          <Badge color="purple" variant={"flatPill"}>Badge</Badge>
          <Badge color="pink" variant={"flatPill"}>Badge</Badge>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Default Small</div>
        <div className="flex space-x-2">
          <Badge color="gray" size={"sm"}>Badge</Badge>
          <Badge color="red" size={"sm"}>Badge</Badge>
          <Badge color="yellow" size={"sm"}>Badge</Badge>
          <Badge color="green" size={"sm"}>Badge</Badge>
          <Badge color="blue" size={"sm"}>Badge</Badge>
          <Badge color="indigo" size={"sm"}>Badge</Badge>
          <Badge color="purple" size={"sm"}>Badge</Badge>
          <Badge color="pink" size={"sm"}>Badge</Badge>
        </div>

        <div className="truncate text-sm font-medium leading-7 text-slate-900">Default</div>
        <div className="flex space-x-2">
          <Badge color="gray" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20">
            <span className="sr-only">Remove</span>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-gray-700/50 group-hover:stroke-gray-700/75">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>}>Badge</Badge>
          <Badge color="red" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-red-500/20">
            <span className="sr-only">Remove</span>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-red-700/50 group-hover:stroke-red-700/75">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>}>Badge</Badge>
          <Badge color="yellow" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-yellow-500/20">
            <span className="sr-only">Remove</span>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-yellow-700/50 group-hover:stroke-yellow-700/75">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>}>Badge</Badge>
          <Badge color="green" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-green-500/20">
            <span className="sr-only">Remove</span>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-green-700/50 group-hover:stroke-green-700/75">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>}>Badge</Badge>
          <Badge color="blue" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-blue-500/20">
            <span className="sr-only">Remove</span>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-blue-700/50 group-hover:stroke-blue-700/75">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>}>Badge</Badge>
          <Badge color="indigo" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-indigo-500/20">
            <span className="sr-only">Remove</span>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-indigo-700/50 group-hover:stroke-indigo-700/75">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>}>Badge</Badge>
          <Badge color="purple" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-purple-500/20">
            <span className="sr-only">Remove</span>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-purple-700/50 group-hover:stroke-purple-700/75">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>}>Badge</Badge>
          <Badge color="pink" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-pink-500/20">
            <span className="sr-only">Remove</span>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-pink-700/50 group-hover:stroke-pink-700/75">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>}>Badge</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
