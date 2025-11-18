'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@abc-summit/shared';
import { getEligibleRoommateRoles } from '@abc-summit/shared';

interface RoommateSelectorProps {
  choice1Value?: string;
  choice2Value?: string;
  choice3Value?: string;
  onChoice1Change: (value: string) => void;
  onChoice2Change: (value: string) => void;
  onChoice3Change: (value: string) => void;
  currentUserJobTitle?: string;
}

export function RoommateSelector({
  choice1Value,
  choice2Value,
  choice3Value,
  onChoice1Change,
  onChoice2Change,
  onChoice3Change,
  currentUserJobTitle,
}: RoommateSelectorProps) {
  const [eligibleUsers, setEligibleUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEligibleUsers() {
      try {
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Not authenticated');
          return;
        }

        // Get current user's profile to determine job title
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!currentProfile) {
          setError('Profile not found');
          return;
        }

        const userJobTitle = currentUserJobTitle || currentProfile.job_title;

        // Get eligible job titles based on pairing rules
        const eligibleJobTitles = getEligibleRoommateRoles(userJobTitle);

        if (eligibleJobTitles.length === 0) {
          setError('No eligible roommates found for your role');
          return;
        }

        // Fetch users with eligible job titles (excluding current user and only from Shanky)
        const { data: users, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .in('job_title', eligibleJobTitles)
          .eq('from_shanky', true)
          .neq('id', user.id)
          .order('full_name');

        if (fetchError) throw fetchError;

        setEligibleUsers(users || []);
      } catch (err) {
        console.error('Error fetching eligible users:', err);
        setError('Failed to load eligible roommates');
      } finally {
        setLoading(false);
      }
    }

    fetchEligibleUsers();
  }, [currentUserJobTitle]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading eligible roommates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (eligibleUsers.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          No eligible roommates found. Please contact support.
        </p>
      </div>
    );
  }

  // Filter out already selected users for each dropdown
  const getAvailableUsers = (excludeIds: (string | undefined)[]) => {
    return eligibleUsers.filter((user) => !excludeIds.includes(user.id));
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-3 text-sm">
        <p className="font-medium text-gray-700 mb-1">
          {eligibleUsers.length} eligible roommates found
        </p>
        <p className="text-gray-600 text-xs">
          Only employees with compatible roles are shown
        </p>
      </div>

      {/* Choice 1 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          1st Choice Roommate <span className="text-red-500">*</span>
        </label>
        <select
          value={choice1Value || ''}
          onChange={(e) => onChoice1Change(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">-- Select 1st Choice --</option>
          {getAvailableUsers([choice2Value, choice3Value]).map((user) => (
            <option key={user.id} value={user.id}>
              {user.preferred_name || user.full_name} - {user.job_title}
              {user.department ? ` (${user.department})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Choice 2 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          2nd Choice Roommate <span className="text-red-500">*</span>
        </label>
        <select
          value={choice2Value || ''}
          onChange={(e) => onChoice2Change(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          disabled={!choice1Value}
        >
          <option value="">-- Select 2nd Choice --</option>
          {getAvailableUsers([choice1Value, choice3Value]).map((user) => (
            <option key={user.id} value={user.id}>
              {user.preferred_name || user.full_name} - {user.job_title}
              {user.department ? ` (${user.department})` : ''}
            </option>
          ))}
        </select>
        {!choice1Value && (
          <p className="text-xs text-gray-500 mt-1">
            Select 1st choice before selecting 2nd choice
          </p>
        )}
      </div>

      {/* Choice 3 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          3rd Choice Roommate <span className="text-red-500">*</span>
        </label>
        <select
          value={choice3Value || ''}
          onChange={(e) => onChoice3Change(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          disabled={!choice2Value}
        >
          <option value="">-- Select 3rd Choice --</option>
          {getAvailableUsers([choice1Value, choice2Value]).map((user) => (
            <option key={user.id} value={user.id}>
              {user.preferred_name || user.full_name} - {user.job_title}
              {user.department ? ` (${user.department})` : ''}
            </option>
          ))}
        </select>
        {!choice2Value && (
          <p className="text-xs text-gray-500 mt-1">
            Select 2nd choice before selecting 3rd choice
          </p>
        )}
      </div>

      {choice1Value && choice2Value && choice3Value && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            ✓ All 3 roommate choices selected
          </p>
        </div>
      )}
    </div>
  );
}
