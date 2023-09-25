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
                    <Input   labelAlign="left" label="Email" color="black" className="" hint="Optional" placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with disabled state</div>
                    <Input  labelAlign="left" color="black" label="Email" disabled={true} placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with hidden label</div>
                    <Input  placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with pill shape</div>
                    <Input   labelAlign="left" color="black" label="Email" round="roundedPill" placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with gray background and bottom border </div>
                    <Input  labelAlign="left" color="black" label="Email" bottomBorder={true} placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with keyboard shortcut </div>
                    <Input label="Quick Search" color="black" labelAlign="left" keyboardName="⌘K" placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with validation error</div>
                    <Input  label="Email" labelAlign= "left" variant="destructive"  note="Not a valid email address." alignIcon="right" className="text-red-500" iconStyle="h-5 w-5" icon="circle-exclamation-solid" placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with inline add-on</div>
                    <Input  addOnLabel="https://" labelAlign="left" color="gray" label="Email" labelAndBorderStyle="innerBorder" borderInside="withoutBorder" placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with add-on</div>
                    <Input  labelAlign="left" addOnLabel="https://" color="gray" label="Email" round="button" borderInside="withBorder" labelAndBorderStyle="innerBorder" placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with overlapping label</div>
                    <Input  label="Email" labelAlign="over" color="black"  placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with leading icon</div>
                    <Input  labelAlign="left" label="Email" alignIcon="left" iconStyle="h-5 w-5"  icon="envelope-solid" color="gray"  labelAndBorderStyle="iconWithLabel" placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with trailing icon</div>
                    <Input  labelAlign="left" label="Email" alignIcon="right" iconStyle="h-5 w-5" icon="question-circle-duotone" color="gray" placeholder="you@example.com" />

                    <div className="text-m font-bold text-primary">Input with inline leading and trailing add-ons</div>
                    <Input  labelAlign="left" label="Email" alignIcon="left" color="gray" iconStyle="h-5 w-5"  icon="dollar-duotone"  trailingAddOn={true} labelAndBorderStyle="iconWithLabel" addOnLabel="USD" placeholder="0.00" />

                    <div className="text-m font-bold text-primary">Input with inline leading dropdown</div>
                    <Input  labelAlign="left" label="Email" options={["USA","CA", "UAE","India"]} color="gray" alignDropdown="prefix" labelAndBorderStyle="leadingDropdown" placeholder="+1 (555) 987-6543" />

                    <div className="text-m font-bold text-primary">Input with inline leading add-on and trailing dropdown</div>
                    <Input  label="Email" labelAlign="left" iconStyle="h-5 w-5" options={["USA","CA", "UAE"]}  color="gray"  alignDropdown="suffix" alignIcon="left" icon="dollar-duotone"  labelAndBorderStyle="iconWithLabel"  placeholder="+1 (555) 987-6543" />

                    <div className="text-m font-bold text-primary">Input with inline leading add-on and trailing Button</div>
                    <Input  labelAlign="left" alignIcon="left" iconStyle="h-5 w-5"  icon="users-solid" round="roundForButton"  labelAndBorderStyle="iconWithLabel" buttonLabel="Sort" color="gray" label="Email" placeholder="John Smith" />

                    <div className="text-m font-bold text-primary">Input with inline leading add-on and trailing Button</div>
                    <Input  labelAlign="inside" label="Name" labelAndBorderStyle="labelInside" placeholder="John Smith" />


                </CardContent>
            </Card>
        </div>
    )
}