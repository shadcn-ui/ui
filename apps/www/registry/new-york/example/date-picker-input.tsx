"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format, isValid, parse } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"
import { Calendar } from "@/registry/new-york/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"
import { SelectSingleEventHandler } from "react-day-picker"


export default function DatePickerInput() {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [date, setDate] = React.useState<Date>()

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.currentTarget.value);
    const date = parse(e.currentTarget.value, 'y-MM-dd', new Date());
    if (isValid(date)) {
      setDate(date);
    } else {
      setDate(undefined);
    }
  };

  const handleSelectDate: SelectSingleEventHandler = React.useCallback((selected) => {
    setDate(selected);
    if (selected) {
      setOpen(false);
      setInputValue(format(selected, 'y-MM-dd'));
    } else {
      setInputValue('');
    }
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <fieldset className="relative">
        <Input placeholder="YYYY-MM-DD" value={inputValue} onChange={handleInputChange} />
        <PopoverTrigger asChild>
          <Button
            aria-label="Pick a date"
            variant={"secondary"}
            className={cn(
              "absolute right-1 top-1/2 h-7 -translate-y-1/2 rounded-sm border px-1.5 font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
      </fieldset>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={handleSelectDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
