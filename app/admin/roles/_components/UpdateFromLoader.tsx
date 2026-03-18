import { Skeleton } from "@/components/ui/skeleton";

export default function UpdateFromLoader() {
  return (
    <div className="flex flex-col justify-between space-y-7">
      <div className="flex flex-col justify-between space-y-3">
        <Skeleton as="span" className="h-5 w-1/4" />
        <Skeleton as="span" className="h-10 w-full" />
      </div>
      <div className="flex flex-col justify-between space-y-3">
        <Skeleton as="span" className="h-5 w-1/4" />
        <Skeleton as="span" className="h-10 w-full" />
      </div>
    </div>
  );
}
