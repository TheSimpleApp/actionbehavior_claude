import type { RoommateSelection, Profile } from '../types/database';

export interface PairingInput {
  userId: string;
  choice1?: string;
  choice2?: string;
  choice3?: string;
  profile: Profile;
}

export interface PairingResult {
  user1Id: string;
  user2Id: string;
  matchScore: number;
  reason: string;
}

export interface UnmatchedUser {
  userId: string;
  profile: Profile;
  reason: string;
}

export interface AlgorithmResult {
  matches: PairingResult[];
  unmatched: UnmatchedUser[];
  stats: {
    totalUsers: number;
    totalMatched: number;
    totalUnmatched: number;
    mutualFirstChoices: number;
    mutualSecondChoices: number;
    mutualThirdChoices: number;
    oneWayMatches: number;
  };
}

/**
 * Roommate Pairing Algorithm
 *
 * Scoring system (higher is better):
 * - Mutual 1st choice: 100 points
 * - Mutual 2nd choice: 75 points
 * - Mutual 3rd choice: 50 points
 * - One-way 1st choice: 40 points
 * - One-way 2nd choice: 25 points
 * - One-way 3rd choice: 10 points
 *
 * Additional considerations:
 * - Gender preferences (if applicable)
 * - Role/job title similarity
 * - Department matching
 */
export function runRoommatePairingAlgorithm(
  selections: PairingInput[]
): AlgorithmResult {
  const matches: PairingResult[] = [];
  const matched = new Set<string>();
  const unmatched: UnmatchedUser[] = [];

  const stats = {
    totalUsers: selections.length,
    totalMatched: 0,
    totalUnmatched: 0,
    mutualFirstChoices: 0,
    mutualSecondChoices: 0,
    mutualThirdChoices: 0,
    oneWayMatches: 0,
  };

  // Create a map for quick lookup
  const selectionMap = new Map(selections.map(s => [s.userId, s]));

  // Helper function to calculate match score
  function calculateMatchScore(user1: PairingInput, user2: PairingInput): {
    score: number;
    reason: string;
  } {
    let score = 0;
    let reason = '';

    // Check if user1 chose user2
    const user1ChoiceRank =
      user1.choice1 === user2.userId ? 1 :
      user1.choice2 === user2.userId ? 2 :
      user1.choice3 === user2.userId ? 3 : 0;

    // Check if user2 chose user1
    const user2ChoiceRank =
      user2.choice1 === user1.userId ? 1 :
      user2.choice2 === user1.userId ? 2 :
      user2.choice3 === user1.userId ? 3 : 0;

    // Mutual choices (both chose each other)
    if (user1ChoiceRank === 1 && user2ChoiceRank === 1) {
      score = 100;
      reason = 'Mutual 1st choice';
      stats.mutualFirstChoices++;
    } else if (user1ChoiceRank === 2 && user2ChoiceRank === 2) {
      score = 75;
      reason = 'Mutual 2nd choice';
      stats.mutualSecondChoices++;
    } else if (user1ChoiceRank === 3 && user2ChoiceRank === 3) {
      score = 50;
      reason = 'Mutual 3rd choice';
      stats.mutualThirdChoices++;
    } else if (user1ChoiceRank > 0 && user2ChoiceRank > 0) {
      // Mixed mutual choices
      const avgRank = (user1ChoiceRank + user2ChoiceRank) / 2;
      score = Math.floor(100 - (avgRank - 1) * 20);
      reason = `Mutual choice (${user1ChoiceRank}/${user2ChoiceRank})`;
    } else if (user1ChoiceRank > 0) {
      // One-way choice (user1 chose user2)
      score = user1ChoiceRank === 1 ? 40 : user1ChoiceRank === 2 ? 25 : 10;
      reason = `One-way choice (rank ${user1ChoiceRank})`;
      stats.oneWayMatches++;
    } else if (user2ChoiceRank > 0) {
      // One-way choice (user2 chose user1)
      score = user2ChoiceRank === 1 ? 40 : user2ChoiceRank === 2 ? 25 : 10;
      reason = `One-way choice (rank ${user2ChoiceRank})`;
      stats.oneWayMatches++;
    }

    // Bonus points for same department
    if (user1.profile.department && user2.profile.department &&
        user1.profile.department === user2.profile.department) {
      score += 5;
      reason += ' + Same dept';
    }

    // Bonus points for same market
    if (user1.profile.market && user2.profile.market &&
        user1.profile.market === user2.profile.market) {
      score += 3;
      reason += ' + Same market';
    }

    return { score, reason };
  }

  // Step 1: Find all mutual first choices
  for (const user of selections) {
    if (matched.has(user.userId)) continue;

    if (user.choice1) {
      const partner = selectionMap.get(user.choice1);
      if (partner && partner.choice1 === user.userId && !matched.has(partner.userId)) {
        const { score, reason } = calculateMatchScore(user, partner);
        matches.push({
          user1Id: user.userId < partner.userId ? user.userId : partner.userId,
          user2Id: user.userId < partner.userId ? partner.userId : user.userId,
          matchScore: score,
          reason,
        });
        matched.add(user.userId);
        matched.add(partner.userId);
        stats.totalMatched += 2;
      }
    }
  }

  // Step 2: Find best remaining matches based on scores
  const remainingUsers = selections.filter(s => !matched.has(s.userId));

  // Calculate all possible pairs and their scores
  const possiblePairs: Array<{
    user1: PairingInput;
    user2: PairingInput;
    score: number;
    reason: string;
  }> = [];

  for (let i = 0; i < remainingUsers.length; i++) {
    for (let j = i + 1; j < remainingUsers.length; j++) {
      const user1 = remainingUsers[i];
      const user2 = remainingUsers[j];
      const { score, reason } = calculateMatchScore(user1, user2);

      if (score > 0) {
        possiblePairs.push({ user1, user2, score, reason });
      }
    }
  }

  // Sort by score (descending)
  possiblePairs.sort((a, b) => b.score - a.score);

  // Greedily assign best matches
  for (const pair of possiblePairs) {
    if (!matched.has(pair.user1.userId) && !matched.has(pair.user2.userId)) {
      matches.push({
        user1Id: pair.user1.userId < pair.user2.userId ? pair.user1.userId : pair.user2.userId,
        user2Id: pair.user1.userId < pair.user2.userId ? pair.user2.userId : pair.user1.userId,
        matchScore: pair.score,
        reason: pair.reason,
      });
      matched.add(pair.user1.userId);
      matched.add(pair.user2.userId);
      stats.totalMatched += 2;
    }
  }

  // Step 3: Handle unmatched users
  for (const user of selections) {
    if (!matched.has(user.userId)) {
      let reason = 'No compatible match found';

      if (!user.choice1 && !user.choice2 && !user.choice3) {
        reason = 'No roommate preferences submitted';
      } else if (selections.length % 2 !== 0 && unmatched.length === 0) {
        reason = 'Odd number of participants';
      }

      unmatched.push({
        userId: user.userId,
        profile: user.profile,
        reason,
      });
      stats.totalUnmatched++;
    }
  }

  return {
    matches,
    unmatched,
    stats,
  };
}

/**
 * Validate a manual match (admin override)
 */
export function validateManualMatch(
  user1Id: string,
  user2Id: string,
  allUsers: Map<string, Profile>
): { valid: boolean; error?: string } {
  if (user1Id === user2Id) {
    return { valid: false, error: 'Cannot match a user with themselves' };
  }

  if (!allUsers.has(user1Id) || !allUsers.has(user2Id)) {
    return { valid: false, error: 'One or both users not found' };
  }

  return { valid: true };
}
