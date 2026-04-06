import { handleResponse } from "@/utils/handle-response";
import RoleTable from "./_components/RoleTable";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Roles | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage roles",
  };
};

const RolesPage = async () => {
  handleResponse(await checkPermission("menu-access"));
  return <RoleTable />;
};

export default RolesPage;
