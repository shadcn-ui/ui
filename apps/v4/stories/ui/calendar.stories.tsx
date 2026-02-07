import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { addDays } from "date-fns"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/registry/new-york-v4/ui/calendar"

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  render: () => <Calendar mode="single" className="rounded-md border" />,
}

export const DateRangeMode: Story = {
  name: "Date Range",
  render: function DateRangeStory() {
    const [range, setRange] = React.useState<DateRange | undefined>({
      from: new Date(),
      to: addDays(new Date(), 7),
    })
    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
        className="rounded-md border"
      />
    )
  },
}

export const WithDropdowns: Story = {
  name: "With Dropdowns",
  render: function DropdownStory() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
        startMonth={new Date(2000, 0)}
        endMonth={new Date(2030, 11)}
        className="rounded-md border"
      />
    )
  },
}

export const WithWeekNumbers: Story = {
  name: "With Week Numbers",
  render: () => (
    <Calendar showWeekNumber mode="single" className="rounded-md border" />
  ),
}

export const DisabledDates: Story = {
  name: "Disabled Dates",
  render: function DisabledDatesStory() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={{ before: new Date() }}
        className="rounded-md border"
      />
    )
  },
}
