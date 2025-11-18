import { createClient } from '@/lib/supabase/client';

interface UserWithSelection {
  user_id: string;
  gender: string;
  role_level: number;
  choice_1?: string;
  choice_2?: string;
  choice_3?: string;
}

interface Match {
  user_1_id: string;
  user_2_id: string;
  match_score: number;
  matched_by: 'algorithm';
}

/**
 * Roommate Matching Algorithm
 *
 * Priority order:
 * 1. Mutual first choices (20 points)
 * 2. Reciprocal preferences (10-17 points)
 * 3. One-sided preferences (5-10 points)
 * 4. Role level matching (±1 level)
 * 5. Gender matching (required)
 */
export async function runRoommateMatchingAlgorithm() {
  const supabase = createClient();

  // Get current event ID (assuming there's only one active event)
  const { data: events } = await supabase
    .from('events')
    .select('id')
    .eq('status', 'published')
    .limit(1);

  if (!events || events.length === 0) {
    throw new Error('No active event found');
  }

  const eventId = events[0].id;

  // Get all users who need hotel and have submitted roommate selections
  const { data: selectionsData } = await supabase
    .from('roommate_selections')
    .select(`
      user_id,
      choice_1_user_id,
      choice_2_user_id,
      choice_3_user_id,
      user:profiles!user_id(*)
    `)
    .eq('event_id', eventId);

  // Get registrations to find gender info
  const { data: registrationsData } = await supabase
    .from('registrations')
    .select('user_id, gender')
    .eq('event_id', eventId)
    .eq('hotel_needed', true);

  if (!selectionsData || !registrationsData) {
    throw new Error('No data found');
  }

  // Get already matched users
  const { data: existingMatches } = await supabase
    .from('roommate_matches')
    .select('user_1_id, user_2_id')
    .eq('event_id', eventId);

  const matchedUserIds = new Set<string>();
  existingMatches?.forEach(match => {
    matchedUserIds.add(match.user_1_id);
    matchedUserIds.add(match.user_2_id);
  });

  // Build user map with gender and role info
  const usersWithSelections: UserWithSelection[] = selectionsData
    .filter(s => !matchedUserIds.has(s.user_id))
    .map(selection => {
      const registration = registrationsData.find(r => r.user_id === selection.user_id);
      return {
        user_id: selection.user_id,
        gender: registration?.gender || 'Other',
        role_level: getRoleLevel((selection as any).user?.job_title),
        choice_1: selection.choice_1_user_id || undefined,
        choice_2: selection.choice_2_user_id || undefined,
        choice_3: selection.choice_3_user_id || undefined,
      };
    });

  const matches: Match[] = [];
  const matched = new Set<string>();

  // Phase 1: Mutual first choices
  for (const user of usersWithSelections) {
    if (matched.has(user.user_id) || !user.choice_1) continue;

    const partner = usersWithSelections.find(
      u => u.user_id === user.choice_1 && u.choice_1 === user.user_id && !matched.has(u.user_id)
    );

    if (partner && user.gender === partner.gender) {
      matches.push({
        user_1_id: user.user_id < partner.user_id ? user.user_id : partner.user_id,
        user_2_id: user.user_id < partner.user_id ? partner.user_id : user.user_id,
        match_score: 20,
        matched_by: 'algorithm',
      });
      matched.add(user.user_id);
      matched.add(partner.user_id);
    }
  }

  // Phase 2: Reciprocal preferences
  for (const user of usersWithSelections) {
    if (matched.has(user.user_id)) continue;

    const choices = [user.choice_1, user.choice_2, user.choice_3].filter(Boolean);

    for (let i = 0; i < choices.length; i++) {
      const choiceId = choices[i];
      if (!choiceId) continue;

      const partner = usersWithSelections.find(
        u => u.user_id === choiceId && !matched.has(u.user_id)
      );

      if (!partner || user.gender !== partner.gender) continue;

      // Check if partner also chose this user
      const partnerChoices = [partner.choice_1, partner.choice_2, partner.choice_3];
      const partnerChoiceIndex = partnerChoices.indexOf(user.user_id);

      if (partnerChoiceIndex >= 0) {
        // Reciprocal match
        const score = calculateReciprocalScore(i, partnerChoiceIndex);
        matches.push({
          user_1_id: user.user_id < partner.user_id ? user.user_id : partner.user_id,
          user_2_id: user.user_id < partner.user_id ? partner.user_id : user.user_id,
          match_score: score,
          matched_by: 'algorithm',
        });
        matched.add(user.user_id);
        matched.add(partner.user_id);
        break;
      }
    }
  }

  // Phase 3: One-sided preferences
  for (const user of usersWithSelections) {
    if (matched.has(user.user_id)) continue;

    const choices = [
      { id: user.choice_1, score: 10 },
      { id: user.choice_2, score: 7 },
      { id: user.choice_3, score: 5 },
    ];

    for (const choice of choices) {
      if (!choice.id) continue;

      const partner = usersWithSelections.find(
        u => u.user_id === choice.id && !matched.has(u.user_id)
      );

      if (partner && user.gender === partner.gender) {
        matches.push({
          user_1_id: user.user_id < partner.user_id ? user.user_id : partner.user_id,
          user_2_id: user.user_id < partner.user_id ? partner.user_id : user.user_id,
          match_score: choice.score,
          matched_by: 'algorithm',
        });
        matched.add(user.user_id);
        matched.add(partner.user_id);
        break;
      }
    }
  }

  // Phase 4: Role level and gender matching (for remaining unmatched)
  const unmatchedUsers = usersWithSelections.filter(u => !matched.has(u.user_id));

  for (const user of unmatchedUsers) {
    if (matched.has(user.user_id)) continue;

    // Find best match by role level
    const candidates = unmatchedUsers.filter(
      u =>
        !matched.has(u.user_id) &&
        u.user_id !== user.user_id &&
        u.gender === user.gender &&
        Math.abs(u.role_level - user.role_level) <= 1
    );

    if (candidates.length > 0) {
      // Sort by role level closeness
      candidates.sort(
        (a, b) =>
          Math.abs(a.role_level - user.role_level) -
          Math.abs(b.role_level - user.role_level)
      );

      const partner = candidates[0];
      matches.push({
        user_1_id: user.user_id < partner.user_id ? user.user_id : partner.user_id,
        user_2_id: user.user_id < partner.user_id ? partner.user_id : user.user_id,
        match_score: 3,
        matched_by: 'algorithm',
      });
      matched.add(user.user_id);
      matched.add(partner.user_id);
    }
  }

  // Insert matches into database
  if (matches.length > 0) {
    const matchesWithEventId = matches.map(m => ({ ...m, event_id: eventId }));

    const { error } = await supabase
      .from('roommate_matches')
      .insert(matchesWithEventId);

    if (error) {
      throw error;
    }
  }

  return {
    totalMatches: matches.length,
    matchedUsers: matched.size,
    unmatchedUsers: usersWithSelections.length - matched.size,
  };
}

function calculateReciprocalScore(index1: number, index2: number): number {
  // Both first choice: 20
  if (index1 === 0 && index2 === 0) return 20;
  // 1st + 2nd: 17
  if ((index1 === 0 && index2 === 1) || (index1 === 1 && index2 === 0)) return 17;
  // 1st + 3rd: 15
  if ((index1 === 0 && index2 === 2) || (index1 === 2 && index2 === 0)) return 15;
  // Both 2nd: 14
  if (index1 === 1 && index2 === 1) return 14;
  // 2nd + 3rd: 12
  if ((index1 === 1 && index2 === 2) || (index1 === 2 && index2 === 1)) return 12;
  // Both 3rd: 10
  if (index1 === 2 && index2 === 2) return 10;
  return 5;
}

function getRoleLevel(jobTitle: string | null): number {
  if (!jobTitle) return 5; // Default middle level

  const title = jobTitle.toLowerCase();

  // Level 1-3 (Individual Contributors)
  if (title.includes('technician') && !title.includes('lead') && !title.includes('senior'))
    return 2;
  if (title.includes('administrative assistant') || title.includes('receptionist')) return 1;

  // Level 4-6 (Senior Individual Contributors)
  if (title.includes('senior') && title.includes('technician')) return 4;
  if (title.includes('lead') && title.includes('technician')) return 4;
  if (title.includes('bcba') && !title.includes('senior')) return 5;
  if (title.includes('office manager')) return 6;
  if (title.includes('hr generalist')) return 5;

  // Level 7-8 (Management)
  if (title.includes('senior bcba')) return 7;
  if (title.includes('clinical supervisor')) return 7;
  if (title.includes('operations manager') || title.includes('center manager')) return 8;

  // Level 9-10 (Director)
  if (title.includes('director') && !title.includes('regional')) return 9;
  if (title.includes('regional director')) return 10;

  // Level 11 (Executive)
  if (title.includes('vp') || title.includes('chief') || title.includes('ceo')) return 11;

  return 5; // Default to middle level
}
