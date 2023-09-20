import React from 'react'
import { Card, CardContent, CardDescription, CardHeader } from '../../ui/card'
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group'

const RadioCard = () => {
    return (
        <Card className='w-full'>
            <CardHeader className="pb-2">
                Radio Groups
                <CardDescription>
                    Simple list
                </CardDescription>
            </CardHeader>
            <CardContent className="w-full justify-center flex">
                <div className='w-full p-0'>
                    <div className='pb-2 w-2/3 mx-auto px-0'>
                        <RadioGroup
                            label="Notifications"
                            description='How do you prefer to receive notifications?'
                            className='mb-6 w-full p-0'
                            groupItems={[
                                {
                                    id: "r11",
                                    value: "email",
                                    label: "Email"
                                },
                                {
                                    id: "r12",
                                    value: "phone",
                                    label: "Phone (SMS"
                                },
                                {
                                    id: "r13",
                                    value: "pushNotification",
                                    label: "Push Notification"
                                },
                            ]}
                        />
                    </div>
                    <hr />
                    <CardDescription className='pt-4 px-0'>
                        Simple inline list
                    </CardDescription>
                    <div className='mx-auto w-2/3 pt-4 hidden sm:block'>
                        <RadioGroup
                            label="Notifications"
                            description='How do you prefer to receive notifications?'
                            className='mb-8 w-full  px-0'
                            inline
                        >
                            <RadioGroupItem
                                id="r21"
                                value="email"
                                label="Email"
                            />
                            <RadioGroupItem
                                id="r22"
                                value="phone"
                                label="Phone (SMS)"
                            />
                            <RadioGroupItem
                                id="r23"
                                value="pushNotification"
                                label="Push notification"
                            />
                        </RadioGroup>
                    </div>

                    <hr />
                    <CardDescription className='pt-4 px-0'>
                        List with description
                    </CardDescription>
                    <div className='w-2/3 mx-auto pt-4 px-0'>
                        <RadioGroup
                            className='my-4 w-full mb-8 px-0'
                        >
                            <RadioGroupItem
                                id="r31"
                                value="small"
                                label="Small"
                                description="4 GB RAM / 2 CPUS / 80 GB SSD Storage"
                            />
                            <RadioGroupItem
                                id="r32"
                                value="medium"
                                label="Medium"
                                description="8 GB RAM / 4 CPUS / 160 GB SSD Storage"
                            />
                            <RadioGroupItem
                                id="r33"
                                value="Large"
                                label="Large"
                                description="16 GB RAM / 8 CPUS / 320 GB SSD Storage"
                            />
                        </RadioGroup>
                    </div>

                    <hr />
                    <CardDescription className='pt-4 px-0'>
                        List with inline description
                    </CardDescription>
                    <div className='flex justify-center pt-4 pb-6 px-0'>
                        <RadioGroup
                            className='my-4 w-full px-0'
                        >
                            <RadioGroupItem
                                id="r41"
                                value="small"
                                label="Small"
                                description="4 GB RAM / 2 CPUS / 80 GB SSD Storage"
                                inline
                            />
                            <RadioGroupItem
                                id="r42"
                                value="medium"
                                label="Medium"
                                description="8 GB RAM / 4 CPUS / 160 GB SSD Storage"
                                inline
                            />
                            <RadioGroupItem
                                id="r43"
                                value="Large"
                                label="Large"
                                description="16 GB RAM / 8 CPUS / 320 GB SSD Storage"
                                inline
                            />
                        </RadioGroup>
                    </div>

                    <hr />
                    <CardDescription className='pt-4'>
                        List with radio on right
                    </CardDescription>
                    <div className='mx-auto pt-4 pb-6 w-2/3'>
                        <RadioGroup
                            className='my-4 w-full'
                            label='Transfer funds'
                            description='Transfer your balance to your bank account.'
                        >
                            <RadioGroupItem
                                id="r51"
                                value="checking"
                                label="Checking"
                                description="CIBC ••••6610"
                                alignment='right'
                            />
                            <hr />
                            <RadioGroupItem
                                id="r52"
                                value="savings"
                                label="Savings"
                                description="Bank of America ••••0149"
                                alignment='right'
                            />
                            <hr />
                            <RadioGroupItem
                                id="r53"
                                value="mastercard"
                                label="Mastercard"
                                description="Capital One ••••7877"
                                alignment='right'
                            />
                        </RadioGroup>
                    </div>

                    <hr />
                    <CardDescription className='pt-4'>
                        Simple list with radio on right
                    </CardDescription>
                    <div className='w-2/3 pt-4 mx-auto'>
                        <RadioGroup
                            className='my-4 w-full'
                            label='Select a side'
                            showDivider
                        >
                            <RadioGroupItem
                                id="r61"
                                value="none"
                                label="None"
                                alignment='right'
                                showDivider
                            />
                            <RadioGroupItem
                                id="r62"
                                value="baked beans"
                                label="Baked Beans"
                                alignment='right'
                                showDivider
                            />
                            <RadioGroupItem
                                id="r63"
                                value="coleslaw"
                                label="Coleslaw"
                                alignment='right'
                                showDivider
                            />
                            <RadioGroupItem
                                id="r64"
                                value="frenchFries"
                                label="French Fries"
                                alignment='right'
                                showDivider
                            />
                            <RadioGroupItem
                                id="r65"
                                value="gardenSalad"
                                label="Garden Salad"
                                alignment='right'
                                showDivider
                            />
                            <RadioGroupItem
                                id="r66"
                                value="mashedPotatoes"
                                label="Mashed Potatoes"
                                alignment='right'
                            />
                        </RadioGroup>
                    </div>

                    <hr />
                    <CardDescription className='pt-4'>
                        Color Picker
                    </CardDescription>
                    <div className='w-full flex text-center justify-center pt-4 '>
                        <RadioGroup
                            className='my-4 w-full'
                            label="Chose a label color" inline
                        >
                            <RadioGroupItem
                                id="r71"
                                value="#EF798A"
                                fillColor="[#EB5D4D]"
                            />
                            <RadioGroupItem
                                id="r73"
                                value="green-500"
                                fillColor="[#0CCE6B]"
                            />
                            <RadioGroupItem
                                id="r74"
                                value="blue-500"
                                fillColor="[#EF2D56]"
                            />
                            <RadioGroupItem
                                id="r75"
                                value="yellow-700"
                                fillColor="[#ED7D3A]"
                            />
                            <RadioGroupItem
                                id="r72"
                                value="pink-500"
                                fillColor="gray-600"
                            />
                        </RadioGroup>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default RadioCard
