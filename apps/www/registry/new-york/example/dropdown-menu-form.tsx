"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/registry/new-york/ui/button"
import {
    Form,
    FormDescription,
    FormField,
    FormLabel,
} from "@/registry/new-york/ui/form"
import { toast } from "@/registry/new-york/ui/use-toast"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/registry/new-york/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"


const regions = [
    {
        value: "allRegions",
        label: "All Regions"
    },
    {
        value: "india",
        label: "India"
    },
    {
        value: "usa",
        label: "USA"
    },
    {
        value: "europe",
        label: "Europe"
    },
    {
        value: "apac",
        label: "APAC"
    },
] as const


const FormSchema = z.object({
    regions: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one region.",
    }),
})


export default function DropdownMenuReactHookForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            regions: ["india", "usa"]
        }
    })


    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="mb-4">
                    <FormLabel className="text-base">Regions</FormLabel>
                    <FormDescription>
                        Select the regions.
                    </FormDescription>
                </div>
                <FormField
                    control={form.control}
                    name="regions"
                    render={({ field }) => {
                        return <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex flex-row gap-2">All Regions
                                    <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                {
                                    regions.map((region) => {
                                        return <DropdownMenuCheckboxItem
                                            key={region.value}
                                            checked={field.value?.includes(region.value)}
                                            onCheckedChange={(checked) => {
                                                return checked ? field.onChange([...field.value, region.value]) : field.onChange(field.value?.filter((value) => value != region.value))
                                            }}
                                        >
                                            {region.label}
                                        </DropdownMenuCheckboxItem>
                                    })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    }}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form >
    )
}
