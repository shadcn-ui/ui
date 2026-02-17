@@directive("'use client'")

@module("react-day-picker/locale")
external enUS: JSON.t = "enUS"

@react.component
let make = () => {
  let date = Date.make()

  <Calendar
    mode="single"
    selected=date
    locale=enUS
    className="rounded-lg border"
    captionLayout="dropdown"
  />
}
