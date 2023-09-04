"use client"

import { addDays } from "date-fns"

import { Card, CardContent } from "@/registry/tui/ui/card"
import { Badge } from "../../ui/badge"

const start = new Date(2023, 5, 5)

export function CardsBadge() {
  return (
    <Card className="">
      <CardContent className="space-y-1 p-2">
        <div className="truncate text-sm font-medium leading-7 text-slate-900">With border</div>
        <div className="flex space-x-2">
          <Badge className="bg-gray-50 text-gray-600 ring-gray-500/10">Badge</Badge>
          <Badge className="bg-red-50 text-red-600 ring-red-500/10">Badge</Badge>
          <Badge className="bg-yellow-50 text-yellow-600 ring-yellow-500/10">Badge</Badge>
          <Badge className="bg-green-50 text-green-600 ring-green-500/10">Badge</Badge>
          <Badge className="bg-blue-50 text-blue-600 ring-blue-500/10">Badge</Badge>
          <Badge className="bg-indigo-50 text-indigo-600 ring-indigo-500/10">Badge</Badge>
          <Badge className="bg-purple-50 text-purple-600 ring-purple-500/10">Badge</Badge>
          <Badge className="bg-pink-50 text-pink-600 ring-pink-500/10">Badge</Badge>
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
          <Badge className="bg-gray-50 text-gray-600 ring-gray-500/10" variant={"borderPill"}>Badge</Badge>
          <Badge className="bg-red-50 text-red-600 ring-red-500/10" variant={"borderPill"}>Badge</Badge>
          <Badge className="bg-yellow-50 text-yellow-600 ring-yellow-500/10" variant={"borderPill"}>Badge</Badge>
          <Badge className="bg-green-50 text-green-600 ring-green-500/10" variant={"borderPill"}>Badge</Badge>
          <Badge className="bg-blue-50 text-blue-600 ring-blue-500/10" variant={"borderPill"}>Badge</Badge>
          <Badge className="bg-indigo-50 text-indigo-600 ring-indigo-500/10" variant={"borderPill"}>Badge</Badge>
          <Badge className="bg-purple-50 text-purple-600 ring-purple-500/10" variant={"borderPill"}>Badge</Badge>
          <Badge className="bg-pink-50 text-pink-600 ring-pink-500/10" variant={"borderPill"}>Badge</Badge>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Pill with border and dot</div>
        <div className="flex space-x-2">
          <Badge className="rounded-full bg-gray-50 text-gray-600 ring-gray-500/10" variant={"dot"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-gray-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge className="rounded-full bg-red-50 text-red-600 ring-red-500/10" variant={"dot"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-red-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge className="rounded-full bg-yellow-50 text-yellow-600 ring-yellow-500/10" variant={"dot"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge className="rounded-full bg-green-50 text-green-600 ring-green-500/10" variant={"dot"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge className="rounded-full bg-blue-50 text-blue-600 ring-blue-500/10" variant={"dot"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-blue-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge className="rounded-full bg-indigo-50 text-indigo-600 ring-indigo-500/10" variant={"dot"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-indigo-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge className="rounded-full bg-purple-50 text-purple-600 ring-purple-500/10" variant={"dot"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-purple-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
          <Badge className="rounded-full bg-pink-50 text-pink-600 ring-pink-500/10" variant={"dot"} prefixIcon={() => <svg className="h-1.5 w-1.5 fill-pink-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>}>Badge</Badge>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Flat</div>
        <div className="flex space-x-2">
          <Badge className="bg-gray-50 text-gray-600 ring-gray-500/10" variant={"flat"}>Badge</Badge>
          <Badge className="bg-red-50 text-red-600 ring-red-500/10" variant={"flat"}>Badge</Badge>
          <Badge className="bg-yellow-50 text-yellow-600 ring-yellow-500/10" variant={"flat"}>Badge</Badge>
          <Badge className="bg-green-50 text-green-600 ring-green-500/10" variant={"flat"}>Badge</Badge>
          <Badge className="bg-blue-50 text-blue-600 ring-blue-500/10" variant={"flat"}>Badge</Badge>
          <Badge className="bg-indigo-50 text-indigo-600 ring-indigo-500/10" variant={"flat"}>Badge</Badge>
          <Badge className="bg-purple-50 text-purple-600 ring-purple-500/10" variant={"flat"}>Badge</Badge>
          <Badge className="bg-pink-50 text-pink-600 ring-pink-500/10" variant={"flat"}>Badge</Badge>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Flat pill</div>
        <div className="flex space-x-2">
          <Badge className="bg-gray-50 text-gray-600 ring-gray-500/10" variant={"flatPill"}>Badge</Badge>
          <Badge className="bg-red-50 text-red-600 ring-red-500/10" variant={"flatPill"}>Badge</Badge>
          <Badge className="bg-yellow-50 text-yellow-600 ring-yellow-500/10" variant={"flatPill"}>Badge</Badge>
          <Badge className="bg-green-50 text-green-600 ring-green-500/10" variant={"flatPill"}>Badge</Badge>
          <Badge className="bg-blue-50 text-blue-600 ring-blue-500/10" variant={"flatPill"}>Badge</Badge>
          <Badge className="bg-indigo-50 text-indigo-600 ring-indigo-500/10" variant={"flatPill"}>Badge</Badge>
          <Badge className="bg-purple-50 text-purple-600 ring-purple-500/10" variant={"flatPill"}>Badge</Badge>
          <Badge className="bg-pink-50 text-pink-600 ring-pink-500/10" variant={"flatPill"}>Badge</Badge>
        </div>
        <div className="truncate text-sm font-medium leading-7 text-slate-900">Default Small</div>
        <div className="flex space-x-2">
          <Badge className="bg-gray-50 text-gray-600 ring-gray-500/10" size={"sm"}>Badge</Badge>
          <Badge className="bg-red-50 text-red-600 ring-red-500/10" size={"sm"}>Badge</Badge>
          <Badge className="bg-yellow-50 text-yellow-600 ring-yellow-500/10" size={"sm"}>Badge</Badge>
          <Badge className="bg-green-50 text-green-600 ring-green-500/10" size={"sm"}>Badge</Badge>
          <Badge className="bg-blue-50 text-blue-600 ring-blue-500/10" size={"sm"}>Badge</Badge>
          <Badge className="bg-indigo-50 text-indigo-600 ring-indigo-500/10" size={"sm"}>Badge</Badge>
          <Badge className="bg-purple-50 text-purple-600 ring-purple-500/10" size={"sm"}>Badge</Badge>
          <Badge className="bg-pink-50 text-pink-600 ring-pink-500/10" size={"sm"}>Badge</Badge>
        </div>

        <div className="truncate text-sm font-medium leading-7 text-slate-900">Default</div>
        <div className="flex space-x-2">
          <Badge className="bg-gray-50 text-gray-600 ring-gray-500/10" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20">
            <span className="sr-only">Remove</span>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-gray-700/50 group-hover:stroke-gray-700/75">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>}>Badge</Badge>
          <Badge className="bg-red-50 text-red-600 ring-red-500/10" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-red-500/20">
            <span className="sr-only">Remove</span>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-red-700/50 group-hover:stroke-red-700/75">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>}>Badge</Badge>
          <Badge className="bg-yellow-50 text-yellow-600 ring-yellow-500/10" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-yellow-500/20">
            <span className="sr-only">Remove</span>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-yellow-700/50 group-hover:stroke-yellow-700/75">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>}>Badge</Badge>
          <Badge className="bg-green-50 text-green-600 ring-green-500/10" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-green-500/20">
            <span className="sr-only">Remove</span>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-green-700/50 group-hover:stroke-green-700/75">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>}>Badge</Badge>
          <Badge className="bg-blue-50 text-blue-600 ring-blue-500/10" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-blue-500/20">
            <span className="sr-only">Remove</span>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-blue-700/50 group-hover:stroke-blue-700/75">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>}>Badge</Badge>
          <Badge className="bg-indigo-50 text-indigo-600 ring-indigo-500/10" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-indigo-500/20">
            <span className="sr-only">Remove</span>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-indigo-700/50 group-hover:stroke-indigo-700/75">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>}>Badge</Badge>
          <Badge className="bg-purple-50 text-purple-600 ring-purple-500/10" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-purple-500/20">
            <span className="sr-only">Remove</span>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-purple-700/50 group-hover:stroke-purple-700/75">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>}>Badge</Badge>
          <Badge className="bg-pink-50 text-pink-600 ring-pink-500/10" suffixIcon={() => <button type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-pink-500/20">
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
