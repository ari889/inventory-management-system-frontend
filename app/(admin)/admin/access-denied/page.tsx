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
  title: "Access Denied | Inventory Management System",
  description: "You do not have permission to access this page.",
};

const AccessDeniedPage = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Ban />
        </EmptyMedia>
        <EmptyTitle>Access Denied</EmptyTitle>
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

export default AccessDeniedPage;
