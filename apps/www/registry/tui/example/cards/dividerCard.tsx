import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import Divider from '../../ui/divider'
import { Button } from '../../ui/button'

export const CardDescriptionSpace = ({ title }: any) => {
    return (
        <CardDescription className='mt-10 mb-6'>
            {title}
        </CardDescription>
    )
}

export const Buttontext = () => {
    return <Button className='rounded-full' variant={"outline"} icon="plus-solid" iconStyle='text-muted-foreground'>
        Button text
    </Button>
}

const DividerCard = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Dividers</CardTitle>
                <CardDescriptionSpace title="With label" />
            </CardHeader>
            <CardContent>
                <Divider label="Continue" />

                <CardDescriptionSpace title="With icon" />
                <Divider icon="plus-solid" />

                <CardDescriptionSpace title="With label on left" />
                <Divider label="Continue" align="left" />

                <CardDescriptionSpace title="With title" />
                <Divider title="Projects" />

                <CardDescriptionSpace title="With title on left" />
                <Divider title="Projects" align="left" />

                <CardDescriptionSpace title="With button" />
                <Divider>
                    <Buttontext />
                </Divider>

                <CardDescriptionSpace title="With title and button" />
                <Divider title="Projects">
                    <Buttontext />
                </Divider>

                <CardDescriptionSpace title="With toolbar" />
                <Divider>
                    <span className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        <button type="button" className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
                            <span className="sr-only">Edit</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                            </svg>
                        </button>
                        <button type="button" className="relative inline-flex items-center bg-white px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
                            <span className="sr-only">Attachment</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <button type="button" className="relative inline-flex items-center bg-white px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
                            <span className="sr-only">Annotate</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 001.33 0l1.713-3.293a.783.783 0 01.642-.413 41.102 41.102 0 003.55-.414c1.437-.231 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zM6.75 6a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 2.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <button type="button" className="relative inline-flex items-center rounded-r-md bg-white px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
                            <span className="sr-only">Delete</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </span>
                </Divider>

            </CardContent>
        </Card>
    )
}

export default DividerCard
