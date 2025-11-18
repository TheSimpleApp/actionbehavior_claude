'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Send, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type NotificationCategory = 'important' | 'info' | 'fun' | 'emergency';

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<NotificationCategory>('info');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      alert('Please provide both a title and message');
      return;
    }

    if (!confirm(`Send notification to all attendees?\n\nTitle: ${title}\nMessage: ${message}`)) {
      return;
    }

    setSending(true);
    setSent(false);

    try {
      // In a real implementation, this would:
      // 1. Insert notification into database
      // 2. Send push notifications via FCM/APNs
      // 3. Track delivery status

      const supabase = createClient();

      // For now, we'll just log it
      // In production, you'd have a notifications table and a cloud function
      console.log('Sending notification:', { title, message, category });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSent(true);

      // Reset form
      setTimeout(() => {
        setTitle('');
        setMessage('');
        setCategory('info');
        setSent(false);
      }, 3000);
    } catch (error: any) {
      alert('Error sending notification: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const getCategoryColor = (cat: NotificationCategory) => {
    switch (cat) {
      case 'important':
        return 'bg-red-50 border-red-200';
      case 'emergency':
        return 'bg-red-100 border-red-300';
      case 'fun':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications & Announcements</h1>
          <p className="text-gray-600 mt-2">
            Send push notifications and announcements to all attendees
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send Notification Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Send Notification
              </CardTitle>
              <CardDescription>
                Notifications will be sent to all registered attendees via push notification
                and displayed in the mobile app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Event reminder, schedule change, etc."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={60}
                />
                <p className="text-xs text-gray-500">{title.length}/60 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Your announcement message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={300}
                />
                <p className="text-xs text-gray-500">{message.length}/300 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={category}
                  onValueChange={(value: NotificationCategory) => setCategory(value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Info</Badge>
                        <span className="text-xs text-gray-500">General information</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="important">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">Important</Badge>
                        <span className="text-xs text-gray-500">Requires attention</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="fun">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Fun</Badge>
                        <span className="text-xs text-gray-500">Social/entertainment</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="emergency">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-600">Emergency</Badge>
                        <span className="text-xs text-gray-500">Critical alert</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Preview */}
              {(title || message) && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className={`p-4 rounded-lg border-2 ${getCategoryColor(category)}`}>
                    <div className="flex items-start gap-3">
                      <Bell className="h-5 w-5 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{title || 'Notification Title'}</p>
                          <Badge
                            variant={
                              category === 'important' || category === 'emergency'
                                ? 'destructive'
                                : category === 'fun'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">
                          {message || 'Your message will appear here...'}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Just now</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleSend}
                  disabled={sending || !title.trim() || !message.trim()}
                  className="flex-1"
                >
                  {sending ? (
                    <>Sending...</>
                  ) : sent ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Sent!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send to All Attendees
                    </>
                  )}
                </Button>
                {(title || message) && !sending && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTitle('');
                      setMessage('');
                      setCategory('info');
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>

              {category === 'emergency' && (
                <div className="bg-red-100 border border-red-300 rounded p-3 text-sm text-red-800">
                  <strong>Warning:</strong> Emergency notifications cannot be turned off by users
                  and will alert all attendees immediately. Use only for critical situations.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guidelines Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold mb-1">Keep it concise</p>
                  <p className="text-gray-600">
                    Users receive notifications on their phones. Keep messages short and
                    actionable.
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold mb-1">Timing</p>
                  <p className="text-gray-600">
                    Avoid sending notifications during late night hours (10pm - 8am local time).
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold mb-1">Frequency</p>
                  <p className="text-gray-600">
                    Limit to 5 notifications per day to avoid alert fatigue.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Example Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="font-semibold text-blue-900">Session Starting Soon</p>
                  <p className="text-blue-800 mt-1">
                    Keynote begins in 15 minutes in the Main Ballroom. See you there!
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded border border-red-200">
                  <p className="font-semibold text-red-900">Room Change</p>
                  <p className="text-red-800 mt-1">
                    Track B session moved to Room 105 (was Room 102)
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <p className="font-semibold text-green-900">Happy Hour!</p>
                  <p className="text-green-800 mt-1">
                    Join us at the Poolside Terrace at 6pm for networking and refreshments
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
