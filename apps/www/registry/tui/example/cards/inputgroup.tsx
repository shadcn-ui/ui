import { Card, CardContent, CardHeader, CardTitle, } from "@/registry/tui/ui/card"
import { Input } from "@/registry/tui/ui/input"

export function CardsInputGroup() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal text-primary"  >Input Group</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
               
                    <div className="font-bold text-primary">Input</div>
                    <Input label="Email"  placeholder="you@example.com" />

                    <div className="font-bold text-primary">Input with help text</div>
                    <Input label="Email"  note="We'll only use this for spam." placeholder="you@example.com" />

                    <div className="font-bold text-primary">Input with validation error</div>
                    <Input label="Email"  error="Not a valid email address" alignIcon="right" placeholder="you@example.com" />
                    
                    <div className="font-bold text-primary">Input with disabled state</div>
                    <Input label="Email" placeholder="you@example.com" disabled={true} />

                    <div className="font-bold text-primary">Input with hidden label</div>
                    <Input placeholder="you@example.com" />

                    <div className="font-bold text-primary">Input with corner hint</div>
                    <Input label="Email" placeholder="you@example.com" hint="Optional"/>

                    <div className="font-bold text-primary">Input with leading icon</div>
                    <Input  label="Email" placeholder="you@example.com" icon="envelope-solid" borderStyleForAddOn="iconWithLabel" />

                    <div className="font-bold text-primary">Input with trailing icon</div>
                    <Input  label="Account number" placeholder="000-00-0000" icon="question-circle-duotone" alignIcon="right"/>

                    <div className="font-bold text-primary">Input with add-on</div>
                    <Input label="Company Website" placeholder="www.example.com" addOnText="https://" addOnBorder="withBorder" border="button" borderStyleForAddOn="innerBorder"/>

                    <div className="font-bold text-primary">Input with inline add-on</div>
                    <Input label="Email" placeholder="you@example.com" addOnText="https://" addOnBorder="withoutBorder" borderStyleForAddOn="innerBorder" />

                    <div className="font-bold text-primary">Input with inline leading and trailing add-ons</div>
                    <Input  label="Email" placeholder="0.00" icon="dollar-duotone" addOnText="USD" trailingAddOn={true} borderStyleForAddOn="iconWithLabel" />

                    <div className="font-bold text-primary">Input with inline leading dropdown</div>
                    <Input  label="Email" placeholder="+1 (555) 987-6543" options={["US", "CA", "EU"]} alignDropdown="left" borderStyleForAddOn="leadingDropdown" />
                    
                    <div className="font-bold text-primary">Input with inline leading add-on and trailing dropdown</div>
                    <Input label="Email" placeholder="+1 (555) 987-6543" options={["USD", "CAD", "EUR"]}  alignDropdown="right" icon="dollar-duotone" borderStyleForAddOn="iconWithLabel"  />
                    
                    <div className="font-bold text-primary">Input with inline leading add-on and trailing Button</div>
                    <Input label="Email" placeholder="John Smith"  icon="users-solid" border="roundedButton" borderStyleForAddOn="iconWithLabel" buttonLabelText="Sort"  />
                    
                    <div className="font-bold text-primary">Input with inset label</div>
                    <Input label="Name" labelAlign="inside" placeholder="John Smith" borderStyleForAddOn="labelInside"  />

                    <div className="font-bold text-primary">Input with overlapping label</div>
                    <Input labelAlign="over" label="Email"  placeholder="you@example.com" />

                    <div className="font-bold text-primary">Input with pill shape</div>
                    <Input label="Email" placeholder="you@example.com" border="roundedPill"   />
                    
                    <div className="font-bold text-primary">Input with gray background and bottom border </div>
                    <Input label="Email" placeholder="you@example.com" bottomBorder={true} border="bottomBorder" />
                    
                    <div className="font-bold text-primary">Input with keyboard shortcut </div>
                    <Input label="Quick Search" placeholder="you@example.com" keyboardName="⌘K"  />

                    

                    

                    

                   

                    

                   
                </div>


            </CardContent>
        </Card>
    )
}