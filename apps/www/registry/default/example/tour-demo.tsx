import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import { TourFactory } from "@/registry/default/ui/tour"

const tour = TourFactory([
  "buttonOne",
  "buttonTwo",
  "missingButton",
  "buttonFour",
])

const TourApplication = () => {
  const ctx = tour.useContext()
  return (
    <>
      <tour.TourFocus
        name="buttonOne"
        tourRender={() => (
          <div className="flex flex-col">
            <h1>My Button One</h1>
            <div className="flex">
              <Button onClick={ctx.previous}>Previous</Button>
              <Button onClick={ctx.next}>Next</Button>
            </div>
            <div className="relative right-0 top-0">
              <Button onClick={ctx.close}>X</Button>
            </div>
          </div>
        )}
      >
        <Button>One</Button>
      </tour.TourFocus>
      <tour.TourFocus
        name="buttonTwo"
        tourRender={() => (
          <div className="flex flex-col">
            <h1>My Button One</h1>
            <div className="flex">
              <Button onClick={ctx.previous}>Previous</Button>
              <Button onClick={ctx.next}>Next</Button>
            </div>
            <div className="relative right-0 top-0">
              <Button onClick={ctx.close}>X</Button>
            </div>
          </div>
        )}
      >
        <Button>One</Button>
      </tour.TourFocus>
      <tour.TourFocus
        name="buttonFour"
        tourRender={() => (
          <div className="flex flex-col">
            <h1>My Button One</h1>
            <div className="flex">
              <Button onClick={ctx.previous}>Previous</Button>
              <Button onClick={ctx.next}>Next</Button>
            </div>
            <div className="relative right-0 top-0">
              <Button onClick={ctx.close}>X</Button>
            </div>
          </div>
        )}
      >
        <Button>One</Button>
      </tour.TourFocus>
      <Button onClick={ctx.open}>Open Tour</Button>
    </>
  )
}

export default function TourDemo() {
  return (
    <tour.TourProvider>
      <TourApplication />
    </tour.TourProvider>
  )
}
