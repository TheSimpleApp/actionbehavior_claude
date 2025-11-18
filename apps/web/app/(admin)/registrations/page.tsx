'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, CheckCircle, XCircle, Clock, Plane, Hotel } from 'lucide-react';
import type { Registration, Profile } from '@/../../packages/shared/types/database';

interface RegistrationWithUser extends Registration {
  user: Profile;
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationWithUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'yes' | 'no' | 'pending'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    const supabase = createClient();
    setLoading(true);

    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        user:profiles!user_id(*)
      `)
      .order('registered_at', { ascending: false });

    if (error) {
      console.error('Error fetching registrations:', error);
    } else {
      setRegistrations(data as RegistrationWithUser[] || []);
    }

    setLoading(false);
  }

  async function updateRsvpStatus(registrationId: string, newStatus: 'yes' | 'no' | 'pending') {
    const supabase = createClient();

    const { error } = await supabase
      .from('registrations')
      .update({ rsvp_status: newStatus })
      .eq('id', registrationId);

    if (error) {
      alert('Error updating RSVP status: ' + error.message);
    } else {
      fetchRegistrations();
    }
  }

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || reg.rsvp_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: registrations.length,
    confirmed: registrations.filter(r => r.rsvp_status === 'yes').length,
    declined: registrations.filter(r => r.rsvp_status === 'no').length,
    pending: registrations.filter(r => r.rsvp_status === 'pending').length,
    travelNeeded: registrations.filter(r => r.travel_needed).length,
    hotelNeeded: registrations.filter(r => r.hotel_needed).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Registration Management</h1>
          <p className="text-gray-600 mt-2">Manage event registrations and RSVPs</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
              <div className="text-xs text-gray-600">Confirmed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
              <div className="text-xs text-gray-600">Declined</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.travelNeeded}</div>
              <div className="text-xs text-gray-600">Travel</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{stats.hotelNeeded}</div>
              <div className="text-xs text-gray-600">Hotel</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={(value: 'all' | 'yes' | 'no' | 'pending') => setStatusFilter(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="yes">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="no">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Registrations Tabs */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Registrations</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="travel">Travel Needed</TabsTrigger>
            <TabsTrigger value="hotel">Hotel Needed</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Registrations ({filteredRegistrations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8 text-gray-500">Loading registrations...</p>
                ) : filteredRegistrations.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No registrations found</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Job Title</TableHead>
                        <TableHead>RSVP</TableHead>
                        <TableHead>Travel</TableHead>
                        <TableHead>Hotel</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRegistrations.map((reg) => (
                        <TableRow key={reg.id}>
                          <TableCell className="font-medium">{reg.user.full_name}</TableCell>
                          <TableCell>{reg.user.email}</TableCell>
                          <TableCell>{reg.user.job_title || '-'}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                reg.rsvp_status === 'yes' ? 'default' :
                                reg.rsvp_status === 'no' ? 'destructive' : 'secondary'
                              }
                            >
                              {reg.rsvp_status === 'yes' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {reg.rsvp_status === 'no' && <XCircle className="w-3 h-3 mr-1" />}
                              {reg.rsvp_status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                              {reg.rsvp_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {reg.travel_needed ? (
                              <Plane className="w-4 h-4 text-blue-600" />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {reg.hotel_needed ? (
                              <Hotel className="w-4 h-4 text-purple-600" />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(reg.registered_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={reg.rsvp_status}
                              onValueChange={(value: 'yes' | 'no' | 'pending') => updateRsvpStatus(reg.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Confirm</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="no">Decline</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="confirmed">
            <RegistrationList
              registrations={filteredRegistrations.filter(r => r.rsvp_status === 'yes')}
              loading={loading}
              onUpdateStatus={updateRsvpStatus}
            />
          </TabsContent>

          <TabsContent value="travel">
            <RegistrationList
              registrations={filteredRegistrations.filter(r => r.travel_needed)}
              loading={loading}
              onUpdateStatus={updateRsvpStatus}
            />
          </TabsContent>

          <TabsContent value="hotel">
            <RegistrationList
              registrations={filteredRegistrations.filter(r => r.hotel_needed)}
              loading={loading}
              onUpdateStatus={updateRsvpStatus}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function RegistrationList({
  registrations,
  loading,
  onUpdateStatus,
}: {
  registrations: RegistrationWithUser[];
  loading: boolean;
  onUpdateStatus: (id: string, status: 'yes' | 'no' | 'pending') => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtered Registrations ({registrations.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading...</p>
        ) : registrations.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No registrations found</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>RSVP</TableHead>
                <TableHead>Travel</TableHead>
                <TableHead>Hotel</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className="font-medium">{reg.user.full_name}</TableCell>
                  <TableCell>{reg.user.email}</TableCell>
                  <TableCell>
                    <Badge variant={reg.rsvp_status === 'yes' ? 'default' : reg.rsvp_status === 'no' ? 'destructive' : 'secondary'}>
                      {reg.rsvp_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{reg.travel_needed ? <Plane className="w-4 h-4 text-blue-600" /> : '-'}</TableCell>
                  <TableCell>{reg.hotel_needed ? <Hotel className="w-4 h-4 text-purple-600" /> : '-'}</TableCell>
                  <TableCell>{new Date(reg.registered_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
