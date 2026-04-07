import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { Setting } from "@/@types/settings.types";
import { getSettings } from "@/actions/SettingsAction";
import WarehouseTable from "./_components/WarehouseTable";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Warehouses | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Manage your warehouses",
  };
};

const WarehousesPage = async () => {
  handleResponse(await checkPermission("warehouse-access"));
  return <WarehouseTable />;
};

export default WarehousesPage;
