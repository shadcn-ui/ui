"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/registry/default/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/default/ui/form"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectList,
  MultiSelectSearch,
  MultiSelectTrigger,
  MultiSelectValue,
  renderMultiSelectOptions,
  type MultiSelectOption,
  type MultiSelectOptionGroup,
} from "@/registry/default/ui/multi-select"
import { toast } from "@/registry/default/ui/use-toast"

const ALL_ITEMS = [
  { value: "react", label: "React", group: "React" },
  { value: "next", label: "Next.js", group: "React" },
  { value: "remix", label: "Remix", group: "React" },
  { value: "vue", label: "Vue", group: "Vue" },
  { value: "nuxt", label: "Nuxt.js", group: "Vue" },
  { value: "angular", label: "Angular", group: "Others" },
  { value: "svelte", label: "Svelte", group: "Others" },
]

const group = (
  options: Array<(typeof ALL_ITEMS)[number]>
): MultiSelectOptionGroup[] => {
  return options.reduce((acc, item) => {
    const group = acc.find((g) => g.heading === item.group)
    if (group) {
      group.children.push(item)
    } else {
      acc.push({ heading: item.group, children: [item] })
    }
    return acc
  }, [] as MultiSelectOptionGroup[])
}

const search = async (keyword?: string) => {
  if (!keyword) return group(ALL_ITEMS)
  const lowerKeyword = keyword.toLowerCase()
  const filtered = ALL_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(lowerKeyword)
  )

  if (!filtered.length) {
    return [
      {
        label: keyword,
        value: keyword,
      },
    ]
  }

  return group(filtered)
}

const FormSchema = z.object({
  frameworks: z.array(z.string(), {
    required_error: "Please select at least one framework.",
  }),
})

export default function MultiSelectFormDemo() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<MultiSelectOption[]>(() =>
    group(ALL_ITEMS)
  )

  const indexRef = useRef(0)

  const handleSearch = async (keyword: string) => {
    const index = ++indexRef.current
    setLoading(true)
    const newOptions = await search(keyword)
    if (indexRef.current === index) {
      setOptions(newOptions)
      setLoading(false)
    }
  }

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
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
          name="frameworks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frameworks</FormLabel>
              <MultiSelect
                onValueChange={field.onChange}
                defaultValue={field.value}
                onSearch={handleSearch}
              >
                <FormControl>
                  <MultiSelectTrigger className="w-96">
                    <MultiSelectValue placeholder="Select frameworks" />
                  </MultiSelectTrigger>
                </FormControl>
                <MultiSelectContent>
                  <MultiSelectSearch />
                  <MultiSelectList>
                    {loading ? null : renderMultiSelectOptions(options)}
                    <MultiSelectEmpty>
                      {loading ? "Loading..." : "No results found"}
                    </MultiSelectEmpty>
                  </MultiSelectList>
                </MultiSelectContent>
              </MultiSelect>
              <FormDescription>
                You can manage frameworks in{" "}
                <Link href="/examples/forms">framework settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
