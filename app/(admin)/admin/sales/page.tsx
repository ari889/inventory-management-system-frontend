export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import SaleTable from "./_components/SaleTable";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Sale | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage sale",
  };
};

const SalePage = async () => {
  handleResponse(await checkPermission("sale-access"));
  return <SaleTable />;
};

export default SalePage;
