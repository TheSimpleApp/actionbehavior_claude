'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RegistrationWithUser } from '@/types/database';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface RegistrationDetailDialogProps {
  registration: RegistrationWithUser;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function RegistrationDetailDialog({
  registration,
  open,
  onClose,
  onUpdate,
}: RegistrationDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(registration);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('registrations')
      .update({
        rsvp_status: formData.rsvp_status,
        travel_needed: formData.travel_needed,
        government_name: formData.government_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        personal_email: formData.personal_email,
        frequent_flyer_southwest: formData.frequent_flyer_southwest,
        frequent_flyer_american: formData.frequent_flyer_american,
        frequent_flyer_united: formData.frequent_flyer_united,
        flight_preference_1: formData.flight_preference_1,
        flight_preference_2: formData.flight_preference_2,
        hotel_needed: formData.hotel_needed,
        shirt_size: formData.shirt_size,
        meal_preference: formData.meal_preference,
        medical_accommodations: formData.medical_accommodations,
        medical_accommodations_note: formData.medical_accommodations_note,
        comments: formData.comments,
      })
      .eq('id', registration.id);

    setSaving(false);

    if (error) {
      alert('Error updating registration: ' + error.message);
    } else {
      setIsEditing(false);
      onUpdate();
    }
  };

  const handleCancel = () => {
    setFormData(registration);
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Registration Details</DialogTitle>
          <DialogDescription>
            {registration.user?.full_name} • {registration.user?.email}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="travel">Travel</TabsTrigger>
            <TabsTrigger value="hotel">Hotel</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <p className="text-sm text-gray-900 font-medium mt-1">
                  {registration.user?.full_name}
                </p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-sm text-gray-900 font-medium mt-1">
                  {registration.user?.email}
                </p>
              </div>
              <div>
                <Label>Job Title</Label>
                <p className="text-sm text-gray-900 font-medium mt-1">
                  {registration.user?.job_title || 'N/A'}
                </p>
              </div>
              <div>
                <Label>Department</Label>
                <p className="text-sm text-gray-900 font-medium mt-1">
                  {registration.user?.department || 'N/A'}
                </p>
              </div>
              <div>
                <Label>Center</Label>
                <p className="text-sm text-gray-900 font-medium mt-1">
                  {registration.user?.center_id || 'N/A'}
                </p>
              </div>
              <div>
                <Label>Market</Label>
                <p className="text-sm text-gray-900 font-medium mt-1">
                  {registration.user?.market || 'N/A'}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rsvp_status">RSVP Status</Label>
                {isEditing ? (
                  <Select
                    value={formData.rsvp_status}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, rsvp_status: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium mt-1">
                    <Badge
                      variant={
                        registration.rsvp_status === 'yes'
                          ? 'default'
                          : registration.rsvp_status === 'no'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {registration.rsvp_status}
                    </Badge>
                  </p>
                )}
              </div>
              <div>
                <Label>Registered At</Label>
                <p className="text-sm text-gray-900 font-medium mt-1">
                  {new Date(registration.registered_at).toLocaleString()}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Travel Tab */}
          <TabsContent value="travel" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="travel_needed"
                checked={isEditing ? formData.travel_needed : registration.travel_needed}
                onCheckedChange={(checked) =>
                  isEditing && setFormData({ ...formData, travel_needed: checked as boolean })
                }
                disabled={!isEditing}
              />
              <Label htmlFor="travel_needed" className="font-semibold">
                Travel Needed
              </Label>
            </div>

            {(isEditing ? formData.travel_needed : registration.travel_needed) && (
              <>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="government_name">Government Name (as on ID)</Label>
                    {isEditing ? (
                      <Input
                        id="government_name"
                        value={formData.government_name || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, government_name: e.target.value })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 font-medium mt-1">
                        {registration.government_name || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, date_of_birth: e.target.value })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 font-medium mt-1">
                        {registration.date_of_birth || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    {isEditing ? (
                      <Select
                        value={formData.gender || ''}
                        onValueChange={(value: any) =>
                          setFormData({ ...formData, gender: value })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-gray-900 font-medium mt-1">
                        {registration.gender || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="personal_email">Personal Email</Label>
                    {isEditing ? (
                      <Input
                        id="personal_email"
                        type="email"
                        value={formData.personal_email || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, personal_email: e.target.value })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 font-medium mt-1">
                        {registration.personal_email || 'N/A'}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />
                <h3 className="font-semibold">Frequent Flyer Numbers</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="ff_southwest">Southwest</Label>
                    {isEditing ? (
                      <Input
                        id="ff_southwest"
                        value={formData.frequent_flyer_southwest || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, frequent_flyer_southwest: e.target.value })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 font-medium mt-1">
                        {registration.frequent_flyer_southwest || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="ff_american">American</Label>
                    {isEditing ? (
                      <Input
                        id="ff_american"
                        value={formData.frequent_flyer_american || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, frequent_flyer_american: e.target.value })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 font-medium mt-1">
                        {registration.frequent_flyer_american || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="ff_united">United</Label>
                    {isEditing ? (
                      <Input
                        id="ff_united"
                        value={formData.frequent_flyer_united || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, frequent_flyer_united: e.target.value })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 font-medium mt-1">
                        {registration.frequent_flyer_united || 'N/A'}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />
                <h3 className="font-semibold">Flight Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="flight_pref_1">Preference 1</Label>
                    {isEditing ? (
                      <Input
                        id="flight_pref_1"
                        value={formData.flight_preference_1 || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, flight_preference_1: e.target.value })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 font-medium mt-1">
                        {registration.flight_preference_1 || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="flight_pref_2">Preference 2</Label>
                    {isEditing ? (
                      <Input
                        id="flight_pref_2"
                        value={formData.flight_preference_2 || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, flight_preference_2: e.target.value })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 font-medium mt-1">
                        {registration.flight_preference_2 || 'N/A'}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Hotel Tab */}
          <TabsContent value="hotel" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hotel_needed"
                checked={isEditing ? formData.hotel_needed : registration.hotel_needed}
                onCheckedChange={(checked) =>
                  isEditing && setFormData({ ...formData, hotel_needed: checked as boolean })
                }
                disabled={!isEditing}
              />
              <Label htmlFor="hotel_needed" className="font-semibold">
                Hotel Needed
              </Label>
            </div>

            {(isEditing ? formData.hotel_needed : registration.hotel_needed) && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  View the Roommates page to see pairing information.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shirt_size">Shirt Size</Label>
                {isEditing ? (
                  <Select
                    value={formData.shirt_size || ''}
                    onValueChange={(value) =>
                      setFormData({ ...formData, shirt_size: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XS">XS</SelectItem>
                      <SelectItem value="S">S</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="XL">XL</SelectItem>
                      <SelectItem value="XXL">XXL</SelectItem>
                      <SelectItem value="XXXL">XXXL</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-900 font-medium mt-1">
                    {registration.shirt_size || 'N/A'}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="meal_preference">Meal Preference</Label>
                {isEditing ? (
                  <Input
                    id="meal_preference"
                    value={formData.meal_preference || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, meal_preference: e.target.value })
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-gray-900 font-medium mt-1">
                    {registration.meal_preference || 'N/A'}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medical_accommodations"
                  checked={isEditing ? formData.medical_accommodations : registration.medical_accommodations}
                  onCheckedChange={(checked) =>
                    isEditing && setFormData({ ...formData, medical_accommodations: checked as boolean })
                  }
                  disabled={!isEditing}
                />
                <Label htmlFor="medical_accommodations" className="font-semibold">
                  Medical Accommodations Needed
                </Label>
              </div>

              {(isEditing ? formData.medical_accommodations : registration.medical_accommodations) && (
                <div>
                  <Label htmlFor="medical_note">Medical Note</Label>
                  {isEditing ? (
                    <Textarea
                      id="medical_note"
                      value={formData.medical_accommodations_note || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, medical_accommodations_note: e.target.value })
                      }
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded border">
                      {registration.medical_accommodations_note || 'N/A'}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Separator />

            <div>
              <Label htmlFor="comments">Additional Comments</Label>
              {isEditing ? (
                <Textarea
                  id="comments"
                  value={formData.comments || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, comments: e.target.value })
                  }
                  className="mt-1"
                  rows={4}
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded border">
                  {registration.comments || 'N/A'}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                Edit Registration
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
