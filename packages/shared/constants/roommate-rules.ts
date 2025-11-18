/**
 * Roommate Pairing Rules based on Job Titles
 *
 * These rules define which job titles can be paired together as roommates.
 * Each job title maps to an array of compatible job titles.
 *
 * IMPORTANT: These rules ensure appropriate pairing based on organizational hierarchy
 * and role responsibilities.
 */

export const ROOMMATE_PAIRING_RULES: Record<string, string[]> = {
  // BCBAs can room with BCBAs, Sr. BCBAs, ACDs, and HQ staff
  'BCBA': ['BCBA', 'Sr. BCBA', 'ACD', 'HQ'],

  // Sr. BCBAs can room with BCBAs, Sr. BCBAs, ACDs, and HQ staff
  'Sr. BCBA': ['BCBA', 'Sr. BCBA', 'ACD', 'HQ'],

  // ACDs (Area Clinical Directors) can room with BCBAs, Sr. BCBAs, ACDs, and HQ staff
  'ACD': ['BCBA', 'Sr. BCBA', 'ACD', 'HQ'],

  // AOMs can room with other operations managers and CDs
  'AOM': ['AOM', 'OM', 'Sr. OM', 'Group OM', 'CD', 'Sr. CD', 'Group CD', 'HQ'],

  // OMs can room with other operations managers and CDs
  'OM': ['AOM', 'OM', 'Sr. OM', 'Group OM', 'CD', 'Sr. CD', 'Group CD', 'HQ'],

  // Sr. OMs can room with other operations managers and CDs
  'Sr. OM': ['AOM', 'OM', 'Sr. OM', 'Group OM', 'CD', 'Sr. CD', 'Group CD', 'HQ'],

  // Group OMs can room with other operations managers and CDs
  'Group OM': ['AOM', 'OM', 'Sr. OM', 'Group OM', 'CD', 'Sr. CD', 'Group CD', 'HQ'],

  // CDs (Clinical Directors) can room with operations managers and other CDs
  'CD': ['AOM', 'OM', 'Sr. OM', 'Group OM', 'CD', 'Sr. CD', 'Group CD', 'HQ'],

  // Sr. CDs can room with operations managers and other CDs
  'Sr. CD': ['AOM', 'OM', 'Sr. OM', 'Group OM', 'CD', 'Sr. CD', 'Group CD', 'HQ'],

  // Group CDs can room with operations managers and other CDs
  'Group CD': ['AOM', 'OM', 'Sr. OM', 'Group OM', 'CD', 'Sr. CD', 'Group CD', 'HQ'],

  // HQ staff can room with anyone
  'HQ': [
    'BCBA', 'Sr. BCBA', 'ACD',
    'AOM', 'OM', 'Sr. OM', 'Group OM',
    'CD', 'Sr. CD', 'Group CD',
    'HQ'
  ],
};

/**
 * Get eligible roommate job titles for a given job title
 * @param jobTitle - The user's job title
 * @returns Array of compatible job titles
 */
export function getEligibleRoommateRoles(jobTitle: string | null): string[] {
  if (!jobTitle) return [];
  return ROOMMATE_PAIRING_RULES[jobTitle] || [];
}

/**
 * Check if two job titles are compatible for rooming together
 * @param jobTitle1 - First user's job title
 * @param jobTitle2 - Second user's job title
 * @returns true if they can room together
 */
export function canRoomTogether(jobTitle1: string | null, jobTitle2: string | null): boolean {
  if (!jobTitle1 || !jobTitle2) return false;

  const eligibleRoles = getEligibleRoommateRoles(jobTitle1);
  return eligibleRoles.includes(jobTitle2);
}

/**
 * All possible job titles in the organization
 */
export const ALL_JOB_TITLES = [
  'BCBA',
  'Sr. BCBA',
  'ACD',
  'AOM',
  'OM',
  'Sr. OM',
  'Group OM',
  'CD',
  'Sr. CD',
  'Group CD',
  'HQ',
] as const;

export type JobTitle = typeof ALL_JOB_TITLES[number];
