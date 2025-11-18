'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/database';
import { UserCog, ShieldCheck, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<'admin' | 'attendee'>('attendee');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data as Profile[]);
    }
    setLoading(false);
  };

  const handleRoleChange = (user: Profile) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    setUpdating(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', selectedUser.id);

    setUpdating(false);

    if (error) {
      alert('Error updating role: ' + error.message);
    } else {
      setDialogOpen(false);
      fetchUsers();
    }
  };

  const columns: Column<Profile>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.full_name}</div>
          {row.preferred_name && (
            <div className="text-xs text-gray-500">Preferred: {row.preferred_name}</div>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      sortable: true,
    },
    {
      id: 'job_title',
      header: 'Job Title',
      accessorKey: 'job_title',
      cell: (row) => row.job_title || 'N/A',
    },
    {
      id: 'department',
      header: 'Department',
      accessorKey: 'department',
      cell: (row) => row.department || 'N/A',
    },
    {
      id: 'center',
      header: 'Center',
      accessorKey: 'center_id',
      cell: (row) => row.center_id || 'N/A',
    },
    {
      id: 'market',
      header: 'Market',
      accessorKey: 'market',
      cell: (row) => row.market || 'N/A',
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
      cell: (row) => (
        <Badge variant={row.role === 'admin' ? 'destructive' : 'secondary'}>
          {row.role === 'admin' ? (
            <>
              <ShieldCheck className="h-3 w-3 mr-1" />
              Admin
            </>
          ) : (
            <>
              <Shield className="h-3 w-3 mr-1" />
              Attendee
            </>
          )}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: 'from_shanky',
      header: 'Source',
      cell: (row) => (
        <Badge variant={row.from_shanky ? 'default' : 'outline'}>
          {row.from_shanky ? 'Shanky' : 'Manual'}
        </Badge>
      ),
    },
    {
      id: 'created_at',
      header: 'Created',
      cell: (row) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRoleChange(row)}
        >
          <UserCog className="h-4 w-4 mr-1" />
          Change Role
        </Button>
      ),
    },
  ];

  const filters = [
    {
      id: 'role',
      label: 'Role',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'attendee', label: 'Attendee' },
      ],
    },
    {
      id: 'department',
      label: 'Department',
      options: [
        { value: 'Clinical', label: 'Clinical' },
        { value: 'Administrative', label: 'Administrative' },
        { value: 'Leadership', label: 'Leadership' },
        { value: 'Operations', label: 'Operations' },
        { value: 'Support', label: 'Support' },
      ],
    },
  ];

  const adminCount = users.filter(u => u.role === 'admin').length;
  const attendeeCount = users.filter(u => u.role === 'attendee').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage user profiles and admin permissions ({users.length} total users)
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
              </div>
              <UserCog className="w-12 h-12 text-primary opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Admins</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{adminCount}</p>
              </div>
              <ShieldCheck className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Attendees</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{attendeeCount}</p>
              </div>
              <Shield className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <DataTable
          columns={columns}
          data={users}
          searchPlaceholder="Search by name, email, or job title..."
          filters={filters}
          emptyMessage="No users found."
        />
      </div>

      {/* Role Change Dialog */}
      {selectedUser && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Update the role for {selectedUser.full_name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Current Role</Label>
                <p className="text-sm font-medium">
                  <Badge variant={selectedUser.role === 'admin' ? 'destructive' : 'secondary'}>
                    {selectedUser.role}
                  </Badge>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-role">New Role</Label>
                <Select value={newRole} onValueChange={(value: any) => setNewRole(value)}>
                  <SelectTrigger id="new-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attendee">Attendee</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newRole === 'admin' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
                  <strong>Warning:</strong> Admin users have full access to all system features
                  including user management, data exports, and configuration changes.
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRole} disabled={updating}>
                {updating ? 'Updating...' : 'Update Role'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
