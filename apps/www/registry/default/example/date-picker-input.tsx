"use client"

import * as React from "react"
import { SelectSingleEventHandler } from "react-day-picker"
import { format, isValid, parse } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import { Calendar } from "@/registry/default/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"
import { Input } from "@/registry/default/ui/input"
import { cn } from "@/lib/utils"

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
              "absolute right-1.5 top-1/2 h-7 -translate-y-1/2 rounded-sm border px-2 font-normal",
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
