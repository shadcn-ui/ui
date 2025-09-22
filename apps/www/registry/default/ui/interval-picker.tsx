"use client"

import * as React from "react"
import { Button } from "@/registry/default/ui/button"
import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"
import { RadioGroup, RadioGroupItem } from "@/registry/default/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select"
import { Calendar } from "@/registry/default/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export interface IntervalPickerValue {
  frequency: number
  unit: "day" | "week" | "month" | "year"
  weekdays?: number[]
  endType: "never" | "on" | "after"
  endDate?: Date
  occurrences?: number
}

interface IntervalPickerProps {
  value?: IntervalPickerValue
  onChange?: (value: IntervalPickerValue) => void
  onCancel?: () => void
  onDone?: () => void
}

const WEEKDAYS = [
  { label: "M", value: 1 },
  { label: "T", value: 2 },
  { label: "W", value: 3 },
  { label: "T", value: 4 },
  { label: "F", value: 5 },
  { label: "S", value: 6 },
  { label: "S", value: 0 },
]

export function IntervalPicker({
  value = {
    frequency: 1,
    unit: "week",
    weekdays: [3], // Wednesday selected by default
    endType: "never",
  },
  onChange,
  onCancel,
  onDone,
}: IntervalPickerProps) {
  const [localValue, setLocalValue] = React.useState<IntervalPickerValue>(value)

  const handleChange = (updates: Partial<IntervalPickerValue>) => {
    const newValue = { ...localValue, ...updates }
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  const toggleWeekday = (day: number) => {
    const weekdays = localValue.weekdays || []
    const newWeekdays = weekdays.includes(day)
      ? weekdays.filter(d => d !== day)
      : [...weekdays, day].sort()
    handleChange({ weekdays: newWeekdays })
  }

  return (
    <div className="w-full max-w-md space-y-6 rounded-lg border bg-background p-6 shadow-lg">
      <h3 className="text-lg font-semibold">Custom recurrence</h3>
      
      {/* Frequency and Unit */}
      <div className="space-y-2">
        <Label>Repeat every</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            value={localValue.frequency}
            onChange={(e) => handleChange({ frequency: parseInt(e.target.value) || 1 })}
            className="w-20"
          />
          <Select
            value={localValue.unit}
            onValueChange={(unit: IntervalPickerValue["unit"]) => handleChange({ unit })}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">day{localValue.frequency > 1 ? "s" : ""}</SelectItem>
              <SelectItem value="week">week{localValue.frequency > 1 ? "s" : ""}</SelectItem>
              <SelectItem value="month">month{localValue.frequency > 1 ? "s" : ""}</SelectItem>
              <SelectItem value="year">year{localValue.frequency > 1 ? "s" : ""}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Weekdays (only show for weekly) */}
      {localValue.unit === "week" && (
        <div className="space-y-2">
          <Label>Repeat on</Label>
          <div className="flex gap-1">
            {WEEKDAYS.map((day) => (
              <Button
                key={day.value}
                variant={localValue.weekdays?.includes(day.value) ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 rounded-full p-0"
                onClick={() => toggleWeekday(day.value)}
              >
                {day.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* End Options */}
      <div className="space-y-3">
        <Label>Ends</Label>
        <RadioGroup
          value={localValue.endType}
          onValueChange={(endType: IntervalPickerValue["endType"]) => handleChange({ endType })}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="never" id="never" />
            <Label htmlFor="never">Never</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="on" id="on" />
            <Label htmlFor="on">On</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "ml-2 justify-start text-left font-normal",
                    !localValue.endDate && "text-muted-foreground"
                  )}
                  disabled={localValue.endType !== "on"}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localValue.endDate ? format(localValue.endDate, "MMM d, yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={localValue.endDate}
                  onSelect={(date) => handleChange({ endDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="after" id="after" />
            <Label htmlFor="after">After</Label>
            <Input
              type="number"
              min="1"
              value={localValue.occurrences || 1}
              onChange={(e) => handleChange({ occurrences: parseInt(e.target.value) || 1 })}
              className="ml-2 w-16"
              disabled={localValue.endType !== "after"}
            />
            <span className="text-sm text-muted-foreground">occurrences</span>
          </div>
        </RadioGroup>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  )
}