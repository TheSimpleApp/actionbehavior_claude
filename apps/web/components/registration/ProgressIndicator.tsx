interface Step {
  id: number;
  name: string;
}

interface ProgressIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export function ProgressIndicator({ currentStep, steps }: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex items-center">
            <div className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    currentStep >= step.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }
                  font-semibold transition-colors
                `}
              >
                {step.id}
              </div>
              <span
                className={`
                  ml-2 text-sm font-medium
                  ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}
                `}
              >
                {step.name}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-1 mx-4
                  ${currentStep > step.id ? 'bg-primary' : 'bg-gray-200'}
                  transition-colors
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
