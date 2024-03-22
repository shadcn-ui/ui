"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import { Input } from "@/registry/default/ui/input"
import { Step, Stepper, useStepper } from "@/registry/default/ui/stepper"
import { toast } from "@/registry/default/ui/use-toast"

const steps = [
  { id: 0, label: "Step 1", description: "Description 1" },
  { id: 1, label: "Step 2", description: "Description 2" },
]

export default function StepperDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper variant="circles-alt" initialStep={0} steps={steps}>
        {steps.map((step, index) => {
          if (index === 0) {
            return (
              <Step
                key={step.id}
                label={step.label}
                description={step.description}
              >
                <FirstStepForm />
              </Step>
            )
          }
          return (
            <Step
              key={step.id}
              label={step.label}
              description={step.description}
            >
              <SecondStepForm />
            </Step>
          )
        })}
        <MyStepperFooter />
      </Stepper>
    </div>
  )
}

const FirstFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

function FirstStepForm() {
  const { nextStep } = useStepper()

  const form = useForm<z.infer<typeof FirstFormSchema>>({
    resolver: zodResolver(FirstFormSchema),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit(data: z.infer<typeof FirstFormSchema>) {
    nextStep()
    toast({
      title: "First step submitted!",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepperFormActions />
      </form>
    </Form>
  )
}

const SecondFormSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

function SecondStepForm() {
  const { nextStep } = useStepper()

  const form = useForm<z.infer<typeof SecondFormSchema>>({
    resolver: zodResolver(SecondFormSchema),
    defaultValues: {
      password: "",
    },
  })

  function onSubmit(data: z.infer<typeof SecondFormSchema>) {
    nextStep()
    toast({
      title: "Second step submitted!",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>This is your private password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepperFormActions />
      </form>
    </Form>
  )
}

function StepperFormActions() {
  const {
    nextStep,
    prevStep,
    reset,
    activeStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptional,
  } = useStepper()

  return (
    <div className="w-full flex justify-end gap-2">
      {hasCompletedAllSteps ? (
        <Button size="sm" onClick={reset}>
          Reset
        </Button>
      ) : (
        <>
          <Button
            disabled={activeStep === 0}
            onClick={prevStep}
            size="sm"
            variant="secondary"
          >
            Prev
          </Button>
          <Button size="sm">
            {isLastStep ? "Finish" : isOptional ? "Skip" : "Next"}
          </Button>
        </>
      )}
    </div>
  )
}

function MyStepperFooter() {
  const { activeStep, reset, steps } = useStepper()

  if (activeStep !== steps.length) {
    return null
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button onClick={reset}>Reset Stepper with Form</Button>
    </div>
  )
}
