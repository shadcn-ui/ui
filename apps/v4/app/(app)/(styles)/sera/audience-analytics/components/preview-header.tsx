"use client"

import * as React from "react"
import { ChevronDownIcon, DownloadIcon } from "lucide-react"

import { Button } from "@/styles/base-sera/ui/button"
import { ButtonGroup } from "@/styles/base-sera/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/styles/base-sera/ui/dropdown-menu"

const EXPORT_DATE_OPTIONS = [
  {
    label: "Last 7 days",
    value: "last-7-days",
  },
  {
    label: "Last 30 days",
    value: "last-30-days",
  },
  {
    label: "This month",
    value: "this-month",
  },
  {
    label: "Last month",
    value: "last-month",
  },
]

export function PreviewHeader() {
  const [selectedDateRange, setSelectedDateRange] =
    React.useState("last-30-days")

  const selectedDateRangeLabel = React.useMemo(() => {
    const selectedOption = EXPORT_DATE_OPTIONS.find(
      (option) => option.value === selectedDateRange
    )

    if (!selectedOption) {
      return "Last 30 days"
    }

    return selectedOption.label
  }, [selectedDateRange])

  return (
    <header>
      <div className="container flex flex-col items-center justify-center gap-(--gap) py-(--gap) sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h1 className="line-clamp-1 font-heading text-3xl tracking-wide uppercase md:text-3xl lg:text-4xl">
            Audience Analytics
          </h1>
          <div className="line-clamp-1 text-sm font-medium tracking-wider text-muted-foreground uppercase">
            Editorial Performance Dashboard
          </div>
        </div>
        <ButtonGroup className="gap-2 sm:ml-auto md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="bg-background hover:bg-background/80 data-popup-open:bg-background"
                />
              }
            >
              {selectedDateRangeLabel}{" "}
              <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup
                  value={selectedDateRange}
                  onValueChange={setSelectedDateRange}
                >
                  {EXPORT_DATE_OPTIONS.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>
            <DownloadIcon data-icon="inline-start" />
            <span className="lg:hidden">Export</span>
            <span className="hidden lg:inline">Export Report</span>
          </Button>
        </ButtonGroup>
      </div>
    </header>
  )
}
