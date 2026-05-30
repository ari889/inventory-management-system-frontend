import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import SupplierReportTable from "./_components/SupplierReportTable";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Supplier Report | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage supplier report",
  };
};

const SupplierReportsPage = async () => {
  handleResponse(await checkPermission("customer-access"));
  return <SupplierReportTable />;
};

export default SupplierReportsPage;
