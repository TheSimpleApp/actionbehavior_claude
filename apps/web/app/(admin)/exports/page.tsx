'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  exportFullRegistrationData,
  exportRoommateSelections,
  exportRoommateMatches,
  exportFlightData,
  exportHotelData,
  exportCateringData,
} from '@/lib/exports/export-functions';

interface ExportHistory {
  type: string;
  timestamp: Date;
  recordCount: number;
}

export default function ExportsPage() {
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);
  const [exportingType, setExportingType] = useState<string | null>(null);

  const handleExport = async (
    exportFn: () => Promise<{ recordCount: number }>,
    type: string
  ) => {
    setExportingType(type);
    try {
      const result = await exportFn();
      setExportHistory([
        { type, timestamp: new Date(), recordCount: result.recordCount },
        ...exportHistory.slice(0, 9), // Keep last 10
      ]);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExportingType(null);
    }
  };

  const exports = [
    {
      title: 'Full Registration Data',
      description: 'All registration fields including travel, hotel, and personal preferences',
      priority: true,
      fields: [
        'User profile information',
        'RSVP status',
        'Travel details (government name, DOB, gender, etc.)',
        'Hotel needs',
        'Personal preferences',
      ],
      handler: exportFullRegistrationData,
      type: 'Full Registration',
    },
    {
      title: 'Roommate Selections',
      description: 'All user roommate preferences (3 choices per person)',
      fields: [
        'User information',
        '1st, 2nd, 3rd choice roommates',
        'Selection timestamps',
        'Locked status',
      ],
      handler: exportRoommateSelections,
      type: 'Roommate Selections',
    },
    {
      title: 'Roommate Matches',
      description: 'Final roommate assignments (algorithm or admin)',
      fields: [
        'Matched pairs',
        'Match scores',
        'Match method (algorithm/admin)',
        'Hotel information',
      ],
      handler: exportRoommateMatches,
      type: 'Roommate Matches',
    },
    {
      title: 'Flight Data',
      description: 'Formatted for airline booking and travel agent',
      fields: [
        'Government name (as on ID)',
        'Date of birth',
        'Gender',
        'Personal email',
        'Frequent flyer numbers',
        'Flight preferences',
      ],
      handler: exportFlightData,
      type: 'Flight Data',
    },
    {
      title: 'Hotel Data',
      description: 'Room assignments and confirmation numbers',
      fields: [
        'Attendee names',
        'Roommate pairings',
        'Hotel name',
        'Confirmation numbers',
        'Room numbers',
      ],
      handler: exportHotelData,
      type: 'Hotel Data',
    },
    {
      title: 'Catering Data',
      description: 'Meal preferences and dietary restrictions',
      fields: [
        'Attendee names',
        'Meal preferences',
        'Dietary restrictions',
        'Count summaries',
        'Medical accommodations',
      ],
      handler: exportCateringData,
      type: 'Catering Data',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Data Exports</h1>
          <p className="text-gray-600 mt-2">
            Export registration and conference data to CSV files
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {exports.map((exportItem) => (
            <Card key={exportItem.type}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{exportItem.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {exportItem.description}
                    </CardDescription>
                  </div>
                  {exportItem.priority && (
                    <Badge variant="destructive">PRIORITY</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  {exportItem.fields.map((field, index) => (
                    <p key={index}>• {field}</p>
                  ))}
                </div>
                <Button
                  onClick={() => handleExport(exportItem.handler, exportItem.type)}
                  disabled={exportingType !== null}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {exportingType === exportItem.type
                    ? 'Exporting...'
                    : `Export ${exportItem.title}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Export History */}
        {exportHistory.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Export History</CardTitle>
              <CardDescription>Recent export operations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Export Type</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Records</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exportHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.type}</TableCell>
                      <TableCell>{item.timestamp.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.recordCount} records</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
