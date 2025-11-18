'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, FileText, Plane, Hotel, Download, Bell } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    pendingCancellations: 0,
    travelBookings: 0,
    hotelBookings: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      // Fetch stats in parallel
      const [registrations, cancellations, travel, hotel] = await Promise.all([
        supabase.from('registrations').select('id', { count: 'exact', head: true }),
        supabase.from('cancellation_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('registrations').select('id', { count: 'exact', head: true }).eq('travel_needed', true),
        supabase.from('registrations').select('id', { count: 'exact', head: true }).eq('hotel_needed', true),
      ]);

      setStats({
        totalRegistrations: registrations.count || 0,
        pendingCancellations: cancellations.count || 0,
        travelBookings: travel.count || 0,
        hotelBookings: hotel.count || 0,
      });
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">ABC Summit 2025 Management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Registrations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalRegistrations}
                </p>
              </div>
              <Users className="w-12 h-12 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Cancellations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.pendingCancellations}
                </p>
              </div>
              <FileText className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Travel Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.travelBookings}
                </p>
              </div>
              <Plane className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Hotel Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.hotelBookings}
                </p>
              </div>
              <Hotel className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/exports"
                className="flex items-center gap-3 p-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="w-5 h-5" />
                <span className="font-medium">Export Data</span>
              </Link>

              <button className="w-full flex items-center gap-3 p-3 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                <Bell className="w-5 h-5" />
                <span className="font-medium">Send Notification</span>
              </button>

              <Link
                href="/admin/registrations"
                className="flex items-center gap-3 p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">View Registrations</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="border-l-4 border-green-500 pl-3 py-2">
                <p className="text-sm font-medium">New Registration</p>
                <p className="text-xs text-gray-600">John Doe registered • 5 minutes ago</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-3 py-2">
                <p className="text-sm font-medium">Cancellation Request</p>
                <p className="text-xs text-gray-600">Jane Smith • 1 hour ago</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-3 py-2">
                <p className="text-sm font-medium">Data Export</p>
                <p className="text-xs text-gray-600">Full registration data • 2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
