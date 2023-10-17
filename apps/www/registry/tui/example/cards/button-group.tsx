import { Card, CardContent, CardHeader, CardTitle, } from "@/registry/tui/ui/card"
import { ButtonGroup } from "../../ui/button-group"

export function CardsButtonGroup() {
    const dropDownOptions = {
        items: [
            { name: 'Save and schedule', href: '#' },
            { name: 'Save and publish', href: '#' },
            { name: 'Export PDF', href: '#' },
        ],
    };
    const buttonsList = [
        { checkbox: true },
        { dropdownOptions: ['Unread messages', 'Sent messages', 'All messages'] },
    ];
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal text-primary">Button Group</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-5">
                    <div className=" font-bold text-primary">Basic</div>
                    <ButtonGroup buttonsList={[{ name: 'Years' }, { name: 'Month' }, { name: 'Days' }]} textColor="gray" size="default" />

                    <div className=" font-bold text-primary">Icon only</div>
                    <ButtonGroup buttonsList={[{ icon: "chevron-left-solid" }, { icon: "chevron-right-solid" }]} textColor="gray" size="default" />

                    <div className=" font-bold text-primary">With stat</div>
                    <ButtonGroup buttonsList={[{ name: 'Bookmark', icon: "bookmark-solid" }, { name: '12k' }]} textColor="gray" size="default" />

                    <div className=" font-bold text-primary">With checkbox and dropdown</div>
                    <ButtonGroup buttonsList={buttonsList} textColor="gray" size="checkbox" />
                   
                    <div className=" font-bold text-primary">With dropdown</div>
                    <ButtonGroup buttonsList={[{ name: 'Save Changes' }, { icon: "chevron-down-solid" }]} dropdownWidth="w-56" dropDownOptions={dropDownOptions} textColor="gray" size="default" />

                </div>



            </CardContent>
        </Card>
    )
}