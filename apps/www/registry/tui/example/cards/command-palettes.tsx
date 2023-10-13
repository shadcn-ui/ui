"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/registry/tui/ui/card"
import React, { ChangeEvent, useEffect, useState } from "react";
import { CommandPalettes, DataItem, ItemList, ListItem, PersonList } from "../../ui/command-palettes";
import { IconType } from "../../ui/icon";

export function CardsCommandPalettes() {
    
    const person:PersonList[] =[
        { id: 1, name: 'Leslie Alexander', url: '#' },
        { id: 2, name: 'Michael Foster', url: '#' },
        { id: 3, name: 'Dries Vincent', url: '#' },
        { id: 4, name: 'Lindsay Walton', url: '#' },
    ]

   
    const lstItems: ItemList[] = [
        { title: "Text", description: "Add freeform text with basic formatting options.", icon: "pen-to-square-regular", backgroundStyle: "bg-indigo-500 h-10 w-10",url:'#' },
        { title: "Video", description: "Add a video from Youtube, Vimeo or other services.", icon: "video-regular", backgroundStyle: "bg-blue-500 h-10 w-10",url:'#' },
        { title: "Page", description: "Add a new blank page to your project.", icon: "file-regular", backgroundStyle: "bg-violet-500 h-10 w-10",url:'#' }

    ];

    const itemList: ListItem[] = [
        { icon: "file-plus-regular", keyboardName: "⌘N", command: "Add New file...",url:'#' },
        { icon: "folder-plus-regular", keyboardName: "⌘F", command: "Add new Folder...",url:'#' },
        { icon: "hashtag-regular", keyboardName: "⌘H", command: "Add hashtag...",url:'#' },
        { icon: "tag-regular", keyboardName: "⌘L", command: "Add label...",url:'#' }

    ];

    const dataList: DataItem[] = [
        {
            icon: "chevron-right-regular", name: "Floyd Miles", position: "Product Development", imageStyle: "h-16 w-16",
            phone: 8814608515, url: "https://example.com", email: "flyod@example.com",
            image: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
            icon: "chevron-right-regular", name: "Tom Cook", position: "Designer", imageStyle: "h-16 w-16",
            phone: 6403094790, url: "https://example.com", email: "tom@example.com",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
            icon: "chevron-right-regular", name: "Courtney Henry", position: "Manager", imageStyle: "h-16 w-16",
            phone: 7133301164, url: "https://example.com", email: "henry@example.com",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
            icon: "chevron-right-regular", name: "Dries Vincent", position: "Front-end Developer", imageStyle: "h-16 w-16",
            phone: 6285949386, url: "https://example.com", email: "dries@example.com",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
            icon: "chevron-right-regular", name: "Kristin Watson", position: "Back-end Developer", imageStyle: "h-16 w-16",
            phone: 7354569654, url: "https://example.com", email: "kristin@example.com",
            image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }

    ];
    const [searchedList, setSearchedList] = useState<any>([]);

    const handleSearch = (searchQuery: string) => {
        const newSearchedNames = person.filter((item: PersonList) => item.name?.toLowerCase().includes(searchQuery.toLowerCase()));
        setSearchedList(newSearchedNames);
    };
    const handleSearchNameList = (searchQuery: string) => {
        const newSearchedItemList = dataList.filter((item: DataItem) => item.name?.toLowerCase().includes(searchQuery.toLowerCase()));
        setSearchedList(newSearchedItemList);
    };
    const handleSearchDataItem = (searchQuery: string) => {
        const newSearchedDataItem = itemList.filter((item: ListItem) => item.command?.toLowerCase().includes(searchQuery.toLowerCase()));
        setSearchedList(newSearchedDataItem);
    };
    const handleSearchData = (searchQuery: string) => {
        const newSearchedData = lstItems.filter((item: ItemList) => item.title?.toLowerCase().includes(searchQuery.toLowerCase()));
        setSearchedList(newSearchedData);
    };
    return (

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal text-primary">Command Palettes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="font-bold text-primary">Simple</div>
                    <CommandPalettes description="withoutDescriptionText" noFoundCommentText="No data found." searchedList={searchedList} onSearch={handleSearch} />

                    <div className="font-bold text-primary">Simple with padding</div>
                    <CommandPalettes description="withoutDescriptionText" noFoundCommentText="No data found using that search term." icon="user-group-regular" withInputIcon={false} searchedList={searchedList} onSearch={handleSearch} />

                    <div className="font-bold text-primary">With images and descriptions</div>
                    <CommandPalettes description="withDescriptionText" noFoundCommentText="No components found for this search term. Please try again." noResultText="No Result" errorIcon="circle-exclamation-regular" searchedList={searchedList} onSearch={handleSearchData} />

                    <div className="font-bold text-primary">With icons</div>
                    <CommandPalettes folderIcon="folder-regular" noFoundIcon="folder-open-solid" iconStyle="" noFoundCommentText="We couldn't find any data with that term. Please try again." titleText="Workflow Inc. / Website Redesign" haskeyboard={true} searchedList={searchedList} onSearch={handleSearchDataItem} />

                    <div className="font-bold text-primary">Semi-transparent with icons</div>
                    <CommandPalettes folderIcon="folder-regular" noFoundIcon="folder-open-solid" noFoundCommentText="We couldn't find any data with that term. Please try again." titleText="Workflow Inc. / Website Redesign" haskeyboard={true}  searchedList={searchedList} onSearch={handleSearchDataItem} variant="outline" />

                    <div className="font-bold text-primary">Dark with icons</div>
                    <CommandPalettes  noFoundCommentText="We couldn't find any data with that term. Please try again." folderIcon="folder-regular"  titleText="Workflow Inc. / Website Redesign" searchNameText="Recent Search" haskeyboard={true} noFoundIcon="folder-open-solid"  searchedList={searchedList} onSearch={handleSearchDataItem} variant="dark" className="text-gray-500" backgroundColor="gray" />

                    <div className="font-bold text-primary">With groups</div>
                    <CommandPalettes listTitleName="Client" titleText="Workflow Inc." projectListName="Project" haskeyboard={true} iconStyle="h-5 w-5" noFoundIcon="folder-open-solid" noFoundCommentText="We couldn't find any data with that term. Please try again." variant="accent"  searchedList={searchedList} onSearch={handleSearchDataItem} />

                    <div className="font-bold text-primary">with Footer</div>
                    <CommandPalettes hasFooter={true} haskeyboard={true} errorIcon="circle-exclamation-regular" icon="hashtag-solid" noFoundIcon="folder-open-solid" noFoundCommentText="We couldn't find any projects with that term. Please try again." variant="accent"  searchedList={searchedList} onSearch={handleSearchDataItem} />

                    <div className="font-bold text-primary">With preview</div>
                    <CommandPalettes withPreview={true} errorIcon="circle-exclamation-regular" noFoundCommentText="We couldn't find any projects with that term. Please try again." noResultText="No People Found" buttonName="Send Message" searchedList={searchedList} onSearch={handleSearchNameList} />
                </div>
            </CardContent>
        </Card>
    )
}