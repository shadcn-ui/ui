import * as React from "react"

import { Button } from "@/registry/new-york/ui/button"
import { TourFactory } from "@/registry/new-york/ui/tour"

const tour = TourFactory(["buttonOne", "buttonTwo"])

const TourApplication = () => {
  const ctx = tour.useContext()
  return (
    <>
      <tour.TourFocus name="buttonOne" tourRender={() => <>My Button One</>}>
        <Button>One</Button>
      </tour.TourFocus>
      <tour.TourFocus name="buttonOne" tourRender={() => <>My Button One</>}>
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
