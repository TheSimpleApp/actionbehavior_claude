import { UseFormReturn } from 'react-hook-form';
import { RegistrationFormData } from '../RegistrationForm';
import { FormNavigation } from '../FormNavigation';

interface ReviewStepProps {
  form: UseFormReturn<RegistrationFormData>;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
}

export function ReviewStep({
  form,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
  isSubmitting,
}: ReviewStepProps) {
  const data = form.watch();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Review Your Registration</h2>
        <p className="text-gray-600">
          Please review your information before submitting.
        </p>
      </div>

      <div className="space-y-4">
        {/* Basic Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Basic Information</h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-gray-600">Full Name:</dt>
            <dd className="font-medium">{data.full_name}</dd>

            {data.preferred_name && (
              <>
                <dt className="text-gray-600">Preferred Name:</dt>
                <dd className="font-medium">{data.preferred_name}</dd>
              </>
            )}

            <dt className="text-gray-600">Email:</dt>
            <dd className="font-medium">{data.email}</dd>
          </dl>
        </div>

        {/* RSVP */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3">RSVP Status</h3>
          <p className="text-lg font-medium">
            {data.rsvp_status === 'yes' ? '✓ Attending' : '✗ Not Attending'}
          </p>
        </div>

        {data.rsvp_status === 'yes' && (
          <>
            {/* Travel */}
            {data.travel_needed && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Travel Information</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-gray-600">Government Name:</dt>
                  <dd className="font-medium">{data.government_name}</dd>

                  <dt className="text-gray-600">Date of Birth:</dt>
                  <dd className="font-medium">{data.date_of_birth}</dd>

                  <dt className="text-gray-600">Gender:</dt>
                  <dd className="font-medium">{data.gender}</dd>

                  <dt className="text-gray-600">Personal Email:</dt>
                  <dd className="font-medium">{data.personal_email}</dd>

                  {data.flight_preference_1 && (
                    <>
                      <dt className="text-gray-600">Flight Preference:</dt>
                      <dd className="font-medium">{data.flight_preference_1}</dd>
                    </>
                  )}
                </dl>
              </div>
            )}

            {/* Hotel */}
            {data.hotel_needed && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Hotel & Roommate</h3>
                <p className="text-sm text-gray-600 mb-2">
                  You have selected 3 roommate preferences. The matching algorithm will consider these when making assignments.
                </p>
              </div>
            )}

            {/* Personal */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Personal Preferences</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {data.shirt_size && (
                  <>
                    <dt className="text-gray-600">Shirt Size:</dt>
                    <dd className="font-medium">{data.shirt_size}</dd>
                  </>
                )}

                {data.meal_preference && (
                  <>
                    <dt className="text-gray-600">Meal Preference:</dt>
                    <dd className="font-medium">{data.meal_preference}</dd>
                  </>
                )}

                {data.medical_accommodations && (
                  <>
                    <dt className="text-gray-600 col-span-2">
                      Medical Accommodations Required
                    </dt>
                  </>
                )}
              </dl>
            </div>
          </>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-900 font-medium">
          By submitting this registration, I confirm that all information provided is accurate.
        </p>
      </div>

      <FormNavigation
        onNext={onNext}
        onPrev={onPrev}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        isSubmitting={isSubmitting}
        canProceed={true}
      />
    </div>
  );
}
