"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function UpdateUserLoader() {
  return (
    <form className="animate-pulse">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col space-y-2">
          <Skeleton as="span" className="h-5 w-1/4" />
          <Skeleton as="span" className="h-10 w-full rounded-md" />
        </div>

        <div className="flex flex-col space-y-2">
          <Skeleton as="span" className="h-5 w-1/4" />
          <Skeleton as="span" className="h-10 w-full rounded-md" />
        </div>

        <div className="flex flex-col space-y-2">
          <Skeleton as="span" className="h-5 w-1/4" />
          <Skeleton as="span" className="h-10 w-full rounded-md" />
        </div>

        <div className="flex flex-col space-y-2">
          <Skeleton as="span" className="h-5 w-1/4" />
          <Skeleton as="span" className="h-10 w-full rounded-md" />
        </div>

        <div className="flex flex-col space-y-2">
          <Skeleton as="span" className="h-5 w-1/4" />
          <Skeleton as="span" className="h-10 w-full rounded-md" />
        </div>

        <div className="flex flex-col space-y-2">
          <Skeleton as="span" className="h-5 w-1/4" />
          <Skeleton as="span" className="h-10 w-full rounded-md" />
        </div>

        <div className="flex flex-col space-y-2 col-span-2">
          <Skeleton as="span" className="h-5 w-1/4" />
          <Skeleton as="span" className="h-10 w-full rounded-md" />
        </div>

        <div className="col-span-2">
          <Skeleton as="span" className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </form>
  );
}
