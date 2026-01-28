"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york-v4/ui/form"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Step, Stepper, StepTitle } from "@/registry/new-york-v4/ui/stepper"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(1, "Please select a state"),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function StepperForm() {
  const [currentStep, setCurrentStep] = React.useState(0)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      notes: "",
    },
    mode: "onTouched",
  })

  const steps = ["Personal Info", "Address", "Review"]

  const validateStep = async (step: number) => {
    if (step === 0) {
      return form.trigger(["firstName", "lastName", "email"])
    }
    if (step === 1) {
      return form.trigger(["address", "city", "state"])
    }
    return true
  }

  const nextStep = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 2))
    }
  }

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data)
  }

  const values = form.watch()

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <Stepper currentStep={currentStep} className="mb-4">
          {steps.map((title, index) => (
            <Step key={title} step={index} clickable={false}>
              <StepTitle>{title}</StepTitle>
            </Step>
          ))}
        </Stepper>
        <CardTitle>
          {currentStep === 0 && "Personal Information"}
          {currentStep === 1 && "Address Details"}
          {currentStep === 2 && "Review & Submit"}
        </CardTitle>
        <CardDescription>
          {currentStep === 0 && "Enter your personal details."}
          {currentStep === 1 && "Where should we deliver?"}
          {currentStep === 2 && "Review your information before submitting."}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-6 pb-8">
            {currentStep === 0 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="min-h-[72px]">
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="min-h-[72px]">
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="min-h-[72px]">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {currentStep === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="min-h-[72px]">
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="min-h-[72px]">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="San Francisco" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="min-h-[72px]">
                        <FormLabel>State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ca">California</SelectItem>
                            <SelectItem value="ny">New York</SelectItem>
                            <SelectItem value="tx">Texas</SelectItem>
                            <SelectItem value="fl">Florida</SelectItem>
                            <SelectItem value="wa">Washington</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            {currentStep === 2 && (
              <>
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 text-sm font-medium">
                    Personal Information
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {values.firstName} {values.lastName}
                    <br />
                    {values.email}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 text-sm font-medium">Shipping Address</h4>
                  <p className="text-muted-foreground text-sm">
                    {values.address}
                    <br />
                    {values.city}, {values.state.toUpperCase()}
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special instructions..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            {currentStep < 2 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
