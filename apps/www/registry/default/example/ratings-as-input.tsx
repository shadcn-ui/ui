"use client"

import React from "react"

import Ratings from "../ui/ratings"

const RatingAsInput = () => {
  const [value, setValue] = React.useState(2.5)
  const [anotherValue, setAnotherValue] = React.useState(1)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 items-center justify-center">
        <span>Value: {value}</span>
        <Ratings asInput value={value} onValueChange={setValue} />
      </div>
      <div className="flex flex-col gap-6 items-center justify-center">
        <span>Another Value: {anotherValue}</span>
        <Ratings asInput value={anotherValue} onValueChange={setAnotherValue} />
      </div>
    </div>
  )
}

export default RatingAsInput
