/**
 * Form dropdown options for registration
 */

export const SHIRT_SIZES = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',
] as const;

export const MEAL_PREFERENCES = [
  'No Preference',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Kosher',
  'Halal',
  'Pescatarian',
  'Other (see comments)',
] as const;

export const FLIGHT_PREFERENCES = [
  'Morning (6am-12pm)',
  'Afternoon (12pm-6pm)',
  'Evening (6pm-12am)',
  'Red-eye (12am-6am)',
  'No Preference',
] as const;

export const AIRLINES = [
  'Southwest',
  'American',
  'United',
  'Delta',
  'JetBlue',
  'Alaska',
  'Other',
] as const;

export type ShirtSize = typeof SHIRT_SIZES[number];
export type MealPreference = typeof MEAL_PREFERENCES[number];
export type FlightPreference = typeof FLIGHT_PREFERENCES[number];
export type Airline = typeof AIRLINES[number];
