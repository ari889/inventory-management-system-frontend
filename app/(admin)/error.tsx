"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { RotateCcw, ShieldAlert } from "lucide-react";

const AdminError = ({
  error,
  reset,
}: {
  error: Error & { digset?: string };
  reset: () => void;
}) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShieldAlert />
        </EmptyMedia>
        <EmptyTitle className="text-red-600">Oops!</EmptyTitle>
        <EmptyDescription>
          {error?.message ?? "Something went wrong! Please try again."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button variant="destructive" onClick={reset}>
          <RotateCcw />
          Reload
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default AdminError;
