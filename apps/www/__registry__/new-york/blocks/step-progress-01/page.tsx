"use client"

import { StepProgress } from "./components/step-progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Shield,
  Settings,
  Users,
  ShoppingCart,
  CreditCard,
  Package,
  CheckCircle,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react"
import { useState } from "react"

export default function StepProgressPage() {
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(2)
  const [currentCheckoutStep, setCurrentCheckoutStep] = useState(1)

  const onboardingSteps = [
    {
      id: "account",
      title: "Create Account",
      description: "Set up your basic account information with email and password",
      status: "completed" as const,
      icon: User,
      optional: false,
    },
    {
      id: "profile",
      title: "Complete Profile",
      description: "Add your personal and professional details to personalize your experience",
      status: "completed" as const,
      icon: Mail,
      optional: false,
    },
    {
      id: "verification",
      title: "Email Verification",
      description: "Verify your email address to secure your account and enable notifications",
      status: "current" as const,
      icon: Shield,
      optional: false,
    },
    {
      id: "preferences",
      title: "Set Preferences",
      description: "Customize your experience and notification settings to match your workflow",
      status: "pending" as const,
      icon: Settings,
      optional: true,
    },
    {
      id: "team",
      title: "Invite Team",
      description: "Add team members and set up collaboration tools for your organization",
      status: "pending" as const,
      icon: Users,
      optional: true,
    },
  ]

  const checkoutSteps = [
    {
      id: "cart",
      title: "Review Cart",
      description: "Review items, quantities, and pricing before proceeding",
      status: "completed" as const,
      icon: ShoppingCart,
    },
    {
      id: "payment",
      title: "Payment Details",
      description: "Enter secure payment information and billing address",
      status: "error" as const,
      icon: CreditCard,
      errorMessage: "Invalid credit card number. Please check and try again.",
    },
    {
      id: "shipping",
      title: "Shipping Options",
      description: "Choose delivery method and shipping address",
      status: "pending" as const,
      icon: Package,
    },
    {
      id: "confirmation",
      title: "Order Confirmation",
      description: "Review final order details and complete purchase",
      status: "pending" as const,
      icon: CheckCircle,
    },
  ]

  const approvalSteps = [
    {
      id: "submit",
      title: "Application Submitted",
      description: "Your application has been received and is being processed by our team",
      status: "completed" as const,
    },
    {
      id: "review",
      title: "Under Review",
      description: "Our team is carefully reviewing your application and supporting documents",
      status: "in-progress" as const,
    },
    {
      id: "interview",
      title: "Interview Process",
      description: "Complete the interview and technical assessment phase",
      status: "pending" as const,
    },
    {
      id: "decision",
      title: "Final Decision",
      description: "Receive the final decision on your application via email",
      status: "pending" as const,
    },
  ]

  const handleStepClick = (stepIndex: number, steps: any[], setter: any) => {
    if (steps[stepIndex].status === "completed" || steps[stepIndex].status === "current") {
      setter(stepIndex)
    }
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold">Step Progress Block</h1>
          <Badge variant="secondary" className="text-xs">
            Responsive
          </Badge>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          Fully responsive step progress components that adapt to different screen sizes and orientations.
        </p>

        {/* Responsive Indicators */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            <span className="sm:hidden">Mobile View</span>
            <span className="hidden sm:inline">Mobile</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 lg:hidden">
            <Tablet className="w-3 h-3" />
            <span>Tablet View</span>
          </div>
          <div className="hidden lg:flex items-center gap-1">
            <Monitor className="w-3 h-3" />
            <span>Desktop View</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:gap-8">
        {/* Responsive Interactive Example */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Responsive Interactive Onboarding</CardTitle>
            <CardDescription className="text-sm">
              Automatically switches between vertical (mobile) and horizontal (desktop) layouts. Try resizing your
              browser window!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <StepProgress
              steps={onboardingSteps}
              currentStep={currentOnboardingStep}
              onStepClick={(index) => handleStepClick(index, onboardingSteps, setCurrentOnboardingStep)}
              orientation="responsive"
              compact="responsive"
              showProgress
              clickableSteps
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentOnboardingStep(Math.max(0, currentOnboardingStep - 1))}
                disabled={currentOnboardingStep === 0}
                className="w-full sm:w-auto"
              >
                Previous Step
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  setCurrentOnboardingStep(Math.min(onboardingSteps.length - 1, currentOnboardingStep + 1))
                }
                disabled={currentOnboardingStep === onboardingSteps.length - 1}
                className="w-full sm:w-auto"
              >
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mobile-Optimized Checkout */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Mobile-Optimized Checkout</CardTitle>
            <CardDescription className="text-sm">
              Compact design perfect for mobile checkout flows with error handling.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepProgress
              steps={checkoutSteps}
              currentStep={currentCheckoutStep}
              onStepClick={(index) => handleStepClick(index, checkoutSteps, setCurrentCheckoutStep)}
              orientation="vertical"
              compact="responsive"
              showProgress
              clickableSteps
            />
          </CardContent>
        </Card>

        {/* Desktop Horizontal Layout */}
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Desktop Horizontal Layout</CardTitle>
            <CardDescription className="text-sm">
              Full horizontal layout optimized for desktop interfaces and wide screens.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepProgress steps={onboardingSteps} orientation="horizontal" showProgress compact={false} />
          </CardContent>
        </Card>

        {/* Compact Approval Process */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Compact Approval Process</CardTitle>
            <CardDescription className="text-sm">
              Ultra-compact mode for sidebars and constrained spaces with loading states.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepProgress steps={approvalSteps} compact={true} showConnector={false} orientation="vertical" />
          </CardContent>
        </Card>

        {/* Feature Showcase */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Responsive Features</CardTitle>
            <CardDescription className="text-sm">
              Key responsive features that adapt to different screen sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Layout Switching</h4>
                <p className="text-xs text-muted-foreground">
                  Automatically switches between vertical and horizontal layouts based on screen size
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Adaptive Sizing</h4>
                <p className="text-xs text-muted-foreground">
                  Icons, text, and spacing adjust automatically for optimal viewing on any device
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Touch Optimization</h4>
                <p className="text-xs text-muted-foreground">
                  Larger touch targets and improved interactions for mobile devices
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Smart Tooltips</h4>
                <p className="text-xs text-muted-foreground">Descriptions shown as tooltips on mobile to save space</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Responsive Text</h4>
                <p className="text-xs text-muted-foreground">
                  Typography scales appropriately across different screen sizes
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Flexible Progress</h4>
                <p className="text-xs text-muted-foreground">Progress bars and indicators adapt to available space</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
