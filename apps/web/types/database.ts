/**
 * Database Types
 * Generated from Supabase schema
 */

// ===== PROFILES =====
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  preferred_name: string | null;
  job_title: string | null;
  department: string | null;
  center_id: string | null;
  market: string | null;
  role: 'admin' | 'attendee';
  from_shanky: boolean;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}

// ===== EVENTS =====
export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  image_url: string | null;
  status: 'draft' | 'published' | 'archived';
  max_attendees: number | null;
  registration_deadline: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// ===== REGISTRATIONS =====
export interface Registration {
  id: string;
  user_id: string;
  event_id: string;

  // RSVP Status
  rsvp_status: 'yes' | 'no' | 'pending';
  registered_at: string;

  // Travel Information
  travel_needed: boolean;
  government_name: string | null;
  date_of_birth: string | null;
  gender: 'M' | 'F' | 'Other' | null;
  personal_email: string | null;
  frequent_flyer_southwest: string | null;
  frequent_flyer_american: string | null;
  frequent_flyer_united: string | null;
  flight_preference_1: string | null;
  flight_preference_2: string | null;

  // Hotel Information
  hotel_needed: boolean;

  // Personal Preferences
  shirt_size: string | null;
  meal_preference: string | null;
  medical_accommodations: boolean;
  medical_accommodations_note: string | null;
  comments: string | null;

  // Check-in
  checked_in: boolean;
  checked_in_at: string | null;
  checked_in_by: string | null;

  // Meta
  created_at: string;
  updated_at: string;
}

// Registration with user data joined
export interface RegistrationWithUser extends Registration {
  user?: Profile;
}

// ===== ROOMMATE SELECTIONS =====
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

// Roommate selection with user data
export interface RoommateSelectionWithUsers extends RoommateSelection {
  user?: Profile;
  choice_1_user?: Profile;
  choice_2_user?: Profile;
  choice_3_user?: Profile;
}

// ===== ROOMMATE MATCHES =====
export interface RoommateMatch {
  id: string;
  event_id: string;
  user_1_id: string;
  user_2_id: string;
  match_score: number | null;
  matched_by: 'algorithm' | 'admin';
  matched_by_admin_id: string | null;
  hotel_name: string | null;
  confirmation_number: string | null;
  room_number: string | null;
  confirmed_at: string;
  created_at: string;
  updated_at: string;
}

// Roommate match with user data
export interface RoommateMatchWithUsers extends RoommateMatch {
  user_1?: Profile;
  user_2?: Profile;
}

// ===== CANCELLATION REQUESTS =====
export interface CancellationRequest {
  id: string;
  registration_id: string;
  user_id: string;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ===== FORM DATA TYPES =====
export interface RegistrationFormData {
  // RSVP
  rsvp_status: 'yes' | 'no';

  // Travel
  travel_needed?: boolean;
  government_name?: string;
  date_of_birth?: string;
  gender?: 'M' | 'F' | 'Other';
  personal_email?: string;
  frequent_flyer_southwest?: string;
  frequent_flyer_american?: string;
  frequent_flyer_united?: string;
  flight_preference_1?: string;
  flight_preference_2?: string;

  // Hotel
  hotel_needed?: boolean;
  roommate_choice_1?: string;
  roommate_choice_2?: string;
  roommate_choice_3?: string;

  // Preferences
  shirt_size?: string;
  meal_preference?: string;
  medical_accommodations?: boolean;
  medical_accommodations_note?: string;
  comments?: string;
}

// ===== API RESPONSE TYPES =====
export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

// ===== DASHBOARD STATS =====
export interface DashboardStats {
  totalRegistrations: number;
  rsvpYes: number;
  rsvpNo: number;
  rsvpPending: number;
  pendingCancellations: number;
  travelBookings: number;
  hotelBookings: number;
  totalUsers: number;
  adminUsers: number;
  roommateMatches: number;
  unmatchedUsers: number;
}
