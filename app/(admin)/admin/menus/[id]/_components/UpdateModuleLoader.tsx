import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const UpdateModuleLoader = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col justify-between space-y-3">
        <Skeleton as="span" className="h-5 w-1/4" />
        <Skeleton as="span" className="h-10 w-full" />
      </div>
      <div className="flex flex-col justify-between space-y-3">
        <Skeleton as="span" className="h-5 w-1/4" />
        <Skeleton as="span" className="h-10 w-full" />
      </div>
      <div className="flex flex-col justify-between space-y-3">
        <Skeleton as="span" className="h-5 w-1/4" />
        <Skeleton as="span" className="h-10 w-full" />
      </div>
      <div className="flex flex-col justify-between space-y-3">
        <Skeleton as="span" className="h-5 w-1/4" />
        <Skeleton as="span" className="h-10 w-full" />
      </div>
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
};

export default UpdateModuleLoader;
