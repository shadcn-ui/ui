import {Card,CardContent,CardHeader,CardTitle,} from "@/registry/tui/ui/card"
import { Input } from "@/registry/tui/ui/input"

export function CardsInputGroup() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-normal text-primary"  >Input Group</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-m font-bold text-primary">Input</div>
                    <Input  labelAlign="left" color="black" label="Email" placeholder="you@example.com"  />

                    <div className="text-m font-bold text-primary">Input with help text</div>
                    <Input  labelAlign="left" label="Email" color="black" note="We'll only use this for spam." placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with corner hint</div>
                    <Input   labelAlign="left" label="Email" color="black" hint="Optional" placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with disabled state</div>
                    <Input  labelAlign="left" color="black" label="Email" disabled={true} placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with hidden label</div>
                    <Input  placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with pill shape</div>
                    <Input   labelAlign="left" color="black" label="Email" roundPill={true} round="roundedPill" placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with gray background and bottom border </div>
                    <Input  labelAlign="left" color="black" label="Email" bottomBorder={true} borderStyle="borderFocus" placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with keyboard shortcut </div>
                    <Input label="Quick Search" color="black" labelAlign="left"  keyboard={true} placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with validation error</div>
                    <Input  label="Email" labelAlign="left" color="red" borderStyle="error"  note="Not a valid email address." placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with add-on</div>
                    <Input  addOnLabel="www" labelAlign="left" color="gray" label="Email" borderStyle="innerBorder" borderInside="withoutborder" placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with inline add-on</div>
                    <Input  labelAlign="left" addOnLabel="https://" color="gray" label="Email" round="button" borderInside="withborder" borderStyle="innerBorder" placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with overlapping label</div>
                    <Input  label="Email" labelAlign="over" bgColor="white" color="black"  placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with leading icon</div>
                    <Input  labelAlign="left" label="Email" alignIcon="left"  icon="envelope-solid" color="gray"  borderStyle="iconWithLabel" placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with trailing icon</div>
                    <Input  labelAlign="left" label="Email" alignIcon="right" icon="question-circle-duotone" color="gray" placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with inline leading and trailing add-ons</div>
                    <Input  labelAlign="left" label="Email" alignIcon="left" color="gray"  icon="dollar-duotone"  trailingAddOn={true} borderStyle="iconWithLabel" addOnLabel="USD" placeholder="0.00" />

                    <div className="text-m font-bold text-primary">Input with inline leading dropdown</div>
                    <Input  labelAlign="left" label="Email" options={["USA","CA", "UAE","India"]} color="gray" dropdown="prefix" borderStyle="leadingDropdown" placeholder="+1 (555) 987-6543" />

                    <div className="text-m font-bold text-primary">Input with inline leading add-on and trailing dropdown</div>
                    <Input  label="Email" labelAlign="left" options={["USA","CA", "UAE"]}  color="gray"  dropdown="sufix" alignIcon="left" icon="dollar-duotone"  borderStyle="iconWithLabel"  placeholder="+1 (555) 987-6543" />

                    <div className="text-m font-bold text-primary">Input with inline leading add-on and trailing Button</div>
                    <Input  labelAlign="left" alignIcon="left"  icon="users-solid" round="roundForButton"  borderStyle="iconWithLabel" trailingButton={true} buttonLabel="Sort" color="gray" label="Email" placeholder="John Smith" />

                    <div className="text-m font-bold text-primary">Input with inline leading add-on and trailing Button</div>
                    <Input  labelAlign="inside" label="Name" borderStyle="labelInside" placeholder="John Smith" />


                </CardContent>
            </Card>
        </div>
    )
}