import { Card, CardContent, CardHeader, CardTitle, } from "@/registry/tui/ui/card"
import { Input } from "@/registry/tui/ui/input"

export function CardsInputGroup() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal text-primary"  >Input Group</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-m font-bold text-primary">Input</div>
                <Input labelAlign="left" textColor="black" label="Email" placeholder="you@example.com" />

                <div className="text-m font-bold text-primary">Input with help text</div>
                <Input labelAlign="left" label="Email" textColor="black" note="We'll only use this for spam." placeholder="you@example.com" />

                <div className="text-m font-bold text-primary">Input with corner hint</div>
                <Input labelAlign="left" label="Email" textColor="black" className="" hint="Optional" placeholder="you@example.com" />

                <div className="text-m font-bold text-primary">Input with disabled state</div>
                <Input labelAlign="left" textColor="black" label="Email" disabled={true} placeholder="you@example.com" />

                <div className="text-m font-bold text-primary">Input with hidden label</div>
                <Input placeholder="you@example.com" />

                <div className="text-m font-bold text-primary">Input with pill shape</div>
                <Input labelAlign="left" textColor="black" label="Email" round="roundedPill" placeholder="you@example.com" />

                <div className="text-m font-bold text-primary">Input with gray background and bottom border </div>
                <Input labelAlign="left" textColor="black" label="Email" bottomBorder={true} placeholder="you@example.com" />

                <div className="text-m font-bold text-primary">Input with keyboard shortcut </div>
                <Input label="Quick Search" textColor="black" labelAlign="left" keyboardName="⌘K" placeholder="you@example.com" />

                <div className="text-m font-bold text-primary">Input with validation error</div>
                <Input label="Email" labelAlign="left" error="Not a valid email address" alignIcon="right" iconStyle="h-5 w-5" placeholder="you@example.com" />

                <div className="text-m font-bold text-primary">Input with inline add-on</div>
                <Input addOnLabel="https://" labelAlign="left" textColor="gray" label="Email" labelAndBorderStyle="innerBorder" borderInside="withoutBorder" placeholder="you@example.com" />

                <div className="text-m font-bold text-primary">Input with add-on</div>
                <Input labelAlign="left" addOnLabel="https://" textColor="gray" label="Email" round="button" borderInside="withBorder" labelAndBorderStyle="innerBorder" placeholder="you@example.com" />

                <div className="text-m font-bold text-primary">Input with overlapping label</div>
                <Input label="Email" labelAlign="over" textColor="black" placeholder="you@example.com" />

                <div className="text-m font-bold text-primary">Input with leading icon</div>
                <Input labelAlign="left" label="Email" alignIcon="left" iconStyle="h-5 w-5" icon="envelope-solid" textColor="gray" labelAndBorderStyle="iconWithLabel" placeholder="you@example.com" />

                <div className="text-m font-bold text-primary">Input with trailing icon</div>
                <Input labelAlign="left" label="Email" alignIcon="right" iconStyle="h-5 w-5" icon="question-circle-duotone" textColor="gray" placeholder="you@example.com" />

                <div className="text-m font-bold text-primary">Input with inline leading and trailing add-ons</div>
                <Input labelAlign="left" label="Email" alignIcon="left" textColor="gray" iconStyle="h-5 w-5" icon="dollar-duotone" trailingAddOn={true} labelAndBorderStyle="iconWithLabel" addOnLabel="USD" placeholder="0.00" />

                <div className="text-m font-bold text-primary">Input with inline leading dropdown</div>
                <Input labelAlign="left" label="Email" options={["USA", "CA", "UAE", "India"]} textColor="gray" alignDropdown="prefix" labelAndBorderStyle="leadingDropdown" placeholder="+1 (555) 987-6543" />

                <div className="text-m font-bold text-primary">Input with inline leading add-on and trailing dropdown</div>
                <Input label="Email" labelAlign="left" iconStyle="h-5 w-5" options={["USA", "CA", "UAE"]} textColor="gray" alignDropdown="suffix" alignIcon="left" icon="dollar-duotone" labelAndBorderStyle="iconWithLabel" placeholder="+1 (555) 987-6543" />

                <div className="text-m font-bold text-primary">Input with inline leading add-on and trailing Button</div>
                <Input labelAlign="left" alignIcon="left" iconStyle="h-5 w-5" icon="users-solid" round="roundForButton" labelAndBorderStyle="iconWithLabel" buttonLabel="Sort" textColor="gray" label="Email" placeholder="John Smith" />

                <div className="text-m font-bold text-primary">Input with inline leading add-on and trailing Button</div>
                <Input labelAlign="inside" label="Name" labelAndBorderStyle="labelInside" placeholder="John Smith" />


            </CardContent>
        </Card>
    )
}