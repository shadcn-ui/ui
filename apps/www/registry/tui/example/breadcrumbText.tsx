import { BreadcrumItem, Breadcrumb } from "../ui/breadcrumb"
export const BreadcrumbText = () => {
    const firstItem: BreadcrumItem[] = [
        { icon: 'house-solid', text: "Home", href: '#', display: "onlyText" },
        { icon: "folder-solid", text: 'Projects', href: '#', display: "onlyText" },
        { icon: "folder-open-solid", text: 'Project Nero', href: '#', display: "onlyText" },
    ]
    const secondItem: BreadcrumItem[] = [
        { icon: 'house-solid', text: "Home", href: '#', display: "onlyText" },
        { icon: "folder-solid", text: 'Projects', href: '#', display: "onlyText" },
        { icon: "folder-open-solid", text: 'Project Nero', href: '#', display: "onlyText" },
    ]

    const thirdItem: BreadcrumItem[] = [
        { icon: 'house-solid', text: "Home", href: '#', display: "onlyText" },
        { icon: "folder-solid", text: 'Projects', href: '#', display: "onlyText" },
        { icon: "folder-open-solid", text: 'Project Nero', href: '#', display: "onlyText" },
    ]
    return (
        <>
            <h2 className="text-primary mt-8">BreadCrumb With Text</h2>
            <div className="space-y-7 space-x-7">
                <div className="font-bold text-primary">Contained</div>
                <Breadcrumb items={firstItem} BreadcrumbStyle="shadow" />

                <div className="font-bold text-primary">Full Width Bar</div>
                <Breadcrumb items={firstItem} BreadcrumbStyle="fullWidth" />

                <div className="font-bold text-primary">Simple With Chevron</div>
                <Breadcrumb items={secondItem} itemIconStyle="h-4 w-4" />

                <div className="font-bold text-primary">Simple with slashes</div>
                <Breadcrumb items={thirdItem} itemIcon="slash-forward-thin" itemIconStyle="h-4 w-4" />
            </div>
        </>
    )
}