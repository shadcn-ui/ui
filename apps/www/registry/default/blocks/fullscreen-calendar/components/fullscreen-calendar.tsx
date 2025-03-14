"use client"

import React from "react"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns"

import { FullScreenCalendarDay } from "@/registry/default/blocks/fullscreen-calendar/components/fullscreen-calendar-day"
import { FullScreenCalendarHeader } from "@/registry/default/blocks/fullscreen-calendar/components/fullscreen-calendar-header"
import { FullScreenCalendarWeekDays } from "@/registry/default/blocks/fullscreen-calendar/components/fullscreen-calendar-week-days"

// Dummy data
const data = [
  {
    day: new Date("2025-01-02"),
    events: [
      {
        id: 1,
        name: "Q1 Planning Session",
        time: "10:00 AM",
        datetime: "2025-01-02T00:00",
      },
      {
        id: 2,
        name: "Team Sync",
        time: "2:00 PM",
        datetime: "2025-01-02T00:00",
      },
    ],
  },
  {
    day: new Date("2025-01-07"),
    events: [
      {
        id: 3,
        name: "Product Launch Review",
        time: "2:00 PM",
        datetime: "2025-01-07T00:00",
      },
      {
        id: 4,
        name: "Marketing Sync",
        time: "11:00 AM",
        datetime: "2025-01-07T00:00",
      },
      {
        id: 5,
        name: "Vendor Meeting",
        time: "4:30 PM",
        datetime: "2025-01-07T00:00",
      },
    ],
  },
  {
    day: new Date("2025-01-10"),
    events: [
      {
        id: 6,
        name: "Team Building Workshop",
        time: "11:00 AM",
        datetime: "2025-01-10T00:00",
      },
    ],
  },
  {
    day: new Date("2025-01-13"),
    events: [
      {
        id: 7,
        name: "Budget Analysis Meeting",
        time: "3:30 PM",
        datetime: "2025-01-14T00:00",
      },
      {
        id: 8,
        name: "Sprint Planning",
        time: "9:00 AM",
        datetime: "2025-01-14T00:00",
      },
      {
        id: 9,
        name: "Design Review",
        time: "1:00 PM",
        datetime: "2025-01-14T00:00",
      },
    ],
  },
  {
    day: new Date("2025-01-16"),
    events: [
      {
        id: 10,
        name: "Client Presentation",
        time: "10:00 AM",
        datetime: "2025-01-16T00:00",
      },
      {
        id: 11,
        name: "Team Lunch",
        time: "12:30 PM",
        datetime: "2025-01-16T00:00",
      },
      {
        id: 12,
        name: "Project Status Update",
        time: "2:00 PM",
        datetime: "2025-01-16T00:00",
      },
    ],
  },
  {
    day: new Date("2025-01-21"),
    events: [
      {
        id: 13,
        name: "Tech Stack Review",
        time: "1:00 PM",
        datetime: "2025-01-21T00:00",
      },
      {
        id: 14,
        name: "Security Training",
        time: "3:00 PM",
        datetime: "2025-01-21T00:00",
      },
    ],
  },
  {
    day: new Date("2025-01-23"),
    events: [
      {
        id: 15,
        name: "Marketing Strategy Session",
        time: "2:30 PM",
        datetime: "2025-01-23T00:00",
      },
      {
        id: 16,
        name: "Social Media Planning",
        time: "10:00 AM",
        datetime: "2025-01-23T00:00",
      },
      {
        id: 17,
        name: "Content Review",
        time: "4:00 PM",
        datetime: "2025-01-23T00:00",
      },
    ],
  },
  {
    day: new Date("2025-01-28"),
    events: [
      {
        id: 18,
        name: "Monthly All-Hands",
        time: "4:00 PM",
        datetime: "2025-01-28T00:00",
      },
      {
        id: 19,
        name: "Department Sync",
        time: "10:30 AM",
        datetime: "2025-01-28T00:00",
      },
    ],
  },
  {
    day: new Date("2025-01-30"),
    events: [
      {
        id: 20,
        name: "Project Retrospective",
        time: "11:30 AM",
        datetime: "2025-01-30T00:00",
      },
      {
        id: 21,
        name: "Sprint Demo",
        time: "2:00 PM",
        datetime: "2025-01-30T00:00",
      },
    ],
  },
  {
    day: new Date("2025-01-31"),
    events: [
      {
        id: 22,
        name: "Quarterly Report Review",
        time: "3:00 PM",
        datetime: "2025-01-31T00:00",
      },
      {
        id: 23,
        name: "Year Planning",
        time: "9:30 AM",
        datetime: "2025-01-31T00:00",
      },
      {
        id: 24,
        name: "Team Happy Hour",
        time: "5:00 PM",
        datetime: "2025-01-31T00:00",
      },
    ],
  },
]

export function FullScreenCalendar() {
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = React.useState(today)
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "MMM-yyyy")
  )
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"))
  }

  return (
    <div className="flex flex-1 flex-col">
      <FullScreenCalendarHeader
        startOfMonth={firstDayCurrentMonth}
        endOfMonth={endOfMonth(firstDayCurrentMonth)}
        nextMonth={nextMonth}
        previousMonth={previousMonth}
        goToToday={goToToday}
      />
      <div className="lg:flex lg:flex-auto lg:flex-col">
        <FullScreenCalendarWeekDays />
        <div className="flex text-xs leading-6 lg:flex-auto">
          <div className="hidden w-full border-x lg:grid lg:grid-cols-7 lg:grid-rows-5">
            {days.map((day, dayIdx) => (
              <FullScreenCalendarDay
                data={data}
                key={dayIdx}
                day={day}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                firstDayCurrentMonth={firstDayCurrentMonth}
                dayIndex={dayIdx}
              />
            ))}
          </div>

          <div className="isolate grid w-full grid-cols-7 grid-rows-5 border-x lg:hidden">
            {days.map((day, dayIdx) => (
              <FullScreenCalendarDay
                data={data}
                key={dayIdx}
                day={day}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                firstDayCurrentMonth={firstDayCurrentMonth}
                dayIndex={dayIdx}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
