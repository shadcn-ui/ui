"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Stepper } from "@/registry/new-york-v4/ui/stepper"
import { StepperItem } from "@/registry/new-york-v4/ui/stepper-item"

const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const additionalDetailsSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  country: z.string().min(1, "Please select a country"),
})

const confirmationSchema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
})

type PersonalInfo = z.infer<typeof personalInfoSchema>
type AdditionalDetails = z.infer<typeof additionalDetailsSchema>
type Confirmation = z.infer<typeof confirmationSchema>

export default function StepperRegistrationFlow() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState<{
    personalInfo?: PersonalInfo
    additionalDetails?: AdditionalDetails
  }>({})

  const personalInfoForm = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const additionalDetailsForm = useForm<AdditionalDetails>({
    resolver: zodResolver(additionalDetailsSchema),
    defaultValues: {
      phone: "",
      dateOfBirth: "",
      country: "",
    },
  })

  const confirmationForm = useForm<Confirmation>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: {
      termsAccepted: false,
    },
  })

  const onPersonalInfoSubmit = (data: PersonalInfo) => {
    setFormData((prev) => ({ ...prev, personalInfo: data }))
    setCurrentStep(1)
  }

  const onAdditionalDetailsSubmit = (data: AdditionalDetails) => {
    setFormData((prev) => ({ ...prev, additionalDetails: data }))
    setCurrentStep(2)
  }

  const onConfirmationSubmit = (data: Confirmation) => {
    console.log("Form submitted:", { ...formData, ...data })
    // Handle final submission
    alert("Registration completed successfully!")
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-3">
      <Stepper currentStep={currentStep}>
        <StepperItem title="Personal Info" description="Basic information" />
        <StepperItem
          title="Additional Details"
          description="Contact & location"
        />
        <StepperItem title="Confirm" description="Review & submit" />
      </Stepper>

      <div className="rounded-lg border p-4 sm:p-6">
        {currentStep === 0 && (
          <form
            onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...personalInfoForm.register("name")}
              />
              {personalInfoForm.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {personalInfoForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...personalInfoForm.register("email")}
              />
              {personalInfoForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {personalInfoForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...personalInfoForm.register("password")}
              />
              {personalInfoForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {personalInfoForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit">Next Step</Button>
            </div>
          </form>
        )}

        {currentStep === 1 && (
          <form
            onSubmit={additionalDetailsForm.handleSubmit(
              onAdditionalDetailsSubmit
            )}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                {...additionalDetailsForm.register("phone")}
              />
              {additionalDetailsForm.formState.errors.phone && (
                <p className="text-sm text-destructive">
                  {additionalDetailsForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...additionalDetailsForm.register("dateOfBirth")}
              />
              {additionalDetailsForm.formState.errors.dateOfBirth && (
                <p className="text-sm text-destructive">
                  {additionalDetailsForm.formState.errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                onValueChange={(value) =>
                  additionalDetailsForm.setValue("country", value)
                }
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                </SelectContent>
              </Select>
              {additionalDetailsForm.formState.errors.country && (
                <p className="text-sm text-destructive">
                  {additionalDetailsForm.formState.errors.country.message}
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(0)}
              >
                Previous
              </Button>
              <Button type="submit">Next Step</Button>
            </div>
          </form>
        )}

        {currentStep === 2 && (
          <form
            onSubmit={confirmationForm.handleSubmit(onConfirmationSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="font-semibold">Review Your Information</h3>

              <div className="space-y-2 rounded-lg bg-muted p-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">
                      {formData.personalInfo?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">
                      {formData.personalInfo?.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">
                      {formData.additionalDetails?.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Date of Birth:
                    </span>
                    <span className="font-medium">
                      {formData.additionalDetails?.dateOfBirth}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Country:</span>
                    <span className="font-medium">
                      {formData.additionalDetails?.country}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                {...confirmationForm.register("termsAccepted")}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
                </Label>
                <p className="text-sm text-muted-foreground">
                  You agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
            {confirmationForm.formState.errors.termsAccepted && (
              <p className="text-sm text-destructive">
                {confirmationForm.formState.errors.termsAccepted.message}
              </p>
            )}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Previous
              </Button>
              <Button type="submit">Complete Registration</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}