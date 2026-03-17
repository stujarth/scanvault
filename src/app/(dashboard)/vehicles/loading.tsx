import { Card, CardContent } from '@/components/ui/card';

export default function VehiclesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="h-10 w-80 bg-gray-100 rounded animate-pulse" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between">
                <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-10 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
