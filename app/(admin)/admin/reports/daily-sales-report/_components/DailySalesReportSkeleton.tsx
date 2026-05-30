import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DailySalesReportSkeleton = () => {
  return (
    <div className="w-full rounded-lg border">
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b p-4">
        <Button variant="outline" disabled>
          Previous
        </Button>

        <Skeleton className="h-7 w-40" />

        <Button variant="outline" disabled>
          Next
        </Button>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b">
        {DAYS.map((day) => (
          <div
            key={day}
            className="flex justify-center border-r p-3 last:border-r-0"
          >
            <Skeleton className="h-4 w-10" />
          </div>
        ))}
      </div>

      {/* Calendar Body */}
      <div className="grid grid-cols-7">
        {Array.from({ length: 42 }).map((_, index) => {
          const hasContent = index % 4 !== 0;

          return (
            <div
              key={index}
              className="h-32 border-r border-b p-2 last:border-r-0"
            >
              {/* Day Number */}
              <Skeleton className="mb-3 h-7 w-7 rounded-full" />

              {/* Sale Data */}
              {hasContent && (
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-14" />

                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />

                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailySalesReportSkeleton;
