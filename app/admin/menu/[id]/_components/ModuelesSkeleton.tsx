import { Skeleton } from "@/components/ui/skeleton";

export default function ModulesSkeleton() {
  return (
    <div className="flex flex-col space-y-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="h-15 flex items-stretch rounded-lg border border-gray-200 overflow-hidden"
        >
          <Skeleton className="w-10 shrink-0 rounded-none" />
          <Skeleton className="w-8 shrink-0 rounded-none opacity-60" />
          <div className="flex items-center gap-3 px-4 flex-1">
            <Skeleton className="h-3 w-36 rounded-full" />
            <div className="ml-auto flex items-center gap-1.5">
              <Skeleton className="h-5 w-14 rounded-md" />
              <Skeleton className="h-5 w-6 rounded-md" />
            </div>
          </div>
          <div className="w-px my-2 bg-gray-100 shrink-0" />
          <div className="flex items-center gap-1 px-2 shrink-0">
            <Skeleton className="h-7 w-14 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
