'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { RsvpStep } from './steps/RsvpStep';
import { TravelStep } from './steps/TravelStep';
import { HotelStep } from './steps/HotelStep';
import { PersonalStep } from './steps/PersonalStep';
import { ReviewStep } from './steps/ReviewStep';
import { ProgressIndicator } from './ProgressIndicator';

const registrationSchema = z.object({
  // Basic Info
  full_name: z.string().min(1, 'Full name is required'),
  preferred_name: z.string().optional(),
  email: z.string().email('Valid email is required'),

  // RSVP
  rsvp_status: z.enum(['yes', 'no']),

  // Travel
  travel_needed: z.boolean(),
  government_name: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(['M', 'F', 'Other']).optional(),
  personal_email: z.string().email().optional().or(z.literal('')),
  frequent_flyer_southwest: z.string().optional(),
  frequent_flyer_american: z.string().optional(),
  frequent_flyer_united: z.string().optional(),
  flight_preference_1: z.string().optional(),
  flight_preference_2: z.string().optional(),

  // Hotel
  hotel_needed: z.boolean(),
  choice_1_user_id: z.string().optional(),
  choice_2_user_id: z.string().optional(),
  choice_3_user_id: z.string().optional(),

  // Personal
  shirt_size: z.string().optional(),
  meal_preference: z.string().optional(),
  medical_accommodations: z.boolean(),
  medical_accommodations_note: z.string().optional(),
  comments: z.string().optional(),
}).refine(
  (data) => {
    // If RSVP is no, no other fields are required
    if (data.rsvp_status === 'no') return true;

    // If travel is needed, require travel fields
    if (data.travel_needed) {
      return !!(
        data.government_name &&
        data.date_of_birth &&
        data.gender &&
        data.personal_email
      );
    }

    // If hotel is needed, require roommate selections
    if (data.hotel_needed) {
      return !!(
        data.choice_1_user_id &&
        data.choice_2_user_id &&
        data.choice_3_user_id
      );
    }

    return true;
  },
  {
    message: 'Please complete all required fields',
  }
);

export type RegistrationFormData = z.infer<typeof registrationSchema>;

const STEPS = [
  { id: 1, name: 'Basic Info', component: BasicInfoStep },
  { id: 2, name: 'RSVP', component: RsvpStep },
  { id: 3, name: 'Travel', component: TravelStep },
  { id: 4, name: 'Hotel', component: HotelStep },
  { id: 5, name: 'Personal', component: PersonalStep },
  { id: 6, name: 'Review', component: ReviewStep },
];

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      rsvp_status: 'yes',
      travel_needed: false,
      hotel_needed: false,
      medical_accommodations: false,
    },
    mode: 'onChange',
  });

  const rsvpStatus = form.watch('rsvp_status');
  const travelNeeded = form.watch('travel_needed');
  const hotelNeeded = form.watch('hotel_needed');

  const nextStep = () => {
    // Skip steps based on RSVP status
    if (rsvpStatus === 'no' && currentStep === 2) {
      setCurrentStep(6); // Jump to review
      return;
    }

    // Skip travel step if not needed
    if (!travelNeeded && currentStep === 2) {
      setCurrentStep(4); // Skip to hotel
      return;
    }

    // Skip hotel step if not needed
    if (!hotelNeeded && currentStep === 3) {
      setCurrentStep(5); // Skip to personal
      return;
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Submit to Supabase
      console.log('Submitting registration:', data);

      // Show success message
      alert('Registration submitted successfully!');
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Error submitting registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div>
      <ProgressIndicator currentStep={currentStep} steps={STEPS} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
        <CurrentStepComponent
          form={form}
          onNext={nextStep}
          onPrev={prevStep}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === STEPS.length}
          isSubmitting={isSubmitting}
        />
      </form>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded text-xs">
          <details>
            <summary className="cursor-pointer font-semibold">
              Form Data (Debug)
            </summary>
            <pre className="mt-2 overflow-auto">
              {JSON.stringify(form.watch(), null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
