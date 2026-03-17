'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card className="max-w-lg mx-auto mt-12">
      <CardContent className="p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-orange-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-sm text-gray-500 mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <Button onClick={reset} className="bg-teal-600 hover:bg-teal-700">
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
