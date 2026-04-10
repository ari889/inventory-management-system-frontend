import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import SupplierTable from "./_components/SupplierTable";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Suppliers | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage suppliers",
  };
};

const SuppliersPage = async () => {
  handleResponse(await checkPermission("menu-access"));
  return <SupplierTable />;
};

export default SuppliersPage;
