"use client";

import { useState } from "react";

import { Button } from "@/registry/new-york-v4/ui/button";
import { Stepper } from "./components/stepper";

const steps = ["Account Info", "Address", "Payment", "Review"];

export default function StepperDemo() {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <p className="text-sm text-muted-foreground">Fill in your account information here.</p>;
      case 1:
        return <p className="text-sm text-muted-foreground">Enter your address details.</p>;
      case 2:
        return <p className="text-sm text-muted-foreground">Choose your payment method.</p>;
      case 3:
        return <p className="text-sm text-muted-foreground">Review your information and confirm.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      <Stepper steps={steps} currentStep={currentStep} />

      <div className="bg-muted rounded-lg p-6">
        {renderStepContent()}
      </div>

      <div className="flex justify-between">
        <Button onClick={prev} disabled={currentStep === 0} variant="outline">
          Previous
        </Button>
        <Button onClick={next} disabled={currentStep === steps.length - 1}>
          Next
        </Button>
      </div>
    </div>
  );
}
