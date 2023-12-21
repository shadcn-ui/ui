"use client"

import { useCallback, useState } from "react"
import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileWithPath } from "react-dropzone"
import { useForm } from "react-hook-form"
import { v4 as uuid } from "uuid"
import { z } from "zod"

import { packageZod } from "@/lib/validations/packages"
import { useFolder } from "@/hooks/use-folder-structure"
import { Tag, TagInput } from "@/components/tag-input"
import { Button } from "@/registry/new-york/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form"
import { Input } from "@/registry/new-york/ui/input"
import { Textarea } from "@/registry/new-york/ui/textarea"
import { toast } from "@/registry/new-york/ui/use-toast"
import { ui } from "@/registry/registry"

import { Dropzone } from "./drop-zone"
import { NpmRegisteryCheckTag } from "./npm-check-tag"

const allDependecies = ui.map((e) => ({ id: uuid(), text: e.name }))

const packageFormSchema = packageZod
  .omit({
    dependencies: true,
    registryDependencies: true,
    type: true,
  })
  .merge(
    z.object({
      dependencies: z
        .array(
          z.object({
            id: z.string(),
            text: z.string(),
          })
        )
        .optional(),
      registryDependencies: z
        .array(
          z.object({
            id: z.string(),
            text: z.string(),
          })
        )
        .optional(),
    })
  )

const packageFileZod = z.object({
  name: z.string(),
  dir: z.string().transform((e) => e.split("/").filter(e => e.length).slice(1).join("/")),
  content: z.string(),
})

type PackageFormValues = z.infer<typeof packageFormSchema>

// const defaultValues: Partial<PackageFormValues> = {
//   dependencies: [
//     {
//       text: "hi",
//       id: "sdksd",
//     },
//   ],
// }

export function PackageForm() {
  const [files, setFiles] = useFolder()
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    // defaultValues
  })
  const [tagsDependency, setTagsDependency] = useState<Tag[]>([])
  const [tagsRegister, setTagsRegister] = useState<Tag[]>([])
  const mutation = api.packages.createPackage.useMutation()

  const { setValue } = form

  function onSubmit(data: PackageFormValues) {

    const result: z.infer<typeof packageZod> = {
      name: data.name,
      description: data.description,
      files: files.files,
      dependencies: data.dependencies?.map((e) => e.text) ?? [],
      registryDependencies: data.registryDependencies?.map((e) => e.text) ?? [],
    }

    mutation.mutate(result, {
      onSuccess: () => {
        toast({
          title: "Package Created",
          description: "Package created successfully",
        })
      },
      onError: (err) => {
        console.log(err)
        type T = { message: string; code: string }
        const customError = JSON.parse(err.message) as T[]
        if (Array.isArray(customError)) {
          customError.forEach((e: T) => {
            toast({
              itemID: String(Math.random()),
              title: "Package Creation Failed",
              description: e.message,
              variant: "destructive",
            })
          })
        } else
          toast({
            title: "Package Creation Failed",
            description: JSON.stringify(err),
            variant: "destructive",
          })
      },
    })
  }

  const onDrop = useCallback((acceptedFiles: any) => {
    let fileSet: PackageFormValues["files"] = []
    acceptedFiles.forEach(async (file: Pretty<FileWithPath>) => {
      const data = {
        name: file.name,
        dir: file.path?.replace("/" + file.name, "") || "",
        content: await file.text(),
      }
      fileSet.push(packageFileZod.parse(data))
    })

    setFiles((f) => ({ ...f, files: fileSet }))
    setValue("files", fileSet)
  }, [])

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 space-y-10"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="eg: shadcn-ui-special-button"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      setFiles((f) => ({ ...f, name: e.target.value }))
                      setValue("name", e.target.value)
                    }}
                  />
                </FormControl>
                <FormDescription>
                  This is your unique public component name. It can be single
                  word or kebab-case. You can`&apos;t change this later.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={"files"}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Folder</FormLabel>
                <Dropzone multiple={true} onDrop={onDrop} {...field} />
                <FormDescription>
                  Upload your component root folder here. Root folder should
                  contain `index.tsx` or `index.ts` to import all the
                  sub-components and types.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="eg: Special component for all"
                    className="!h-36"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Description in 200 letter.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dependencies"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel className="text-left">NPM Dependencies</FormLabel>
                <FormControl>
                  <TagInput
                    {...field}
                    placeholder="Type a NPM package name, and press enter, eg: react-hook-form"
                    tags={tagsDependency}
                    className="sm:min-w-[450px]"
                    customTagRenderer={(tag, action) => (
                      <NpmRegisteryCheckTag tag={tag} action={action} />
                    )}
                    // direction="column"
                    textCase="lowercase"
                    setTags={(newTags) => {
                      setTagsDependency(newTags)
                      setValue("dependencies", newTags as [Tag, ...Tag[]])
                    }}
                  />
                </FormControl>
                <FormDescription>
                  These are the NPM Dependency you are using in component.
                  Dependencies will be automatically run `npm install` on
                  user&apos;s codebase. Type and press enter to verify if it is
                  available in NPM registry.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registryDependencies"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel className="text-left">
                  shadcn/ui Dependencies
                </FormLabel>
                <FormControl>
                  <TagInput
                    {...field}
                    placeholder="Enter a shadcn/ui Dependency"
                    tags={tagsRegister}
                    enableAutocomplete
                    autocompleteOptions={allDependecies}
                    className="sm:min-w-[450px]"
                    textCase="lowercase"
                    setTags={(newTags) => {
                      setTagsRegister(newTags)
                      setValue(
                        "registryDependencies",
                        newTags as [Tag, ...Tag[]]
                      )
                    }}
                  />
                </FormControl>
                <FormDescription>
                  These are the shadcn/ui Dependency you are using in component.
                  Dependencies will be automatically added to user&apos;s
                  codebase.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Publish Component</Button>
        </form>
      </Form>
    </>
  )
}
