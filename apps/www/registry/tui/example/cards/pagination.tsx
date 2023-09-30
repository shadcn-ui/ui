import { Card, CardContent, CardHeader, CardTitle, } from "@/registry/tui/ui/card"
import { Pagination } from "../../ui/pagination"


export function CardsPagination() {

    const pageNumbers = [1, 2, 3, '...', 8, 9, 10];

 
const dataList = [
  {text: "1",href:"#"},
  {text: "2",href:"#"},
  {text: "3",href:"#"},
  {text: "..."},
  {text: "8",href:"#"},
  {text: "9",href:"#"},
  {text: "10",href:"#",},
];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal text-primary">Pagination</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-m font-bold text-primary">Centered page numbers</div>
                <Pagination iconRight= "arrow-right-solid" borderColor="gray" activeButtonClass="border-indigo-500 text-indigo-600" previousButton="Previous" nextButton="Next" pageNumbers={pageNumbers} iconLeft="arrow-left-solid" withFooter={true} />

                <div className="text-m font-bold text-primary mt-6">Card footer with page buttons</div>
                <Pagination iconRight= "chevron-right-solid" textColor="gray" activeButtonClass="bg-indigo-600 text-white"  result={['Showing 1', 'to 10', 'of 97','results']}    dataList={dataList} iconLeft="chevron-left-solid" withNumberButton={true}/>

                <div className="text-m font-bold text-primary mt-6">Simple card footer</div>
                <Pagination showButton={true} dataList={dataList} textColor="gray" previousButton="Previous" nextButton="Next" result={['Showing 1', 'to 10', 'of 97','results']}  />
            </CardContent>
        </Card>
    )
}