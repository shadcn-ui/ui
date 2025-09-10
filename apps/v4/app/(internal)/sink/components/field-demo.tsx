"use client"

import { useState } from "react"
import { addDays, format } from "date-fns"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  CalendarIcon,
  ClockIcon,
  DownloadIcon,
  FileTextIcon,
  FolderIcon,
  MonitorIcon,
} from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york-v4/ui/avatar"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Calendar } from "@/registry/new-york-v4/ui/calendar"
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
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/registry/new-york-v4/ui/field"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/new-york-v4/ui/input-otp"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
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
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { Slider } from "@/registry/new-york-v4/ui/slider"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york-v4/ui/toggle-group"

export function FieldDemo() {
  return (
    <div className="bg-muted flex flex-wrap items-start gap-6 p-10 *:[div]:w-md">
      <div className="flex flex-col gap-6">
        <FormInputDemo />
        <FormInputTypesDemo />
        <FeedbackForm />
        <JobApplicationForm />
        <CheckoutForm />
      </div>
      <div className="flex flex-col gap-6">
        <FormSpecialInputTypesDemo />
        <FormTextareaDemo />
        <FormSelectDemo />
        <ProfileSettingsForm />
        <FormFieldGroupOutlineDemo />
      </div>
      <div className="flex flex-col gap-6">
        <FormRadioDemo />
        <FormCheckboxDemo />
        <FormSliderDemo />
        <NewsletterForm />
        <PaymentForm />
        <ContactForm />
      </div>
      <div className="flex flex-col gap-6">
        <FormSwitchDemo />
        <FormToggleGroupDemo />
        <FormOTPDemo />
        <FormFieldSetDemo />
        <FormFieldSeparatorDemo />
      </div>
      <div className="flex flex-col gap-6">
        <FormDatePickerDemo />
        <SignupForm />
        <LoginForm />
        <FinderPreferencesForm />
        <SurveyForm />
      </div>
      <div className="flex flex-col gap-6">
        <ComplexFormDemo />
        <ComplexFormInvalidDemo />
      </div>
    </div>
  )
}

function SignupForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="John Doe"
                required
              />
            </Field>
            <Field>
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <Label htmlFor="signup-password">Password</Label>
              <Input id="signup-password" type="password" required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <Label htmlFor="signup-confirm-password">Confirm Password</Label>
              <Input id="signup-confirm-password" type="password" required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
                <Button variant="outline" className="w-full">
                  Sign up with Google
                </Button>
              </Field>
              <Field>
                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <a href="#" className="underline underline-offset-4">
                    Sign in
                  </a>
                </p>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function LoginForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <Label htmlFor="login-7x9-email">Email</Label>
              <Input
                id="login-7x9-email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </Field>
            <Field>
              <Label htmlFor="login-7x9-password">Password</Label>
              <Input id="login-7x9-password" type="password" required />
              <FieldDescription>
                <a href="#" className="text-sm underline underline-offset-4">
                  Forgot your password?
                </a>
              </FieldDescription>
            </Field>
            <Field>
              <Checkbox id="login-7x9-remember" />
              <Label htmlFor="login-7x9-remember" className="font-normal">
                Remember me for 30 days
              </Label>
            </Field>
            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <FieldSeparator />

            <FieldGroup>
              <Button variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Continue with GitHub
              </Button>
              <Button variant="outline" className="w-full">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                Continue with Facebook
              </Button>
            </FieldGroup>

            <FieldSeparator>New to our platform?</FieldSeparator>

            <Field>
              <p className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  className="font-medium underline underline-offset-4"
                >
                  Create an account
                </a>
              </p>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function FinderPreferencesForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Finder Preferences</CardTitle>
        <CardDescription>
          Configure what items appear on your desktop
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <Label>Show these items on the desktop:</Label>
              <Field>
                <Checkbox id="finder-pref-9k2-hard-disks" />
                <Label
                  htmlFor="finder-pref-9k2-hard-disks"
                  className="font-normal"
                >
                  Hard disks
                </Label>
              </Field>
              <Field>
                <Checkbox id="finder-pref-9k2-external-disks" />
                <Label
                  htmlFor="finder-pref-9k2-external-disks"
                  className="font-normal"
                >
                  External disks
                </Label>
              </Field>
              <Field>
                <Checkbox id="finder-pref-9k2-cds-dvds" />
                <Label
                  htmlFor="finder-pref-9k2-cds-dvds"
                  className="font-normal"
                >
                  CDs, DVDs, and iPods
                </Label>
              </Field>
              <Field>
                <Checkbox id="finder-pref-9k2-connected-servers" />
                <Label
                  htmlFor="finder-pref-9k2-connected-servers"
                  className="font-normal"
                >
                  Connected servers
                </Label>
              </Field>
            </Field>
            <FieldSeparator />
            <Field>
              <Label>New Finder windows show:</Label>
              <Select defaultValue="home">
                <SelectTrigger id="finder-pref-9k2-new-window">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recents">
                    <ClockIcon />
                    Recents
                  </SelectItem>
                  <SelectItem value="home">
                    <FolderIcon />
                    shadcn
                  </SelectItem>
                  <SelectItem value="desktop">
                    <MonitorIcon /> Desktop
                  </SelectItem>
                  <SelectItem value="documents">
                    <FileTextIcon /> Documents
                  </SelectItem>
                  <SelectItem value="downloads">
                    <DownloadIcon /> Downloads
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <FieldSeparator />
            <Field>
              <Checkbox id="finder-pref-9k2-sync-folders" defaultChecked />
              <Field>
                <Label
                  htmlFor="finder-pref-9k2-sync-folders"
                  className="font-normal"
                >
                  Sync Desktop & Documents folders
                </Label>
                <FieldDescription>
                  Your Desktop & Documents folders are being synced with iCloud
                  Drive. You can access them from other devices.
                </FieldDescription>
              </Field>
            </Field>
            <Field>
              <Checkbox id="finder-pref-9k2-open-tabs" defaultChecked />
              <Label
                htmlFor="finder-pref-9k2-open-tabs"
                className="font-normal"
              >
                Open folders in tabs instead of new windows
              </Label>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function ContactForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>
          Get in touch with our team for any questions or support
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="contact-3k2-firstName">First Name</Label>
                <Input id="contact-3k2-firstName" placeholder="John" required />
              </Field>
              <Field>
                <Label htmlFor="contact-3k2-lastName">Last Name</Label>
                <Input id="contact-3k2-lastName" placeholder="Doe" required />
              </Field>
            </div>
            <Field>
              <Label htmlFor="contact-3k2-email">Email</Label>
              <Input
                id="contact-3k2-email"
                type="email"
                placeholder="john@example.com"
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <Label htmlFor="subject">Subject</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="support">Technical Support</SelectItem>
                  <SelectItem value="billing">Billing Question</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="contact-3k2-message">Message</Label>
              <Textarea
                id="contact-3k2-message"
                placeholder="Tell us how we can help you..."
                className="min-h-[100px]"
                required
              />
              <FieldDescription>
                Please provide as much detail as possible to help us assist you
                better.
              </FieldDescription>
            </Field>
            <Button type="submit">Send Message</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function FeedbackForm() {
  const [rating, setRating] = useState([5])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback Form</CardTitle>
        <CardDescription>
          Help us improve by sharing your experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <Label htmlFor="feedback-8m4-name">Name (Optional)</Label>
              <Input id="feedback-8m4-name" placeholder="Your name" />
              <FieldDescription>Your name is optional.</FieldDescription>
            </Field>
            <Field>
              <Label htmlFor="feedback-8m4-email">Email (Optional)</Label>
              <Input
                id="feedback-8m4-email"
                type="email"
                placeholder="your@email.com"
              />
            </Field>
            <Field>
              <Label htmlFor="feedback-8m4-rating">
                How would you rate your experience?
              </Label>
              <Slider
                value={rating}
                onValueChange={setRating}
                max={10}
                min={1}
                step={1}
                id="feedback-8m4-rating"
              />
              <FieldDescription>
                Poor (1) /{" "}
                <span className="font-medium">Rating: {rating[0]}</span> /
                Excellent (10)
              </FieldDescription>
            </Field>
            <Field>
              <Label>What type of feedback is this?</Label>
              <RadioGroup defaultValue="general">
                <Field>
                  <RadioGroupItem value="bug" id="feedback-8m4-bug" />
                  <Label htmlFor="feedback-8m4-bug" className="font-normal">
                    Bug Report
                  </Label>
                </Field>
                <Field>
                  <RadioGroupItem value="feature" id="feedback-8m4-feature" />
                  <Label htmlFor="feedback-8m4-feature" className="font-normal">
                    Feature Request
                  </Label>
                </Field>
                <Field>
                  <RadioGroupItem value="general" id="feedback-8m4-general" />
                  <Label htmlFor="feedback-8m4-general" className="font-normal">
                    General Feedback
                  </Label>
                </Field>
                <Field>
                  <RadioGroupItem
                    value="complaint"
                    id="feedback-8m4-complaint"
                  />
                  <Label
                    htmlFor="feedback-8m4-complaint"
                    className="font-normal"
                  >
                    Complaint
                  </Label>
                </Field>
              </RadioGroup>
            </Field>
            <Field>
              <Label htmlFor="feedback-8m4-message">Your Feedback</Label>
              <Textarea
                id="feedback-8m4-message"
                placeholder="Please share your thoughts, suggestions, or report any issues..."
                className="min-h-[120px]"
                required
              />
              <FieldDescription>
                Please share your thoughts, suggestions, or report any issues...
              </FieldDescription>
            </Field>
            <Field className="flex-row">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Submit</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function JobApplicationForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Application</CardTitle>
        <CardDescription>Apply for a position at our company</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="job-5p7-firstName">First Name</Label>
                <Input id="job-5p7-firstName" placeholder="John" required />
              </Field>
              <Field>
                <Label htmlFor="job-5p7-lastName">Last Name</Label>
                <Input id="job-5p7-lastName" placeholder="Doe" required />
              </Field>
            </div>

            <Field>
              <Label htmlFor="job-5p7-email">Email</Label>
              <Input
                id="job-5p7-email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </Field>
            <Field>
              <Label htmlFor="job-5p7-phone">Phone Number</Label>
              <Input
                id="job-5p7-phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                required
              />
            </Field>
            <Field>
              <Label htmlFor="position">Position</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend Developer</SelectItem>
                  <SelectItem value="backend">Backend Developer</SelectItem>
                  <SelectItem value="fullstack">
                    Full Stack Developer
                  </SelectItem>
                  <SelectItem value="designer">UI/UX Designer</SelectItem>
                  <SelectItem value="manager">Product Manager</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="experience">Years of Experience</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="2-3">2-3 years</SelectItem>
                  <SelectItem value="4-6">4-6 years</SelectItem>
                  <SelectItem value="7-10">7-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="job-5p7-portfolio">Portfolio/LinkedIn URL</Label>
              <Input
                id="job-5p7-portfolio"
                type="url"
                placeholder="https://..."
              />
              <FieldDescription>
                Optional: Share your portfolio or professional profile.
              </FieldDescription>
            </Field>
            <Field>
              <Label htmlFor="job-5p7-coverLetter">Cover Letter</Label>
              <Textarea
                id="job-5p7-coverLetter"
                placeholder="Tell us why you're interested in this position..."
                className="min-h-[120px]"
                required
              />
            </Field>
            <Field>
              <Label htmlFor="job-5p7-resume">Resume</Label>
              <Input id="job-5p7-resume" type="file" accept=".pdf,.doc,.docx" />
              <FieldDescription>
                Upload your resume in PDF, DOC, or DOCX format (max 5MB).
              </FieldDescription>
            </Field>
            <Field>
              <Checkbox id="job-5p7-terms" required />
              <Label
                htmlFor="job-5p7-terms"
                className="-mt-0.5 leading-normal font-normal"
              >
                I authorize the company to contact me regarding this application
              </Label>
            </Field>

            <Button type="submit">Submit Application</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function NewsletterForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Newsletter Signup</CardTitle>
        <CardDescription>
          Stay updated with our latest news and updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <Label htmlFor="newsletter-2q8-name">Name</Label>
              <Input
                id="newsletter-2q8-name"
                placeholder="Your name"
                required
              />
            </Field>
            <Field>
              <Label htmlFor="newsletter-2q8-email">Email</Label>
              <Input
                id="newsletter-2q8-email"
                type="email"
                placeholder="your@email.com"
                required
              />
              <FieldDescription>
                We&apos;ll send our newsletter to this email address.
              </FieldDescription>
            </Field>
            <Field>
              <Label>Interests (Select all that apply)</Label>
              <Field>
                <Checkbox id="newsletter-2q8-tech" />
                <Label htmlFor="newsletter-2q8-tech" className="font-normal">
                  Technology News
                </Label>
              </Field>
              <Field>
                <Checkbox id="newsletter-2q8-product" />
                <Label htmlFor="newsletter-2q8-product" className="font-normal">
                  Product Updates
                </Label>
              </Field>
              <Field>
                <Checkbox id="newsletter-2q8-tips" />
                <Label htmlFor="newsletter-2q8-tips" className="font-normal">
                  Tips & Tutorials
                </Label>
              </Field>
              <Field>
                <Checkbox id="newsletter-2q8-events" />
                <Label htmlFor="newsletter-2q8-events" className="font-normal">
                  Events & Webinars
                </Label>
              </Field>
            </Field>
            <Field>
              <Checkbox id="newsletter-2q8-privacy" required />
              <Label
                htmlFor="newsletter-2q8-privacy"
                className="-mt-0.5 leading-normal font-normal"
              >
                I agree to receive marketing emails and understand I can
                unsubscribe at any time
              </Label>
            </Field>

            <Button type="submit">Subscribe to Newsletter</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function PaymentForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Enter your payment details to complete your purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <Label htmlFor="payment-9n3-cardNumber">Card Number</Label>
              <Input
                id="payment-9n3-cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="payment-9n3-expiry">Expiry Date</Label>
                <Input
                  id="payment-9n3-expiry"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </Field>
              <Field>
                <Label htmlFor="payment-9n3-cvv">CVV</Label>
                <Input id="payment-9n3-cvv" placeholder="123" maxLength={4} />
                <FieldDescription>3 or 4 digit security code.</FieldDescription>
              </Field>
            </div>

            <Field>
              <Label htmlFor="payment-9n3-cardName">Name on Card</Label>
              <Input id="payment-9n3-cardName" placeholder="John Doe" />
            </Field>

            <Separator />

            <FieldSet>
              <FieldLegend>Billing Address</FieldLegend>
              <FieldDescription>
                Please enter your billing address.
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <Label htmlFor="payment-9n3-address">Address</Label>
                  <Input id="payment-9n3-address" placeholder="123 Main St" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="payment-9n3-city">City</Label>
                    <Input id="payment-9n3-city" placeholder="New York" />
                  </Field>
                  <Field>
                    <Label htmlFor="payment-9n3-zip">ZIP Code</Label>
                    <Input id="payment-9n3-zip" placeholder="10001" />
                  </Field>
                </div>
                <Field>
                  <Label htmlFor="payment-9n3-country">Country</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </FieldSet>

            <Field className="flex-row justify-between">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Complete Payment</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function FormInputDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Fields</CardTitle>
        <CardDescription>Different input field configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Label htmlFor="input-1a2-basic">Basic Input</Label>
            <Input id="input-1a2-basic" placeholder="Enter text" />
          </Field>
          <Field>
            <Label htmlFor="input-1a2-withDesc">Input with Description</Label>
            <Input id="input-1a2-withDesc" placeholder="Enter your username" />
            <FieldDescription>
              Choose a unique username for your account.
            </FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="input-1a2-descFirst">Email Address</Label>
            <FieldDescription>
              We&apos;ll never share your email with anyone.
            </FieldDescription>
            <Input
              id="input-1a2-descFirst"
              type="email"
              placeholder="email@example.com"
            />
          </Field>
          <Field>
            <Label htmlFor="input-1a2-required">
              Required Field <span className="text-destructive">*</span>
            </Label>
            <Input
              id="input-1a2-required"
              placeholder="This field is required"
              required
            />
            <FieldDescription>This field must be filled out.</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="input-1a2-disabled">Disabled Input</Label>
            <Input id="input-1a2-disabled" placeholder="Cannot edit" disabled />
            <FieldDescription>
              This field is currently disabled.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormTextareaDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Textarea Fields</CardTitle>
        <CardDescription>
          Different textarea field configurations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Label htmlFor="textarea-3b5-basic">Basic Textarea</Label>
            <Textarea
              id="textarea-3b5-basic"
              placeholder="Enter your message"
            />
          </Field>
          <Field>
            <Label htmlFor="textarea-3b5-comments">Comments</Label>
            <Textarea
              id="textarea-3b5-comments"
              placeholder="Share your thoughts..."
              className="min-h-[100px]"
            />
            <FieldDescription>Maximum 500 characters allowed.</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="textarea-3b5-bio">Bio</Label>
            <FieldDescription>
              Tell us about yourself in a few sentences.
            </FieldDescription>
            <Textarea
              id="textarea-3b5-bio"
              placeholder="I am a..."
              className="min-h-[120px]"
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormSelectDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Fields</CardTitle>
        <CardDescription>Different select field configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Label htmlFor="select-4c6-basic">Basic Select</Label>
            <Select>
              <SelectTrigger id="select-4c6-basic">
                <SelectValue placeholder="Choose an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <Label htmlFor="select-4c6-country">Country</Label>
            <Select>
              <SelectTrigger id="select-4c6-country">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              Select the country where you currently reside.
            </FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="select-4c6-timezone">Timezone</Label>
            <FieldDescription>
              Choose your local timezone for accurate scheduling.
            </FieldDescription>
            <Select>
              <SelectTrigger id="select-4c6-timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="est">Eastern Time</SelectItem>
                <SelectItem value="pst">Pacific Time</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormRadioDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Radio Fields</CardTitle>
        <CardDescription>Different radio field configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Label>Subscription Plan</Label>
            <RadioGroup defaultValue="free">
              <Field>
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free" className="font-normal">
                  Free Plan
                </Label>
              </Field>
              <Field>
                <RadioGroupItem value="pro" id="pro" />
                <Label htmlFor="pro" className="font-normal">
                  Pro Plan
                </Label>
              </Field>
              <Field>
                <RadioGroupItem value="enterprise" id="enterprise" />
                <Label htmlFor="enterprise" className="font-normal">
                  Enterprise
                </Label>
              </Field>
            </RadioGroup>
          </Field>
          <Field>
            <Label>Size</Label>
            <RadioGroup defaultValue="medium" className="flex flex-row gap-4">
              <Field>
                <RadioGroupItem value="small" id="size-small" />
                <Label htmlFor="size-small" className="font-normal">
                  Small
                </Label>
              </Field>
              <Field>
                <RadioGroupItem value="medium" id="size-medium" />
                <Label htmlFor="size-medium" className="font-normal">
                  Medium
                </Label>
              </Field>
              <Field>
                <RadioGroupItem value="large" id="size-large" />
                <Label htmlFor="size-large" className="font-normal">
                  Large
                </Label>
              </Field>
              <Field>
                <RadioGroupItem value="xlarge" id="size-xlarge" />
                <Label htmlFor="size-xlarge" className="font-normal">
                  X-Large
                </Label>
              </Field>
            </RadioGroup>
            <FieldDescription>Select your preferred size.</FieldDescription>
          </Field>
          <Field>
            <Label>Notification Preferences</Label>
            <FieldDescription>
              Choose how you want to receive notifications.
            </FieldDescription>
            <RadioGroup defaultValue="email">
              <Field>
                <RadioGroupItem value="email" id="notify-email" />
                <Label htmlFor="notify-email" className="font-normal">
                  Email only
                </Label>
              </Field>
              <Field>
                <RadioGroupItem value="sms" id="notify-sms" />
                <Label htmlFor="notify-sms" className="font-normal">
                  SMS only
                </Label>
              </Field>
              <Field>
                <RadioGroupItem value="both" id="notify-both" />
                <Label htmlFor="notify-both" className="font-normal">
                  Both Email & SMS
                </Label>
              </Field>
            </RadioGroup>
          </Field>
          <Field>
            <Label>Delivery Speed</Label>
            <RadioGroup
              defaultValue="standard"
              className="flex flex-wrap gap-4"
            >
              <Field>
                <RadioGroupItem value="express" id="delivery-express" />
                <Label htmlFor="delivery-express" className="font-normal">
                  Express (1-2 days)
                </Label>
              </Field>
              <Field>
                <RadioGroupItem value="standard" id="delivery-standard" />
                <Label htmlFor="delivery-standard" className="font-normal">
                  Standard (3-5 days)
                </Label>
              </Field>
              <Field>
                <RadioGroupItem value="economy" id="delivery-economy" />
                <Label htmlFor="delivery-economy" className="font-normal">
                  Economy (5-7 days)
                </Label>
              </Field>
            </RadioGroup>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormCheckboxDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkbox Fields</CardTitle>
        <CardDescription>
          Different checkbox field configurations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="font-normal">
              I agree to the terms and conditions
            </Label>
          </Field>

          <Field className="items-start">
            <Checkbox id="newsletter" />
            <Field>
              <Label htmlFor="newsletter" className="font-normal">
                Subscribe to newsletter
              </Label>
              <FieldDescription>
                Receive weekly updates about new features and promotions.
              </FieldDescription>
            </Field>
          </Field>
          <Field>
            <Label>Preferences</Label>
            <FieldDescription>
              Select all that apply to customize your experience.
            </FieldDescription>
            <Field>
              <Checkbox id="pref-dark" />
              <Label htmlFor="pref-dark" className="font-normal">
                Dark mode
              </Label>
            </Field>
            <Field>
              <Checkbox id="pref-compact" />
              <Label htmlFor="pref-compact" className="font-normal">
                Compact view
              </Label>
            </Field>
            <Field>
              <Checkbox id="pref-notifications" />
              <Label htmlFor="pref-notifications" className="font-normal">
                Enable notifications
              </Label>
            </Field>
          </Field>
          <Field>
            <Label>Days Available</Label>
            <FieldDescription>
              Select the days you are available.
            </FieldDescription>
            <Field className="flex-row">
              <Field>
                <Checkbox id="mon" />
                <Label htmlFor="mon" className="font-normal">
                  Mon
                </Label>
              </Field>
              <Field>
                <Checkbox id="tue" />
                <Label htmlFor="tue" className="font-normal">
                  Tue
                </Label>
              </Field>
              <Field>
                <Checkbox id="wed" />
                <Label htmlFor="wed" className="font-normal">
                  Wed
                </Label>
              </Field>
              <Field>
                <Checkbox id="thu" />
                <Label htmlFor="thu" className="font-normal">
                  Thu
                </Label>
              </Field>
              <Field>
                <Checkbox id="fri" />
                <Label htmlFor="fri" className="font-normal">
                  Fri
                </Label>
              </Field>
              <Field>
                <Checkbox id="sat" />
                <Label htmlFor="sat" className="font-normal">
                  Sat
                </Label>
              </Field>
              <Field>
                <Checkbox id="sun" />
                <Label htmlFor="sun" className="font-normal">
                  Sun
                </Label>
              </Field>
            </Field>
          </Field>
          <Field>
            <Label>Skills</Label>
            <Field className="flex-row flex-wrap">
              <Field>
                <Checkbox id="javascript" />
                <Label htmlFor="javascript" className="font-normal">
                  JavaScript
                </Label>
              </Field>
              <Field>
                <Checkbox id="typescript" />
                <Label htmlFor="typescript" className="font-normal">
                  TypeScript
                </Label>
              </Field>
              <Field>
                <Checkbox id="react" />
                <Label htmlFor="react" className="font-normal">
                  React
                </Label>
              </Field>
              <Field>
                <Checkbox id="nodejs" />
                <Label htmlFor="nodejs" className="font-normal">
                  Node.js
                </Label>
              </Field>
              <Field>
                <Checkbox id="python" />
                <Label htmlFor="python" className="font-normal">
                  Python
                </Label>
              </Field>
              <Field>
                <Checkbox id="database" />
                <Label htmlFor="database" className="font-normal">
                  Database
                </Label>
              </Field>
            </Field>
            <FieldDescription>
              Select all technologies you are proficient with.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormSliderDemo() {
  const [volume, setVolume] = useState([50])
  const [brightness, setBrightness] = useState([75])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Slider Fields</CardTitle>
        <CardDescription>Different slider field configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Label htmlFor="volume">Volume</Label>
            <Slider
              id="volume"
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
            />
          </Field>
          <Field>
            <Label htmlFor="brightness">Screen Brightness</Label>
            <Slider
              id="brightness"
              value={brightness}
              onValueChange={setBrightness}
              max={100}
              step={5}
            />
            <FieldDescription>
              Current brightness: {brightness[0]}%
            </FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="quality">Video Quality</Label>
            <FieldDescription>
              Higher quality uses more bandwidth.
            </FieldDescription>
            <Slider
              id="quality"
              defaultValue={[720]}
              max={1080}
              min={360}
              step={360}
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormSwitchDemo() {
  const [notifications, setNotifications] = useState(false)
  const [marketing, setMarketing] = useState(true)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Switch Fields</CardTitle>
        <CardDescription>Different switch field configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Field>
              <Label htmlFor="airplane-mode">Airplane Mode</Label>
              <FieldDescription>
                Turn on airplane mode to disable all connections.
              </FieldDescription>
            </Field>
            <Switch id="airplane-mode" />
          </Field>
          <Field>
            <Field>
              <Label htmlFor="notifications">Push Notifications</Label>
              <FieldDescription>
                Receive notifications about updates and new features.
              </FieldDescription>
            </Field>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </Field>
          <Field className="items-start">
            <Switch
              id="marketing"
              checked={marketing}
              onCheckedChange={setMarketing}
              className="mt-0.5"
            />
            <Field>
              <Label htmlFor="marketing">Marketing Emails</Label>
              <FieldDescription>
                Receive emails about new products, features, and more.
              </FieldDescription>
            </Field>
          </Field>
          <Field>
            <Switch id="auto-save" defaultChecked />
            <Field>
              <Label htmlFor="auto-save">Auto-save</Label>
              <FieldDescription>
                Automatically save your work every 5 minutes.
              </FieldDescription>
            </Field>
          </Field>
          <Field>
            <Label>Privacy Settings</Label>
            <FieldDescription>
              Manage your privacy preferences.
            </FieldDescription>
            <Field>
              <Switch id="profile-visible" defaultChecked />
              <Label htmlFor="profile-visible" className="font-normal">
                Make profile visible to others
              </Label>
            </Field>
            <Field>
              <Switch id="show-email" />
              <Label htmlFor="show-email" className="font-normal">
                Show email on profile
              </Label>
            </Field>
            <Field>
              <Switch id="allow-indexing" defaultChecked />
              <Label htmlFor="allow-indexing" className="font-normal">
                Allow search engines to index profile
              </Label>
            </Field>
          </Field>
          <Field>
            <Switch id="disabled-switch" disabled />
            <Field>
              <Label htmlFor="disabled-switch" className="opacity-50">
                Disabled Feature
              </Label>
              <FieldDescription>
                This feature is currently unavailable.
              </FieldDescription>
            </Field>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormToggleGroupDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Toggle Group Fields</CardTitle>
        <CardDescription>Different toggle group configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Label>View Mode</Label>
            <ToggleGroup
              type="single"
              defaultValue="grid"
              variant="outline"
              className="w-full"
            >
              <ToggleGroupItem value="list" className="flex-1">
                List
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" className="flex-1">
                Grid
              </ToggleGroupItem>
              <ToggleGroupItem value="cards" className="flex-1">
                Cards
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>
          <Field>
            <Label>Status Filter</Label>
            <ToggleGroup type="single" variant="outline" className="flex-wrap">
              <ToggleGroupItem value="active">Active</ToggleGroupItem>
              <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
              <ToggleGroupItem value="completed">Completed</ToggleGroupItem>
              <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
            </ToggleGroup>
            <FieldDescription>Filter by multiple statuses.</FieldDescription>
          </Field>
          <Field>
            <Label>Subscription Plan</Label>
            <FieldDescription>
              Select the subscription plan that you want to subscribe to.
            </FieldDescription>
            <ToggleGroup type="single" variant="outline" className="flex-wrap">
              <ToggleGroupItem value="basic">Basic</ToggleGroupItem>
              <ToggleGroupItem value="pro">Pro</ToggleGroupItem>
              <ToggleGroupItem value="enterprise">Enterprise</ToggleGroupItem>
            </ToggleGroup>
          </Field>
          <Field>
            <Label>Disabled Toggle Group</Label>
            <ToggleGroup type="single" disabled variant="outline">
              <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
              <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
              <ToggleGroupItem value="option3">Option 3</ToggleGroupItem>
            </ToggleGroup>
            <FieldDescription>This toggle group is disabled.</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormInputTypesDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Input Types</CardTitle>
        <CardDescription>Text-based HTML input variations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Label htmlFor="text-input">Text</Label>
            <Input id="text-input" type="text" placeholder="Enter text" />
            <FieldDescription>Standard text input field.</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="email-input">Email</Label>
            <Input
              id="email-input"
              type="email"
              placeholder="name@example.com"
            />
            <FieldDescription>Email address with validation.</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="password-input">Password</Label>
            <Input
              id="password-input"
              type="password"
              placeholder="Enter password"
            />
            <FieldDescription>
              Password field with hidden text.
            </FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="tel-input">Phone</Label>
            <Input id="tel-input" type="tel" placeholder="+1 (555) 123-4567" />
            <FieldDescription>Telephone number input.</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="url-input">URL</Label>
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com"
            />
            <FieldDescription>Website URL with validation.</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="search-input">Search</Label>
            <Input id="search-input" type="search" placeholder="Search..." />
            <FieldDescription>Search field with clear button.</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="number-input">Number</Label>
            <Input
              id="number-input"
              type="number"
              placeholder="42"
              min="0"
              max="100"
              step="1"
            />
            <FieldDescription>Numeric input (0-100).</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormSpecialInputTypesDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Special Input Types</CardTitle>
        <CardDescription>
          Date, time, file and other special inputs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Label htmlFor="date-input">Date</Label>
            <Input id="date-input" type="date" />
            <FieldDescription>Native date picker.</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="time-input">Time</Label>
            <Input id="time-input" type="time" />
            <FieldDescription>
              Time selection (24-hour format).
            </FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="datetime-input">Date & Time</Label>
            <Input id="datetime-input" type="datetime-local" />
            <FieldDescription>Combined date and time picker.</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="month-input">Month</Label>
            <Input id="month-input" type="month" />
            <FieldDescription>Month and year selector.</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="week-input">Week</Label>
            <Input id="week-input" type="week" />
            <FieldDescription>Week number selector.</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="file-input">File Upload</Label>
            <Input id="file-input" type="file" accept="image/*,.pdf" />
            <FieldDescription>Upload images or PDF files.</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="files-input">Multiple Files</Label>
            <Input
              id="files-input"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png"
            />
            <FieldDescription>Upload multiple image files.</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormOTPDemo() {
  const [value, setValue] = useState("")
  const [pinValue, setPinValue] = useState("")

  return (
    <Card>
      <CardHeader>
        <CardTitle>OTP Input Fields</CardTitle>
        <CardDescription>Different OTP input configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Label htmlFor="basic-otp">Verification Code</Label>
            <InputOTP id="basic-otp" maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Field>
          <Field>
            <Label htmlFor="otp-with-desc">Enter OTP</Label>
            <InputOTP
              id="otp-with-desc"
              maxLength={6}
              value={value}
              onChange={setValue}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              Enter the 6-digit code sent to your email.
            </FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="otp-separator">Two-Factor Authentication</Label>
            <InputOTP id="otp-separator" maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              Enter the code from your authenticator app.
            </FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="pin-input">PIN Code</Label>
            <InputOTP
              id="pin-input"
              maxLength={4}
              pattern={REGEXP_ONLY_DIGITS}
              value={pinValue}
              onChange={setPinValue}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              Enter your 4-digit PIN (numbers only).
            </FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="otp-multi-sep">License Key</Label>
            <InputOTP id="otp-multi-sep" maxLength={8}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={6} />
                <InputOTPSlot index={7} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              Enter your 8-character license key.
            </FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="otp-custom">Security Code</Label>
            <FieldDescription>
              Enter the security code to continue.
            </FieldDescription>
            <InputOTP id="otp-custom" maxLength={6}>
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} className="rounded-md border" />
                <InputOTPSlot index={1} className="rounded-md border" />
                <InputOTPSlot index={2} className="rounded-md border" />
                <InputOTPSlot index={3} className="rounded-md border" />
                <InputOTPSlot index={4} className="rounded-md border" />
                <InputOTPSlot index={5} className="rounded-md border" />
              </InputOTPGroup>
            </InputOTP>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormDatePickerDemo() {
  const [date, setDate] = useState<Date>()
  const [birthDate, setBirthDate] = useState<Date>()
  const [appointmentDate, setAppointmentDate] = useState<Date>()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [vacationDates, setVacationDates] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date Picker Fields</CardTitle>
        <CardDescription>Different date picker configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Label htmlFor="basic-date">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="basic-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </Field>
          <Field>
            <Label htmlFor="birth-date">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="birth-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? (
                    format(birthDate, "PPP")
                  ) : (
                    <span>Select your birth date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                />
              </PopoverContent>
            </Popover>
            <FieldDescription>
              We use this to calculate your age and provide age-appropriate
              content.
            </FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="appointment">Appointment Date</Label>
            <FieldDescription>
              Select a date for your appointment (weekdays only).
            </FieldDescription>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="appointment"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !appointmentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {appointmentDate ? (
                    format(appointmentDate, "PPP")
                  ) : (
                    <span>Schedule appointment</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={appointmentDate}
                  onSelect={setAppointmentDate}
                  disabled={(date) =>
                    date < new Date() ||
                    date.getDay() === 0 ||
                    date.getDay() === 6
                  }
                />
              </PopoverContent>
            </Popover>
          </Field>
          <Field>
            <Label htmlFor="date-range">Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <FieldDescription>
              Select start and end dates for your report.
            </FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="vacation">Vacation Dates</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="vacation"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !vacationDates && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {vacationDates?.from ? (
                    vacationDates.to ? (
                      <>
                        {format(vacationDates.from, "LLL dd, y")} -{" "}
                        {format(vacationDates.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(vacationDates.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Select vacation dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex flex-col">
                  <div className="flex gap-2 border-b p-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setVacationDates({
                          from: new Date(),
                          to: addDays(new Date(), 7),
                        })
                      }
                    >
                      Next 7 days
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setVacationDates({
                          from: new Date(),
                          to: addDays(new Date(), 14),
                        })
                      }
                    >
                      Next 2 weeks
                    </Button>
                  </div>
                  <Calendar
                    mode="range"
                    defaultMonth={vacationDates?.from}
                    selected={vacationDates}
                    onSelect={setVacationDates}
                    numberOfMonths={2}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <FieldDescription>
              Choose your vacation period. Quick presets available.
            </FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="disabled-date" className="opacity-50">
              Event Date (Disabled)
            </Label>
            <Button
              id="disabled-date"
              variant="outline"
              className="w-full justify-start text-left font-normal opacity-50"
              disabled
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Date selection disabled</span>
            </Button>
            <FieldDescription>
              This field is currently disabled.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormFieldSetDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FieldSet & FieldLegend</CardTitle>
        <CardDescription>Different fieldset configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Basic FieldSet</FieldLegend>
            <FieldGroup>
              <Field>
                <Label htmlFor="basic-name">Name</Label>
                <Input id="basic-name" placeholder="Enter your name" />
              </Field>
              <Field>
                <Label htmlFor="basic-email">Email</Label>
                <Input
                  id="basic-email"
                  type="email"
                  placeholder="email@example.com"
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>FieldSet with Description</FieldLegend>
            <FieldDescription>
              This fieldset includes a description to provide context.
            </FieldDescription>
            <FieldGroup>
              <Field>
                <Label htmlFor="address-street">Street Address</Label>
                <Input id="address-street" placeholder="123 Main St" />
              </Field>
              <FieldGroup className="grid grid-cols-2 gap-4">
                <Field>
                  <Label htmlFor="address-city">City</Label>
                  <Input id="address-city" placeholder="New York" />
                </Field>
                <Field>
                  <Label htmlFor="address-zip">ZIP Code</Label>
                  <Input id="address-zip" placeholder="10001" />
                </Field>
              </FieldGroup>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Communication Preferences</FieldLegend>
            <FieldDescription>
              Choose how you&apos;d like us to keep in touch with you.
            </FieldDescription>
            <FieldGroup>
              <Field>
                <Label>Preferred Contact Method</Label>
                <RadioGroup defaultValue="email">
                  <Field>
                    <RadioGroupItem value="email" id="contact-email" />
                    <Label htmlFor="contact-email" className="font-normal">
                      Email
                    </Label>
                  </Field>
                  <Field>
                    <RadioGroupItem value="phone" id="contact-phone" />
                    <Label htmlFor="contact-phone" className="font-normal">
                      Phone
                    </Label>
                  </Field>
                  <Field>
                    <RadioGroupItem value="sms" id="contact-sms" />
                    <Label htmlFor="contact-sms" className="font-normal">
                      SMS
                    </Label>
                  </Field>
                </RadioGroup>
              </Field>
              <Field>
                <Label>Notification Types</Label>
                <Field>
                  <Checkbox id="updates" defaultChecked />
                  <Label htmlFor="updates" className="font-normal">
                    Product updates
                  </Label>
                </Field>
                <Field>
                  <Checkbox id="newsletters" />
                  <Label htmlFor="newsletters" className="font-normal">
                    Newsletters
                  </Label>
                </Field>
                <Field>
                  <Checkbox id="promotions" />
                  <Label htmlFor="promotions" className="font-normal">
                    Promotional offers
                  </Label>
                </Field>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Account Settings</FieldLegend>
            <FieldGroup>
              <Field>
                <Field>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <FieldDescription>
                    Add an extra layer of security to your account.
                  </FieldDescription>
                </Field>
                <Switch id="two-factor" />
              </Field>
              <Field>
                <Field>
                  <Label htmlFor="public-profile">Public Profile</Label>
                  <FieldDescription>
                    Make your profile visible to other users.
                  </FieldDescription>
                </Field>
                <Switch id="public-profile" defaultChecked />
              </Field>
              <Field>
                <Field>
                  <Label htmlFor="activity-status">Show Activity Status</Label>
                  <FieldDescription>
                    Let others see when you&apos;re online.
                  </FieldDescription>
                </Field>
                <Switch id="activity-status" />
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend>Emergency Contact</FieldLegend>
            <FieldDescription>
              Provide emergency contact information for safety purposes.
            </FieldDescription>
            <FieldGroup>
              <Field>
                <Label htmlFor="emergency-name">Contact Name</Label>
                <Input id="emergency-name" placeholder="Jane Doe" />
                <FieldDescription>
                  Full name of your emergency contact.
                </FieldDescription>
              </Field>
              <Field>
                <Label htmlFor="emergency-relationship">Relationship</Label>
                <Select>
                  <SelectTrigger id="emergency-relationship">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <Label htmlFor="emergency-phone">Phone Number</Label>
                <Input
                  id="emergency-phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                />
                <FieldDescription>
                  Best number to reach your emergency contact.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Additional Information</FieldLegend>
            <FieldGroup>
              <Field>
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  placeholder="Any additional information..."
                  className="min-h-[100px]"
                />
              </Field>
              <Field>
                <Checkbox id="agree-terms" />
                <Label htmlFor="agree-terms" className="font-normal">
                  I agree to the terms and conditions
                </Label>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormFieldSeparatorDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Field Separator</CardTitle>
        <CardDescription>
          Different ways to use the FieldSeparator component
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Label htmlFor="section1-input">Section 1</Label>
            <Input id="section1-input" placeholder="First section input" />
            <FieldDescription>
              This is the first section of the form.
            </FieldDescription>
          </Field>
          <FieldSeparator />
          <Field>
            <Label htmlFor="section2-input">Section 2</Label>
            <Input id="section2-input" placeholder="Second section input" />
            <FieldDescription>
              A simple separator line appears above this section.
            </FieldDescription>
          </Field>
          <FieldSeparator>Or continue with</FieldSeparator>
          <Field>
            <Button variant="outline" className="w-full">
              Alternative Option 1
            </Button>
            <Button variant="outline" className="w-full">
              Alternative Option 2
            </Button>
          </Field>
          <FieldSeparator>Additional Options</FieldSeparator>
          <FieldGroup>
            <Field>
              <Checkbox id="option1" />
              <Label htmlFor="option1" className="font-normal">
                Enable additional features
              </Label>
            </Field>
            <Field>
              <Checkbox id="option2" />
              <Label htmlFor="option2" className="font-normal">
                Subscribe to updates
              </Label>
            </Field>
          </FieldGroup>
          <FieldSeparator />
          <Field>
            <Label htmlFor="final-section">Final Section</Label>
            <Textarea
              id="final-section"
              placeholder="Any additional comments..."
              className="min-h-[80px]"
            />
          </Field>
          <FieldSeparator>Or choose a different path</FieldSeparator>
          <FieldGroup>
            <Field>
              <RadioGroup defaultValue="option1">
                <Field>
                  <RadioGroupItem value="option1" id="path1" />
                  <Label htmlFor="path1" className="font-normal">
                    Option Path 1
                  </Label>
                </Field>
                <Field>
                  <RadioGroupItem value="option2" id="path2" />
                  <Label htmlFor="path2" className="font-normal">
                    Option Path 2
                  </Label>
                </Field>
              </RadioGroup>
            </Field>
          </FieldGroup>
          <FieldSeparator>Account Settings</FieldSeparator>
          <FieldGroup>
            <Field>
              <Switch id="separator-7e9-notifications" />
              <Field>
                <Label htmlFor="separator-7e9-notifications">
                  Enable Notifications
                </Label>
                <FieldDescription>
                  Receive updates about your account activity.
                </FieldDescription>
              </Field>
            </Field>
            <Field>
              <Switch id="separator-7e9-privacy" />
              <Field>
                <Label htmlFor="separator-7e9-privacy">
                  Make Profile Public
                </Label>
                <FieldDescription>
                  Allow others to view your profile information.
                </FieldDescription>
              </Field>
            </Field>
          </FieldGroup>
          <Field>
            <Button type="submit" className="w-full">
              Submit Form
            </Button>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function FormFieldGroupOutlineDemo() {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Notification Settings</FieldLegend>
        <FieldDescription>
          Configure how and when you receive notifications
        </FieldDescription>
        <FieldGroup variant="outline" className="bg-background">
          <Field>
            <Field>
              <Label htmlFor="outline-demo-8h3-email-notif">
                Email Notifications
              </Label>
              <FieldDescription>
                Receive updates via email about your account activity
              </FieldDescription>
            </Field>
            <Switch id="outline-demo-8h3-email-notif" defaultChecked />
          </Field>
          <FieldSeparator />
          <Field>
            <Field>
              <Label htmlFor="outline-demo-8h3-push-notif">
                Push Notifications
              </Label>
              <FieldDescription>
                Get instant notifications on your device
              </FieldDescription>
            </Field>
            <Switch id="outline-demo-8h3-push-notif" defaultChecked />
          </Field>
          <FieldSeparator />
          <Field>
            <Field>
              <Label htmlFor="outline-demo-8h3-sms-notif">
                SMS Notifications
              </Label>
              <FieldDescription>
                Receive text messages for important updates
              </FieldDescription>
            </Field>
            <Switch id="outline-demo-8h3-sms-notif" />
          </Field>
          <FieldSeparator />
          <Field>
            <Field>
              <Label htmlFor="outline-demo-8h3-weekly-digest">
                Weekly Digest
              </Label>
              <FieldDescription>
                Get a summary of your activity every week
              </FieldDescription>
            </Field>
            <Switch id="outline-demo-8h3-weekly-digest" defaultChecked />
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend>Privacy Settings</FieldLegend>
        <FieldDescription>
          Control your privacy and data sharing preferences
        </FieldDescription>
        <FieldGroup variant="outline">
          <Field>
            <Label htmlFor="contact-3k2-firstName">First Name</Label>
            <Input id="contact-3k2-firstName" placeholder="John" required />
          </Field>
          <Field>
            <Label>Show these items on the desktop:</Label>
            <Field>
              <Checkbox id="finder-pref-9k2-hard-disks" />
              <Label
                htmlFor="finder-pref-9k2-hard-disks"
                className="font-normal"
              >
                Hard disks
              </Label>
            </Field>
            <Field>
              <Checkbox id="finder-pref-9k2-external-disks" />
              <Label
                htmlFor="finder-pref-9k2-external-disks"
                className="font-normal"
              >
                External disks
              </Label>
            </Field>
            <Field>
              <Checkbox id="finder-pref-9k2-cds-dvds" />
              <Label htmlFor="finder-pref-9k2-cds-dvds" className="font-normal">
                CDs, DVDs, and iPods
              </Label>
            </Field>
            <Field>
              <Checkbox id="finder-pref-9k2-connected-servers" />
              <Label
                htmlFor="finder-pref-9k2-connected-servers"
                className="font-normal"
              >
                Connected servers
              </Label>
            </Field>
          </Field>
          <FieldSeparator />
          <Field>
            <Field>
              <Label htmlFor="outline-demo-8h3-profile-public">
                Public Profile
              </Label>
              <FieldDescription>
                Make your profile visible to everyone
              </FieldDescription>
            </Field>
            <Switch id="outline-demo-8h3-profile-public" />
          </Field>
          <FieldSeparator />
          <Field>
            <Field>
              <Label htmlFor="outline-demo-8h3-share-data">
                Share Usage Data
              </Label>
              <FieldDescription>
                Help improve our services by sharing anonymous usage data. This
                data helps us understand how our product is used and how we can
                improve it.
              </FieldDescription>
            </Field>
            <Switch id="outline-demo-8h3-share-data" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  )
}

export function ProfileSettingsForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your profile information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <Label>Profile Photo</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="size-12">
                  <AvatarImage src="/abstract-profile.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="outline" type="button">
                  Change Photo
                </Button>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="profileFirstName">First Name</Label>
                <Input id="profileFirstName" defaultValue="John" />
              </Field>
              <Field>
                <Label htmlFor="profileLastName">Last Name</Label>
                <Input id="profileLastName" defaultValue="Doe" />
              </Field>
            </div>

            <Field>
              <Label htmlFor="profileEmail">Email</Label>
              <Input
                id="profileEmail"
                type="email"
                defaultValue="john@example.com"
              />
            </Field>
            <Field>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
            </Field>
            <Field>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                className="min-h-[80px]"
              />
            </Field>

            <FieldSet>
              <FieldLegend>Notification Preferences</FieldLegend>
              <FieldDescription>
                Manage your notification preferences.
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <Field>
                    <Label htmlFor="emailNotifications" className="text-sm">
                      Email notifications
                    </Label>
                    <FieldDescription>
                      Receive emails about new products, features, and more. If
                      you don&apos;t want to receive these emails, you can turn
                      them off.
                    </FieldDescription>
                  </Field>
                  <Switch
                    id="emailNotifications"
                    defaultChecked
                    className="ml-auto"
                  />
                </Field>
                <Field>
                  <Label htmlFor="pushNotifications" className="text-sm">
                    Push notifications
                  </Label>
                  <Switch id="pushNotifications" className="ml-auto" />
                </Field>
                <Field>
                  <Label htmlFor="marketingEmails" className="text-sm">
                    Marketing emails
                  </Label>
                  <Switch
                    id="marketingEmails"
                    defaultChecked
                    className="ml-auto"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <Field>
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function SurveyForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Survey</CardTitle>
        <CardDescription>
          Help us understand your needs better (5 minutes)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <Label htmlFor="surveyName">Name (Optional)</Label>
              <Input id="surveyName" placeholder="Your name" />
            </Field>
            <Field>
              <Label htmlFor="ageGroup">Age Group</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45-54">45-54</SelectItem>
                  <SelectItem value="55+">55+</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label>How often do you use our product?</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Daily</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rarely" id="rarely" />
                  <Label htmlFor="rarely">Rarely</Label>
                </div>
              </RadioGroup>
            </Field>
            <Field>
              <Label>
                Which features do you use most? (Select all that apply)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="dashboard" />
                  <Label htmlFor="dashboard" className="text-sm">
                    Dashboard
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="reports" />
                  <Label htmlFor="reports" className="text-sm">
                    Reports
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="analytics" />
                  <Label htmlFor="analytics" className="text-sm">
                    Analytics
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="integrations" />
                  <Label htmlFor="integrations" className="text-sm">
                    Integrations
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="api" />
                  <Label htmlFor="api" className="text-sm">
                    API Access
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="support" />
                  <Label htmlFor="support" className="text-sm">
                    Support
                  </Label>
                </div>
              </div>
            </Field>
            <Field>
              <Label>How satisfied are you with our product?</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very-satisfied" id="very-satisfied" />
                  <Label htmlFor="very-satisfied">Very Satisfied</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="satisfied" id="satisfied" />
                  <Label htmlFor="satisfied">Satisfied</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="neutral" id="neutral" />
                  <Label htmlFor="neutral">Neutral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dissatisfied" id="dissatisfied" />
                  <Label htmlFor="dissatisfied">Dissatisfied</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="very-dissatisfied"
                    id="very-dissatisfied"
                  />
                  <Label htmlFor="very-dissatisfied">Very Dissatisfied</Label>
                </div>
              </RadioGroup>
            </Field>
            <Field>
              <Label htmlFor="improvements">
                What improvements would you like to see?
              </Label>
              <Textarea
                id="improvements"
                placeholder="Share your suggestions for improvements..."
                className="min-h-[80px]"
              />
            </Field>
            <Field>
              <Label htmlFor="recommend">
                Would you recommend our product to others?
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select recommendation level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="definitely">Definitely</SelectItem>
                  <SelectItem value="probably">Probably</SelectItem>
                  <SelectItem value="maybe">Maybe</SelectItem>
                  <SelectItem value="probably-not">Probably Not</SelectItem>
                  <SelectItem value="definitely-not">Definitely Not</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function ComplexFormDemo() {
  const [startDate, setStartDate] = useState<Date>()
  const [experience, setExperience] = useState([3])
  const [skills, setSkills] = useState<string[]>([])
  const [workType, setWorkType] = useState("hybrid")

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Job Application Form</CardTitle>
        <CardDescription>
          Complete all sections to submit your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Personal Information</FieldLegend>
              <FieldDescription>
                Your basic contact information.
              </FieldDescription>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="complex-6d8-firstName">First Name</Label>
                    <Input
                      id="complex-6d8-firstName"
                      placeholder="John"
                      required
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="complex-6d8-lastName">Last Name</Label>
                    <Input
                      id="complex-6d8-lastName"
                      placeholder="Doe"
                      required
                    />
                  </Field>
                </div>

                <Field>
                  <Label htmlFor="complex-6d8-email">Email Address</Label>
                  <Input
                    id="complex-6d8-email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                  />
                  <FieldDescription>
                    We&apos;ll use this for all communications.
                  </FieldDescription>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="complex-6d8-phone">Phone Number</Label>
                    <Input
                      id="complex-6d8-phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="complex-6d8-birthdate">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="complex-6d8-birthdate"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? (
                            format(startDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Professional Background</FieldLegend>
              <FieldGroup>
                <Field>
                  <Label htmlFor="position">Position Applying For</Label>
                  <Select>
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">
                        Frontend Developer
                      </SelectItem>
                      <SelectItem value="backend">Backend Developer</SelectItem>
                      <SelectItem value="fullstack">
                        Full Stack Developer
                      </SelectItem>
                      <SelectItem value="designer">UI/UX Designer</SelectItem>
                      <SelectItem value="pm">Product Manager</SelectItem>
                      <SelectItem value="devops">DevOps Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Slider
                    id="experience"
                    value={experience}
                    onValueChange={setExperience}
                    max={20}
                    min={0}
                    step={1}
                  />
                  <FieldDescription>
                    {experience[0]} {experience[0] === 1 ? "year" : "years"} of
                    experience
                  </FieldDescription>
                </Field>

                <Field>
                  <Label>Employment Type Preference</Label>
                  <ToggleGroup
                    type="single"
                    value={workType}
                    onValueChange={setWorkType}
                    variant="outline"
                    className="w-full"
                  >
                    <ToggleGroupItem value="remote" className="flex-1">
                      Remote
                    </ToggleGroupItem>
                    <ToggleGroupItem value="office" className="flex-1">
                      Office
                    </ToggleGroupItem>
                    <ToggleGroupItem value="hybrid" className="flex-1">
                      Hybrid
                    </ToggleGroupItem>
                  </ToggleGroup>
                </Field>

                <Field>
                  <Label>Salary Expectations</Label>
                  <RadioGroup defaultValue="80-100">
                    <Field>
                      <RadioGroupItem value="60-80" id="salary-60-80" />
                      <Label htmlFor="salary-60-80" className="font-normal">
                        $60,000 - $80,000
                      </Label>
                    </Field>
                    <Field>
                      <RadioGroupItem value="80-100" id="salary-80-100" />
                      <Label htmlFor="salary-80-100" className="font-normal">
                        $80,000 - $100,000
                      </Label>
                    </Field>
                    <Field>
                      <RadioGroupItem value="100-120" id="salary-100-120" />
                      <Label htmlFor="salary-100-120" className="font-normal">
                        $100,000 - $120,000
                      </Label>
                    </Field>
                    <Field>
                      <RadioGroupItem value="120+" id="salary-120-plus" />
                      <Label htmlFor="salary-120-plus" className="font-normal">
                        $120,000+
                      </Label>
                    </Field>
                  </RadioGroup>
                </Field>

                <Field>
                  <Label>Technical Skills</Label>
                  <FieldDescription>Select all that apply</FieldDescription>
                  <div className="grid grid-cols-3 gap-3">
                    <Field>
                      <Checkbox
                        id="skill-js"
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSkills([...skills, "javascript"])
                          } else {
                            setSkills(skills.filter((s) => s !== "javascript"))
                          }
                        }}
                      />
                      <Label htmlFor="skill-js" className="font-normal">
                        JavaScript
                      </Label>
                    </Field>
                    <Field>
                      <Checkbox id="skill-ts" />
                      <Label htmlFor="skill-ts" className="font-normal">
                        TypeScript
                      </Label>
                    </Field>
                    <Field>
                      <Checkbox id="skill-react" />
                      <Label htmlFor="skill-react" className="font-normal">
                        React
                      </Label>
                    </Field>
                    <Field>
                      <Checkbox id="skill-node" />
                      <Label htmlFor="skill-node" className="font-normal">
                        Node.js
                      </Label>
                    </Field>
                    <Field>
                      <Checkbox id="skill-python" />
                      <Label htmlFor="skill-python" className="font-normal">
                        Python
                      </Label>
                    </Field>
                    <Field>
                      <Checkbox id="skill-docker" />
                      <Label htmlFor="skill-docker" className="font-normal">
                        Docker
                      </Label>
                    </Field>
                  </div>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Additional Information</FieldLegend>
              <FieldGroup>
                <Field>
                  <Label htmlFor="portfolio">Portfolio URL</Label>
                  <Input
                    id="portfolio"
                    type="url"
                    placeholder="https://yourportfolio.com"
                  />
                  <FieldDescription>
                    Optional: Share your portfolio or GitHub profile
                  </FieldDescription>
                </Field>

                <Field>
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Tell us why you're a great fit for this position..."
                    className="min-h-[120px]"
                  />
                  <FieldDescription>
                    Briefly describe your interest and qualifications (500 words
                    max)
                  </FieldDescription>
                </Field>

                <Field>
                  <Label htmlFor="resume">Upload Resume</Label>
                  <Input id="resume" type="file" accept=".pdf,.doc,.docx" />
                  <FieldDescription>
                    PDF or Word document (max 5MB)
                  </FieldDescription>
                </Field>

                <Field>
                  <Label htmlFor="references">References Available</Label>
                  <RadioGroup defaultValue="yes">
                    <Field>
                      <RadioGroupItem value="yes" id="ref-yes" />
                      <Label htmlFor="ref-yes" className="font-normal">
                        Yes, upon request
                      </Label>
                    </Field>
                    <Field>
                      <RadioGroupItem value="no" id="ref-no" />
                      <Label htmlFor="ref-no" className="font-normal">
                        No
                      </Label>
                    </Field>
                  </RadioGroup>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Verification</FieldLegend>
              <FieldGroup>
                <Field>
                  <Label htmlFor="verification">Enter Verification Code</Label>
                  <FieldDescription>
                    Enter the 6-digit code sent to your email
                  </FieldDescription>
                  <InputOTP id="verification" maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </Field>

                <Field>
                  <Field>
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <FieldDescription>
                      Receive updates about your application status
                    </FieldDescription>
                  </Field>
                  <Switch
                    id="notifications"
                    defaultChecked
                    className="ml-auto"
                  />
                </Field>

                <FieldGroup>
                  <Field>
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="font-normal">
                      I agree to the terms and conditions and privacy policy
                    </Label>
                  </Field>
                  <Field>
                    <Checkbox id="accurate" required />
                    <Label htmlFor="accurate" className="font-normal">
                      I confirm that all information provided is accurate
                    </Label>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </FieldSet>

            <Field className="flex-row">
              <Button variant="outline">Save Draft</Button>
              <Button type="submit">Submit Application</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function ComplexFormInvalidDemo() {
  const [startDate, setStartDate] = useState<Date>()
  const [experience, setExperience] = useState([3])
  const [skills, setSkills] = useState<string[]>([])
  const [workType, setWorkType] = useState("hybrid")

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Job Application Form (Validation State)</CardTitle>
        <CardDescription>
          Example showing all fields with invalid state
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Personal Information</FieldLegend>
              <FieldDescription>
                Your basic contact information.
              </FieldDescription>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field data-invalid>
                    <Label htmlFor="firstName-invalid">First Name</Label>
                    <Input
                      id="firstName-invalid"
                      placeholder="John"
                      required
                      aria-invalid
                    />
                  </Field>
                  <Field data-invalid>
                    <Label htmlFor="lastName-invalid">Last Name</Label>
                    <Input
                      id="lastName-invalid"
                      placeholder="Doe"
                      required
                      aria-invalid
                    />
                  </Field>
                </div>

                <Field data-invalid>
                  <Label htmlFor="email-invalid">Email Address</Label>
                  <Input
                    id="email-invalid"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                    aria-invalid
                  />
                  <FieldDescription>
                    We&apos;ll use this for all communications.
                  </FieldDescription>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field data-invalid>
                    <Label htmlFor="phone-invalid">Phone Number</Label>
                    <Input
                      id="phone-invalid"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      aria-invalid
                    />
                  </Field>
                  <Field data-invalid>
                    <Label htmlFor="birthdate-invalid">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="birthdate-invalid"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? (
                            format(startDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          aria-invalid
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Professional Background</FieldLegend>
              <FieldGroup>
                <Field data-invalid>
                  <Label htmlFor="position-invalid">
                    Position Applying For
                  </Label>
                  <Select>
                    <SelectTrigger id="position-invalid" aria-invalid>
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">
                        Frontend Developer
                      </SelectItem>
                      <SelectItem value="backend">Backend Developer</SelectItem>
                      <SelectItem value="fullstack">
                        Full Stack Developer
                      </SelectItem>
                      <SelectItem value="designer">UI/UX Designer</SelectItem>
                      <SelectItem value="pm">Product Manager</SelectItem>
                      <SelectItem value="devops">DevOps Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field data-invalid>
                  <Label htmlFor="experience-invalid">
                    Years of Experience
                  </Label>
                  <Slider
                    id="experience-invalid"
                    value={experience}
                    onValueChange={setExperience}
                    max={20}
                    min={0}
                    step={1}
                  />
                  <FieldDescription>
                    {experience[0]} {experience[0] === 1 ? "year" : "years"} of
                    experience
                  </FieldDescription>
                </Field>

                <Field data-invalid>
                  <Label>Employment Type Preference</Label>
                  <ToggleGroup
                    type="single"
                    value={workType}
                    onValueChange={setWorkType}
                    variant="outline"
                    className="w-full"
                  >
                    <ToggleGroupItem value="remote" className="flex-1">
                      Remote
                    </ToggleGroupItem>
                    <ToggleGroupItem value="office" className="flex-1">
                      Office
                    </ToggleGroupItem>
                    <ToggleGroupItem value="hybrid" className="flex-1">
                      Hybrid
                    </ToggleGroupItem>
                  </ToggleGroup>
                </Field>

                <Field data-invalid>
                  <Label>Salary Expectations</Label>
                  <RadioGroup defaultValue="80-100">
                    <Field data-invalid>
                      <RadioGroupItem value="60-80" id="salary-60-80-invalid" />
                      <Label
                        htmlFor="salary-60-80-invalid"
                        className="font-normal"
                      >
                        $60,000 - $80,000
                      </Label>
                    </Field>
                    <Field data-invalid>
                      <RadioGroupItem
                        value="80-100"
                        id="salary-80-100-invalid"
                      />
                      <Label
                        htmlFor="salary-80-100-invalid"
                        className="font-normal"
                      >
                        $80,000 - $100,000
                      </Label>
                    </Field>
                    <Field data-invalid>
                      <RadioGroupItem
                        value="100-120"
                        id="salary-100-120-invalid"
                      />
                      <Label
                        htmlFor="salary-100-120-invalid"
                        className="font-normal"
                      >
                        $100,000 - $120,000
                      </Label>
                    </Field>
                    <Field data-invalid>
                      <RadioGroupItem
                        value="120+"
                        id="salary-120-plus-invalid"
                      />
                      <Label
                        htmlFor="salary-120-plus-invalid"
                        className="font-normal"
                      >
                        $120,000+
                      </Label>
                    </Field>
                  </RadioGroup>
                </Field>

                <Field data-invalid>
                  <Label>Technical Skills</Label>
                  <FieldDescription>Select all that apply</FieldDescription>
                  <div className="grid grid-cols-3 gap-3">
                    <Field data-invalid>
                      <Checkbox
                        id="skill-js-invalid"
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSkills([...skills, "javascript"])
                          } else {
                            setSkills(skills.filter((s) => s !== "javascript"))
                          }
                        }}
                      />
                      <Label htmlFor="skill-js-invalid" className="font-normal">
                        JavaScript
                      </Label>
                    </Field>
                    <Field data-invalid>
                      <Checkbox id="skill-ts-invalid" />
                      <Label htmlFor="skill-ts-invalid" className="font-normal">
                        TypeScript
                      </Label>
                    </Field>
                    <Field data-invalid>
                      <Checkbox id="skill-react-invalid" />
                      <Label
                        htmlFor="skill-react-invalid"
                        className="font-normal"
                      >
                        React
                      </Label>
                    </Field>
                    <Field data-invalid>
                      <Checkbox id="skill-node-invalid" />
                      <Label
                        htmlFor="skill-node-invalid"
                        className="font-normal"
                      >
                        Node.js
                      </Label>
                    </Field>
                    <Field data-invalid>
                      <Checkbox id="skill-python-invalid" />
                      <Label
                        htmlFor="skill-python-invalid"
                        className="font-normal"
                      >
                        Python
                      </Label>
                    </Field>
                    <Field data-invalid>
                      <Checkbox id="skill-docker-invalid" />
                      <Label
                        htmlFor="skill-docker-invalid"
                        className="font-normal"
                      >
                        Docker
                      </Label>
                    </Field>
                  </div>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Additional Information</FieldLegend>
              <FieldGroup>
                <Field data-invalid>
                  <Label htmlFor="portfolio-invalid">Portfolio URL</Label>
                  <Input
                    id="portfolio-invalid"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    aria-invalid
                  />
                  <FieldDescription>
                    Optional: Share your portfolio or GitHub profile
                  </FieldDescription>
                </Field>

                <Field data-invalid>
                  <Label htmlFor="coverLetter-invalid">Cover Letter</Label>
                  <Textarea
                    id="coverLetter-invalid"
                    placeholder="Tell us why you're a great fit for this position..."
                    className="min-h-[120px]"
                    aria-invalid
                  />
                  <FieldDescription>
                    Briefly describe your interest and qualifications (500 words
                    max)
                  </FieldDescription>
                </Field>

                <Field data-invalid>
                  <Label htmlFor="resume-invalid">Upload Resume</Label>
                  <Input
                    id="resume-invalid"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    aria-invalid
                  />
                  <FieldDescription>
                    PDF or Word document (max 5MB)
                  </FieldDescription>
                </Field>

                <Field data-invalid>
                  <Label htmlFor="references-invalid">
                    References Available
                  </Label>
                  <RadioGroup defaultValue="yes" aria-invalid>
                    <Field data-invalid>
                      <RadioGroupItem value="yes" id="ref-yes-invalid" />
                      <Label htmlFor="ref-yes-invalid" className="font-normal">
                        Yes, upon request
                      </Label>
                    </Field>
                    <Field data-invalid>
                      <RadioGroupItem value="no" id="ref-no-invalid" />
                      <Label htmlFor="ref-no-invalid" className="font-normal">
                        No
                      </Label>
                    </Field>
                  </RadioGroup>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>Verification</FieldLegend>
              <FieldGroup>
                <Field data-invalid>
                  <Label htmlFor="verification-invalid">
                    Enter Verification Code
                  </Label>
                  <FieldDescription>
                    Enter the 6-digit code sent to your email
                  </FieldDescription>
                  <InputOTP id="verification-invalid" maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} aria-invalid />
                      <InputOTPSlot index={1} aria-invalid />
                      <InputOTPSlot index={2} aria-invalid />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} aria-invalid />
                      <InputOTPSlot index={4} aria-invalid />
                      <InputOTPSlot index={5} aria-invalid />
                    </InputOTPGroup>
                  </InputOTP>
                </Field>

                <Field data-invalid>
                  <Field>
                    <Label htmlFor="notifications-invalid">
                      Email Notifications
                    </Label>
                    <FieldDescription>
                      Receive updates about your application status
                    </FieldDescription>
                  </Field>
                  <Switch
                    id="notifications-invalid"
                    defaultChecked
                    className="ml-auto"
                    aria-invalid
                  />
                </Field>

                <FieldGroup>
                  <Field data-invalid>
                    <Checkbox id="terms-invalid" required />
                    <Label htmlFor="terms-invalid" className="font-normal">
                      I agree to the terms and conditions and privacy policy
                    </Label>
                  </Field>

                  <Field data-invalid>
                    <Checkbox id="accurate-invalid" required />
                    <Label htmlFor="accurate-invalid" className="font-normal">
                      I confirm that all information provided is accurate
                    </Label>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </FieldSet>

            <Field className="flex-row">
              <Button variant="outline">Save Draft</Button>
              <Button type="submit">Submit Application</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function CheckoutForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>
          Complete your order by filling in the details below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Shipping Information</FieldLegend>
              <FieldDescription>
                Enter your shipping address where we&apos;ll deliver your order
              </FieldDescription>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="checkout-7j9-first-name">First Name</Label>
                    <Input
                      id="checkout-7j9-first-name"
                      placeholder="John"
                      required
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="checkout-7j9-last-name">Last Name</Label>
                    <Input
                      id="checkout-7j9-last-name"
                      placeholder="Doe"
                      required
                    />
                  </Field>
                </div>
                <Field>
                  <Label htmlFor="checkout-7j9-email">Email</Label>
                  <Input
                    id="checkout-7j9-email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                  />
                  <FieldDescription>
                    We&apos;ll send your receipt to this email
                  </FieldDescription>
                </Field>
                <Field>
                  <Label htmlFor="checkout-7j9-address">Street Address</Label>
                  <Input
                    id="checkout-7j9-address"
                    placeholder="123 Main Street"
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="checkout-7j9-address2">
                    Apartment, suite, etc. (optional)
                  </Label>
                  <Input
                    id="checkout-7j9-address2"
                    placeholder="Apartment 4B"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Field className="sm:col-span-2">
                    <Label htmlFor="checkout-7j9-city">City</Label>
                    <Input
                      id="checkout-7j9-city"
                      placeholder="New York"
                      required
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="checkout-7j9-state">State</Label>
                    <Select defaultValue="">
                      <SelectTrigger id="checkout-7j9-state">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca">CA</SelectItem>
                        <SelectItem value="ny">NY</SelectItem>
                        <SelectItem value="tx">TX</SelectItem>
                        <SelectItem value="fl">FL</SelectItem>
                        <SelectItem value="wa">WA</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <Label htmlFor="checkout-7j9-zip">ZIP Code</Label>
                    <Input id="checkout-7j9-zip" placeholder="10001" required />
                  </Field>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Field>
                    <Label htmlFor="checkout-7j9-country-code">Code</Label>
                    <Select defaultValue="us">
                      <SelectTrigger id="checkout-7j9-country-code">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">+1</SelectItem>
                        <SelectItem value="uk">+44</SelectItem>
                        <SelectItem value="ca">+1</SelectItem>
                        <SelectItem value="au">+61</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field className="col-span-3">
                    <Label htmlFor="checkout-7j9-phone">Phone Number</Label>
                    <Input
                      id="checkout-7j9-phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      required
                    />
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Payment Method</FieldLegend>
              <FieldDescription>
                All transactions are secure and encrypted
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <Label htmlFor="checkout-7j9-card-name">Name on Card</Label>
                  <Input
                    id="checkout-7j9-card-name"
                    placeholder="John Doe"
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="checkout-7j9-card-number">Card Number</Label>
                  <Input
                    id="checkout-7j9-card-number"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  <FieldDescription>
                    Enter your 16-digit card number
                  </FieldDescription>
                </Field>
                <div className="grid grid-cols-3 gap-4">
                  <Field>
                    <Label htmlFor="checkout-7j9-exp-month">Month</Label>
                    <Select defaultValue="">
                      <SelectTrigger id="checkout-7j9-exp-month">
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="01">01</SelectItem>
                        <SelectItem value="02">02</SelectItem>
                        <SelectItem value="03">03</SelectItem>
                        <SelectItem value="04">04</SelectItem>
                        <SelectItem value="05">05</SelectItem>
                        <SelectItem value="06">06</SelectItem>
                        <SelectItem value="07">07</SelectItem>
                        <SelectItem value="08">08</SelectItem>
                        <SelectItem value="09">09</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="11">11</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <Label htmlFor="checkout-7j9-exp-year">Year</Label>
                    <Select defaultValue="">
                      <SelectTrigger id="checkout-7j9-exp-year">
                        <SelectValue placeholder="YYYY" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                        <SelectItem value="2028">2028</SelectItem>
                        <SelectItem value="2029">2029</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <Label htmlFor="checkout-7j9-cvv">CVV</Label>
                    <Input id="checkout-7j9-cvv" placeholder="123" required />
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Billing Address</FieldLegend>
              <FieldDescription>
                The billing address associated with your payment method
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <Checkbox id="checkout-7j9-same-as-shipping" defaultChecked />
                  <Label
                    htmlFor="checkout-7j9-same-as-shipping"
                    className="font-normal"
                  >
                    Same as shipping address
                  </Label>
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Additional Options</FieldLegend>
              <FieldDescription>
                Choose how you&apos;d like us to stay in touch
              </FieldDescription>
              <FieldGroup>
                <FieldGroup>
                  <Field>
                    <Checkbox id="checkout-7j9-save-info" />
                    <Label
                      htmlFor="checkout-7j9-save-info"
                      className="font-normal"
                    >
                      Save my information for faster checkout next time
                    </Label>
                  </Field>
                  <Field>
                    <Checkbox id="checkout-7j9-newsletter" />
                    <Label
                      htmlFor="checkout-7j9-newsletter"
                      className="font-normal"
                    >
                      Email me with news and offers
                    </Label>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </FieldSet>
            <Field>
              <Button type="submit" className="flex-1">
                Complete Order
              </Button>
              <Button variant="outline" className="flex-1">
                Return to Cart
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
