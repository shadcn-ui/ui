
"use client"

import * as React from "react"
import { DateRange } from "react-day-picker"
import { Calendar } from "@/registry/new-york-v4/ui/calendar"

export default function ReproduceBugPage() {
    // Select a range in July 2025: July 2nd to July 4th
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2025, 6, 2),
        to: new Date(2025, 6, 4),
    })

    return (
        <div className="p-10 flex justify-center flex-col items-center gap-4">
            <h1 className="text-xl font-bold">Range Calendar Bug Verification</h1>
            <p className="text-muted-foreground">
                Verify that the outside days are HIDDEN (using default behavior).
            </p>
            <Calendar
                mode="range"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow-sm"
                defaultMonth={new Date(2025, 5)} // Show June 2025 first
                numberOfMonths={2}
            />
        </div>
    )
}
