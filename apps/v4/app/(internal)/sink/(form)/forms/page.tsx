"use client"

import { useState } from "react"
import {
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import { ButtonGroup } from "@/registry/new-york-v4/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/registry/new-york-v4/ui/field"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/registry/new-york-v4/ui/input-group"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/new-york-v4/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

export default function FormsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    experience: "",
    bio: "",
    newsletter: false,
    notifications: "email",
    country: "",
    timezone: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Form Examples</h1>
        <p className="text-muted-foreground">
          Comprehensive examples showcasing shadcn/ui form components.
        </p>
      </div>

      {/* Basic Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile Form</CardTitle>
          <CardDescription>
            A comprehensive form demonstrating various field types and input
            components.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
              {/* Personal Information Section */}
              <FieldSet>
                <FieldLegend>Personal Information</FieldLegend>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="John"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Doe"
                      required
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <InputGroup>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="john@example.com"
                      required
                    />
                    <InputGroupAddon>
                      <MailIcon className="size-4" />
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    We&apos;ll use this to contact you. We will not share your
                    email with anyone else.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <PhoneIcon className="size-4" />
                    </InputGroupAddon>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </InputGroup>
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <InputGroup>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Enter your password"
                      required
                    />
                    <InputGroupButton
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="size-4" />
                      ) : (
                        <EyeIcon className="size-4" />
                      )}
                    </InputGroupButton>
                  </InputGroup>
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="Confirm your password"
                    required
                  />
                </Field>
              </FieldSet>

              <FieldSeparator />

              {/* Professional Information Section */}
              <FieldSet>
                <FieldLegend>Professional Information</FieldLegend>

                <Field>
                  <FieldLabel htmlFor="role">Role</FieldLabel>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Years of Experience</FieldLabel>
                  <RadioGroup
                    value={formData.experience}
                    onValueChange={(value) =>
                      handleInputChange("experience", value)
                    }
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0-1" id="exp-0-1" />
                      <Label htmlFor="exp-0-1">0-1 years</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2-3" id="exp-2-3" />
                      <Label htmlFor="exp-2-3">2-3 years</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4-6" id="exp-4-6" />
                      <Label htmlFor="exp-4-6">4-6 years</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="7-10" id="exp-7-10" />
                      <Label htmlFor="exp-7-10">7-10 years</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10+" id="exp-10+" />
                      <Label htmlFor="exp-10+">10+ years</Label>
                    </div>
                  </RadioGroup>
                </Field>

                <Field>
                  <FieldLabel htmlFor="bio">Bio</FieldLabel>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="min-h-[100px]"
                  />
                  <FieldDescription>
                    A brief description about yourself and your professional
                    background.
                  </FieldDescription>
                </Field>
              </FieldSet>

              <FieldSeparator />

              {/* Preferences Section */}
              <FieldSet>
                <FieldLegend>Preferences</FieldLegend>

                <Field>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.newsletter}
                      onCheckedChange={(checked) =>
                        handleInputChange("newsletter", checked as boolean)
                      }
                    />
                    <Label htmlFor="newsletter">
                      Subscribe to our newsletter
                    </Label>
                  </div>
                  <FieldDescription>
                    Get updates about new features and product announcements.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel>Notification Preferences</FieldLabel>
                  <RadioGroup
                    value={formData.notifications}
                    onValueChange={(value) =>
                      handleInputChange("notifications", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="notif-email" />
                      <Label htmlFor="notif-email">Email notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sms" id="notif-sms" />
                      <Label htmlFor="notif-sms">SMS notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="notif-none" />
                      <Label htmlFor="notif-none">No notifications</Label>
                    </div>
                  </RadioGroup>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="country">Country</FieldLabel>
                    <Select
                      value={formData.country}
                      onValueChange={(value) =>
                        handleInputChange("country", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                    <Select
                      value={formData.timezone}
                      onValueChange={(value) =>
                        handleInputChange("timezone", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="est">Eastern Time (EST)</SelectItem>
                        <SelectItem value="cst">Central Time (CST)</SelectItem>
                        <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </FieldSet>

              {/* Action Buttons */}
              <FieldGroup>
                <ButtonGroup className="w-full">
                  <Button type="submit" className="flex-1">
                    Save Profile
                  </Button>
                  <Button type="button" variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </ButtonGroup>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Contact Form Example */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Form</CardTitle>
          <CardDescription>
            A simple contact form demonstrating input groups and validation
            states.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="contact-name">Name</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <UserIcon className="size-4" />
                  </InputGroupAddon>
                  <Input
                    id="contact-name"
                    placeholder="Your full name"
                    required
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="contact-email">Email</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <MailIcon className="size-4" />
                  </InputGroupAddon>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
                <Input
                  id="contact-subject"
                  placeholder="What's this about?"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="contact-message">Message</FieldLabel>
                <Textarea
                  id="contact-message"
                  placeholder="Your message here..."
                  className="min-h-[120px]"
                  required
                />
              </Field>

              <Field>
                <ButtonGroup className="w-full">
                  <Button type="submit" className="flex-1">
                    Send Message
                  </Button>
                  <Button type="button" variant="outline" className="flex-1">
                    Clear
                  </Button>
                </ButtonGroup>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
