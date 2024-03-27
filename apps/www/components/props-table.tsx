import React from "react"
import { DividerHorizontalIcon, InfoCircledIcon } from "@radix-ui/react-icons"

import { Button } from "@/registry/new-york/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"
import { ScrollArea } from "@/registry/new-york/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york/ui/table"

export type PropDef = {
  name: string
  required?: boolean
  default?: string | boolean
  type?: string
  typeSimple: string
  description?: string | React.ReactNode
}

export function PropsTable({
  data,
  propHeaderFixedWidth = true,
}: {
  data: PropDef[]
  propHeaderFixedWidth?: boolean
}) {
  return (
    <div className="w-full overflow-auto border rounded-lg my-5">
      <table className="w-full caption-bottom text-sm">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead style={{ width: propHeaderFixedWidth ? "37%" : "auto" }}>
              Prop
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(
            (
              {
                name,
                type,
                typeSimple,
                required,
                default: defaultValue,
                description,
              },
              i
            ) => {
              return (
                <TableRow key={`${name}-${i}`} style={{ whiteSpace: "nowrap" }}>
                  <TableCell>
                    <div className="inline-flex items-center gap-2">
                      <code className="text-blue-700 bg-blue-50 px-1">
                        {name}
                        {required ? "*" : null}
                      </code>
                      {description && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              className="p-1 h-max rounded-full"
                            >
                              <InfoCircledIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            side="top"
                            align="center"
                            style={{ maxWidth: 350 }}
                            className="radix-themes-custom-fonts"
                            onOpenAutoFocus={(event) => {
                              event.preventDefault()
                              ;(event.currentTarget as HTMLElement)?.focus()
                            }}
                          >
                            <p className="text-sm">{description}</p>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center gap-2">
                      <code className="px-1 bg-gray-100">
                        {Boolean(typeSimple) ? typeSimple : type}
                      </code>
                      {Boolean(typeSimple) && Boolean(type) && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              className="p-1 h-max rounded-full"
                            >
                              <InfoCircledIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            side="top"
                            align="center"
                            style={{ maxWidth: "min(1240px, 95vw)" }}
                          >
                            <ScrollArea type="auto">
                              <div>
                                <code
                                  style={{
                                    whiteSpace: "pre",
                                    display: "block",
                                  }}
                                >
                                  {type}
                                </code>
                              </div>
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {Boolean(defaultValue) ? (
                      <code className="px-1 bg-gray-100">{defaultValue}</code>
                    ) : (
                      <DividerHorizontalIcon
                        style={{ color: "var(--gray-8)" }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              )
            }
          )}
        </TableBody>
      </table>
    </div>
  )
}
