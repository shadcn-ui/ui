interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto px-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={index} className="relative flex-1 flex flex-col items-center text-center">
            {/* Connector line: LEFT side only (avoid duplicating lines between steps) */}
            {index !== 0 && (
              <div className="absolute -left-1/2 top-4 w-full h-0.5 bg-gray-600" />
            )}

            {/* Step circle */}
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold border z-10
                ${
                  isCompleted
                    ? "bg-white text-black border-white"
                    : isActive
                    ? "bg-gray-300 text-black border-gray-300"
                    : "bg-transparent text-gray-500 border-gray-600"
                }`}
            >
              {index + 1}
            </div>

            {/* Step label */}
            <div className="mt-2 text-xs text-gray-400">{step}</div>
          </div>
        );
      })}
    </div>
  );
}
