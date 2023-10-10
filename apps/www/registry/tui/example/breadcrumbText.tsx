import { Breadcrumbs } from "../ui/breadcrumb"
export const BreadcrumbText = () => {
    const firstItem = [
        { icon: 'house-solid', text: "Home", href: '#', separatorIcon: "chevron-right-thin", display: "onlyText" },
        { icon: "folder-solid", text: 'Projects', href: '#', separatorIcon: "chevron-right-thin", display: "onlyText" },
        { icon: "folder-open-solid", text: 'Project Nero', href: '#', display: "onlyText" },
    ]
    const secondItem = [
        { icon: 'house-solid', text: "Home", href: '#', separatorIcon: "chevron-right-thin", display: "onlyText" },
        { icon: "folder-solid", text: 'Projects', href: '#', separatorIcon: "chevron-right-thin", display: "onlyText" },
        { icon: "folder-open-solid", text: 'Project Nero', href: '#', display: "onlyText" },
    ]

    const thirdItem = [
        { icon: 'house-solid', text: "Home", href: '#', separatorIcon: "slash-forward-thin", display: "onlyText" },
        { icon: "folder-solid", text: 'Projects', href: '#', separatorIcon: "slash-forward-thin", display: "onlyText" },
        { icon: "folder-open-solid", text: 'Project Nero', href: '#', display: "onlyText" },
    ]
    return (
        <>
            <h2 className="text-m text-primary pt-3">BreadCrumb With Text</h2>
            <div className="text-m font-bold text-primary">Contained</div>
            <Breadcrumbs dataItem={firstItem} contained={true} iconStyle="h-5 w-5 text-gray-500" separatorIconStyle="h-full w-6 flex-shrink-0 text-gray-200" textColor="gray" />

            <div className="text-m pt-11 font-bold text-primary">Full Width Bar</div>
            <Breadcrumbs dataItem={firstItem} fullWidthContained={true} iconStyle="h-5 w-5 text-gray-500" separatorIconStyle="h-full w-6 flex-shrink-0 text-gray-200" textColor="gray" size="default" />

            <div className="text-m pt-11 font-bold text-primary">Simple With Chevron</div>
            <Breadcrumbs dataItem={secondItem} withChevronSeparator={true} iconStyle="h-5 w-5 text-gray-500" separatorIconStyle="h-4 w-4 flex-shrink-0 text-gray-400" textColor="gray" />

            <div className="text-m pt-11 font-bold text-primary">Simple with slashes</div>
            <Breadcrumbs dataItem={thirdItem} withSlashSeparator={true} iconStyle="h-5 w-5 text-gray-500" separatorIconStyle="h-4 w-4 flex-shrink-0 text-gray-400" textColor="gray" />
        </>


    )
}