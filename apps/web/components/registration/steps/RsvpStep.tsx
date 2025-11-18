import { UseFormReturn } from 'react-hook-form';
import { RegistrationFormData } from '../RegistrationForm';
import { FormNavigation } from '../FormNavigation';

interface RsvpStepProps {
  form: UseFormReturn<RegistrationFormData>;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function RsvpStep({ form, onNext, onPrev, isFirstStep, isLastStep }: RsvpStepProps) {
  const { register, watch } = form;
  const rsvpStatus = watch('rsvp_status');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">RSVP</h2>
        <p className="text-gray-600">
          Will you be attending ABC Summit 2025?
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label
            className={`
              relative flex items-center justify-center p-6 border-2 rounded-lg cursor-pointer
              ${rsvpStatus === 'yes' ? 'border-primary bg-primary/5' : 'border-gray-300'}
              hover:border-primary/50 transition-colors
            `}
          >
            <input
              type="radio"
              {...register('rsvp_status')}
              value="yes"
              className="sr-only"
            />
            <div className="text-center">
              <div className="text-4xl mb-2">✓</div>
              <div className="font-semibold text-lg">Yes, I'll Attend</div>
              <div className="text-gray-600 text-sm mt-1">
                I will be at the summit
              </div>
            </div>
          </label>

          <label
            className={`
              relative flex items-center justify-center p-6 border-2 rounded-lg cursor-pointer
              ${rsvpStatus === 'no' ? 'border-primary bg-primary/5' : 'border-gray-300'}
              hover:border-primary/50 transition-colors
            `}
          >
            <input
              type="radio"
              {...register('rsvp_status')}
              value="no"
              className="sr-only"
            />
            <div className="text-center">
              <div className="text-4xl mb-2">✗</div>
              <div className="font-semibold text-lg">No, I Cannot Attend</div>
              <div className="text-gray-600 text-sm mt-1">
                I will not be attending
              </div>
            </div>
          </label>
        </div>

        {rsvpStatus === 'no' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              We're sorry you cannot attend. You can skip the remaining steps and submit your RSVP.
            </p>
          </div>
        )}
      </div>

      <FormNavigation
        onNext={onNext}
        onPrev={onPrev}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        canProceed={!!rsvpStatus}
      />
    </div>
  );
}
