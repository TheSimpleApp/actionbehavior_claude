'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, FileText, Plane, Hotel, Download, Bell, UserCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface DashboardStats {
  totalRegistrations: number;
  rsvpYes: number;
  rsvpNo: number;
  rsvpPending: number;
  pendingCancellations: number;
  travelBookings: number;
  hotelBookings: number;
  totalUsers: number;
  adminUsers: number;
  roommateMatches: number;
  unmatchedUsers: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRegistrations: 0,
    rsvpYes: 0,
    rsvpNo: 0,
    rsvpPending: 0,
    pendingCancellations: 0,
    travelBookings: 0,
    hotelBookings: 0,
    totalUsers: 0,
    adminUsers: 0,
    roommateMatches: 0,
    unmatchedUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const supabase = createClient();

    // Fetch all stats in parallel
    const [
      registrations,
      rsvpYes,
      rsvpNo,
      rsvpPending,
      cancellations,
      travel,
      hotel,
      users,
      admins,
      matches,
    ] = await Promise.all([
      supabase.from('registrations').select('id', { count: 'exact', head: true }),
      supabase.from('registrations').select('id', { count: 'exact', head: true }).eq('rsvp_status', 'yes'),
      supabase.from('registrations').select('id', { count: 'exact', head: true }).eq('rsvp_status', 'no'),
      supabase.from('registrations').select('id', { count: 'exact', head: true }).eq('rsvp_status', 'pending'),
      supabase.from('cancellation_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('registrations').select('id', { count: 'exact', head: true }).eq('travel_needed', true),
      supabase.from('registrations').select('id', { count: 'exact', head: true }).eq('hotel_needed', true),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin'),
      supabase.from('roommate_matches').select('id', { count: 'exact', head: true }),
    ]);

    const matchedCount = (matches.count || 0) * 2; // Each match = 2 people
    const unmatchedCount = (hotel.count || 0) - matchedCount;

    setStats({
      totalRegistrations: registrations.count || 0,
      rsvpYes: rsvpYes.count || 0,
      rsvpNo: rsvpNo.count || 0,
      rsvpPending: rsvpPending.count || 0,
      pendingCancellations: cancellations.count || 0,
      travelBookings: travel.count || 0,
      hotelBookings: hotel.count || 0,
      totalUsers: users.count || 0,
      adminUsers: admins.count || 0,
      roommateMatches: matchedCount,
      unmatchedUsers: unmatchedCount > 0 ? unmatchedCount : 0,
    });

    setLoading(false);
  };

  const rsvpCompletionRate = stats.totalRegistrations > 0
    ? Math.round((stats.rsvpYes / stats.totalRegistrations) * 100)
    : 0;

  const roommateMatchRate = stats.hotelBookings > 0
    ? Math.round((stats.roommateMatches / stats.hotelBookings) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">ABC Summit 2025 Management</p>
        </div>

        {/* Primary Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>Total Registrations</CardDescription>
                <Users className="w-5 h-5 text-primary opacity-60" />
              </div>
              <CardTitle className="text-3xl">{stats.totalRegistrations}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 text-xs">
                <Badge variant="default">{stats.rsvpYes} Yes</Badge>
                <Badge variant="destructive">{stats.rsvpNo} No</Badge>
                <Badge variant="secondary">{stats.rsvpPending} Pending</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>Travel Bookings</CardDescription>
                <Plane className="w-5 h-5 text-blue-600 opacity-60" />
              </div>
              <CardTitle className="text-3xl text-blue-600">{stats.travelBookings}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600">
                {Math.round((stats.travelBookings / Math.max(stats.totalRegistrations, 1)) * 100)}% of attendees
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>Hotel Bookings</CardDescription>
                <Hotel className="w-5 h-5 text-green-600 opacity-60" />
              </div>
              <CardTitle className="text-3xl text-green-600">{stats.hotelBookings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <p className="text-xs text-gray-600">
                  {stats.roommateMatches} matched
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>Pending Actions</CardDescription>
                <Bell className="w-5 h-5 text-yellow-600 opacity-60" />
              </div>
              <CardTitle className="text-3xl text-yellow-600">
                {stats.pendingCancellations + stats.unmatchedUsers}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600">
                {stats.pendingCancellations} cancellations, {stats.unmatchedUsers} unmatched
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">RSVP Completion Rate</CardTitle>
              <CardDescription>Percentage of attendees who confirmed attendance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Confirmed Yes</span>
                <span className="font-semibold">{rsvpCompletionRate}%</span>
              </div>
              <Progress value={rsvpCompletionRate} className="h-2" />
              <p className="text-xs text-gray-600">
                {stats.rsvpYes} of {stats.totalRegistrations} registrations confirmed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Roommate Matching Progress</CardTitle>
              <CardDescription>Percentage of hotel guests matched with roommates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Matched</span>
                <span className="font-semibold">{roommateMatchRate}%</span>
              </div>
              <Progress value={roommateMatchRate} className="h-2" />
              <p className="text-xs text-gray-600">
                {stats.roommateMatches} of {stats.hotelBookings} guests matched
              </p>
              {stats.unmatchedUsers > 0 && (
                <Link href="/roommates">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Match {stats.unmatchedUsers} Remaining Users
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/exports" className="block">
                <Button className="w-full justify-start" variant="default">
                  <Download className="w-5 h-5 mr-3" />
                  Export Data
                </Button>
              </Link>

              <Link href="/notifications" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Bell className="w-5 h-5 mr-3" />
                  Send Notification
                </Button>
              </Link>

              <Link href="/registrations" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-5 h-5 mr-3" />
                  View All Registrations
                </Button>
              </Link>

              <Link href="/roommates" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <UserCheck className="w-5 h-5 mr-3" />
                  Manage Roommates
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="font-semibold">{stats.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Admin Users</span>
                <Badge variant="destructive">{stats.adminUsers}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Registrations</span>
                <span className="font-semibold">{stats.totalRegistrations}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Roommate Matches</span>
                <span className="font-semibold">{stats.roommateMatches / 2} pairs</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Banner */}
        {stats.unmatchedUsers > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Action Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-800 mb-3">
                There are {stats.unmatchedUsers} users who need hotel rooms but haven't been
                matched with roommates yet. Run the roommate matching algorithm to pair them
                automatically.
              </p>
              <Link href="/roommates">
                <Button variant="default">
                  Go to Roommate Management
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
