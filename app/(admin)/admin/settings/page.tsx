import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import SettingsForm from "./_components/SettingsForm";
import { getSettings } from "@/actions/SettingsAction";
import { handleResponse } from "@/utils/handle-response";
import { Setting } from "@/@types/settings.types";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Settings | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Manage your account settings",
  };
};

const SettingsPage = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());

  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow-sm">
        <CardContent>
          <div className="flex flex-row justify-between items-center my-3">
            <div className="flex flex-row justify-start items-center">
              <Settings className="mr-2 border rounded border-gray-300 p-2 w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">Settings</h2>
                <h3 className="text-gray-500">Manage your account settings</h3>
              </div>
            </div>
          </div>
          <SettingsForm settings={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
