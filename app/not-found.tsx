import { Setting } from "@/@types/settings.types";
import { getSettings } from "@/actions/SettingsAction";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { handleResponse } from "@/utils/handle-response";
import { ArrowUpRightIcon, Ban } from "lucide-react";
import Link from "next/link";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Page Not Found | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "The page you are looking for does not exist.",
  };
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
