interface FormNavigationProps {
  onNext?: () => void;
  onPrev?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  canProceed?: boolean;
}

export function FormNavigation({
  onNext,
  onPrev,
  isFirstStep = false,
  isLastStep = false,
  isSubmitting = false,
  canProceed = true,
}: FormNavigationProps) {
  return (
    <div className="flex justify-between mt-8 pt-6 border-t">
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirstStep}
        className={`
          px-6 py-2 rounded-lg font-medium
          ${
            isFirstStep
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }
          transition-colors
        `}
      >
        Previous
      </button>

      {isLastStep ? (
        <button
          type="submit"
          disabled={isSubmitting || !canProceed}
          className={`
            px-8 py-2 rounded-lg font-medium
            ${
              isSubmitting || !canProceed
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:opacity-90'
            }
            transition-opacity
          `}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Registration'}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`
            px-6 py-2 rounded-lg font-medium
            ${
              !canProceed
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:opacity-90'
            }
            transition-opacity
          `}
        >
          Next
        </button>
      )}
    </div>
  );
}
