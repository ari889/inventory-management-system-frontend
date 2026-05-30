import { handleResponse } from "@/utils/handle-response";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardMinus } from "lucide-react";
import MonthlySalesReport from "./_components/MonthlySalesReport";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Monthly Sale Report | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage monthly sale report",
  };
};

const BalanceSheetPage = async () => {
  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow-sm">
        <CardContent>
          <div className="flex flex-row justify-between items-center my-3">
            <div className="flex flex-row justify-start items-center">
              <ClipboardMinus className="mr-2 border rounded border-gray-300 p-2 w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">Monthly Sale Report</h2>
                <h3 className="text-gray-500">Manage Monthly Sale Report</h3>
              </div>
            </div>
          </div>
          <MonthlySalesReport />
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceSheetPage;
