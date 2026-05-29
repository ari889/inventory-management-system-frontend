import { handleResponse } from "@/utils/handle-response";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UpdatePasswordForm from "./_components/UpdatePasswordForm";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Privacy | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage privacy",
  };
};

const ProfilePage = async () => {
  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow-sm">
        <CardContent>
          <div className="flex flex-row justify-between items-center my-3">
            <div className="flex flex-row justify-start items-center">
              <UserIcon className="mr-2 border rounded border-gray-300 p-2 w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">Update Password</h2>
                <h3 className="text-gray-500">
                  Update and manage your password
                </h3>
              </div>
            </div>
            <Button type="button" asChild>
              <Link href="/admin/sales">
                <ArrowLeft />
                Back
              </Link>
            </Button>
          </div>
          <UpdatePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
