"use client"

import type React from "react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Home,
  Lock,
  Mail,
  Phone,
  Shield,
  Sparkles,
  Upload,
  User,
  Users,
  X,
} from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/registry/new-york-v4/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york-v4/ui/avatar"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent } from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Progress } from "@/registry/new-york-v4/ui/progress"
import { Separator } from "@/registry/new-york-v4/ui/separator"

// Form schemas
const basicInfoSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const contactRoleSchema = z.object({
  phoneNumber: z.string().optional(),
  role: z.enum(["owner", "agent", "viewer"], {
    required_error: "Please select a role",
  }),
})

type BasicInfoData = z.infer<typeof basicInfoSchema>
type ContactRoleData = z.infer<typeof contactRoleSchema>

interface RegistrationData extends BasicInfoData, ContactRoleData {
  profileImage?: string
  documents?: Array<{ type: string; file: File }>
}

const roleOptions = [
  {
    value: "owner",
    label: "Property Owner",
    description: "List and manage your properties",
    icon: Home,
    color:
      "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    value: "agent",
    label: "Real Estate Agent",
    description: "Represent clients and manage listings",
    icon: Building2,
    color:
      "bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    value: "viewer",
    label: "Property Seeker",
    description: "Browse and inquire about properties",
    icon: Users,
    color:
      "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-300",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
]

const documentTypes = [
  { value: "id", label: "Government ID", icon: Shield },
  { value: "license", label: "Real Estate License", icon: FileText },
  { value: "business", label: "Business Registration", icon: Building2 },
  { value: "other", label: "Other Document", icon: FileText },
]

export function RegistrationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registrationData, setRegistrationData] = useState<
    Partial<RegistrationData>
  >({})
  const [uploadedDocuments, setUploadedDocuments] = useState<
    Array<{ type: string; file: File; preview: string }>
  >([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = 5
  const progress = ((currentStep + 1) / totalSteps) * 100

  const stepTitles = [
    "Tell us about yourself",
    "Choose your role (optional)",
    "Upload a profile picture (optional)",
    "Verify your identity",
    "Review Your Information",
  ]

  const stepDescriptions = [
    "Create Your Account",
    "",
    "",
    "Upload documents to build trust (optional)",
    "Make sure everything looks correct",
  ]

  // Form hooks
  const basicForm = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: registrationData,
  })

  const contactForm = useForm<ContactRoleData>({
    resolver: zodResolver(contactRoleSchema),
    defaultValues: registrationData,
  })

  const handleNextStep = async () => {
    let isValid = false

    switch (currentStep) {
      case 0:
        isValid = await basicForm.trigger()
        if (isValid) {
          const data = basicForm.getValues()
          setRegistrationData((prev) => ({ ...prev, ...data }))
        }
        break
      case 1:
        isValid = await contactForm.trigger()
        if (isValid) {
          const data = contactForm.getValues()
          setRegistrationData((prev) => ({ ...prev, ...data }))
        }
        break
      case 2:
      case 3:
        isValid = true // Optional steps
        break
    }

    if (isValid && currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      setUploadedDocuments((prev) => [...prev, { type, file, preview }])
    }
  }

  const removeDocument = (index: number) => {
    setUploadedDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    alert("Registration successful!")
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Create Your Account</h2>
              <p className="text-muted-foreground">
                Join thousands of property professionals
              </p>
            </div> */}

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="wamunyimamukelabai@example.com"
                    className="h-12 pl-10"
                    {...basicForm.register("email")}
                  />
                </div>
                {basicForm.formState.errors.email && (
                  <p className="text-destructive text-sm">
                    {basicForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    id="fullName"
                    placeholder="Wamunyima Mukelabai"
                    className="h-12 pl-10"
                    {...basicForm.register("fullName")}
                  />
                </div>
                {basicForm.formState.errors.fullName && (
                  <p className="text-destructive text-sm">
                    {basicForm.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="h-12 pr-10 pl-10"
                      placeholder="********"
                      {...basicForm.register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0 h-12 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {basicForm.formState.errors.password && (
                    <p className="text-destructive text-sm">
                      {basicForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="h-12 pr-10 pl-10"
                      placeholder="********"
                      {...basicForm.register("confirmPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0 h-12 px-3 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {basicForm.formState.errors.confirmPassword && (
                    <p className="text-destructive text-sm">
                      {basicForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Choose Your Role</h2>
              <p className="text-muted-foreground">
                This helps us personalize your experience
              </p>
            </div> */}

            <div className="space-y-3">
              <div className="grid gap-3">
                {roleOptions.map((role) => {
                  const Icon = role.icon
                  const isSelected = contactForm.watch("role") === role.value
                  return (
                    <motion.div
                      key={role.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      )}
                      onClick={() =>
                        contactForm.setValue("role", role.value as any)
                      }
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn("rounded-lg p-3", role.color)}>
                          <Icon className={cn("h-6 w-6", role.iconColor)} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{role.label}</h3>
                            {isSelected && (
                              <Check className="text-primary h-5 w-5" />
                            )}
                          </div>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {role.description}
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        value={role.value}
                        {...contactForm.register("role")}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </motion.div>
                  )
                })}
              </div>
              {contactForm.formState.errors.role && (
                <p className="text-destructive text-center text-sm">
                  {contactForm.formState.errors.role.message}
                </p>
              )}

              <Separator className="my-6" />

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                  Phone Number{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <div className="relative">
                  <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+260 (977) 269 886"
                    className="h-12 pl-10"
                    {...contactForm.register("phoneNumber")}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Add Your Photo</h2>
              <p className="text-muted-foreground">
                Help others recognize you (optional)
              </p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <Avatar className="border-background h-32 w-32 border-4 shadow-lg">
                  <AvatarImage
                    src={registrationData.profileImage || "/placeholder.svg"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-2xl text-white">
                    {registrationData.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -right-2 -bottom-2">
                  <Button
                    size="sm"
                    className="h-10 w-10 rounded-full p-0 shadow-lg"
                    asChild
                  >
                    <label htmlFor="profileImage" className="cursor-pointer">
                      <Camera className="h-4 w-4" />
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const preview = URL.createObjectURL(file)
                            setRegistrationData((prev) => ({
                              ...prev,
                              profileImage: preview,
                            }))
                          }
                        }}
                      />
                    </label>
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-center">
                <Button variant="outline" size="lg" className="relative">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const preview = URL.createObjectURL(file)
                        setRegistrationData((prev) => ({
                          ...prev,
                          profileImage: preview,
                        }))
                      }
                    }}
                  />
                </Button>
                <p className="text-muted-foreground text-xs">
                  JPG, PNG or GIF (max 5MB)
                </p>
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Verify Your Identity</h2>
              <p className="text-muted-foreground">
                Upload documents to build trust (optional)
              </p>
            </div> */}

            <div className="space-y-3">
              {documentTypes.map((docType) => {
                const Icon = docType.icon
                const hasDocument = uploadedDocuments.some(
                  (doc) => doc.type === docType.value
                )
                return (
                  <div
                    key={docType.value}
                    className={cn(
                      "rounded-xl border-2 border-dashed p-4 transition-all duration-200",
                      hasDocument
                        ? "border-green-300 bg-green-50 dark:bg-green-950"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-accent rounded-lg p-2">
                          <Icon className="text-muted-foreground h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{docType.label}</h4>
                          {hasDocument && (
                            <p className="text-sm text-green-600 dark:text-green-400">
                              Document uploaded
                            </p>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="relative">
                        <Upload className="mr-2 h-4 w-4" />
                        {hasDocument ? "Replace" : "Upload"}
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="absolute inset-0 cursor-pointer opacity-0"
                          onChange={(e) => handleFileUpload(e, docType.value)}
                        />
                      </Button>
                    </div>
                  </div>
                )
              })}

              {uploadedDocuments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Uploaded Documents</h4>
                  {uploadedDocuments.map((doc, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-accent flex items-center justify-between rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-muted-foreground h-4 w-4" />
                        <div>
                          <p className="text-sm font-medium">
                            {
                              documentTypes.find((t) => t.value === doc.type)
                                ?.label
                            }
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {doc.file.name}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Review Your Information</h2>
              <p className="text-muted-foreground">
                Make sure everything looks correct
              </p>
            </div> */}

            <div className="space-y-3">
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={registrationData.profileImage || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {registrationData.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {registrationData.fullName}
                    </h3>
                    <p className="text-muted-foreground">
                      {registrationData.email}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between border-b py-2">
                    <span className="text-muted-foreground">Role</span>
                    <Badge variant="secondary" className="capitalize">
                      {
                        roleOptions.find(
                          (r) => r.value === registrationData.role
                        )?.label
                      }
                    </Badge>
                  </div>
                  {registrationData.phoneNumber && (
                    <div className="flex items-center justify-between border-b py-2">
                      <span className="text-muted-foreground">Phone</span>
                      <span>{registrationData.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-b py-2">
                    <span className="text-muted-foreground">Documents</span>
                    <span>{uploadedDocuments.length} uploaded</span>
                  </div>
                </div>
              </Card>

              <div className="bg-muted/50 rounded-lg border p-4">
                <p className="text-muted-foreground text-center text-sm">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn("mx-auto w-full max-w-2xl", className)} {...props}>
      {/* Progress Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="text-sm font-bold text-white">
                {currentStep + 1}
              </span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">
                {stepTitles[currentStep]}
              </h1>
              <p className="text-muted-foreground text-sm">
                {stepDescriptions[currentStep]}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {currentStep + 1} of {totalSteps}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Content */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep < totalSteps - 1 ? (
              <Button
                onClick={handleNextStep}
                className="flex items-center gap-2"
              >
                {currentStep === 2 || currentStep === 3 ? "Skip" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </motion.div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <a href="/" className="text-primary font-medium hover:underline">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  )
}
