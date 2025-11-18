export type UserRole = 'admin' | 'attendee';

export type RsvpStatus = 'yes' | 'no' | 'pending';

export type EventStatus = 'draft' | 'published' | 'archived';

export type Gender = 'M' | 'F' | 'Other';

export type CancellationStatus = 'pending' | 'approved' | 'denied';

export type MatchedBy = 'algorithm' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  preferred_name: string | null;
  job_title: string | null;
  department: string | null;
  center_id: string | null;
  market: string | null;
  role: UserRole;
  from_shanky: boolean;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  image_url: string | null;
  status: EventStatus;
  max_attendees: number | null;
  registration_deadline: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  user_id: string;
  event_id: string;
  rsvp_status: RsvpStatus;
  registered_at: string;

  // Travel
  travel_needed: boolean;
  government_name: string | null;
  date_of_birth: string | null;
  gender: Gender | null;
  personal_email: string | null;
  frequent_flyer_southwest: string | null;
  frequent_flyer_american: string | null;
  frequent_flyer_united: string | null;
  flight_preference_1: string | null;
  flight_preference_2: string | null;

  // Hotel
  hotel_needed: boolean;

  // Personal
  shirt_size: string | null;
  meal_preference: string | null;
  medical_accommodations: boolean;
  medical_accommodations_note: string | null;
  comments: string | null;

  // Check-in
  checked_in: boolean;
  checked_in_at: string | null;
  checked_in_by: string | null;

  created_at: string;
  updated_at: string;
}

export interface RoommateSelection {
  id: string;
  user_id: string;
  event_id: string;
  choice_1_user_id: string | null;
  choice_2_user_id: string | null;
  choice_3_user_id: string | null;
  submitted_at: string;
  locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoommateMatch {
  id: string;
  event_id: string;
  user_1_id: string;
  user_2_id: string;
  match_score: number | null;
  matched_by: MatchedBy;
  matched_by_admin_id: string | null;
  hotel_name: string | null;
  confirmation_number: string | null;
  room_number: string | null;
  confirmed_at: string;
  created_at: string;
  updated_at: string;
}

export interface CancellationRequest {
  id: string;
  registration_id: string;
  reason: string | null;
  status: CancellationStatus;
  requested_at: string;
  processed_at: string | null;
  processed_by: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// Extended types with relations
export interface RegistrationWithUser extends Registration {
  user: Profile;
}

export interface RoommateSelectionWithUsers extends RoommateSelection {
  user: Profile;
  choice_1_user: Profile | null;
  choice_2_user: Profile | null;
  choice_3_user: Profile | null;
}

export interface RoommateMatchWithUsers extends RoommateMatch {
  user_1: Profile;
  user_2: Profile;
  matched_by_admin: Profile | null;
}
