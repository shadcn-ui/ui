"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/registry/default/ui/button"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/registry/default/ui/form"
import { MultiSelect } from "@/registry/default/ui/multi-select"
import { toast } from "@/registry/default/ui/use-toast"

const FormSchema = z.object({
    framework: z.array(z.record(z.string())).min(2, "Select at least 2 frameworks"),
})

const frameworks = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
    {
        value: "wordpress",
        label: "WordPress",
    },
    {
        value: "express.js",
        label: "Express.js",
    }
]

export default function SelectForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            framework: [{
                value: "next.js",
                label: "Next.js",
            }, {
                value: "nuxt.js",
                label: "Nuxt.js",
            }]
        },
        mode: "onSubmit"
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="framework"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select Frameworks</FormLabel>
                            <MultiSelect
                                selected={field.value}
                                options={frameworks}
                                {...field}
                                className="sm:w-[510px]"
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
