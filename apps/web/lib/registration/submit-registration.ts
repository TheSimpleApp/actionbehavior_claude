import { createClient } from '@/lib/supabase/client';
import type { RegistrationFormData } from '@/components/registration/RegistrationForm';

export async function submitRegistration(data: RegistrationFormData) {
  const supabase = createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Not authenticated');
  }

  // Get current event
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id')
    .eq('status', 'published')
    .limit(1)
    .single();

  if (eventError || !event) {
    throw new Error('No active event found');
  }

  // Check if registration already exists
  const { data: existingReg } = await supabase
    .from('registrations')
    .select('id')
    .eq('user_id', user.id)
    .eq('event_id', event.id)
    .single();

  const registrationData = {
    user_id: user.id,
    event_id: event.id,
    rsvp_status: data.rsvp_status,
    travel_needed: data.travel_needed || false,
    government_name: data.government_name || null,
    date_of_birth: data.date_of_birth || null,
    gender: data.gender || null,
    personal_email: data.personal_email || null,
    frequent_flyer_southwest: data.frequent_flyer_southwest || null,
    frequent_flyer_american: data.frequent_flyer_american || null,
    frequent_flyer_united: data.frequent_flyer_united || null,
    flight_preference_1: data.flight_preference_1 || null,
    flight_preference_2: data.flight_preference_2 || null,
    hotel_needed: data.hotel_needed || false,
    shirt_size: data.shirt_size || null,
    meal_preference: data.meal_preference || null,
    medical_accommodations: data.medical_accommodations || false,
    medical_accommodations_note: data.medical_accommodations_note || null,
    comments: data.comments || null,
  };

  // Insert or update registration
  if (existingReg) {
    const { error } = await supabase
      .from('registrations')
      .update(registrationData)
      .eq('id', existingReg.id);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('registrations')
      .insert([registrationData]);

    if (error) throw error;
  }

  // Handle roommate selections if hotel is needed
  if (data.hotel_needed && (data.choice_1_user_id || data.choice_2_user_id || data.choice_3_user_id)) {
    const selectionData = {
      user_id: user.id,
      event_id: event.id,
      choice_1_user_id: data.choice_1_user_id || null,
      choice_2_user_id: data.choice_2_user_id || null,
      choice_3_user_id: data.choice_3_user_id || null,
    };

    // Check if selection exists
    const { data: existingSelection } = await supabase
      .from('roommate_selections')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', event.id)
      .single();

    if (existingSelection) {
      await supabase
        .from('roommate_selections')
        .update(selectionData)
        .eq('id', existingSelection.id);
    } else {
      await supabase
        .from('roommate_selections')
        .insert([selectionData]);
    }
  }

  return { success: true };
}
