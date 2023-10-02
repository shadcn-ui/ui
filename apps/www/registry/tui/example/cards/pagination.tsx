import { Card, CardContent, CardHeader, CardTitle, } from "@/registry/tui/ui/card"
import { Pagination } from "../../ui/pagination"


export function CardsPagination() {


    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal text-primary">Pagination</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-m font-bold text-primary">Centered page numbers</div>
                <Pagination nextButtonIcon= "arrow-right-solid"  previousButtonIcon="arrow-left-solid" previousButtonText="Previous" nextButtonText="Next" borderColor="gray"  totalPages={100} activeButtonClass="border-indigo-500 text-indigo-600"  withFooter={true}  />

                <div className="text-m font-bold text-primary mt-6">Card footer with page buttons</div>
                <Pagination nextButtonIcon= "chevron-right-solid" previousButtonIcon="chevron-left-solid" textColor="gray" activeButtonClass="bg-indigo-600 text-white" withNumberButton={true}  totalPages={100} leftButton="leftButtonRound" rightButton="rightButtonRound"/>

                <div className="text-m font-bold text-primary mt-6">Simple card footer</div>
                <Pagination  previousButtonText="Previous" nextButtonText="Next"  totalPages={100} showButton={true} textColor="gray"  />
            </CardContent>
        </Card>
    )
}