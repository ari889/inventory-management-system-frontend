import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import SettingsForm from "./_components/SettingsForm";

export const metadata = {
  title: "Settings | Inventory Management System",
  description: "Manage your account settings",
};

const SettingsPage = () => {
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
          <SettingsForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
