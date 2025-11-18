'use client';

import { useState } from 'react';
import { ExportButton } from '@/components/exports/ExportButton';
import {
  exportFullRegistrationData,
  exportRoommateSelections,
  exportRoommateMatches,
  exportFlightData,
  exportHotelData,
  exportCateringData,
} from '@/lib/exports/export-functions';

export default function ExportsPage() {
  const [exportHistory, setExportHistory] = useState<Array<{
    type: string;
    timestamp: Date;
    recordCount: number;
  }>>([]);

  const handleExport = async (
    exportFn: () => Promise<{ recordCount: number }>,
    type: string
  ) => {
    try {
      const result = await exportFn();
      setExportHistory([
        { type, timestamp: new Date(), recordCount: result.recordCount },
        ...exportHistory.slice(0, 9), // Keep last 10
      ]);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

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
          {/* Full Registration Export */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Full Registration Data
                </h2>
                <p className="text-gray-600 text-sm">
                  All registration fields including travel, hotel, and personal preferences
                </p>
              </div>
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                PRIORITY
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>• User profile information</p>
              <p>• RSVP status</p>
              <p>• Travel details (government name, DOB, gender, etc.)</p>
              <p>• Hotel needs</p>
              <p>• Personal preferences</p>
            </div>
            <ExportButton
              onClick={() => handleExport(exportFullRegistrationData, 'Full Registration')}
              label="Export Full Registration Data"
            />
          </div>

          {/* Roommate Selections Export */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Roommate Selections
                </h2>
                <p className="text-gray-600 text-sm">
                  All user roommate preferences (3 choices per person)
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>• User information</p>
              <p>• 1st, 2nd, 3rd choice roommates</p>
              <p>• Selection timestamps</p>
              <p>• Locked status</p>
            </div>
            <ExportButton
              onClick={() => handleExport(exportRoommateSelections, 'Roommate Selections')}
              label="Export Roommate Selections"
            />
          </div>

          {/* Roommate Matches Export */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Roommate Matches
                </h2>
                <p className="text-gray-600 text-sm">
                  Final roommate assignments (algorithm or admin)
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>• Matched pairs</p>
              <p>• Match scores</p>
              <p>• Match method (algorithm/admin)</p>
              <p>• Hotel information</p>
            </div>
            <ExportButton
              onClick={() => handleExport(exportRoommateMatches, 'Roommate Matches')}
              label="Export Roommate Matches"
            />
          </div>

          {/* Flight Data Export */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Flight Data
                </h2>
                <p className="text-gray-600 text-sm">
                  Formatted for airline booking and travel agent
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>• Government name (as on ID)</p>
              <p>• Date of birth</p>
              <p>• Gender</p>
              <p>• Personal email</p>
              <p>• Frequent flyer numbers</p>
              <p>• Flight preferences</p>
            </div>
            <ExportButton
              onClick={() => handleExport(exportFlightData, 'Flight Data')}
              label="Export Flight Data"
            />
          </div>

          {/* Hotel Data Export */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Hotel Data
                </h2>
                <p className="text-gray-600 text-sm">
                  Room assignments and confirmation numbers
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>• Attendee names</p>
              <p>• Roommate pairings</p>
              <p>• Hotel name</p>
              <p>• Confirmation numbers</p>
              <p>• Room numbers</p>
            </div>
            <ExportButton
              onClick={() => handleExport(exportHotelData, 'Hotel Data')}
              label="Export Hotel Data"
            />
          </div>

          {/* Catering Data Export */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Catering Data
                </h2>
                <p className="text-gray-600 text-sm">
                  Meal preferences and dietary restrictions
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>• Attendee names</p>
              <p>• Meal preferences</p>
              <p>• Dietary restrictions</p>
              <p>• Count summaries</p>
              <p>• Medical accommodations</p>
            </div>
            <ExportButton
              onClick={() => handleExport(exportCateringData, 'Catering Data')}
              label="Export Catering Data"
            />
          </div>
        </div>

        {/* Export History */}
        {exportHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Export History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Export Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Records
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exportHistory.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.type}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {item.timestamp.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {item.recordCount} records
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
