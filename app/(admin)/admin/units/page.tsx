export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import UnitTable from "./_components/UnitTable";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Units | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage units",
  };
};

const UnitsPage = async () => {
  handleResponse(await checkPermission("menu-access"));
  return <UnitTable />;
};

export default UnitsPage;
