@@directive("'use client'")

@react.component
let make = () =>
  <Calendar
    mode="single"
    captionLayout=Calendar.CaptionLayout.Dropdown
    className="rounded-lg border"
  />
