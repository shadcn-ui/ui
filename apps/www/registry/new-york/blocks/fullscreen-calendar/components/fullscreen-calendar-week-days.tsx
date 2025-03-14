import React from "react"

export function FullScreenCalendarWeekDays() {
  return (
    <div className="grid grid-cols-7 border text-center text-xs font-semibold leading-6 lg:flex-none">
      <div className="border-r py-2.5">Sun</div>
      <div className="border-r py-2.5">Mon</div>
      <div className="border-r py-2.5">Tue</div>
      <div className="border-r py-2.5">Wed</div>
      <div className="border-r py-2.5">Thu</div>
      <div className="border-r py-2.5">Fri</div>
      <div className="py-2.5">Sat</div>
    </div>
  )
}
