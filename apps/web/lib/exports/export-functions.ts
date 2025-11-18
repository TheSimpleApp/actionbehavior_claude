import { createClient } from '@/lib/supabase/client';
import Papa from 'papaparse';
import { format } from 'date-fns';

/**
 * Download a CSV file
 */
function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate timestamp for filename
 */
function getTimestamp() {
  return format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
}

/**
 * Export Full Registration Data
 * ALL fields from registrations with user profile info
 */
export async function exportFullRegistrationData() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('registrations')
    .select(`
      *,
      user:profiles!user_id(
        full_name,
        preferred_name,
        email,
        job_title,
        department,
        center_id,
        market,
        phone_number
      ),
      event:events(
        title,
        start_date,
        end_date
      )
    `)
    .order('registered_at', { ascending: false });

  if (error) throw error;

  // Flatten data for CSV
  const flatData = data?.map((reg: any) => ({
    // Event Info
    'Event': reg.event?.title || '',
    'Event Start': reg.event?.start_date || '',

    // User Info
    'Full Name': reg.user?.full_name || '',
    'Preferred Name': reg.user?.preferred_name || '',
    'Email': reg.user?.email || '',
    'Job Title': reg.user?.job_title || '',
    'Department': reg.user?.department || '',
    'Center ID': reg.user?.center_id || '',
    'Market': reg.user?.market || '',
    'Phone': reg.user?.phone_number || '',

    // RSVP
    'RSVP Status': reg.rsvp_status,
    'Registered At': reg.registered_at,

    // Travel
    'Travel Needed': reg.travel_needed ? 'Yes' : 'No',
    'Government Name': reg.government_name || '',
    'Date of Birth': reg.date_of_birth || '',
    'Gender': reg.gender || '',
    'Personal Email': reg.personal_email || '',
    'Southwest FF#': reg.frequent_flyer_southwest || '',
    'American FF#': reg.frequent_flyer_american || '',
    'United FF#': reg.frequent_flyer_united || '',
    'Flight Preference 1': reg.flight_preference_1 || '',
    'Flight Preference 2': reg.flight_preference_2 || '',

    // Hotel
    'Hotel Needed': reg.hotel_needed ? 'Yes' : 'No',

    // Personal
    'Shirt Size': reg.shirt_size || '',
    'Meal Preference': reg.meal_preference || '',
    'Medical Accommodations': reg.medical_accommodations ? 'Yes' : 'No',
    'Medical Notes': reg.medical_accommodations_note || '',
    'Comments': reg.comments || '',

    // Check-in
    'Checked In': reg.checked_in ? 'Yes' : 'No',
    'Checked In At': reg.checked_in_at || '',
  })) || [];

  const csv = Papa.unparse(flatData);
  downloadCSV(`registration-full-export_${getTimestamp()}.csv`, csv);

  return { recordCount: flatData.length };
}

/**
 * Export Roommate Selections
 * Original user choices (all 3)
 */
export async function exportRoommateSelections() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('roommate_selections')
    .select(`
      *,
      user:profiles!user_id(full_name, email, job_title),
      choice_1:profiles!choice_1_user_id(full_name, email, job_title),
      choice_2:profiles!choice_2_user_id(full_name, email, job_title),
      choice_3:profiles!choice_3_user_id(full_name, email, job_title),
      event:events(title)
    `)
    .order('submitted_at', { ascending: false });

  if (error) throw error;

  const flatData = data?.map((sel: any) => ({
    'Event': sel.event?.title || '',
    'User Name': sel.user?.full_name || '',
    'User Email': sel.user?.email || '',
    'User Job Title': sel.user?.job_title || '',

    '1st Choice Name': sel.choice_1?.full_name || '',
    '1st Choice Email': sel.choice_1?.email || '',
    '1st Choice Job Title': sel.choice_1?.job_title || '',

    '2nd Choice Name': sel.choice_2?.full_name || '',
    '2nd Choice Email': sel.choice_2?.email || '',
    '2nd Choice Job Title': sel.choice_2?.job_title || '',

    '3rd Choice Name': sel.choice_3?.full_name || '',
    '3rd Choice Email': sel.choice_3?.email || '',
    '3rd Choice Job Title': sel.choice_3?.job_title || '',

    'Submitted At': sel.submitted_at,
    'Locked': sel.locked ? 'Yes' : 'No',
  })) || [];

  const csv = Papa.unparse(flatData);
  downloadCSV(`roommate-selections_${getTimestamp()}.csv`, csv);

  return { recordCount: flatData.length };
}

/**
 * Export Roommate Matches
 * Final assignments
 */
export async function exportRoommateMatches() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('roommate_matches')
    .select(`
      *,
      user_1:profiles!user_1_id(full_name, email, phone_number),
      user_2:profiles!user_2_id(full_name, email, phone_number),
      event:events(title)
    `)
    .order('confirmed_at', { ascending: false });

  if (error) throw error;

  const flatData = data?.map((match: any) => ({
    'Event': match.event?.title || '',

    'User 1 Name': match.user_1?.full_name || '',
    'User 1 Email': match.user_1?.email || '',
    'User 1 Phone': match.user_1?.phone_number || '',

    'User 2 Name': match.user_2?.full_name || '',
    'User 2 Email': match.user_2?.email || '',
    'User 2 Phone': match.user_2?.phone_number || '',

    'Match Score': match.match_score || '',
    'Matched By': match.matched_by || '',

    'Hotel Name': match.hotel_name || '',
    'Confirmation Number': match.confirmation_number || '',
    'Room Number': match.room_number || '',

    'Confirmed At': match.confirmed_at,
  })) || [];

  const csv = Papa.unparse(flatData);
  downloadCSV(`roommate-matches_${getTimestamp()}.csv`, csv);

  return { recordCount: flatData.length };
}

/**
 * Export Flight Data
 * Optimized for airline booking
 */
export async function exportFlightData() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('registrations')
    .select(`
      *,
      user:profiles!user_id(full_name, email, market)
    `)
    .eq('travel_needed', true)
    .eq('rsvp_status', 'yes')
    .order('user_id');

  if (error) throw error;

  const flatData = data?.map((reg: any) => ({
    'Full Name': reg.user?.full_name || '',
    'Email': reg.user?.email || '',
    'Government Name': reg.government_name,
    'Date of Birth': reg.date_of_birth,
    'Gender': reg.gender,
    'Personal Email': reg.personal_email,
    'Market': reg.user?.market || '',

    'Southwest Frequent Flyer': reg.frequent_flyer_southwest || '',
    'American Frequent Flyer': reg.frequent_flyer_american || '',
    'United Frequent Flyer': reg.frequent_flyer_united || '',

    'Flight Preference 1': reg.flight_preference_1 || '',
    'Flight Preference 2': reg.flight_preference_2 || '',
  })) || [];

  const csv = Papa.unparse(flatData);
  downloadCSV(`flight-data_${getTimestamp()}.csv`, csv);

  return { recordCount: flatData.length };
}

/**
 * Export Hotel Data
 * Room assignments with confirmation numbers
 */
export async function exportHotelData() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('roommate_matches')
    .select(`
      *,
      user_1:profiles!user_1_id(full_name, email, phone_number),
      user_2:profiles!user_2_id(full_name, email, phone_number),
      event:events(title)
    `)
    .order('hotel_name');

  if (error) throw error;

  const flatData = data?.map((match: any) => ({
    'Event': match.event?.title || '',
    'Hotel Name': match.hotel_name || 'TBD',

    'Guest 1 Name': match.user_1?.full_name || '',
    'Guest 1 Email': match.user_1?.email || '',
    'Guest 1 Phone': match.user_1?.phone_number || '',

    'Guest 2 Name': match.user_2?.full_name || '',
    'Guest 2 Email': match.user_2?.email || '',
    'Guest 2 Phone': match.user_2?.phone_number || '',

    'Confirmation Number': match.confirmation_number || 'TBD',
    'Room Number': match.room_number || 'TBD',
  })) || [];

  const csv = Papa.unparse(flatData);
  downloadCSV(`hotel-data_${getTimestamp()}.csv`, csv);

  return { recordCount: flatData.length };
}

/**
 * Export Catering Data
 * Meal preferences with counts
 */
export async function exportCateringData() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('registrations')
    .select(`
      *,
      user:profiles!user_id(full_name, email)
    `)
    .eq('rsvp_status', 'yes')
    .order('meal_preference');

  if (error) throw error;

  const flatData = data?.map((reg: any) => ({
    'Name': reg.user?.full_name || '',
    'Email': reg.user?.email || '',
    'Meal Preference': reg.meal_preference || 'No Preference',
    'Medical Accommodations': reg.medical_accommodations ? 'Yes' : 'No',
    'Medical Notes': reg.medical_accommodations_note || '',
  })) || [];

  // Calculate summary counts
  const mealCounts: Record<string, number> = {};
  flatData.forEach((row: any) => {
    const pref = row['Meal Preference'];
    mealCounts[pref] = (mealCounts[pref] || 0) + 1;
  });

  // Add summary rows
  const summaryData = [
    ...flatData,
    {}, // Empty row
    { 'Name': 'SUMMARY', 'Email': '', 'Meal Preference': '', 'Medical Accommodations': '', 'Medical Notes': '' },
    ...Object.entries(mealCounts).map(([pref, count]) => ({
      'Name': pref,
      'Email': count.toString(),
      'Meal Preference': '',
      'Medical Accommodations': '',
      'Medical Notes': '',
    })),
  ];

  const csv = Papa.unparse(summaryData);
  downloadCSV(`catering-data_${getTimestamp()}.csv`, csv);

  return { recordCount: flatData.length };
}
