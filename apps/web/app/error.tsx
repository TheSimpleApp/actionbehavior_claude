'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Something went wrong!</CardTitle>
          <CardDescription>
            We encountered an error while loading this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
              {error.message}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button onClick={reset} className="w-full">
              Try again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/')}
              className="w-full"
            >
              Go home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
