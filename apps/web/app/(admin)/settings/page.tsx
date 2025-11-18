'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Save, Database, Calendar } from 'lucide-react';
import { Event } from '@/types/database';

export default function SettingsPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    start_date: '',
    end_date: '',
    registration_deadline: '',
    max_attendees: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
  });

  useEffect(() => {
    fetchEventSettings();
  }, []);

  const fetchEventSettings = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .limit(1)
      .single();

    if (data) {
      setEvent(data);
      setFormData({
        title: data.title,
        location: data.location || '',
        start_date: data.start_date?.split('T')[0] || '',
        end_date: data.end_date?.split('T')[0] || '',
        registration_deadline: data.registration_deadline?.split('T')[0] || '',
        max_attendees: data.max_attendees?.toString() || '',
        status: data.status,
      });
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!event) return;

    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('events')
      .update({
        title: formData.title,
        location: formData.location,
        start_date: formData.start_date,
        end_date: formData.end_date,
        registration_deadline: formData.registration_deadline,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        status: formData.status,
      })
      .eq('id', event.id);

    setSaving(false);

    if (error) {
      alert('Error updating settings: ' + error.message);
    } else {
      alert('Settings saved successfully!');
      fetchEventSettings();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure event settings and system preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Event Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Settings
              </CardTitle>
              <CardDescription>
                Configure the main event information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Gaylord Texan Resort, Grapevine, TX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration_deadline">Registration Deadline</Label>
                  <Input
                    id="registration_deadline"
                    type="date"
                    value={formData.registration_deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, registration_deadline: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_attendees">Max Attendees (optional)</Label>
                  <Input
                    id="max_attendees"
                    type="number"
                    value={formData.max_attendees}
                    onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                    placeholder="2500"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Event Status</Label>
                <div className="flex items-center gap-4">
                  {(['draft', 'published', 'archived'] as const).map((status) => (
                    <div key={status} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`status-${status}`}
                        name="status"
                        checked={formData.status === status}
                        onChange={() => setFormData({ ...formData, status })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor={`status-${status}`} className="capitalize cursor-pointer">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Draft events are only visible to admins. Published events are visible to all users.
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Event ID</Label>
                  <p className="font-mono text-sm mt-1">{event?.id || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Created At</Label>
                  <p className="text-sm mt-1">
                    {event ? new Date(event.created_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Last Updated</Label>
                  <p className="text-sm mt-1">
                    {event ? new Date(event.updated_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Database</Label>
                  <p className="text-sm mt-1">
                    <Badge variant="default">Supabase PostgreSQL</Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Flags */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Enable or disable specific features (Coming Soon)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Roommate Matching</Label>
                  <p className="text-sm text-gray-500">Allow users to select roommate preferences</p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Travel Bookings</Label>
                  <p className="text-sm text-gray-500">Collect travel and flight information</p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-500">Send push notifications to mobile app users</p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Check-in System</Label>
                  <p className="text-sm text-gray-500">QR code session check-ins (Coming soon)</p>
                </div>
                <Switch checked={false} disabled />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
