
import * as React from "react";
import { cn } from "@/lib/utils"
import { Minus, Plus } from "lucide-react";

import { Button } from "@/registry/default/ui/button";

enum NumberEvents {
    PLUS = "plus",
    MINUS = "minus",
}

export interface InputNumberProp extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    min?: number;
    max?: number;
    step?: number;
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProp>(
    ({ className, min, max, step, ...props }, ref) => {

        function handleNumberEvent(type: NumberEvents = NumberEvents.PLUS) {
            const currentValue = Number(props.value) || 0;
            const action = type === NumberEvents.PLUS ? 1 : -1;
            const newValue = Number((currentValue + action * Number(step || 1)).toFixed(2));

            if ((min && newValue < min) || (max && newValue > max)) {
                return;
            }

            props.onChange?.({
                target: {
                    value: newValue
                }
            } as unknown as React.ChangeEvent<HTMLInputElement>);
        }

        return (
            <div className={cn('relative flex w-full items-center', className)}>
                <input
                    type={"number"}
                    className="mr-2 flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    ref={ref}
                    min={min}
                    max={max}
                    step={step}
                    {...props}
                />
                <div className="absolute right-2 top-0">
                    <Button
                        variant="outline"
                        type="button"
                        className="rounded-none"
                        onClick={() => handleNumberEvent(NumberEvents.PLUS)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        className="rounded-l-none border-l-0"
                        onClick={() => handleNumberEvent(NumberEvents.MINUS)}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }
);

InputNumber.displayName = "Input Number";

export { InputNumber };