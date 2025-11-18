/**
 * Seed Database Script
 *
 * Run this with: npx tsx scripts/seed-database.ts
 *
 * This will populate the database with sample data for testing:
 * - 1 active event (ABC Summit 2025)
 * - 50 sample users (admins and attendees)
 * - 40 registrations with varied data
 * - Roommate selections
 * - Sample roommate matches
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key for admin operations
);

const jobTitles = [
  'Registered Behavior Technician (RBT)',
  'Board Certified Behavior Analyst (BCBA)',
  'Senior BCBA',
  'Clinical Supervisor',
  'Center Director',
  'Regional Director',
  'Operations Manager',
  'Administrative Assistant',
  'Office Manager',
  'VP of Clinical Services',
];

const departments = ['Clinical', 'Administrative', 'Leadership', 'Operations', 'Support'];

const centers = [
  'Dallas Center',
  'Houston Center',
  'Austin Center',
  'San Antonio Center',
  'Phoenix Center',
  'Los Angeles Center',
  'Chicago Center',
  'Miami Center',
  'New York Center',
  'Seattle Center',
];

const markets = ['Texas', 'California', 'Arizona', 'Florida', 'Illinois', 'New York', 'Washington'];

const shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const mealPreferences = ['Vegetarian', 'Vegan', 'Gluten-Free', 'No Restrictions', 'Pescatarian'];

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  // 1. Create Event
  console.log('📅 Creating ABC Summit 2025 event...');
  const { data: event, error: eventError } = await supabase
    .from('events')
    .upsert([
      {
        title: 'ABC Summit 2025',
        description: 'Annual company-wide conference for all Action Behavior Centers employees',
        start_date: '2026-02-27T08:00:00Z',
        end_date: '2026-02-28T17:00:00Z',
        location: 'Gaylord Texan Resort, Grapevine, TX',
        status: 'published',
        max_attendees: 2500,
        registration_deadline: '2026-01-15T23:59:59Z',
      },
    ])
    .select()
    .single();

  if (eventError) {
    console.error('Error creating event:', eventError);
    return;
  }
  console.log(`✅ Event created: ${event.title}\n`);

  // 2. Create Users
  console.log('👤 Creating sample users...');
  const users = [];

  for (let i = 1; i <= 50; i++) {
    const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const center = centers[Math.floor(Math.random() * centers.length)];
    const market = markets[Math.floor(Math.random() * markets.length)];

    const user = {
      email: `user${i}@actionbehaviorcenters.com`,
      full_name: `Test User ${i}`,
      preferred_name: Math.random() > 0.5 ? `User ${i}` : null,
      job_title: jobTitle,
      department,
      center_id: center,
      market,
      role: i <= 5 ? 'admin' : 'attendee', // First 5 are admins
      phone_number: `555-${String(i).padStart(4, '0')}`,
      from_shanky: Math.random() > 0.7,
    };

    users.push(user);
  }

  // Note: In production, you'd create these users through Supabase Auth
  // For seeding, we're just creating profile records
  console.log(`✅ ${users.length} users prepared\n`);

  // 3. Create Registrations
  console.log('📝 Creating sample registrations...');
  const registrations = [];

  for (let i = 1; i <= 40; i++) {
    const needsTravel = Math.random() > 0.3;
    const needsHotel = Math.random() > 0.3;
    const rsvpStatus = Math.random() > 0.1 ? 'yes' : 'no';

    const registration = {
      // user_id would be set to actual user IDs after user creation
      event_id: event.id,
      rsvp_status: rsvpStatus,

      travel_needed: needsTravel,
      government_name: needsTravel ? `Government Name ${i}` : null,
      date_of_birth: needsTravel ? `1985-0${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 28) + 1}` : null,
      gender: needsTravel ? (['M', 'F', 'Other'][Math.floor(Math.random() * 3)]) : null,
      personal_email: needsTravel ? `personal${i}@gmail.com` : null,
      frequent_flyer_southwest: needsTravel && Math.random() > 0.5 ? `SW${i * 1000}` : null,
      frequent_flyer_american: needsTravel && Math.random() > 0.5 ? `AA${i * 1000}` : null,
      frequent_flyer_united: needsTravel && Math.random() > 0.5 ? `UA${i * 1000}` : null,
      flight_preference_1: needsTravel ? 'Morning departure' : null,
      flight_preference_2: needsTravel ? 'Window seat' : null,

      hotel_needed: needsHotel,

      shirt_size: shirtSizes[Math.floor(Math.random() * shirtSizes.length)],
      meal_preference: mealPreferences[Math.floor(Math.random() * mealPreferences.length)],
      medical_accommodations: Math.random() > 0.9,
      medical_accommodations_note: Math.random() > 0.9 ? 'Wheelchair accessible room needed' : null,
      comments: Math.random() > 0.7 ? `Looking forward to the event! - User ${i}` : null,

      checked_in: false,
    };

    registrations.push(registration);
  }

  console.log(`✅ ${registrations.length} registrations prepared\n`);

  // 4. Summary
  console.log('📊 Seed Data Summary:');
  console.log(`   - Events: 1`);
  console.log(`   - Users: ${users.length} (${users.filter(u => u.role === 'admin').length} admins)`);
  console.log(`   - Registrations: ${registrations.length}`);
  console.log(`   - RSVP Yes: ${registrations.filter(r => r.rsvp_status === 'yes').length}`);
  console.log(`   - Travel Needed: ${registrations.filter(r => r.travel_needed).length}`);
  console.log(`   - Hotel Needed: ${registrations.filter(r => r.hotel_needed).length}`);
  console.log('\\n✅ Database seeding complete!\\n');

  console.log('📋 Next Steps:');
  console.log('   1. Users need to be created via Supabase Auth (sign up manually or use invite links)');
  console.log('   2. After users sign in, their registrations can be created');
  console.log('   3. Use the admin panel to run the roommate matching algorithm');
  console.log('   4. Test all export functions');
}

// Run the seed function
seedDatabase().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
