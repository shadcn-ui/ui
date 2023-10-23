import * as React from "react";
import { InputNumber } from "@/registry/default/ui/input-number"
import { Label } from "@/registry/default/ui/label"


export default function InputNumberDemo() {

    const [number, setNumber] = React.useState<number>(1);

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="number">Number</Label>
            <InputNumber
                className="w-[240px]"
                min={1}
                max={7}
                step={1}
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
            />
            <p className="text-sm text-muted-foreground">Enter your number, between 1 and 7.</p>
        </div>
    )
}
