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
          <Badge variant={"dot"} size={"sm"} icon="dot-circle-solid">Badge</Badge>
          <Badge variant={"dot"} size={"sm"} icon="dot-circle-solid" alignIcon="right">Badge</Badge>
          <Badge variant={"dot"} size={"sm"} icon="dot-circle-solid" iconStyle="text-red-600">Badge</Badge>
          <Badge variant={"dot"} size={"sm"} icon="dot-circle-solid">Badge</Badge>
          <Badge variant={"dot"} size={"sm"} icon="dot-circle-solid">Badge</Badge>

          <Badge variant={"dot"} size={"sm"} icon="dot-circle-solid">Badge</Badge>
          <Badge variant={"dot"} size={"sm"} icon="dot-circle-solid" iconStyle="text-blue-600">Badge</Badge>
          <Badge variant={"dot"} size={"sm"} icon="dot-circle-solid">Badge</Badge>
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
          <Badge color="gray" variant={"dot"} icon="dot-circle-regular">Badge</Badge>
          <Badge color="red" variant={"dot"} icon="dot-circle-regular">Badge</Badge>
          <Badge color="yellow" variant={"dot"} icon="dot-circle-regular">Badge</Badge>
          <Badge color="green" variant={"dot"} icon="dot-circle-regular">Badge</Badge>
          <Badge color="blue" variant={"dot"} icon="dot-circle-regular">Badge</Badge>
          <Badge color="indigo" variant={"dot"} icon="dot-circle-regular">Badge</Badge>
          <Badge color="purple" variant={"dot"} icon="dot-circle-regular">Badge</Badge>
          <Badge color="pink" variant={"dot"} icon="dot-circle-regular">Badge</Badge>
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
          <Badge color="gray" icon="xmark-solid" alignIcon="right" iconStyle="hover:bg-gray-500/20 h-3.5 w-3.5">Badge</Badge>
          <Badge color="red" icon="xmark-solid" alignIcon="right" iconStyle="hover:bg-red-500/20 h-3.5 w-3.5">Badge</Badge>
          <Badge color="yellow" icon="xmark-solid" alignIcon="right" iconStyle="hover:bg-yellow-500/20 h-3.5 w-3.5">Badge</Badge>
          <Badge color="green" icon="xmark-solid" alignIcon="right" iconStyle="hover:bg-green-500/20 h-3.5 w-3.5">Badge</Badge>
          <Badge color="blue" icon="xmark-solid" alignIcon="right" iconStyle="hover:bg-blue-500/20 h-3.5 w-3.5">Badge</Badge>
          <Badge color="indigo" icon="xmark-solid" alignIcon="right" iconStyle="hover:bg-indigo-500/20 h-3.5 w-3.5">Badge</Badge>
          <Badge color="purple" icon="xmark-solid" alignIcon="right" iconStyle="hover:bg-purple-500/20 h-3.5 w-3.5">Badge</Badge>
          <Badge color="pink" icon="xmark-solid" alignIcon="right" iconStyle="hover:bg-pink-500/20 h-3.5 w-3.5">Badge</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
