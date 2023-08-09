"use client"

import * as React from "react"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form"

import { Button } from "@/registry/new-york/ui/button"
import { FcGoogle } from "react-icons/fc"
import { Input } from "@/registry/new-york/ui/input"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/registry/new-york/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {}

const formSchema = z.object({
  email: z.string().email(),
})

type FormSchema = z.infer<typeof formSchema>
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })
  const searchParams = useSearchParams()

  async function onSubmit({ email }: FormSchema) {
    setIsLoading(true)

    await signIn("email", {
      email: email.toLowerCase(),
      redirect: false,
      callbackUrl: searchParams?.get("from") || "/docs",
    })

    toast({
      title: "Welcome",
      description: "Please check your email for a link to verify your account.",
    })
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-6", className)}
        {...props}
      >
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-1">
                <FormLabel className="sr-only">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        type="button"
        disabled={isLoading}
        onClick={() => {
          setIsLoading(true)
          signIn("google", { callbackUrl: "/docs" })
        }}
      >
        <FcGoogle className="mr-2 h-4 w-4" />
        Google
      </Button>
    </Form>
  )
}
