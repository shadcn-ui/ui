import * as React from "react"
import { StepNavigator } from "@/registry/new-york-v4/blocks/step-navigator-01/step-navigator"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/registry/new-york-v4/ui/radio-group"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Field } from "@/registry/new-york-v4/ui/field"

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  plan: string
  terms: boolean
}

export function StepNavigatorDemo() {
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    plan: "starter",
    terms: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      plan: value
    }))
  }

  const steps = [
    {
      id: "step-1",
      title: "Personal Information",
      description: "Enter your personal details to create your account.",
      content: (
        <div className="space-y-4">
          <Field>
            <Field.Label htmlFor="name">Full Name</Field.Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
            />
          </Field>
          <Field>
            <Field.Label htmlFor="email">Email Address</Field.Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
            />
          </Field>
        </div>
      ),
      validation: () => {
        return formData.name.trim() !== "" && formData.email.trim() !== ""
      }
    },
    {
      id: "step-2",
      title: "Account Setup",
      description: "Create a password for your account.",
      content: (
        <div className="space-y-4">
          <Field>
            <Field.Label htmlFor="password">Password</Field.Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
          </Field>
          <Field>
            <Field.Label htmlFor="confirmPassword">Confirm Password</Field.Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
            />
          </Field>
        </div>
      ),
      validation: () => {
        return (
          formData.password.trim() !== "" &&
          formData.confirmPassword.trim() !== "" &&
          formData.password === formData.confirmPassword
        )
      }
    },
    {
      id: "step-3",
      title: "Choose Plan",
      description: "Select a plan that best fits your needs.",
      content: (
        <div className="space-y-4">
          <RadioGroup
            defaultValue={formData.plan}
            onValueChange={handleRadioChange}
            className="space-y-3"
          >
            <Field>
              <Field.Label>
                <RadioGroupItem value="starter" />
                <div className="ml-2">
                  <div className="font-medium">Starter Plan</div>
                  <div className="text-sm text-muted-foreground">
                    $10/month - For small businesses
                  </div>
                </div>
              </Field.Label>
            </Field>
            <Field>
              <Field.Label>
                <RadioGroupItem value="pro" />
                <div className="ml-2">
                  <div className="font-medium">Pro Plan</div>
                  <div className="text-sm text-muted-foreground">
                    $20/month - More features and storage
                  </div>
                </div>
              </Field.Label>
            </Field>
            <Field>
              <Field.Label>
                <RadioGroupItem value="enterprise" />
                <div className="ml-2">
                  <div className="font-medium">Enterprise Plan</div>
                  <div className="text-sm text-muted-foreground">
                    Custom pricing - For large organizations
                  </div>
                </div>
              </Field.Label>
            </Field>
          </RadioGroup>
        </div>
      )
    },
    {
      id: "step-4",
      title: "Review & Submit",
      description: "Review your information before submitting.",
      content: (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Personal Information</h3>
            <div className="text-sm space-y-1">
              <p>Name: {formData.name}</p>
              <p>Email: {formData.email}</p>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Account</h3>
            <div className="text-sm">
              <p>Password: ••••••••</p>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Plan</h3>
            <div className="text-sm">
              <p>{formData.plan.charAt(0).toUpperCase() + formData.plan.slice(1)} Plan</p>
            </div>
          </div>
          <Field>
            <Field.Label>
              <Checkbox
                name="terms"
                checked={formData.terms}
                onChange={handleInputChange}
              />
              <span className="ml-2">I agree to the terms and conditions</span>
            </Field.Label>
          </Field>
        </div>
      ),
      validation: () => {
        return formData.terms
      }
    }
  ]

  const handleComplete = () => {
    alert("Form submitted successfully!")
    console.log("Form data:", formData)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Step Navigator Demo</h1>
      <StepNavigator steps={steps} onComplete={handleComplete} />
    </div>
  )
}
