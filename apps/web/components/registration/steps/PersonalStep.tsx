import { UseFormReturn } from 'react-hook-form';
import { RegistrationFormData } from '../RegistrationForm';
import { FormNavigation } from '../FormNavigation';
import { SHIRT_SIZES, MEAL_PREFERENCES } from '@abc-summit/shared';

interface PersonalStepProps {
  form: UseFormReturn<RegistrationFormData>;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function PersonalStep({ form, onNext, onPrev, isFirstStep, isLastStep }: PersonalStepProps) {
  const { register, watch } = form;
  const medicalAccommodations = watch('medical_accommodations');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Personal Preferences</h2>
        <p className="text-gray-600">
          Help us make your summit experience better.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shirt Size
            </label>
            <select
              {...register('shirt_size')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select size...</option>
              {SHIRT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meal Preference
            </label>
            <select
              {...register('meal_preference')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select preference...</option>
              {MEAL_PREFERENCES.map((pref) => (
                <option key={pref} value={pref}>
                  {pref}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              {...register('medical_accommodations')}
              className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary mt-0.5"
            />
            <div className="ml-3">
              <span className="font-medium">I require medical accommodations</span>
              <p className="text-sm text-gray-600 mt-1">
                Check this if you have allergies, dietary restrictions, or accessibility needs
              </p>
            </div>
          </label>

          {medicalAccommodations && (
            <div className="mt-4 pl-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Please describe your needs
              </label>
              <textarea
                {...register('medical_accommodations_note')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Describe any medical accommodations, allergies, or special needs..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Our team will review and contact you if needed
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Comments
          </label>
          <textarea
            {...register('comments')}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Any additional comments or special requests..."
          />
        </div>
      </div>

      <FormNavigation
        onNext={onNext}
        onPrev={onPrev}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        canProceed={true}
      />
    </div>
  );
}
