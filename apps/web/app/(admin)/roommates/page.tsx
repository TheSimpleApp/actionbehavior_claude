'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, Column } from '@/components/admin/DataTable';
import { RoommateSelectionWithUsers, RoommateMatchWithUsers } from '@/types/database';
import { Users, Play, Download, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { runRoommateMatchingAlgorithm } from '@/lib/roommate-matching';

interface Stats {
  totalNeedingRoommates: number;
  selectionsSubmitted: number;
  currentlyMatched: number;
  unmatchedUsers: number;
}

export default function RoommatesPage() {
  const [stats, setStats] = useState<Stats>({
    totalNeedingRoommates: 0,
    selectionsSubmitted: 0,
    currentlyMatched: 0,
    unmatchedUsers: 0,
  });
  const [selections, setSelections] = useState<RoommateSelectionWithUsers[]>([]);
  const [matches, setMatches] = useState<RoommateMatchWithUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [matchProgress, setMatchProgress] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const supabase = createClient();

    // Fetch roommate selections
    const { data: selectionsData } = await supabase
      .from('roommate_selections')
      .select(`
        *,
        user:profiles!user_id(*),
        choice_1_user:profiles!choice_1_user_id(*),
        choice_2_user:profiles!choice_2_user_id(*),
        choice_3_user:profiles!choice_3_user_id(*)
      `);

    // Fetch roommate matches
    const { data: matchesData } = await supabase
      .from('roommate_matches')
      .select(`
        *,
        user_1:profiles!user_1_id(*),
        user_2:profiles!user_2_id(*),
        matched_by_admin:profiles!matched_by_admin_id(*)
      `);

    // Fetch users needing hotel
    const { count: hotelNeededCount } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('hotel_needed', true);

    setSelections(selectionsData as RoommateSelectionWithUsers[] || []);
    setMatches(matchesData as RoommateMatchWithUsers[] || []);

    // Calculate stats
    const totalMatched = (matchesData?.length || 0) * 2; // Each match represents 2 people
    setStats({
      totalNeedingRoommates: hotelNeededCount || 0,
      selectionsSubmitted: selectionsData?.length || 0,
      currentlyMatched: totalMatched,
      unmatchedUsers: (hotelNeededCount || 0) - totalMatched,
    });

    setLoading(false);
  };

  const handleRunMatching = async () => {
    if (!confirm('This will run the roommate matching algorithm. Continue?')) {
      return;
    }

    setMatching(true);
    setMatchProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setMatchProgress((prev) => Math.min(prev + 10, 90));
      }, 300);

      await runRoommateMatchingAlgorithm();

      clearInterval(progressInterval);
      setMatchProgress(100);

      // Refresh data
      await fetchData();

      alert('Matching algorithm completed successfully!');
    } catch (error: any) {
      alert('Error running matching algorithm: ' + error.message);
    } finally {
      setMatching(false);
      setMatchProgress(0);
    }
  };

  const selectionColumns: Column<RoommateSelectionWithUsers>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (row) => row.user?.full_name || 'N/A',
      sortable: true,
    },
    {
      id: 'job_title',
      header: 'Job Title',
      cell: (row) => row.user?.job_title || 'N/A',
    },
    {
      id: 'center',
      header: 'Center',
      cell: (row) => row.user?.center_id || 'N/A',
    },
    {
      id: 'choice_1',
      header: '1st Choice',
      cell: (row) => row.choice_1_user?.full_name || 'None',
    },
    {
      id: 'choice_2',
      header: '2nd Choice',
      cell: (row) => row.choice_2_user?.full_name || 'None',
    },
    {
      id: 'choice_3',
      header: '3rd Choice',
      cell: (row) => row.choice_3_user?.full_name || 'None',
    },
    {
      id: 'submitted',
      header: 'Submitted',
      cell: (row) => new Date(row.submitted_at).toLocaleDateString(),
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.locked ? 'secondary' : 'default'}>
          {row.locked ? 'Locked' : 'Editable'}
        </Badge>
      ),
    },
  ];

  const matchColumns: Column<RoommateMatchWithUsers>[] = [
    {
      id: 'person_1',
      header: 'Person 1',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.user_1?.full_name}</div>
          <div className="text-xs text-gray-500">{row.user_1?.job_title}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'person_2',
      header: 'Person 2',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.user_2?.full_name}</div>
          <div className="text-xs text-gray-500">{row.user_2?.job_title}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'match_score',
      header: 'Match Score',
      cell: (row) => (
        <Badge variant={
          (row.match_score || 0) >= 15 ? 'default' :
          (row.match_score || 0) >= 10 ? 'secondary' :
          'outline'
        }>
          {row.match_score || 0} pts
        </Badge>
      ),
      sortable: true,
    },
    {
      id: 'matched_by',
      header: 'Matched By',
      cell: (row) => (
        <Badge variant={row.matched_by === 'algorithm' ? 'default' : 'destructive'}>
          {row.matched_by}
        </Badge>
      ),
    },
    {
      id: 'hotel_info',
      header: 'Hotel Info',
      cell: (row) => (
        <div className="text-xs">
          {row.hotel_name && <div>{row.hotel_name}</div>}
          {row.room_number && <div>Room: {row.room_number}</div>}
          {!row.hotel_name && !row.room_number && <span className="text-gray-400">Not assigned</span>}
        </div>
      ),
    },
    {
      id: 'confirmed_at',
      header: 'Matched Date',
      cell: (row) => new Date(row.confirmed_at).toLocaleDateString(),
      sortable: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading roommate data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Roommate Management</h1>
          <p className="text-gray-600 mt-2">
            Manage roommate selections and matching algorithm
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Needing Roommates</CardDescription>
              <CardTitle className="text-3xl">{stats.totalNeedingRoommates}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Selections Submitted</CardDescription>
              <CardTitle className="text-3xl">{stats.selectionsSubmitted}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Currently Matched</CardDescription>
              <CardTitle className="text-3xl">{stats.currentlyMatched}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Unmatched Users</CardDescription>
              <CardTitle className="text-3xl text-orange-600">
                {stats.unmatchedUsers}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Matching Algorithm Card */}
        {stats.unmatchedUsers > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Run Matching Algorithm
              </CardTitle>
              <CardDescription>
                Match {stats.unmatchedUsers} unmatched users based on their preferences and role levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {matching ? (
                <div className="space-y-4">
                  <Progress value={matchProgress} className="w-full" />
                  <p className="text-sm text-gray-600">
                    Matching in progress... {matchProgress}%
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Button onClick={handleRunMatching} size="lg">
                    <Play className="h-4 w-4 mr-2" />
                    Run Matching Algorithm
                  </Button>
                  <p className="text-sm text-gray-600">
                    This will match users based on mutual preferences, role levels, and availability
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="matches" className="space-y-4">
          <TabsList>
            <TabsTrigger value="matches">
              Matches ({matches.length})
            </TabsTrigger>
            <TabsTrigger value="selections">
              Selections ({selections.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Roommate Matches</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Matches
              </Button>
            </div>
            <DataTable
              columns={matchColumns}
              data={matches}
              searchPlaceholder="Search matches..."
              emptyMessage="No matches found. Run the matching algorithm to create matches."
            />
          </TabsContent>

          <TabsContent value="selections" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Roommate Selections</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Selections
              </Button>
            </div>
            <DataTable
              columns={selectionColumns}
              data={selections}
              searchPlaceholder="Search selections..."
              emptyMessage="No roommate selections found."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
