'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RegistrationWithUser } from '@/types/database';
import { Eye, Download, Filter } from 'lucide-react';
import { RegistrationDetailDialog } from '@/components/admin/RegistrationDetailDialog';

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationWithUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        user:profiles(*)
      `)
      .order('registered_at', { ascending: false });

    if (error) {
      console.error('Error fetching registrations:', error);
    } else {
      setRegistrations(data as RegistrationWithUser[]);
    }
    setLoading(false);
  };

  const handleRowClick = (registration: RegistrationWithUser) => {
    setSelectedRegistration(registration);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRegistration(null);
  };

  const handleUpdate = () => {
    fetchRegistrations();
    handleDialogClose();
  };

  const columns: Column<RegistrationWithUser>[] = [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'user',
      cell: (row) => row.user?.full_name || 'N/A',
      sortable: true,
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'user',
      cell: (row) => row.user?.email || 'N/A',
      sortable: true,
    },
    {
      id: 'job_title',
      header: 'Job Title',
      accessorKey: 'user',
      cell: (row) => row.user?.job_title || 'N/A',
    },
    {
      id: 'center',
      header: 'Center',
      accessorKey: 'user',
      cell: (row) => row.user?.center_id || 'N/A',
    },
    {
      id: 'rsvp_status',
      header: 'RSVP',
      accessorKey: 'rsvp_status',
      cell: (row) => (
        <Badge
          variant={
            row.rsvp_status === 'yes'
              ? 'default'
              : row.rsvp_status === 'no'
              ? 'destructive'
              : 'secondary'
          }
        >
          {row.rsvp_status}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: 'travel',
      header: 'Travel',
      accessorKey: 'travel_needed',
      cell: (row) => (
        <Badge variant={row.travel_needed ? 'default' : 'outline'}>
          {row.travel_needed ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      id: 'hotel',
      header: 'Hotel',
      accessorKey: 'hotel_needed',
      cell: (row) => (
        <Badge variant={row.hotel_needed ? 'default' : 'outline'}>
          {row.hotel_needed ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      id: 'registered_at',
      header: 'Registered',
      accessorKey: 'registered_at',
      cell: (row) =>
        row.registered_at
          ? new Date(row.registered_at).toLocaleDateString()
          : 'N/A',
      sortable: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(row);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const filters = [
    {
      id: 'rsvp_status',
      label: 'RSVP Status',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'pending', label: 'Pending' },
      ],
    },
    {
      id: 'travel_needed',
      label: 'Travel',
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ],
    },
    {
      id: 'hotel_needed',
      label: 'Hotel',
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading registrations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Registrations</h1>
            <p className="text-gray-600 mt-2">
              Manage all event registrations ({registrations.length} total)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={registrations}
          searchPlaceholder="Search by name, email, or job title..."
          filters={filters}
          onRowClick={handleRowClick}
          emptyMessage="No registrations found."
          loading={loading}
        />
      </div>

      {selectedRegistration && (
        <RegistrationDetailDialog
          registration={selectedRegistration}
          open={dialogOpen}
          onClose={handleDialogClose}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
