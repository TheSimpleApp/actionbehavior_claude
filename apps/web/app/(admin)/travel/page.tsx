'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegistrationWithUser } from '@/types/database';
import { Download, Plane } from 'lucide-react';

export default function TravelPage() {
  const [registrations, setRegistrations] = useState<RegistrationWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTravelNeeded: 0,
    hasSouthwest: 0,
    hasAmerican: 0,
    hasUnited: 0,
  });

  useEffect(() => {
    fetchTravelData();
  }, []);

  const fetchTravelData = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('travel_needed', true)
      .order('registered_at', { ascending: false });

    if (error) {
      console.error('Error fetching travel data:', error);
    } else {
      const travelData = data as RegistrationWithUser[];
      setRegistrations(travelData);

      // Calculate stats
      setStats({
        totalTravelNeeded: travelData.length,
        hasSouthwest: travelData.filter(r => r.frequent_flyer_southwest).length,
        hasAmerican: travelData.filter(r => r.frequent_flyer_american).length,
        hasUnited: travelData.filter(r => r.frequent_flyer_united).length,
      });
    }
    setLoading(false);
  };

  const columns: Column<RegistrationWithUser>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.user?.full_name || 'N/A'}</div>
          <div className="text-xs text-gray-500">{row.government_name || 'No gov name'}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'email',
      header: 'Contact',
      cell: (row) => (
        <div className="text-sm">
          <div>{row.user?.email}</div>
          {row.personal_email && (
            <div className="text-xs text-gray-500">{row.personal_email}</div>
          )}
        </div>
      ),
    },
    {
      id: 'dob_gender',
      header: 'DOB / Gender',
      cell: (row) => (
        <div className="text-sm">
          {row.date_of_birth && <div>{new Date(row.date_of_birth).toLocaleDateString()}</div>}
          {row.gender && <Badge variant="outline" className="text-xs mt-1">{row.gender}</Badge>}
        </div>
      ),
    },
    {
      id: 'ff_numbers',
      header: 'Frequent Flyer',
      cell: (row) => (
        <div className="text-xs space-y-1">
          {row.frequent_flyer_southwest && (
            <div>
              <span className="font-medium">SW:</span> {row.frequent_flyer_southwest}
            </div>
          )}
          {row.frequent_flyer_american && (
            <div>
              <span className="font-medium">AA:</span> {row.frequent_flyer_american}
            </div>
          )}
          {row.frequent_flyer_united && (
            <div>
              <span className="font-medium">UA:</span> {row.frequent_flyer_united}
            </div>
          )}
          {!row.frequent_flyer_southwest &&
            !row.frequent_flyer_american &&
            !row.frequent_flyer_united && (
              <span className="text-gray-400">None</span>
            )}
        </div>
      ),
    },
    {
      id: 'preferences',
      header: 'Flight Preferences',
      cell: (row) => (
        <div className="text-xs space-y-1">
          {row.flight_preference_1 && (
            <div>
              <Badge variant="default" className="text-xs">
                1: {row.flight_preference_1}
              </Badge>
            </div>
          )}
          {row.flight_preference_2 && (
            <div>
              <Badge variant="secondary" className="text-xs">
                2: {row.flight_preference_2}
              </Badge>
            </div>
          )}
          {!row.flight_preference_1 && !row.flight_preference_2 && (
            <span className="text-gray-400">No preferences</span>
          )}
        </div>
      ),
    },
    {
      id: 'center',
      header: 'Center',
      cell: (row) => row.user?.center_id || 'N/A',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading travel data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Travel Management</h1>
            <p className="text-gray-600 mt-2">
              Manage flight bookings and travel information
            </p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export for Travel Agent
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-blue-600" />
                <CardDescription>Total Travelers</CardDescription>
              </div>
              <CardTitle className="text-3xl">{stats.totalTravelNeeded}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Southwest FF</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.hasSouthwest}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>American FF</CardDescription>
              <CardTitle className="text-3xl text-red-600">{stats.hasAmerican}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>United FF</CardDescription>
              <CardTitle className="text-3xl text-blue-800">{stats.hasUnited}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Travel Data Table */}
        <div className="bg-white rounded-lg border p-6">
          <DataTable
            columns={columns}
            data={registrations}
            searchPlaceholder="Search by name, email, or frequent flyer number..."
            emptyMessage="No travel bookings found."
            loading={loading}
          />
        </div>

        {/* Info Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Travel Booking Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>
              1. <strong>Export Data:</strong> Click "Export for Travel Agent" to download all
              travel information in a format suitable for bulk flight booking.
            </p>
            <p>
              2. <strong>Government Names:</strong> These are the names as they appear on IDs and
              must match exactly for TSA purposes.
            </p>
            <p>
              3. <strong>Frequent Flyer Numbers:</strong> Include these in bookings when available
              to ensure travelers receive points/miles.
            </p>
            <p>
              4. <strong>Flight Preferences:</strong> Use these as a guide when multiple flight
              options are available.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
