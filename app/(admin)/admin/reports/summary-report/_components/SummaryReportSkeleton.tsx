"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SummaryReportSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, row) => (
                <div key={row} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Warehouse Cards */}
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={`warehouse-${index}`}>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <Skeleton className="mx-auto h-10 w-36" />
              <Skeleton className="mx-auto mt-3 h-4 w-52" />
            </div>

            <div className="text-center">
              <Skeleton className="mx-auto h-10 w-36" />
              <Skeleton className="mx-auto mt-3 h-4 w-52" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
