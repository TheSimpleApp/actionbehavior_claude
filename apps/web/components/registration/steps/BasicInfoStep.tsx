import { UseFormReturn } from 'react-hook-form';
import { RegistrationFormData } from '../RegistrationForm';
import { FormNavigation } from '../FormNavigation';

interface BasicInfoStepProps {
  form: UseFormReturn<RegistrationFormData>;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function BasicInfoStep({ form, onNext, onPrev, isFirstStep, isLastStep }: BasicInfoStepProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
        <p className="text-gray-600">
          Please verify your information below.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="full_name"
            type="text"
            {...register('full_name')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="John Doe"
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="preferred_name" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Name
            <span className="text-gray-500 text-xs ml-2">(Optional)</span>
          </label>
          <input
            id="preferred_name"
            type="text"
            {...register('preferred_name')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Johnny"
          />
          <p className="text-gray-500 text-xs mt-1">
            This will be displayed on your name badge
          </p>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
            placeholder="john.doe@company.com"
            readOnly
          />
          <p className="text-gray-500 text-xs mt-1">
            Email cannot be changed
          </p>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <FormNavigation
        onNext={onNext}
        onPrev={onPrev}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        canProceed={!!form.watch('full_name') && !!form.watch('email')}
      />
    </div>
  );
}
