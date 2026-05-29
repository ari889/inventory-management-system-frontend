import { handleResponse } from "@/utils/handle-response";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import { getUser } from "@/actions/AuthAction";
import UpdateProfileForm from "./_components/UpdateProfileForm";
import { User } from "@/@types/user.types";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Profile | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage customers",
  };
};

const ProfilePage = async () => {
  const { data } = handleResponse<User>(await getUser());
  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow-sm">
        <CardContent>
          <div className="flex flex-row justify-between items-center my-3">
            <div className="flex flex-row justify-start items-center">
              <UserIcon className="mr-2 border rounded border-gray-300 p-2 w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">Update Profile</h2>
                <h3 className="text-gray-500">
                  Update and manage your profile
                </h3>
              </div>
            </div>
          </div>
          <UpdateProfileForm user={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
