"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/registry/tui/ui/card"
import React, { ChangeEvent, useState } from "react";
import { CommandPalettes } from "../../ui/command-palettes";
import { IconType } from "../../ui/icon";

export function CardsCommandPalettes() {
    const names = ["Leslie Alexander", "Michael Foster", "Dries Vincent", "Lindsay Walton"];
    
    interface ItemList {
        title: string;
        description: string;
        icon: IconType;
        backgroundStyle: string;
    }
    interface ListItem{
        icon?:IconType;
        keyboardName?:string;
        command?:string;
    }
    interface DataItem {
        name?: string;
        image?: string;
        position?: string;
        phone?: number;
        url?: string;
        email?: string;
        imageStyle?:string;
        icon?:IconType;
    }
    const lstItems:ItemList[] = [
        { title: "Text", description: "Add freeform text with basic formatting options.", icon: "pen-to-square-regular", backgroundStyle: "bg-indigo-500 h-10 w-10" },
        { title: "Video", description: "Add a video from Youtube, Vimeo or other services.", icon: "video-regular", backgroundStyle: "bg-blue-500 h-10 w-10" },
        { title: "Page", description: "Add a new blank page to your project.", icon: "file-regular", backgroundStyle: "bg-violet-500 h-10 w-10" }

    ];

    const itemList:ListItem[] = [
        { icon: "file-plus-regular", keyboardName: "⌘N", command: "Add New file..." },
        { icon: "folder-plus-regular", keyboardName: "⌘F", command: "Add new Folder..." },
        { icon: "hashtag-regular", keyboardName: "⌘H", command: "Add hashtag..." },
        { icon: "tag-regular", keyboardName: "⌘L", command: "Add label..." }

    ];

    const dataList:DataItem[] = [
        {
            icon: "chevron-right-regular", name: "Floyd Miles", position: "Product Development", imageStyle:"h-16 w-16",
            phone: 8814608515, url: "https://example.com", email: "flyod@example.com",
            image: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
            icon: "chevron-right-regular", name: "Tom Cook", position: "Designer", imageStyle:"h-16 w-16",
            phone: 6403094790, url: "https://example.com", email: "tom@example.com",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
            icon: "chevron-right-regular", name: "Courtney Henry", position: "Manager", imageStyle:"h-16 w-16",
            phone: 7133301164, url: "https://example.com", email: "henry@example.com",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
            icon: "chevron-right-regular", name: "Dries Vincent", position: "Front-end Developer", imageStyle:"h-16 w-16",
            phone: 6285949386, url: "https://example.com", email: "dries@example.com",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
            icon: "chevron-right-regular", name: "Kristin Watson", position: "Back-end Developer", imageStyle:"h-16 w-16",
            phone: 7354569654, url: "https://example.com", email: "kristin@example.com",
            image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }

    ];
    const [firstInputValue, setFirstInputValue] = useState('');
    const [listInputValue, setListInputValue] = useState('');
    const [listItemInputValue, setListItemInputValue] = useState('');
    const [dataItemInputValue, setDataInputValue] = useState('');

    const nameHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFirstInputValue(e.target.value);
    }

    const listHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setListInputValue(e.target.value);
    }

    const listItemHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setListItemInputValue(e.target.value);
    }

    const dataItemHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDataInputValue(e.target.value);
    }

    const filteredNames = names.filter((name:string) => name.toLowerCase().includes(firstInputValue.toLowerCase()));
    const filteredListName = lstItems?.filter((item: ItemList) => item.title.toLowerCase().includes(listInputValue.toLowerCase()));
    const filteredListItem = itemList?.filter((item: ListItem) => item.command?.toLowerCase().includes(listItemInputValue.toLowerCase()));
    const filteredDataList = dataList?.filter((item: DataItem) => item.name?.toLowerCase().includes(dataItemInputValue.toLowerCase()));
    return (
        
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-normal text-primary">Command Palettes</CardTitle>
                </CardHeader>
                <CardContent>
                    
                    <div className="text-m font-bold text-primary">Simple</div>
                    <CommandPalettes description="withoutDescription" noFoundCommentText="No people found." withIcon={true} hoverColor="indigo" className="text-gray-800" filteredList={filteredNames} inputValue={firstInputValue} handleChange={nameHandleChange} />

                    <div className=" mt-3 text-m font-bold text-primary">Simple with padding</div>
                    <CommandPalettes description="withoutDescription" noFoundCommentText="No people found using that search term." icon="user-group-regular" hoverColor="indigo" className="text-gray-800" filteredList={filteredNames} inputValue={firstInputValue} handleChange={nameHandleChange}  />

                    <div className=" mt-3 text-m font-bold text-primary">With images and descriptions</div>
                    <CommandPalettes description="withDescription" hoverColor="indigo" icon="user-group-regular" errorIcon="circle-exclamation-regular" textColor="gray" iconStyle="text-white" noFoundCommentText="No components found for this search term. Please try again." noResultText="No Result" withIcon={true} filteredList={filteredListName} inputValue={listInputValue} handleChange={listHandleChange} />

                    <div className=" mt-3 text-m font-bold text-primary">With icons</div>
                    <CommandPalettes folderIcon="folder-regular" noFoundIcon="folder-open-solid" iconStyle="h-5 w-5" noFoundCommentText="We couldn't find any projects with that term. Please try again." searchName="Recent Search" titleText="Workflow Inc. / Website Redesign" hoverColor="indigo" haskeyboard={true} withIcon={true} filteredList={filteredListItem} inputValue={listItemInputValue} handleChange={listItemHandleChange} />

                    <div className=" mt-3 text-m font-bold text-primary">Semi-transparent with icons</div>
                    <CommandPalettes  folderIcon="folder-regular" titleText="Workflow Inc. / Website Redesign"  searchName="Recent Search" variant="outline" haskeyboard={true} withIcon={true} iconStyle="h-5 w-5" noFoundIcon="folder-open-solid" noFoundCommentText="We couldn't find any projects with that term. Please try again." filteredList={filteredListItem} inputValue={listItemInputValue} handleChange={listItemHandleChange} />

                    <div className=" mt-3 text-m font-bold text-primary">Dark with icons</div>
                    <CommandPalettes  className=" border-none text-gray-500 hover:text-white" backgroundColor="gray" folderIcon="folder-regular"  titleText="Workflow Inc. / Website Redesign" searchName="Recent Search" color="gray" haskeyboard={true} withIcon={true} iconStyle="h-5 w-5" noFoundIcon="folder-open-solid" noFoundCommentText="We couldn't find any projects with that term. Please try again." filteredList={filteredListItem} inputValue={listItemInputValue} handleChange={listItemHandleChange} />

                    <div className=" mt-3 text-m font-bold text-primary">With groups</div>
                    <CommandPalettes  listTitleName="Client" titleText="Workflow Inc." projectNameListName="Project" haskeyboard={true} withIcon={true} hoverColor="indigo" textColor="gray" iconStyle="h-5 w-5" noFoundIcon="folder-open-solid" noFoundCommentText="We couldn't find any projects with that term. Please try again." variant="secondary" filteredList={filteredListItem} inputValue={listItemInputValue} handleChange={listItemHandleChange} />


                    <div className=" mt-3 text-m font-bold text-primary">with Footer</div>
                    <CommandPalettes  footer={true} projectNameListName="Projects" haskeyboard={true} withIcon={true} errorIcon="circle-exclamation-regular" icon="hashtag-solid" iconStyle="w-3 h-3 border-gray-400 bg-white"  noFoundIcon="folder-open-solid"  noFoundCommentText="We couldn't find any projects with that term. Please try again."  hoverColor="indigo" variant="secondary" filteredList={filteredListItem} inputValue={listItemInputValue} handleChange={listItemHandleChange} />

                    <div className=" mt-3 text-m font-bold text-primary">With preview</div>
                    <CommandPalettes  withIcon={true} withPreview={true} errorIcon="circle-exclamation-regular" noFoundCommentText="We couldn't find any projects with that term. Please try again." noResultText="No People Found" buttonName="Send Message" imageStyle="h-6 w-6" hoverColor="gray" filteredList={filteredDataList} inputValue={dataItemInputValue} handleChange={dataItemHandleChange}/>
                </CardContent>
            </Card>
        </div>
    )
}