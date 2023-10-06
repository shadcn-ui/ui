import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, } from "@/registry/tui/ui/card"
import { Pagination } from "../../ui/pagination"

export function CardsPagination() {
    const [currentPageNumber1, setCurrentPageNumber1] = useState<number>(1);
    const [currentPageNumber2, setCurrentPageNumber2] = useState<number>(1);
    const [currentPageNumber3, setCurrentPageNumber3] = useState<number>(1);

    let recordsPerPage= 10;
    const data = [{ "id": 1, "first_name": "Jessamyn", "last_name": "Espinazo", "email": "jespinazo0@chicagotribune.com", "phone": "162-166-0977" },
    { "id": 2, "first_name": "Isac", "last_name": "Tooher", "email": "itooher1@psu.edu", "phone": "655-567-3619" },
    { "id": 3, "first_name": "Tabbatha", "last_name": "Proschke", "email": "tproschke2@weibo.com", "phone": "327-612-4850" },
    { "id": 4, "first_name": "Ninetta", "last_name": "Mabb", "email": "nmabb3@canalblog.com", "phone": "971-296-0911" },
    { "id": 5, "first_name": "Danni", "last_name": "Wallentin", "email": "dwallentin4@comcast.net", "phone": "983-297-0506" },
    { "id": 6, "first_name": "Neely", "last_name": "Purkins", "email": "npurkins5@mediafire.com", "phone": "379-119-4237" },
    { "id": 7, "first_name": "Jessika", "last_name": "Kinkaid", "email": "jkinkaid6@eventbrite.com", "phone": "771-888-6284" },
    { "id": 8, "first_name": "Julianna", "last_name": "Swindall", "email": "jswindall7@aol.com", "phone": "252-614-0486" },
    { "id": 9, "first_name": "Corrinne", "last_name": "Geeve", "email": "cgeeve8@wisc.edu", "phone": "450-872-8646" },
    { "id": 10, "first_name": "Trumann", "last_name": "Flux", "email": "tflux9@census.gov", "phone": "249-892-1585" },
    { "id": 11, "first_name": "Annalise", "last_name": "Keinrat", "email": "akeinrata@i2i.jp", "phone": "659-283-4601" },
    { "id": 12, "first_name": "Cal", "last_name": "Haverson", "email": "chaversonb@multiply.com", "phone": "689-567-9516" },
    { "id": 13, "first_name": "Erik", "last_name": "McGillivrie", "email": "emcgillivriec@theglobeandmail.com", "phone": "334-579-0995" }]

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPageNumber2 - 1) * (recordsPerPage);
        const lastPageIndex = firstPageIndex + (recordsPerPage);
        return data.slice(firstPageIndex, lastPageIndex);
    }, [currentPageNumber2]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal text-primary">Pagination</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-m font-bold text-primary mt-6">Card footer with page buttons</div>
                <Pagination nextButtonIcon="chevron-right-solid" previousButtonIcon="chevron-left-solid" recordsPerPage={recordsPerPage} totalPages={data.length} textColor="gray" activeButtonClass="bg-indigo-600 text-white" showNumbersButton={true} currentPageNumber={currentPageNumber2} onButtonClick={(page: number) => setCurrentPageNumber2(page)} />

                 <div className="text-m font-bold text-primary">Centered page numbers</div>
                <Pagination nextButtonIcon="arrow-right-solid" previousButtonIcon="arrow-left-solid" previousButtonText="Previous" nextButtonText="Next" recordsPerPage={recordsPerPage} totalPages={data.length}  borderColor="gray" activeButtonClass="border-indigo-500 text-indigo-600" showLabel={true} currentPageNumber={currentPageNumber1} onButtonClick={(page: number) => setCurrentPageNumber1(page)} />

                <div className="text-m font-bold text-primary mt-6">Simple card footer</div>
                <Pagination previousButtonText="Previous" nextButtonText="Next" showPreviousNextButton={true} recordsPerPage={recordsPerPage} totalPages={data.length} textColor="gray" currentPageNumber={currentPageNumber3} onButtonClick={(page: number) => setCurrentPageNumber3(page)} />
            </CardContent>
        </Card>
    )
}