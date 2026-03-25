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
  title: "Page Not Found | Inventory Management System",
  description: "The page you are looking for does not exist.",
};

const NotFoundPage = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Ban />
        </EmptyMedia>
        <EmptyTitle>Requested page not found!</EmptyTitle>
        <EmptyDescription>
          The page you are looking for does not exist. Please check the URL or
          contact your administrator if you believe this is an error.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button asChild>
          <Link href="/admin/dashboard">
            <ArrowUpRightIcon className="mr-2" />
            Back to home
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default NotFoundPage;
