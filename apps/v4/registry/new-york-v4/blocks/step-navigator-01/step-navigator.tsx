import * as React from 'react';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Progress } from '@/registry/new-york-v4/ui/progress';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  validation?: () => boolean | string;
  onEnter?: () => void;
  onExit?: () => void;
  disabled?: boolean;
}

interface StepNavigatorProps {
  steps: Step[];
  initialStep?: number;
  onComplete?: () => void;
  linear?: boolean;
  className?: string;
}

export function StepNavigator({ 
  steps, 
  initialStep = 0, 
  onComplete, 
  className, 
  linear = true
}: StepNavigatorProps) { 
  // State for current step and completed steps
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<Set<string>>(new Set());
  const [validationError, setValidationError] = React.useState<string | false>(false);

  // Reset state when steps or initialStep changes
  React.useEffect(() => {
    const safeStep = steps.length > 0 ? Math.max(0, Math.min(initialStep, steps.length - 1)) : 0;
    setCurrentStep(safeStep);
    setCompletedSteps(new Set());
    setValidationError(false);
  }, [steps, initialStep]);

  // Get current step data - handle empty steps gracefully
  const currentStepData = steps.length > 0 ? steps[currentStep] : null;
  if (!currentStepData && steps.length > 0) {
    console.error(`Step data not found for index ${currentStep}`);
    return null;
  }

  // Validate current step
  const validateCurrentStep = () => {
    if (!currentStepData || !currentStepData.validation) {
      return true;
    }
    try {
      const result = currentStepData.validation();
      return result;
    } catch (error) {
      console.error('Step validation error:', error);
      return 'An error occurred during validation.';
    }
  };

  // Call onEnter when step changes
  React.useEffect(() => {
    if (currentStepData.onEnter) {
      try {
        currentStepData.onEnter();
      } catch (error) {
        console.error('Step onEnter error:', error);
      }
    }
  }, [currentStep, steps]);

  // Call onEnter when step changes
  React.useEffect(() => {
    if (currentStepData?.onEnter) {
      try {
        currentStepData.onEnter();
      } catch (error) {
        console.error('Step onEnter error:', error);
      }
    }
  }, [currentStep, steps]);

  const handleNext = () => {
    if (!currentStepData) return;
    
    if (currentStep < steps.length - 1) {
      const validationResult = validateCurrentStep();
      if (validationResult !== true) {
        setValidationError(validationResult || 'Please fill in all required fields correctly.');
        return;
      }
      setValidationError(false);
      
      // Mark current step as completed
      setCompletedSteps(prev => new Set(prev).add(currentStepData.id));
      
      if (currentStepData.onExit) {
        try {
          currentStepData.onExit();
        } catch (error) {
          console.error('Step onExit error:', error);
        }
      }
      
      setCurrentStep((prev: number) => prev + 1);
    } else {
      if (onComplete) {
        try {
          onComplete();
        } catch (error) {
          console.error('Step onComplete error:', error);
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev: number) => prev - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      const targetStep = steps[stepIndex];
      if (!targetStep.disabled && (!linear || stepIndex <= currentStep)) {
        setCurrentStep(stepIndex);
      }
    }
  };

  // Helper functions for step state
  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.has(steps[stepIndex]?.id || '');
  };

  const isStepCurrent = (stepIndex: number) => {
    return stepIndex === currentStep;
  };

  // Calculate progress percentage based on completed steps
  const progress = steps.length > 0 
    ? (Array.from(completedSteps).length / steps.length) * 100 
    : 0;

  return (
    <div className={cn("space-y-6", className)} aria-label="Step Navigator">
      {/* Progress Bar */}
      <div className="space-y-2">
        {steps.length > 0 ? (
          <>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="font-medium text-sm text-muted-foreground whitespace-nowrap">
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className="font-medium text-sm text-muted-foreground whitespace-nowrap">
                {currentStepData?.title}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </>
        ) : (
          <div className="h-2 bg-muted rounded-full" aria-hidden="true" />
        )}
      </div>

      {/* Step Indicators */}
      {steps.length > 0 && (
        <div className="flex justify-between flex-wrap gap-4" role="navigation" aria-label="Steps">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              disabled={step.disabled || (linear && index > currentStep && !completedSteps.has(step.id))}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-full cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                {
                  "text-primary font-medium": index === currentStep,
                  "text-muted-foreground hover:text-primary": !step.disabled && index !== currentStep && (linear ? index <= currentStep : true),
                  "text-muted-foreground cursor-not-allowed": step.disabled || (linear && index > currentStep && !completedSteps.has(step.id)),
                }
              )}
              aria-current={isStepCurrent(index) ? "step" : undefined}
              aria-disabled={step.disabled || (linear && index > currentStep && !completedSteps.has(step.id))}
              aria-label={`Step ${index + 1}: ${step.title}`}
            >
              <div
                className={cn(
                  "flex items-center justify-center size-8 rounded-full border-2 transition-all",
                  {
                    "border-primary bg-primary text-primary-foreground": index === currentStep,
                    "border-muted-foreground bg-background hover:border-primary": !step.disabled && index !== currentStep && (linear ? index <= currentStep : true),
                    "border-muted-foreground/50 bg-background cursor-not-allowed": step.disabled || (linear && index > currentStep && !completedSteps.has(step.id)),
                    "border-primary bg-primary/10 text-primary": completedSteps.has(step.id) && index !== currentStep,
                  }
                )}
              >
                {completedSteps.has(step.id) ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs font-medium whitespace-nowrap">
                {step.title}
                {step.disabled && (
                  <span className="sr-only"> (disabled)</span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Step Content */}
      {steps.length > 0 ? (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>{currentStepData?.title}</CardTitle>
            {currentStepData?.description && (
              <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
            )}
          </CardHeader>
          <CardContent>
            {currentStepData ? currentStepData.content : <div className="text-muted-foreground">No content available for this step.</div>}
            {validationError && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md">
                {validationError}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
            onClick={handleNext}
            disabled={currentStepData?.disabled}
            aria-label={currentStep === steps.length - 1 ? 'Complete process' : 'Go to next step'}
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No steps available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
