import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import CustomerReportTable from "./_components/CustomerReportTable";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Customer Report | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage customer report",
  };
};

const CustomerReportsPage = async () => {
  handleResponse(await checkPermission("customer-access"));
  return <CustomerReportTable />;
};

export default CustomerReportsPage;
