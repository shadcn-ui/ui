import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Switch } from '../../ui/switch'

const SwitchCard = () => {
    const [isChecked, setIsChecked] = useState<boolean>(false)
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>Switch Toggles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 space-x-2">
                <CardDescription>
                    Simple Switch Toggle
                </CardDescription>
                <div className='flex space-x-2 justify-center py-3 flex-wrap'>
                    <Switch aria-label="Outlined Small Toggle" />
                </div>
                <hr />
                <CardDescription>
                    Short Toggle
                </CardDescription>
                <div className='flex space-x-2 justify-center pt-3 pb-6 flex-wrap'>
                    <Switch aria-label="Small Toggle" variant={"short"} />
                </div>
                <hr />
                <CardDescription>
                    Icon Toggle
                </CardDescription>
                <div className='flex space-x-2 justify-center pt-3 pb-6 flex-wrap'>
                    <Switch aria-label="Small Toggle" variant={"icon"}
                        iconLeft="sun-solid"
                        iconLeftClassName='text-orange-600'
                        iconRightClassName='text-gray-500'
                        iconRight="moon-solid"
                        value={isChecked ? "true" : undefined}
                        onCheckedChange={(e: any) => setIsChecked(e)}
                    />
                </div>
                <hr />
                <CardDescription>
                    With left label and description
                </CardDescription>
                <Switch
                    aria-label="Default Toggle"
                    label={"Available to hire"}
                    description={"Nulla amet tempus sit accumsan. Aliquet turpis sed sit lacinia."}
                />
                <hr />
                <CardDescription>
                    With right label and inline description
                </CardDescription>
                <div className='py-8'>
                    <Switch
                        aria-label="Default Toggle"
                        label={"Annual Billing"}
                        description={"(Save 10%)"}
                        alignment='left'
                        inline
                    />
                </div>
                <hr />
            </CardContent>
        </Card >
    )
}

export default SwitchCard
