"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function MonthlyPurchaseReportSkeleton() {
  return (
    <div className="w-full rounded-lg border">
      <div className="flex items-center justify-between border-b p-4">
        <Button variant="outline" disabled>
          Previous
        </Button>

        <Skeleton className="h-7 w-24" />

        <Button variant="outline" disabled>
          Next
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-360">
          <div className="grid grid-cols-12 border-b">
            {MONTHS.map((month) => (
              <div
                key={month}
                className="flex justify-center border-r p-3 last:border-r-0"
              >
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-12">
            {MONTHS.map((_, index) => {
              const hasContent = index % 3 !== 0;

              return (
                <div
                  key={index}
                  className="min-h-55 border-r border-b p-3 last:border-r-0"
                >
                  {hasContent ? (
                    <div className="space-y-3">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-14" />

                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-16" />

                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-14" />

                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-16" />

                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Skeleton className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
