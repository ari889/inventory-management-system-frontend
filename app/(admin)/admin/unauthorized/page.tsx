import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowUpRightIcon, Ban } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Unauthorized | Inventory Management System",
  description: "You do not have permission to access this page.",
};

const UnauthorizedPage = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Ban />
        </EmptyMedia>
        <EmptyTitle>Unauthorized access Blocked!</EmptyTitle>
        <EmptyDescription>
          You do not have permission to access this page. Please contact your
          administrator if you believe this is an error.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button asChild>
          <Link href="/admin/dashboard">
            <ArrowUpRightIcon className="mr-2" />
            Go to Dashboard
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default UnauthorizedPage;
