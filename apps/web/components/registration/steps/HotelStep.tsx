import { UseFormReturn } from 'react-hook-form';
import { RegistrationFormData } from '../RegistrationForm';
import { FormNavigation } from '../FormNavigation';
import { RoommateSelector } from '../RoommateSelector';

interface HotelStepProps {
  form: UseFormReturn<RegistrationFormData>;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function HotelStep({ form, onNext, onPrev, isFirstStep, isLastStep }: HotelStepProps) {
  const { register, watch, setValue } = form;
  const hotelNeeded = watch('hotel_needed');
  const choice1 = watch('choice_1_user_id');
  const choice2 = watch('choice_2_user_id');
  const choice3 = watch('choice_3_user_id');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Hotel & Roommate Selection</h2>
        <p className="text-gray-600">
          Select your roommate preferences for the summit.
        </p>
      </div>

      <div className="space-y-6">
        {/* Hotel Needed Toggle */}
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('hotel_needed')}
              className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
            />
            <span className="ml-3 font-medium">I need hotel accommodations</span>
          </label>
        </div>

        {hotelNeeded && (
          <div className="space-y-6 border-l-4 border-primary pl-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Roommate Selection Instructions
              </h3>
              <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
                <li>Select 3 roommate preferences in order of priority</li>
                <li>Only eligible employees (based on role) will be shown</li>
                <li>Your selections will be locked after submission</li>
                <li>The algorithm will try to match based on mutual preferences</li>
              </ul>
            </div>

            <RoommateSelector
              choice1Value={choice1}
              choice2Value={choice2}
              choice3Value={choice3}
              onChoice1Change={(value) => setValue('choice_1_user_id', value)}
              onChoice2Change={(value) => setValue('choice_2_user_id', value)}
              onChoice3Change={(value) => setValue('choice_3_user_id', value)}
            />
          </div>
        )}

        {!hotelNeeded && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              No hotel accommodations needed. You can skip to the next section.
            </p>
          </div>
        )}
      </div>

      <FormNavigation
        onNext={onNext}
        onPrev={onPrev}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        canProceed={
          !hotelNeeded ||
          !!(choice1 && choice2 && choice3)
        }
      />
    </div>
  );
}
