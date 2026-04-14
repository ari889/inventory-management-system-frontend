import { Setting } from "@/@types/settings.types";
import { getHrmSetting } from "@/actions/HrmSettingAction";
import { getSettings } from "@/actions/SettingsAction";
import { Card, CardContent } from "@/components/ui/card";
import { handleResponse } from "@/utils/handle-response";
import { CreditCard } from "lucide-react";
import CreateOrUpdateHRMSetting from "./_components/CreateOrUpdateHrmSetting";
import { HRMSetting } from "@/@types/hrm-settings.types";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `HRM Settings | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage HRM settings",
  };
};

const HRMSettingsPage = async () => {
  const { data } = handleResponse<HRMSetting>(await getHrmSetting());
  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow-sm">
        <CardContent>
          <div className="flex flex-row justify-between items-center my-3">
            <div className="flex flex-row justify-start items-center">
              <CreditCard className="mr-2 border rounded border-gray-300 p-2 w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">HRM Settings</h2>
                <h3 className="text-gray-500">
                  See and manage your HRM settings
                </h3>
              </div>
            </div>
          </div>
          <CreateOrUpdateHRMSetting data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default HRMSettingsPage;
