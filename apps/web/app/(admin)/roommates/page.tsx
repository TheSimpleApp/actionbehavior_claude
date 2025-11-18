'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Users, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { runRoommatePairingAlgorithm, type PairingInput, type AlgorithmResult } from '@/../../packages/shared/src/algorithms/roommatePairing';
import type { Profile, RoommateSelection, RoommateMatch } from '@/../../packages/shared/types/database';

interface SelectionWithUsers extends RoommateSelection {
  user: Profile;
  choice_1_user: Profile | null;
  choice_2_user: Profile | null;
  choice_3_user: Profile | null;
}

interface MatchWithUsers extends RoommateMatch {
  user_1: Profile;
  user_2: Profile;
}

export default function RoommatesPage() {
  const [selections, setSelections] = useState<SelectionWithUsers[]>([]);
  const [matches, setMatches] = useState<MatchWithUsers[]>([]);
  const [algorithmResult, setAlgorithmResult] = useState<AlgorithmResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const supabase = createClient();
    setLoading(true);

    const [selectionsRes, matchesRes] = await Promise.all([
      supabase
        .from('roommate_selections')
        .select(`
          *,
          user:profiles!user_id(*),
          choice_1_user:profiles!choice_1_user_id(*),
          choice_2_user:profiles!choice_2_user_id(*),
          choice_3_user:profiles!choice_3_user_id(*)
        `),
      supabase
        .from('roommate_matches')
        .select(`
          *,
          user_1:profiles!user_1_id(*),
          user_2:profiles!user_2_id(*)
        `),
    ]);

    if (selectionsRes.data) {
      setSelections(selectionsRes.data as SelectionWithUsers[]);
    }

    if (matchesRes.data) {
      setMatches(matchesRes.data as MatchWithUsers[]);
    }

    setLoading(false);
  }

  async function runAlgorithm() {
    if (!confirm('Running the algorithm will replace all existing matches. Continue?')) {
      return;
    }

    setRunning(true);

    try {
      const supabase = createClient();

      // Get all users who need hotel
      const { data: hotelUsers } = await supabase
        .from('registrations')
        .select('user_id, user:profiles!user_id(*)')
        .eq('hotel_needed', true)
        .eq('rsvp_status', 'yes');

      if (!hotelUsers || hotelUsers.length === 0) {
        alert('No users need hotel rooms');
        setRunning(false);
        return;
      }

      // Prepare input for algorithm
      const input: PairingInput[] = selections.map(sel => ({
        userId: sel.user_id,
        choice1: sel.choice_1_user_id || undefined,
        choice2: sel.choice_2_user_id || undefined,
        choice3: sel.choice_3_user_id || undefined,
        profile: sel.user,
      }));

      // Add users who need hotel but haven't made selections
      for (const { user_id, user } of hotelUsers) {
        if (!input.find(i => i.userId === user_id)) {
          input.push({
            userId: user_id,
            profile: user as Profile,
          });
        }
      }

      // Run the algorithm
      const result = runRoommatePairingAlgorithm(input);
      setAlgorithmResult(result);

      // Delete existing matches
      await supabase.from('roommate_matches').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Insert new matches
      const matchesToInsert = result.matches.map(match => ({
        user_1_id: match.user1Id,
        user_2_id: match.user2Id,
        match_score: match.matchScore,
        matched_by: 'algorithm' as const,
        event_id: selections[0]?.event_id, // Assuming all for same event
      }));

      const { error } = await supabase
        .from('roommate_matches')
        .insert(matchesToInsert);

      if (error) {
        alert('Error saving matches: ' + error.message);
      } else {
        alert(`Algorithm complete! ${result.matches.length} matches created, ${result.unmatched.length} unmatched.`);
        fetchData();
      }
    } catch (error) {
      console.error('Error running algorithm:', error);
      alert('Error running algorithm. Check console for details.');
    }

    setRunning(false);
  }

  const stats = {
    totalSelections: selections.length,
    totalMatches: matches.length,
    usersMatched: matches.length * 2,
    unmatched: selections.length - (matches.length * 2),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Roommate Pairing</h1>
            <p className="text-gray-600 mt-2">Manage roommate selections and matches</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={runAlgorithm} disabled={running || selections.length === 0}>
              <Play className="w-4 h-4 mr-2" />
              {running ? 'Running Algorithm...' : 'Run Pairing Algorithm'}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.totalSelections}</div>
              <div className="text-xs text-gray-600">Selections Submitted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.totalMatches}</div>
              <div className="text-xs text-gray-600">Total Matches</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.usersMatched}</div>
              <div className="text-xs text-gray-600">Users Matched</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.unmatched}</div>
              <div className="text-xs text-gray-600">Unmatched</div>
            </CardContent>
          </Card>
        </div>

        {/* Algorithm Results */}
        {algorithmResult && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Latest Algorithm Run Results</CardTitle>
              <CardDescription>Performance metrics from the matching algorithm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Mutual 1st Choices</div>
                  <div className="text-2xl font-bold text-green-600">{algorithmResult.stats.mutualFirstChoices}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Mutual 2nd Choices</div>
                  <div className="text-2xl font-bold text-blue-600">{algorithmResult.stats.mutualSecondChoices}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Mutual 3rd Choices</div>
                  <div className="text-2xl font-bold text-purple-600">{algorithmResult.stats.mutualThirdChoices}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">One-Way Matches</div>
                  <div className="text-2xl font-bold text-yellow-600">{algorithmResult.stats.oneWayMatches}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Matched</div>
                  <div className="text-2xl font-bold">{algorithmResult.stats.totalMatched}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Unmatched</div>
                  <div className="text-2xl font-bold text-red-600">{algorithmResult.stats.totalUnmatched}</div>
                </div>
              </div>

              {algorithmResult.unmatched.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-yellow-900">Unmatched Users</div>
                      <div className="text-sm text-yellow-700 mt-1">
                        {algorithmResult.unmatched.map(u => u.profile.full_name).join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="selections">
          <TabsList>
            <TabsTrigger value="selections">
              Roommate Selections ({selections.length})
            </TabsTrigger>
            <TabsTrigger value="matches">
              Final Matches ({matches.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="selections">
            <Card>
              <CardHeader>
                <CardTitle>Roommate Selections</CardTitle>
                <CardDescription>User preferences for roommate pairings</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8 text-gray-500">Loading selections...</p>
                ) : selections.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No selections submitted yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>1st Choice</TableHead>
                        <TableHead>2nd Choice</TableHead>
                        <TableHead>3rd Choice</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selections.map((sel) => (
                        <TableRow key={sel.id}>
                          <TableCell className="font-medium">
                            {sel.user.full_name}
                            <div className="text-xs text-gray-500">{sel.user.job_title}</div>
                          </TableCell>
                          <TableCell>
                            {sel.choice_1_user ? (
                              <div>
                                <div className="font-medium">{sel.choice_1_user.full_name}</div>
                                <div className="text-xs text-gray-500">{sel.choice_1_user.job_title}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {sel.choice_2_user ? (
                              <div>
                                <div className="font-medium">{sel.choice_2_user.full_name}</div>
                                <div className="text-xs text-gray-500">{sel.choice_2_user.job_title}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {sel.choice_3_user ? (
                              <div>
                                <div className="font-medium">{sel.choice_3_user.full_name}</div>
                                <div className="text-xs text-gray-500">{sel.choice_3_user.job_title}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>{new Date(sel.submitted_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={sel.locked ? 'secondary' : 'default'}>
                              {sel.locked ? 'Locked' : 'Open'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle>Final Roommate Matches</CardTitle>
                <CardDescription>Algorithm-generated and admin-confirmed pairings</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8 text-gray-500">Loading matches...</p>
                ) : matches.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No matches yet. Run the pairing algorithm to create matches.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roommate 1</TableHead>
                        <TableHead>Roommate 2</TableHead>
                        <TableHead>Match Score</TableHead>
                        <TableHead>Matched By</TableHead>
                        <TableHead>Hotel Info</TableHead>
                        <TableHead>Confirmed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matches.map((match) => (
                        <TableRow key={match.id}>
                          <TableCell>
                            <div className="font-medium">{match.user_1.full_name}</div>
                            <div className="text-xs text-gray-500">{match.user_1.email}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{match.user_2.full_name}</div>
                            <div className="text-xs text-gray-500">{match.user_2.email}</div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                (match.match_score || 0) >= 75 ? 'default' :
                                (match.match_score || 0) >= 50 ? 'secondary' : 'outline'
                              }
                            >
                              {match.match_score || 0} pts
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={match.matched_by === 'algorithm' ? 'default' : 'destructive'}>
                              {match.matched_by}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {match.hotel_name ? (
                              <div className="text-sm">
                                <div>{match.hotel_name}</div>
                                {match.confirmation_number && (
                                  <div className="text-xs text-gray-500">Conf: {match.confirmation_number}</div>
                                )}
                                {match.room_number && (
                                  <div className="text-xs text-gray-500">Room: {match.room_number}</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">TBD</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
