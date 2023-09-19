import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Checkbox } from '../../ui/checkbox'

const CheckboxesCard = () => {
    const listWithDescription = useMemo(() => [{
        label: "Comments",
        description: "Get notified when someones posts a comment on a posting."
    }, {
        label: "Candidates",
        description: "Get notified when a candidate applies for a job."
    }, {
        label: "Offers",
        description: "Get notified when a candidate accepts or rejects an offer."
    }], [])

    const listWithInlineDescription = useMemo(() => [{
        label: "New comments",
        description: "so you always know what's happening"
    }, {
        label: "New Candidates",
        description: "who apply for any open postings"
    }, {
        label: "Offers",
        description: "when they are accepted or rejected by candidates"
    }], [])

    const people = useMemo(() => [
        { id: 1, name: 'Annette Black' },
        { id: 2, name: 'Cody Fisher' },
        { id: 3, name: 'Courtney Henry' },
        { id: 4, name: 'Kathryn Murphy' },
        { id: 5, name: 'Theresa Webb' },
    ], [])

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>Checkboxes</CardTitle>
                <CardDescription>
                    List with description
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full flex justify-start">
                    <div className='w-full'>
                        {listWithDescription?.map((item, index) => {
                            return (
                                <Checkbox key={index} label={item?.label}
                                    description={item?.description}
                                />
                            )
                        })}
                    </div>
                </div>
            </CardContent>
            <hr />
            <CardHeader className="pb-3">
                <CardDescription>
                    List with inline description
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6 w-full">
                    {listWithInlineDescription?.map((item, index) => {
                        return (
                            <Checkbox key={index} label={item?.label}
                                description={item?.description}
                                inline
                            />
                        )
                    })}
                </div>
            </CardContent>
            <hr />
            <CardHeader className="pb-3">
                <CardDescription>
                    List with checkbox on right
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full space-y-4">
                    {listWithDescription?.map((item, index) => {
                        return (
                            <Checkbox key={index} label={item?.label}
                                description={item?.description}
                                alignment="right"
                            />
                        )
                    })}
                </div>
            </CardContent>
            <hr />

            <CardHeader className="pb-3">
                <CardDescription>
                    Simple list with heading
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 w-full">
                    <div className=''>
                        <p className="font-semibold pb-2">Members</p>
                        <hr />
                    </div>
                    {people?.map((item, index) => {
                        return (
                            <Checkbox key={index}
                                label={item?.name}
                                alignment="left"
                                inline
                                showDivider
                            />
                        )
                    })}
                </div>
            </CardContent>
            <hr />
        </Card>
    )
}

export default CheckboxesCard
