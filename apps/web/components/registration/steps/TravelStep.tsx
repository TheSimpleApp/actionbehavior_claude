import { UseFormReturn } from 'react-hook-form';
import { RegistrationFormData } from '../RegistrationForm';
import { FormNavigation } from '../FormNavigation';
import { FLIGHT_PREFERENCES } from '@abc-summit/shared';

interface TravelStepProps {
  form: UseFormReturn<RegistrationFormData>;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function TravelStep({ form, onNext, onPrev, isFirstStep, isLastStep }: TravelStepProps) {
  const { register, watch, formState: { errors } } = form;
  const travelNeeded = watch('travel_needed');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Travel Information</h2>
        <p className="text-gray-600">
          Tell us about your travel needs for the summit.
        </p>
      </div>

      <div className="space-y-6">
        {/* Travel Needed Toggle */}
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('travel_needed')}
              className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
            />
            <span className="ml-3 font-medium">I need travel arrangements</span>
          </label>
        </div>

        {travelNeeded && (
          <div className="space-y-4 border-l-4 border-primary pl-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Government Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('government_name')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="As shown on ID"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must match government-issued ID
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('date_of_birth')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('gender')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('personal_email')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="personal@email.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  For travel confirmations
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Frequent Flyer Numbers</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Southwest</label>
                  <input
                    type="text"
                    {...register('frequent_flyer_southwest')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">American</label>
                  <input
                    type="text"
                    {...register('frequent_flyer_american')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">United</label>
                  <input
                    type="text"
                    {...register('frequent_flyer_united')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Flight Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    1st Preference
                  </label>
                  <select
                    {...register('flight_preference_1')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    {FLIGHT_PREFERENCES.map((pref) => (
                      <option key={pref} value={pref}>
                        {pref}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    2nd Preference
                  </label>
                  <select
                    {...register('flight_preference_2')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    {FLIGHT_PREFERENCES.map((pref) => (
                      <option key={pref} value={pref}>
                        {pref}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {!travelNeeded && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              No travel arrangements needed. You can skip to the next section.
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
          !travelNeeded ||
          !!(
            watch('government_name') &&
            watch('date_of_birth') &&
            watch('gender') &&
            watch('personal_email')
          )
        }
      />
    </div>
  );
}
