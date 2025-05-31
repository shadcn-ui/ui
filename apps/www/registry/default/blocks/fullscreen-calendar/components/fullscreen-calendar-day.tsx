"use client"

import React from "react"
import {
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

interface FullscreenCalendarDayProps {
  day: Date
  selectedDay: Date
  setSelectedDay: React.Dispatch<React.SetStateAction<Date>>
  firstDayCurrentMonth: Date
  dayIndex: number
  data: {
    day: Date
    events: {
      id: number
      name: string
      time: string
      datetime: string
    }[]
  }[]
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
]

export function FullScreenCalendarDay({
  day,
  selectedDay,
  setSelectedDay,
  firstDayCurrentMonth,
  dayIndex,
  data,
}: FullscreenCalendarDayProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (!isDesktop) {
    return (
      <button
        onClick={() => setSelectedDay(day)}
        key={dayIndex}
        type="button"
        className={cn(
          isEqual(day, selectedDay) && "text-primary-foreground",
          !isEqual(day, selectedDay) &&
            !isToday(day) &&
            isSameMonth(day, firstDayCurrentMonth) &&
            "text-foreground",
          !isEqual(day, selectedDay) &&
            !isToday(day) &&
            !isSameMonth(day, firstDayCurrentMonth) &&
            "text-muted-foreground",
          (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
          "flex h-14 flex-col border-b border-r px-3 py-2 hover:bg-muted focus:z-10"
        )}
      >
        <time
          dateTime={format(day, "yyyy-MM-dd")}
          className={cn(
            "ml-auto flex size-6 items-center justify-center rounded-full",
            isEqual(day, selectedDay) &&
              isToday(day) &&
              "bg-primary text-primary-foreground",
            isEqual(day, selectedDay) &&
              !isToday(day) &&
              "bg-primary text-primary-foreground"
          )}
        >
          {format(day, "d")}
        </time>
        {data.filter((date) => isSameDay(date.day, day)).length > 0 && (
          <div>
            {data
              .filter((date) => isSameDay(date.day, day))
              .map((date) => (
                <div
                  key={date.day.toString()}
                  className="-mx-0.5 mt-auto flex flex-wrap-reverse"
                >
                  {date.events.map((event) => (
                    <span
                      key={event.id}
                      className="mx-0.5 mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground"
                    />
                  ))}
                </div>
              ))}
          </div>
        )}
      </button>
    )
  }

  return (
    <div
      key={dayIndex}
      onClick={() => setSelectedDay(day)}
      className={cn(
        dayIndex === 0 && colStartClasses[getDay(day)],
        !isEqual(day, selectedDay) &&
          !isToday(day) &&
          !isSameMonth(day, firstDayCurrentMonth) &&
          "bg-accent/50 text-muted-foreground",
        "relative flex flex-col border-b border-r hover:bg-muted focus:z-10",
        !isEqual(day, selectedDay) && "hover:bg-accent/75"
      )}
    >
      <header className="flex items-center justify-between p-2.5">
        <button
          type="button"
          className={cn(
            isEqual(day, selectedDay) && "text-primary-foreground",
            !isEqual(day, selectedDay) &&
              !isToday(day) &&
              isSameMonth(day, firstDayCurrentMonth) &&
              "text-foreground",
            !isEqual(day, selectedDay) &&
              !isToday(day) &&
              !isSameMonth(day, firstDayCurrentMonth) &&
              "text-muted-foreground",
            isEqual(day, selectedDay) &&
              isToday(day) &&
              "border-none bg-primary",
            isEqual(day, selectedDay) && !isToday(day) && "bg-foreground",
            (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
            "flex h-7 w-7 items-center justify-center rounded-full text-xs hover:border"
          )}
        >
          <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
        </button>
      </header>
      <div className="flex-1 p-2.5">
        {data
          .filter((event) => isSameDay(event.day, day))
          .map((day) => (
            <div key={day.day.toString()} className="space-y-1.5">
              {day.events.slice(0, 1).map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col items-start gap-1 rounded-lg border bg-muted/50 p-2 text-xs leading-tight"
                >
                  <p className="font-medium leading-none">{event.name}</p>
                  <p className="leading-none text-muted-foreground">
                    {event.time}
                  </p>
                </div>
              ))}
              {day.events.length > 1 && (
                <div className="text-xs text-muted-foreground">
                  + {day.events.length - 1} more
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
