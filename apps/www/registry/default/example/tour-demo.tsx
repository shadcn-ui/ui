import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { Input } from "@/registry/default/ui/input"
import { TourFactory } from "@/registry/default/ui/tour"

const tour = TourFactory([
  "buttonOne",
  "buttonTwo",
  "missingButton",
  "buttonFour",
  "emailInput",
])

const TourDisplay = (props: {
  children: React.ReactNode
  title?: string
  description?: string
}) => {
  const ctx = tour.useContext()
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent>{props.children}</CardContent>
      <CardFooter>
        {ctx.current < ctx.nodes.size ? (
          <div className="flex w-full justify-between">
            <Button variant="outline" onClick={ctx.close}>
              Close
            </Button>
            <div>
              <Button onClick={ctx.previous}>Previous</Button>
              <Button onClick={ctx.next}>Next</Button>
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-end">
            <Button onClick={ctx.previous}>Previous</Button>
            <Button className="bg-green-800" onClick={ctx.close}>
              Finish
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

const TourApplication = () => {
  const ctx = tour.useContext()
  return (
    <div className="flex h-96 w-full items-center justify-center">
      <div className="absolute bottom-2 left-2 flex gap-2">
        <tour.TourFocus
          name="buttonOne"
          tourRender={
            <TourDisplay title="Create Incident">
              <h1>This button creates an incident</h1>
              <p>helpful text about this button</p>
            </TourDisplay>
          }
        >
          <Button>Create Incident</Button>
        </tour.TourFocus>
        <tour.TourFocus
          name="buttonFour"
          tourRender={
            <TourDisplay title="Update Incident">
              <h1>This button pushes your updates</h1>
              <p>helpful text about this button</p>
            </TourDisplay>
          }
        >
          <Button>Update Incident</Button>
        </tour.TourFocus>
      </div>
      <div className="absolute right-2 top-12 flex gap-2">
        <tour.TourFocus
          name="buttonTwo"
          tourRender={
            <TourDisplay title="Resolve Incident">
              <h1>This button Resolves the Incident</h1>
              <p>helpful text about this button</p>
            </TourDisplay>
          }
        >
          <Button>Resolve Incident</Button>
        </tour.TourFocus>
      </div>
      <div>
        <tour.TourFocus
          name="emailInput"
          tourRender={
            <TourDisplay title="Email Input">
              <h1>This is where you put incident info</h1>
              <p>helpful text about this input</p>
            </TourDisplay>
          }
        >
          <Input type="email" placeholder="Email" />
        </tour.TourFocus>
      </div>
      <div className="absolute bottom-2 right-2">
        <Button onClick={ctx.open}>Open Tour</Button>
      </div>
    </div>
  )
}

export default function TourDemo() {
  return (
    <tour.TourProvider>
      <TourApplication />
    </tour.TourProvider>
  )
}
